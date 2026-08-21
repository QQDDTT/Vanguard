use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct KnowledgeSearchResult {
    pub id: String,
    pub title: String,
    pub content: String,
    pub score: f32,
}

pub struct RagEngine;

impl RagEngine {
    pub async fn hybrid_search(&self, _query: &str, _team_id: &str) -> anyhow::Result<Vec<KnowledgeSearchResult>> {
        // pgvector + 全文检索混合重排序骨架
        Ok(vec![])
    }
}
