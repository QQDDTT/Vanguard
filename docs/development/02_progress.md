# 02. 开发进度追踪 — Vanguard

> 最后更新：2026-08-08
>
> 状态图例：`✅ 完成` / `🟡 进行中` / `⬜ 待开发` / `🚫 阻塞`

---

## 一、Rust Agentic 后端（`crates/`）

### 1.1 基础设施层

| 模块/任务 | 状态 | 说明 |
|----------|------|------|
| Cargo Workspace 初始化（7 crates） | ✅ 完成 | 所有 crate 骨架已建立 |
| `vanguard-api`：Axum 服务启动 + 健康检查 | ✅ 完成 | `/health`、`/api/v1/status` |
| 本地开发 Dev-Mock 鉴权中间件 | ⬜ 待开发 | 跳过 IAP 验证，注入 mock UserContext |
| SQLx 数据库连接池初始化 | ⬜ 待开发 | 从环境变量读取 `DATABASE_URL` |
| `infra/sql/init.sql` 更新（含 engagements + insights） | ⬜ 待开发 | 同步 v2.0 数据模型文档 |

### 1.2 `vanguard-auth`：鉴权模块

| 模块/任务 | 状态 | 说明 |
|----------|------|------|
| `UserContext` 结构体定义 | ✅ 完成 | `user_id`, `email`, `team_id` |
| Google IAP JWT 验签（`x-goog-iap-jwt-assertion`） | ⬜ 待开发 | 需接入 Google JWKS 公钥验证 |
| Firebase Auth JWT 验签 | ⬜ 待开发 | 用于 React Web 和 Android |
| Axum 中间件注入 `UserContext` | ⬜ 待开发 | `Extension<UserContext>` |

### 1.3 `vanguard-ingest`：多模态素材处理

| 模块/任务 | 状态 | 说明 |
|----------|------|------|
| GCS Presigned URL 生成 | ⬜ 待开发 | 调用 GCS Signed URL API v4 |
| GCS 上传确认回调（写入 `engagement_artifacts`） | ⬜ 待开发 | |
| 音频转录（Gemini Files API + Flash） | ⬜ 待开发 | 上传文件至 Files API，异步转录 |
| 图片结构化描述（Gemini Vision + Flash） | ⬜ 待开发 | |
| 日志/文档摘要压缩（Flash） | ⬜ 待开发 | |

### 1.4 `vanguard-llm`：Gemini API 客户端

| 模块/任务 | 状态 | 说明 |
|----------|------|------|
| 基础客户端结构体（`GeminiClient`） | ✅ 完成 | 骨架，返回 Placeholder |
| `generateContent` REST 请求体构建 | ⬜ 待开发 | 支持 text + audio + image parts |
| SSE 流式响应处理（`streamGenerateContent`） | ⬜ 待开发 | 读取 `text/event-stream` |
| Context Caching 支持（`cachedContents` API） | ⬜ 待开发 | |
| Structured Outputs（JSON Schema 约束输出） | ⬜ 待开发 | 对齐 `SevenDimensionsInsight` |
| Gemini Files API（上传 & 引用） | ⬜ 待开发 | 用于音频/图片 ingest |

### 1.5 `vanguard-agent`：七维度推断引擎

| 模块/任务 | 状态 | 说明 |
|----------|------|------|
| `SevenDimensionsInsight` 数据结构 | ✅ 完成 | 骨架，7 个维度字段 |
| 各 `engagement_type` Prompt 模板管理 | ⬜ 待开发 | 5 种类型各自独立模板 |
| RAG 检索结果注入 Prompt 上下文 | ⬜ 待开发 | 调用 `vanguard-rag` |
| 分阶段推断（Flash 摘要 → Pro 推断） | ⬜ 待开发 | |
| Token 硬限制检查（事务类型阈值） | ⬜ 待开发 | |
| 后台异步任务调度（`tokio::spawn`） | ⬜ 待开发 | `POST /analyze` 立即返回 job_id |
| SSE 进度事件推送（via `tokio::broadcast`） | ⬜ 待开发 | `GET /stream` 端点 |

### 1.6 `vanguard-rag`：混合检索

| 模块/任务 | 状态 | 说明 |
|----------|------|------|
| `KnowledgeSearchResult` 结构体 | ✅ 完成 | 骨架 |
| `text-embedding-004` 向量化封装 | ⬜ 待开发 | 将查询文本转为 768 维向量 |
| pgvector 余弦相似度检索 | ⬜ 待开发 | `<=>` 算子 |
| PostgreSQL 全文检索（`ts_content @@ plainto_tsquery`） | ⬜ 待开发 | |
| 混合重排序（向量分 + 关键词分加权合并） | ⬜ 待开发 | |

### 1.7 `vanguard-report`：报告生成

| 模块/任务 | 状态 | 说明 |
|----------|------|------|
| Markdown 报告基础渲染 | ✅ 完成 | 骨架，仅含 functional + latent_desires |
| 七维度完整 Markdown 报告 | ⬜ 待开发 | |
| HTML 渲染版本（`pulldown-cmark`） | ⬜ 待开发 | |

### 1.8 `vanguard-api`：路由层

| 端点 | 状态 | 说明 |
|------|------|------|
| `GET /health` | ✅ 完成 | |
| `GET /api/v1/status` | ✅ 完成 | |
| `POST /api/v1/engagements` | ⬜ 待开发 | 新建事务 |
| `GET /api/v1/engagements` | ⬜ 待开发 | 列出事务 |
| `GET /api/v1/engagements/:id` | ⬜ 待开发 | 事务详情 |
| `POST /api/v1/engagements/:id/artifacts/presign` | ⬜ 待开发 | GCS Presigned URL |
| `POST /api/v1/engagements/:id/artifacts/confirm` | ⬜ 待开发 | 上传确认 |
| `POST /api/v1/engagements/:id/analyze` | ⬜ 待开发 | 触发 Agent 分析 |
| `GET /api/v1/engagements/:id/stream` | ⬜ 待开发 | SSE 流式输出 |
| `GET /api/v1/engagements/:id/insights` | ⬜ 待开发 | 洞察列表 |
| `POST /api/v1/insights/:id/promote` | ⬜ 待开发 | 洞察升级为知识库 |
| `GET /api/v1/knowledge` | ⬜ 待开发 | 混合检索知识库 |
| `POST /api/v1/knowledge` | ⬜ 待开发 | 手动录入知识 |
| `GET /api/v1/engagements/:id/report` | ⬜ 待开发 | 导出洞察报告 |

---

## 二、React Web UI（`web/`）

> 当前状态：现有代码为旧版 Vanilla HTML/JS 实现，需全面迁移至 React + Vite。

### 2.1 项目初始化

| 任务 | 状态 | 说明 |
|------|------|------|
| Vite + React + TypeScript 项目初始化 | ⬜ 待开发 | 覆盖现有 `web/` 目录 |
| TailwindCSS + Radix UI 接入 | ⬜ 待开发 | |
| TanStack Router 路由配置 | ⬜ 待开发 | |
| TanStack Query 数据层配置 | ⬜ 待开发 | |
| Firebase Auth SDK 接入 + 登录页 | ⬜ 待开发 | |
| 基础布局组件（Sidebar + Header） | ⬜ 待开发 | |
| PWA manifest + Service Worker | ⬜ 待开发 | |

### 2.2 核心功能页面

| 页面/功能 | 状态 | 说明 |
|----------|------|------|
| Dashboard（事务列表） | ⬜ 待开发 | 支持按类型/状态过滤 |
| 新建事务表单（选择类型 + 填写客户信息） | ⬜ 待开发 | |
| 素材拖拽上传区（Drag & Drop + GCS Presign） | ⬜ 待开发 | |
| Agent 分析触发按钮 + Token 预算确认弹窗 | ⬜ 待开发 | |
| SSE 实时流式进度展示 | ⬜ 待开发 | 逐步渲染 thinking / insight 事件 |
| 七维度洞察卡片网格（InsightGrid） | ⬜ 待开发 | |
| 洞察 → 知识库一键 Promote | ⬜ 待开发 | |
| 知识库搜索页（混合检索） | ⬜ 待开发 | |
| Markdown 洞察报告渲染 | ⬜ 待开发 | |

---

## 三、Android 移动端（`android/`）

> 当前状态：`android/` 目录尚未创建，需从零初始化。

### 3.1 项目初始化

| 任务 | 状态 | 说明 |
|------|------|------|
| Android Studio 项目创建（Kotlin + Compose） | ⬜ 待开发 | Package: `ai.evotensor.vanguard` |
| Hilt 依赖注入初始化 | ⬜ 待开发 | |
| Retrofit 2 + OkHttp 4 网络层配置 | ⬜ 待开发 | |
| Room Database 本地存储初始化 | ⬜ 待开发 | |
| Firebase Auth 接入 + Google 登录 | ⬜ 待开发 | |
| Material Design 3 主题配置 | ⬜ 待开发 | |
| Firebase App Distribution 配置 | ⬜ 待开发 | |

### 3.2 核心功能 Screen

| Screen/功能 | 状态 | 说明 |
|------------|------|------|
| HomeScreen（事务列表） | ⬜ 待开发 | |
| 新建事务（类型选择 + 客户信息） | ⬜ 待开发 | |
| AudioRecordScreen（CameraX 录音） | ⬜ 待开发 | 核心现场功能 |
| PhotoCaptureScreen（CameraX 拍照 + 多选上传） | ⬜ 待开发 | |
| GCS Presigned 上传（带进度条） | ⬜ 待开发 | |
| Agent 分析触发 + SSE 实时结果展示 | ⬜ 待开发 | OkHttp SSE EventSource |
| InsightDetailScreen（七维度卡片） | ⬜ 待开发 | |
| 离线草稿（Room 本地暂存） | ⬜ 待开发 | 网络不稳定时自动缓存 |

---

## 四、基础设施（`infra/`）

| 任务 | 状态 | 说明 |
|------|------|------|
| `Dockerfile` 多阶段构建 | ✅ 完成 | 基础版本已建立 |
| `cloudbuild.yaml` 后端 CI/CD | ✅ 完成 | 基础版本已建立 |
| `infra/sql/init.sql` 升级至 v2.0 | ⬜ 待开发 | 含 engagements、insights、GIN 全文索引 |
| `.cloudbuild/web.yaml`（React 构建 + Firebase 部署） | ⬜ 待开发 | |
| `.cloudbuild/android.yaml`（Android 构建 + App Distribution） | ⬜ 待开发 | |
| `firebase.json` Hosting 配置（`web/`） | ⬜ 待开发 | |
| `.env.example` 本地开发模板 | ⬜ 待开发 | |
| Cloud Monitoring 月度费用告警规则 | ⬜ 待开发 | 超 $50/月触发邮件通知 |

---

## 五、里程碑计划

| 里程碑 | 目标 | 关键交付物 |
|--------|------|----------|
| **M0 — 骨架建立** | ✅ 已完成 | 7 Crates 骨架、文档体系、SQL Schema 设计 |
| **M1 — 后端 MVP** | ⬜ 进行中 | Gemini LLM 客户端、事务 CRUD API、GCS 上传、单次 INTERVIEW 分析可运行 |
| **M2 — Web UI MVP** | ⬜ 待启动 | React 项目搭建、新建事务 + 上传 + SSE 结果展示 |
| **M3 — Android MVP** | ⬜ 待启动 | Kotlin 项目搭建、录音 + 拍照 + 事务创建 + 分析触发 |
| **M4 — 完整 5 事务类型** | ⬜ 待规划 | 全部 Prompt 模板、5 类 Agent 流水线 + 报告导出 |
| **M5 — 生产部署** | ⬜ 待规划 | Cloud Run 正式上线、Firebase Hosting、Google Play 内测 |
