import { useState } from 'react';
import { EngagementList } from './components/EngagementList';
import { CreateEngagement } from './components/CreateEngagement';
import { EngagementDetail } from './components/EngagementDetail';
import { Terminal } from 'lucide-react';
import './index.css';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeEngagement, setActiveEngagement] = useState<string | null>(null);

  const handleCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div>
      <header className="app-header">
        <div className="app-title">
          <Terminal size={32} color="var(--color-accent)" />
          Vanguard FBE Platform
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-success)', boxShadow: '0 0 10px var(--color-success)' }}></div>
          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Data Connect Emulator Active</span>
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
  );
}

export default App;
