import http from 'http';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const USERS_DIR = path.join(process.cwd(), 'users');
const DATA_FILE = path.join(USERS_DIR, 'users.json');

if (!fs.existsSync(USERS_DIR)) {
  fs.mkdirSync(USERS_DIR);
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
}

const readUsers = () => {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
};

const writeUsers = (users) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
};

const hashPassword = (password) =>
  crypto.createHash('sha256').update(password).digest('hex');

const collectBody = (req, cb) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
  req.on('end', () => cb(body));
};

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/register') {
    collectBody(req, (body) => {
      try {
        const { username, password, data } = JSON.parse(body);
        const users = readUsers();
        if (users.find((u) => u.username === username)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'User exists' }));
          return;
        }
        const passwordHash = hashPassword(password);
        users.push({ username, passwordHash, data });
        writeUsers(users);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok' }));
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid body' }));
      }
    });
  } else if (req.method === 'POST' && req.url === '/api/login') {
    collectBody(req, (body) => {
      try {
        const { username, password } = JSON.parse(body);
        const users = readUsers();
        const user = users.find(
          (u) => u.username === username && u.passwordHash === hashPassword(password)
        );
        if (!user) {
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
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Auth server running on http://localhost:${PORT}`);
});

