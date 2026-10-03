<#
.SYNOPSIS
    全自动汇总与更新 Vanguard 平台案例全局索引表。
.DESCRIPTION
    扫描 cases/ 目录下所有案例的 metadata.json，提取状态与交付物路径，
    自动生成与刷新 docs/CASES_INDEX.md 全局索引文档。
#>

[CmdletBinding()]
param ()

$ErrorActionPreference = "Stop"

$CasesBaseDir = "cases"
if (-not (Test-Path $CasesBaseDir)) {
    Write-Warning "未找到 cases/ 目录！"
    exit 0
}

$CaseDirs = Get-ChildItem -Path $CasesBaseDir -Directory
$CaseList = [System.Collections.Generic.List[PSCustomObject]]::new()

foreach ($dir in $CaseDirs) {
    $MetaPath = Join-Path $dir.FullName "metadata.json"
    if (Test-Path $MetaPath) {
        try {
            $Meta = Get-Content $MetaPath -Raw -Encoding UTF8 | ConvertFrom-Json
            $CaseList.Add([PSCustomObject]@{
                Id = $Meta.id
                Title = $Meta.title
                Category = $Meta.category
                Status = $Meta.status
                Author = $Meta.author
                UpdatedAt = $Meta.updated_at
                Summary = $Meta.summary
                DirName = $dir.Name
                SiteEntry = $Meta.deliverables.site_entry
                DocsEntry = $Meta.deliverables.docs_entry
            })
        } catch {
            Write-Warning "解析案例 [$($dir.Name)] 的元数据异常: $_"
        }
    }
}

Write-Host ">>> 扫描到 $($CaseList.Count) 个有效案例，正在生成全局索引..." -ForegroundColor Cyan

$Today = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")

# 强制数组包装避免单元素无 Count 属性
$TotalCount = $CaseList.Count
$GeneratedCount = @($CaseList | Where-Object { $_.Status -eq "generated" }).Count
$DraftCount = @($CaseList | Where-Object { $_.Status -eq "draft" }).Count
$InProgressCount = @($CaseList | Where-Object { $_.Status -eq "in_progress" }).Count
$ArchivedCount = @($CaseList | Where-Object { $_.Status -eq "archived" }).Count

$Lines = [System.Collections.Generic.List[string]]::new()
$Lines.Add("# Vanguard 平台全量案例资产索引 (Cases Index)")
$Lines.Add("")
$Lines.Add("> **自动构建时间**：$Today  ")
$Lines.Add("> **案例总数**：$TotalCount 个 | **已交付产物**：$GeneratedCount 个 | **调研推进中**：$InProgressCount 个 | **草稿**：$DraftCount 个 | **已归档**：$ArchivedCount 个")
$Lines.Add("")
$Lines.Add("---")
$Lines.Add("")
$Lines.Add("## 1. 案例概览全景表")
$Lines.Add("")
$Lines.Add("| 案例 ID | 案例标题 | 所属分类 | 状态 | 负责人 | 更新日期 | 产物直达 | 文档入口 |")
$Lines.Add("| :--- | :--- | :--- | :---: | :--- | :---: | :---: | :---: |")

if ($CaseList.Count -eq 0) {
    $Lines.Add("| - | 暂无案例 (请运行 scripts/new-case.ps1 初始化首个案例) | - | - | - | - | - | - |")
} else {
    foreach ($item in $CaseList) {
        $StatusBadge = switch ($item.Status) {
            "generated"   { "🟢 已生成" }
            "in_progress" { "🟡 调研中" }
            "draft"       { "⚪ 草稿" }
            "archived"    { "🟣 已归档" }
            Default       { $item.Status }
        }

        $SiteLink = "[查看静态网站](../cases/$($item.DirName)/$($item.SiteEntry))"
        $DocsLink = "[查阅文档](../cases/$($item.DirName)/$($item.DocsEntry))"

        $Lines.Add("| ``$($item.Id)`` | **$($item.Title)** | $($item.Category) | $StatusBadge | $($item.Author) | $($item.UpdatedAt) | $SiteLink | $DocsLink |")
    }
}

$Lines.Add("")
$Lines.Add("---")
$Lines.Add("")
$Lines.Add("## 2. 案例简要摘要清单")
$Lines.Add("")

if ($CaseList.Count -gt 0) {
    foreach ($item in $CaseList) {
        $Lines.Add("### 📌 $($item.Title) ($($item.Id))")
        $Lines.Add("- **分类**：$($item.Category) | **负责人**：$($item.Author) | **最新更新**：$($item.UpdatedAt)")
        $Lines.Add("- **核心摘要**：$($item.Summary)")
        $Lines.Add("- **快速入口**：[浏览静态网页产物](../cases/$($item.DirName)/$($item.SiteEntry)) | [查阅深度分析文档](../cases/$($item.DirName)/$($item.DocsEntry))")
        $Lines.Add("")
    }
}

$IndexPath = "docs\CASES_INDEX.md"
[System.IO.File]::WriteAllLines((Join-Path (Get-Location) $IndexPath), $Lines, [System.Text.Encoding]::UTF8)

Write-Host "==========================================================" -ForegroundColor Green
Write-Host " 全局索引已更新完成: $IndexPath" -ForegroundColor Green
Write-Host " 统计: 总计 $TotalCount 个案例 (已交付: $GeneratedCount, 进行中: $InProgressCount, 草稿: $DraftCount)" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Green
