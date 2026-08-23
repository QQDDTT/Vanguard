use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum KnowledgeCategory {
    #[serde(rename = "INDUSTRY_BACKGROUND")]
    IndustryBackground,
    #[serde(rename = "CUSTOMER_PATTERN")]
    CustomerPattern,
    #[serde(rename = "COMPETITOR_INSIGHT")]
    CompetitorInsight,
    #[serde(rename = "METHODOLOGY")]
    Methodology,
    #[serde(rename = "CASE_STUDY")]
    CaseStudy,
}

impl ToString for KnowledgeCategory {
    fn to_string(&self) -> String {
        match self {
            KnowledgeCategory::IndustryBackground => "INDUSTRY_BACKGROUND".into(),
            KnowledgeCategory::CustomerPattern => "CUSTOMER_PATTERN".into(),
            KnowledgeCategory::CompetitorInsight => "COMPETITOR_INSIGHT".into(),
            KnowledgeCategory::Methodology => "METHODOLOGY".into(),
            KnowledgeCategory::CaseStudy => "CASE_STUDY".into(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct KnowledgeItem {
    pub id: String,
    pub title: String,
    pub summary: String,
    pub keywords: Vec<String>,
    pub category: String,
    pub content: String,
    pub confidence: f32,
    pub source_engagement_id: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct KnowledgeSearchResult {
    pub item: KnowledgeItem,
    pub score: f32,
}

#[derive(Default)]
pub struct RagEngine;

impl RagEngine {
    pub fn new() -> Self {
        Self
    }

    /// 获取默认初始化知识库种子数据
    pub fn get_seed_knowledge() -> Vec<KnowledgeItem> {
        vec![
            KnowledgeItem {
                id: Uuid::new_v4().to_string(),
                title: "B2B 决策者隐性顾虑：管理控制权丧失".into(),
                summary: "客户表面抱怨系统复杂，实际担心自动化剥夺团队控制权。".into(),
                keywords: vec!["B2B".into(), "控制权".into(), "隐性需求".into(), "组织阻力".into()],
                category: "CUSTOMER_PATTERN".into(),
                content: "在访谈中，当中层管理人员反复强调'新系统过于复杂、员工可能学不会'时，通常不是技术能力问题，而是担心新自动化平台削弱其团队管理权限。应对策略：重点展示角色权限配置（RBAC）与人工审核流控制机制，强调系统是管理赋能而非替代。".into(),
                confidence: 0.92,
                source_engagement_id: None,
                created_at: Utc::now(),
            },
            KnowledgeItem {
                id: Uuid::new_v4().to_string(),
                title: "高频量化机构痛点：实盘配置热更新容错边界".into(),
                summary: "量化团队对配置变更误操作零容忍，强依赖双人复核与快照回滚。".into(),
                keywords: vec!["量化交易".into(), "配置热更".into(), "双因素".into(), "2FA".into()],
                category: "INDUSTRY_BACKGROUND".into(),
                content: "量化回测与实盘交接中，参数漏配与覆盖是头号穿仓隐患。必须在交付工具中引入 TOTP 动态码双人二次校验机制与 Git 版本快照自动 Diff 比对功能。".into(),
                confidence: 0.95,
                source_engagement_id: None,
                created_at: Utc::now(),
            },
            KnowledgeItem {
                id: Uuid::new_v4().to_string(),
                title: "FBE 现场访谈引导技巧：从显性抱怨追溯 JTBD".into(),
                summary: "客户抱怨回测慢时，核心目标往往是确保早上开盘前策略就绪。".into(),
                keywords: vec!["JTBD".into(), "访谈技巧".into(), "引导法".into()],
                category: "METHODOLOGY".into(),
                content: "运用 5-Whys 引导法。当工程师说'我们需要分布式跑 100 个节点'时，探寻'如果只要 30 分钟出结果，是否单机高吞吐也满足？'，从而将客户从特定的实现方案（100 个节点）引导回真实的待办任务目标（开盘前交付）。".into(),
                confidence: 0.88,
                source_engagement_id: None,
                created_at: Utc::now(),
            },
            KnowledgeItem {
                id: Uuid::new_v4().to_string(),
                title: "传统金融客户国产化与私有部署合规约束".into(),
                summary: "国有银行与头部券商严禁直连公网 AI API，需采用隔离网关或专线。".into(),
                keywords: vec!["私有化".into(), "合规".into(), "Rocky Linux".into(), "专线".into()],
                category: "CASE_STUDY".into(),
                content: "某国有券商 PoC 交付经验：现场环境统一为 Rocky Linux 9，公网彻底物理隔离。Agent 模型推断需通过内部白名单正向代理中转，且所有日志必须脱敏落盘。".into(),
                confidence: 0.96,
                source_engagement_id: None,
                created_at: Utc::now(),
            },
        ]
    }

    /// 内存混合检索与过滤
    pub fn search(&self, items: &[KnowledgeItem], query: Option<&str>, category: Option<&str>) -> Vec<KnowledgeSearchResult> {
        let q = query.map(|s| s.trim().to_lowercase()).unwrap_or_default();
        let cat = category.map(|s| s.trim().to_uppercase()).unwrap_or_default();

        let mut results: Vec<KnowledgeSearchResult> = items
            .iter()
            .filter(|item| {
                if !cat.is_empty() && cat != "ALL" && item.category != cat {
                    return false;
                }
                if q.is_empty() {
                    return true;
                }
                let in_title = item.title.to_lowercase().contains(&q);
                let in_summary = item.summary.to_lowercase().contains(&q);
                let in_content = item.content.to_lowercase().contains(&q);
                let in_keywords = item.keywords.iter().any(|k| k.to_lowercase().contains(&q));
                in_title || in_summary || in_content || in_keywords
            })
            .map(|item| {
                let mut score = item.confidence;
                if !q.is_empty() {
                    if item.title.to_lowercase().contains(&q) {
                        score += 0.3;
                    }
                    if item.keywords.iter().any(|k| k.to_lowercase() == q) {
                        score += 0.2;
                    }
                }
                KnowledgeSearchResult {
                    item: item.clone(),
                    score,
                }
            })
            .collect();

        results.sort_by(|a, b| b.score.partial_cmp(&a.score).unwrap_or(std::cmp::Ordering::Equal));
        results
    }
}
