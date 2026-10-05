# Vanguard 平台商业案件安全合规与隐私隔离规范 (SPEC-05)

## 1. 核心宗旨与适用范围
在 Vanguard 平台生态中，由于主平台（`Vanguard`）以完全开源开放的方式展示开发理念、工具链与技术标准，而平台承接的商业案件（如 `Vanguard-Sentis` 等）深度涉及客户的真实商业机理、财务指标与法律合规要件。为了**在公开展示工业级交付成果的同时，绝对杜绝客户商业秘密与敏感隐私信息外泄**，特制定本规约。

---

## 2. 主从双层仓库物理隔离铁律 (Repository Segregation)

1. **主平台仓库 (`Vanguard` - Public)**：
   - 仅保存通用平台架构、设计系统规范 Tokens、Windows 原生自动化脚本工具与公开展示门户（`site/`）。
   - 本地 `cases/` 目录通过 `.gitignore` 严密阻断（`cases/*`, `!cases/.gitkeep`），任何案件的具体商业资料、源码与客户原件严禁提交至主平台版本库。
2. **案件独立仓库 (`Vanguard-<CaseName>` - Public / Semi-Public)**：
   - 每个案件设立独立仓库，专门持久化该案件经过脱敏的交付文档（`docs/`）与静态展示网站（`site/`）。
   - 独立配置 GitHub Actions 与专属二级独立域名（如 `sentis.evotensor.dev`），实现与主平台完全解耦的独立审查与版本迭代。

---

## 3. 全生命周期数据脱敏与隐私保护准则 (Data Masking Standards)

所有面向客户评审或公开展示的案件内容，必须在上屏前完成三重脱敏审查：
1. **实体与法人信息脱敏**：
   - 真实个人身份（客户姓名、个人手机、私人住址、私人银行卡号）一律替换为符合业务语境的仿真虚构标识（如“山田 太郎 / 090-0000-0000 / 東京中央”）。
   - 若客户要求全流程保密，企业名统一采用项目代号或虚拟法人名称替代。
2. **商业财务与未公开合同条款脱敏**：
   - 真实买卖合同金额、商业借贷利率与利润分成底牌等敏感财务参数，展示时统一替换为典型行业基准模拟数值。
   - 原始合同扫描件与涉密 Word/PDF 资料（保存在本地 `raw/` 目录）**严禁复制到 `site/` 静态分发目录**。
3. **API 密钥与凭证零暴露**：
   - 网页代码中严禁硬编码任何第三方私密 API Token、数据库连接串或私钥（`.pem`, `.key`, `.token`）。
   - 任何涉及 Cloudflare、GitHub 等操作的自动化脚本，统一采用本地环境变量或未受版本控制的 `.env.*` 文件在本地注入。

---

## 4. 案件展示网站防泄露与门禁策略 (Access Protection Strategy)

针对公开展出的案件展示网站（L1 Portal 与 L2 原型），必须部署多层安全防护策略：

### 4.1 域名白名单与非授权访问阻断 (Domain Guard)
所有案件静态页面首部必须内嵌轻量级 Host 守卫脚本。当访客通过 GitHub 默认公开链接（如 `*.github.io`）或非授权镜像直接访问时，自动强制重定向回客户专属独立域名，确保外部索引与合规防盗链：
```javascript
(function() {
  var currentHost = window.location.hostname;
  if (window.location.protocol === 'file:' || !currentHost) return;
  var authorizedHosts = ['sentis.evotensor.dev', 'vanguard-sentis.evotensor.dev', 'localhost', '127.0.0.1'];
  if (!authorizedHosts.includes(currentHost)) {
    window.location.replace('https://sentis.evotensor.dev' + window.location.pathname + window.location.search);
  }
})();
```

### 4.2 商业机密门禁遮罩 (Confidentiality Gateway Auth)
1. **前置安全遮罩**：在案件主页（`site/index.html`）与全套设计规格书阅读页（`site/document.html`）部署 Gateway Access Password 前端遮罩。
2. **合规提示与仪式感**：明确展示宅地建物取引法合规声明与商业保密协议编号，要求输入授权访问口令。
3. **安全哈希存储**：口令校验采用浏览器原生 `crypto.subtle` 计算 SHA-256 散列对比，凭证写入 `sessionStorage` 与 `SameSite=Lax` Cookie，会话期内免重复输入。
4. **实演便捷通行**：为了保障授权评审专家与客户高层的顺畅体验，可以在受控演示环境下提供明晰的演示密钥指引（例如“実演用暗証番号: SentisPass”），杜绝因口令遗忘阻断商务进程。

---

## 5. 目标业务软件原型 (L2 Target Product) 仿真铁律

1. **纯静态零后端 (Zero Server Backend)**：
   - 目标业务软件原型（如 CRM 办公室大门门禁 `crm-login.html`、工作台 `crm-home.html`）纯属**视觉与交互设计素材**。
   - 没有任何常驻后端进程、Node.js 服务或真实 SQL 数据库连接，从根本上根除 SQL 注入、远程代码执行（RCE）和服务器被入侵导致的数据泄露风险。
2. **真实登录交互认证体验**：
   - 登录页面必须具备严谨真实的认证校验反馈：访客输入错误密码时，界面必须实时显示错误告警并阻止进入；输入合法演示密码（如 `SentisPass`）或触碰 IC 社员证时，触发成功鉴权并平滑转场开门。
3. **免路由强制阻断原则 (No-Blocking Rule)**：
   - 登录页面仅为“设计展示素材”，严禁在前端编写强制阻断内部页面的重定向守卫。
   - 评审人员必须能通过直接 URL 链接评审任意具体业务模块（如 `crm-home.html`、`prototype-crm.html`）。
4. **全屏防溢出与移动端纯符号化**：
   - 手机端视口（<= 640px）下，所有操作按钮统一切换为纯符号/图标化展示，隐藏文本标签，表格支持局部横滑，彻底消灭水平滚动条与破版风险。
