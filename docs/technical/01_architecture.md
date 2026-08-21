# 01. 全栈系统架构设计 — Vanguard

## 1. 概述与总体设计

Vanguard 采用**三位一体的全栈架构设计**：后端由高性能 Rust Agentic 平台提供 AI 推理与数据存储支持，Web 端由 React SPA 提供桌面端与浏览器交互，移动端由原生 Kotlin/Compose Android 应用提供现场录音与拍照能力。三大组件统一部署/发布于 GCP (Google Cloud Platform) 生态。

```text
                        ┌─────────────────────────┐
                        │   Google Cloud IAP /    │
                        │   Firebase Auth 统一认证 │
                        └────────────┬────────────┘
                                     │
           ┌─────────────────────────┼─────────────────────────┐
           │ HTTPS / SSE             │ HTTPS / SSE             │
┌──────────▼──────────┐   ┌──────────▼──────────┐   ┌──────────▼──────────┐
│  React Web UI (SPA) │   │ Android App (Kotlin)│   │  未来的 CLI / SDK   │
│ (Firebase Hosting/  │   │  (Firebase App Dist/│   │   第三方集成端      │
│     Cloud Storage)  │   │  Google Play 发布)   │   └─────────────────────┘
└──────────┬──────────┘   └──────────┬──────────┘
           │                         │
           └─────────────────────────┼─────────────────────────┐
                                     │ HTTPS / SSE             │
                         ┌───────────▼───────────┐             │
                         │ Cloud Run: vanguard-api│             │
                         │ (Rust Axum 容器服务)   │             │
                         └─────┬─────┬─────┬─────┘             │
                               │     │     │                   │
              ┌────────────────┘     │     └────────────────┐  │
              ▼                      ▼                      ▼  ▼
      ┌──────────────┐       ┌──────────────┐       ┌──────────────┐
      │ Cloud Storage│       │  Cloud SQL   │       │  Gemini API  │
      │  (素材归档)  │       │ (PostgreSQL) │       │ (Multimodal) │
      │ - 音频/照片  │       │ - pgvector   │       │ - Flash/Pro  │
      └──────────────┘       └──────────────┘       └──────────────┘
```

---

## 2. 三大端详细设计与技术栈

### 2.1 后端 Agentic 平台 (Rust + GCP + Storage)

- **部署环境**：GCP Cloud Run (Serverless 容器) + Cloud SQL (PostgreSQL 16 + `pgvector`) + Cloud Storage (GCS 素材归档)。
- **开发语言与核心框架**：
  - **编程语言**：Rust 1.75+ (Edition 2021)
  - **Web 框架与异步运行时**：Axum 0.7 + Tokio 1.x
  - **ORM & 数据库驱动**：SQLx (原生支持 PostgreSQL 与 pgvector 向量查询)
  - **HTTP & LLM 客户端**：Reqwest + Serde / Serde_json (手写 Gemini 2.5 REST API 驱动)
- **工程目录结构 (`crates/`)**：
  ```text
  crates/
  ├── vanguard-api/           # Axum Web 路由门面、REST & SSE 端点
  ├── vanguard-auth/          # Google IAP / OAuth JWT 解析与租户隔离 Context
  ├── vanguard-ingest/        # 多模态素材 (音频转录、照片 OCR/描述) 解析流水线
  ├── vanguard-agent/         # 七维度需求推断 Agent 引擎与 Structured Outputs
  ├── vanguard-llm/           # 自研 Gemini 2.5 API 客户端 (支持 Context Caching)
  ├── vanguard-rag/           # pgvector 混合向量与全文检索重排序
  ├── vanguard-tools/         # 函数调用沙盒 (Gemini Tools) 与 API/脚本自动执行器
  └── vanguard-report/        # Markdown 洞察报告渲染生成器
  ```
- **核心数据存储职责**：
  - **关系型数据**：存储用户、团队、事务 (Engagements)、附件元数据与 Token 日志。
  - **向量数据**：`knowledge_items` 表内置 768 维 `pgvector` 向量与全文本索引。
  - **二进制素材**：多模态音频与照片文件基于 Presigned Upload URL 直接归档至 GCS。

---

### 2.2 Web 前端 UI (React + Vite + GCP Hosting)

- **部署环境**：GCP Firebase Hosting 或 Cloud Storage + Cloud CDN 静态托管。
- **开发语言与核心框架**：
  - **编程语言**：TypeScript 5.x
  - **前端框架与构建工具**：React 18/19 + Vite
  - **样式与组件库**：TailwindCSS + Lucide Icons + Radix UI (或 Shadcn UI)
  - **数据流与通信**：TanStack Query (React Query) + Fetch EventSource (处理 SSE 流式响应)
  - **离线与 PWA**：Vite PWA Plugin (Service Worker 支持离线缓存)
- **工程目录结构 (`web/`)**：
  ```text
  web/
  ├── public/                 # 静态资源与 PWA manifest.json
  ├── src/
  │   ├── assets/             # Logo 与图标
  │   ├── components/         # 独立 UI 组件 (DragUploadZone, InsightCard, CodeDiffViewer, ToolExecutionLog)
  │   ├── hooks/              # 自定义 Hooks (useEngagementStream, useAuth)
  │   ├── pages/              # 页面 (Dashboard, EngagementDetail, KnowledgeBase)
  │   ├── services/           # API 请求与 SSE 长连接封装
  │   ├── types/              # TypeScript Data Models
  │   ├── App.tsx             # 路由与 App 根组件
  │   └── main.tsx            # 应用入口
  ├── package.json
  └── vite.config.ts
  ```

---

### 2.3 Android 移动端应用 (Kotlin + Jetpack Compose + GCP 发布)

- **发布与分发**：GCP Firebase App Distribution (内测分发) / Google Play Console (公开发布)。
- **开发语言与核心框架**：
  - **编程语言**：Kotlin 1.9+
  - **UI 渲染框架**：Jetpack Compose + Material Design 3
  - **架构模式**：Modern Android Architecture (MVVM / Clean Architecture)
  - **异步与流式通信**：Kotlin Coroutines + StateFlow / SharedFlow + OkHttp SSE EventSource
  - **本地持久化与媒体捕获**：Room Database (本地草稿与离线暂存) + CameraX + Android MediaRecorder
  - **依赖注入**：Hilt / Koin
- **工程目录结构 (`android/`)**：
  ```text
  android/
  ├── app/
  │   ├── src/main/java/ai/evotensor/vanguard/
  │   │   ├── di/             # 依赖注入模块 (NetworkModule, DatabaseModule)
  │   │   ├── domain/         # 业务 UseCases (StreamInsightUseCase, UploadAudioUseCase)
  │   │   ├── data/           # Repositories, Retrofit Services, Room Entities/DAOs
  │   │   ├── ui/             # Compose Screens (HomeScreen, RecordScreen, InsightDetailScreen)
  │   │   │   ├── components/ # 移动端专属组件 (AudioWaveformRecorder, PhotoGrid)
  │   │   │   └── theme/      # Material3 主题样式
  │   │   └── MainActivity.kt
  │   └── build.gradle.kts
  └── settings.gradle.kts
  ```

---

## 3. 多端通信协议与认证规范

1. **统一 API 契约**：
   - **RESTful JSON API**：用于基础 CRUD、事务列表查询、知识库搜索与 GCS 上传预签名获取。
   - **Server-Sent Events (SSE)**：用于多模态素材解析与 Agent 思考过程的实况推送。现已升级为多态数据流，可下发纯文本 `Message`、接口调用 `ToolCall`，以及文件修改补丁 `FilePatch`。
2. **身份鉴权与安全控制**：
   - Web 与 Android 端均通过 Google OAuth2 或 Firebase Auth 登录获取 JWT 令牌。
   - 经过 GCP IAP 网关或直接发送至 `vanguard-api` 时，请求头携带 `Authorization: Bearer <JWT>` 或 `X-Goog-Authenticated-User-Email`。
   - `vanguard-auth` 统一校验 Token 有效性并构建包含 `user_id` 与 `team_id` 的安全 Context。
