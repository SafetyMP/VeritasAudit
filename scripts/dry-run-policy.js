#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const gatewayDir = path.resolve(process.cwd(), 'apps/secure-gateway');
const evaluatorPath = path.resolve(gatewayDir, 'dist/cedar-evaluator.js');
const policyPath = path.resolve(process.cwd(), 'policy.cedar');

// Ensure the compiled file exists
if (!fs.existsSync(evaluatorPath)) {
  console.log('⚙️  Compiling TypeScript files in apps/secure-gateway...');
  try {
    execSync('npm run build', { cwd: gatewayDir, stdio: 'pipe' });
  } catch (err) {
    console.error('❌ Failed to compile secure-gateway:', err.message);
    process.exit(1);
  }
}

// Load the evaluator
const { CedarEvaluator } = require(evaluatorPath);

// Parse arguments
const args = process.argv.slice(2);
let principal = 'sb:issuer:de073ae64e43';
let toolName = '';
let filePath = '';
let commandLine = '';

for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--principal=')) {
    principal = args[i].split('=')[1];
  } else if (args[i] === '--principal' && args[i+1]) {
    principal = args[i+1];
  } else if (args[i].startsWith('--tool=')) {
    toolName = args[i].split('=')[1];
  } else if (args[i] === '--tool' && args[i+1]) {
    toolName = args[i+1];
  } else if (args[i].startsWith('--path=')) {
    filePath = args[i].split('=')[1];
  } else if (args[i] === '--path' && args[i+1]) {
    filePath = args[i+1];
  } else if (args[i].startsWith('--cmd=')) {
    commandLine = args[i].split('=')[1];
  } else if (args[i] === '--cmd' && args[i+1]) {
    commandLine = args[i+1];
  }
}

if (!toolName) {
  console.log('📖 FidusGate Local Cedar Policy Dry-Run Utility');
  console.log('Usage:');
  console.log('  node scripts/dry-run-policy.js --principal <role> --tool <tool> [--path <file_path>] [--cmd <cmd>]');
  console.log('Examples:');
  console.log('  node scripts/dry-run-policy.js --principal sb:issuer:backend-sme --tool write_file --path packages/database/src/index.ts');
  console.log('  node scripts/dry-run-policy.js --principal sb:issuer:security-sme --tool write_file --path policy.cedar');
  console.log('  node scripts/dry-run-policy.js --principal sb:issuer:pm-sme --tool execute_command --cmd "git commit -m \'docs: update changelog\'"');
  process.exit(0);
}

if (!fs.existsSync(policyPath)) {
  console.error(`❌ Error: policy.cedar not found at ${policyPath}`);
  process.exit(1);
}

// Load default mock context states
const devopsState = loadState('.memory/devops-compliance-state.json', { pipelineVerified: true, securityAudited: true, hamChecked: true });
const ibpState = loadState('.memory/ibp-compliance-state.json', { crossFunctionalSynthesized: true, budgetAligned: true });
const plmState = loadState('.memory/plm-compliance-state.json', { activeRequirementId: 'REQ-300', associatedTestsWritten: true, hasApiDrift: false, driftVerified: true, releaseVersionUpdated: true, changelogUpdated: true, hasActiveFeedback: false, feedbackAligned: true });

function loadState(file, fallback) {
  const fullPath = path.resolve(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      // Normalize casing differences between state files and Cedar policy expectation
      return {
        pipeline_passed: parsed.pipelineVerified !== undefined ? parsed.pipelineVerified : parsed.pipeline_passed,
        security_audited: parsed.securityAudited !== undefined ? parsed.securityAudited : parsed.security_audited,
        ham_drift_checked: parsed.hamChecked !== undefined ? parsed.hamChecked : parsed.ham_drift_checked,
        cross_functional_synthesized: parsed.crossFunctionalSynthesized !== undefined ? parsed.crossFunctionalSynthesized : parsed.cross_functional_synthesized,
        budget_aligned: parsed.tokenBudget !== undefined ? (parsed.tokensConsumed <= parsed.tokenBudget) : (parsed.budget_aligned !== undefined ? parsed.budget_aligned : true),
        active_requirement_id: parsed.activeRequirementId !== undefined ? parsed.activeRequirementId : (parsed.active_requirement_id || ''),
        associated_tests_written: parsed.associatedTestsWritten !== undefined ? parsed.associatedTestsWritten : parsed.associated_tests_written,
        has_api_drift: parsed.hasApiDrift !== undefined ? parsed.hasApiDrift : parsed.has_api_drift,
        drift_verified: parsed.driftVerified !== undefined ? parsed.driftVerified : parsed.drift_verified,
        release_version_updated: parsed.releaseVersionUpdated !== undefined ? parsed.releaseVersionUpdated : parsed.release_version_updated,
        changelog_updated: parsed.changelogUpdated !== undefined ? parsed.changelogUpdated : parsed.changelog_updated,
        has_active_feedback: parsed.hasActiveFeedback !== undefined ? parsed.hasActiveFeedback : parsed.has_active_feedback,
        feedback_aligned: parsed.feedbackAligned !== undefined ? parsed.feedbackAligned : parsed.feedback_aligned
      };
    } catch (e) {}
  }
  return fallback;
}

const contextObj = {
  devops: devopsState,
  ibp: ibpState,
  plm: plmState
};

// Instantiate evaluator
const evaluator = new CedarEvaluator(policyPath);

console.log('⚖️  FidusGate Offline Policy Dry-Run Evaluation');
console.log('────────────────────────────────────────────────────────────────────────────────');
console.log(`👤 Principal: ${principal}`);
console.log(`🔧 Tool     : ${toolName}`);
if (filePath) console.log(`📁 Path     : ${filePath}`);
if (commandLine) console.log(`💻 Command  : ${commandLine}`);
console.log('────────────────────────────────────────────────────────────────────────────────');

const toolArgs = {};
if (filePath) toolArgs.path = filePath;
if (commandLine) toolArgs.commandLine = commandLine;

const result = evaluator.evaluateSimulator(principal, toolName, toolArgs, contextObj);

if (result.decision === 'allow') {
  console.log('✅ DECISION: ALLOW');
} else {
  console.log('❌ DECISION: DENY');
}
console.log(`📝 Reason  : ${result.reason}`);
console.log('────────────────────────────────────────────────────────────────────────────────');
