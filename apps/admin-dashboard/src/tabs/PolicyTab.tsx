interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  cedarCode?: string;
}

interface PolicyTabProps {
  authRole: 'developer' | 'admin' | 'auditor' | 'unauthenticated';
  chatMessages: ChatMessage[];
  chatInput: string;
  setChatInput: (v: string) => void;
  chatLoading: boolean;
  setChatLoading: (v: boolean) => void;
  setChatMessages: (updater: (prev: ChatMessage[]) => ChatMessage[]) => void;
  chatApplyLoading: boolean;
  setChatApplyLoading: (v: boolean) => void;
  chatEndRef: any;
  simOverrideMode: boolean;
  setSimOverrideMode: (v: boolean) => void;
  simDraftPolicy: string;
  setSimDraftPolicy: (v: string) => void;
  simPrincipal: string;
  setSimPrincipal: (v: string) => void;
  simToolName: string;
  setSimToolName: (v: string) => void;
  simArgs: string;
  setSimArgs: (v: string) => void;
  simContext: string;
  setSimContext: (v: string) => void;
  simLoading: boolean;
  simResult: any;
  activePolicyCode: string;
  consoleLines: string[];
  setConsoleLines: (updater: (prev: string[]) => string[]) => void;
  handleSimulate: (e: React.FormEvent) => void;
  fetchData: () => void;
  getHeaders: () => Record<string, string>;
}

const API_BASE = '/api';

export function PolicyTab({
  authRole,
  chatMessages,
  chatInput,
  setChatInput,
  chatLoading,
  setChatLoading,
  setChatMessages,
  chatApplyLoading,
  setChatApplyLoading,
  chatEndRef,
  simOverrideMode,
  setSimOverrideMode,
  simDraftPolicy,
  setSimDraftPolicy,
  simPrincipal,
  setSimPrincipal,
  simToolName,
  setSimToolName,
  simArgs,
  setSimArgs,
  simContext,
  setSimContext,
  simLoading,
  simResult,
  activePolicyCode,
  setConsoleLines,
  handleSimulate,
  fetchData,
  getHeaders,
}: PolicyTabProps) {
  return (
    <div className="dashboard-grid animate-fade-in" style={{ gridTemplateColumns: '1.2fr 1.1fr 1fr' }}>
      {/* Left Column: Conversational Policy Co-Pilot Chat */}
      <section id="copilot-playground" className="glass-panel animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: 0 }}>
        <div className="card-header" style={{ borderBottom: '1px solid hsl(var(--border-color))', paddingBottom: '0.75rem' }}>
          <h2 className="card-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ color: 'hsl(var(--primary))', filter: 'drop-shadow(0 0 8px hsla(var(--primary), 0.45))', display: 'flex', alignItems: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </span>
            Conversational Policy Co-Pilot
          </h2>
          <span className="status-badge status-completed" style={{ background: 'hsla(var(--success), 0.08)', borderColor: 'hsla(var(--success), 0.3)', color: 'hsl(var(--success))' }}>
            Gemini Active
          </span>
        </div>

        <div className="chat-container">
          <div className="chat-messages">
            {chatMessages.map((msg, idx) => (
              <div 
                key={msg.id || idx} 
                className={`chat-bubble ${msg.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'}`}
              >
                <div style={{ wordBreak: 'break-word' }}>{msg.text}</div>
                
                {msg.cedarCode && (
                  <div className="chat-policy-box">
                    <div className="chat-policy-header">
                      <span>Suggested Cedar Policy</span>
                      <span style={{ fontSize: '0.6rem', color: '#888' }}>WASM Validated</span>
                    </div>
                    <pre className="chat-policy-code">{msg.cedarCode}</pre>
                    <div className="chat-policy-actions">
                      <button 
                        className="chat-policy-btn chat-policy-btn-sim"
                        onClick={() => {
                          setSimDraftPolicy(msg.cedarCode || '');
                          setSimOverrideMode(true);
                          setConsoleLines(prev => [
                            ...prev,
                            `🤖 [Co-Pilot] Chat suggested policy successfully loaded into visual simulator override draft.`
                          ]);
                          alert('Policy loaded in Visual Draft Simulator! You can now run evaluation dry-runs.');
                        }}
                      >
                        Simulate Draft
                      </button>
                      {authRole === 'admin' && (
                        <button 
                          className="chat-policy-btn chat-policy-btn-apply"
                          onClick={async () => {
                            if (!confirm('Apply this policy to active production policy.cedar?')) return;
                            try {
                              setChatApplyLoading(true);
                              const res = await fetch(`${API_BASE}/policy/apply`, {
                                method: 'POST',
                                headers: getHeaders(),
                                body: JSON.stringify({ policyCode: msg.cedarCode })
                              });
                              if (res.ok) {
                                const data = await res.json();
                                setConsoleLines(prev => [
                                  ...prev,
                                  `✅ [SecOps] Policy applied successfully from chat recommendation! Committed to policy.cedar.`,
                                  `🛡️ Active rule count reloaded: ${data.rulesCount}`
                                ]);
                                fetchData();
                              } else {
                                const err = await res.json();
                                alert(`Failed to apply policy: ${err.error || err.message}`);
                              }
                            } catch (err: any) {
                              alert(`Error applying policy: ${err.message}`);
                            } finally {
                              setChatApplyLoading(false);
                            }
                          }}
                          disabled={chatApplyLoading}
                        >
                          {chatApplyLoading ? 'Applying...' : 'Commit to Prod'}
                        </button>
                      )}
                    </div>
                  </div>
                )}
                <div className="chat-bubble-meta">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            
            {chatLoading && (
              <div className="chat-typing-bubble">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              if (!chatInput.trim() || chatLoading) return;
              const promptVal = chatInput;
              setChatInput('');
              setChatLoading(true);
              
              try {
                // Add user message to UI immediately for responsive feel
                const tempUserMsg: ChatMessage = {
                  id: `msg_temp_u`,
                  sender: 'user',
                  timestamp: new Date().toISOString(),
                  text: promptVal
                };
                setChatMessages(prev => [...prev, tempUserMsg]);

                const res = await fetch(`${API_BASE}/policy/chat`, {
                  method: 'POST',
                  headers: getHeaders(),
                  body: JSON.stringify({ prompt: promptVal })
                });

                if (res.ok) {
                  await res.json();
                  const historyRes = await fetch(`${API_BASE}/policy/chat-history`, { headers: getHeaders() });
                  if (historyRes.ok) {
                    const historyData = await historyRes.json() as ChatMessage[];
                    setChatMessages(() => historyData);
                  }
                } else {
                  const err = await res.json();
                  if (res.status === 400 && err.error === 'Prompt validation failed') {
                    setConsoleLines(prev => [
                      ...prev,
                      `🛡️ [CHAT FIREWALL BLOCKED]: Intercepted malicious injection attempt: "${err.message || 'Adversarial jailbreak patterns detected.'}"`
                    ]);
                    alert(`Security Block: ${err.message || 'Adversarial jailbreak patterns detected.'}`);
                  } else {
                    alert(`Failed to send message: ${err.error || err.message}`);
                  }
                  const historyRes = await fetch(`${API_BASE}/policy/chat-history`, { headers: getHeaders() });
                  if (historyRes.ok) {
                    const historyData = await historyRes.json() as ChatMessage[];
                    setChatMessages(() => historyData);
                  }
                }
              } catch (err: any) {
                console.error(err);
                alert('Network error sending chat message');
              } finally {
                setChatLoading(false);
              }
            }}
            className="chat-input-area"
          >
            <input 
              type="text" 
              className="chat-input-field"
              placeholder={authRole === 'unauthenticated' ? 'Authenticate via OIDC Widget to chat...' : 'Ask Co-Pilot to write a policy...'}
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              disabled={authRole === 'unauthenticated' || chatLoading}
            />
            <button 
              type="submit" 
              className="chat-send-btn"
              disabled={authRole === 'unauthenticated' || chatLoading || !chatInput.trim()}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </form>
        </div>
      </section>

      {/* Middle Column: Live + Draft Cedar Policy Simulator */}
      <section id="policy-simulator" className="glass-panel" style={{ marginTop: 0 }}>
        <div className="card-header">
          <h2 className="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'hsl(var(--primary))', filter: 'drop-shadow(0 0 8px hsla(var(--primary), 0.4))' }}>
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Live + Draft Cedar Policy Simulator
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="status-badge status-completed">Dual-Mode Active</span>
          </div>
        </div>
        
        <div className="card-body">
          <form onSubmit={handleSimulate}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem', background: 'rgba(0,0,0,0.2)', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid hsl(var(--border-color))' }}>
              <input 
                type="checkbox" 
                id="simOverrideMode" 
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                checked={simOverrideMode} 
                onChange={e => setSimOverrideMode(e.target.checked)} 
              />
              <label htmlFor="simOverrideMode" style={{ fontSize: '0.86rem', fontWeight: '600', color: '#fff', cursor: 'pointer', margin: 0 }}>
                Enable Custom Draft Policy Overlay (In-Memory Dry Run)
              </label>
            </div>

            {simOverrideMode && (
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label>Draft Policy Overlay Editor (policy.cedar)</label>
                <textarea 
                  className="form-control" 
                  style={{ height: '260px', fontFamily: 'monospace', fontSize: '0.8rem', resize: 'vertical', background: 'rgba(0,0,0,0.5)', border: '1px solid hsla(var(--primary), 0.3)' }}
                  value={simDraftPolicy}
                  onChange={e => setSimDraftPolicy(e.target.value)}
                  placeholder="Enter Cedar policies here..."
                />
                <span style={{ fontSize: '0.72rem', color: 'hsl(var(--text-muted))', marginTop: '0.3rem' }}>
                  * Draft modifications remain isolated strictly in-memory and will not overwrite the production policy on disk.
                </span>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="simPrincipal">Mock Principal (User / Role Identity)</label>
                <select 
                  id="simPrincipal" 
                  className="form-control"
                  value={simPrincipal}
                  onChange={e => setSimPrincipal(e.target.value)}
                >
                  <option value="sb:issuer:agent-80">sb:issuer:agent-80 (Tier 4 Security Agent)</option>
                  <option value="sb:issuer:pm-sme">sb:issuer:pm-sme (Product Owner)</option>
                  <option value="sb:issuer:architecture-sme">sb:issuer:architecture-sme (Architect)</option>
                  <option value="sb:issuer:devops-sme">sb:issuer:devops-sme (DevOps / SRE)</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="simToolName">Mock Action (Tool Name Call)</label>
                <select 
                  id="simToolName" 
                  className="form-control"
                  value={simToolName}
                  onChange={e => setSimToolName(e.target.value)}
                >
                  <option value="write_file">write_file (Modify Files)</option>
                  <option value="execute_command">execute_command (Shell Execution)</option>
                  <option value="read_file">read_file (Read Files)</option>
                  <option value="list_dir">list_dir (Inspect Directory)</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="simArgs">Mock Tool Arguments (JSON)</label>
                <textarea 
                  id="simArgs"
                  className="form-control" 
                  style={{ height: '76px', fontFamily: 'monospace', fontSize: '0.8rem', resize: 'none' }}
                  value={simArgs}
                  onChange={e => setSimArgs(e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="simContext">Stateful Context Properties (JSON)</label>
                <textarea 
                  id="simContext"
                  className="form-control" 
                  style={{ height: '76px', fontFamily: 'monospace', fontSize: '0.8rem', resize: 'none' }}
                  value={simContext}
                  onChange={e => setSimContext(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '0.5rem', background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsla(var(--primary), 0.7) 100%)' }} 
              disabled={simLoading}
            >
              {simLoading ? 'Evaluating Rules...' : 'Evaluate Permission Gate'}
            </button>
          </form>

          {simResult && (
            <div 
              className="animate-fade-in" 
              style={{ 
                marginTop: '1.5rem', 
                padding: '1.25rem', 
                borderRadius: '12px',
                border: simResult.decision === 'allow' ? '1px solid rgba(0, 255, 102, 0.25)' : '1px solid rgba(255, 107, 107, 0.25)',
                background: simResult.decision === 'allow' ? 'rgba(0, 255, 102, 0.04)' : 'rgba(255, 107, 107, 0.04)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#fff' }}>Evaluation Diagnostics:</span>
                <span 
                  className={`status-badge ${simResult.decision === 'allow' ? 'status-completed' : 'status-failed'}`}
                  style={{ 
                    fontSize: '0.86rem', 
                    padding: '0.25rem 0.75rem',
                    boxShadow: simResult.decision === 'allow' ? '0 0 10px rgba(0, 255, 102, 0.3)' : '0 0 10px rgba(255, 107, 107, 0.3)'
                  }}
                >
                  {simResult.decision.toUpperCase()}
                </span>
              </div>
              
              <div style={{ fontSize: '0.86rem', color: '#fff', fontFamily: 'monospace', marginBottom: '0.8rem', lineHeight: '1.45', wordBreak: 'break-word' }}>
                <strong>Reason: </strong> {simResult.reason}
              </div>

              {simResult.matchingPolicies && simResult.matchingPolicies.length > 0 && (
                <div>
                  <span style={{ fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'hsl(var(--text-secondary))', display: 'block', marginBottom: '0.4rem' }}>
                    Satisfied Matching Policies:
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {simResult.matchingPolicies.map((policy: string, idx: number) => (
                      <div key={idx} style={{ fontSize: '0.76rem', color: 'hsl(var(--text-secondary))', padding: '0.4rem 0.6rem', background: 'rgba(0,0,0,0.3)', borderLeft: '3px solid hsl(var(--primary))', borderRadius: '4px', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                        {policy}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Right Column: Active Production Policy Code */}
      <section className="glass-panel" style={{ display: 'flex', flexDirection: 'column', marginTop: 0 }}>
        <div className="card-header">
          <h2 className="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'hsl(var(--success))' }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            Active Production Policy Code (ReadOnly)
          </h2>
          <span className="status-badge status-completed">Live from policy.cedar</span>
        </div>
        <div className="card-body" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', padding: 0 }}>
          <pre style={{ margin: 0, padding: '1.5rem', background: '#020306', color: '#00ff66', fontFamily: 'monospace', fontSize: '0.82rem', lineHeight: '1.55', whiteSpace: 'pre-wrap', flexGrow: 1, overflowY: 'auto', border: 'none', borderRadius: '0 0 16px 16px', minHeight: '400px' }}>
            {activePolicyCode || 'No active policy loaded.'}
          </pre>
        </div>
      </section>
    </div>
  );
}
