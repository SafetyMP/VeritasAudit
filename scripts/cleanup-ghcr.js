#!/usr/bin/env node

const https = require('https');
const readline = require('readline');

// GitHub API Host
const API_HOST = 'api.github.com';

function request(method, path, token, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: API_HOST,
      path: path,
      method: method,
      headers: {
        'User-Agent': 'FidusGate-Cleanup-Agent',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    };

    if (data) {
      options.headers['Content-Type'] = 'application/json';
    }

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body ? JSON.parse(body) : null);
        } else {
          reject(new Error(`API Error: ${res.statusCode} - ${body}`));
        }
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function main() {
  console.log('\n\x1b[95m⚖️  FidusGate: GitHub Packages Rebranding Cleanup Utility\x1b[0m');
  console.log('===========================================================');
  console.log('This utility helps you delete legacy "Veritas" or "VeritasAudit"');
  console.log('container images from the GitHub Container Registry (ghcr.io).\n');

  let token = process.env.GITHUB_TOKEN || process.env.GH_PAT;
  if (!token) {
    token = await ask('🔑 Enter GitHub Personal Access Token (classic) [requires delete:packages]: ');
    token = token.trim();
  }

  if (!token) {
    console.error('❌ Error: A Personal Access Token is required to authenticate with GitHub.');
    rl.close();
    process.exit(1);
  }

  let owner = await ask('👤 Enter Owner Name (GitHub Username or Organization name): ');
  owner = owner.trim();
  if (!owner) {
    console.error('❌ Error: Owner name is required.');
    rl.close();
    process.exit(1);
  }

  const isOrgInput = await ask('🏢 Is the owner an Organization? (y/N): ');
  const isOrg = isOrgInput.trim().toLowerCase() === 'y';

  const type = isOrg ? 'orgs' : 'users';
  console.log(`\n🔍 Fetching container packages for ${type}/${owner}...`);

  try {
    const packages = await request('GET', `/${type}/${owner}/packages?package_type=container`, token);
    
    // Filter packages matching 'veritas'
    const legacyPackages = packages.filter(pkg => 
      pkg.name.toLowerCase().includes('veritas') || 
      pkg.name.toLowerCase().includes('veritasaudit')
    );

    if (legacyPackages.length === 0) {
      console.log('\n✅ No legacy Veritas container packages found in your repository list.');
      rl.close();
      return;
    }

    console.log(`\n⚠️ Found ${legacyPackages.length} legacy package(s) on GitHub Packages:`);
    legacyPackages.forEach((pkg, index) => {
      console.log(`  [${index + 1}] ${pkg.name} (${pkg.html_url})`);
    });

    console.log('\n🚨 WARNING: Deleting these packages is permanent and cannot be undone.');
    const confirm = await ask(`Are you sure you want to delete all ${legacyPackages.length} legacy package(s)? (yes/NO): `);
    
    if (confirm.trim().toLowerCase() !== 'yes') {
      console.log('\n❌ Operation cancelled by user.');
      rl.close();
      return;
    }

    console.log('\n🗑️ Starting deletion sequence...');
    for (const pkg of legacyPackages) {
      const deletePath = `/${type}/${owner}/packages/container/${encodeURIComponent(pkg.name)}`;
      console.log(`  Deleting package: ${pkg.name}...`);
      try {
        await request('DELETE', deletePath, token);
        console.log(`  ✅ Successfully deleted ${pkg.name}`);
      } catch (err) {
        console.error(`  ❌ Failed to delete ${pkg.name}: ${err.message}`);
      }
    }

    console.log('\n🎉 Package cleanup operation completed.');
  } catch (err) {
    console.error(`\n❌ API Error: ${err.message}`);
    console.log('\nPlease make sure your token is valid and has "read:packages" and "delete:packages" scopes.');
  }

  rl.close();
}

main().catch(console.error);
