import { useState, useEffect } from 'react';
import { 
  X, 
  Coins, 
  TrendingUp, 
  Layers, 
  ShieldAlert, 
  Zap, 
  History
} from 'lucide-react';

interface TokenLogItem {
  id: string;
  engagement_id: string;
  model_name: string;
  input_tokens: number;
  output_tokens: number;
  cached_tokens: number;
  cost_usd: number;
  created_at: string;
}

interface TokenUsageData {
  summary: {
    total_input_tokens: number;
    total_output_tokens: number;
    total_cached_tokens: number;
    total_cost_usd: number;
    monthly_budget_usd: number;
    budget_usage_pct: number;
    calls_by_model: {
      gemini_2_5_pro: number;
      gemini_2_5_flash: number;
    };
  };
  recent_logs: TokenLogItem[];
}

interface TokenUsageModalProps {
  onClose: () => void;
}

export function TokenUsageModal({ onClose }: TokenUsageModalProps) {
  const [data, setData] = useState<TokenUsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/metrics/token-usage')
      .then(res => res.json())
      .then(resData => {
        if (resData.status === 'success') {
          setData(resData.data);
        }
      })
      .catch(err => console.error('Failed to load token usage', err))
      .finally(() => setLoading(false));
  }, []);

  const formatTokens = (tokens: number) => {
    if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(2)}M`;
    if (tokens >= 1_000) return `${(tokens / 1_000).toFixed(1)}k`;
    return `${tokens}`;
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px'
    }}>
      <div style={{
        background: '#0f172a',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '840px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden'
      }}>
        {/* 模态框头部 */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(30, 41, 59, 0.4)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'rgba(251, 191, 36, 0.15)',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex'
            }}>
              <Coins size={20} color="#fbbf24" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#f8fafc', fontWeight: 600 }}>
                Token 预算与实时用量监控
              </h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>
                基于 Gemini 2.5 Pro / Flash 计量模型与团队月度预算审计
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* 模态框内容区 */}
        <div style={{
          padding: '20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {loading || !data ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
              正在加载实时用量指标...
            </div>
          ) : (
            <>
              {/* 核心指标 4 网格 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                <div style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Zap size={14} color="#38bdf8" /> 累计消耗 Tokens
                  </span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f8fafc' }}>
                    {formatTokens(data.summary.total_input_tokens + data.summary.total_output_tokens)}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    入 {formatTokens(data.summary.total_input_tokens)} / 出 {formatTokens(data.summary.total_output_tokens)}
                  </span>
                </div>

                <div style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <TrendingUp size={14} color="#34d399" /> 累计推断成本 (USD)
                  </span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#34d399' }}>
                    ${data.summary.total_cost_usd.toFixed(4)}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    Context Caching 节省 ~40%
                  </span>
                </div>

                <div style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Layers size={14} color="#a855f7" /> 模型调用分流
                  </span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#a855f7' }}>
                    {data.summary.calls_by_model.gemini_2_5_pro} <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 400 }}>Pro / {data.summary.calls_by_model.gemini_2_5_flash} Flash</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    Pro 深度推断 + Flash 转录
                  </span>
                </div>

                <div style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldAlert size={14} color="#fbbf24" /> 月度预算水位
                  </span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fbbf24' }}>
                    {data.summary.budget_usage_pct}%
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    已用 ${data.summary.total_cost_usd.toFixed(2)} / 限额 ${data.summary.monthly_budget_usd}
                  </span>
                </div>
              </div>

              {/* 预算水位进度条 */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '10px',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#e2e8f0' }}>
                  <span>月度团队 Token 预算消耗水位</span>
                  <span style={{ color: '#38bdf8', fontWeight: 600 }}>${data.summary.total_cost_usd.toFixed(4)} / ${data.summary.monthly_budget_usd}.00</span>
                </div>
                <div style={{
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.max(data.summary.budget_usage_pct, 4)}%`,
                    background: data.summary.budget_usage_pct > 80 ? '#f87171' : 'linear-gradient(90deg, #38bdf8, #34d399)',
                    borderRadius: '4px',
                    transition: 'width 0.5s'
                  }} />
                </div>
              </div>

              {/* 近期推断调用流水审计 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: '#f8fafc', fontWeight: 600 }}>
                  <History size={16} color="#38bdf8" /> 近期推断与探针调用审计
                </div>
                <div style={{
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  background: 'rgba(15, 23, 42, 0.4)'
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: 'rgba(30, 41, 59, 0.7)', color: '#94a3b8', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                        <th style={{ padding: '10px 12px' }}>事务 ID</th>
                        <th style={{ padding: '10px 12px' }}>使用模型</th>
                        <th style={{ padding: '10px 12px' }}>输入/输出 Tokens</th>
                        <th style={{ padding: '10px 12px' }}>Prompt 缓存</th>
                        <th style={{ padding: '10px 12px' }}>估算费用</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recent_logs.map((log) => (
                        <tr key={log.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', color: '#e2e8f0' }}>
                          <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: '#38bdf8' }}>{log.engagement_id}</td>
                          <td style={{ padding: '10px 12px' }}>
                            <span style={{
                              background: log.model_name.includes('pro') ? 'rgba(168, 85, 247, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                              color: log.model_name.includes('pro') ? '#c084fc' : '#38bdf8',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '0.72rem'
                            }}>
                              {log.model_name}
                            </span>
                          </td>
                          <td style={{ padding: '10px 12px' }}>
                            {formatTokens(log.input_tokens)} / {formatTokens(log.output_tokens)}
                          </td>
                          <td style={{ padding: '10px 12px', color: log.cached_tokens > 0 ? '#34d399' : '#64748b' }}>
                            {log.cached_tokens > 0 ? `${formatTokens(log.cached_tokens)} (复用)` : '未缓存'}
                          </td>
                          <td style={{ padding: '10px 12px', color: '#34d399', fontWeight: 600 }}>
                            ${log.cost_usd.toFixed(4)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
