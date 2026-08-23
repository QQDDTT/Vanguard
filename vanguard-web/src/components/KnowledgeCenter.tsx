import { useEffect, useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Tag, 
  Sparkles, 
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';

export interface KnowledgeItem {
  id: string;
  title: string;
  summary: string;
  keywords: string[];
  category: string;
  content: string;
  confidence: number;
  source_engagement_id?: string | null;
  created_at: string;
}

const CATEGORIES = [
  { key: 'ALL', label: '全部知识', color: '#94a3b8' },
  { key: 'CUSTOMER_PATTERN', label: '客户模式与隐性动机', color: '#a855f7' },
  { key: 'INDUSTRY_BACKGROUND', label: '行业背景与业务规则', color: '#38bdf8' },
  { key: 'METHODOLOGY', label: '访谈方法与引导技巧', color: '#fbbf24' },
  { key: 'CASE_STUDY', label: '交付案例与约束沉淀', color: '#34d399' },
  { key: 'COMPETITOR_INSIGHT', label: '竞品洞察与替代方案', color: '#f87171' },
];

export function KnowledgeCenter() {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // 新建知识弹窗
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('CUSTOMER_PATTERN');
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newKeywords, setNewKeywords] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchKnowledge = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/v1/knowledge', window.location.origin);
      if (searchQuery) url.searchParams.set('q', searchQuery);
      if (selectedCategory !== 'ALL') url.searchParams.set('category', selectedCategory);
      
      const res = await fetch(url.toString());
      const data = await res.json();
      setItems(data.data.map((d: any) => d.item || d));
    } catch (e) {
      console.error('Failed to load knowledge items', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKnowledge();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchKnowledge();
  };

  const handleCreateKnowledge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    setSubmitting(true);
    try {
      const keywords = newKeywords.split(/[,，\s]+/).filter(Boolean);
      const res = await fetch('/api/v1/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          summary: newSummary.trim() || newTitle.trim(),
          category: newCategory,
          content: newContent.trim(),
          keywords
        })
      });
      if (res.ok) {
        setIsModalOpen(false);
        setNewTitle('');
        setNewSummary('');
        setNewContent('');
        setNewKeywords('');
        fetchKnowledge();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryLabel = (cat: string) => {
    const found = CATEGORIES.find(c => c.key === cat);
    return found ? found.label : cat;
  };

  const getCategoryColor = (cat: string) => {
    const found = CATEGORIES.find(c => c.key === cat);
    return found ? found.color : '#38bdf8';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '32px' }}>
      {/* 顶部标题与新建按钮 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookOpen size={24} color="#38bdf8" />
            FBE 团队原子化知识库 (Atomic Knowledge Base)
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
            专为 Agent 混合检索 (RAG) 优化的结构化高密度经验资产
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 18px',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)'
          }}
        >
          <Plus size={16} /> 录入原子知识
        </button>
      </div>

      {/* 搜索栏与分类过滤器 */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.65)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        backdropFilter: 'blur(8px)'
      }}>
        {/* 搜索框 */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px' }}>
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '8px',
            padding: '0 12px',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <Search size={18} color="#94a3b8" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="搜索原子知识（标题、关键词、内容、隐性动机模式）..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                padding: '10px 0',
                color: '#f8fafc',
                outline: 'none',
                fontSize: '0.9rem'
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '8px',
              padding: '0 18px',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '0.9rem'
            }}
          >
            检索
          </button>
        </form>

        {/* 分类标签过滤 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                style={{
                  background: isSelected ? `${cat.color}25` : 'rgba(255, 255, 255, 0.04)',
                  color: isSelected ? cat.color : '#94a3b8',
                  border: isSelected ? `1px solid ${cat.color}60` : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '6px 14px',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontWeight: isSelected ? 600 : 400
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 知识卡片列表 */}
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
          正在加载原子化知识库...
        </div>
      ) : items.length === 0 ? (
        <div style={{
          padding: '60px',
          textAlign: 'center',
          background: 'rgba(15, 23, 42, 0.4)',
          borderRadius: '12px',
          border: '1px dashed rgba(255, 255, 255, 0.1)',
          color: '#94a3b8'
        }}>
          未找到匹配的知识条目。您可以在上方「录入原子知识」或从现场洞察中一键提炼。
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '16px' }}>
          {items.map(item => {
            const isExpanded = expandedId === item.id;
            const catColor = getCategoryColor(item.category);

            return (
              <div
                key={item.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s ease',
                  borderTop: `3px solid ${catColor}`
                }}
              >
                {/* 标题与分类 */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', color: '#f8fafc', fontWeight: 600, lineHeight: 1.4 }}>
                    {item.title}
                  </h3>
                  <span style={{
                    background: `${catColor}20`,
                    color: catColor,
                    border: `1px solid ${catColor}40`,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    whiteSpace: 'nowrap',
                    fontWeight: 500
                  }}>
                    {getCategoryLabel(item.category)}
                  </span>
                </div>

                {/* 摘要 */}
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                  {item.summary}
                </p>

                {/* 关键词标签 */}
                {item.keywords && item.keywords.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {item.keywords.map((kw, i) => (
                      <span
                        key={i}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          color: '#94a3b8',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                      >
                        <Tag size={10} /> {kw}
                      </span>
                    ))}
                  </div>
                )}

                {/* 展开详细正文 */}
                {isExpanded && (
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.35)',
                    borderRadius: '8px',
                    padding: '12px',
                    fontSize: '0.85rem',
                    color: '#e2e8f0',
                    lineHeight: '1.6',
                    borderLeft: `2px solid ${catColor}`,
                    whiteSpace: 'pre-wrap'
                  }}>
                    {item.content}
                  </div>
                )}

                {/* 卡片底栏 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 'auto',
                  paddingTop: '8px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  fontSize: '0.75rem',
                  color: '#64748b'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Sparkles size={12} color={catColor} /> 置信度 {(item.confidence * 100).toFixed(0)}%
                  </span>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#38bdf8',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {isExpanded ? '收起详情' : '展开详情'}
                    {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 录入原子知识模态弹窗 */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 8, 15, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '24px'
        }}>
          <div style={{
            background: '#0f172a',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '600px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#f8fafc' }}>
                录入原子化知识 (Atomic Knowledge)
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateKnowledge} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                  知识条目标题 *
                </label>
                <input
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="例如：B2B 决策者隐性顾虑：管理控制权丧失"
                  style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#f8fafc',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                  知识显式分类 *
                </label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#f8fafc',
                    outline: 'none'
                  }}
                >
                  <option value="CUSTOMER_PATTERN">CUSTOMER_PATTERN (客户隐性动机与常见顾虑)</option>
                  <option value="INDUSTRY_BACKGROUND">INDUSTRY_BACKGROUND (行业背景与业务规则)</option>
                  <option value="METHODOLOGY">METHODOLOGY (采访与引导技巧)</option>
                  <option value="CASE_STUDY">CASE_STUDY (经典交付案例与约束沉淀)</option>
                  <option value="COMPETITOR_INSIGHT">COMPETITOR_INSIGHT (竞品优劣势与替换策略)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                  一句话摘要
                </label>
                <input
                  value={newSummary}
                  onChange={e => setNewSummary(e.target.value)}
                  placeholder="单句总结核心现象与应对模式"
                  style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#f8fafc',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                  原子正文内容 (200-500字) *
                </label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="详细描述核心现象、判定信号与应对策略..."
                  style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#f8fafc',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                  关键词 (用逗号分隔)
                </label>
                <input
                  value={newKeywords}
                  onChange={e => setNewKeywords(e.target.value)}
                  placeholder="例如：B2B, 控制权, 隐性需求"
                  style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#f8fafc',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    color: '#94a3b8',
                    cursor: 'pointer'
                  }}
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    background: 'linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 20px',
                    color: '#fff',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    fontWeight: 600
                  }}
                >
                  {submitting ? '提交中...' : '确认录入'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
