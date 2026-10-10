# Vanguard 平台化设计与核心规范体系

欢迎查阅 **Vanguard 平台化设计知识库**。本项目致力于通过**纯本地文档管理与高质感纯静态案例产物**，打造极简、零依赖、本地优先的知识资产与成果交付体系。

---

## 1. 文档架构大纲

```text
docs/
├── README.md                               # 本导航索引文档
├── platform/                               # 平台化总体架构与核心规范
│   ├── 01_platform_overview.md             # 平台演进、核心哲学与四层架构模型
│   ├── 02_case_lifecycle_spec.md           # 案例数据模型、元数据与生命周期流转规范
│   ├── 03_static_generation_spec.md        # 静态网站产物设计系统、UI/UX 与交付规范
│   └── 04_automation_powershell_spec.md    # Windows 原生 PowerShell 自动化与工具设计
├── templates/                              # 标准化模版库
│   ├── case_metadata_schema.json           # 案例元数据 JSON Schema 校验文件
│   ├── case_template.md                    # 案例 Markdown 标准文档模板
│   └── static_site_template.html           # 案例纯静态展示网站开箱即用模板
└── guides/                                 # 实操指引手册
    ├── case_authoring_guide.md             # 案例文档编写与沉淀实操指南
    ├── static_site_delivery_guide.md       # 静态产物生成与交付质检手册
    └── architect_portrait_design_guide.md  # 创始人/架构师个人肖像制作与视觉规范指南
```

---

## 2. 核心文档快速链接

### 🏛️ 平台化顶层设计
- [01. 平台架构与方针总览](file:///g:/我的云端硬盘/workspace/Vanguard/docs/platform/01_platform_overview.md)：了解平台如何从 Server 架构转向纯本地文档化，以及四层架构划分。
- [02. 案例模型与生命周期规范](file:///g:/我的云端硬盘/workspace/Vanguard/docs/platform/02_case_lifecycle_spec.md)：了解案例目录格式、`metadata.json` 规范与状态机定义。
- [03. 静态产物设计系统规范](file:///g:/我的云端硬盘/workspace/Vanguard/docs/platform/03_static_generation_spec.md)：了解高水准纯静态网站的视觉规范、Design Tokens 与交付标准。
- [04. 原生自动化与脚本规范](file:///g:/我的云端硬盘/workspace/Vanguard/docs/platform/04_automation_powershell_spec.md)：了解在 Windows 下利用原生 PowerShell 实现零依赖自动化。

### 📋 模版与标准样例
- [案例 Markdown 结构模板](file:///g:/我的云端硬盘/workspace/Vanguard/docs/templates/case_template.md)
- [案例元数据 Schema 校验规范](file:///g:/我的云端硬盘/workspace/Vanguard/docs/templates/case_metadata_schema.json)
- [纯静态案例交互网站原型模版](file:///g:/我的云端硬盘/workspace/Vanguard/docs/templates/static_site_template.html)

### 🚀 实操操作指引
- [案例文档编写与沉淀指南](file:///g:/我的云端硬盘/workspace/Vanguard/docs/guides/case_authoring_guide.md)
- [静态产物生成与交付指南](file:///g:/我的云端硬盘/workspace/Vanguard/docs/guides/static_site_delivery_guide.md)
- [架构师个人肖像制作指南](file:///g:/我的云端硬盘/workspace/Vanguard/docs/guides/architect_portrait_design_guide.md)：门户第 5 幕个人肖像的 AI 重绘、实拍布光与工程替换规范。

---

## 3. 核心设计原则一览

| 原则 | 核心内涵 |
| :--- | :--- |
| **无 Server 依赖** | 不启动、不维护任何后端或容器服务，彻底消除运维成本。 |
| **本地优先 (Local-First)** | 一切知识沉淀与资产保留在本地文件系统中，由 Git 负责可靠版本回溯。 |
| **纯静态即开即用** | 案例交付产物直接采用自包含 Vanilla HTML/CSS/JS，本地浏览器双击即可无缝浏览。 |
| **Windows 原生工具** | 遵循轻量约束，仅使用 Windows 原生 PowerShell / CMD 进行自动化运维。 |
