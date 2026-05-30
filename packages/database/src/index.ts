import * as fs from 'node:fs';
import * as path from 'node:path';
import { Transaction, AuditReceipt, SecurityFinding } from '@veritas/core-types';

const DATA_DIR = path.join(__dirname, '..', 'data');
const TX_FILE = path.join(DATA_DIR, 'transactions.json');
const RECEIPTS_FILE = path.join(DATA_DIR, 'receipts.json');
const FINDINGS_FILE = path.join(DATA_DIR, 'findings.json');

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_817293',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    sender: 'Acme Corp Corporate Account',
    recipient: 'GlobalTech Solutions LLC',
    amount: 150000.00,
    currency: 'USD',
    status: 'completed',
    maskedPii: false
  },
  {
    id: 'tx_928174',
    timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(), // 1.5 hours ago
    sender: 's***@a***.io',
    recipient: 'ModelAPI Inference Gateway',
    amount: 450.25,
    currency: 'USD',
    status: 'completed',
    maskedPii: true
  },
  {
    id: 'tx_039281',
    timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 mins ago
    sender: 'Unknown Tor Node IP: 185.220.101.5',
    recipient: 'SageHart Admin Wallet',
    amount: 50000.00,
    currency: 'EUR',
    status: 'flagged',
    maskedPii: false
  },
  {
    id: 'tx_129482',
    timestamp: new Date().toISOString(), // Just now
    sender: 'System Treasury Account',
    recipient: 'Cold Storage Ledger Vault',
    amount: 2000000.00,
    currency: 'USD',
    status: 'pending',
    maskedPii: false
  }
];

const INITIAL_RECEIPTS: AuditReceipt[] = [
  {
    payload: {
      type: 'protectmcp:decision',
      tool_name: 'read_file',
      decision: 'allow',
      policy_digest: 'sha256:8f413a9de010',
      issued_at: new Date(Date.now() - 3600000).toISOString(),
      issuer_id: 'sb:issuer:de073ae64e43',
      reason: 'Tier 1 low-risk file read auto-approved',
      claimed_issuer_tier: 1
    },
    signature: {
      alg: 'EdDSA',
      kid: 'sb:issuer:de073ae64e43',
      sig: 'df20721389de78a2e10fc39c8942b0d07412ae89fd2b13c7809aef823101de83'
    }
  },
  {
    payload: {
      type: 'protectmcp:decision',
      tool_name: 'write_file',
      decision: 'allow',
      policy_digest: 'sha256:8f413a9de010',
      issued_at: new Date(Date.now() - 1800000).toISOString(),
      issuer_id: 'sb:issuer:de073ae64e43',
      reason: 'Tier 2 file modification in approved src/ directory allowed',
      claimed_issuer_tier: 2
    },
    signature: {
      alg: 'EdDSA',
      kid: 'sb:issuer:de073ae64e43',
      sig: 'ab0721da8eefc89de2212bb456c071d0eef823ac89fd4321cde08fa110fc3a7d'
    }
  },
  {
    payload: {
      type: 'protectmcp:decision',
      tool_name: 'execute_command',
      decision: 'deny',
      policy_digest: 'sha256:8f413a9de010',
      issued_at: new Date(Date.now() - 900000).toISOString(),
      issuer_id: 'sb:issuer:de073ae64e43',
      reason: 'Tier 3 command execution blocked: skill-creator requires explicit manual verification',
      claimed_issuer_tier: 3
    },
    signature: {
      alg: 'EdDSA',
      kid: 'sb:issuer:de073ae64e43',
      sig: '8839deff02c1abef23c10fc39de42b89f81d11ce0d2b93cfde09ab82eefcaefd'
    }
  }
];

export class VeritasDatabase {
  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    
    if (!fs.existsSync(TX_FILE)) {
      fs.writeFileSync(TX_FILE, JSON.stringify(INITIAL_TRANSACTIONS, null, 2), 'utf-8');
    }
    
    if (!fs.existsSync(RECEIPTS_FILE)) {
      fs.writeFileSync(RECEIPTS_FILE, JSON.stringify(INITIAL_RECEIPTS, null, 2), 'utf-8');
    }
    
    if (!fs.existsSync(FINDINGS_FILE)) {
      fs.writeFileSync(FINDINGS_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  }

  public getTransactions(): Transaction[] {
    this.ensureInitialized();
    try {
      const data = fs.readFileSync(TX_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      return INITIAL_TRANSACTIONS;
    }
  }

  public addTransaction(tx: Transaction): void {
    this.ensureInitialized();
    const list = this.getTransactions();
    list.unshift(tx); // Add new at the beginning
    fs.writeFileSync(TX_FILE, JSON.stringify(list, null, 2), 'utf-8');
  }

  public getAuditReceipts(): AuditReceipt[] {
    this.ensureInitialized();
    try {
      const data = fs.readFileSync(RECEIPTS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      return INITIAL_RECEIPTS;
    }
  }

  public addAuditReceipt(receipt: AuditReceipt): void {
    this.ensureInitialized();
    const list = this.getAuditReceipts();
    list.unshift(receipt);
    fs.writeFileSync(RECEIPTS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  }

  public getFindings(): SecurityFinding[] {
    this.ensureInitialized();
    try {
      const data = fs.readFileSync(FINDINGS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }

  public setFindings(findings: SecurityFinding[]): void {
    this.ensureInitialized();
    fs.writeFileSync(FINDINGS_FILE, JSON.stringify(findings, null, 2), 'utf-8');
  }

  public addFinding(finding: SecurityFinding): void {
    this.ensureInitialized();
    const list = this.getFindings();
    list.push(finding);
    fs.writeFileSync(FINDINGS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  }

  public clearDatabase(): void {
    this.ensureInitialized();
    fs.writeFileSync(TX_FILE, JSON.stringify(INITIAL_TRANSACTIONS, null, 2), 'utf-8');
    fs.writeFileSync(RECEIPTS_FILE, JSON.stringify(INITIAL_RECEIPTS, null, 2), 'utf-8');
    fs.writeFileSync(FINDINGS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}
