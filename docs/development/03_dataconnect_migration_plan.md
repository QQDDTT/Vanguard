# 03. Firebase SQL Connect 架构迁移开发计划

> 状态：规划中
> 目标：将 Vanguard 的数据库存储与基础 CRUD API 方案从原有的「纯 Cloud SQL + Rust API 手工封装」迁移至 **Firebase SQL Connect (Data Connect)**。

## 一、 为什么要做这次架构迁移？

1. **消灭后端冗余代码**：在原架构下，`vanguard-api` (Rust) 需要手写大量的增删改查逻辑、序列化代码和权鉴逻辑。迁移后，这部分代码可删减 80% 以上。
2. **三端类型绝对安全**：前端 (React) 与客户端 (Android) 能够基于 GraphQL 契约，直接使用 `dataconnect:sdk:generate` 自动生成的原生 SDK，拥有 100% 的代码提示与类型安全。
3. **保留强关系与向量检索**：Data Connect 依然建立在 **Cloud SQL PostgreSQL** 之上，因此我们依然可以使用 `@col(dataType: "vector")` 实现知识库的 RAG 检索，同时维持原有的复杂关系型实体设计。
4. **极致分离关注点**：Rust 后端退化为专门处理大模型 (Gemini 2.5) 与计算密集型任务的纯粹 Worker。

---

## 二、 全局开发过程

根据项目演进规划，整体开发过程将严格遵循以下三个阶段进行推进：

### 阶段一：建立契约接口
在编写任何应用逻辑之前，首先定义前后端共用的数据模型与操作规范，确立单一数据源 (Single Source of Truth)。
1. **数据模型契约 (`schema.gql`)**：重写底层结构为 GraphQL Type（包含 `Team`, `User`, `Engagement`, `Artifact`, `Insight`, `KnowledgeItem`），配置 `@auth` 行级鉴权与 `@col(dataType: "vector")`。
2. **操作接口契约 (`queries.gql` & `mutations.gql`)**：定义所有前端与客户端将使用的 API（如 `ListEngagements`, `CreateEngagement`）。
3. **接口文档更新**：废弃 `openapi.yaml` REST 契约，更新 `02_data_model.md` 和 `03_api_design.md`，确立全新的架构规范。

### 阶段二：实现业务模块
基于第一步建立好的、经过编译校验的牢固契约，全面展开三大端核心业务的开发实现。
1. **生成强类型 SDK**：配置 `dataconnect.yaml`，为 React Web 和 Android 自动生成客户端 SDK (`dataconnect:sdk:generate`)。
2. **实现 Rust Agent 核心模块**：`vanguard-api` 专注实现核心业务，即接收分析请求 (`/analyze`)、调度 LLM 工作流，并通过 SSE 流 (`/stream`) 推送分析进度。
3. **实现全栈 UI 交互**：React Web 和 Android 接入 Firebase Data Connect SDK，实现新建事务、文件上传预签名及展示洞察等前端功能。

### 阶段三：重构业务模块
在业务模块跑通后，进行深度的代码重构、清理与性能优化。
1. **清理遗留实现**：彻底删除 Rust 后端原有用于手工 CRUD 的路由、Handler 及多余的请求体验证结构体。
2. **统一前端调用**：排查并替换前端遗留的底层 `fetch` / `Retrofit` 调用，确保 100% 走强类型 SDK。
3. **架构沉淀**：进行代码 Review 与解耦，进一步分离关注点（Rust 仅做大模型调度，Firebase 负责全部关系数据），完成最终的技术文档更新。

---

## 三、 里程碑与验收标准

- [ ] **里程碑 1 (契约建立)**：成功完成 `schema.gql`、`queries.gql` 契约定义并通过编译校验，相关文档更新完毕。
- [ ] **里程碑 2 (业务实现)**：生成全端 SDK，三大端核心业务跑通（含 Agent 流式推送与 UI 展示）。
- [ ] **里程碑 3 (业务重构)**：遗留 REST 代码清理完毕，全栈代码规范对齐，系统架构实现极致解耦。
