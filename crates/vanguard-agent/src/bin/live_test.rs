use vanguard_llm::{GeminiClient, GeminiResponse};
use vanguard_tools::{ToolRegistry, tools::{SystemPingTool, CurlProbeTool, ConfigPatcherTool}};
use std::env;
use tracing::{info, error};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt()
        .with_env_filter("info")
        .init();

    let api_key = match env::var("GEMINI_API_KEY") {
        Ok(key) => key,
        Err(_) => {
            error!("GEMINI_API_KEY environment variable is missing!");
            error!("Please run this command as: GEMINI_API_KEY=your_key_here cargo run --bin live_test");
            std::process::exit(1);
        }
    };

    info!("Initializing Vanguard Tools Registry...");
    let mut registry = ToolRegistry::new();
    registry.register(SystemPingTool);
    registry.register(CurlProbeTool);
    registry.register(ConfigPatcherTool);

    let declarations = registry.get_declarations();
    info!("Registered {} tools: {:?}", declarations.len(), declarations.iter().map(|d| d["name"].as_str().unwrap()).collect::<Vec<_>>());

    let client = GeminiClient::new(api_key);
    let model = "gemini-flash-latest"; // Use the standard model string
    
    // Test 1: Simple Prompt
    let prompt = "Hi, can you use your tools to ping 8.8.8.8 to see if it responds? Please use the system_ping tool.";
    
    info!("----------------------------------------");
    info!("Sending Prompt to Gemini: {}", prompt);
    info!("----------------------------------------");

    match client.generate_with_tools(
        Some("You are a helpful Vanguard Agent. You must use tools when asked to check network connectivity or APIs."),
        prompt,
        model,
        Some(declarations),
    ).await {
        Ok(response) => {
            match response {
                GeminiResponse::FunctionCall { name, args } => {
                    info!("🤖 Gemini requested a Tool Call!");
                    info!("🔧 Tool Name: {}", name);
                    info!("📦 Arguments: {}", serde_json::to_string_pretty(&args).unwrap());
                    
                    info!("▶️ Executing tool locally...");
                    match registry.execute(&name, args).await {
                        Ok(result) => {
                            info!("✅ Tool execution succeeded!");
                            info!("📄 Result: {}", serde_json::to_string_pretty(&result).unwrap());
                        }
                        Err(e) => {
                            error!("❌ Tool execution failed: {}", e);
                        }
                    }
                }
                GeminiResponse::Text(text) => {
                    info!("🤖 Gemini returned regular text instead of a tool call:");
                    info!("{}", text);
                }
            }
        }
        Err(e) => {
            error!("❌ Gemini API Request Failed: {}", e);
        }
    }

    Ok(())
}
