use serde::{Deserialize, Serialize};
use vanguard_llm::GeminiClient;
use anyhow::{Context, Result};
use tracing::info;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SevenDimensionsInsight {
    pub functional: Vec<String>,
    pub pain_points: Vec<String>,
    pub jobs_to_be_done: Vec<String>,
    pub latent_desires: Vec<String>,
    pub emotional_needs: Vec<String>,
    pub social_needs: Vec<String>,
    pub constraints: Vec<String>,
}

pub struct InsightAgent {
    llm: GeminiClient,
}

impl InsightAgent {
    pub fn new(api_key: String) -> Self {
        Self {
            llm: GeminiClient::new(api_key),
        }
    }

    pub async fn analyze_interview(&self, transcript: &str) -> Result<SevenDimensionsInsight> {
        info!("Starting analyze_interview with transcript length: {}", transcript.len());

        let system_prompt = "You are an expert Forward Deployed Engineer (FBE).
Analyze the following customer interview transcript and extract insights into the Seven Dimensions framework.
Output strictly as a JSON object matching the following schema:
{
  \"functional\": [\"string\"],
  \"pain_points\": [\"string\"],
  \"jobs_to_be_done\": [\"string\"],
  \"latent_desires\": [\"string\"],
  \"emotional_needs\": [\"string\"],
  \"social_needs\": [\"string\"],
  \"constraints\": [\"string\"]
}";

        let value = self.llm.generate_structured(
            Some(system_prompt),
            &format!("Transcript:\n{}", transcript),
            "gemini-2.5-pro",
        ).await.context("Failed to generate structured response from Gemini")?;

        let insight: SevenDimensionsInsight = serde_json::from_value(value)
            .context("Failed to deserialize JSON into SevenDimensionsInsight")?;

        Ok(insight)
    }
}
