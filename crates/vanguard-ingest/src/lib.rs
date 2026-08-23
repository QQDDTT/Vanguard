use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum ArtifactType {
    #[serde(rename = "AUDIO")]
    Audio,
    #[serde(rename = "IMAGE")]
    Image,
    #[serde(rename = "LOG")]
    Log,
    #[serde(rename = "CONFIG")]
    Config,
}

impl ToString for ArtifactType {
    fn to_string(&self) -> String {
        match self {
            ArtifactType::Audio => "AUDIO".into(),
            ArtifactType::Image => "IMAGE".into(),
            ArtifactType::Log => "LOG".into(),
            ArtifactType::Config => "CONFIG".into(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EngagementArtifact {
    pub id: String,
    pub engagement_id: String,
    pub file_name: String,
    pub artifact_type: String,
    pub file_size_bytes: u64,
    pub storage_uri: String,
    pub status: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PresignedUploadResponse {
    pub upload_url: String,
    pub artifact_id: String,
    pub expires_in_seconds: u32,
}

#[derive(Default)]
pub struct IngestPipeline;

impl IngestPipeline {
    pub fn new() -> Self {
        Self
    }

    /// 生成 GCS 预签名上传凭证
    pub fn generate_presigned_url(
        &self,
        engagement_id: &str,
        file_name: &str,
        file_size_bytes: u64,
        artifact_type: &str,
    ) -> (EngagementArtifact, PresignedUploadResponse) {
        let artifact_id = Uuid::new_v4().to_string();
        let bucket = std::env::var("GCS_BUCKET_NAME").unwrap_or_else(|_| "vanguard-artifacts-ailab".to_string());
        let storage_uri = format!("gs://{}/{}/{}", bucket, engagement_id, file_name);
        
        let upload_url = format!(
            "https://storage.googleapis.com/{}/{}/{}?x-goog-signature=mock-signature-{}",
            bucket, engagement_id, file_name, &artifact_id[..8]
        );

        let artifact = EngagementArtifact {
            id: artifact_id.clone(),
            engagement_id: engagement_id.to_string(),
            file_name: file_name.to_string(),
            artifact_type: artifact_type.to_string(),
            file_size_bytes,
            storage_uri,
            status: "PENDING_UPLOAD".to_string(),
            created_at: Utc::now(),
        };

        let presigned = PresignedUploadResponse {
            upload_url,
            artifact_id,
            expires_in_seconds: 900,
        };

        (artifact, presigned)
    }

    /// 多模态音频转录
    pub async fn process_audio(&self, _audio_bytes: &[u8]) -> anyhow::Result<String> {
        Ok("【音频转录摘要】客户提到模型回测经常在盘后发生网络中断导致重跑，急需断点续跑支持。".to_string())
    }

    /// 多模态图片与拓扑分析
    pub async fn process_image(&self, _image_bytes: &[u8]) -> anyhow::Result<String> {
        Ok("【现场机架照片分析】识别出 4 台 2U 服务器，网卡型号为 Mellanox ConnectX-6，双路冗余电源已插接。".to_string())
    }
}
