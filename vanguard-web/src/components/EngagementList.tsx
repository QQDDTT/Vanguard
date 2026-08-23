import { useEffect, useState } from 'react';
import { listEngagements } from '../lib/dataconnect';
import { dataConnect } from '../lib/firebase';
import { 
  Cpu, 
  CheckCircle, 
  Calendar,
  Layers
} from 'lucide-react';
import { ENGAGEMENT_TYPES } from './CreateEngagement';

interface Engagement {
  id: string;
  customerName: string;
  title?: string | null;
  type: string;
  status: string;
  createdAt: string;
}

interface EngagementListProps {
  key?: any;
  onSelect?: (id: string) => void;
}

export function EngagementList({ onSelect }: EngagementListProps) {
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('ALL');

  useEffect(() => {
    async function loadData() {
      try {
        const res = await listEngagements(dataConnect, { teamId: 'test-team' });
        setEngagements((res.data.engagements as any[]) || []);
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

  const getTypeMeta = (typeStr: string) => {
    const found = ENGAGEMENT_TYPES.find(t => t.key === typeStr);
    if (found) return found;
    return {
      key: typeStr,
      label: typeStr,
      desc: '',
      icon: Layers,
      color: '#38bdf8'
    };
  };

  const filtered = engagements.filter(e => {
    if (filterType === 'ALL') return true;
    return e.type === filterType;
  });

  if (loading) {
    return <div className="glass-panel animate-fade-in" style={{ textAlign: 'center', padding: '40px' }}>Loading Data Connect...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 事务类型过滤器 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap',
        background: 'rgba(15, 23, 42, 0.4)',
        padding: '10px 14px',
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <span style={{ fontSize: '0.85rem', color: '#94a3b8', marginRight: '4px' }}>
          事务类型筛选：
        </span>
        <button
          onClick={() => setFilterType('ALL')}
          style={{
            background: filterType === 'ALL' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            color: filterType === 'ALL' ? '#38bdf8' : '#94a3b8',
            border: filterType === 'ALL' ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '0.8rem',
            cursor: 'pointer'
          }}
        >
          全部 ({engagements.length})
        </button>
        {ENGAGEMENT_TYPES.map(t => {
          const count = engagements.filter(e => e.type === t.key).length;
          const isSelected = filterType === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setFilterType(t.key)}
              style={{
                background: isSelected ? `${t.color}25` : 'rgba(255, 255, 255, 0.04)',
                color: isSelected ? t.color : '#94a3b8',
                border: isSelected ? `1px solid ${t.color}60` : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              {t.label} ({count})
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="glass-panel animate-fade-in" style={{ textAlign: 'center', padding: '40px' }}>
          <h3 style={{ color: 'var(--color-text-secondary)' }}>暂无匹配的现场事务</h3>
          <p style={{ fontSize: '0.9em' }}>在上方创建新事务即可开启现场 FBE 智能作业流水线。</p>
        </div>
      ) : (
        <div className="engagement-grid">
          {filtered.map((eng) => {
            const meta = getTypeMeta(eng.type);
            const Icon = meta.icon;

            return (
              <div key={eng.id} className="glass-panel engagement-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="engagement-header">
                  <h3 className="card-title" style={{ margin: 0, fontSize: '1.05rem', color: '#f8fafc' }}>
                    {eng.title || eng.customerName}
                  </h3>
                  <span className={`status-badge status-${eng.status}`}>
                    {eng.status}
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  margin: '10px 0 6px',
                  fontSize: '0.8rem'
                }}>
                  <span style={{
                    background: `${meta.color}20`,
                    color: meta.color,
                    border: `1px solid ${meta.color}40`,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 500
                  }}>
                    <Icon size={12} />
                    {meta.label}
                  </span>
                </div>

                <div className="card-meta" style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <Calendar size={13} />
                  <span>{new Date(eng.createdAt).toLocaleDateString()}</span>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                  <button 
                    className="primary" 
                    style={{ flex: 1, justifyContent: 'center', fontSize: '0.88rem' }} 
                    onClick={() => handleAnalyze(eng.id)}
                  >
                    <Cpu size={15} /> 启动现场智能分析
                  </button>
                  {eng.status !== 'CLOSED' && (
                    <button style={{ flex: 0.4, justifyContent: 'center', fontSize: '0.88rem' }}>
                      <CheckCircle size={15} /> 归档
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
