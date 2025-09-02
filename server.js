// server.js (hardened)
import http from 'http';
import fsp from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// ---------- Config ----------
const USERS_DIR = path.join(process.cwd(), 'users');
const BACKUP_DIR = path.join(process.cwd(), 'backup');
const MAX_JSON_BYTES = 20 * 1024 * 1024;   // 20 MB
const DATA_MAX_BYTES = 256 * 1024;         // cap for `data` field on register

// ---------- Utils ----------
const ensureDir = async (dir) => fsp.mkdir(dir, { recursive: true });
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
    const ct = req.headers['content-type'] || '';
    if (!ct.toLowerCase().includes('application/json')) {
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

// ---------- Server ----------
const server = http.createServer(async (req, res) => {
  try {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    await ensureDir(USERS_DIR);
    await ensureDir(BACKUP_DIR);

    // Safe pathname parse (no throwing)
    const urlStr = req.url || '/';
    const qpos = urlStr.indexOf('?');
    const pathname = qpos === -1 ? urlStr : urlStr.slice(0, qpos);

    // Health
    if (pathname === '/api/health' && req.method === 'GET') {
      return sendJson(res, 200, { ok: true });
    }

    // Register
    if (pathname === '/api/register' && req.method === 'POST') {
      try {
        const body = await readJson(req);

        const username = ((body.username ?? body.user) ?? '').toString().trim();
        const password = ((body.password ?? body.pass) ?? '').toString().trim();
        const data = body.data ?? {};

        if (!username || !password) {
          return sendJson(res, 400, { message: 'Missing username or password' });
        }
        if (username.length < 3 || password.length < 3) {
          return sendJson(res, 400, { message: 'Too short (min 3 chars)' });
        }
        if (!/^[\w.-]+$/.test(username)) {
          return sendJson(res, 400, { message: 'Invalid username' });
        }
        if (typeof data !== 'object' || Array.isArray(data)) {
          return sendJson(res, 400, { message: 'Invalid data object' });
        }

        // Optionally cap data size
        try {
          const dataSize = Buffer.byteLength(JSON.stringify(data), 'utf8');
          if (dataSize > DATA_MAX_BYTES) {
            return sendJson(res, 413, { message: 'Data too large' });
          }
        } catch {
          return sendJson(res, 400, { message: 'Invalid data' });
        }

        let existing = null;
        try {
          existing = await readUser(username);
        } catch (err) {
          if (err.code === 'INVALID_JSON' || err.message === 'INVALID_JSON') {
            return sendJson(res, 409, { message: 'Corrupted existing user data' });
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

        await writeUser(username, record);
        return sendJson(res, 201, { status: 'ok' });
      } catch (e) {
        if (e.code === 'UNSUPPORTED_MEDIA_TYPE') {
          return sendJson(res, 415, { message: 'Unsupported media type (expect application/json)' });
        }
        if (e.code === 'PAYLOAD_TOO_LARGE') {
          return sendJson(res, 413, { message: 'Payload too large' });
        }
        if (e.code === 'INVALID_JSON' || e.message === 'INVALID_JSON') {
          return sendJson(res, 400, { message: 'Invalid JSON' });
        }
        console.error('REGISTER error:', e);
        return sendJson(res, 400, { message: 'Invalid body' });
      }
    }

    // Login
    if (pathname === '/api/login' && req.method === 'POST') {
      try {
        const { username = '', password = '' } = await readJson(req);
        if (!username || !password) {
          return sendJson(res, 400, { message: 'Missing username or password' });
        }

        let user;
        try {
          user = await readUser(username);
        } catch (err) {
          if (err.code === 'INVALID_JSON') {
            return sendJson(res, 500, { message: 'Corrupted user data' });
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
        if (e.code === 'UNSUPPORTED_MEDIA_TYPE') {
          return sendJson(res, 415, { message: 'Unsupported media type (expect application/json)' });
        }
        if (e.code === 'PAYLOAD_TOO_LARGE') {
          return sendJson(res, 413, { message: 'Payload too large' });
        }
        if (e.code === 'INVALID_JSON' || e.message === 'INVALID_JSON') {
          return sendJson(res, 400, { message: 'Invalid JSON' });
        }
        console.error('LOGIN error:', e);
        return sendJson(res, 400, { message: 'Invalid body' });
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
    console.error('FATAL handler error:', fatal);
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
