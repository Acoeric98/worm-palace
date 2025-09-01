import http from 'http';
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const USERS_DIR = path.join(process.cwd(), 'users');
const BACKUP_DIR = path.join(process.cwd(), 'backup');

const ensureDir = async (dir) => {
  await fsp.mkdir(dir, { recursive: true });
};

const getUserFile = (username) =>
  path.join(USERS_DIR, `${username}.json`);

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
  await fsp.writeFile(
    getUserFile(username),
    JSON.stringify(user, null, 2),
    'utf-8'
  );
};

const hashPassword = (password) =>
  crypto.createHash('sha256').update(password).digest('hex');

const collectBody = (req) =>
  new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => resolve(body));
  });

async function readJson(req, maxBytes = 1_000_000) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > maxBytes) {
        reject(new Error('Body too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        if (!data) return resolve({});
        resolve(JSON.parse(data));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  await ensureDir(USERS_DIR);
 
  if (req.url === '/api/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  if (req.url === '/api/register' && req.method === 'POST') {
    try {
      const body = await readJson(req);
      const username = ((body.username ?? body.user) ?? '').toString().trim();
      const password = ((body.password ?? body.pass) ?? '').toString().trim();
      const data = body.data ?? {};

      if (!username || !password) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Missing username or password' }));
        return;
      }

      if (username.length < 3 || password.length < 3) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Too short (min 3 chars)' }));
        return;
      }

      if (!/^[\w.-]+$/.test(username)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid username' }));
        return;
      }

      if (await readUser(username)) {
        res.writeHead(409, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User already exists' }));
        return;
      }

      const record = {
        passwordHash: hashPassword(password),
        data,
        createdAt: new Date().toISOString()
      };

      await writeUser(username, record);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok' }));
    } catch (e) {
      const msg = e && e.message ? e.message : 'Invalid body';
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({ message: msg === 'Invalid JSON' ? 'Invalid JSON' : 'Invalid body' })
      );
    }
    return;
  } else if (req.method === 'POST' && req.url === '/api/login') {
    try {
      const body = await collectBody(req);
      const { username, password } = JSON.parse(body);
      let user;
      try {
        user = await readUser(username);
      } catch (err) {
        if (err.code === 'INVALID_JSON') {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Corrupted user data' }));
          return;
        }
        throw err;
      }
      if (!user) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User not found' }));
        return;
      }
      if (user.passwordHash !== hashPassword(password)) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid credentials' }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user.data));
    } catch {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid body' }));
    }
  } else if (req.method === 'POST' && req.url === '/api/backup') {
    try {
      await ensureDir(BACKUP_DIR);
      const files = await fsp.readdir(USERS_DIR);
      await Promise.all(
        files
          .filter((f) => f.endsWith('.json'))
          .map((f) =>
            fsp.copyFile(
              path.join(USERS_DIR, f),
              path.join(BACKUP_DIR, f)
            )
          )
      );
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok' }));
    } catch {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Backup failed' }));
    }
  } else if (req.method === 'POST' && req.url === '/api/restore') {
    try {
      const files = await fsp.readdir(BACKUP_DIR);
      await ensureDir(USERS_DIR);
      await Promise.all(
        files
          .filter((f) => f.endsWith('.json'))
          .map((f) =>
            fsp.copyFile(
              path.join(BACKUP_DIR, f),
              path.join(USERS_DIR, f)
            )
          )
      );
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok' }));
    } catch {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Restore failed' }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not found' }));
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Auth server running on http://localhost:${PORT}`);
});

