---
trigger: always_on
description: "Vanguard 项目核心设计规范与开发方针"
---

# Vanguard 项目规范与开发方针

## 1. 核心架构方针 (Core Architecture Guidelines)
- **纯本地文档驱动**: 本项目不再部署任何后端 Server 服务（不采用 Cloud Run、容器化 API 或远端数据库服务），以本地文档管理与知识沉淀为核心。
- **案例产物静态化**: 针对具体业务或研究案例，其可视化报告与交付产物以**纯静态网站 (Vanilla HTML / CSS / JavaScript)** 形式生成，支持直接在本地浏览器中双击或离线预览，无需安装复杂运行环境。

## 2. 环境与工具约束 (Environment & Tooling Constraints)
- **本地环境规范**:
  - 宿主机严格禁止安装和使用 Python、Node.js、Go、Rust、Java 等编程语言运行时及对应包管理器（npm、pip、cargo 等）。
  - 本地自动化与文件处理脚本仅允许使用 Windows 原生内置的 **PowerShell** 或 **批处理 (BAT / CMD)**。
- **纯静态原则**:
  - 静态网站产物不依赖本地动态构建打包工具（如 vite、webpack），直接产出结构清晰、语义化且样式精美的 HTML/CSS/JS 静态文件。

## 3. 设计与内容规范
- **全中文化**: 所有面向用户的文档、分析报告、静态页面文案及代码注释均遵守全中文规范。
- **高水准视觉审美**: 生成的静态案例网站应保持现代、专业且精致的视觉设计，具备良好的排版、色彩搭配与响应式布局。
