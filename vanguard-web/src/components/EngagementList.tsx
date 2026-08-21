import { useEffect, useState } from 'react';
import { listEngagements } from '../lib/dataconnect';
import { dataConnect } from '../lib/firebase';
import { FileText, Cpu, CheckCircle } from 'lucide-react';

interface Engagement {
  id: string;
  customerName: string;
  title?: string | null;
  type: any;
  status: any;
  createdAt: string;
}

interface EngagementListProps {
  onSelect?: (id: string) => void;
}

export function EngagementList({ onSelect }: EngagementListProps) {
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Query engagements from Data Connect
        const res = await listEngagements(dataConnect, { teamId: 'test-team' });
        setEngagements(res.data.engagements as any[]);
      } catch (err) {
        console.error("Failed to load engagements:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleAnalyze = async (id: string) => {
    if (onSelect) {
      onSelect(id);
    }
  };

  if (loading) {
    return <div className="glass-panel animate-fade-in" style={{ textAlign: 'center', padding: '40px' }}>Loading Data Connect...</div>;
  }

  if (engagements.length === 0) {
    return (
      <div className="glass-panel animate-fade-in" style={{ textAlign: 'center', padding: '40px' }}>
        <h3 style={{ color: 'var(--color-text-secondary)' }}>No active engagements found.</h3>
        <p style={{ fontSize: '0.9em' }}>Create a new engagement to begin field operations.</p>
      </div>
    );
  }

  return (
    <div className="engagement-grid">
      {engagements.map((eng) => (
        <div key={eng.id} className="glass-panel engagement-card animate-fade-in">
          <div className="engagement-header">
            <h3 className="card-title">{eng.title || eng.customerName}</h3>
            <span className={`status-badge status-${eng.status}`}>
              {eng.status}
            </span>
          </div>
          
          <div className="card-meta">
            <FileText size={14} /> 
            <span>{eng.type}</span>
            <span style={{ margin: '0 8px', color: 'var(--color-border)' }}>|</span>
            <span>{new Date(eng.createdAt).toLocaleDateString()}</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button className="primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => handleAnalyze(eng.id)}>
              <Cpu size={16} /> Analyze
            </button>
            {eng.status !== 'CLOSED' && (
              <button style={{ flex: 1, justifyContent: 'center' }}>
                <CheckCircle size={16} /> Close
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
