import { useState } from 'react';
import { createEngagement } from '../lib/dataconnect';
import { dataConnect } from '../lib/firebase';
import { 
  PlusCircle, 
  MessageSquare, 
  Server, 
  Target, 
  Wrench, 
  FileCheck 
} from 'lucide-react';

interface Props {
  onCreated: () => void;
}

export const ENGAGEMENT_TYPES = [
  {
    key: 'INTERVIEW',
    label: '客户访谈与需求挖掘',
    desc: '现场对话速记与七维度显性/隐性需求提炼',
    icon: MessageSquare,
    color: '#38bdf8'
  },
  {
    key: 'INFRA_SURVEY',
    label: '现场勘测与拓扑审计',
    desc: '机房服务器 Specs、网络隔离与部署依赖 Gap 诊断',
    icon: Server,
    color: '#a855f7'
  },
  {
    key: 'POC_TRACKING',
    label: 'PoC 试点与卡点追踪',
    desc: '用例达成率评估与技术 Blocker 归因矩阵',
    icon: Target,
    color: '#fbbf24'
  },
  {
    key: 'TROUBLESHOOTING',
    label: '现场排障与知识萃取',
    desc: '终端报错 RCA 根因分析、探针诊断与补丁生成',
    icon: Wrench,
    color: '#f87171'
  },
  {
    key: 'SOW_PROPOSAL',
    label: 'SOW 实施提案与复盘',
    desc: '交付范围评估、工期测算与增购机会挖掘',
    icon: FileCheck,
    color: '#34d399'
  }
];

export function CreateEngagement({ onCreated }: Props) {
  const [name, setName] = useState('');
  const [type, setType] = useState('INTERVIEW');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await createEngagement(dataConnect, {
        customerName: name.trim(),
        title: name.trim(),
        teamId: 'test-team',
        type: type as any,
      });
      setName('');
      onCreated();
    } catch (err) {
      console.error("Failed to create engagement:", err);
      alert("创建事务失败，请检查连接状态。");
    } finally {
      setLoading(false);
    }
  };

  const currentTypeConfig = ENGAGEMENT_TYPES.find(t => t.key === type) || ENGAGEMENT_TYPES[0];

  return (
    <form className="glass-panel animate-fade-in" onSubmit={handleSubmit} style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="输入新现场事务/客户名称（例如：某头部量化机构回测集群交付）..." 
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ flex: 1 }}
        />
        
        <select 
          value={type} 
          onChange={(e) => setType(e.target.value)} 
          style={{ 
            width: '260px',
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            padding: '10px 12px'
          }}
        >
          {ENGAGEMENT_TYPES.map(t => (
            <option key={t.key} value={t.key}>
              {t.label}
            </option>
          ))}
        </select>
        
        <button type="submit" className="primary" disabled={loading} style={{ whiteSpace: 'nowrap' }}>
          <PlusCircle size={18} />
          {loading ? '创建中...' : '新建 FBE 事务'}
        </button>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.82rem',
        color: '#94a3b8',
        paddingLeft: '4px'
      }}>
        <span style={{ color: currentTypeConfig.color, fontWeight: 500 }}>
          💡 当前事务目标：
        </span>
        <span>{currentTypeConfig.desc}</span>
      </div>
    </form>
  );
}
