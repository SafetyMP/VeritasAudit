import express from 'express';
import cors from 'cors';
import { VeritasDatabase } from '@veritas/database';
import { verifyReceipt } from '@veritas/crypto-utils';
import { Transaction, AuditReceipt, SecurityFinding } from '@veritas/core-types';

const app = express();
const port = process.env.PORT || 3001;
const db = new VeritasDatabase();

app.use(cors());
app.use(express.json());

// Logger helper with security tagging
function log(level: 'info' | 'warn' | 'error' | 'security', message: string, meta?: any) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`, meta ? JSON.stringify(meta) : '');
}

// 1. GET /api/transactions - Retrieve list of transactions
app.get('/api/transactions', (req, res) => {
  try {
    const list = db.getTransactions();
    res.json(list);
  } catch (error) {
    log('error', 'Failed to retrieve transactions', error);
    res.status(500).json({ error: 'Failed to retrieve transactions' });
  }
});

// Helper to mask sensitive information (PII)
function maskPII(text: string): string {
  // Simple regex for email masking
  if (text.includes('@')) {
    const parts = text.split('@');
    const name = parts[0];
    const domain = parts[1];
    return `${name.substring(0, 1)}***@${domain.substring(0, 1)}***`;
  }
  
  // Simple regex for names
  const words = text.split(' ');
  if (words.length > 1) {
    return words.map(w => `${w.substring(0, 1)}***`).join(' ');
  }
  
  return `${text.substring(0, 2)}***`;
}

// 2. POST /api/transactions - Create a new transaction with automatic PII filtering
app.post('/api/transactions', (req, res) => {
  try {
    const { sender, recipient, amount, currency } = req.body;
    
    if (!sender || !recipient || amount === undefined || !currency) {
       res.status(400).json({ error: 'Missing required parameters: sender, recipient, amount, currency' });
       return;
    }
    
    // Automatic PII detection: Check if sender or recipient look like personal names or emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isSenderPii = emailRegex.test(sender) || sender.toLowerCase().includes(' wallet') || sender.split(' ').length > 2;
    const isRecipientPii = emailRegex.test(recipient) || recipient.toLowerCase().includes(' wallet') || recipient.split(' ').length > 2;
    const requiresMasking = isSenderPii || isRecipientPii;
    
    const processedSender = requiresMasking ? maskPII(sender) : sender;
    const processedRecipient = requiresMasking ? maskPII(recipient) : recipient;
    
    // Detect potentially suspicious Tor IPs or names and flag them automatically
    const isSuspicious = sender.toLowerCase().includes('tor') || recipient.toLowerCase().includes('tor') || amount > 1000000;
    const status = isSuspicious ? 'flagged' : 'completed';
    
    const newTx: Transaction = {
      id: `tx_${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString(),
      sender: processedSender,
      recipient: processedRecipient,
      amount: Number(amount),
      currency,
      status,
      maskedPii: requiresMasking
    };
    
    db.addTransaction(newTx);
    log('info', `Transaction registered successfully: ${newTx.id}`, { id: newTx.id, status });
    res.status(201).json(newTx);
  } catch (error) {
    log('error', 'Failed to create transaction', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// 3. GET /api/receipts - Retrieve list of signed audit receipts
app.get('/api/receipts', (req, res) => {
  try {
    const receipts = db.getAuditReceipts();
    res.json(receipts);
  } catch (error) {
    log('error', 'Failed to retrieve audit receipts', error);
    res.status(500).json({ error: 'Failed to retrieve receipts' });
  }
});

// 4. POST /api/receipts - Verify and record an Ed25519 signed receipt
app.post('/api/receipts', (req, res) => {
  try {
    const receipt: AuditReceipt = req.body;
    const { payload, signature } = receipt;
    
    if (!payload || !signature || !signature.sig || !signature.kid) {
       res.status(400).json({ error: 'Malformed receipt structure. Missing payload or signature.' });
       return;
    }
    
    // In our local governance system, protect-mcp uses the known signature keys configured in the system.
    // The gateway validates the signature cryptographically to ensure it hasn't been tampered with.
    // For local validation, we lookup the public key from the system config (or simulate it based on the kid).
    // Let's retrieve the public key associated with the kid.
    // We'll support two public keys: our main developer gateway key, and a general test key.
    // Default test key is used if no public key is explicitly passed.
    const PUBLIC_KEY_MAP: Record<string, string> = {
      'sb:issuer:de073ae64e43': '302a300506032b6570032100df20721389de78a2e10fc39c8942b0d07412ae89fd2b13c7809aef823101de83'
    };
    
    // Fallback: If not found, use signature.kid directly if it resembles a hex public key
    const publicKeyHex = PUBLIC_KEY_MAP[signature.kid] || signature.kid;
    
    const isValid = verifyReceipt(receipt, publicKeyHex);
    
    if (!isValid) {
      log('security', 'CRITICAL SECURITY ALERT: Tampered or invalid audit receipt signature detected!', {
        tool_name: payload.tool_name,
        kid: signature.kid
      });
       res.status(400).json({
        error: 'Invalid receipt signature. Verification failed. The audit trail may have been tampered with!',
        verified: false
      });
       return;
    }
    
    db.addAuditReceipt(receipt);
    log('security', `Cryptographically verified receipt logged: ${payload.tool_name} -> ${payload.decision}`, {
      tool_name: payload.tool_name,
      decision: payload.decision,
      kid: signature.kid
    });
    
    res.status(201).json({ message: 'Receipt verified and logged successfully', verified: true });
  } catch (error) {
    log('error', 'Failed to process receipt verification', error);
    res.status(500).json({ error: 'Failed to process receipt' });
  }
});

// 4b. POST /api/receipts/verify - Verify an Ed25519 signed receipt without storing it
app.post('/api/receipts/verify', (req, res) => {
  try {
    const receipt: AuditReceipt = req.body;
    const { payload, signature } = receipt;
    
    if (!payload || !signature || !signature.sig || !signature.kid) {
       res.status(400).json({ error: 'Malformed receipt structure. Missing payload or signature.' });
       return;
    }
    
    const PUBLIC_KEY_MAP: Record<string, string> = {
      'sb:issuer:de073ae64e43': '302a300506032b6570032100df20721389de78a2e10fc39c8942b0d07412ae89fd2b13c7809aef823101de83'
    };
    
    const publicKeyHex = PUBLIC_KEY_MAP[signature.kid] || signature.kid;
    const isValid = verifyReceipt(receipt, publicKeyHex);
    
    res.json({ verified: isValid });
  } catch (error) {
    log('error', 'Failed to perform standalone verification', error);
    res.status(500).json({ error: 'Failed to verify receipt' });
  }
});

// 5. GET /api/findings - Retrieve static analysis security findings
app.get('/api/findings', (req, res) => {
  try {
    const list = db.getFindings();
    res.json(list);
  } catch (error) {
    log('error', 'Failed to retrieve findings', error);
    res.status(500).json({ error: 'Failed to retrieve findings' });
  }
});

// 6. POST /api/findings - Push a set of static analysis findings (called by the auditor CI job)
app.post('/api/findings', (req, res) => {
  try {
    const findings: SecurityFinding[] = req.body;
    if (!Array.isArray(findings)) {
       res.status(400).json({ error: 'Invalid findings format. Expected a JSON array.' });
       return;
    }
    
    db.setFindings(findings);
    log('security', `CI Security Auditor reported ${findings.length} findings.`, { count: findings.length });
    res.json({ message: 'Findings updated successfully', count: findings.length });
  } catch (error) {
    log('error', 'Failed to update findings', error);
    res.status(500).json({ error: 'Failed to update findings' });
  }
});

// 7. POST /api/reset - Clear database to initial state
app.post('/api/reset', (req, res) => {
  try {
    db.clearDatabase();
    log('warn', 'Database reset to initial template state.');
    res.json({ message: 'Database reset successfully' });
  } catch (error) {
    log('error', 'Failed to reset database', error);
    res.status(500).json({ error: 'Failed to reset database' });
  }
});

app.listen(port, () => {
  log('info', `VeritasAudit Security Gateway API listening on port ${port}`);
});
