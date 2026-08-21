# 🛡️ Vanguard — FBE 客户洞察 Agent 平台

**Vanguard** 是专门为前线部署工程师（FBE, Frontier/Forward Deployed Engineer）打造的客户洞察与需求挖掘平台。

通过集成多模态 AI Agent 与专属知识库，Vanguard 能够协助 FBE 将采访中的零散素材（音频、照片、文本）转化为结构化的显性与隐性需求洞察。

---

## 🏗️ 架构概览 (Architecture Overview)

- **完全自主开发 (Pure Rust Backend)**：基于 Axum 框架与 Tokio 异步运行时，零三方框架依赖。
- **云端部署 (GCP Cloud-First)**：部署于 GCP `evotensor-ai-lab` 项目，依托 Cloud Run + Cloud SQL (Postgres + pgvector)。
- **多模态与 LLM 引擎**：自研 Gemini 2.5 API 客户端，结合 Flash (音频转录与快速提取) 与 Pro (深度推断)。
- **隔离与安全性**：基于 Google IAP 身份认证与 PostgreSQL 行级数据隔离（方案 A）。
- **原生 PWA 前端**：零框架 Vanilla HTML/CSS/JS 实现，支持桌面与移动端 PWA 安装。

---

## 📖 文档导航 (Documentation Index)

### 💼 业务相关 (Business)
- [01. 产品需求文档 (PRD)](docs/business/01_product_requirements.md)
- [02. FBE 全生命周期事务扩展](docs/business/02_engagement_workflows.md)
- [03. Agent 知识库规范](docs/business/03_knowledge_base_spec.md)
- [04. Web UI 使用手册](docs/business/04_web_ui_manual.md)

### 🛠️ 技术相关 (Technical)
- [01. 全栈系统架构设计](docs/technical/01_architecture.md)
- [02. 数据模型与 SQL Schema](docs/technical/02_data_model.md)
- [03. REST API 与 WebSocket 设计](docs/technical/03_api_design.md)
- [04. Token 预算与用量控制](docs/technical/04_token_budget.md)
- [05. GCP AI Lab 部署指南](docs/technical/05_deployment_ailab.md)

### 🔨 开发文档 (Development)
- [00. 开发文档总览](docs/development/README.md)
- [01. 开发环境与工作流指南](docs/development/01_dev_guide.md)
- [02. 开发进度追踪](docs/development/02_progress.md)
- [03. Firebase SQL Connect 架构迁移计划](docs/development/03_dataconnect_migration_plan.md)

---

## 🛠️ 项目结构 (Workspace Structure)

```text
Vanguard/
├── Cargo.toml                  # Rust Workspace 根配置
├── crates/
│   ├── vanguard-api/           # Axum HTTP/WebSocket 接口服务
│   ├── vanguard-auth/          # Google IAP / Firebase Auth 认证与多租户隔离
│   ├── vanguard-ingest/        # 多模态素材 (音频/图片/文本) 解析流水线
│   ├── vanguard-agent/         # 七维度需求提取 Agent 引擎
│   ├── vanguard-llm/           # 自研 Gemini 2.5 API HTTP 客户端
│   ├── vanguard-rag/           # 基于 pgvector 的混合检索
│   └── vanguard-report/        # Markdown 洞察报告生成器
├── web/                        # React + TypeScript + Vite Web UI (SPA)
├── android/                    # Kotlin + Jetpack Compose Android 应用
├── docs/
│   ├── business/               # 业务相关文档（PRD、事务规范、知识库）
│   ├── technical/              # 技术相关文档（架构、API、数据模型、部署）
│   └── development/            # 开发方式与进度跟踪
├── infra/                      # Cloud Run / Docker / Postgres SQL 初始化脚本
└── scripts/                    # 开发与部署辅助脚本
```
