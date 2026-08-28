# 02. 开发进度追踪 — Vanguard

> 最后更新：2026-08-23
>
> 状态图例：`✅ 完成` / `🟡 进行中` / `⬜ 待开发` / `🚫 阻塞`

---

## 一、Rust Agentic 后端（`crates/`）

### 1.1 基础设施与服务路由
| 模块/任务 | 状态 | 说明 |
|----------|------|------|
| Cargo Workspace 初始化（8 crates） | ✅ 完成 | vanguard-api, vanguard-agent, vanguard-llm, vanguard-rag, vanguard-report, vanguard-tools, vanguard-auth, vanguard-ingest |
| `vanguard-api`：Axum 服务启动 + 健康检查 | ✅ 完成 | `/health`、`/api/v1/status` |
| 本地开发 Dev-Mock 鉴权中间件 | ✅ 完成 | 跳过 IAP 验证，注入 mock UserContext |
| SQLx 数据库连接池与 Engagement 基础模型 | ✅ 完成 | 从环境变量读取 `DATABASE_URL` |
| SSE 实时流式传输端点 | ✅ 完成 | `GET /api/v1/engagements/:id/stream`，支持 Message, ToolCall, FilePatch, InsightResult |

### 1.2 `vanguard-llm` 与 `vanguard-agent`：推断与工具引擎
| 模块/任务 | 状态 | 说明 |
|----------|------|------|
| `GeminiClient` API 客户端封装 | ✅ 完成 | 支持 Function Calling, Tool Declarations 与 Structured Outputs |
| `SevenDimensionsInsight` 数据结构 | ✅ 完成 | 7 维度：functional, pain_points, jobs_to_be_done, latent_desires, emotional_needs, social_needs, constraints |
| `InsightAgent` 访谈需求推断引擎 | ✅ 完成 | 基于 Gemini 2.5 Pro 的结构化洞察提取与离线 Fallback |
| `vanguard-tools` 工具链与探针 | ✅ 完成 | SystemPingTool, CurlProbeTool, ConfigPatcherTool 及执行状态流 |

### 1.3 `vanguard-ingest`：多模态素材摄入引擎
| 模块/任务 | 状态 | 说明 |
|----------|------|------|
| `EngagementArtifact` 素材模型 | ✅ 完成 | 涵盖 AUDIO (录音), IMAGE (机架照片), LOG (日志/抓包), CONFIG (配置) |
| `IngestPipeline` 预签名直传凭证生成 | ✅ 完成 | 生成 GCS Presigned URL 避免大文件穿透 API 容器 |
| `POST /api/v1/engagements/:id/artifacts/presign` | ✅ 完成 | 预签名申请端点 |
| `POST /api/v1/engagements/:id/artifacts/confirm` | ✅ 完成 | 上传确认端点 |
| `GET /api/v1/engagements/:id/artifacts` | ✅ 完成 | 事务关联素材列表查询端点 |

### 1.4 `vanguard-rag`：原子化知识库引擎
| 模块/任务 | 状态 | 说明 |
|----------|------|------|
| `KnowledgeItem` 原子化知识数据模型 | ✅ 完成 | 5 大显式分类：CUSTOMER_PATTERN, INDUSTRY_BACKGROUND, METHODOLOGY, CASE_STUDY, COMPETITOR_INSIGHT |
| `RagEngine` 混合检索与过滤算法 | ✅ 完成 | 支持分类过滤、标题/正文/关键词多维度混合评分检索 |
| 开箱即用 FBE 种子经验库 | ✅ 完成 | 内置量化实盘热更、5-Whys 引导法、B2B 控制权顾虑等种子数据 |
| `GET /api/v1/knowledge` 检索端点 | ✅ 完成 | 实时按关键词与分类检索知识库 |
| `POST /api/v1/knowledge` 录入端点 | ✅ 完成 | 手动录入原子化知识条目 |
| `POST /api/v1/insights/promote` 提升端点 | ✅ 完成 | 现场提取的洞察条目一键提炼沉淀为原子化知识资产 |

### 1.5 `vanguard-report`：报告生成与导出
| 模块/任务 | 状态 | 说明 |
|----------|------|------|
| `ReportGenerator` 七维度 Markdown 报告生成 | ✅ 完成 | 包含执行摘要、七维度需求分析矩阵、FBE 行动建议与技术推进清单 |
| 专业深色主题 HTML 报告渲染 | ✅ 完成 | 适合直接分享与预览 |
| `GET /api/v1/engagements/:id/report` 导出端点 | ✅ 完成 | 支持 `format=markdown` 与 `format=html` |

### 1.6 Token 预算与实时用量计量监控引擎
| 模块/任务 | 状态 | 说明 |
|----------|------|------|
| `TokenLog` 实体与审计日志 | ✅ 完成 | 自动沉淀 input/output/cached tokens、model_name 与成本 ($ USD) |
| `GET /api/v1/metrics/token-usage` 计量端点 | ✅ 完成 | 实时聚合今日消耗、月度预算水位与模型分流占比 |
| Web 端 Token 仪表盘 (`TokenUsageModal.tsx`) | ✅ 完成 | 4 网格核心指标、预算水位进度条与调用流水审计 |
| 顶部状态栏 Token 实时微徽章 | ✅ 完成 | 快速查看与点击弹窗交互 |

---

## 二、React Web 控制台（`vanguard-web/`）

### 2.1 安全与架构底座
| 任务 | 状态 | 说明 |
|------|------|------|
| Vite + React 19 + TypeScript 架构初始化 | ✅ 完成 | 现代化工程配置，`npm run build` 0 警告 |
| Omni-Gate 全域统一零信任网关接入 | ✅ 完成 | 接入 Cloudflare Zero Trust 与 Omni-Gate 动态反向代理免登直通 |
| 主导航与视图切换系统 | ✅ 完成 | 支持「现场事务看板」与「团队原子知识库」无缝切换 |

### 2.2 核心业务与 Agent 交互组件
| 页面/组件 | 状态 | 说明 |
|----------|------|------|
| `CreateEngagement.tsx` 新建事务 | ✅ 完成 | 支持 5 大标准 FBE 事务类型选择（INTERVIEW, INFRA_SURVEY, POC_TRACKING, TROUBLESHOOTING, SOW_PROPOSAL） |
| `EngagementList.tsx` 事务看板 | ✅ 完成 | 5 大类型分类过滤、专属色彩微徽章与状态归档 |
| `EngagementDetail.tsx` 详情与推断流 | ✅ 完成 | 5 种场景专属现场素材预设载入、SSE 实时流式渲染与探针工具日志 |
| `ArtifactUploader.tsx` 多模态素材管理 | ✅ 完成 | 拖拽/选择直传、进度条模拟、文件类型图标判定与素材列表 |
| `InsightCards.tsx` 七维度洞察卡片矩阵 | ✅ 完成 | 7 维度卡片网格、一键复制、一键 Promote 沉淀为知识库 |
| `ReportModal.tsx` 报告导出预览模态框 | ✅ 完成 | 双视图切换（预览/源码）、一键复制、一键下载 `.md` 文件、独立 HTML 查看 |
| `KnowledgeCenter.tsx` 知识库中心 | ✅ 完成 | 5 大分类切换、实时关键词检索、原子化知识阅读与手动录入 |
| `ToolExecutionLog.tsx` 工具日志渲染 | ✅ 完成 | Agent 现场诊断与探针执行状态展示 |
| `CodeDiffViewer.tsx` 配置比对渲染 | ✅ 完成 | 代码差异与修复补丁可视化比对 |

---

## 三、数据层与移动端（`dataconnect/` & `vanguard-android/`）

| 任务 | 状态 | 说明 |
|------|------|------|
| Firebase Data Connect Schema 定义 | ✅ 完成 | `dataconnect/schema/schema.gql` |
| Firebase Data Connect Connector 定义 | ✅ 完成 | `dataconnect/connector/connector.yaml` 与 queries/mutations |
| Android Kotlin DataConnect SDK 生成代码 | ✅ 完成 | 生成至 `com.evotensor.vanguard.dataconnect` |
| Android Jetpack Compose 架构与 Material 3 深色主题 | ✅ 完成 | `VanguardTheme`、`DarkColorScheme` 与调色板 |
| Android 现场事务看板 (`HomeScreen.kt`) | ✅ 完成 | 5 大事务类型过滤、卡片列表与快速新建 |
| Android 现场录音采集组件 (`AudioRecorderComponent.kt`) | ✅ 完成 | 计时器、呼吸灯动画、录音重录与素材挂载 |
| Android 事务详情与七维度推断 (`EngagementDetailScreen.kt`) | ✅ 完成 | 现场素材挂载、速记输入与七维度洞察卡片渲染 |
| Android 移动端原子化知识库 (`KnowledgeScreen.kt`) | ✅ 完成 | 分类 FilterChip、搜索过滤与知识展开查阅 |
| Android 离线机房草稿箱 (`OfflineDraftsScreen.kt`) | ✅ 完成 | 物理隔离机房环境离线速记、录音暂存与草稿管理 |
| Android 网络重连自动同步引擎 (`SyncManager.kt`) | ✅ 完成 | Pending/Syncing/Synced 状态流转与一键批量云端同步 |

---

## 四、基础设施与容器化（`infra/` & `scripts/`）

| 任务 | 状态 | 说明 |
|------|------|------|
| 多阶段构建 `Dockerfile`（Node 20 前端 + Rust 1.95 后端 + Debian Slim 运行态） | ✅ 完成 | 前后端统一打包交付，体积轻量 |
| 本地一键容器编排 (`infra/docker-compose.yml`) | ✅ 完成 | 包含 PostgreSQL + pgvector 向量扩展与全栈服务容器 |
| 环境变量标准模板 (`.env.example`) | ✅ 完成 | 规范配置 DB、Gemini API Key、GCS Bucket 与鉴权模式 |
| 数据库模式与初始化脚本 (`infra/sql/init.sql`) | ✅ 完成 | 涵盖 teams, users, engagements, artifacts, insights, knowledge_items, token_logs |
| 本地一键启动脚本 (`scripts/dev.sh`) | ✅ 完成 | 自动加载环境变量并启动 Axum 服务 |
| GCP Cloud Build CI/CD 流水线 (`infra/cloudbuild.yaml`) | ✅ 完成 | 自动构建镜像、推送到 Artifact Registry 并部署至 Cloud Run |
| GCP 部署触发脚本 (`scripts/deploy_ailab.sh`) | ✅ 完成 | 一键提交流水线至 `evotensor-ai-lab` 项目 |

---

## 五、当前里程碑进度

| 里程碑 | 目标 | 当前状态 | 关键成果 |
|--------|------|:-------:|----------|
| **M0 — 骨架与文档建立** | 规范与 Crates 骨架 | ✅ 100% | 8 Crates、全套 PRD 与架构规范 |
| **M1 — 后端 Agentic 引擎** | Gemini 客户端 + 推断 + 工具 + RAG + 报告 + Ingest + Token 计量 | ✅ 100% | 七维度推断、探针诊断、知识库检索、多模态直传、报告导出与 Token 计量全链路打通 |
| **M2 — Web UI 运营控制台** | 2FA 零信任 + 看板 + 推断流 + 素材管理 + 知识中心 + 报告 + Token 仪表盘 | ✅ 100% | React 19 + TypeScript 编译无误，所有业务与交互闭环完整 |
| **M3 — Android 现场采集端** | 原生音视频采集 + 离线机房草稿箱 + 自动同步 + 知识库 | ✅ 100% | Jetpack Compose 原生应用、波形录音、机房离线草稿箱与批量同步全量落地 |
| **M4 — 云端与基础设施部署** | Docker Compose + Cloud Run + Cloud Build | ✅ 95% | 容器编排、多阶段构建与 CI/CD 自动化流水线就绪 |


