import * as crypto from 'node:crypto';
import { AuditReceipt, AuditReceiptPayload } from '@veritas/core-types';

export interface KeyPair {
  publicKeyHex: string;
  privateKeyHex: string;
}

export function generateKeyPair(): KeyPair {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');
  return {
    publicKeyHex: publicKey.export({ type: 'spki', format: 'der' }).toString('hex'),
    privateKeyHex: privateKey.export({ type: 'pkcs8', format: 'der' }).toString('hex')
  };
}

export function signPayload(
  payload: AuditReceiptPayload,
  privateKeyHex: string,
  kid: string
): AuditReceipt {
  const privateKey = crypto.createPrivateKey({
    key: Buffer.from(privateKeyHex, 'hex'),
    format: 'der',
    type: 'pkcs8'
  });
  
  const data = Buffer.from(JSON.stringify(payload));
  const signatureBuffer = crypto.sign(null, data, privateKey);
  
  return {
    payload,
    signature: {
      alg: 'EdDSA',
      kid,
      sig: signatureBuffer.toString('hex')
    }
  };
}

export function verifyReceipt(receipt: AuditReceipt, publicKeyHex: string): boolean {
  try {
    const publicKey = crypto.createPublicKey({
      key: Buffer.from(publicKeyHex, 'hex'),
      format: 'der',
      type: 'spki'
    });
    
    const data = Buffer.from(JSON.stringify(receipt.payload));
    const signature = Buffer.from(receipt.signature.sig, 'hex');
    
    return crypto.verify(null, data, publicKey, signature);
  } catch (error) {
    return false;
  }
}

// ==========================================
// CLI Execution Handler (Offline verification/keygen)
// ==========================================
if (typeof require !== 'undefined' && require.main === module) {
  handleCli();
}

function handleCli() {
  const fs = require('fs');
  const path = require('path');
  const args = process.argv.slice(2);
  
  if (args[0] === '--verify' && args[1]) {
    try {
      const receiptPath = path.resolve(process.cwd(), args[1]);
      if (!fs.existsSync(receiptPath)) {
        console.error(`❌ Error: File not found at ${receiptPath}`);
        process.exit(1);
      }
      
      const receiptRaw = fs.readFileSync(receiptPath, 'utf8');
      const receipt = JSON.parse(receiptRaw) as AuditReceipt;
      
      let publicKeyHex = '';
      
      // Check if manual key provided
      if (args[2] === '--key' && args[3]) {
        publicKeyHex = args[3];
      } else {
        // Fallback to loading from protect-mcp.config.json at root
        const configPath = path.resolve(process.cwd(), 'protect-mcp.config.json');
        if (fs.existsSync(configPath)) {
          const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
          publicKeyHex = config.issuer.publicKey;
        }
      }
      
      if (!publicKeyHex) {
        console.error('❌ Error: Public key not specified and not found in protect-mcp.config.json.');
        process.exit(1);
      }
      
      const isValid = verifyReceipt(receipt, publicKeyHex);
      if (isValid) {
        console.log('✅ VALID RECEIPT: The cryptographic signature is mathematically valid.');
        console.log('🛡️  Verified Issuer ID:', receipt.signature.kid);
        console.log('🔧 Tool Evaluated     :', receipt.payload.tool_name);
        console.log('🛡️  Decision           :', receipt.payload.decision.toUpperCase());
        console.log('📝 Policy Digest      :', receipt.payload.policy_digest);
        if (receipt.payload.claimed_issuer_tier !== undefined) {
          console.log('🎖️  Issuer Tier        :', receipt.payload.claimed_issuer_tier);
        }
        console.log('⏰ Issued At          :', receipt.payload.issued_at);
        process.exit(0);
      } else {
        console.error('❌ INVALID RECEIPT: Signature verification failed!');
        process.exit(1);
      }
    } catch (err: any) {
      console.error('❌ Error running verification:', err.message);
      process.exit(1);
    }
  } else if (args[0] === '--generate-keys') {
    const keys = generateKeyPair();
    console.log('🔑 New Ed25519 Key Pair Generated:');
    console.log('--------------------------------------------------');
    console.log('Public Key (spki/der hex):');
    console.log(keys.publicKeyHex);
    console.log('--------------------------------------------------');
    console.log('Private Key (pkcs8/der hex):');
    console.log(keys.privateKeyHex);
    console.log('--------------------------------------------------');
    process.exit(0);
  } else {
    console.log('📖 VeritasAudit Cryptographic Utility CLI');
    console.log('Usage:');
    console.log('  node packages/crypto-utils/dist/index.js --verify <path_to_receipt_json> [--key <public_key_hex>]');
    console.log('  node packages/crypto-utils/dist/index.js --generate-keys');
    process.exit(0);
  }
}

