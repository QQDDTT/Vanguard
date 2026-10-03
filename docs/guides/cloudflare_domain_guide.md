# Vanguard 平台 Cloudflare 自动化域名与 DNS 挂载指南

## 1. 概述与设计思想
根据 Vanguard 平台的**“纯本地无 Server 驱动”**与**“禁止安装外部 Node/Python 运行环境”**规范，我们不使用臃肿的 Node/npm 封装库（如 `wrangler`），而是直接使用 Windows 原生内置的 **PowerShell** 封装对 **Cloudflare REST API v4** 的调用，实现轻量、无依赖、秒级响应的本地 Cloudflare CLI 工具：[`scripts/cf-dns.ps1`](file:///g:/我的云端硬盘/workspace/Vanguard/scripts/cf-dns.ps1)。

本工具用于实现**“一键为案件生成专属二级子域名并挂载至 GitHub Pages 样板站点”**。

---

## 2. 前置准备：获取 Cloudflare API Token
1. 登录 [Cloudflare 控制台](https://dash.cloudflare.com/)；
2. 点击右上角头像 ➔ **我的个人资料 (My Profile)** ➔ **API 令牌 (API Tokens)**；
3. 点击 **创建令牌 (Create Token)**；
4. 选择 **编辑区域 DNS (Edit zone DNS)** 模板：
   - **权限 (Permissions)**: 区域 (Zone) - DNS - 编辑 (Edit)
   - **区域资源 (Zone Resources)**: 包括 (Include) - 特定区域 (Specific zone) - 选择你的主域名（例如 `example.com`）
5. 点击继续并生成令牌，复制保存生成的 API 令牌字符串。

---

## 3. 凭据配置方式（三选一）

### 方式 A：通过配置文件（推荐，最省心）
在主仓库根目录下创建 `.env.cloudflare` 文件（已在 `.gitignore` 中被全局忽略，不会误提交）：
```ini
CF_API_TOKEN=你的Cloudflare_API_Token
CF_ZONE_NAME=你的主域名.com
```

### 方式 B：通过系统环境变量
在 PowerShell 终端执行：
```powershell
$env:CF_API_TOKEN = "你的Cloudflare_API_Token"
$env:CF_ZONE_NAME = "你的主域名.com"
```

### 方式 C：命令行显式传参
直接在执行脚本时附带 `-ApiToken` 与 `-ZoneName` 参数。

---

## 4. 自动化指令与使用场景

### 场景一：列出账号下所有托管的域名
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\cf-dns.ps1 -Action ListZones
```

### 场景二：一键为案件分配子域名并自动绑定（核心工作流）
为 `sentis` 案件在 `yourdomain.com` 下生成 `sentis.yourdomain.com` 并自动写入样板站点的 CNAME 文件：
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\cf-dns.ps1 `
    -Action BindCase `
    -ZoneName "yourdomain.com" `
    -Subdomain "sentis" `
    -CaseDir "cases/sentis-crm-system"
```

**该命令执行完成后会自动完成以下动作**：
1. 自动调用 Cloudflare API 检索主域名 Zone ID；
2. 自动创建 CNAME 解析：`sentis.yourdomain.com` ➔ `qqddtt.github.io`（默认设置 `proxied: false` 灰云解析，保证 GitHub 能够顺利签发 Let's Encrypt 证书）；
3. 自动将 `sentis.yourdomain.com` 写入 [`cases/sentis-crm-system/site/CNAME`](file:///g:/我的云端硬盘/workspace/Vanguard/cases/sentis-crm-system/site/CNAME)。

---

## 5. 推送发布与生效验证
完成上述步骤后，进入案件目录推送更新：
```powershell
cd cases/sentis-crm-system
git add site/CNAME
git commit -m "feat(domain): 挂载独立域名 sentis.yourdomain.com"
git push origin main
```
推送后：
1. GitHub Actions 自动将包含 CNAME 的静态站点部署到 GitHub Pages；
2. GitHub Pages 会自动为该自定义域名申请并配置免费 HTTPS 证书；
3. 通常 1~3 分钟内，即可直接通过 `https://sentis.yourdomain.com` 访问全新的样板网站！

