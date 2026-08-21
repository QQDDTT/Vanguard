# 04. 阶段二：业务模块实现指南

本文档基于 `03_dataconnect_migration_plan.md` 中定义的“三步走”战略的第二阶段，详细规划了 Vanguard 系统核心业务模块的具体实现路径。

在完成“契约建立”（Phase 1）之后，前后端数据结构（GraphQL Schema）已经锁定。接下来的任务是并行开发三大端的业务逻辑，使 Agent 能力真正落地。

---

## 1. 核心业务范畴

业务模块实现阶段的核心目标是完成 **FBE 现场智能辅助工作流**：
- 前端能够使用自动生成的 SDK 进行 CRUD 操作。
- 能够向云端（GCS）安全地上传现场图片、录音等素材。
- 能够一键触发 Agent 分析任务，并在界面上实时看到流式分析结果。

---

## 2. 三大端实现路径

### 2.1 Web 与 Android 前端（UI 交互与数据流）

前端（React Web 与 Android App）将完全摒弃手写 REST API 请求（`fetch` / `Retrofit`），转而使用 Phase 1 中由 Data Connect 编译生成的强类型 SDK。

#### 核心任务
1. **Data Connect SDK 接入**：
   - 引入生成的 SDK (`@vanguard/dataconnect` 及 Kotlin 对应的 `DataClass`)。
   - 绑定 Firebase Auth 登录态，实现 `ListEngagements` 和 `GetEngagementDetails` 的无缝渲染。
2. **离线与新建操作**：
   - 调用 `CreateEngagement` 等 Mutation 接口，支持新建各类现场事务。
3. **文件上传流程（GCS 预签名直传）**：
   - 跨域向 Rust 后端请求 `/api/v1/engagements/:id/artifacts/presign`，获取短期 GCS `upload_url`。
   - 前端直传大体积附件，成功后调用 `CreateArtifact` 记录元数据。
4. **Agent 分析与 SSE 流媒体接入**：
   - 界面上点击“开始智能分析”。
   - 跨域请求 Rust 后端 `/api/v1/engagements/:id/analyze` 触发任务，获得 `stream_url`。
   - 通过 `EventSource` 连接 SSE，在界面上打字机式实时呈现 LLM 的思考过程和最终推断出的 `Insights`。

### 2.2 Rust 后端（Agent 核心调度模块）

原有的 `vanguard-api` 后端项目将发生根本性质变：从一个传统的“数据搬运工 (CRUD API)” 进化为一个纯粹的 **AI 任务调度计算节点 (Agent Worker)**。

#### 核心任务
1. **路由瘦身与重构**：
   - 仅保留 `/artifacts/presign`、`/analyze` 和 `/stream` 等高附加值路由。
2. **Gemini AI Logic 集成**：
   - 在 `/analyze` 中，接入 `google-genai` Rust SDK，加载 `gemini-2.5-pro` 或 `gemini-2.5-flash`。
   - 针对 5 种不同的事务类型 (`EngagementType`) 挂载对应的系统 Prompt（如"七维度挖掘"、"POC 卡点追踪"）。
   - 解析素材（音频/图片 URL），随附 Context 发送给多模态 Gemini 大模型进行分析。
3. **SSE 流与数据回写**：
   - 在处理模型 Streaming 返回时，通过 SSE (`tokio::sync::mpsc`) 向前端实时推送过程数据。
   - 在分析完成后，Rust 后端使用 Server 权限（或通过 SQL Connect Admin SDK / 原生 SQL）将生成的 `Insights` 结构化记录强行写回数据库。
4. **向量生成（Knowledge 模块准备）**：
   - 若涉及知识库提炼，调用 Embedding API 获取向量。
   - 利用 `pgvector` 将提炼出的团队知识写入底层 PostgreSQL 数据库。

---

## 3. 开发规范与验证标准

- **绝对禁止前端直连大模型**：所有的 Prompt 组装、上下文缓存管理、Token 计费统计必须在 Rust 后端完成。
- **绝对的数据链路解耦**：Rust 后端在生成最终分析结果后，是将数据**写入**数据库，而前端则是通过 Data Connect SDK 从数据库**读取**。这两者的耦合点仅仅是底层 PostgreSQL 的 Table。
- **验证手段**：
  - 启动本地前端页面，检查能否顺畅拉取由 Data Connect 生成的空白事务列表。
  - 测试上传一张现场服务器图片，触发 `INFRA_SURVEY` 分析。
  - 前端能看到 SSE 实时吐出的检测报告，刷新页面后能看到强类型化的 `Insights` 记录。

---

## 4. 下一步任务分解

针对 Phase 2，我们将按照以下顺序执行：
1. `[ ]` **前端 UI 铺底**：搭建 React/Android 核心列表页面，引入 Data Connect SDK 拉取数据。
2. `[ ]` **GCS 上传打通**：在 Rust 后端实现文件上传鉴权机制，跑通文件直传。
3. `[ ]` **Agent 流水线建设**：在 Rust 侧实现核心的 LLM 调用链及 SSE 下发逻辑。
4. `[ ]` **闭环联调**：多模态分析结果回写及前端展示展示。
