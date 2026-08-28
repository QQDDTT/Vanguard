import { useState } from 'react';
import { EngagementList } from './components/EngagementList';
import { CreateEngagement } from './components/CreateEngagement';
import { EngagementDetail } from './components/EngagementDetail';
import { KnowledgeCenter } from './components/KnowledgeCenter';
import { TokenUsageModal } from './components/TokenUsageModal';
import { VanguardLogo } from './components/VanguardLogo';
import { ShieldCheck, FolderKanban, BookOpen, Coins } from 'lucide-react';
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
    <div>
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div className="app-title">
            <VanguardLogo size={32} />
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
                setActiveEngagement(null);
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
              业务专家知识库
            </button>
          </nav>
        </div>

        <div className="header-meta" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Gemini Token 用量与预算预警入口 */}
          <button
            type="button"
            onClick={() => setShowTokenModal(true)}
            style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(217, 119, 6, 0.25))',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              color: '#fbbf24',
              borderRadius: '20px',
              padding: '4px 12px',
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
            <span>Omni-Gate 零信任已接入</span>
          </div>
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
  );
}

export default App;
