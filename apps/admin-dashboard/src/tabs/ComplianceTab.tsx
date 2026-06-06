import { SecurityFinding } from '@fidusgate/core-types';

interface ComplianceTabProps {
  authRole: 'developer' | 'admin' | 'auditor' | 'unauthenticated';
  authEmail: string;
  attestedClaims: any;
  ibpState: any;
  driftState: any[];
  driftSyncLoading: boolean;
  systemConfig: any;
  systemConfigLoading: boolean;
  prometheusMetrics: any;
  findings: SecurityFinding[];
  plmState: any;
  pendingPatch: any;
  patchApplyLoading: boolean;
  consensusRequests: any[];
  consensusLoading: boolean;
  budgetExtensions: any[];
  budgetExtensionAmount: number;
  setBudgetExtensionAmount: (v: number) => void;
  budgetExtensionReason: string;
  setBudgetExtensionReason: (v: string) => void;
  budgetExtensionLoading: boolean;
  feedbackRole: string;
  setFeedbackRole: (v: string) => void;
  feedbackComment: string;
  setFeedbackComment: (v: string) => void;
  feedbackSeverity: 'info' | 'warn' | 'critical';
  setFeedbackSeverity: (v: 'info' | 'warn' | 'critical') => void;
  feedbackLoading: boolean;
  alignJustification: string;
  setAlignJustification: (v: string) => void;
  alignLoading: boolean;
  handleExportAuditReport: () => void;
  handleToggleCircuitBreaker: () => void;
  handleDriftSync: () => void;
  handleApplyPatch: () => void;
  handleApproveConsensus: (id: string) => void;
  handleOverrideConsensus: (id: string) => void;
  handleApproveBudgetExtension: (id: string) => void;
  handleRejectBudgetExtension: (id: string) => void;
  handleCreateBudgetExtensionRequest: (e: React.FormEvent) => void;
  handleLogFeedback: (e: React.FormEvent) => void;
  handleAlignFeedback: (e: React.FormEvent) => void;
}

export function ComplianceTab({
  authRole,
  authEmail,
  attestedClaims,
  ibpState,
  driftState,
  driftSyncLoading,
  systemConfig,
  systemConfigLoading,
  prometheusMetrics,
  findings,
  plmState,
  pendingPatch,
  patchApplyLoading,
  consensusRequests,
  consensusLoading,
  budgetExtensions,
  budgetExtensionAmount,
  setBudgetExtensionAmount,
  budgetExtensionReason,
  setBudgetExtensionReason,
  budgetExtensionLoading,
  feedbackRole,
  setFeedbackRole,
  feedbackComment,
  setFeedbackComment,
  feedbackSeverity,
  setFeedbackSeverity,
  feedbackLoading,
  alignJustification,
  setAlignJustification,
  alignLoading,
  handleExportAuditReport,
  handleToggleCircuitBreaker,
  handleDriftSync,
  handleApplyPatch,
  handleApproveConsensus,
  handleOverrideConsensus,
  handleApproveBudgetExtension,
  handleRejectBudgetExtension,
  handleCreateBudgetExtensionRequest,
  handleLogFeedback,
  handleAlignFeedback,
}: ComplianceTabProps) {
  return (
    <div className="tab-compliance-panel animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Enterprise SecOps Attestation & Token Budget Dashboard */}
      <section className="glass-panel secops-dashboard-panel" style={{ marginTop: 0 }}>
        <div className="secops-panel-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ color: 'hsl(var(--info))', filter: 'drop-shadow(0 0 8px hsla(var(--info), 0.4))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>
                Enterprise SecOps Attestation & Token Budget Console
              </h3>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'hsl(var(--text-secondary))' }}>
                Verified cryptographic signatures, real-time autonomous token utilization, and active policy gates.
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            {(authRole === 'admin' || authRole === 'auditor') && (
              <button 
                className="btn btn-secondary animate-glow-green-border" 
                onClick={handleExportAuditReport}
                style={{ 
                  padding: '0.45rem 1rem', 
                  fontSize: '0.8rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  borderColor: 'hsla(var(--success), 0.4)',
                  background: 'hsla(var(--success), 0.08)',
                  color: 'hsl(var(--success))',
                  cursor: 'pointer'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Export Compliance Manifest
              </button>
            )}

            <div className="status-badge status-completed animate-glow-green" style={{ margin: 0 }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00ff66', display: 'inline-block' }}></span>
              Dual-Mode Governance Engine Active
            </div>
          </div>
        </div>

        <div className="secops-panel-content">
          {/* Card 1: Cryptographic SME Role Keys & Attestation Graph */}
          <div className="secops-card">
            <div>
              <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'hsl(var(--text-secondary))' }}>
                Cryptographic SME Role Keys
              </h4>
              <div className="sme-keys-grid">
                <div className="sme-key-card">
                  <div className="sme-key-header">
                    <span className="sme-key-role">Backend SME</span>
                    <span className="sme-key-status" style={{ backgroundColor: '#00ff66', boxShadow: '0 0 8px #00ff66' }}></span>
                  </div>
                  <span className="sme-key-hash">0x7f3a9e2db0a1b2c3</span>
                </div>

                <div className="sme-key-card">
                  <div className="sme-key-header">
                    <span className="sme-key-role">DevOps SME</span>
                    <span className="sme-key-status" style={{ backgroundColor: '#00ff66', boxShadow: '0 0 8px #00ff66' }}></span>
                  </div>
                  <span className="sme-key-hash">0x9e5b8d2cf1b3c4d5</span>
                </div>

                <div className="sme-key-card">
                  <div className="sme-key-header">
                    <span className="sme-key-role">QA SME</span>
                    <span className="sme-key-status" style={{ backgroundColor: '#00ff66', boxShadow: '0 0 8px #00ff66' }}></span>
                  </div>
                  <span className="sme-key-hash">0x8c4b9e2da0c4d5e6</span>
                </div>

                <div className="sme-key-card">
                  <div className="sme-key-header">
                    <span className="sme-key-role">Security SME</span>
                    <span className="sme-key-status" style={{ backgroundColor: '#00ff66', boxShadow: '0 0 8px #00ff66' }}></span>
                  </div>
                  <span className="sme-key-hash">0xd15c8f2ba1d5e6f7</span>
                </div>
              </div>

              {/* Live Workload Attestation Graph */}
              {attestedClaims && attestedClaims.attested ? (
                <div style={{ marginTop: '1rem', borderTop: '1px solid hsl(var(--border-color))', paddingTop: '1rem' }}>
                  <h5 style={{ margin: '0 0 0.6rem 0', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'hsl(var(--text-secondary))' }}>
                    Live Attestation Graph
                  </h5>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.2)', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid hsl(var(--border-color))' }}>
                    {/* Agent Node */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
                      <span style={{ fontSize: '0.62rem', color: 'hsl(var(--text-muted))', textTransform: 'uppercase' }}>Workload</span>
                      <span className="status-badge status-completed" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem', borderColor: 'hsla(var(--primary), 0.3)', background: 'hsla(var(--primary), 0.1)', color: 'hsl(var(--primary))' }}>
                        {attestedClaims?.role?.toUpperCase() || 'AGENT'}
                      </span>
                    </div>
                    
                    {/* Animated Glowing Connection Line */}
                    <div style={{ flexGrow: 1, height: '2px', background: 'linear-gradient(90deg, hsl(var(--primary)) 0%, #00ff66 100%)', position: 'relative', margin: '0 0.5rem', opacity: 0.85 }}>
                      <span style={{ position: 'absolute', top: '-3px', left: '50%', transform: 'translateX(-50%)', width: '8px', height: '8px', borderRadius: '50%', background: '#00ff66', boxShadow: '0 0 10px #00ff66', animation: 'pulseGlow 2s infinite alternate ease-in-out' }}></span>
                    </div>

                    {/* Platform Gate Node */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
                      <span style={{ fontSize: '0.62rem', color: 'hsl(var(--text-muted))', textTransform: 'uppercase' }}>OIDC Gating</span>
                      <span className="status-badge status-completed" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                        VERIFIED
                      </span>
                    </div>

                    {/* Animated Glowing Connection Line */}
                    <div style={{ flexGrow: 1, height: '2px', background: '#00ff66', position: 'relative', margin: '0 0.5rem', opacity: 0.85 }}>
                      <span style={{ position: 'absolute', top: '-3px', left: '50%', transform: 'translateX(-50%)', width: '8px', height: '8px', borderRadius: '50%', background: '#00ff66', boxShadow: '0 0 10px #00ff66' }}></span>
                    </div>

                    {/* Host Workspace Node */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
                      <span style={{ fontSize: '0.62rem', color: 'hsl(var(--text-muted))', textTransform: 'uppercase' }}>Workspace</span>
                      <span className="status-badge status-completed" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem', borderColor: 'hsla(var(--info), 0.3)', background: 'hsla(var(--info), 0.1)', color: 'hsl(var(--info))' }}>
                        SECURE
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'hsl(var(--text-muted))', marginTop: '0.5rem', fontFamily: 'monospace', wordBreak: 'break-all', textAlign: 'center' }}>
                    ID: {attestedClaims?.workloadId || 'spiffe://fidusgate.internal/ns/sandbox/sa'}
                  </div>
                </div>
              ) : null}

              {/* Emergency Kill-Switch UI */}
              <div id="circuit-breaker-switch" style={{ marginTop: '1.2rem', borderTop: '1px solid hsl(var(--border-color))', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h5 style={{ margin: 0, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'hsl(var(--text-secondary))' }}>
                  Global Circuit Breaker
                </h5>
                <button
                  className={`btn ${systemConfig?.circuitBreakerActive ? 'animate-pulse-red' : ''}`}
                  onClick={handleToggleCircuitBreaker}
                  disabled={systemConfigLoading}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    letterSpacing: '0.04em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: systemConfig?.circuitBreakerActive ? '2px solid #ff3366' : '1px solid hsla(var(--danger), 0.3)',
                    background: systemConfig?.circuitBreakerActive 
                      ? 'radial-gradient(circle, rgba(255, 51, 102, 0.22) 0%, rgba(255, 51, 102, 0.04) 100%)' 
                      : 'rgba(255, 107, 107, 0.03)',
                    color: systemConfig?.circuitBreakerActive ? '#ff3366' : 'hsl(var(--danger))',
                    boxShadow: systemConfig?.circuitBreakerActive ? '0 0 20px rgba(255, 51, 102, 0.3)' : 'none',
                    textTransform: 'uppercase'
                  }}
                >
                  <span style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    backgroundColor: systemConfig?.circuitBreakerActive ? '#ff3366' : 'hsl(var(--danger))',
                    boxShadow: systemConfig?.circuitBreakerActive ? '0 0 8px #ff3366' : 'none',
                    display: 'inline-block',
                    animation: systemConfig?.circuitBreakerActive ? 'pulseRed 1s infinite alternate' : 'none'
                  }}></span>
                  {systemConfig?.circuitBreakerActive ? 'System Suspended (Click to Resume)' : 'Activate Emergency Stop'}
                </button>
              </div>
            </div>
            
            <div style={{ fontSize: '0.72rem', color: 'hsl(var(--text-muted))', textAlign: 'center', marginTop: '0.5rem', borderTop: '1px solid hsl(var(--border-color))', paddingTop: '0.5rem' }}>
              🔑 Hardware security modules (HSM) verified.
            </div>
          </div>

          {/* Card 2: IBP Token Budget Gauge & Drift Heatmap */}
          <div className="secops-card">
            <div>
              <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'hsl(var(--text-secondary))' }}>
                IBP Autonomous Token Budget
              </h4>
              
              {ibpState ? (
                <div className="budget-gauge-wrapper">
                  <div className="budget-stats">
                    <span style={{ color: 'hsl(var(--text-secondary))' }}>Sprint Limit:</span>
                    <strong style={{ color: '#fff' }}>{(ibpState.tokenBudget || 80000).toLocaleString()}</strong>
                  </div>
                  
                  <div className="budget-stats" style={{ marginTop: '-0.3rem' }}>
                    <span style={{ color: 'hsl(var(--text-secondary))' }}>Consumed:</span>
                    <strong style={{ 
                      color: (ibpState.tokensConsumed || 0) >= (ibpState.tokenBudget || 80000) * 0.9 ? 'hsl(var(--danger))' :
                             (ibpState.tokensConsumed || 0) >= (ibpState.tokenBudget || 80000) * 0.7 ? 'hsl(var(--warning))' : '#00ff66'
                    }}>
                      {(ibpState.tokensConsumed || 0).toLocaleString()} ({(Math.min(100, Math.max(0, ((ibpState.tokensConsumed || 0) / (ibpState.tokenBudget || 80000)) * 100))).toFixed(1)}%)
                    </strong>
                  </div>

                  <div className="budget-progress-track" style={{ marginTop: '0.5rem' }}>
                    <div 
                      className="budget-progress-bar"
                      style={{ 
                        width: `${Math.min(100, Math.max(0, ((ibpState.tokensConsumed || 0) / (ibpState.tokenBudget || 80000)) * 100))}%`,
                        backgroundColor: (ibpState.tokensConsumed || 0) >= (ibpState.tokenBudget || 80000) * 0.9 ? 'hsl(var(--danger))' :
                                         (ibpState.tokensConsumed || 0) >= (ibpState.tokenBudget || 80000) * 0.7 ? 'hsl(var(--warning))' : '#00ff66',
                        boxShadow: (ibpState.tokensConsumed || 0) >= (ibpState.tokenBudget || 80000) * 0.9 ? '0 0 10px hsla(var(--danger), 0.5)' :
                                   (ibpState.tokensConsumed || 0) >= (ibpState.tokenBudget || 80000) * 0.7 ? '0 0 10px hsla(var(--warning), 0.5)' : '0 0 10px rgba(0, 255, 102, 0.5)'
                      }}
                    ></div>
                  </div>
                  
                  <div style={{ fontSize: '0.78rem', color: 'hsl(var(--text-secondary))', marginTop: '0.5rem', fontStyle: 'italic', lineHeight: 1.4 }}>
                    "{ibpState.currentSprintGoal || 'Standardize Antigravity Project Compliance'}"
                  </div>
                </div>
              ) : (
                <div style={{ color: 'hsl(var(--text-muted))', fontSize: '0.8rem', textAlign: 'center', padding: '1.5rem 0' }}>
                  Loading budget specifications...
                </div>
              )}

              {/* Dynamic Codebase Memory Drift Heatmap */}
              <div style={{ marginTop: '1rem', borderTop: '1px solid hsl(var(--border-color))', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h5 style={{ margin: 0, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'hsl(var(--text-secondary))' }}>
                    Memory Drift Heatmap (CLAUDE.md)
                  </h5>
                  <button 
                    className="playbook-run-button" 
                    onClick={handleDriftSync}
                    disabled={driftSyncLoading}
                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}
                  >
                    {driftSyncLoading ? 'Syncing...' : 'Sync Memory'}
                  </button>
                </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {driftState && driftState.length > 0 ? (
                    driftState.map((d: any, idx: number) => {
                      const isStale = d.status === 'stale';
                      const bg = isStale ? 'rgba(255, 107, 107, 0.08)' : 'rgba(0, 255, 102, 0.08)';
                      const border = isStale ? '1px solid rgba(255, 107, 107, 0.2)' : '1px solid rgba(0, 255, 102, 0.2)';
                      const color = isStale ? 'hsl(var(--danger))' : '#00ff66';
                      return (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', backgroundColor: bg, border, borderRadius: '4px', padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: color, boxShadow: `0 0 6px ${color}` }}></span>
                          <span style={{ color: '#fff', fontWeight: 600 }}>{d.name.split('/').pop()}</span>
                          {isStale ? <span style={{ color, fontSize: '0.66rem' }}>({d.driftSeconds}s)</span> : null}
                        </div>
                      );
                    })
                  ) : (
                    <span style={{ fontSize: '0.72rem', color: 'hsl(var(--text-muted))' }}>Scanning codebase drift...</span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', borderTop: '1px solid hsl(var(--border-color))', paddingTop: '0.5rem', textAlign: 'center' }}>
              📊 Sync rate: Real-time via agent memory
            </div>
          </div>

          {/* Card 3: Cedar Evaluation Gates Status */}
          <div className="secops-card">
            <div>
              <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'hsl(var(--text-secondary))' }}>
                Cedar Evaluation Gates
              </h4>

              <div className="gate-status-grid">
                {/* DevOps Gate */}
                <div className="gate-status-node">
                  <div className="gate-node-info">
                    <span className="gate-node-name">DevOps Gate</span>
                    <span className="gate-node-desc">CI Pipelines & Security Scans</span>
                  </div>
                  {findings.length === 0 ? (
                    <div className="gate-node-light gate-light-active">
                      <span className="gate-light-dot" style={{ background: '#00ff66', boxShadow: '0 0 8px #00ff66' }}></span>
                      Secure
                    </div>
                  ) : (
                    <div className="gate-node-light gate-light-locked animate-pulse-red">
                      <span className="gate-light-dot" style={{ background: 'hsl(var(--danger))', boxShadow: '0 0 8px hsl(var(--danger))' }}></span>
                      Violated
                    </div>
                  )}
                </div>

                {/* IBP Gate */}
                <div className="gate-status-node">
                  <div className="gate-node-info">
                    <span className="gate-node-name">IBP Gate</span>
                    <span className="gate-node-desc">Token Alignment & Reports</span>
                  </div>
                  {ibpState?.crossFunctionalSynthesized ? (
                    <div className="gate-node-light gate-light-active">
                      <span className="gate-light-dot" style={{ background: '#00ff66', boxShadow: '0 0 8px #00ff66' }}></span>
                      Aligned
                    </div>
                  ) : (
                    <div className="gate-node-light gate-light-locked animate-pulse-red">
                      <span className="gate-light-dot" style={{ background: 'hsl(var(--danger))', boxShadow: '0 0 8px hsl(var(--danger))' }}></span>
                      Pending
                    </div>
                  )}
                </div>

                {/* PLM Gate */}
                <div className="gate-status-node">
                  <div className="gate-node-info">
                    <span className="gate-node-name">PLM Gate</span>
                    <span className="gate-node-desc">API Schema Drift & Releases</span>
                  </div>
                  {plmState?.feedbackAligned ? (
                    <div className="gate-node-light gate-light-active">
                      <span className="gate-light-dot" style={{ background: '#00ff66', boxShadow: '0 0 8px #00ff66' }}></span>
                      Released
                    </div>
                  ) : (
                    <div className="gate-node-light gate-light-locked animate-pulse-red">
                      <span className="gate-light-dot" style={{ background: 'hsl(var(--danger))', boxShadow: '0 0 8px hsl(var(--danger))' }}></span>
                      Locked
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', borderTop: '1px solid hsl(var(--border-color))', paddingTop: '0.5rem', textAlign: 'center' }}>
              🔒 Cryptographically enforced by Cedar Daemon
            </div>
          </div>

          {/* Card 4: OTel Telemetry Metrics & Latency Traces */}
          <div className="secops-card">
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <h4 style={{ margin: 0, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'hsl(var(--text-secondary))' }}>
                  OpenTelemetry Latency & Rate Tracing
                </h4>
                {prometheusMetrics.autoThrottleActive === 1 && (
                  <span 
                    className="status-badge status-failed animate-pulse" 
                    style={{ 
                      fontSize: '0.68rem', 
                      borderColor: 'rgba(255, 107, 107, 0.4)', 
                      background: 'rgba(255, 107, 107, 0.15)', 
                      color: 'hsl(var(--danger))',
                      fontWeight: 'bold',
                      boxShadow: '0 0 10px rgba(255, 107, 107, 0.25)'
                    }}
                  >
                    Auto-Throttle: ACTIVE
                  </span>
                )}
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {/* Metric 1: Authorization Latency */}
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid hsl(var(--border-color))' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.74rem', color: 'hsl(var(--text-secondary))' }}>Auth Decision Latency:</span>
                    <strong style={{ fontSize: '0.85rem', color: '#00ff66', fontFamily: 'monospace' }}>
                      {systemConfig?.circuitBreakerActive ? 'N/A (Suspended)' : `${(prometheusMetrics.latencyHistory.reduce((a: number, b: number) => a + b, 0) / prometheusMetrics.latencyHistory.length).toFixed(1)} ms (Avg)`}
                    </strong>
                  </div>
                  {/* Real-time Sparkline / Latency Bar */}
                  <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', height: '24px', padding: '2px 0' }}>
                    {prometheusMetrics.latencyHistory.map((val: number, i: number) => {
                      // If system is suspended, display flat dead line
                      const heightPercent = systemConfig?.circuitBreakerActive ? 10 : (val / 30) * 100;
                      const barColor = systemConfig?.circuitBreakerActive ? 'hsl(var(--danger))' : val > 20 ? 'hsl(var(--warning))' : 'hsl(var(--primary))';
                      return (
                        <div 
                          key={i} 
                          style={{ 
                            flexGrow: 1, 
                            height: `${heightPercent}%`, 
                            backgroundColor: barColor, 
                            borderRadius: '1px',
                            opacity: 0.85,
                            transition: 'all 0.3s ease'
                          }}
                        ></div>
                      );
                    })}
                  </div>
                </div>

                {/* Metric 2: Transaction Rates */}
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid hsl(var(--border-color))' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.74rem', color: 'hsl(var(--text-secondary))' }}>Tool-Call Request Rate:</span>
                    <strong style={{ fontSize: '0.85rem', color: '#fff', fontFamily: 'monospace' }}>
                      {systemConfig?.circuitBreakerActive ? '0.0 req/sec' : `${prometheusMetrics.requestRateHistory[prometheusMetrics.requestRateHistory.length - 1].toFixed(1)} req/sec`}
                    </strong>
                  </div>
                  {/* Real-time Sparkline / Request rate Bar */}
                  <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', height: '24px', padding: '2px 0' }}>
                    {prometheusMetrics.requestRateHistory.map((val: number, i: number) => {
                      const heightPercent = systemConfig?.circuitBreakerActive ? 0 : (val / 8) * 100;
                      return (
                        <div 
                          key={i} 
                          style={{ 
                            flexGrow: 1, 
                            height: `${heightPercent}%`, 
                            backgroundColor: '#00ff66', 
                            borderRadius: '1px',
                            opacity: 0.8,
                            transition: 'all 0.3s ease'
                          }}
                        ></div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', borderTop: '1px solid hsl(var(--border-color))', paddingTop: '0.5rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
              <span className={systemConfig?.circuitBreakerActive ? '' : 'animate-pulse-green'} style={{ width: '6px', height: '6px', borderRadius: '50%', background: systemConfig?.circuitBreakerActive ? 'hsl(var(--danger))' : '#00ff66', display: 'inline-block' }}></span>
              <span>{systemConfig?.circuitBreakerActive ? 'OTel Tracer: INACTIVE' : 'OTel Tracer: ACTIVE (Prometheus Exporter)'}</span>
            </div>
          </div>

          {/* Card 5: Multi-Agent Consensus Approvals (Consensus Gating) */}
          <div className="secops-card animate-fade-in" style={{ gridColumn: 'span 3', borderStyle: 'solid', borderColor: 'rgba(26, 188, 156, 0.3)', background: 'rgba(26, 188, 156, 0.02)', marginTop: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.65rem' }}>
                <h4 style={{ margin: 0, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--success))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 6px rgba(0,255,102,0.35))' }}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  Multi-Agent Consensus Attestation Center
                </h4>
                <span className="status-badge status-completed" style={{ fontSize: '0.72rem', borderColor: 'rgba(0,255,102,0.3)', background: 'rgba(0,255,102,0.06)', color: '#00ff66' }}>
                  Consensus Gating Active
                </span>
              </div>

              {consensusRequests.length === 0 ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: 'hsl(var(--text-muted))', fontSize: '0.8rem' }}>
                  ✅ No pending high-privileged command approvals in ledger queue.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {consensusRequests.map((req, idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        flexWrap: 'wrap', 
                        gap: '1rem',
                        background: 'rgba(0,0,0,0.25)', 
                        padding: '0.85rem 1.1rem', 
                        borderRadius: '8px', 
                        border: '1px solid hsl(var(--border-color))' 
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1, minWidth: '280px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <span style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'rgba(255, 107, 107, 0.08)', border: '1px solid rgba(255, 107, 107, 0.15)', color: 'hsl(var(--danger))', fontFamily: 'monospace' }}>
                            {req.id}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))' }}>
                            Initiator: <strong>{req.initiator}</strong> ({req.role.toUpperCase()})
                          </span>
                          {req.adminOverridden && (
                            <span className="status-badge status-completed animate-pulse-green" style={{ fontSize: '0.66rem', padding: '0.1rem 0.4rem', background: 'rgba(0, 255, 102, 0.08)', borderColor: 'rgba(0, 255, 102, 0.25)', color: '#00ff66' }}>
                              🔓 Admin Overridden
                            </span>
                          )}
                        </div>
                        <div style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: '#00ff66', background: 'rgba(0,0,0,0.3)', padding: '0.35rem 0.65rem', borderRadius: '4px', marginTop: '0.2rem' }}>
                          $ {req.command}
                        </div>
                        
                        {/* Approved Tooltip/Execution helper */}
                        {req.status === 'approved' && (
                          <div style={{ 
                            fontSize: '0.74rem', 
                            color: '#00ff66', 
                            background: 'rgba(0, 255, 102, 0.05)', 
                            border: '1px solid rgba(0, 255, 102, 0.15)', 
                            padding: '0.4rem 0.75rem', 
                            borderRadius: '4px', 
                            marginTop: '0.35rem', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.4rem',
                            lineHeight: '1.3'
                          }}>
                            <span style={{ fontSize: '0.9rem' }}>💡</span>
                            <span>
                              <strong>Consensus Gating Passed!</strong> Run the command <code>{req.command}</code> inside the Sandbox Terminal to execute it and view live microVM output.
                            </span>
                          </div>
                        )}
                        
                        {/* AI Safety Rating display */}
                        {req.aiRating && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', marginTop: '0.3rem' }}>
                            <span 
                              className="status-badge" 
                              style={{ 
                                fontSize: '0.65rem', 
                                padding: '0.08rem 0.4rem', 
                                fontWeight: '600',
                                borderColor: req.aiRating === 'dangerous' ? 'rgba(255, 107, 107, 0.3)' : req.aiRating === 'suspicious' ? 'rgba(241, 196, 15, 0.3)' : 'rgba(46, 204, 113, 0.3)',
                                background: req.aiRating === 'dangerous' ? 'rgba(255, 107, 107, 0.08)' : req.aiRating === 'suspicious' ? 'rgba(241, 196, 15, 0.08)' : 'rgba(46, 204, 113, 0.08)',
                                color: req.aiRating === 'dangerous' ? 'hsl(var(--danger))' : req.aiRating === 'suspicious' ? 'hsl(var(--warning))' : '#2ecc71',
                                boxShadow: req.aiRating === 'dangerous' ? '0 0 8px rgba(255, 107, 107, 0.1)' : 'none'
                              }}
                            >
                              {req.aiRating === 'dangerous' ? '⚠️ DANGEROUS' : req.aiRating === 'suspicious' ? '⚡ SUSPICIOUS' : '🛡️ SAFE'}
                            </span>
                            {req.aiReason && (
                              <span style={{ fontSize: '0.72rem', color: 'hsl(var(--text-muted))', fontStyle: 'italic', lineHeight: 1.3 }}>
                                {req.aiReason}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', justifyContent: 'flex-end', minWidth: '240px' }}>
                        {/* Approval Progress indicator */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                          <span style={{ fontSize: '0.74rem', color: 'hsl(var(--text-secondary))' }}>
                            Approvals: <strong style={{ color: req.approvals.length >= req.requiredVotes ? '#00ff66' : 'hsl(var(--warning))' }}>{req.approvals.length} / {req.requiredVotes}</strong>
                          </span>
                          <span style={{ fontSize: '0.68rem', color: 'hsl(var(--text-muted))' }}>
                            Status: <strong style={{ textTransform: 'uppercase', color: req.status === 'approved' ? '#00ff66' : 'hsl(var(--warning))' }}>{req.status}</strong>
                          </span>
                        </div>

                        {/* Control actions */}
                        {req.status === 'pending' && (
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            {req.aiRating === 'dangerous' && !req.adminOverridden ? (
                              <>
                                {authRole === 'admin' ? (
                                  <button
                                    className="btn btn-secondary animate-glow-orange-border"
                                    onClick={() => handleOverrideConsensus(req.id)}
                                    disabled={consensusLoading}
                                    style={{
                                      padding: '0.45rem 1rem',
                                      fontSize: '0.78rem',
                                      background: 'rgba(241, 196, 15, 0.08)',
                                      color: 'hsl(var(--warning))',
                                      borderColor: 'rgba(241, 196, 15, 0.3)',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    Admin Override
                                  </button>
                                ) : (
                                  <span 
                                    className="status-badge status-failed animate-pulse-red" 
                                    style={{ 
                                      fontSize: '0.72rem', 
                                      padding: '0.4rem 0.8rem',
                                      background: 'rgba(255, 107, 107, 0.08)',
                                      borderColor: 'rgba(255, 107, 107, 0.3)',
                                      color: 'hsl(var(--danger))',
                                      fontWeight: 'bold'
                                    }}
                                  >
                                    AI Blocked
                                  </span>
                                )}
                              </>
                            ) : (
                              <button
                                className="btn btn-secondary animate-glow-green-border"
                                onClick={() => handleApproveConsensus(req.id)}
                                disabled={consensusLoading || req.approvals.some((app: any) => app.approver === authEmail) || authEmail === req.initiator}
                                style={{ 
                                  padding: '0.45rem 1rem', 
                                  fontSize: '0.78rem',
                                  background: req.approvals.some((app: any) => app.approver === authEmail) ? 'rgba(255,255,255,0.03)' : authEmail === req.initiator ? 'rgba(255,107,107,0.03)' : 'rgba(0,255,102,0.08)',
                                  color: req.approvals.some((app: any) => app.approver === authEmail) ? 'hsl(var(--text-muted))' : authEmail === req.initiator ? 'hsl(var(--danger))' : '#00ff66',
                                  borderColor: req.approvals.some((app: any) => app.approver === authEmail) ? 'transparent' : authEmail === req.initiator ? 'rgba(255,107,107,0.2)' : 'rgba(0,255,102,0.3)',
                                  cursor: (req.approvals.some((app: any) => app.approver === authEmail) || authEmail === req.initiator) ? 'not-allowed' : 'pointer'
                                }}
                              >
                                {req.approvals.some((app: any) => app.approver === authEmail) ? 'Signed' : authEmail === req.initiator ? 'Initiator Blocked' : 'Attest & Sign'}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Consensus Threshold Cryptography Attestation Graph */}
              {(() => {
                const activeReq = consensusRequests[0];
                const adminSigned = activeReq ? activeReq.approvals.some((a: any) => a.role === 'admin') : false;
                const devSigned = activeReq ? activeReq.approvals.some((a: any) => a.role === 'developer') : false;
                const auditorSigned = activeReq ? activeReq.approvals.some((a: any) => a.role === 'auditor') : false;
                return (
                  <div style={{ marginTop: '1.2rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', border: '1px solid rgba(0, 255, 102, 0.1)' }}>
                    <h5 style={{ margin: '0 0 0.8rem 0', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'hsl(var(--text-secondary))', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      🔐 Consensus Threshold Key Aggregation Graph
                    </h5>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', position: 'relative', minHeight: '120px' }}>
                      {/* Key Nodes */}
                      {[
                        { label: 'K₁ Admin', color: adminSigned ? '#00ff66' : 'rgba(255,255,255,0.2)', icon: '🛡️' },
                        { label: 'K₂ Developer', color: devSigned ? '#00ff66' : 'rgba(255,255,255,0.2)', icon: '⚙️' },
                        { label: 'K₃ Auditor', color: auditorSigned ? '#00ff66' : 'rgba(255,255,255,0.2)', icon: '🔍' }
                      ].map((key, idx) => (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', flex: 1 }}>
                          <div style={{
                            width: '52px', height: '52px', borderRadius: '50%',
                            background: `radial-gradient(circle at 30% 30%, ${key.color}22, ${key.color}08)`,
                            border: `2px solid ${key.color}55`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.3rem',
                            boxShadow: `0 0 12px ${key.color}20`,
                            animation: 'pulse 2s ease-in-out infinite',
                            animationDelay: `${idx * 0.3}s`
                          }}>
                            {key.icon}
                          </div>
                          <span style={{ fontSize: '0.68rem', color: key.color, fontFamily: 'monospace', fontWeight: 600 }}>{key.label}</span>
                          {/* Connection line to aggregate node */}
                          <div style={{ width: '2px', height: '20px', background: `linear-gradient(to bottom, ${key.color}55, ${key.color}15)` }} />
                        </div>
                      ))}
                    </div>
                    {/* Aggregated Signature Node */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.2rem' }}>
                      <div style={{
                        padding: '0.5rem 1.2rem', borderRadius: '8px',
                        background: 'linear-gradient(135deg, rgba(0,255,102,0.06), rgba(52,152,219,0.06))',
                        border: '1px solid rgba(0,255,102,0.2)',
                        display: 'flex', alignItems: 'center', gap: '0.5rem'
                      }}>
                        <span style={{ fontSize: '1.1rem' }}>🔗</span>
                        <div>
                          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#00ff66', fontFamily: 'monospace' }}>
                            σ_agg = Σ(K₁ · K₂ · K₃)
                          </div>
                          <div style={{ fontSize: '0.64rem', color: 'hsl(var(--text-muted))' }}>
                            Consensus Schnorr Aggregated Threshold Signature
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Card 6: Interactive Admin Override & Budget Negotiation Console */}
          <div className="secops-card animate-fade-in" style={{ gridColumn: 'span 3', borderStyle: 'solid', borderColor: 'rgba(243, 156, 18, 0.3)', background: 'rgba(243, 156, 18, 0.02)', marginTop: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.65rem' }}>
                <h4 style={{ margin: 0, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--warning))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 6px rgba(243,156,18,0.35))' }}>
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  Interactive Admin Override & Budget Negotiation Console
                </h4>
                <span className="status-badge status-pending" style={{ fontSize: '0.72rem', borderColor: 'rgba(243,156,18,0.3)', background: 'rgba(243,156,18,0.06)', color: 'hsl(var(--warning))' }}>
                  Compliance REQ-300 Gating
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
                {/* Left Side: Submit Request */}
                <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <h5 style={{ margin: 0, fontSize: '0.8rem', color: '#fff', fontWeight: 600 }}>Request Budget Extension</h5>
                  <p style={{ margin: 0, fontSize: '0.74rem', color: 'hsl(var(--text-secondary))', lineHeight: '1.4' }}>
                    If your autonomous agent runs out of tokens under zero-trust enforce mode, submit a request below.
                  </p>
                  <form onSubmit={handleCreateBudgetExtensionRequest} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <div className="form-group">
                      <label htmlFor="budgetAmt">Requested Token Increase Amount</label>
                      <input 
                        type="number" 
                        id="budgetAmt" 
                        className="form-control"
                        value={budgetExtensionAmount}
                        onChange={e => setBudgetExtensionAmount(Number(e.target.value))}
                        required
                        min={1}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="budgetReason">Business & Technical Rationale</label>
                      <textarea 
                        id="budgetReason" 
                        className="form-control"
                        placeholder="e.g. Need additional budget to run compliance validation cycle for requirement REQ-300"
                        value={budgetExtensionReason}
                        onChange={e => setBudgetExtensionReason(e.target.value)}
                        required
                        style={{ height: '3.5rem', resize: 'none' }}
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="btn btn-secondary" 
                      disabled={budgetExtensionLoading || authRole === 'unauthenticated'}
                      style={{ width: '100%', borderColor: 'rgba(243, 156, 18, 0.4)', color: 'hsl(var(--warning))', background: 'rgba(243, 156, 18, 0.05)', cursor: 'pointer' }}
                    >
                      {budgetExtensionLoading ? 'Submitting request...' : 'Submit Extension Request'}
                    </button>
                  </form>
                </div>

                {/* Right Side: Active requests queue */}
                <div style={{ flex: '2 2 400px', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <h5 style={{ margin: 0, fontSize: '0.8rem', color: '#fff', fontWeight: 600 }}>Active Extension Requests Queue</h5>
                  <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {budgetExtensions.length === 0 ? (
                      <div style={{ padding: '2rem', textAlign: 'center', color: 'hsl(var(--text-muted))', fontSize: '0.78rem', background: 'rgba(0,0,0,0.15)', borderRadius: '6px' }}>
                        No budget extension requests recorded.
                      </div>
                    ) : (
                      budgetExtensions.map((req) => (
                        <div 
                          key={req.id} 
                          style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            gap: '1rem',
                            background: 'rgba(0,0,0,0.2)', 
                            padding: '0.65rem 0.85rem', 
                            borderRadius: '6px', 
                            border: '1px solid hsl(var(--border-color))' 
                          }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#fff' }}>+{req.requestedAmount.toLocaleString()} Tokens</span>
                              <span style={{ fontSize: '0.62rem', color: 'hsl(var(--text-muted))' }}>by {req.applicant}</span>
                              <span className={`status-badge status-${req.status}`} style={{ fontSize: '0.6rem', padding: '0.05rem 0.35rem' }}>{req.status}</span>
                            </div>
                            <span style={{ fontSize: '0.72rem', color: 'hsl(var(--text-secondary))', fontStyle: 'italic' }}>"{req.reason}"</span>
                            {req.reviewer && (
                              <span style={{ fontSize: '0.64rem', color: 'hsl(var(--text-muted))' }}>
                                Reviewed by {req.reviewer} at {new Date(req.reviewedAt).toLocaleTimeString()}
                              </span>
                            )}
                          </div>
                          {req.status === 'pending' && (
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                              <button 
                                className="btn btn-secondary"
                                onClick={() => handleApproveBudgetExtension(req.id)}
                                disabled={authRole !== 'admin'}
                                style={{ 
                                  padding: '0.3rem 0.6rem', 
                                  fontSize: '0.7rem', 
                                  background: authRole === 'admin' ? 'rgba(0,255,102,0.08)' : 'transparent', 
                                  color: authRole === 'admin' ? '#00ff66' : 'hsl(var(--text-muted))',
                                  borderColor: authRole === 'admin' ? 'rgba(0,255,102,0.3)' : 'transparent',
                                  cursor: authRole === 'admin' ? 'pointer' : 'not-allowed'
                                }}
                                title={authRole !== 'admin' ? 'Requires Administrator Role' : 'Approve increase'}
                              >
                                Approve
                              </button>
                              <button 
                                className="btn btn-secondary"
                                onClick={() => handleRejectBudgetExtension(req.id)}
                                disabled={authRole !== 'admin'}
                                style={{ 
                                  padding: '0.3rem 0.6rem', 
                                  fontSize: '0.7rem', 
                                  background: authRole === 'admin' ? 'rgba(255,107,107,0.08)' : 'transparent', 
                                  color: authRole === 'admin' ? 'hsl(var(--danger))' : 'hsl(var(--text-muted))',
                                  borderColor: authRole === 'admin' ? 'rgba(255,107,107,0.3)' : 'transparent',
                                  cursor: authRole === 'admin' ? 'pointer' : 'not-allowed'
                                }}
                                title={authRole !== 'admin' ? 'Requires Administrator Role' : 'Reject increase'}
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full-width Card 4: Interactive Diff-Apply Patch review terminal */}
          {pendingPatch && pendingPatch.exists ? (
            <div className="secops-card animate-fade-in" style={{ gridColumn: 'span 3', borderStyle: 'dashed', borderColor: 'hsla(var(--primary), 0.5)', background: 'rgba(0, 0, 0, 0.25)', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <span style={{ color: 'hsl(var(--warning))', display: 'flex', alignItems: 'center' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </span>
                  <h4 style={{ margin: 0, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#fff' }}>
                    Attestation Required: Ephemeral Sandbox Pending Diff Patch
                  </h4>
                </div>
                
                <button 
                  className="btn btn-primary" 
                  onClick={handleApplyPatch} 
                  disabled={patchApplyLoading}
                  style={{ background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsla(var(--primary), 0.7) 100%)', padding: '0.45rem 1rem', fontSize: '0.8rem', marginLeft: 'auto' }}
                >
                  {patchApplyLoading ? (
                    <span>Processing merge...</span>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m12 14 4-4-4-4"/>
                        <path d="M4 20V8a2 2 0 0 1 2-2h4"/>
                      </svg>
                      Attest & Merge Workspace Changes
                    </>
                  )}
                </button>
              </div>

              {/* Colored Unified Diff View */}
              <div className="finding-evidence" style={{ maxHeight: '200px', width: '100%', overflowY: 'auto' }}>
                {pendingPatch.patch.split('\n').map((line: string, idx: number) => {
                  const isAddition = line.startsWith('+') && !line.startsWith('+++');
                  const isDeletion = line.startsWith('-') && !line.startsWith('---');
                  const color = isAddition ? '#00ff66' : isDeletion ? 'hsl(var(--danger))' : '#c9d1d9';
                  const bg = isAddition ? 'rgba(0, 255, 102, 0.08)' : isDeletion ? 'rgba(255, 107, 107, 0.08)' : 'transparent';
                  return (
                    <div key={idx} style={{ color, backgroundColor: bg, fontFamily: 'monospace', fontSize: '0.76rem', padding: '0.1rem 0.4rem', whiteSpace: 'pre-wrap' }}>
                      {line}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* Split Grid for PLM Governance & Static Scanner */}
      <div className="dashboard-grid">
        {/* Left Column: Visual PLM Adaptive Governance Panel */}
        <section className="glass-panel plm-governance-panel" style={{ marginTop: 0 }}>
          <div className="plm-panel-header">
            <div className="plm-header-left">
              <div className="plm-icon-container">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>
                  PLM Adaptive Governance Panel
                </h3>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'hsl(var(--text-secondary))' }}>
                  Stateful gatekeeping for AI agents. Formulate scenario trade-offs and align runtime directives.
                </p>
              </div>
            </div>

            {/* Gating Shield Indicator Widget */}
            <div className="plm-shield-wrapper">
              {plmState ? (
                plmState.activeDirectives && plmState.activeDirectives.length > 0 && !plmState.feedbackAligned ? (
                  <div className="plm-shield shield-locked animate-pulse-red">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span>GATE LOCKED</span>
                  </div>
                ) : (
                  <div className="plm-shield shield-released animate-glow-green">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      <path d="m9 11 2 2 4-4"/>
                    </svg>
                    <span>GATE RELEASED</span>
                  </div>
                )
              ) : (
                <div className="plm-shield shield-inactive">
                  <span>CONNECTING GATEWAY</span>
                </div>
              )}
            </div>
          </div>

          <div className="plm-panel-content">
            {/* Active Directives Checklist & State Display */}
            <div className="plm-status-card">
              <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'hsl(var(--text-secondary))' }}>
                Active PLM Directives
              </h4>
              <div className="plm-meta-data">
                <span>Active Requirement ID: <strong>{plmState?.activeRequirementId || 'None'}</strong></span>
                <span>Total Directives: <strong>{plmState?.activeDirectives?.length || 0} Unaligned</strong></span>
              </div>

              <div className="plm-directives-list">
                {plmState?.activeDirectives && plmState.activeDirectives.length > 0 ? (
                  plmState.activeDirectives.map((d: string, idx: number) => (
                    <div className="directive-item" key={idx}>
                      <div className="directive-bullet animate-pulse-red"></div>
                      <span className="directive-text">{d}</span>
                    </div>
                  ))
                ) : (
                  <div className="plm-empty-state">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'hsl(var(--success))' }}>
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      <path d="m9 11 2 2 4-4"/>
                    </svg>
                    <span>Zero active compliance warnings. Commit pipeline fully unlocked.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Form 1: Log User Feedback */}
            <div className="plm-action-card">
              <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'hsl(var(--text-secondary))' }}>
                Log System / Stakeholder Feedback
              </h4>
              <form onSubmit={handleLogFeedback}>
                <div className="form-row" style={{ gap: '0.8rem', marginBottom: '0.8rem' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label htmlFor="fbRole">Role Source</label>
                    <select 
                      id="fbRole" 
                      className="form-control"
                      value={feedbackRole}
                      onChange={e => setFeedbackRole(e.target.value)}
                    >
                      <option value="Auditor">Auditor (Security)</option>
                      <option value="SRE/DevOps">SRE/DevOps</option>
                      <option value="Product Owner">Product Owner</option>
                      <option value="Lead Architect">Lead Architect</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label htmlFor="fbSeverity">Severity Level</label>
                    <select 
                      id="fbSeverity" 
                      className="form-control"
                      value={feedbackSeverity}
                      onChange={e => setFeedbackSeverity(e.target.value as any)}
                    >
                      <option value="info">Info (Non-Blocking)</option>
                      <option value="warn">Warning (Gating)</option>
                      <option value="critical">Critical (Gating)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '0.8rem' }}>
                  <label htmlFor="fbComment">Directives & Performance Comments</label>
                  <input 
                    type="text" 
                    id="fbComment" 
                    className="form-control" 
                    placeholder="e.g. Optimize prisma queries due to memory overhead"
                    value={feedbackComment}
                    onChange={e => setFeedbackComment(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-secondary" style={{ width: '100%' }} disabled={feedbackLoading || authRole === 'unauthenticated'}>
                  {feedbackLoading ? 'Logging Directives...' : 'Submit Feedback to Secure Gateway'}
                </button>
              </form>
            </div>

            {/* Form 2: Align Gate / Resolve Trade-offs */}
            <div className="plm-action-card">
              <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'hsl(var(--text-secondary))' }}>
                Resolve Scenario Trade-offs & Align Gate
              </h4>
              <form onSubmit={handleAlignFeedback}>
                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label>Requirement ID Target</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={plmState?.activeRequirementId || 'REQ-101'} 
                    disabled 
                    style={{ opacity: 0.6 }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '0.8rem' }}>
                  <label htmlFor="alignJust">Alignment Justification & Options Selection</label>
                  <textarea 
                    id="alignJust" 
                    className="form-control" 
                    placeholder="e.g. Aligned Option A (relational normalization) to minimize query latency..."
                    value={alignJustification}
                    onChange={e => setAlignJustification(e.target.value)}
                    required
                    style={{ height: '3.6rem', resize: 'none' }}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={alignLoading || authRole === 'unauthenticated'}>
                  {alignLoading ? 'Aligning Gate...' : 'Release Gate / Confirm Alignment'}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Right Column: CI/CD Pipeline Static Security Scanner */}
        <section className="glass-panel" style={{ marginTop: 0 }}>
          <div className="card-header">
            <h2 className="card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'hsl(var(--danger))' }}>
                <path d="m21 21-4.3-4.3"/>
                <circle cx="11" cy="11" r="8"/>
                <path d="m8 11 2 2 4-4"/>
              </svg>
              CI/CD Pipeline Static Security Scanner
            </h2>
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
                      <span>File: <strong>{f.file}</strong></span>
                      <span>Step: <strong>{f.step}</strong></span>
                    </div>
                    <p style={{ color: 'hsl(var(--text-secondary))', lineHeight: '1.4' }}>
                      <strong style={{ color: '#fff' }}>Impact:</strong> {f.impact}
                    </p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <span style={{ fontWeight: '700', color: 'hsl(var(--text-secondary))', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Vulnerable Pattern:</span>
                      <pre className="finding-evidence">{f.evidence}</pre>
                    </div>

                    <div className="finding-remediation">
                      <strong>Remediation:</strong> {f.remediation}
                    </div>
                  </div>
                </div>
              ))}
              {findings.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'hsl(var(--success))', marginBottom: '0.8rem' }}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="m9 11 2 2 4-4"/>
                  </svg>
                  <p style={{ color: 'hsl(var(--success))', fontWeight: '700' }}>✓ Pipeline Fully Secure</p>
                  <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.82rem', marginTop: '0.4rem' }}>
                    No workflow vulnerabilities detected or access unauthorized.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
