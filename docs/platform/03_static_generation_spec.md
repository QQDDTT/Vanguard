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

## 4. 产物交付与质检标准清单 (QA Checklist)

在宣布某个案例静态网站产物交付前，必须核对以下项目：

- [ ] **直接双击可开**：脱离任何本地 HTTP 服务器（使用 `file:///` 协议打开），图片、样式表与脚本均能正常加载，无 404 或 CORS 报错。
- [ ] **全中文化呈现**：页面所有标题、指标说明、图表图例均为规范中文。
- [ ] **响应式验证**：窄屏（手机端视图）无水平溢出滚动条，卡片自然换行。
- [ ] **交互流畅度**：按钮悬停状态有柔和缓动动画（Transition: 0.2s~0.3s ease），无卡顿与突兀跳跃。
- [ ] **内容准确性**：静态页展示的关键指标与 `docs/` 下的 Markdown 分析结论完全对齐。
