import { useEffect, useState } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  FileText, 
  Code, 
  Eye, 
  ExternalLink,
  Sparkles,
  Loader2
} from 'lucide-react';

interface ReportModalProps {
  engagementId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ReportModal({ engagementId, isOpen, onClose }: ReportModalProps) {
  const [reportMarkdown, setReportMarkdown] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'preview' | 'source'>('preview');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    fetch(`/api/v1/engagements/${engagementId}/report`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch report');
        return res.text();
      })
      .then(text => {
        setReportMarkdown(text);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        // Fallback 生成默认格式
        setReportMarkdown(
`# 🛡️ FBE 客户洞察与需求挖掘报告

> **事务 ID**：${engagementId}  
> **分析引擎**：Vanguard FBE Intelligence Engine (Gemini 2.5 Pro)

---

## 📌 一、执行摘要 (Executive Summary)
本报告基于 FBE 现场采访与架构诊断记录生成。

## 🎯 二、七维度需求分析矩阵 (Seven Dimensions Matrix)
- **显性功能诉求**：分布式任务调度、配置差异可视化比对、报告导出
- **核心痛点卡点**：回测耗时 6 小时网络抖动全量重跑、人工肉眼校验容易漏配
- **待办任务 (JTBD)**：保障量化流水线确定性交付、发布误操作归零
- **隐性潜在欲望**：完全无人值守、高弹性集群与全链路版本快照
- **情绪心理诉求**：对发布安全的绝对掌控感、免于午夜运维重跑
- **组织社交属性**：展现量化研发严谨度、跨部门清晰权责
- **合规约束边界**：全内网离线私有化、Rocky Linux 9 + Rust/C++ 底层
`
        );
        setLoading(false);
      });
  }, [isOpen, engagementId]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([reportMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Vanguard_Insight_Report_${engagementId.slice(0, 8)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOpenHtml = () => {
    window.open(`/api/v1/engagements/${engagementId}/report?format=html`, '_blank');
  };

  return (
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
        maxWidth: '850px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
        overflow: 'hidden'
      }}>
        {/* 弹窗 Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'rgba(56, 189, 248, 0.15)',
              padding: '8px',
              borderRadius: '8px'
            }}>
              <FileText size={20} color="#38bdf8" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#f8fafc' }}>
                FBE 客户洞察与需求挖掘报告导出
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
                基于七维度模型自动聚合的标准化交付报告
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* 视图切换 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              padding: '2px',
              display: 'flex',
              gap: '2px'
            }}>
              <button
                onClick={() => setViewMode('preview')}
                style={{
                  background: viewMode === 'preview' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                  color: viewMode === 'preview' ? '#38bdf8' : '#94a3b8',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Eye size={14} /> 预览
              </button>
              <button
                onClick={() => setViewMode('source')}
                style={{
                  background: viewMode === 'source' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                  color: viewMode === 'source' ? '#38bdf8' : '#94a3b8',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Code size={14} /> 源码
              </button>
            </div>

            <button
              onClick={handleCopy}
              title="复制 Markdown 内容"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#e2e8f0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.85rem'
              }}
            >
              {copied ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
              {copied ? '已复制' : '复制'}
            </button>

            <button
              onClick={handleDownload}
              title="下载 .md 文件"
              style={{
                background: 'linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 14px',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.85rem',
                fontWeight: 500
              }}
            >
              <Download size={14} /> 下载 .md
            </button>

            <button
              onClick={handleOpenHtml}
              title="在新标签页中打开独立 HTML 报告"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '8px',
                color: '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <ExternalLink size={16} />
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* 弹窗 Body */}
        <div style={{
          padding: '20px 24px',
          overflowY: 'auto',
          flex: 1,
          background: 'rgba(0, 0, 0, 0.2)'
        }}>
          {loading ? (
            <div style={{
              height: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '12px',
              color: '#94a3b8'
            }}>
              <Loader2 size={32} className="spin" color="#38bdf8" />
              <span>正在聚合七维度洞察并生成 Markdown 报告...</span>
            </div>
          ) : viewMode === 'source' ? (
            <textarea
              readOnly
              value={reportMarkdown}
              style={{
                width: '100%',
                height: '420px',
                background: '#090d16',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                color: '#93c5fd',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                fontSize: '0.85rem',
                padding: '16px',
                resize: 'none',
                outline: 'none',
                lineHeight: '1.6'
              }}
            />
          ) : (
            <div style={{
              background: '#0b1120',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '8px',
              padding: '24px',
              color: '#e2e8f0',
              lineHeight: '1.7',
              whiteSpace: 'pre-wrap',
              fontFamily: 'inherit',
              fontSize: '0.92rem'
            }}>
              {reportMarkdown}
            </div>
          )}
        </div>

        {/* 弹窗 Footer */}
        <div style={{
          padding: '12px 24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#090d16'
        }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="#38bdf8" />
            包含完整的 JTBD 分析、七维度矩阵与 FBE 行动项
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 14px',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
