# 02. FBE 全生命周期事务扩展规范 — Vanguard

## 1. 概述与业务背景

Vanguard 最初的核心场景基于**客户访谈（Interviews）**的需求挖掘。但在实际的前线部署工程（FBE, Frontier/Forward Deployed Engineer）日常工作中，FBE 贯穿了从**售前技术勘测、PoC 试点、现场故障排查到交付复盘**的全生命周期。

本文档定义了 Vanguard 平台支持的扩展事务（Engagements）规范，将平台从单一访谈工具升级为 **FBE 全流程智能工作台**。

---

## 2. 五大扩展事务规范

### 2.1 现场勘测与基础设施审计 (Field Survey & Infra Audit)

- **场景定义**：FBE 深入客户现场/机房，评估部署环境的硬件配置、网络拓扑与安全合规边界。
- **多模态输入**：
  - 机房/服务器机架照片、网络拓扑结构图
  - 防火墙策略与网络隔离规则文本/截图
  - 操作系统版本与硬件 Specs 配置文件
- **Agent 分析输出**：
  - **环境 Gap 诊断**：对比产品标准部署要求，列出缺少的依赖或合规隐患。
  - **前置准备清单 (Prerequisites Checklists)**：生成供客户 IT 团队完成的前置准备项。

### 2.2 PoC 试点与卡点追踪 (PoC Milestone & Blocker Tracker)

- **场景定义**：在概念验证（PoC）阶段，验证产品在客户真实数据集和业务流中的表现，追踪阻碍签单的关键卡点。
- **多模态输入**：
  - PoC 测试用例执行记录与日志
  - 客户测试人员在聊天工具中的报错反馈
  - 性能基准测试结果文本
- **Agent 分析输出**：
  - **交付达成率评估**：对比客户最初的业务目标 (Jobs-to-be-done)，评估当前 PoC 达成度。
  - **卡点分类 (Blocker Extractor)**：自动归类卡点为“产品缺陷”、“环境配置错误”或“未预期的隐性需求”。

### 2.3 竞品攻防与替换迁移分析 (Competitor Battlecard & Migration)

- **场景定义**：客户现场已有运行中的竞品或旧系统，FBE 需要收集竞品短板并制定平滑迁移策略。
- **多模态输入**：
  - 竞品 UI 界面截图/操作录屏
  - 客户吐槽竞品的反馈记录
  - 竞品 API 文档或数据库 Schema 镜像
- **Agent 分析输出**：
  - **竞品劣势矩阵**：自动对齐竞品的性能短板、高运维成本与功能缺陷。
  - **迁移路线图 (Migration Playbook)**：生成平滑替换方案与 FBE 现场技术攻防话术。

### 2.4 现场故障排查与 Post-Mortem 沉淀 (Site Issue & Knowledge Promotion)

- **场景定义**：部署或试运行期间处理突发特例故障，排查后需将经验沉淀为全团队可复用的知识。
- **多模态输入**：
  - 现场终端报错日志 (Terminal logs)
  - 抓包分析文件摘要 (Wireshark/tcpdump summary)
  - FBE 的临时排查笔记
- **Agent 分析输出**：
  - **故障根因分析 (RCA)**：结合 RAG 检索团队历史库，定位根因与临时 Workaround。
  - **一键知识萃取 (Ticket-to-Knowledge)**：将排查结论提炼为 `METHODOLOGY` 或 `CASE_STUDY` 分类的原子化团队知识条目。

### 2.5 SOW 实施提案与交付复盘 (SOW Generation & Sign-off Review)

- **场景定义**：基于前期勘测与需求分析，草拟工作说明书（SOW），并在最终交付后挖掘增购机会。
- **多模态输入**：
  - 历史七维度洞察报告与勘测记录
  - 交付验收会议录音/笔记
- **Agent 分析输出**：
  - **SOW 实施提案草稿**：自动填报实施时间表、硬件推荐配置与职责边界。
  - **二期增购洞察 (Upsell Insights)**：分析验收会议记录，提取客户口头提及的二期开发或扩展意向。

---

## 3. 数据模型与架构扩展方案

为了支持上述多事务扩展，系统数据模型将原有的 `interviews` 实体抽象并扩展为通用的 `engagements` 实体：

```sql
-- 事务类型枚举扩展
CREATE TYPE engagement_type AS ENUM (
    'INTERVIEW',        -- 客户访谈
    'INFRA_SURVEY',     -- 现场勘测
    'POC_TRACKING',     -- PoC 试点
    'TROUBLESHOOTING',  -- 故障排查
    'SOW_PROPOSAL'      -- 方案提案
);

-- 现场事务通用表
CREATE TABLE IF NOT EXISTS engagements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    customer_name TEXT NOT NULL,
    type engagement_type NOT NULL DEFAULT 'INTERVIEW',
    status TEXT NOT NULL DEFAULT 'CREATED',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

通过这一抽象，`vanguard-ingest` 与 `vanguard-agent` 可根据不同的 `engagement_type` 动态路由对应的多模态解析流水线与 Prompt 推理模版。
