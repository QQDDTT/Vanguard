#!/usr/bin/env bash
set -eo pipefail

echo "==> 启动 Vanguard 本地调试代理 (Axum)..."
cargo run -p vanguard-api
