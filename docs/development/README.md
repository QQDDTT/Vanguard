# 🚀 Vanguard — 开发文档中心

本目录记录 Vanguard 三大端的开发方式与实时进度。

## 文档列表

| 文档 | 说明 |
|------|------|
| [01. 开发环境与工作流指南](01_dev_guide.md) | 本地开发启动、分支策略、代码规范、调试方式 |
| [02. 开发进度追踪](02_progress.md) | 三大端各模块功能完成状态（持续更新） |
| [03. Firebase SQL Connect 架构迁移计划](03_dataconnect_migration_plan.md) | 数据库与 API 架构从手工 REST 升级为强类型 GraphQL 的详细方案 |
| [04. 业务模块实现指南](04_business_modules_implementation.md) | 各类业务逻辑、插件架构及模块化实现规范 |

---

## 三大端开发责任矩阵

| 组件 | 语言/框架 | 入口目录 | 开发阶段 |
|------|----------|---------|---------|
| Rust Agentic 后端 | Rust / Axum | `crates/` | 🟡 骨架建立中 |
| React Web UI | TypeScript / React + Vite | `web/` | 🔴 待启动 |
| Android 移动端 | Kotlin / Jetpack Compose | `android/` | 🔴 待启动 |
