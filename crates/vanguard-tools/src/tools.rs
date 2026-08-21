use crate::Tool;
use anyhow::{Context, Result};
use async_trait::async_trait;
use serde_json::Value;
use tokio::process::Command;

pub struct SystemPingTool;

#[async_trait]
impl Tool for SystemPingTool {
    fn name(&self) -> &str {
        "system_ping"
    }

    fn description(&self) -> &str {
        "Executes a network ping to test connectivity to a target host or IP."
    }

    fn parameters_schema(&self) -> Value {
        serde_json::json!({
            "type": "OBJECT",
            "properties": {
                "host": {
                    "type": "STRING",
                    "description": "The target hostname or IP address to ping"
                },
                "count": {
                    "type": "INTEGER",
                    "description": "Number of packets to send (default 4)"
                }
            },
            "required": ["host"]
        })
    }

    async fn execute(&self, args: Value) -> Result<Value> {
        let host = args["host"].as_str().context("Missing host parameter")?;
        
        // Basic security check (preventing command injection)
        if host.contains(';') || host.contains('&') || host.contains('|') {
            anyhow::bail!("Invalid characters in host string");
        }

        let count = args["count"].as_i64().unwrap_or(4).clamp(1, 10);
        
        let output = Command::new("ping")
            .arg("-c")
            .arg(count.to_string())
            .arg(host)
            .output()
            .await?;

        let stdout = String::from_utf8_lossy(&output.stdout).into_owned();
        let stderr = String::from_utf8_lossy(&output.stderr).into_owned();
        
        Ok(serde_json::json!({
            "success": output.status.success(),
            "stdout": stdout,
            "stderr": stderr
        }))
    }
}

pub struct CurlProbeTool;

#[async_trait]
impl Tool for CurlProbeTool {
    fn name(&self) -> &str {
        "curl_probe"
    }

    fn description(&self) -> &str {
        "Executes a GET HTTP request to probe an endpoint and retrieve its status and body."
    }

    fn parameters_schema(&self) -> Value {
        serde_json::json!({
            "type": "OBJECT",
            "properties": {
                "url": {
                    "type": "STRING",
                    "description": "The URL to probe (must start with http:// or https://)"
                }
            },
            "required": ["url"]
        })
    }

    async fn execute(&self, args: Value) -> Result<Value> {
        let url = args["url"].as_str().context("Missing url parameter")?;
        
        // Security checks
        if !url.starts_with("http://") && !url.starts_with("https://") {
            anyhow::bail!("URL must start with http or https");
        }
        
        if url.contains("169.254.169.254") || url.contains("metadata.google.internal") {
            anyhow::bail!("Access to cloud metadata service is prohibited for security reasons.");
        }

        let client = reqwest::Client::builder()
            .timeout(std::time::Duration::from_secs(10))
            .build()?;
            
        let response = client.get(url).send().await;
        
        match response {
            Ok(resp) => {
                let status = resp.status().as_u16();
                let body = resp.text().await.unwrap_or_default();
                
                // Truncate body if too long to save tokens
                let truncated_body = if body.len() > 2000 {
                    format!("{}... (truncated)", &body[..2000])
                } else {
                    body
                };
                
                Ok(serde_json::json!({
                    "status_code": status,
                    "body": truncated_body
                }))
            }
            Err(e) => {
                Ok(serde_json::json!({
                    "error": e.to_string()
                }))
            }
        }
    }
}

pub struct ConfigPatcherTool;

#[async_trait]
impl Tool for ConfigPatcherTool {
    fn name(&self) -> &str {
        "config_patcher"
    }

    fn description(&self) -> &str {
        "Generates a file patch / diff intended to modify a configuration file. This tool does NOT write to disk immediately; it outputs a diff for the user to review."
    }

    fn parameters_schema(&self) -> Value {
        serde_json::json!({
            "type": "OBJECT",
            "properties": {
                "file_path": {
                    "type": "STRING",
                    "description": "The absolute path of the configuration file to patch"
                },
                "diff_content": {
                    "type": "STRING",
                    "description": "The new file content or a unified diff string"
                },
                "rationale": {
                    "type": "STRING",
                    "description": "Explanation of why this change is necessary"
                }
            },
            "required": ["file_path", "diff_content", "rationale"]
        })
    }

    async fn execute(&self, args: Value) -> Result<Value> {
        let file_path = args["file_path"].as_str().unwrap_or_default();
        let rationale = args["rationale"].as_str().unwrap_or_default();
        
        // This is a "dry-run" tool on the backend. 
        // It signals success so the LLM knows the patch was generated, 
        // but the actual `FilePatch` SSE event must be intercepted by the orchestrator.
        Ok(serde_json::json!({
            "status": "Patch generated and pending user review on UI.",
            "file": file_path,
            "rationale": rationale
        }))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::ToolRegistry;
    use serde_json::json;

    #[tokio::test]
    async fn test_system_ping_tool_success() {
        let tool = SystemPingTool;
        let args = json!({"host": "127.0.0.1", "count": 1});
        
        let result = tool.execute(args).await;
        assert!(result.is_ok());
        let res_json = result.unwrap();
        assert!(res_json["success"].as_bool().unwrap_or(false));
    }

    #[tokio::test]
    async fn test_system_ping_tool_malicious() {
        let tool = SystemPingTool;
        // Attempting command injection
        let args = json!({"host": "127.0.0.1; echo 'hacked'"});
        
        let result = tool.execute(args).await;
        assert!(result.is_err());
        let err_msg = result.unwrap_err().to_string();
        assert!(err_msg.contains("Invalid characters"));
    }

    #[tokio::test]
    async fn test_config_patcher_tool() {
        let tool = ConfigPatcherTool;
        let args = json!({
            "file_path": "/etc/nginx/nginx.conf",
            "diff_content": "+ server_name test.com;",
            "rationale": "Fixing domain"
        });
        
        let result = tool.execute(args).await.unwrap();
        assert_eq!(result["file"].as_str().unwrap(), "/etc/nginx/nginx.conf");
        assert!(result["status"].as_str().unwrap().contains("pending user review"));
    }

    #[test]
    fn test_registry_declarations() {
        let mut registry = ToolRegistry::new();
        registry.register(SystemPingTool);
        registry.register(ConfigPatcherTool);
        
        let decls = registry.get_declarations();
        assert_eq!(decls.len(), 2);
        
        let ping_decl = decls.iter().find(|d| d["name"] == "system_ping").unwrap();
        assert_eq!(ping_decl["name"], "system_ping");
        assert!(ping_decl["parameters"]["required"].as_array().unwrap().contains(&json!("host")));
    }
}
