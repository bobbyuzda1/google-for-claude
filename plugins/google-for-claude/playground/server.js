const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PORT = 8764;

// Expand PATH to include common install locations
const expandedPath = [
  process.env.PATH,
  path.join(process.env.HOME, 'google-cloud-sdk/bin'),
  path.join(process.env.HOME, '.npm-global/bin'),
  path.join(process.env.HOME, '.local/bin'),
].join(':');

function run(cmd) {
  try {
    return execSync(cmd, { env: { ...process.env, PATH: expandedPath }, timeout: 10000 }).toString().trim();
  } catch { return null; }
}

function checkStatus() {
  const checks = {};

  // Node.js — just version check
  checks.node = run('node --version');

  // gcloud CLI — installed AND authenticated
  const gcloudInstalled = run('which gcloud');
  if (gcloudInstalled) {
    const activeAccount = run('gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>/dev/null');
    checks.gcloud = activeAccount && activeAccount.length > 0 ? activeAccount : false;
  } else {
    checks.gcloud = false;
  }

  // Gemini API key — must be set in environment or shell profile
  const keyFromEnv = process.env.GEMINI_API_KEY;
  const keyFromBashrc = run('bash -ic "echo \\$GEMINI_API_KEY" 2>/dev/null');
  const geminiKey = keyFromEnv || keyFromBashrc;
  if (geminiKey && geminiKey.length > 10) {
    // Validate the key actually works
    const testResult = run(`curl -s -o /dev/null -w "%{http_code}" "https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}"`);
    checks.gemini = testResult === '200' ? 'configured' : 'invalid-key';
  } else {
    checks.gemini = null;
  }

  // ADC — file must exist
  const adcPath = path.join(process.env.HOME, '.config/gcloud/application_default_credentials.json');
  checks.adc = fs.existsSync(adcPath);

  // Firebase — installed AND authenticated
  const fbVersion = run('npx firebase-tools --version 2>/dev/null');
  if (fbVersion) {
    // projects:list without --limit flag, check if it returns project data or auth error
    const fbProjects = run('npx firebase-tools projects:list 2>&1');
    checks.firebase = fbProjects && !fbProjects.includes('authenticate') && !fbProjects.includes('error:') ? fbVersion : false;
  } else {
    checks.firebase = null;
  }

  // Workspace CLI — installed AND authenticated
  const gwsInstalled = run('which gws');
  if (gwsInstalled) {
    // Get auth status to retrieve account email
    const gwsStatus = run('gws auth status 2>&1');
    if (gwsStatus && gwsStatus.includes('"token_valid": true')) {
      // Extract the user email from JSON output
      const userMatch = gwsStatus.match(/"user":\s*"([^"]+)"/);
      checks.gws = userMatch ? userMatch[1] : true;
    } else {
      checks.gws = false;
    }
  } else {
    checks.gws = false;
  }

  // NotebookLM — installed AND authenticated
  const nlmInstalled = run('which nlm');
  if (nlmInstalled) {
    // nlm login --check returns "Authentication valid!" with account info
    const nlmCheck = run('nlm login --check 2>&1');
    if (nlmCheck && nlmCheck.includes('Authentication valid')) {
      // Extract account email if present
      const accountMatch = nlmCheck.match(/Account:\s*([^\s]+)/);
      checks.notebooklm = accountMatch ? accountMatch[1] : true;
    } else {
      checks.notebooklm = false;
    }
  } else {
    checks.notebooklm = false;
  }

  // Python & uv — just installed checks (prerequisites, not services)
  checks.python = !!run('python3 --version');
  checks.uv = !!run('which uv');

  // Google Maps — always available (no auth needed), check if npx can find it
  checks.maps = true;

  // Preferences
  let prefs = null;
  try {
    const p = fs.readFileSync(path.join(process.env.HOME, '.config/gfc/preferences.json'), 'utf8');
    prefs = JSON.parse(p);
  } catch { prefs = null; }

  // GCP project
  const project = run('gcloud config get-value project 2>/dev/null');
  checks.project = project && project !== '(unset)' ? project : null;

  return { checks, prefs, timestamp: new Date().toISOString() };
}

const server = http.createServer((req, res) => {
  // CORS headers for all responses
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers);
    res.end();
    return;
  }

  if (req.url === '/api/status') {
    res.writeHead(200, headers);
    res.end(JSON.stringify(checkStatus()));
  } else if (req.url === '/api/refresh') {
    // Force a fresh check (same as status but explicitly named)
    res.writeHead(200, headers);
    res.end(JSON.stringify(checkStatus()));
  } else if (req.url === '/api/action' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { action, value } = JSON.parse(body);
        const actionFile = path.join(process.env.HOME, '.config/gfc/pending-action.json');
        fs.mkdirSync(path.dirname(actionFile), { recursive: true });
        fs.writeFileSync(actionFile, JSON.stringify({ action, value, timestamp: Date.now() }));
        res.writeHead(200, headers);
        res.end(JSON.stringify({ ok: true, message: `Action "${action}" queued. Return to Claude Code to proceed.` }));
      } catch (e) {
        res.writeHead(400, headers);
        res.end(JSON.stringify({ ok: false, error: e.message }));
      }
    });
  } else if (req.url === '/' || req.url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8'));
  } else if (req.url === '/logo-white.png') {
    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end(fs.readFileSync(path.join(__dirname, 'logo-white.png')));
  } else {
    res.writeHead(404, headers);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`GFC Playground running at http://localhost:${PORT}`);
  // Run initial status check on startup
  console.log('Initial status:', JSON.stringify(checkStatus(), null, 2));
});
