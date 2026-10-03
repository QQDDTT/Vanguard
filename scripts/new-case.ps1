<#
.SYNOPSIS
    一键初始化 Vanguard 案例骨架目录与规范模版。
.DESCRIPTION
    按照 Vanguard 平台化设计规范，在 cases/ 目录下创建符合标准的案例目录结构、
    合规的 metadata.json 元数据文件，以及 Markdown 文档与纯静态网页展示模板。
.PARAMETER CaseId
    案例唯一标识（建议全小写中划线，如: 2026-fintech-evaluation）
.PARAMETER Title
    案例正式中文标题
.PARAMETER Category
    案例分类（如：市场调研、技术评测、运营策略、投资分析）
.PARAMETER Author
    负责人姓名或代号
#>

[CmdletBinding()]
param (
    [Parameter(Position = 0, Mandatory = $false)]
    [string]$CaseId,

    [Parameter(Position = 1, Mandatory = $false)]
    [string]$Title = "新建案例分析",

    [Parameter(Position = 2, Mandatory = $false)]
    [ValidateSet("市场调研", "技术评测", "运营策略", "投资分析", "产品规划", "其他")]
    [string]$Category = "技术评测",

    [Parameter(Position = 3, Mandatory = $false)]
    [string]$Author = "分析师"
)

$ErrorActionPreference = "Stop"

if (-not $CaseId) {
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host "       Vanguard 案例脚手架自动化生成工具 (PowerShell)      " -ForegroundColor Cyan
    Write-Host "==========================================================" -ForegroundColor Cyan
    $CaseId = Read-Host "请输入案例标识 ID (例: 2026-market-study)"
    if (-not $CaseId) {
        Write-Error "案例标识 ID 不能为空！"
        exit 1
    }
    $InputTitle = Read-Host "请输入案例中文标题 (默认: 新建案例分析)"
    if ($InputTitle) { $Title = $InputTitle }
}

# 规范化检查
$CaseId = $CaseId.Trim().ToLower()
$CaseDir = Join-Path "cases" $CaseId

if (Test-Path $CaseDir) {
    Write-Error "案例目录 [$CaseDir] 已存在，请勿重复创建！"
    exit 1
}

Write-Host ">>> 正在为案例 [$CaseId] 构建平台化标准结构..." -ForegroundColor Yellow

# 1. 建立目录树
$DocsDir = Join-Path $CaseDir "docs"
$SiteDir = Join-Path $CaseDir "site"
$CssDir = Join-Path $SiteDir "css"
$JsDir = Join-Path $SiteDir "js"
$AssetsDir = Join-Path $SiteDir "assets"

New-Item -ItemType Directory -Force -Path $DocsDir, $CssDir, $JsDir, $AssetsDir | Out-Null

# 2. 构造 metadata.json
$Today = (Get-Date).ToString("yyyy-MM-dd")
$Metadata = [ordered]@{
    '$schema' = "../../docs/templates/case_metadata_schema.json"
    id = $CaseId
    title = $Title
    category = $Category
    status = "draft"
    author = $Author
    created_at = $Today
    updated_at = $Today
    summary = "请在此录入针对 $Title 的核心背景与简要摘要说明。"
    tags = @("默认标签")
    deliverables = [ordered]@{
        site_entry = "site/index.html"
        docs_entry = "docs/01_overview.md"
    }
}

$MetaJsonPath = Join-Path $CaseDir "metadata.json"
$Metadata | ConvertTo-Json -Depth 5 | Set-Content -Path $MetaJsonPath -Encoding UTF8

# 3. 基于模板初始化案例文档
$TemplateDocPath = "docs\templates\case_template.md"
$TargetDocPath = Join-Path $DocsDir "01_overview.md"

if (Test-Path $TemplateDocPath) {
    $DocContent = Get-Content $TemplateDocPath -Raw -Encoding UTF8
    $DocContent = $DocContent -replace '\{case_id\}', $CaseId
    $DocContent = $DocContent -replace '案例全中文标准标题', $Title
    $DocContent = $DocContent -replace '\{author\}', $Author
    $DocContent = $DocContent -replace '\{created_at\}', $Today
    $DocContent = $DocContent -replace '\{updated_at\}', $Today
    $DocContent | Set-Content -Path $TargetDocPath -Encoding UTF8
}

# 4. 基于模板初始化纯静态网站产物与域名配置
$TemplateSitePath = "docs\templates\static_site_template.html"
$TargetSitePath = Join-Path $SiteDir "index.html"
$TargetCnamePath = Join-Path $SiteDir "CNAME"

# 自动生成 CNAME 示例域名
"$CaseId.example.com" | Set-Content -Path $TargetCnamePath -Encoding UTF8

if (Test-Path $TemplateSitePath) {
    $SiteContent = Get-Content $TemplateSitePath -Raw -Encoding UTF8
    $SiteContent = $SiteContent -replace 'case-demo-01', $CaseId
    $SiteContent = $SiteContent -replace '某核心业务系统本地化文档驱动与静态产物重构案例', $Title
    $SiteContent = $SiteContent -replace '2026-10-03', $Today
    $SiteContent | Set-Content -Path $TargetSitePath -Encoding UTF8
}

# 5. 基于模板配置 GitHub Actions 自动部署工作流
$WorkflowDir = Join-Path $CaseDir ".github\workflows"
New-Item -ItemType Directory -Force -Path $WorkflowDir | Out-Null
$TemplateWfPath = "docs\templates\github_pages_workflow.yml"
$TargetWfPath = Join-Path $WorkflowDir "deploy-pages.yml"

if (Test-Path $TemplateWfPath) {
    Copy-Item $TemplateWfPath -Destination $TargetWfPath -Force
}

Write-Host "==========================================================" -ForegroundColor Green
Write-Host " 案例 [$CaseId] 标准化脚手架已生成成功！" -ForegroundColor Green
Write-Host " 1. 案例文档入口: $TargetDocPath" -ForegroundColor White
Write-Host " 2. 静态产物入口: $TargetSitePath (浏览器直接双击打开)" -ForegroundColor White
Write-Host " 3. 元数据配置:   $MetaJsonPath" -ForegroundColor White
Write-Host " 4. 推荐公开仓库: Vanguard-$CaseId (Public，自动部署 GitHub Pages)" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Green
