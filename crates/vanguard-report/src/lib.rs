use vanguard_agent::SevenDimensionsInsight;

pub struct ReportGenerator;

impl ReportGenerator {
    pub fn generate_markdown(&self, customer_name: &str, insight: &SevenDimensionsInsight) -> String {
        format!(
            "# 📋 FBE 客户洞察报告 — {}\n\n## 1. 显性与隐性需求分析\n- 显性功能需求：{:?}\n- 隐性心理期望：{:?}\n",
            customer_name, insight.functional, insight.latent_desires
        )
    }
}
