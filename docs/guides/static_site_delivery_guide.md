# 静态产物生成与交付实操指南 (Delivery Guide)

## 1. 产物交付核心理念

静态网站是 Vanguard 平台向受众交付的核心物料。交付的关键目标是：**“零门槛、无缝打开、视觉惊艳、自包含持久”**。

受众无需具备任何编程背景，无需安装 Node.js、Python 或任何本地服务器，直接通过双击 `cases/{case_id}/site/index.html` 即可完整浏览并交互。

---

## 2. 静态产物组织架构

每个案例的 `site/` 目录组织推荐如下：

```text
cases/{case_id}/site/
├── index.html              # 主页面（包含完整的语义结构与首屏直出逻辑）
├── css/
│   └── main.css            # 核心样式（若样式精炼亦可直接内嵌于 index.html）
├── js/
│   └── app.js              # 原生轻量交互脚本（过滤、弹窗、Tabs 切换等）
└── assets/                 # 图片、矢量 SVG 图标及静态 JSON 数据
```

---

## 3. 生成与组装工作流

```text
[Step 1: 提取 Markdown 核心内容]
               ▼
[Step 2: 基于标准模板 static_site_template.html 组装]
               ▼
[Step 3: 填充 KPI、对比表与原生 SVG 图表]
               ▼
[Step 4: 本地浏览器双击自测 (file:/// 协议兼容)]
               ▼
[Step 5: 更新 metadata.json 状态为 "generated"]
```

### 3.1 关键组装步骤说明

1. **提取核心看板数据**：
   - 从案例文档的结论与规划章节中，提取 3~4 个关键量化指标填入 `.kpi-grid`。
2. **绘制或内嵌原生 SVG 图表**：
   - 避免引入体积巨大且依赖外部 CDN 的 Chart 库。
   - 使用标准 SVG 容器（如 `<svg viewBox="0 0 400 160">`），利用 `<rect>`、`<path>`、`<line>` 绘制极速渲染的柱状对比图或折线趋势图。
3. **验证跨环境兼容性**：
   - 确保所有静态文件引用均使用**相对路径**（例如 `./css/main.css` 或直接内联），严禁使用绝对根路径（如 `/css/main.css`），否则在 `file:///` 协议下会导致资源加载失败。

---

## 4. GitHub Pages 部署与自定义域名挂载实操

### 4.1 创建 CNAME 配置文件
在案例的 `site/` 根目录下创建 `CNAME` 文件，写入绑定的自定义域名：
```bash
# 例如在 cases/{case_id}/site/CNAME 中写入
sentis.example.com
```

### 4.2 部署到 GitHub Pages 分支 (推荐 gh-pages)
通过 Git 纯命令行操作，将案例静态产物发布至指定托管分支（无需安装外部部署工具）：
```powershell
# 1. 确保当前工作区已提交
# 2. 将特定案例的 site 目录推送到远端 gh-pages 分支
git subtree push --prefix cases/sentis-crm-system/site origin gh-pages
```

### 4.3 DNS 域名解析配置
前往域名管理后台（如 Cloudflare, 阿里云, GoDaddy 等）添加记录：
- **记录类型**：`CNAME`
- **主机记录**：`sentis`（或自定义二级前缀）
- **记录值**：`{your-github-username}.github.io.`
- **代理状态 / TTL**：自动或默认

### 4.4 校验上线效果
1. 访问 `https://{your-github-username}.github.io/{repo}/` 验证基础页面；
2. 访问 `https://sentis.example.com/` 验证独立域名与 SSL 自动证书颁发。

---

## 5. 交付质检标准 (Acceptance Criteria)

在向用户或利益相关方交付案例产物前，必须执行以下 5 项核查：

1. **协议无关性 (双模可用)**：本地按下 `Ctrl + O`（`file:///` 协议）与线上通过 GitHub Pages / 绑定域名访问，样式排版与交互逻辑完全一致。
2. **CNAME 与独立域名正常生效**：线上域名访问无证书安全告警，全站资源均通过 HTTPS 加载。
3. **无外链失效风险**：页面所有静态资源（CSS、JS、矢量图）均为本地相对路径或内联，不依赖不稳定外部 CDN。
4. **移动端深度适配与零横向溢出**：使用移动设备或开发者工具视口模式切换（320px~430px），页面严格单向纵向滚动、绝对无水平滚动条；移动端操作按钮自动符号化压缩（隐藏多余文字标签），标题文字保持完整语义不折行。
5. **元数据状态同步**：案例根目录下的 `metadata.json` 中的 `status` 字段已同步更新。
