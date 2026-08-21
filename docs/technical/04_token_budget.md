# 04. Token 预算与用量控制 — Vanguard

## 1. 定价模型与模态计算标准 (Gemini API 2026)

| 模态/模型 | 计算标准 | 单价 |
|-----------|---------|------|
| 音频 | 25 Tokens / 秒（1 分钟 ≈ 1,500 Tokens） | 按输入 Token 计 |
| 图片 | 1,000 ~ 1,500 Tokens / 张（依分辨率） | 按输入 Token 计 |
| 文本 | ~1 Token / 4 字符（中文约 1 Token / 2 字符） | 按输入 Token 计 |
| Gemini 2.5 Flash | 输入 $0.30 / M | 输出 $1.00 / M |
| Gemini 2.5 Pro | 输入 $1.25 / M | 输出 $10.00 / M |
| Context Caching（Flash） | 存储 $1.00 / M / 小时 | 读取 $0.075 / M（原价 75% 折扣） |

---

## 2. 模型路由策略

不同 Engagement 类型的推理复杂度不同，按阶段路由两种模型：

| 处理阶段 | 使用模型 | 原因 |
|---------|---------|------|
| 音频转录（全部事务类型） | Gemini 2.5 Flash | 纯转录，无需深度推理 |
| 图片结构化描述（全部事务类型） | Gemini 2.5 Flash | 图片基础理解，速度优先 |
| 日志 / 文档摘要预处理 | Gemini 2.5 Flash | 长文本压缩摘要 |
| INTERVIEW 七维度推断 | Gemini 2.5 Pro | 深度心理与社会需求推断，精度优先 |
| INFRA_SURVEY Gap 分析 | Gemini 2.5 Flash | 规则匹配为主，无需复杂推理 |
| POC_TRACKING 卡点分类 | Gemini 2.5 Flash | 分类任务，Flash 足够 |
| TROUBLESHOOTING 根因分析 | Gemini 2.5 Pro | 多日志关联推断，需强推理 |
| SOW_PROPOSAL 提案起草 | Gemini 2.5 Pro | 结构化文档生成，质量优先 |
| RAG 知识库向量化 | text-embedding-004 | 独立 Embedding 模型，768 维 |

---

## 3. 费用控制机制

### 3.1 Context Caching（全局系统 Prompt 缓存）

每种 Engagement 类型对应一份系统级 Prompt 模板，在 Cloud Run 实例级别全局缓存：

| 事务类型 | 系统 Prompt 规模（估算） | 缓存复用收益 |
|---------|----------------------|------------|
| INTERVIEW 七维度分析模板 | ~3,000 Tokens | 每次节省 40-60% 输入成本 |
| INFRA_SURVEY 环境评估规范 | ~1,500 Tokens | 每次节省 ~50% 输入成本 |
| TROUBLESHOOTING RCA 推理链 | ~2,000 Tokens | 每次节省 ~50% 输入成本 |
| SOW_PROPOSAL 提案写作模板 | ~2,500 Tokens | 每次节省 ~40% 输入成本 |

### 3.2 分阶段推断（不一次性发送所有素材）

```text
阶段 1 (Flash): 各素材独立转录/描述 → 各自生成简短摘要（200字以内）
阶段 2 (Flash/Pro): 拼接摘要 + RAG 检索结果 → 发起最终推断
```

分阶段处理可将输入 Token 量降低 **50%-70%**（相对于原始素材直接拼接）。

### 3.3 单次事务 Token 硬限制

| 事务类型 | 软预警阈值 | 硬限制（拒绝执行） |
|---------|-----------|----------------|
| INTERVIEW | 100K Tokens | 150K Tokens |
| INFRA_SURVEY | 50K Tokens | 80K Tokens |
| POC_TRACKING | 80K Tokens | 120K Tokens |
| TROUBLESHOOTING | 80K Tokens | 120K Tokens |
| SOW_PROPOSAL | 60K Tokens | 100K Tokens |

超过软预警时，前端弹出用户确认弹窗后继续；超过硬限制时，API 返回 `token_limit_exceeded` 错误，要求用户删减素材后重试。

---

## 4. 每次事务费用估算示例

### 场景：一次典型 INTERVIEW（60 分钟录音 + 3 张照片）

| 阶段 | 模型 | 输入 Tokens | 输出 Tokens | 费用估算 |
|------|------|------------|------------|---------|
| 音频转录（60 分钟） | Flash | ~90,000 | ~3,000 | $0.030 |
| 图片描述（3 张） | Flash | ~4,500 | ~1,200 | $0.003 |
| 七维度深度推断 | Pro | ~15,000 | ~2,000 | $0.039 |
| RAG Embedding | text-embedding-004 | ~2,000 | — | ~$0.001 |
| **合计** | | **~111,500** | **~6,200** | **~$0.073** |

> Context Caching 可将七维度推断的输入成本再降低约 40%，使总费用降至约 $0.06 以内。

---

## 5. Token 用量监控与审计

- **实时记录**：每次 Gemini API 调用结果写入 `token_logs` 表，关联 `engagement_id`、`model_name`、`cached_tokens`。
- **仪表板**：前端管理页面展示按用户/团队/事务类型的月度 Token 消耗趋势图。
- **预算告警**：月消耗费用超过团队配置阈值（默认 $50/月）时，触发 Cloud Monitoring 邮件告警。
