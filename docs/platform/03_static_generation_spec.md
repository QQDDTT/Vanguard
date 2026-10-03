# 案例静态网站产物设计与交付规范

## 1. 核心设计原则

静态网站产物是具体案例面向受众和决策者的最终呈现形式。必须遵循以下铁律：

1. **绝对纯静态 (Zero-Build Vanilla Web)**：
   - 严禁引入 Webpack、Vite、Node.js 编译链路。
   - 所有网页产物均为标准的 **HTML5 + Vanilla CSS + 原生 JavaScript**。
   - 用户在 Windows Explorer 或任意文件管理器中双击 `index.html` 即可在本地浏览器无缝渲染，无跨域限制、无空白报错。
2. **离线自包含 (Offline Resilient)**：
   - 优先采用系统原生优质字体栈（如 `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif`），或内联 Web 字体方案。
   - 图标与图表优先使用**原生内嵌 SVG** 或 **Canvas/CSS 绘制**，避免死锁于外部 CDN 网络可用性。
3. **极具质感的现代视觉审美 (High-End Aesthetics)**：
   - 杜绝廉价感与平庸的 MVP 简陋风格。
   - 采用高端暗色模式（Dark Modern）或精致浅色模式，搭配柔和渐变、毛玻璃效果（Glassmorphism）与优雅微交互（Hover & Transition）。

---

## 2. 视觉设计系统规范 (Design Tokens)

静态产物必须基于一套严谨、协调的 CSS Design Tokens 进行构建：

```css
:root {
  /* 基础色板 - 现代深色高质感 */
  --bg-primary: #0a0e17;        /* 画布主背景 */
  --bg-surface: #111827;        /* 容器/卡片表面色 */
  --bg-surface-elevated: #1f2937; /* 悬浮/激活卡片色 */
  --border-subtle: rgba(255, 255, 255, 0.08); /* 柔和边框 */
  --border-active: rgba(99, 102, 241, 0.4);   /* 聚焦边框 */

  /* 品牌与强调色 */
  --accent-primary: #6366f1;    /* 品牌主色 (Indigo) */
  --accent-gradient: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
  --accent-glow: rgba(99, 102, 241, 0.25);

  /* 状态色 */
  --status-success: #10b981;
  --status-warning: #f59e0b;
  --status-danger: #ef4444;
  --status-info: #06b6d4;

  /* 文字排版 */
  --text-main: #f9fafb;
  --text-secondary: #9ca3af;
  --text-muted: #6b7280;

  /* 圆角与阴影 */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 18px;
  --shadow-card: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
  --shadow-glow: 0 0 20px var(--accent-glow);
}
```

---

## 3. 标准布局模版规范

静态网站入口页面 (`site/index.html`) 推荐包含以下 5 个核心功能模块：

```text
┌──────────────────────────────────────────────────────────────┐
│  1. 顶部导航与状态栏 (Header & Breadcrumbs & Status Tag)      │
├──────────────────────────────────────────────────────────────┤
│  2. 案例看板 Hero 区域 (Case Title, KPI Metrics, Core Summary)│
├──────────────────────────────────────────────────────────────┤
│  3. 核心发现与数据图表 (Interactive Findings & SVG Charts)     │
├──────────────────────────────────────────────────────────────┤
│  4. 深度对比与分析拆解 (Structured Comparisons & Details)     │
├──────────────────────────────────────────────────────────────┤
│  5. 落地建议与决策结论 (Actionable Takeaways & Next Steps)     │
└──────────────────────────────────────────────────────────────┘
```

### 3.1 核心组件设计要求
- **KPI 数字看板**：使用大号粗体数值（如 `32.5%`, `¥1.2M`）配合环比/趋势标签，带来清晰的第一眼数据冲击力。
- **轻量原生图表**：使用原生 SVG 或纯 HTML/CSS 柱状图、进度条、折线路径，实现零外部 JS 库加载，秒开秒显。
- **标签切换与折叠面板 (Tabs & Accordion)**：使用纯 HTML `<details>`/`<summary>` 或原生 JS 简单切换逻辑，实现多维度内容交互。
- **自适应移动端与宽屏**：采用 CSS Flexbox 和 CSS Grid 实现流动布局，在 320px 到 2560px 宽度下均具备出色的阅读体验。

---

## 4. GitHub Pages 托管与自定义域名挂载规范

为满足设计阶段在线公开展示、跨地域评审与域名品牌化访问需求，所有静态样板网页产物均遵循 GitHub Pages 托管标准：

### 4.1 目录组织与 CNAME 配置
每个案例的静态样板发布目录中，必须包含域名配置文件 `CNAME`：

```text
site/
├── CNAME                   # 记录自定义域名（例如：sentis.example.com，纯文本单行）
├── index.html              # 样板网站入口主页
├── css/                    # 视觉样式文件
└── js/                     # 原生交互脚本
```

### 4.2 资源引用与路径铁律 (Relative Path Only)
- **严禁使用绝对根路径**：如 `<link href="/css/main.css">`。在 GitHub Pages（尤其是 `username.github.io/repo/` 子路径模式）下会导致 404 资源丢失。
- **强制使用相对路径**：统一使用 `./css/main.css` 或相对同级目录引用，确保无论是：
  1. 本地双击离线打开（`file:///.../site/index.html`）；
  2. GitHub 默认二级域名（`https://username.github.io/repo/`）；
  3. 挂载自定义域名（`https://sentis.example.com/`）；
  三者均能 100% 正常渲染与加载。

### 4.3 自定义域名 DNS 解析规范
在域名服务商处配置以下记录即可完成域名挂载：
- **子域名（如 `realty.yourdomain.com`）**：添加 `CNAME` 记录指向 `username.github.io.`
- **Apex 主域名（如 `yourdomain.com`）**：添加 `A` 记录指向 GitHub Pages IP 地址群，并配合 `www` CNAME 记录。
- **强制启用 HTTPS**：在 GitHub 仓库 Settings -> Pages 中勾选“Enforce HTTPS”，确保 SSL 自动颁发。

---

## 5. 产物交付与质检标准清单 (QA Checklist)

在宣布某个案例静态网站产物交付前，必须核对以下项目：

- [ ] **直接双击可开**：脱离任何本地 HTTP 服务器（使用 `file:///` 协议打开），图片、样式表与脚本均能正常加载，无 404 或 CORS 报错。
- [ ] **GitHub Pages 线上部署就绪**：目录中已配置合规的 `CNAME` 文件，推送到部署分支后可即时生效。
- [ ] **自定义域名解析无异常**：线上通过挂载的域名正常访问，全站资源均通过 HTTPS 加载且无证书告警。
- [ ] **全中文化呈现**：页面所有标题、指标说明、图表图例均为规范中文。
- [ ] **响应式验证**：窄屏（手机端视图）无水平溢出滚动条，卡片自然换行。
- [ ] **交互流畅度**：按钮悬停状态有柔和缓动动画（Transition: 0.2s~0.3s ease），无卡顿与突兀跳跃。
- [ ] **内容准确性**：静态页展示的关键指标与 `docs/` 下的 Markdown 分析结论完全对齐。

---

## 6. 展示门户与目标产品素材的登录/主页概念递归规范 (Concept Recursion & Prototype Segregation)

在高级系统设计与原型推演中，常常出现“网站主页”、“登录界面”等概念的同名递归现象。为防止架构混淆与原型可用性受损，平台实行严格的分层消歧机制：

### 6.1 两层概念模型对比 (Showcase Portal vs Target Prototype)

| 维度 / 概念 | L1 平台成果物展示门户 (Showcase Portal) | L2 目标业务系统产品素材 (Target Product Prototype) |
| :--- | :--- | :--- |
| **层级定位** | 面向评审人与决策者的**全案汇报总览平台** | 作为交付物（如 DEL-01）所模拟的**目标业务软件原型** |
| **主页定位** | **门户主页 (`site/index.html`)**：统揽全案成果、交付物卡片、规格书下载 | **产品主页 (`site/<app>-home.html`)**：目标业务系统的控制台/VR工作台枢纽 |
| **登录/门禁** | **门户访问门禁 (Gateway Modal)**：保护商业机密与全案资料的全局授权保护 | **产品登录界面 (`site/<app>-login.html`)**：展示目标软件登录体验的外观交互素材 |
| **内部页面阻断** | 验证通过后方可浏览全站资料（若开启） | **绝对禁止阻断**！作为素材展示，不得对内部功能页进行任何登录拦截 |
| **用户认知** | 访客清楚这是“Vanguard 交付给客户的方案汇报页” | 访客清楚这是“客户公司未来的内部工作系统长什么样” |

### 6.2 核心开发与交付铁律

1. **原型免拦截铁律 (No-Blocking Rule)**：
   - 目标业务软件的登录页面（如 `crm-login.html`）属于产品设计素材范畴，其交互核心在于**向客户展示“该系统如何进行身份鉴权、门禁动效与品牌调性”**。
   - **严禁在目标系统的内部页面（如 `crm-home.html`、`prototype-crm.html`）中植入未登录强行踢回登录页的前端拦截代码**。评审人员与客户必须随时支持通过 URL 直链访问任意内部原型进行推演与评审。
2. **命名与入口解耦原则**：
   - `site/index.html` 必须始终作为【展示门户主页】，严禁被篡改为单款目标产品的原型主页。
   - 目标产品原型通过 DEL-01 成果物卡片等形式在门户中清晰列出（如提供“进入系统登录门”、“直达VR主页”、“直达业务台账”等独立入口）。
3. **按钮纯净度原则**：
   - 全平台页面无论处于 L1 门户层还是 L2 原型层，所有按钮必须遵循“有文字无符号，有符号无文字”的设计铁律。
