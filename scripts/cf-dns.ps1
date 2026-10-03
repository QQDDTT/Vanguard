<#
.SYNOPSIS
    Vanguard 平台专属 Cloudflare DNS 管理工具 (Windows 原生 CLI)
.DESCRIPTION
    无需安装 Node.js、Python 等外部环境，利用 Windows PowerShell 原生调用 Cloudflare v4 REST API。
    支持查询域名、添加/更新 CNAME 解析、以及为案件自动绑定二级子域名并写入 site/CNAME。
.PARAMETER Action
    操作类型：ListZones (列出域名), ListRecords (列出解析), AddCname (添加/更新CNAME), BindCase (为案件绑定子域名)
.PARAMETER ApiToken
    Cloudflare API 令牌（需具备 Zone.DNS:Edit 权限）。也可通过环境变量 CF_API_TOKEN 或 .env.cloudflare 配置。
.PARAMETER ZoneName
    主域名（例如 example.com）。也可通过环境变量 CF_ZONE_NAME 配置。
.PARAMETER Subdomain
    子域名前缀（例如 sentis）。
.PARAMETER Target
    解析目标（例如 qqddtt.github.io）。
.PARAMETER CaseDir
    案件目录路径（例如 cases/sentis-crm-system）。
.PARAMETER Proxied
    是否开启 Cloudflare CDN 代理（橙云）。默认不开启（DNS Only，灰云），方便 GitHub Pages 顺利签发 SSL 证书。
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $false)]
    [ValidateSet("ListZones", "ListRecords", "AddCname", "BindCase")]
    [string]$Action = "BindCase",

    [Parameter(Mandatory = $false)]
    [string]$ApiToken,

    [Parameter(Mandatory = $false)]
    [string]$ZoneName,

    [Parameter(Mandatory = $false)]
    [string]$Subdomain = "sentis",

    [Parameter(Mandatory = $false)]
    [string]$Target = "qqddtt.github.io",

    [Parameter(Mandatory = $false)]
    [string]$CaseDir = "cases/sentis-crm-system",

    [switch]$Proxied = $false
)

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# 1. 尝试从本地 .env.cloudflare 读取凭据
$envFile = Join-Path $PSScriptRoot "..\.env.cloudflare"
if (-not (Test-Path $envFile)) {
    $envFile = Join-Path (Get-Location) ".env.cloudflare"
}

if (Test-Path $envFile) {
    Get-Content $envFile -Encoding UTF8 | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith("#") -and $line.Contains("=")) {
            $parts = $line.Split("=", 2)
            $k = $parts[0].Trim()
            $v = $parts[1].Trim()
            if ($k -eq "CF_API_TOKEN" -and -not $ApiToken) { $ApiToken = $v }
            if ($k -eq "CF_ZONE_NAME" -and -not $ZoneName) { $ZoneName = $v }
        }
    }
}

# 从系统环境变量兜底
if (-not $ApiToken -and $env:CF_API_TOKEN) { $ApiToken = $env:CF_API_TOKEN }
if (-not $ZoneName -and $env:CF_ZONE_NAME) { $ZoneName = $env:CF_ZONE_NAME }

if (-not $ApiToken) {
    Write-Host "[ERROR] 未检测到 Cloudflare API 令牌 (ApiToken)！" -ForegroundColor Red
    Write-Host "请通过以下任一方式提供：" -ForegroundColor Yellow
    Write-Host "  1. 传入参数: .\scripts\cf-dns.ps1 -ApiToken 'xxx'"
    Write-Host "  2. 根目录创建 .env.cloudflare 文件并填入 CF_API_TOKEN=xxx"
    Write-Host "  3. 设置环境变量: `$env:CF_API_TOKEN = 'xxx'"
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $ApiToken"
    "Content-Type"  = "application/json"
}

$apiBase = "https://api.cloudflare.com/client/v4"

function Invoke-CfApi {
    param(
        [string]$Uri,
        [string]$Method = "GET",
        $Body = $null
    )
    try {
        $params = @{
            Uri     = $Uri
            Method  = $Method
            Headers = $headers
        }
        if ($Body) {
            $params["Body"] = ($Body | ConvertTo-Json -Compress)
        }
        $resp = Invoke-RestMethod @params
        return $resp
    } catch {
        Write-Host "[API 异常] $_" -ForegroundColor Red
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            Write-Host $reader.ReadToEnd() -ForegroundColor Red
        }
        return $null
    }
}

# 操作一：列出账号下的所有域名 Zone
if ($Action -eq "ListZones") {
    Write-Host "正在查询 Cloudflare 账号下的可用域名 (Zones)..." -ForegroundColor Cyan
    $res = Invoke-CfApi -Uri "$apiBase/zones?per_page=50"
    if ($res -and $res.success) {
        Write-Host "查询成功，共查找到 $($res.result.Count) 个域名：" -ForegroundColor Green
        $res.result | Select-Object name, id, status, paused | Format-Table -AutoSize
    } else {
        Write-Host "[FAIL] 查询域名列表失败，请检查 API Token 权限与有效性。" -ForegroundColor Red
    }
    exit 0
}

if (-not $ZoneName) {
    Write-Host "[ERROR] 未指定主域名 (-ZoneName)！" -ForegroundColor Red
    Write-Host "例如: .\scripts\cf-dns.ps1 -ZoneName 'example.com' -Subdomain 'sentis'" -ForegroundColor Yellow
    exit 1
}

# 获取目标 Zone ID
Write-Host "正在获取域名 [$ZoneName] 的 Zone 信息..." -ForegroundColor Cyan
$zoneRes = Invoke-CfApi -Uri "$apiBase/zones?name=$ZoneName"
if (-not $zoneRes -or -not $zoneRes.success -or $zoneRes.result.Count -eq 0) {
    Write-Host "[ERROR] 未在当前 Cloudflare 账户中找到域名 [$ZoneName]，请确认域名是否已托管且 Token 有权限！" -ForegroundColor Red
    exit 1
}

$zoneId = $zoneRes.result[0].id
Write-Host "成功匹配 Zone ID: $zoneId" -ForegroundColor Green

# 操作二：列出指定域名的 DNS 记录
if ($Action -eq "ListRecords") {
    Write-Host "正在查询 [$ZoneName] 的 DNS 解析记录..." -ForegroundColor Cyan
    $recRes = Invoke-CfApi -Uri "$apiBase/zones/$zoneId/dns_records?per_page=50"
    if ($recRes -and $recRes.success) {
        $recRes.result | Select-Object type, name, content, proxied, ttl | Format-Table -AutoSize
    }
    exit 0
}

# 操作三与四：添加/绑定 CNAME
$fullDomain = "$Subdomain.$ZoneName".ToLower()
Write-Host "目标子域名: $fullDomain" -ForegroundColor Cyan
Write-Host "解析目标:   $Target" -ForegroundColor Cyan
Write-Host "CDN 代理:   $(if ($Proxied) { '开启 (橙云)' } else { '关闭 (灰云 DNS-Only，推荐用于 GitHub Pages SSL 验证)' })" -ForegroundColor Cyan

# 检查记录是否已存在
$searchRes = Invoke-CfApi -Uri "$apiBase/zones/$zoneId/dns_records?type=CNAME&name=$fullDomain"
$existing = $null
if ($searchRes -and $searchRes.success -and $searchRes.result.Count -gt 0) {
    $existing = $searchRes.result[0]
}

$cnamePayload = @{
    type    = "CNAME"
    name    = $Subdomain
    content = $Target
    ttl     = 1
    proxied = [bool]$Proxied
}

if ($existing) {
    Write-Host "检测到已存在解析记录 (ID: $($existing.id))，正在更新..." -ForegroundColor Yellow
    $updRes = Invoke-CfApi -Uri "$apiBase/zones/$zoneId/dns_records/$($existing.id)" -Method "PUT" -Body $cnamePayload
    if ($updRes -and $updRes.success) {
        Write-Host "CNAME 记录更新成功！[$fullDomain -> $Target]" -ForegroundColor Green
    } else {
        Write-Host "CNAME 记录更新失败！" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "正在创建新的 CNAME 解析记录..." -ForegroundColor Cyan
    $addRes = Invoke-CfApi -Uri "$apiBase/zones/$zoneId/dns_records" -Method "POST" -Body $cnamePayload
    if ($addRes -and $addRes.success) {
        Write-Host "CNAME 记录创建成功！[$fullDomain -> $Target]" -ForegroundColor Green
    } else {
        Write-Host "CNAME 记录创建失败！" -ForegroundColor Red
        exit 1
    }
}

# 若为 BindCase 操作，自动同步更新案件目录下的 site/CNAME
if ($Action -eq "BindCase" -and $CaseDir) {
    $cnameFile = Join-Path $CaseDir "site\CNAME"
    if (Test-Path (Split-Path $cnameFile -Parent)) {
        Set-Content -Path $cnameFile -Value $fullDomain -Encoding UTF8 -NoNewline
        Write-Host "已自动将域名写入案件配置: $cnameFile [$fullDomain]" -ForegroundColor Green
        Write-Host ""
        Write-Host "================== 部署接入完成 ==================" -ForegroundColor Cyan
        Write-Host "1. Cloudflare DNS:  $fullDomain -> $Target (DNS Only)"
        Write-Host "2. 案件 CNAME 文件: $cnameFile 已就绪"
        Write-Host "3. 下一步操作："
        Write-Host "   进入案件目录提交并推送到 GitHub:"
        Write-Host "     cd '$CaseDir'"
        Write-Host "     git add site/CNAME"
        Write-Host "     git commit -m 'feat(domain): 挂载独立域名 $fullDomain'"
        Write-Host "     git push origin main"
        Write-Host "4. 稍等 1-2 分钟，GitHub Pages 将自动申请 SSL 证书并生效上线！"
        Write-Host "==================================================" -ForegroundColor Cyan
    } else {
        Write-Host "[WARNING] 未找到案件 site 目录: $CaseDir\site，跳过写入 CNAME 文件。" -ForegroundColor Yellow
    }
}

