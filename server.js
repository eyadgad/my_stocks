import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { fetchYahooPrice } from './scrapeYahoo.js';
import { PORTFOLIO_PATH, portfolioConfig } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

function serveStatic(req, res) {
  let urlPath = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  const filePath = path.join(__dirname, urlPath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mime[ext] || 'text/plain' });
    res.end(data);
  });
}

async function handleApi(req, res) {
  const u = new URL(req.url, 'http://localhost');
  if (u.pathname === '/api/quotes') {
    const tickers = u.searchParams.get('tickers');
    if (!tickers) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'tickers parameter required' }));
      return;
    }
    const list = tickers.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
    const results = {};
    await Promise.all(list.map(async t => {
      try {
        const q = await fetchYahooPrice(t, { maxTries: 1, timeoutMs: 6000 });
        results[t] = { price: q.price, source: q.source };
      } catch (e) {
        results[t] = { error: 'fetch_failed' };
      }
    }));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(results));
    return;
  }
  if (u.pathname === '/api/portfolio') {
    console.log(`Serving ${portfolioConfig.name}${portfolioConfig.isPersonal ? ' (personal data)' : ' (demo data)'}`);
    
    fs.readFile(PORTFOLIO_PATH, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'portfolio not found' }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(data);
    });
    return;
  }
  serveStatic(req, res);
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api/')) {
    handleApi(req, res);
  } else {
    serveStatic(req, res);
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
