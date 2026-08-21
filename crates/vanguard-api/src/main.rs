use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::{broadcast, Mutex};
use axum::{
    extract::{Path, State},
    response::{IntoResponse, sse::{Event, Sse}},
    routing::{get, post},
    middleware,
    Json, Router,
};
use sqlx::PgPool;
use sqlx::postgres::PgPoolOptions;
use tower_http::services::ServeDir;
use std::net::SocketAddr;
use tracing::{info, error};
use futures::stream::{Stream, StreamExt};
use tokio_stream::wrappers::BroadcastStream;
use std::convert::Infallible;
use serde::{Deserialize, Serialize};
use vanguard_llm::{GeminiClient, GeminiResponse};
use vanguard_tools::{ToolRegistry, tools::{SystemPingTool, CurlProbeTool, ConfigPatcherTool}};
use vanguard_auth::{mock_auth_middleware, UserContext};
use axum::Extension;

mod models;

#[derive(Clone, Serialize, Deserialize, Debug)]
#[serde(tag = "type")]
pub enum SseEvent {
    Message { content: String },
    ToolCall { name: String, args: serde_json::Value, status: String, result: Option<String> },
    FilePatch { file_path: String, diff: String, rationale: String },
}

#[derive(Clone)]
struct AppState {
    db_pool: PgPool,
    streams: Arc<Mutex<HashMap<String, broadcast::Sender<SseEvent>>>>,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt()
        .with_env_filter("info,vanguard=debug")
        .init();

    info!("Starting Vanguard API Server...");

    let database_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgres://postgres:postgres@localhost:5432/vanguard".to_string());
        
    let db_pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .unwrap_or_else(|_| panic!("Failed to connect to database at {}", database_url));

    let state = AppState {
        db_pool,
        streams: Arc::new(Mutex::new(HashMap::new())),
    };

    let protected_routes = Router::new()
        .route("/engagements", get(list_engagements).post(create_engagement))
        .route("/engagements/:id/analyze", post(analyze_engagement))
        .route("/engagements/:id/stream", get(stream_engagement))
        .layer(middleware::from_fn(mock_auth_middleware));

    let app = Router::new()
        .route("/health", get(health_check))
        .route("/api/v1/status", get(status_handler))
        .nest("/api/v1", protected_routes)
        .nest_service("/", ServeDir::new("web"))
        .with_state(state);

    let port: u16 = std::env::var("PORT")
        .unwrap_or_else(|_| "8080".to_string())
        .parse()?;

    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    info!("Vanguard listening on {}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}

async fn health_check() -> &'static str {
    "OK"
}

async fn status_handler() -> Json<serde_json::Value> {
    Json(serde_json::json!({
        "service": "Vanguard FBE Intelligence Engine",
        "status": "online",
        "version": "0.1.0"
    }))
}

async fn list_engagements(
    Extension(user): Extension<UserContext>,
    State(state): State<AppState>,
) -> impl IntoResponse {
    info!("Listing engagements for user: {}", user.email);
    
    let user_uuid = match uuid::Uuid::parse_str(&user.user_id) {
        Ok(id) => id,
        Err(_) => return (axum::http::StatusCode::BAD_REQUEST, "Invalid user ID format").into_response(),
    };

    let result = sqlx::query_as::<_, models::Engagement>(
        "SELECT * FROM engagements WHERE user_id = $1 ORDER BY created_at DESC"
    )
    .bind(user_uuid)
    .fetch_all(&state.db_pool)
    .await;

    match result {
        Ok(engagements) => Json(serde_json::json!({ "data": engagements })).into_response(),
        Err(e) => {
            error!("Database error: {:?}", e);
            (axum::http::StatusCode::INTERNAL_SERVER_ERROR, "Failed to fetch engagements").into_response()
        }
    }
}

async fn create_engagement(
    Extension(user): Extension<UserContext>,
    State(state): State<AppState>,
    Json(payload): Json<models::CreateEngagementRequest>,
) -> impl IntoResponse {
    info!("Creating engagement for user: {}", user.email);

    let user_uuid = match uuid::Uuid::parse_str(&user.user_id) {
        Ok(id) => id,
        Err(_) => return (axum::http::StatusCode::BAD_REQUEST, "Invalid user ID format").into_response(),
    };

    let eng_type = payload.engagement_type.unwrap_or_else(|| "GENERAL".to_string());

    let result = sqlx::query_as::<_, models::Engagement>(
        r#"
        INSERT INTO engagements (user_id, customer_name, engagement_type)
        VALUES ($1, $2, $3)
        RETURNING *
        "#
    )
    .bind(user_uuid)
    .bind(payload.customer_name)
    .bind(eng_type)
    .fetch_one(&state.db_pool)
    .await;

    match result {
        Ok(engagement) => Json(serde_json::json!({
            "status": "success",
            "data": engagement
        })).into_response(),
        Err(e) => {
            error!("Database error: {:?}", e);
            (axum::http::StatusCode::INTERNAL_SERVER_ERROR, "Failed to create engagement").into_response()
        }
    }
}

async fn analyze_engagement(
    State(state): State<AppState>,
    Path(id): Path<String>
) -> impl IntoResponse {
    info!("Received analyze request for engagement {}", id);
    let job_id = uuid::Uuid::new_v4().to_string();
    
    let (tx, _) = broadcast::channel(100);
    state.streams.lock().await.insert(id.clone(), tx.clone());
    
    let eng_id = id.clone();
    
    // Spawn background task
    tokio::spawn(async move {
        // Simulate Agent Thinking
        let _ = tx.send(SseEvent::Message { content: "Agent initialized...".into() });
        tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
        
        let api_key = std::env::var("GEMINI_API_KEY").unwrap_or_default();
        let client = GeminiClient::new(api_key);
        
        let mut registry = ToolRegistry::new();
        registry.register(SystemPingTool);
        registry.register(CurlProbeTool);
        registry.register(ConfigPatcherTool);
        
        let _ = tx.send(SseEvent::Message { content: "Starting troubleshooting probe...".into() });
        
        let prompt = "Hi, I'm experiencing network issues. Please use the system_ping tool to ping 8.8.8.8 and tell me if it works.";
        let model = "gemini-flash-latest";
        
        let decls = registry.get_declarations();
        
        match client.generate_with_tools(
            Some("You are an expert FBE Vanguard Agent. Always use tools when asked."),
            prompt,
            model,
            Some(decls),
        ).await {
            Ok(GeminiResponse::FunctionCall { name, args }) => {
                // Send executing state
                let _ = tx.send(SseEvent::ToolCall { 
                    name: name.clone(), 
                    args: args.clone(), 
                    status: "Executing".into(), 
                    result: None 
                });
                
                // If it's a ConfigPatcher, also emit a FilePatch event
                if name == "config_patcher" {
                    let file_path = args["file_path"].as_str().unwrap_or_default().to_string();
                    let diff = args["diff_content"].as_str().unwrap_or_default().to_string();
                    let rationale = args["rationale"].as_str().unwrap_or_default().to_string();
                    let _ = tx.send(SseEvent::FilePatch { file_path, diff, rationale });
                }
                
                // Execute tool
                match registry.execute(&name, args.clone()).await {
                    Ok(res) => {
                        let _ = tx.send(SseEvent::ToolCall {
                            name,
                            args,
                            status: "Finished".into(),
                            result: Some(serde_json::to_string_pretty(&res).unwrap_or_default())
                        });
                        let _ = tx.send(SseEvent::Message { content: "Troubleshooting complete.".into() });
                    },
                    Err(e) => {
                        let _ = tx.send(SseEvent::ToolCall {
                            name,
                            args,
                            status: "Error".into(),
                            result: Some(e.to_string())
                        });
                    }
                }
            },
            Ok(GeminiResponse::Text(text)) => {
                let _ = tx.send(SseEvent::Message { content: text });
            },
            Err(e) => {
                error!("Agent failed: {:?}", e);
                let _ = tx.send(SseEvent::Message { content: format!("Error: {}", e) });
            }
        }
    });
    
    Json(serde_json::json!({
        "job_id": job_id,
        "engagement_id": id,
        "status": "PROCESSING",
        "stream_url": format!("/api/v1/engagements/{}/stream", id)
    }))
}

async fn stream_engagement(
    State(state): State<AppState>,
    Path(id): Path<String>
) -> Sse<impl Stream<Item = Result<Event, Infallible>>> {
    info!("Client connected to stream for engagement {}", id);
    
    let rx = {
        let streams = state.streams.lock().await;
        streams.get(&id).map(|tx| tx.subscribe())
    };
    
    let stream = match rx {
        Some(rx) => BroadcastStream::new(rx)
            .filter_map(|msg| async {
                match msg {
                    Ok(sse_event) => {
                        if let Ok(json_str) = serde_json::to_string(&sse_event) {
                            Some(Ok(Event::default().data(json_str)))
                        } else {
                            None
                        }
                    },
                    Err(_) => None,
                }
            })
            .boxed(),
        None => {
            // No active stream found
            futures::stream::once(async { Ok(Event::default().data("Stream ended or not found.")) }).boxed()
        }
    };
    
    Sse::new(stream).keep_alive(axum::response::sse::KeepAlive::new())
}
