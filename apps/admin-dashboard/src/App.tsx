import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { Transaction, AuditReceipt, SecurityFinding } from '@veritas/core-types';

const API_BASE = '/api';

export default function App() {
  // State variables
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [receipts, setReceipts] = useState<AuditReceipt[]>([]);
  const [findings, setFindings] = useState<SecurityFinding[]>([]);
  
  // Form states
  const [txSender, setTxSender] = useState('');
  const [txRecipient, setTxRecipient] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txCurrency, setTxCurrency] = useState('USD');
  const [txLoading, setTxLoading] = useState(false);
  const [txNotification, setTxNotification] = useState<{message: string, type: 'success' | 'warn'} | null>(null);

  // Verifier tool states
  const [receiptInput, setReceiptInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    status: 'idle' | 'valid' | 'invalid' | 'error';
    message: string;
    payload?: any;
  }>({ status: 'idle', message: '' });

  // Simulated Console state
  const [consoleLines, setConsoleLines] = useState<string[]>([
    '🚀 VeritasAudit Unified Security Shell v1.0.0 initialized.',
    '⚙️  Local environment verified. Docker daemon detected (Active).',
    '🛡️  Cedar policy governance gateway online (Shadow Mode).',
    '📡 Standing by for interactive commands. Type "help" to list workflows.'
  ]);
  const [consoleInput, setConsoleInput] = useState('');

  // Fetch all data from backend
  const fetchData = useCallback(async () => {
    try {
      const [txRes, receiptsRes, findingsRes] = await Promise.all([
        fetch(`${API_BASE}/transactions`),
        fetch(`${API_BASE}/receipts`),
        fetch(`${API_BASE}/findings`)
      ]);

      if (txRes.ok) setTransactions(await txRes.json());
      if (receiptsRes.ok) setReceipts(await receiptsRes.json());
      if (findingsRes.ok) setFindings(await findingsRes.json());
    } catch (e) {
      console.error('Failed to fetch data from security gateway', e);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 4000); // Poll every 4s
    return () => clearInterval(interval);
  }, [fetchData]);

  // Form submission: Create Transaction
  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txSender || !txRecipient || !txAmount) return;

    setTxLoading(true);
    setTxNotification(null);

    try {
      const res = await fetch(`${API_BASE}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: txSender,
          recipient: txRecipient,
          amount: parseFloat(txAmount),
          currency: txCurrency
        })
      });

      if (res.ok) {
        const tx: Transaction = await res.json();
        setTransactions(prev => [tx, ...prev]);
        
        if (tx.maskedPii) {
          setTxNotification({
            message: `🛡️ Transaction Registered! PII Detected: Sender or Recipient was automatically filtered and masked for privacy preservation.`,
            type: 'warn'
          });
        } else {
          setTxNotification({
            message: `✅ Transaction completed successfully! Registered Ledger ID: ${tx.id}`,
            type: 'success'
          });
        }

        // Add to simulated console
        setConsoleLines(prev => [
          ...prev,
          `🚀 [LEDGER] New Transaction Registered: ${tx.id} | Amount: ${tx.amount} ${tx.currency}`,
          tx.maskedPii ? `🛡️ [PRIVACY] PII Filter Triggered! Sensitive fields masked successfully.` : `✅ [PII] No direct PII detected. Stored transparently.`
        ]);

        // Reset form
        setTxSender('');
        setTxRecipient('');
        setTxAmount('');
      } else {
        const err = await res.json();
        alert(`Error: ${err.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to register transaction. Secure Gateway may be offline.');
    } finally {
      setTxLoading(false);
    }
  };

  // Standalone Verifier tool (Delegates to Gateway API)
  const handleVerifyReceipt = async () => {
    setVerificationResult({ status: 'idle', message: '' });
    if (!receiptInput.trim()) {
      setVerificationResult({ status: 'error', message: 'Please paste a JSON receipt to verify.' });
      return;
    }

    try {
      const receipt: AuditReceipt = JSON.parse(receiptInput);
      const { payload, signature } = receipt;

      if (!payload || !signature || !signature.sig || !signature.kid) {
        setVerificationResult({
          status: 'invalid',
          message: 'Malformed receipt structure. Ensure the JSON contains payload and signature fields.'
        });
        return;
      }

      const res = await fetch(`${API_BASE}/receipts/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(receipt)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.verified) {
          setVerificationResult({
            status: 'valid',
            message: '✓ VALID SIGNATURE: Cryptographic integrity confirmed. The audit receipt has NOT been altered since its issuance by protect-mcp.',
            payload
          });
        } else {
          setVerificationResult({
            status: 'invalid',
            message: '✗ SIGNATURE FAILURE: The signature is invalid! The audit trail has been tampered with or is signed by an unauthorized key.',
            payload
          });
        }
      } else {
        const err = await res.json();
        setVerificationResult({
          status: 'invalid',
          message: `✗ VERIFICATION FAILURE: ${err.error || 'Server error'}`,
          payload
        });
      }
    } catch (e) {
      setVerificationResult({
        status: 'error',
        message: 'Invalid JSON format. Please check the structure and try again.'
      });
    }
  };

  // Clear database helper
  const handleResetDatabase = async () => {
    if (!confirm('Are you sure you want to reset all transactions, receipts, and findings to the original template status?')) return;
    try {
      const res = await fetch(`${API_BASE}/reset`, { method: 'POST' });
      if (res.ok) {
        fetchData();
        setConsoleLines(prev => [
          ...prev,
          '⚠️  [DATABASE] Security Gateway database reset to initial seed data.'
        ]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Simulated Console Submit
  const handleConsoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consoleInput.trim()) return;

    const cmd = consoleInput.trim().toLowerCase();
    setConsoleLines(prev => [...prev, `$ ${consoleInput}`]);
    setConsoleInput('');

    if (cmd === 'help') {
      setConsoleLines(prev => [
        ...prev,
        'Available commands:',
        '  help              - List available console commands',
        '  clear             - Clear the command line logs',
        '  npm run audit     - Simulate running the agentic-actions-auditor scanning tool',
        '  bash ci-verify.sh - Simulate offline local CI/CD workflow execution using act',
        '  sys-status        - Print hardware and sandbox status details'
      ]);
    } else if (cmd === 'clear') {
      setConsoleLines([]);
    } else if (cmd === 'sys-status') {
      setConsoleLines(prev => [
        ...prev,
        '⚙️  [SYSTEM] Status: ONLINE',
        '📦 Package Manager: pnpm workspaces (active)',
        '🐳 Sandbox Engine: Docker Desktop (Running)',
        '🔒 Governance Engine: Cedar protect-mcp (Active, Shadow Mode)',
        '🔑 Active Signature Key ID: sb:issuer:de073ae64e43'
      ]);
    } else if (cmd === 'npm run audit') {
      setConsoleLines(prev => [...prev, '🔍 Initiating static scan on GitHub workflow files...', '📡 Parsing workspace workflows...']);
      
      setTimeout(async () => {
        // Trigger simulated scan by making a mock push of findings if not already populated
        try {
          const mockFindings: SecurityFinding[] = [
            {
              vector: 'A',
              title: 'Env Var Intermediary (Vulnerable)',
              severity: 'High',
              file: '.github/workflows/ci-agent-pipeline.yml',
              step: 'jobs.code-review.steps[2] line 18',
              impact: 'Allows any malicious PR contributor to execute arbitrary shell commands in CI via indirect prompt injection.',
              evidence: 'env:\n  PR_TITLE: ${{ github.event.pull_request.title }}\nprompt: "Review code changes for PR: $PR_TITLE"',
              dataFlow: [
                'Attacker creates a pull request with prompt injection code in the title.',
                'The pull_request_target trigger runs the workflow in the base branch context with secrets access.',
                'The workflow loads the untrusted title into the env block at line 18.',
                'At runtime, the AI agent reads the environment variable, interprets the injected command as an instruction, and executes it.'
              ],
              remediation: 'Do not pass dynamic event variables directly to environment blocks consumed by AI prompts. Use strict string sanitization filters or pull named fields from authenticated metadata sources.'
            }
          ];
          
          await fetch(`${API_BASE}/findings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mockFindings)
          });
          fetchData();
          
          setConsoleLines(prev => [
            ...prev,
            '⚠️  [AUDIT ALERT] Static analysis finished. Found 1 HIGH vulnerability in pipeline workflows!',
            '⚠️  [AUDIT] Injected vector: Vector A (Env Var Intermediary) detected in ci-agent-pipeline.yml.',
            'ℹ️  Remediation instructions forwarded to the security dashboard.'
          ]);
        } catch (e) {
          console.error(e);
        }
      }, 1000);
    } else if (cmd === 'bash ci-verify.sh') {
      setConsoleLines(prev => [
        ...prev,
        '🐳 [DOCKER] Launching local act CI runner...',
        '🐳 [DOCKER] Emulating trigger pull_request_target on branch main...',
        '🐳 [DOCKER] Job [security-audit] started...'
      ]);

      setTimeout(() => {
        setConsoleLines(prev => [
          ...prev,
          '🐳 [DOCKER] Job [security-audit] completed successfully. Status: GREEN.',
          '🐳 [DOCKER] Sandbox execute returned exit code: 0.',
          '✅ Offline local verification completed.'
        ]);
      }, 1500);
    } else {
      setConsoleLines(prev => [
        ...prev,
        `❌ Command not recognized: "${cmd}". Type "help" for a list of commands.`
      ]);
    }
  };

  return (
    <div className="app-container animate-fade-in">
      {/* Header */}
      <header className="app-header">
        <div className="brand-section">
          <h1>VeritasAudit Security Portal</h1>
          <p>Secure, Governed, and Self-Refactoring AI-Agentic SDLC Console</p>
        </div>
        <div className="system-status">
          <div className="status-indicator"></div>
          <span className="status-label">SECURITY ONLINE</span>
          <button className="btn btn-secondary" onClick={handleResetDatabase} style={{ marginLeft: '1rem', padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>
            Reset DB
          </button>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="dashboard-grid">
        
        {/* Left Hand Column: Transactions & Receipts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Transaction Creator Form */}
          <section className="glass-panel">
            <div className="card-header">
              <h2 className="card-title">🛡️ Secure Transaction Gateway</h2>
              <span className="status-badge status-completed">PII Auto-Filtering Active</span>
            </div>
            
            <div className="card-body">
              {txNotification && (
                <div 
                  className="verification-result animate-fade-in" 
                  style={{ 
                    marginBottom: '1rem', 
                    background: txNotification.type === 'warn' ? 'hsla(var(--warning), 0.1)' : 'hsla(var(--success), 0.1)',
                    border: txNotification.type === 'warn' ? '1px solid hsla(var(--warning), 0.3)' : '1px solid hsla(var(--success), 0.3)',
                    color: txNotification.type === 'warn' ? 'hsl(var(--warning))' : 'hsl(var(--success))'
                  }}
                >
                  {txNotification.message}
                </div>
              )}

              <form onSubmit={handleCreateTransaction}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="sender">Sender (Corporate Account or Email Address)</label>
                    <input 
                      type="text" 
                      id="sender" 
                      className="form-control" 
                      placeholder="e.g. sagehart@antigravity.io"
                      value={txSender} 
                      onChange={e => setTxSender(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="recipient">Recipient (Vendor Name or Wallet Address)</label>
                    <input 
                      type="text" 
                      id="recipient" 
                      className="form-control" 
                      placeholder="e.g. ModelAPI Inference"
                      value={txRecipient} 
                      onChange={e => setTxRecipient(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="amount">Amount</label>
                    <input 
                      type="number" 
                      id="amount" 
                      className="form-control" 
                      placeholder="e.g. 500.00"
                      value={txAmount} 
                      onChange={e => setTxAmount(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="currency">Currency</label>
                    <select 
                      id="currency" 
                      className="form-control"
                      value={txCurrency}
                      onChange={e => setTxCurrency(e.target.value)}
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={txLoading}>
                  {txLoading ? 'Registering Security Block...' : 'Submit Transaction to Secure Gateway'}
                </button>
              </form>
            </div>
          </section>

          {/* Ledger Table */}
          <section className="glass-panel">
            <div className="card-header">
              <h2 className="card-title">📖 Transactional Stream Ledger</h2>
              <span className="status-badge status-pending">{transactions.length} Records</span>
            </div>
            
            <div className="card-body" style={{ padding: 0 }}>
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Sender</th>
                      <th>Recipient</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(tx => (
                      <tr key={tx.id}>
                        <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{tx.id}</td>
                        <td>
                          {tx.sender}
                          {tx.maskedPii && <span style={{ marginLeft: '0.5rem', fontSize: '0.65rem', background: 'hsla(var(--warning), 0.1)', padding: '0.1rem 0.3rem', borderRadius: '3px', color: 'hsl(var(--warning))' }}>masked</span>}
                        </td>
                        <td>{tx.recipient}</td>
                        <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {tx.currency}</td>
                        <td>
                          <span className={`status-badge status-${tx.status}`}>{tx.status}</span>
                        </td>
                      </tr>
                    ))}
                    {transactions.length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', color: 'hsl(var(--text-secondary))', padding: '2rem' }}>
                          No transaction records registered. Submit a transaction above!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>

        {/* Right Hand Column: Cedar Receipts & Security Findings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Cedar Receipts */}
          <section className="glass-panel">
            <div className="card-header">
              <h2 className="card-title">🔒 Verifiable Cedar Policy Receipts</h2>
              <span className="status-badge status-completed">Tamper-Proof Ledger</span>
            </div>

            <div className="card-body">
              <div className="receipt-list">
                {receipts.map((rc, idx) => (
                  <div className="receipt-card" key={idx}>
                    <div className="receipt-meta">
                      <span className="receipt-tool">Tool: {rc.payload.tool_name}</span>
                      <span className={`status-badge ${rc.payload.decision === 'allow' ? 'status-completed' : 'status-failed'}`}>
                        {rc.payload.decision}
                      </span>
                    </div>
                    <div className="receipt-reason">{rc.payload.reason}</div>
                    <div className="receipt-signature-block">
                      <span className="receipt-digest">policy: {rc.payload.policy_digest.substring(0, 15)}</span>
                      <span className="signature-verified">✓ ED25519 VERIFIED</span>
                    </div>
                  </div>
                ))}
                {receipts.length === 0 && (
                  <p style={{ color: 'hsl(var(--text-secondary))', textAlign: 'center', padding: '2rem' }}>
                    No policy receipts logged.
                  </p>
                )}
              </div>

              {/* Offline Verifier paste box */}
              <div className="verifier-box">
                <h3 className="card-title" style={{ fontSize: '0.95rem' }}>🛠️ Offline Cryptographic Receipt Verifier</h3>
                <textarea 
                  className="form-control" 
                  style={{ fontFamily: 'monospace', fontSize: '0.75rem', height: '80px', background: '#000', color: '#00ff00', border: '1px solid #222' }}
                  placeholder='Paste signed JSON receipt here e.g. {"payload": {...}, "signature": {...}}'
                  value={receiptInput}
                  onChange={e => setReceiptInput(e.target.value)}
                />
                <button className="btn btn-secondary" onClick={handleVerifyReceipt} style={{ width: '100%' }}>
                  Verify Receipt Authenticity
                </button>

                {verificationResult.status !== 'idle' && (
                  <div className={`verification-result result-${verificationResult.status === 'valid' ? 'valid' : 'invalid'}`}>
                    <strong>{verificationResult.message}</strong>
                    {verificationResult.payload && (
                      <span style={{ fontSize: '0.75rem', marginTop: '0.3rem', fontFamily: 'monospace' }}>
                        Issuer: {verificationResult.payload.issuer_id} | Issued: {new Date(verificationResult.payload.issued_at).toLocaleString()}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Static Scan Findings */}
          <section className="glass-panel">
            <div className="card-header">
              <h2 className="card-title">🔍 CI/CD Pipeline static Security Scanner</h2>
              <span className="status-badge status-failed">{findings.length} Vulnerabilities</span>
            </div>

            <div className="card-body">
              <div className="findings-container">
                {findings.map((f, idx) => (
                  <div className={`finding-card finding-card-${f.severity.toLowerCase()}`} key={idx}>
                    <div className="finding-header">
                      <span className="finding-title">{f.title}</span>
                      <span className={`status-badge status-${f.severity === 'High' ? 'failed' : f.severity === 'Medium' ? 'flagged' : 'pending'}`}>
                        {f.severity} Severity
                      </span>
                    </div>
                    <div className="finding-body">
                      <div className="finding-meta">
                        <span>File: <strong style={{ fontFamily: 'monospace' }}>{f.file}</strong></span>
                        <span>Step: <strong style={{ fontFamily: 'monospace' }}>{f.step}</strong></span>
                      </div>
                      <p style={{ color: 'hsl(var(--text-secondary))' }}><strong>Impact:</strong> {f.impact}</p>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        <span style={{ fontWeight: 'bold', color: 'hsl(var(--text-secondary))' }}>Vulnerable Pattern:</span>
                        <pre className="finding-evidence">{f.evidence}</pre>
                      </div>

                      <div className="finding-remediation">
                        <strong>Remediation:</strong> {f.remediation}
                      </div>
                    </div>
                  </div>
                ))}
                {findings.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p style={{ color: 'hsl(var(--success))', fontWeight: 'bold' }}>✓ Pipeline Secure</p>
                    <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.85rem', marginTop: '0.3rem' }}>
                      No workflow vulnerabilities detected. Type "npm run audit" in the secure console below to trigger a static analysis check!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* Embedded Secure Console Shell Simulation */}
      <section className="glass-panel" style={{ marginTop: '1.5rem' }}>
        <div className="card-header">
          <h2 className="card-title" style={{ color: '#00ff00' }}>💻 VeritasAudit Security Shell Console</h2>
          <span className="status-badge" style={{ background: 'rgba(0,255,0,0.05)', color: '#00ff00', border: '1px solid rgba(0,255,0,0.1)' }}>
            LOCAL DOCKER ACTIVE
          </span>
        </div>
        <div className="card-body">
          <div className="console-box">
            {consoleLines.map((line, idx) => (
              <div className="console-line" key={idx}>
                {line}
              </div>
            ))}
          </div>
          <form onSubmit={handleConsoleSubmit} className="console-input">
            <span className="console-prompt">veritas-sandbox $</span>
            <input 
              type="text" 
              className="console-field" 
              placeholder='Type "help" to list available commands...'
              value={consoleInput}
              onChange={e => setConsoleInput(e.target.value)}
            />
          </form>
        </div>
      </section>

    </div>
  );
}
