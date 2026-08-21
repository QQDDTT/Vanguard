# 02. 数据模型与 SQL Schema — Vanguard

## 1. 数据库隔离方案说明

- **私有资源**（事务、素材附件、未归档洞察）强制挂载 `user_id`，查询时自动过滤其他用户数据。
- **团队共享资源**（知识库条目）挂载 `team_id`，仅 `is_shared = true` 的记录可被跨成员检索。

---

## 2. 核心数据表结构

### 2.1 组织与账号模型 (多租户架构)

Vanguard 采用 `Team -> User` 的双层隔离，以支持多名 FBE 在不同企业主体下协同。
此部分模型受 Firebase Auth (`auth.uid`) 统一驱动，在 GraphQL Schema 中被定义。

```graphql
type Team @table {
  id: UUID! @default(expr: "uuidV4()")
  name: String!
  createdAt: Timestamp! @default(expr: "request.time")
}

type User @table(key: "uid") {
  uid: String! @default(expr: "auth.uid")
  email: String! @unique
  displayName: String!
  team: Team!
  createdAt: Timestamp! @default(expr: "request.time")
}
```

---

### 2.2 事务层：统一 Engagement 抽象

> 业务扩充说明：原 `interviews` 表已升级为通用 `engagements` 表，支持五种事务类型。现通过 GraphQL Data Connect 管理。

```graphql
# 事务类型枚举
enum EngagementType {
  INTERVIEW
  INFRA_SURVEY
  POC_TRACKING
  TROUBLESHOOTING
  SOW_PROPOSAL
}

# 事务状态枚举
enum EngagementStatus {
  CREATED
  PROCESSING
  COMPLETED
  FAILED
}

# 统一现场事务表（原 interviews 升级版）
type Engagement @table {
  id: UUID! @default(expr: "uuidV4()")
  user: User!
  team: Team!
  type: EngagementType! @default(value: INTERVIEW)
  status: EngagementStatus! @default(value: CREATED)
  customerName: String!
  title: String
  context: String
  createdAt: Timestamp! @default(expr: "request.time")
  updatedAt: Timestamp! @default(expr: "request.time")
}
```

---

### 2.3 素材层：多模态附件

```graphql
# 附件类型枚举
enum ArtifactType {
  AUDIO
  IMAGE
  LOG
  NOTE
  DOCUMENT
}

# 多模态素材附件表（挂载至 engagements）
type Artifact @table(name: "engagement_artifacts") {
  id: UUID! @default(expr: "uuidV4()")
  engagement: Engagement!
  type: ArtifactType!
  storageUrl: String!
  fileName: String!
  fileSizeBytes: Int64
  transcript: String
  createdAt: Timestamp! @default(expr: "request.time")
}
```

---

### 2.4 洞察层：Agent 分析结果

> 补充说明：此表在旧 init.sql 中遗漏，本次文档正式定义。

```graphql
# 洞察维度枚举
enum InsightDimension {
  FUNCTIONAL
  PAIN_POINT
  JOBS_TO_BE_DONE
  LATENT_DESIRE
  EMOTIONAL
  SOCIAL
  CONSTRAINT
}

# 结构化洞察记录表
type Insight @table {
  id: UUID! @default(expr: "uuidV4()")
  engagement: Engagement!
  user: User!
  dimension: InsightDimension!
  content: String!
  confidence: Float @default(value: 0.85)
  isPromoted: Boolean @default(value: false)
  createdAt: Timestamp! @default(expr: "request.time")
}
```

---

### 2.5 知识库层：团队原子化知识

```graphql
# 知识条目分类枚举
enum KnowledgeCategory {
  INDUSTRY_BACKGROUND
  CUSTOMER_PATTERN
  COMPETITOR_INSIGHT
  METHODOLOGY
  CASE_STUDY
}

# 原子化团队知识库表
type KnowledgeItem @table @index(fields: ["category", "team"], order: [ASC, ASC]) {
  id: UUID! @default(expr: "uuidV4()")
  team: Team!
  title: String! @searchable
  summary: String! @searchable
  keywords: [String!]!
  category: KnowledgeCategory!
  content: String! @searchable
  confidence: Float @default(value: 1.0)
  source: String
  createdBy: User
  
  # 向量字段，由 PostgreSQL 的 pgvector 扩展支持
  embedding: Vector! @col(size: 768)
  
  createdAt: Timestamp! @default(expr: "request.time")
  updatedAt: Timestamp! @default(expr: "request.time")
}
```

---

### 2.6 计费层：Token 用量日志

```graphql
type TokenLog @table {
  id: UUID! @default(expr: "uuidV4()")
  user: User!
  engagement: Engagement
  modelName: String!
  inputTokens: Int!
  outputTokens: Int!
  cachedTokens: Int @default(value: 0)
  costUsd: Float!
  timestamp: Timestamp! @default(expr: "request.time")
}
```

---

## 3. 跨表关联关系一览

```text
teams ──┬── users ──┬── engagements ──┬── engagement_artifacts
        │           │                 └── insights
        └── knowledge_items            └── (promote) ──► knowledge_items
                                token_logs ──► engagements
```

---

## 4. 变更日志

| 版本 | 变更内容 |
|------|---------|
| v1.0 | 初始设计，包含 `interviews` + `knowledge_items` + `token_logs` |
| v2.0 | `interviews` 升级为通用 `engagements`（支持 5 种事务类型）；补全 `insights` 表；新增 `ts_content` 全文检索字段与 GIN 索引；`token_logs` 关联 `engagement_id`；`engagements` 新增 `team_id` 与 `title`/`context` 字段 |
