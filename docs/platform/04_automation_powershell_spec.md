# Windows 原生 PowerShell 自动化规范

## 1. 规范背景与工具边界

根据平台全局约束与架构方针：
- **禁止在本地安装第三方语言环境**（Python、Node.js、Go、Rust 等及其包管理器）。
- **自动化操作全部由 Windows 原生 PowerShell 或 CMD 承载**。

PowerShell 具备强大的对象处理管道、文件系统操作能力以及原生 JSON 编解码命令（`ConvertFrom-Json` / `ConvertTo-Json`），足以胜任轻量级自动化、脚手架构建、元数据聚合与质检任务。

---

## 2. 核心自动化工具集设计

在 `scripts/` 目录下统一提供以下原生 PowerShell 脚本（编码均为 UTF-8）：

```text
scripts/
├── new-case.ps1            # 一键创建新案例骨架（含目录、元数据与模版）
├── build-index.ps1         # 扫描全局 cases/，自动汇总生成全量案例索引列表
└── validate-cases.ps1      # 自动化质检案例元数据完整度与静态产物入口
```

---

## 3. 核心脚本逻辑与实现方案

### 3.1 案例初始化脚手架 (`new-case.ps1`)
**目标**：通过交互式输入或参数传入，自动在 `cases/` 下建立规范目录并生成预设文档。

```powershell
[CmdletBinding()]
param (
    [Parameter(Mandatory = $true)]
    [string]$CaseId,
    [Parameter(Mandatory = $false)]
    [string]$Title = "新建案例",
    [Parameter(Mandatory = $false)]
    [string]$Category = "市场调研",
    [Parameter(Mandatory = $false)]
    [string]$Author = "分析师"
)

$ErrorActionPreference = "Stop"
$CaseDir = Join-Path "cases" $CaseId

if (Test-Path $CaseDir) {
    Write-Error "案例目录 [$CaseDir] 已存在，请勿重复创建！"
    exit 1
}

Write-Host ">>> 正在初始化案例: $CaseId ($Title)" -ForegroundColor Cyan

# 1. 创建标准目录骨架
$DocsDir = Join-Path $CaseDir "docs"
$SiteDir = Join-Path $CaseDir "site"
$CssDir = Join-Path $SiteDir "css"
$JsDir = Join-Path $SiteDir "js"
$AssetsDir = Join-Path $SiteDir "assets"

New-Item -ItemType Directory -Force -Path $DocsDir, $CssDir, $JsDir, $AssetsDir | Out-Null

# 2. 生成 metadata.json
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
    summary = "请在此填写案例简要说明。"
    tags = @("默认标签")
    deliverables = @{
        site_entry = "site/index.html"
        docs_entry = "docs/01_overview.md"
    }
}
$Metadata | ConvertTo-Json -Depth 5 | Set-Content -Path (Join-Path $CaseDir "metadata.json") -Encoding UTF8

# 3. 复制案例模板文档
Copy-Item "docs\templates\case_template.md" -Destination (Join-Path $DocsDir "01_overview.md")
Copy-Item "docs\templates\static_site_template.html" -Destination (Join-Path $SiteDir "index.html")

Write-Host ">>> 案例 [$CaseId] 初始化完成！" -ForegroundColor Green
```

### 3.2 全局索引生成器 (`build-index.ps1`)
**目标**：扫描 `cases/*/metadata.json`，提取元数据并自动更新 `docs/CASES_INDEX.md` 或生成全局导航。

```powershell
$ErrorActionPreference = "Stop"
$Cases = Get-ChildItem -Path "cases" -Directory

$List = @()
foreach ($c in $Cases) {
    $MetaPath = Join-Path $c.FullName "metadata.json"
    if (Test-Path $MetaPath) {
        $Json = Get-Content $MetaPath -Raw -Encoding UTF8 | ConvertFrom-Json
        $List += [PSCustomObject]@{
            ID = $Json.id
            Title = $Json.title
            Category = $Json.category
            Status = $Json.status
            Author = $Json.author
            UpdatedAt = $Json.updated_at
            Summary = $Json.summary
            SiteLink = "cases/$($c.Name)/$($Json.deliverables.site_entry)"
        }
    }
}

Write-Host ">>> 扫描到 $($List.Count) 个有效案例，正在更新全局索引..." -ForegroundColor Cyan
# 自动写出 Markdown 索引表
```

---

## 4. 脚本开发与编码准则

1. **统一 UTF-8 编码**：所有脚本文件、输出的 Markdown 与 JSON 均使用 UTF-8 编码保存，避免 Windows 平台下的中文乱码问题。
2. **严密的异常拦截**：脚本顶部必须设置 `$ErrorActionPreference = "Stop"`，遇错即停，防止生成不完整或损坏的文件树。
3. **中文友好提示**：控制台输出的日志和帮助信息必须使用通俗易懂的简体中文，关键节点高亮提示（绿色表示成功，黄色表示警告，红色表示错误）。
