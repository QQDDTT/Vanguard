import { useEffect, useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Play, 
  Activity, 
  FileText, 
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { CodeDiffViewer } from './CodeDiffViewer';
import { ToolExecutionLog } from './ToolExecutionLog';
import { InsightCards } from './InsightCards';
import type { SevenDimensionsInsightData } from './InsightCards';
import { ReportModal } from './ReportModal';
import { ArtifactUploader } from './ArtifactUploader';

interface EngagementDetailProps {
  engagementId: string;
  onBack: () => void;
}

type SseEvent = 
  | { type: 'Message'; content: string }
  | { type: 'ToolCall'; name: string; args: any; status: string; result?: string }
  | { type: 'FilePatch'; file_path: string; diff: string; rationale: string }
  | { type: 'InsightResult'; data: SevenDimensionsInsightData };

export function EngagementDetail({ engagementId, onBack }: EngagementDetailProps) {
  const [events, setEvents] = useState<SseEvent[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [showInputPanel, setShowInputPanel] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const eventsEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    eventsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [events]);

  const samplePresets: Record<string, { label: string; text: string }> = {
    interview: {
      label: '访谈需求示例 (量化交易团队)',
      text: `【FBE 现场采访速记 - 某头部金融客户量化交易团队】
受访人：架构负责人王总、量化策略研发负责人李博士
业务痛点：
1. 目前每天盘后模型回测需要跑 6 小时，经常延迟到午夜，如果中间发生一次节点网络抖动任务失败，必须全量重跑。
2. 团队经常需要对比不同参数下生成的策略差异，目前的配置对比全靠工程师肉眼看 git diff，极度容易漏配参数导致实盘风险。
3. 团队非常担心生产环境配置变更时被误操作直接覆盖，希望有严格的双人复核与双因素 2FA / TOTP 验证机制。
4. 部门领导希望周会上能自动生成 Markdown 格式的策略收益与风险汇总报告，不用工程师每周花半天手动排版。
约束条件：
- 必须内网私有化部署，不能直连外网公共 API，必须通过代理或专线。
- 操作系统统一为 Rocky Linux 9，只接受 Rust 或 C++ 高性能无垃圾回收语言编写的底层服务。`
    },
    infra: {
      label: '机房勘测示例 (私有化拓扑审计)',
      text: `【FBE 现场勘测记录 - 某国有金融数据中心】
机房环境：A 区机架 12-16 号，双路冗余电源 220V/32A。
硬件 Specs：
- 计算节点：4 台 2U 裸金属机，双路 AMD EPYC 9654 (192 核)，1.5TB DDR5 内存，4TB NVMe SSD。
- 网络拓扑：2x 100GbE Mellanox ConnectX-6 RoCE 专网直连，带外管理采用 1GbE 独立 VLAN。
- 隔离合规：禁止任何对外出网流量，所有三方容器镜像需通过内部 Harbor 仓库漏洞扫描后方可分发。
Gap 诊断发现：
1. 默认无公网 NTP 时钟源，需指向内部 PTP 纳秒级授时网关 10.200.1.1。
2. 内核默认参数 \`net.core.somaxconn\` 过小，高并发回测容易丢包，需调优至 65535。`
    },
    poc: {
      label: 'PoC 跟踪示例 (性能与卡点矩阵)',
      text: `【FBE PoC 试点里程碑达成度与卡点记录】
目标达成情况：
- 吞吐基准：单节点已达 120 万笔/秒，超出客户 100 万预期（达成率 120%）。
- 延迟指标：P99.9 延迟为 18 微秒，达到客户 <= 20 微秒红线标准。
当前关键卡点 (Blockers)：
1. [技术卡点 - 优先级高] 客户测试集群的特定 PCIe 网卡驱动偶发内存泄漏，已抓取 HeapDump，需定位驱动兼容补丁。
2. [权限卡点 - 优先级中] 客户风控团队要求在测试平台中必须集成 Google Authenticator 双因素认证方可进入生产灰度。`
    },
    troubleshoot: {
      label: '现场排障示例 (网络抖动与崩溃 RCA)',
      text: `【FBE 现场故障排查与 RCA 根因记录】
故障现象：昨日 21:30 批量回测跑批时，Node-03 进程突发 SIGSEGV 崩溃，导致当前 Batch 失败。
现场排查日志：
- 日志片段：\`[ERROR] connection reset by peer (10.200.1.15:8080) during async payload dispatch\`
- 探针结果：调用 system_ping 对内网网关持续探测，发现存在 3.2% 丢包率。
- RCA 根因定位：核心交换机光模块老化导致突发丢包，底层连接未配置重试与指数退避机制。
修复方案：
1. 建议客户机房巡检更换光模块；
2. 在客户端连接池配置自动重连与健康探针。`
    },
    sow: {
      label: 'SOW 提案示例 (交付范围与工期评估)',
      text: `【FBE SOW 实施提案与交付范围草案】
项目目标：构建下一代高可用量化策略回测与 FBE 智能洞察平台。
工作范围 (Scope of Work)：
1. 第一阶段 (第 1-2 周)：内网隔离环境初始化、Docker 镜像导入与双因素 2FA 认证系统部署。
2. 第二阶段 (第 3-4 周)：七维度需求提取 Agent 引擎与本地知识库 pgvector 向量索引构建。
3. 第三阶段 (第 5 周)：全链路压测、FBE 自动化报告生成系统验收与培训。
交付物清单：
- 完整的私有化部署软件包与 Helm Chart；
- 架构设计文档、API 规范与运维 SOP 手册。`
    }
  };

  const loadSamplePreset = (key: string) => {
    if (samplePresets[key]) {
      setTranscript(samplePresets[key].text);
    }
  };

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    setEvents([]);
    try {
      // 1. Call REST API to start background task with optional transcript
      const res = await fetch(`/api/v1/engagements/${engagementId}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: transcript.trim() })
      });
      const data = await res.json();
      
      // 2. Connect to SSE Stream
      const eventSource = new EventSource(data.stream_url || `/api/v1/engagements/${engagementId}/stream`);
      
      eventSource.onmessage = (e) => {
        try {
          const parsed: SseEvent = JSON.parse(e.data);
          
          setEvents(prev => {
            // For ToolCall, update existing item if it exists
            if (parsed.type === 'ToolCall') {
              const existingIdx = prev.findIndex(ev => 
                ev.type === 'ToolCall' && 
                ev.name === parsed.name && 
                JSON.stringify(ev.args) === JSON.stringify(parsed.args)
              );
              if (existingIdx !== -1) {
                const newEvents = [...prev];
                newEvents[existingIdx] = parsed;
                return newEvents;
              }
            }
            return [...prev, parsed];
          });
        } catch {
          // Fallback if the server sends plain text
          setEvents(prev => [...prev, { type: 'Message', content: e.data }]);
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        setIsAnalyzing(false);
      };

    } catch (e) {
      console.error(e);
      setIsAnalyzing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', gap: '16px' }}>
      {/* 顶部导航与主操作栏 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button 
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '1rem',
            padding: '6px 12px',
            borderRadius: '6px',
            transition: 'color 0.2s'
          }}
        >
          <ArrowLeft size={20} />
          返回事务看板
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setShowReportModal(true)}
            style={{
              background: 'rgba(56, 189, 248, 0.1)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              padding: '8px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.9rem',
              fontWeight: 500,
              transition: 'all 0.2s'
            }}
          >
            <FileText size={16} />
            导出 FBE 洞察报告
          </button>

          <button
            onClick={() => setShowInputPanel(!showInputPanel)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'var(--color-text-secondary)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '8px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.9rem'
            }}
          >
            <FileText size={16} />
            {showInputPanel ? '收起访谈素材' : '录入访谈素材'}
            {showInputPanel ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          <button
            onClick={startAnalysis}
            disabled={isAnalyzing}
            style={{
              background: isAnalyzing ? 'var(--color-surface)' : 'linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)',
              color: isAnalyzing ? 'var(--color-text-secondary)' : '#ffffff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: isAnalyzing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '600',
              boxShadow: isAnalyzing ? 'none' : '0 4px 12px rgba(37, 99, 235, 0.35)',
              transition: 'all 0.2s'
            }}
          >
            {isAnalyzing ? <Activity size={18} className="spin" /> : <Play size={18} />}
            {isAnalyzing ? 'Agent 推断中...' : '启动 AI 七维度推断与探针'}
          </button>
        </div>
      </div>

      {/* 可折叠访谈素材录入面板 */}
      {showInputPanel && (
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '0.9rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} color="#38bdf8" />
              FBE 现场素材 / 客户访谈文字转录 (输入后 Agent 将自动提取 7 维度需求与执行修复探针)
            </span>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>快速载入现场预设：</span>
              <button
                onClick={() => loadSamplePreset('interview')}
                style={{
                  background: 'rgba(56, 189, 248, 0.1)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  color: '#38bdf8',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  padding: '3px 8px',
                  borderRadius: '4px'
                }}
              >
                访谈需求
              </button>
              <button
                onClick={() => loadSamplePreset('infra')}
                style={{
                  background: 'rgba(168, 85, 247, 0.1)',
                  border: '1px solid rgba(168, 85, 247, 0.25)',
                  color: '#a855f7',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  padding: '3px 8px',
                  borderRadius: '4px'
                }}
              >
                机房勘测
              </button>
              <button
                onClick={() => loadSamplePreset('poc')}
                style={{
                  background: 'rgba(251, 191, 36, 0.1)',
                  border: '1px solid rgba(251, 191, 36, 0.25)',
                  color: '#fbbf24',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  padding: '3px 8px',
                  borderRadius: '4px'
                }}
              >
                PoC卡点
              </button>
              <button
                onClick={() => loadSamplePreset('troubleshoot')}
                style={{
                  background: 'rgba(248, 113, 113, 0.1)',
                  border: '1px solid rgba(248, 113, 113, 0.25)',
                  color: '#f87171',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  padding: '3px 8px',
                  borderRadius: '4px'
                }}
              >
                故障排障
              </button>
              <button
                onClick={() => loadSamplePreset('sow')}
                style={{
                  background: 'rgba(52, 211, 153, 0.1)',
                  border: '1px solid rgba(52, 211, 153, 0.25)',
                  color: '#34d399',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  padding: '3px 8px',
                  borderRadius: '4px'
                }}
              >
                SOW提案
              </button>
            </div>
          </div>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="粘贴客户采访对话记录、零散会议笔记、痛点描述或技术约束..."
            rows={4}
            style={{
              width: '100%',
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '10px 12px',
              color: '#f8fafc',
              fontSize: '0.88rem',
              resize: 'vertical',
              outline: 'none',
              fontFamily: 'inherit',
              lineHeight: '1.5'
            }}
          />

          <div style={{ marginTop: '6px' }}>
            <ArtifactUploader engagementId={engagementId} />
          </div>
        </div>
      )}

      {/* 实时推断与执行流展示区 */}
      <div style={{
        flex: 1,
        background: 'rgba(15, 23, 42, 0.5)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        padding: '24px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {events.length === 0 ? (
          <div style={{ 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'var(--color-text-secondary)',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <Activity size={48} color="rgba(255, 255, 255, 0.2)" />
            <p style={{ margin: 0, fontSize: '0.95rem' }}>
              点击上方 <strong>“启动 AI 七维度推断与探针”</strong> 开始执行 FBE 深度洞察与诊断流程。
            </p>
          </div>
        ) : (
          events.map((ev, idx) => (
            <div key={idx} style={{ width: '100%' }}>
              {ev.type === 'Message' && (
                <div style={{ 
                  background: 'rgba(30, 41, 59, 0.7)', 
                  padding: '12px 16px', 
                  borderRadius: '10px',
                  color: 'var(--color-text-primary)',
                  borderLeft: '3px solid #38bdf8',
                  fontSize: '0.92rem',
                  lineHeight: '1.6'
                }}>
                  {ev.content}
                </div>
              )}
              {ev.type === 'ToolCall' && (
                <ToolExecutionLog 
                  name={ev.name} 
                  args={ev.args} 
                  status={ev.status} 
                  result={ev.result} 
                />
              )}
              {ev.type === 'FilePatch' && (
                <CodeDiffViewer 
                  filePath={ev.file_path} 
                  diff={ev.diff} 
                  rationale={ev.rationale} 
                />
              )}
              {ev.type === 'InsightResult' && (
                <InsightCards insight={ev.data} />
              )}
            </div>
          ))
        )}
        <div ref={eventsEndRef} />
      </div>

      <ReportModal 
        engagementId={engagementId}
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
      />
    </div>
  );
}
