import { useState } from 'react';
import { EngagementList } from './components/EngagementList';
import { CreateEngagement } from './components/CreateEngagement';
import { EngagementDetail } from './components/EngagementDetail';
import { KnowledgeCenter } from './components/KnowledgeCenter';
import { AuthGuard } from './components/AuthGuard';
import { TokenUsageModal } from './components/TokenUsageModal';
import { Terminal, ShieldCheck, LogOut, FolderKanban, BookOpen, Coins } from 'lucide-react';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState<'engagements' | 'knowledge'>('engagements');
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeEngagement, setActiveEngagement] = useState<string | null>(null);
  const [showTokenModal, setShowTokenModal] = useState(false);

  const handleCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <AuthGuard>
      {({ session, logout }) => (
        <div>
          <header className="app-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div className="app-title">
                <Terminal size={32} color="var(--color-accent)" />
                <span>Vanguard FBE Platform</span>
              </div>

              {/* 核心主功能导航 Tab */}
              <nav style={{
                display: 'flex',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                padding: '3px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <button
                  onClick={() => {
                    setActiveTab('engagements');
                  }}
                  style={{
                    background: activeTab === 'engagements' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                    color: activeTab === 'engagements' ? '#38bdf8' : '#94a3b8',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 14px',
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: activeTab === 'engagements' ? 600 : 400,
                    transition: 'all 0.2s'
                  }}
                >
                  <FolderKanban size={16} />
                  现场事务看板
                </button>

                <button
                  onClick={() => {
                    setActiveTab('knowledge');
                  }}
                  style={{
                    background: activeTab === 'knowledge' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                    color: activeTab === 'knowledge' ? '#38bdf8' : '#94a3b8',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 14px',
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: activeTab === 'knowledge' ? 600 : 400,
                    transition: 'all 0.2s'
                  }}
                >
                  <BookOpen size={16} />
                  团队原子知识库
                </button>
              </nav>
            </div>

            <div className="header-status-area">
              {/* Token 消耗与成本计量入口 */}
              <button
                type="button"
                onClick={() => setShowTokenModal(true)}
                style={{
                  background: 'rgba(251, 191, 36, 0.12)',
                  border: '1px solid rgba(251, 191, 36, 0.3)',
                  color: '#fbbf24',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  fontWeight: 500,
                  transition: 'all 0.2s'
                }}
                title="查看 Gemini API 实时 Token 消耗与预算水位"
              >
                <Coins size={14} />
                <span>Token 用量与预算</span>
              </button>

              <div className="emulator-status-pill">
                <div className="status-dot online"></div>
                <span>Data Connect Active</span>
              </div>

              <div className="security-badge-pill">
                <ShieldCheck size={14} color="var(--color-success)" />
                <span>2FA 认证生效 ({session.username})</span>
              </div>

              <button
                type="button"
                className="logout-btn"
                onClick={logout}
                title="安全注销当前 2FA 登录会话"
              >
                <LogOut size={15} />
                <span>注销</span>
              </button>
            </div>
          </header>

          <main>
            {showTokenModal && (
              <TokenUsageModal onClose={() => setShowTokenModal(false)} />
            )}

            {activeTab === 'knowledge' ? (
              <KnowledgeCenter />
            ) : !activeEngagement ? (
              <>
                <CreateEngagement onCreated={handleCreated} />
                <EngagementList 
                  key={refreshKey} 
                  onSelect={(id: string) => setActiveEngagement(id)} 
                />
              </>
            ) : (
              <EngagementDetail 
                engagementId={activeEngagement} 
                onBack={() => setActiveEngagement(null)} 
              />
            )}
          </main>
        </div>
      )}
    </AuthGuard>
  );
}

export default App;
