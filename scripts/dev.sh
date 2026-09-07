#!/usr/bin/env bash
set -eo pipefail

echo "================================================================="
echo "  🛡️  Vanguard FBE Platform 本地调试启动脚本"
echo "================================================================="

# 加载 .env 环境变量（如果存在）
if [ -f ".env" ]; then
    echo "==> 加载 .env 环境变量..."
    export $(grep -v '^#' .env | xargs)
elif [ -f ".env.example" ]; then
    echo "==> 未找到 .env，使用 .env.example 默认变量..."
    export $(grep -v '^#' .env.example | xargs)
fi

export PORT="${PORT:-8080}"
export RUST_LOG="${RUST_LOG:-info,vanguard=debug}"
export VANGUARD_AUTH_MOCK="true"

echo "==> 服务端口: $PORT"
echo "==> 鉴权模式: Dev-Mock (跳过 Google IAP / Firebase JWT)"

# 检查前端 dist 是否已生成，未生成则先构建前端
if [ ! -d "vanguard-web/dist" ]; then
    echo "==> 首次运行，正在构建 Web 前端控制台..."
    (cd vanguard-web && npm run build)
fi

echo "==> 启动 Vanguard Axum 后端服务..."
export PATH="$HOME/.cargo/bin:$PATH"
cargo run -p vanguard-api
