// server.js (hardened + debug)
import http from 'http';
import fsp from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// ---------- Config ----------
const USERS_DIR = path.join(process.cwd(), 'users');
const BACKUP_DIR = path.join(process.cwd(), 'backup');
const MAX_JSON_BYTES = 20 * 1024 * 1024;   // 20 MB
const DATA_MAX_BYTES = 256 * 1024;         // cap for `data` field on register (tune or disable if needed)
const DEV_DEBUG_RESPONSES = true;          // include error code/details in JSON responses (good for development)
const USERNAME_REGEX = /^[A-Za-z0-9_]+$/;   // allowed characters for usernames

// ---------- Utils ----------
const ensureDir = async (dir) => {
  try {
    const st = await fsp.stat(dir).catch(() => null);
    if (!st) {
      await fsp.mkdir(dir, { recursive: true });
      return;
    }
    if (!st.isDirectory()) {
      const e = new Error('NOT_A_DIRECTORY');
      e.code = 'NOT_A_DIRECTORY';
      e.path = dir;
      throw e;
    }
  } catch (err) {
    console.error('ensureDir error for', dir, err && err.code, err && err.message);
    throw err;
  }
};

const getUserFile = (username) => path.join(USERS_DIR, `${username}.json`);

const readUser = async (username) => {
  try {
    const raw = await fsp.readFile(getUserFile(username), 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    if (err instanceof SyntaxError) {
      const e = new Error('INVALID_JSON');
      e.code = 'INVALID_JSON';
      throw e;
    }
    if (['EISDIR', 'EACCES', 'EPERM', 'ENOTDIR'].includes(err.code)) {
      const e = new Error('USER_DATA_INACCESSIBLE');
      e.code = 'USER_DATA_INACCESSIBLE';
      throw e;
    }
    throw err;
  }
};

const writeUser = async (username, user) => {
  await fsp.writeFile(getUserFile(username), JSON.stringify(user, null, 2), 'utf-8');
};

const hashPassword = (password) =>
  crypto.createHash('sha256').update(password).digest('hex');

const sendJson = (res, status, payload) => {
  if (res.writableEnded) return; // guard double-send
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
};

const readJson = (req, maxBytes = MAX_JSON_BYTES) =>
  new Promise((resolve, reject) => {
    const ct = (req.headers['content-type'] || '').toLowerCase();
    if (!ct.includes('application/json')) {
      const e = new Error('UNSUPPORTED_MEDIA_TYPE');
      e.code = 'UNSUPPORTED_MEDIA_TYPE';
      return reject(e);
    }

    let size = 0;
    const chunks = [];

    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        const e = new Error('PAYLOAD_TOO_LARGE');
        e.code = 'PAYLOAD_TOO_LARGE';
        reject(e);
        try { req.destroy(); } catch {}
        return;
      }
      chunks.push(chunk);
    });

    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8').trim();
        const data = raw ? JSON.parse(raw) : {};
        resolve(data);
      } catch {
        const e = new Error('INVALID_JSON');
        e.code = 'INVALID_JSON';
        reject(e);
      }
    });

    req.on('error', (e) => reject(e));
  });

const safePathname = (urlStr) => {
  const u = urlStr || '/';
  const q = u.indexOf('?');
  return q === -1 ? u : u.slice(0, q);
};

const debugPayload = (base, e) => {
  if (!DEV_DEBUG_RESPONSES) return base;
  const out = { ...base };
  if (e?.code) out.code = e.code;
  if (e?.message) out.detail = e.message;
  return out;
};

// ---------- Server ----------
const server = http.createServer(async (req, res) => {
  try {
    // Basic request log (dev)
    console.log('[REQ]', req.method, req.url);

    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    // Ensure storage exists (logically once per request; cheap enough)
    await ensureDir(USERS_DIR);
    await ensureDir(BACKUP_DIR);

    const pathname = safePathname(req.url);

    // Health
    if (pathname === '/api/health' && req.method === 'GET') {
      return sendJson(res, 200, { ok: true });
    }

    // Register
    if (pathname === '/api/register' && req.method === 'POST') {
      try {
        console.log('[REGISTER] start ct=', req.headers['content-type']);
        const body = await readJson(req);
        console.log('[REGISTER] body keys:', Object.keys(body || {}));

        const username = ((body.username ?? body.user) ?? '').toString().trim();
        const password = ((body.password ?? body.pass) ?? '').toString().trim();
        const data = body.data ?? {};

        console.log('[REGISTER] parsed username=', username, 'pwLen=', password.length, 'dataType=', typeof data);

        if (!username || !password) {
          return sendJson(res, 400, { message: 'Missing username or password' });
        }
        if (username.length < 3 || password.length < 3) {
          return sendJson(res, 400, { message: 'Too short (min 3 chars)' });
        }
        if (!USERNAME_REGEX.test(username)) {
          return sendJson(res, 400, { message: 'Invalid username' });
        }
        if (typeof data !== 'object' || Array.isArray(data)) {
          return sendJson(res, 400, { message: 'Invalid data object' });
        }

        // Optional cap (tune/disable as needed)
        let dataSize = 0;
        try {
          const s = JSON.stringify(data);
          dataSize = Buffer.byteLength(s, 'utf8');
        } catch (jerr) {
          console.error('[REGISTER] data stringify error:', jerr);
          return sendJson(res, 400, { message: 'Invalid data' });
        }
        console.log('[REGISTER] dataSize=', dataSize);
        if (dataSize > DATA_MAX_BYTES) {
          return sendJson(res, 413, { message: 'Data too large' });
        }

        let existing = null;
        try {
          existing = await readUser(username);
        } catch (err) {
          console.error('[REGISTER] readUser error:', err);
          if (err.code === 'INVALID_JSON' || err.message === 'INVALID_JSON') {
            return sendJson(res, 409, { message: 'Corrupted existing user data' });
          }
          if (err.code === 'USER_DATA_INACCESSIBLE') {
            return sendJson(res, 500, debugPayload({ message: 'User storage not accessible' }, err));
          }
          throw err;
        }
        if (existing) {
          return sendJson(res, 409, { message: 'User already exists' });
        }

        const record = {
          passwordHash: hashPassword(password),
          data,
          createdAt: new Date().toISOString(),
        };
        const filePath = getUserFile(username);
        console.log('[REGISTER] writing file:', filePath);

        try {
          await writeUser(username, record);
        } catch (werr) {
          console.error('[REGISTER] writeUser error:', werr);
          if (['EACCES','EPERM','EISDIR','ENOTDIR'].includes(werr.code)) {
            return sendJson(res, 500, debugPayload({ message: 'Failed to persist user' }, werr));
          }
          throw werr;
        }

        console.log('[REGISTER] done OK');
        return sendJson(res, 201, { status: 'ok' });
      } catch (e) {
        console.error('REGISTER CATCH:', e && e.stack || e);
        if (e.code === 'UNSUPPORTED_MEDIA_TYPE') {
          return sendJson(res, 415, debugPayload({ message: 'Unsupported media type (expect application/json)' }, e));
        }
        if (e.code === 'PAYLOAD_TOO_LARGE') {
          return sendJson(res, 413, debugPayload({ message: 'Payload too large' }, e));
        }
        if (e.code === 'INVALID_JSON' || e.message === 'INVALID_JSON') {
          return sendJson(res, 400, { message: 'Invalid JSON' });
        }
        // Unknown error → 400 with details (dev) or generic
        return sendJson(res, 400, debugPayload({ message: 'Invalid body' }, e));
      }
    }

    // Login
    if (pathname === '/api/login' && req.method === 'POST') {
      try {
        console.log('[LOGIN] start ct=', req.headers['content-type']);
        const body = await readJson(req);
        const username = (body.username ?? '').toString().trim();
        const password = (body.password ?? '').toString().trim();

        if (!username || !password) {
          return sendJson(res, 400, { message: 'Missing username or password' });
        }
        if (!USERNAME_REGEX.test(username)) {
          return sendJson(res, 400, { message: 'Invalid username' });
        }

        let user;
        try {
          user = await readUser(username);
        } catch (err) {
          console.error('[LOGIN] readUser error:', err);
          if (err.code === 'INVALID_JSON') {
            return sendJson(res, 500, { message: 'Corrupted user data' });
          }
          if (err.code === 'USER_DATA_INACCESSIBLE') {
            return sendJson(res, 500, debugPayload({ message: 'User storage not accessible' }, err));
          }
          throw err;
        }

        if (!user) {
          return sendJson(res, 404, { message: 'User not found' });
        }
        if (user.passwordHash !== hashPassword(password)) {
          return sendJson(res, 401, { message: 'Invalid credentials' });
        }

        return sendJson(res, 200, user.data);
      } catch (e) {
        console.error('LOGIN CATCH:', e && e.stack || e);
        if (e.code === 'UNSUPPORTED_MEDIA_TYPE') {
          return sendJson(res, 415, debugPayload({ message: 'Unsupported media type (expect application/json)' }, e));
        }
        if (e.code === 'PAYLOAD_TOO_LARGE') {
          return sendJson(res, 413, debugPayload({ message: 'Payload too large' }, e));
        }
        if (e.code === 'INVALID_JSON' || e.message === 'INVALID_JSON') {
          return sendJson(res, 400, { message: 'Invalid JSON' });
        }
        return sendJson(res, 400, debugPayload({ message: 'Invalid body' }, e));
      }
    }

    // Save user data
    if (pathname === '/api/save' && req.method === 'POST') {
      try {
        const body = await readJson(req);
        const username = (body.username ?? '').toString().trim();
        const password = (body.password ?? '').toString().trim();
        const data = body.data ?? {};

        if (!username || !password) {
          return sendJson(res, 400, { message: 'Missing username or password' });
        }
        if (!USERNAME_REGEX.test(username)) {
          return sendJson(res, 400, { message: 'Invalid username' });
        }

        let user;
        try {
          user = await readUser(username);
        } catch (err) {
          console.error('[SAVE] readUser error:', err);
          if (err.code === 'INVALID_JSON') {
            return sendJson(res, 500, { message: 'Corrupted user data' });
          }
          if (err.code === 'USER_DATA_INACCESSIBLE') {
            return sendJson(res, 500, debugPayload({ message: 'User storage not accessible' }, err));
          }
          throw err;
        }

        if (!user) {
          return sendJson(res, 404, { message: 'User not found' });
        }
        if (user.passwordHash !== hashPassword(password)) {
          return sendJson(res, 401, { message: 'Invalid credentials' });
        }

        if (typeof data !== 'object' || Array.isArray(data)) {
          return sendJson(res, 400, { message: 'Invalid data object' });
        }

        try {
          await writeUser(username, { passwordHash: user.passwordHash, data });
        } catch (werr) {
          console.error('[SAVE] writeUser error:', werr);
          return sendJson(res, 500, debugPayload({ message: 'Failed to persist user' }, werr));
        }

        return sendJson(res, 200, { status: 'ok' });
      } catch (e) {
        console.error('SAVE CATCH:', e && e.stack || e);
        if (e.code === 'UNSUPPORTED_MEDIA_TYPE') {
          return sendJson(res, 415, debugPayload({ message: 'Unsupported media type (expect application/json)' }, e));
        }
        if (e.code === 'PAYLOAD_TOO_LARGE') {
          return sendJson(res, 413, debugPayload({ message: 'Payload too large' }, e));
        }
        if (e.code === 'INVALID_JSON' || e.message === 'INVALID_JSON') {
          return sendJson(res, 400, { message: 'Invalid JSON' });
        }
        return sendJson(res, 400, debugPayload({ message: 'Invalid body' }, e));
      }
    }

    // Backup
    if (pathname === '/api/backup' && req.method === 'POST') {
      try {
        const files = await fsp.readdir(USERS_DIR);
        await Promise.all(
          files
            .filter((f) => f.endsWith('.json'))
            .map((f) => fsp.copyFile(path.join(USERS_DIR, f), path.join(BACKUP_DIR, f)))
        );
        return sendJson(res, 200, { status: 'ok' });
      } catch (e) {
        console.error('BACKUP error:', e);
        return sendJson(res, 500, { message: 'Backup failed' });
      }
    }

    // Restore
    if (pathname === '/api/restore' && req.method === 'POST') {
      try {
        const files = await fsp.readdir(BACKUP_DIR);
        await ensureDir(USERS_DIR);
        await Promise.all(
          files
            .filter((f) => f.endsWith('.json'))
            .map((f) => fsp.copyFile(path.join(BACKUP_DIR, f), path.join(USERS_DIR, f)))
        );
        return sendJson(res, 200, { status: 'ok' });
      } catch (e) {
        console.error('RESTORE error:', e);
        return sendJson(res, 500, { message: 'Restore failed' });
      }
    }

    // Not found
    return sendJson(res, 404, { message: 'Not found' });
  } catch (fatal) {
    // Catch any sync throw in the handler to avoid "empty reply"
    console.error('FATAL handler error:', fatal && fatal.stack || fatal);
    return sendJson(res, 500, { message: 'Internal server error' });
  }
});

// Global guards so the process keeps running and logs the stack:
process.on('uncaughtException', (err) => {
  console.error('uncaughtException:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('unhandledRejection:', reason);
});

// ---------- Boot ----------
const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Auth server running on http://localhost:${PORT}`);
});
