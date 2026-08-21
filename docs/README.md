# 📚 Vanguard 文档库 (Documentation Center)

Vanguard 项目文档分为**业务相关**与**技术相关**两大模块：

---

## 💼 业务相关文档 (Business Documentation)

聚焦于 FBE 产品定位、客户需求分析框架、现场工作流以及知识库沉淀规范。

- [01. 产品需求文档 (PRD)](business/01_product_requirements.md)
  - 核心痛点、七维度需求挖掘框架、用户故事 (User Stories)。
- [02. FBE 全生命周期事务扩展规范](business/02_engagement_workflows.md)
  - 现场勘测、PoC 试点、竞品攻防、故障排查与 SOW 提案等 5 大扩展事务。
- [03. Agent 知识库规范](business/03_knowledge_base_spec.md)
  - 面向 Agent 的原子化知识库（200-500字）、5 大分类 Enum 与 JSON 契约。

---

## 🛠️ 技术相关文档 (Technical Documentation)

涵盖系统架构、数据库模型、API 接口设计、Token 费用控制及云端部署指导。

- [01. 全栈系统架构设计](technical/01_architecture.md)
  - 系统总体拓扑、GCP+Rust Agentic 平台、GCP+React Web UI 及 GCP发布 Android 应用的全栈架构与依赖。
- [02. 数据模型与 SQL Schema](technical/02_data_model.md)
  - Postgres 行级隔离方案、pgvector 向量表及初始化 `init.sql` 说明。
- [03. REST API 与 WebSocket 设计](technical/03_api_design.md)
  - Google IAP 请求头解析、采访/事务 API 及 SSE 流式端点规范。
- [📄 OpenAPI 3.0 契约文档](technical/openapi.yaml)
  - **(重要)** 三大端 API 与数据结构的单一数据源 (Single Source of Truth)。
- [04. Token 预算与用量控制](technical/04_token_budget.md)
  - Gemini 2.5 Flash / Pro 模型路由策略、Context Caching 及 150K Token 硬限制。
- [05. GCP AI Lab 部署指南](technical/05_deployment_ailab.md)
  - 基于 Cloud Build 与 Cloud Run 的 CI/CD 及 GCP `evotensor-ai-lab` 部署指南。

---

## 🔨 开发文档 (Development)

记录开发方式、本地环境搭建与实时功能进度。

- [00. 开发文档总览](development/README.md)
- [01. 开发环境与工作流指南](development/01_dev_guide.md)
  - 本地 PostgreSQL、Rust/React/Android 开发启动方式、分支策略、代码规范。
- [02. 开发进度追踪](development/02_progress.md)
  - 三大端各模块功能完成状态与里程碑计划（持续更新）。
