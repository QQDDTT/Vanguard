use serde::{Deserialize, Serialize};
use axum::{
    extract::Request,
    middleware::Next,
    response::Response,
};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserContext {
    pub user_id: String,
    pub email: String,
    pub team_id: String,
}

pub fn parse_iap_header(iap_jwt: &str) -> Result<UserContext, String> {
    // 基础鉴权解析占位
    if iap_jwt.is_empty() {
        return Err("Missing IAP JWT header".to_string());
    }
    Ok(UserContext {
        user_id: "00000000-0000-0000-0000-000000000001".to_string(),
        email: "fbe_engineer@evotensor.ai".to_string(),
        team_id: "00000000-0000-0000-0000-000000000002".to_string(),
    })
}

pub async fn mock_auth_middleware(
    mut req: Request,
    next: Next,
) -> Result<Response, axum::http::StatusCode> {
    // For local dev, inject a mock UserContext directly
    let mock_user = UserContext {
        user_id: "00000000-0000-0000-0000-000000000001".to_string(),
        email: "fbe_engineer@evotensor.ai".to_string(),
        team_id: "00000000-0000-0000-0000-000000000002".to_string(),
    };
    
    req.extensions_mut().insert(mock_user);
    
    Ok(next.run(req).await)
}
