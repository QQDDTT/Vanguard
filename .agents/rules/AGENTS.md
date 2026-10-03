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

## 4. 双层架构下的“登录”与“主页”概念递归消歧规范 (Concept Recursion & Anti-Blocking Rules)
在具体案件的原型开发中，常常涉及**两套“登录”与“主页”概念的递归嵌套**。必须严格区分并遵循以下消歧规范与隔离铁律：

### 4.1 概念层级划分 (Two Distinct Layers)
1. **L1 平台展示门户层 (Showcase Portal Layer)**：
   - **定位**: 面向项目决策者、投资人、合作方展示全案交付成果的**顶层汇报看板**。
   - **门户主页 (Portal Home)**: 必须严格固定为 `site/index.html`。负责统揽展示四大设计规格书（DEL-01~04）、核心指标、业务白皮书及目标产品入口。
   - **门户门禁 (Portal Gateway Auth)**: 若开启，属于平台级的商业机密保密保护层（例如 Gateway Access Code 弹窗），作用于全案资产。

2. **L2 开发产品素材层 (Target Product Prototype / Asset Layer)**：
   - **定位**: 作为交付物（如 DEL-01）所模拟的**目标业务软件系统本身**（例如客户定制的内部 CRM 系统）。
   - **产品登录原型 (Product Prototype Login)**: 如 `site/crm-login.html`（办公室大门 VR 门禁）。**纯属视觉与交互设计素材**，用于向客户直观展示该业务系统未来的登录体验与品牌调性。
   - **产品主页原型 (Product Prototype Home)**: 如 `site/crm-home.html`（执务室 VR 全景控制台）。属于进入该业务系统后的综合工作台。
   - **产品业务功能页 (Product Feature Pages)**: 如 `site/prototype-crm.html`（业务台账）。属于系统内部具体业务模块。

### 4.2 核心运行铁律 (Anti-Blocking Golden Rules)
1. **产品登录原型绝不拦截原则 (No-Blocking Rule)**：
   - 目标系统的登录页面仅作为“视觉交互演示素材”，**严禁在前端设置任何强制阻断内部页面访问的路由拦截守卫**。
   - 评审人员必须能够通过直链随时直接打开、查看和评审任意内部产品页面（如 `crm-home.html`、`prototype-crm.html` 等），杜绝因未登录而强制重定向回登录页的情况。
2. **主页命名与语义隔离 (Namespace Segregation)**：
   - `index.html` 必须永远作为【L1 展示门户主页】，严禁被替换或重定向为某一个具体软件的原型主页。
   - 目标产品的【L2 原型主页】必须使用业务命名前缀（如 `crm-home.html`、`app-home.html`），保持层级分明。
3. **按钮与标识规范遵守**：
   - 各层界面严格遵循全平台按钮“有文字无符号，有符号无文字”的铁律。
   - 代码与注释中严谨标注层级标签（如 `[L1 Portal]` 与 `[L2 Target Product Prototype]`），杜绝认知混淆。
