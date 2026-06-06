import React from 'react';
import { Transaction } from '@fidusgate/core-types';

interface LedgerTabProps {
  transactions: Transaction[];
  txNotification: { message: string; type: 'success' | 'warn' } | null;
  txSender: string;
  setTxSender: (v: string) => void;
  txRecipient: string;
  setTxRecipient: (v: string) => void;
  txAmount: string;
  setTxAmount: (v: string) => void;
  txCurrency: string;
  setTxCurrency: (v: string) => void;
  txLoading: boolean;
  handleCreateTransaction: (e: React.FormEvent) => void;
}

export function LedgerTab({
  transactions,
  txNotification,
  txSender,
  setTxSender,
  txRecipient,
  setTxRecipient,
  txAmount,
  setTxAmount,
  txCurrency,
  setTxCurrency,
  txLoading,
  handleCreateTransaction,
}: LedgerTabProps) {
  return (
    <div className="dashboard-grid animate-fade-in">
      {/* Transaction Creator Form */}
      <section className="glass-panel">
        <div className="card-header">
          <h2 className="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'hsl(var(--success))' }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="m9 11 2 2 4-4"/>
            </svg>
            Secure Transaction Gateway
          </h2>
          <span className="status-badge status-completed">PII Auto-Filtering Active</span>
        </div>
        
        <div className="card-body">
          {txNotification && (
            <div 
              className="verification-result animate-fade-in" 
              style={{ 
                marginBottom: '1.25rem', 
                background: txNotification.type === 'warn' ? 'hsla(var(--warning), 0.06)' : 'hsla(var(--success), 0.06)',
                border: txNotification.type === 'warn' ? '1px solid hsla(var(--warning), 0.2)' : '1px solid hsla(var(--success), 0.2)',
                color: txNotification.type === 'warn' ? 'hsl(var(--warning))' : 'hsl(var(--success))',
                boxShadow: txNotification.type === 'warn' ? '0 0 10px hsla(var(--warning), 0.04)' : '0 0 10px hsla(var(--success), 0.04)'
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
                  placeholder="e.g. developer@fidusgate.internal"
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

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.6rem' }} disabled={txLoading}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="M12 8v8M9 13h6"/>
              </svg>
              {txLoading ? 'Registering Security Block...' : 'Submit Transaction to Secure Gateway'}
            </button>
          </form>
        </div>
      </section>

      {/* Ledger Table */}
      <section className="glass-panel">
        <div className="card-header">
          <h2 className="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'hsl(var(--primary))' }}>
              <path d="M12 2H2v10h10V2zM12 12H2v10h10V12zM22 2h-10v10h10V2zM22 12h-10v10h10V12z"/>
            </svg>
            Transactional Stream Ledger
          </h2>
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
                    <td style={{ fontFamily: 'monospace', fontWeight: '700', color: '#fff' }}>{tx.id}</td>
                    <td>
                      {tx.sender}
                      {tx.maskedPii && (
                        <span style={{ marginLeft: '0.5rem', fontSize: '0.62rem', fontWeight: '700', textTransform: 'uppercase', background: 'hsla(var(--warning), 0.1)', padding: '0.15rem 0.4rem', borderRadius: '4px', color: 'hsl(var(--warning))', border: '1px solid hsla(var(--warning), 0.15)' }}>
                          masked
                        </span>
                      )}
                    </td>
                    <td>{tx.recipient}</td>
                    <td style={{ fontFamily: 'monospace', fontWeight: '700', color: '#fff' }}>
                      {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {tx.currency}
                    </td>
                    <td>
                      <span className={`status-badge status-${tx.status}`}>{tx.status}</span>
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: 'hsl(var(--text-secondary))', padding: '3rem' }}>
                      No transaction records registered or access unauthorized. Please log in!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
