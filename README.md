# Vanguard (先锋) 知识管理与案例静态产物系统

## 1. 项目定位与新方针

本项目已全面重构并转向**纯本地文档管理驱动模式**，废除所有远端 Server、容器服务与复杂后端架构：

- **无 Server 架构**：不部署任何远端或本地服务端进程，不依赖后端数据库。
- **主从双层仓库体系 (Two-Tier Repos)**：
  - **主平台仓库 (`Vanguard`) - [Private]**：仅保存平台通用的架构设计规范、标准模板库、原生自动化脚本与通用指引文档。具体案件内容不进入主库（由 `.gitignore` 阻断）。
  - **案件独立公开仓 (`Vanguard-<CaseName>`) - [Public]**：为各个具体业务案件建立同名独立公开仓库，完整保存案例文档、原始调研与展示样板网页。
- **设计展示样板网页与 GitHub Actions 自动部署**：
  - 设计阶段除产出设计文档外，必须同步构建高质感纯静态展示样板网页（`site/`）。
  - 案件独立公开仓内置 GitHub Actions 工作流，代码推送后自动部署至 **GitHub Pages** 并通过 `CNAME` 挂载独立域名。
- **轻量原生规范**：严格遵循纯本地环境规范，不依赖 Node.js/Python 运行时，自动化脚本仅基于 Windows 原生 PowerShell / CMD。

---

## 2. 规划目录结构

```text
Vanguard/
├── .agents/                    # Agent 行为规则与开发方针规范
│   └── rules/
│       └── AGENTS.md
├── .github/                    # GitHub Actions 自动化工作流
│   └── workflows/
│       └── deploy-portal.yml   # 平台官方网站自动部署至 GitHub Pages
├── site/                       # Vanguard 平台官方公开静态网站 (发布至 GitHub Pages)
│   ├── index.html              # 平台官网主页（开发理念、服务体系、作者档案）
│   ├── cases.html              # 独立业务案件清单索引
│   ├── CNAME                   # 自定义域名配置
│   ├── favicon*                # 网站品牌图标体系
│   └── assets/images/          # 高精视觉与概念架构图片资产
├── docs/                       # 核心通用文档与知识库
│   ├── templates/              # 案例分析与文档模板
│   └── guides/                 # 操作指南与规范说明
├── cases/                      # 业务案例库 (受 .gitignore 保护，不入主库)
│   └── example-case/           # 具体案例目录示例
│       ├── docs/               # 案例文档与原始调研分析 (Markdown)
│       └── site/               # 针对该案例生成的纯静态展示样板 (HTML/CSS/JS)
└── README.md                   # 项目总览说明
```

---

## 3. 工作流概述

1. **案例建立**：在 `cases/` 下建立独立案例文件夹，撰写结构化 Markdown 文档与调研记录。
2. **分析沉淀**：整合案例数据与深度研究内容，完成本地知识归档。
3. **静态产物生成**：根据案例内容，生成高颜值、专业排版的纯静态交互网页（保存在各案例的 `site/` 目录下），供本地浏览或静态托管展示。
