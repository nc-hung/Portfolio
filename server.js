// Minimal zero-dependency static server for Railway.
// Serves ONLY the docs/ folder (the published site), so private folders
// like freelance-kit/ and info-cv/ are never exposed.
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'docs');
const PORT = process.env.PORT || 3000;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

function send(res, status, body, type) {
  res.writeHead(status, { 'Content-Type': type || 'text/plain; charset=utf-8' });
  res.end(body);
}

const server = http.createServer((req, res) => {
  let urlPath;
  try {
    urlPath = decodeURIComponent(req.url.split('?')[0]);
  } catch (e) {
    return send(res, 400, 'Bad request');
  }

  // Resolve and block path traversal outside ROOT.
  let filePath = path.normalize(path.join(ROOT, urlPath));
  if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) {
    return send(res, 403, 'Forbidden');
  }

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isDirectory()) filePath = path.join(filePath, 'index.html');
    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        // Fallback: treat the request as a directory index.
        const alt = path.join(path.normalize(path.join(ROOT, urlPath)), 'index.html');
        if (alt.startsWith(ROOT) && alt !== filePath) {
          return fs.readFile(alt, (e2, d2) => {
            if (e2) return send(res, 404, 'Not found');
            send(res, 200, d2, TYPES['.html']);
          });
        }
        return send(res, 404, 'Not found');
      }
      send(res, 200, data, TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream');
    });
  });
});

server.listen(PORT, () => console.log(`Static server for docs/ listening on ${PORT}`));
