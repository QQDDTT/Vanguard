import { useState } from 'react';
import { EngagementList } from './components/EngagementList';
import { CreateEngagement } from './components/CreateEngagement';
import { EngagementDetail } from './components/EngagementDetail';
import { AuthGuard } from './components/AuthGuard';
import { Terminal, ShieldCheck, LogOut } from 'lucide-react';
import './index.css';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeEngagement, setActiveEngagement] = useState<string | null>(null);

  const handleCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <AuthGuard>
      {({ session, logout }) => (
        <div>
          <header className="app-header">
            <div className="app-title">
              <Terminal size={32} color="var(--color-accent)" />
              <span>Vanguard FBE Platform</span>
            </div>

            <div className="header-status-area">
              <div className="emulator-status-pill">
                <div className="status-dot online"></div>
                <span>Data Connect Active</span>
              </div>

              <div className="security-badge-pill">
                <ShieldCheck size={14} color="var(--color-success)" />
                <span>2FA Verified ({session.username})</span>
              </div>

              <button
                type="button"
                className="logout-btn"
                onClick={logout}
                title="安全退出当前 2FA 会话"
              >
                <LogOut size={15} />
                <span>退出登录</span>
              </button>
            </div>
          </header>

          <main>
            {!activeEngagement ? (
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
