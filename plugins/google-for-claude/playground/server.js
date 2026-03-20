const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PORT = 8764;

function checkStatus() {
  const checks = {};

  try { checks.node = execSync('node --version 2>/dev/null').toString().trim(); }
  catch { checks.node = null; }

  try { execSync('which gcloud 2>/dev/null'); checks.gcloud = true; }
  catch { checks.gcloud = false; }

  try {
    const key = process.env.GEMINI_API_KEY || execSync('bash -c "source ~/.bashrc 2>/dev/null; echo $GEMINI_API_KEY"').toString().trim();
    checks.gemini = key && key.length > 0 ? 'configured' : null;
  } catch { checks.gemini = null; }

  try {
    execSync('test -f ~/.config/gcloud/application_default_credentials.json');
    checks.adc = true;
  } catch { checks.adc = false; }

  try { checks.firebase = execSync('npx firebase-tools --version 2>/dev/null').toString().trim(); }
  catch { checks.firebase = null; }

  try { execSync('which gws 2>/dev/null || test -f ~/.npm-global/bin/gws'); checks.gws = true; }
  catch { checks.gws = false; }

  try { execSync('python3 --version 2>/dev/null'); checks.python = true; }
  catch { checks.python = false; }

  try { execSync('which uv 2>/dev/null || test -f ~/.local/bin/uv'); checks.uv = true; }
  catch { checks.uv = false; }

  try { execSync('which nlm 2>/dev/null || test -f ~/.local/bin/nlm'); checks.notebooklm = true; }
  catch { checks.notebooklm = false; }

  let prefs = null;
  try {
    const p = fs.readFileSync(path.join(process.env.HOME, '.config/gfc/preferences.json'), 'utf8');
    prefs = JSON.parse(p);
  } catch { prefs = null; }

  return { checks, prefs, timestamp: new Date().toISOString() };
}

const server = http.createServer((req, res) => {
  if (req.url === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify(checkStatus()));
  } else if (req.url === '/api/action' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { action, value } = JSON.parse(body);
        // Write action to file for Claude Code to pick up
        const actionFile = path.join(process.env.HOME, '.config/gfc/pending-action.json');
        fs.mkdirSync(path.dirname(actionFile), { recursive: true });
        fs.writeFileSync(actionFile, JSON.stringify({ action, value, timestamp: Date.now() }));
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ ok: true, message: `Action "${action}" queued. Return to Claude Code to proceed.` }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ ok: false, error: e.message }));
      }
    });
  } else if (req.url === '/' || req.url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8'));
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`GFC Playground running at http://localhost:${PORT}`);
});
