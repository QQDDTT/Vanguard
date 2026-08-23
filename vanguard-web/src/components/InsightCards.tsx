import React, { useState } from 'react';
import { 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Flame, 
  Heart, 
  Users, 
  ShieldAlert,
  Copy,
  Check,
  BookMarked,
  CheckCheck
} from 'lucide-react';

export interface SevenDimensionsInsightData {
  functional?: string[];
  pain_points?: string[];
  jobs_to_be_done?: string[];
  latent_desires?: string[];
  emotional_needs?: string[];
  social_needs?: string[];
  constraints?: string[];
}

interface InsightCardsProps {
  insight: SevenDimensionsInsightData;
}

interface DimensionConfig {
  key: keyof SevenDimensionsInsightData;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size: number; color?: string; className?: string }>;
  color: string;
  bgColor: string;
  borderColor: string;
}

const DIMENSIONS: DimensionConfig[] = [
  {
    key: 'functional',
    title: '显性功能诉求 (Functional)',
    subtitle: '客户明确表达的系统规格、特性与操作流程',
    icon: CheckCircle2,
    color: '#38bdf8',
    bgColor: 'rgba(56, 189, 248, 0.08)',
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },
  {
    key: 'pain_points',
    title: '核心痛点卡点 (Pain Points)',
    subtitle: '现有工作流中极度低效、易错或阻碍业务推进的环节',
    icon: AlertCircle,
    color: '#f87171',
    bgColor: 'rgba(248, 113, 113, 0.08)',
    borderColor: 'rgba(248, 113, 113, 0.25)',
  },
  {
    key: 'jobs_to_be_done',
    title: '待办任务框架 (JTBD)',
    subtitle: '客户在特定场景下真正试图达成的终极目标与价值',
    icon: Flame,
    color: '#fbbf24',
    bgColor: 'rgba(251, 191, 36, 0.08)',
    borderColor: 'rgba(251, 191, 36, 0.25)',
  },
  {
    key: 'latent_desires',
    title: '隐性潜在欲望 (Latent Desires)',
    subtitle: '未言明但渴望获得的极致体验、竞争优势或自动化程度',
    icon: Sparkles,
    color: '#a855f7',
    bgColor: 'rgba(168, 85, 247, 0.08)',
    borderColor: 'rgba(168, 85, 247, 0.25)',
  },
  {
    key: 'emotional_needs',
    title: '情绪心理诉求 (Emotional)',
    subtitle: '关键利益相关者对确定性、掌控感、减负及信任的期望',
    icon: Heart,
    color: '#ec4899',
    bgColor: 'rgba(236, 72, 153, 0.08)',
    borderColor: 'rgba(236, 72, 153, 0.25)',
  },
  {
    key: 'social_needs',
    title: '组织与社交属性 (Social)',
    subtitle: '在团队协作、部门汇报与组织内部认同层面的诉求',
    icon: Users,
    color: '#34d399',
    bgColor: 'rgba(52, 211, 153, 0.08)',
    borderColor: 'rgba(52, 211, 153, 0.25)',
  },
  {
    key: 'constraints',
    title: '合规与约束边界 (Constraints)',
    subtitle: '架构、技术栈、网络隔离、预算周期及企业制度限制',
    icon: ShieldAlert,
    color: '#94a3b8',
    bgColor: 'rgba(148, 163, 184, 0.08)',
    borderColor: 'rgba(148, 163, 184, 0.25)',
  },
];

export function InsightCards({ insight }: InsightCardsProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [promotedSet, setPromotedSet] = useState<Set<string>>(new Set());
  const [promotingKey, setPromotingKey] = useState<string | null>(null);

  const handleCopy = (dim: DimensionConfig, items: string[]) => {
    const text = `【${dim.title}】\n` + items.map((it, i) => `${i + 1}. ${it}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedKey(dim.key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handlePromote = async (dimKey: string, itemText: string, idx: number) => {
    const itemKey = `${dimKey}-${idx}`;
    if (promotedSet.has(itemKey)) return;

    setPromotingKey(itemKey);
    try {
      const res = await fetch('/api/v1/insights/promote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dimension: dimKey,
          content: itemText,
          title: itemText.length > 25 ? `${itemText.slice(0, 25)}...` : itemText
        })
      });

      if (res.ok) {
        setPromotedSet(prev => new Set(prev).add(itemKey));
      }
    } catch (err) {
      console.error('Failed to promote insight', err);
    } finally {
      setPromotingKey(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} color="#38bdf8" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#f1f5f9', fontWeight: 600 }}>
            七维度需求洞察分析矩阵 (Seven Dimensions Insight)
          </h3>
        </div>
        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
          支持一键 Promote 沉淀为团队原子化知识
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '16px'
      }}>
        {DIMENSIONS.map(dim => {
          const items = insight[dim.key] || [];
          if (items.length === 0) return null;
          const Icon = dim.icon;
          const isCopied = copiedKey === dim.key;

          return (
            <div
              key={dim.key}
              style={{
                background: dim.bgColor,
                border: `1px solid ${dim.borderColor}`,
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                backdropFilter: 'blur(8px)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    background: 'rgba(0,0,0,0.3)',
                    padding: '8px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={18} color={dim.color} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#f8fafc', fontWeight: 600 }}>
                      {dim.title}
                    </h4>
                    <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
                      {dim.subtitle}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(dim, items)}
                  title="复制本维度全部项"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '6px',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  {isCopied ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                {items.map((item, idx) => {
                  const itemKey = `${dim.key}-${idx}`;
                  const isPromoted = promotedSet.has(itemKey);
                  const isPromoting = promotingKey === itemKey;

                  return (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(15, 23, 42, 0.6)',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        borderLeft: `3px solid ${dim.color}`
                      }}
                    >
                      <div style={{
                        fontSize: '0.88rem',
                        color: '#e2e8f0',
                        lineHeight: '1.5'
                      }}>
                        {item}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2px' }}>
                        <button
                          onClick={() => handlePromote(dim.key, item, idx)}
                          disabled={isPromoted || isPromoting}
                          style={{
                            background: isPromoted 
                              ? 'rgba(52, 211, 153, 0.15)' 
                              : 'rgba(255, 255, 255, 0.05)',
                            color: isPromoted ? '#34d399' : '#94a3b8',
                            border: isPromoted 
                              ? '1px solid rgba(52, 211, 153, 0.3)' 
                              : '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '4px',
                            padding: '3px 8px',
                            fontSize: '0.72rem',
                            cursor: isPromoted || isPromoting ? 'default' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.2s'
                          }}
                        >
                          {isPromoted ? (
                            <>
                              <CheckCheck size={12} /> 已沉淀为知识库
                            </>
                          ) : (
                            <>
                              <BookMarked size={12} color="#38bdf8" /> 
                              {isPromoting ? '萃取沉淀中...' : '提炼为团队知识'}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
