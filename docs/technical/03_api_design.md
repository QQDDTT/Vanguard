# 03. REST API 与 WebSocket 设计 — Vanguard

## 0. 契约优先 (API-First) 设计与代码生成

为了保证 Vanguard 的三大端（Rust 后端、React Web、Android）API 接口与数据模型完全一致，本项目采用**契约优先 (API-First)** 的开发模式。

**注意：本项目已废弃传统 `openapi.yaml` REST 契约。现采用 [Firebase SQL Connect GraphQL 契约](../../dataconnect/schema/schema.gql) 管理基础 CRUD，Rust 后端仅暴露定制化特种路由。**

### 跨平台代码对齐指引

所有 API 的路径、请求体、响应体、以及核心枚举均以 `openapi.yaml` 为单一数据源 (Single Source of Truth)。各端开发请遵循以下标准：

1. **Rust 后端 (`vanguard-api`)**：
   - 彻底剥离传统的 CRUD 接口，将其视为一个纯粹的 Agent Task Worker。
   - 暴露 `/analyze` 和 `/stream`，处理 LLM 分析与 SSE 推送。
   - 暴露文件上传鉴权（生成 GCS 预签名 URL）。
2. **React Web UI (TypeScript) & Android (Kotlin)**：
   - 摒弃硬编码的 `fetch` 或 `Retrofit` 手工构建 REST 请求，彻底摒弃旧 `openapi.yaml`。
   - 通过 Firebase CLI (`firebase dataconnect:sdk:generate`) 自动生成对应平台的强类型方法集。
   - 只有在向 GCS 传文件和请求 Agent 分析时，才跨域/直接请求 `vanguard-api` 的定制路由。

---

## 1. 认证规范

所有请求均需携带以下之一的身份凭证，由 `vanguard-auth` crate 统一验证并注入 `UserContext`（包含 `user_id` 与 `team_id`）：

| 客户端 | 鉴权方式 | 请求头 |
|-------|---------|-------|
| Cloud Run + Google IAP | IAP JWT | `X-Goog-Authenticated-User-Email` |
| React Web UI / Android App | Firebase Auth JWT | `Authorization: Bearer <id_token>` |
| 本地开发 | Dev-Mock 中间件 | `X-Dev-User-Email: dev@local` |

---

## 2. 通用约定

- **Base URL**：`/api/v1`
- **数据格式**：`Content-Type: application/json`（除文件上传端点外）
- **错误响应格式**：

```json
{
  "error": "engagement_not_found",
  "message": "Engagement with id=xxx does not exist",
  "status": 404
}
```

- **分页**：列表接口统一支持 `?page=1&page_size=20` 查询参数。
- **SSE 流式端点**：`Content-Type: text/event-stream`，携带标准 `event` / `data` / `id` 字段。

---

## 3. 前端直连操作（Firebase Data Connect）

所有基础 CRUD 操作（创建事务、列表查询、修改状态）**不再通过 Rust 后端暴露 REST API**，而是由客户端直接调用 Data Connect 生成的 SDK（底层为 GraphQL），从而实现类型安全与零后端代码。

**核心生成的 SDK 函数示例：**
- `createEngagement({ type, customerName, title })`
- `listEngagements({ teamId })`
- `getEngagementDetails({ id })`
- `createInsight({ engagementId, dimension, content })`

详情请参阅 `dataconnect/connector/queries.gql` 与 `mutations.gql`。

---

## 4. Rust 后端保留 API (`vanguard-api`)

Rust 后端仅提供高计算密集型或涉及第三方云鉴权的接口。

### 3.2 素材上传流程（GCS Presigned URL）

大文件采用两步上传，避免音频/图片流量直穿 Cloud Run 容器。

| 步骤 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 1 | `POST` | `/api/v1/engagements/:id/artifacts/presign` | 申请 GCS 上传预签名 URL |
| 2 | `PUT` | `<presigned_url>`（GCS 直传） | 客户端直传文件至 GCS |
| 3 | `POST` | `/api/v1/engagements/:id/artifacts/confirm` | 确认上传完成，创建 `engagement_artifacts` 记录 |

**预签名申请请求体：**

```json
{
  "file_name": "site_visit_rack_photo.jpg",
  "file_size_bytes": 2048000,
  "artifact_type": "IMAGE"
}
```

**预签名响应：**

```json
{
  "upload_url": "https://storage.googleapis.com/...",
  "artifact_id": "uuid-xxx",
  "expires_in_seconds": 900
}
```

---

## 4. Agent 分析 API

### 4.1 触发分析

| 方法 | 路径 | 说明 |
|------|------|------|
| `POST` | `/api/v1/engagements/:id/analyze` | 异步触发 Agent 分析流水线（立即返回 `job_id`） |

分析任务按 `engagement_type` 路由不同的 Prompt 流水线：

| `engagement_type` | Prompt 策略 | 输出 |
|-------------------|------------|------|
| `INTERVIEW` | 七维度需求挖掘 | `insights[]` + Markdown 报告 |
| `INFRA_SURVEY` | 环境 Gap 对比 + Prerequisites 清单 | 结构化缺陷清单 |
| `POC_TRACKING` | 达成率评估 + Blocker 分类 | 卡点矩阵 |
| `TROUBLESHOOTING` | RCA 根因分析 + 知识萃取 | 故障报告 + 待 promote 知识 |
| `SOW_PROPOSAL` | SOW 草稿 + Upsell Insights | Markdown SOW 文档 |

**响应示例：**

```json
{
  "job_id": "uuid-yyy",
  "engagement_id": "uuid-xxx",
  "status": "PROCESSING",
  "stream_url": "/api/v1/engagements/uuid-xxx/stream"
}
```

---

### 4.2 SSE 实时流式输出

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/api/v1/engagements/:id/stream` | SSE 端点，实时推送 Agent 思考过程与生成结果 |

**SSE 事件格式：**

```
event: thinking
data: {"step": "transcribing_audio", "message": "正在转录录音 site_audio.m4a..."}

event: insight
data: {"dimension": "PAIN_POINT", "content": "客户现有系统每月人工报表耗时约 40 小时"}

event: done
data: {"engagement_id": "uuid-xxx", "report_url": "/api/v1/engagements/uuid-xxx/report"}
```

---

## 5. 洞察管理 API

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/api/v1/engagements/:id/insights` | 获取事务下所有洞察（可按 `dimension` 过滤） |
| `POST` | `/api/v1/engagements/:id/insights` | 手动添加洞察条目 |
| `POST` | `/api/v1/insights/:id/promote` | 将洞察一键提升为团队知识库条目 |

---

## 6. 知识库管理 API

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/api/v1/knowledge` | 混合检索（向量 + 全文），支持 `?q=`、`?category=` 过滤 |
| `POST` | `/api/v1/knowledge` | 手动录入原子化知识条目 |
| `GET` | `/api/v1/knowledge/:id` | 获取单条知识详情 |
| `DELETE` | `/api/v1/knowledge/:id` | 删除知识条目（仅创建者或团队管理员可操作） |

---

## 7. 报告导出 API

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/api/v1/engagements/:id/report` | 获取事务洞察 Markdown 报告 |
| `GET` | `/api/v1/engagements/:id/report?format=html` | 获取 HTML 渲染版本 |
| `GET` | `/api/v1/engagements/:id/report?format=pdf` | 导出 PDF（v2 规划） |
