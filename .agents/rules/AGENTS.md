---
trigger: always_on
description: "Vanguard 平台核心设计规范与双层仓库开发方针"
---

# Vanguard 平台核心规范与双层仓库开发方针

## 1. 核心架构与双层仓库方针 (Repository Hierarchy & Guidelines)
- **纯本地文档与无 Server 驱动**: 本项目不部署任何常驻后端 Server 进程与容器服务，以本地文档管理和纯静态前端展示为核心。
- **主从分层仓库模型 (Two-Tier Repository Architecture)**:
  1. **主平台仓库 (`Vanguard`) - [Private]**:
     - **仅保存平台通用内容**: 维护平台顶层架构规范、通用设计系统 Tokens、Windows 原生自动化脚本、标准模板库与通用操作指南。
     - **不保存具体案件业务资产**: 本地 `cases/` 目录用于临时推演与中转，通过 `.gitignore` 严格忽略，杜绝具体案例的商业资料提交至主平台仓库。
  2. **案件独立公开仓库 (`Vanguard-<CaseName>`) - [Public]**:
     - **命名规范**: 必须采用案件同名加平台辅助命名前缀（例如：`Vanguard-Sentis` 或 `Vanguard-Sentis-CRM`），属性为 **Public（公开）**。
     - **保存案件完整资产**: 专门用于持久化管理该具体案件的调研资料、业务 SOP、系统设计文档（`docs/`）以及设计展示样板网页（`site/`）。
- **GitHub Actions 自动化与独立域名挂载**:
  - 案件独立仓库必须配置 **GitHub Actions 自动化工作流**（`.github/workflows/deploy-pages.yml`）。
  - 代码推送后，GitHub Actions 自动将设计好的样板网页（`site/`）发布至 **GitHub Pages** 静态托管。
  - 必须支持通过 `site/CNAME` 配置文件**挂载自定义独立域名**，实现在线即时交互与各方评审。

## 2. 环境与工具约束 (Environment & Tooling Constraints)
- **本地环境规范**:
  - 宿主机严格禁止安装和使用 Python、Node.js、Go、Rust、Java 等编程语言运行时及包管理器（npm、pip、cargo 等）。
  - 本地自动化与文件处理脚本仅允许使用 Windows 原生内置的 **PowerShell** 或 **批处理 (BAT / CMD)**。
- **纯静态原则**:
  - 静态样板网页产物不依赖本地动态构建打包工具（如 vite、webpack），直接产出结构清晰、语义化且样式精美的 HTML/CSS/JS 静态文件。
  - 所有资源引用必须采用相对路径（`./`），确保在本地双击离线浏览（`file:///` 协议）与 GitHub Pages 线上域名访问双模兼容。

## 3. 设计与内容规范
- **全中文化**: 所有面向用户的文档、分析报告、静态页面文案及代码注释均遵守全中文规范。
- **高水准视觉审美**: 生成的静态样板网站应保持现代、专业且精致的视觉设计（Dark Modern 或高品质主题），具备良好的排版、色彩搭配与响应式布局。
