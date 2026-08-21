use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Engagement {
    pub id: Uuid,
    pub user_id: Uuid,
    pub customer_name: String,
    pub status: String,
    pub engagement_type: String,
    pub created_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize)]
pub struct CreateEngagementRequest {
    pub customer_name: String,
    pub engagement_type: Option<String>,
}
