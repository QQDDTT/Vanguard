use anyhow::Result;
use async_trait::async_trait;
use serde_json::Value;
use std::collections::HashMap;

pub mod tools;

/// Interface for all executable tools
#[async_trait]
pub trait Tool: Send + Sync {
    /// The unique name of the tool, matches the Gemini function name
    fn name(&self) -> &str;
    
    /// Description of what the tool does, provided to the LLM
    fn description(&self) -> &str;
    
    /// JSON Schema defining the parameters the tool expects
    fn parameters_schema(&self) -> Value;
    
    /// Execute the tool with the given arguments from the LLM
    async fn execute(&self, args: Value) -> Result<Value>;
}

/// Registry to hold and execute tools
pub struct ToolRegistry {
    tools: HashMap<String, Box<dyn Tool>>,
}

impl ToolRegistry {
    pub fn new() -> Self {
        Self {
            tools: HashMap::new(),
        }
    }

    /// Register a tool
    pub fn register(&mut self, tool: impl Tool + 'static) {
        self.tools.insert(tool.name().to_string(), Box::new(tool));
    }

    /// Get all tool declarations in Gemini's expected format
    pub fn get_declarations(&self) -> Vec<Value> {
        self.tools
            .values()
            .map(|t| {
                serde_json::json!({
                    "name": t.name(),
                    "description": t.description(),
                    "parameters": t.parameters_schema()
                })
            })
            .collect()
    }

    /// Execute a tool by name
    pub async fn execute(&self, name: &str, args: Value) -> Result<Value> {
        if let Some(tool) = self.tools.get(name) {
            tool.execute(args).await
        } else {
            anyhow::bail!("Tool '{}' not found in registry", name)
        }
    }
}
