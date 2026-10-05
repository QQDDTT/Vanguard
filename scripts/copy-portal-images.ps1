$brain = 'C:\Users\Nick\.gemini\antigravity-ide\brain\8af2331d-7808-41d6-a24c-ae7d5d81e63e'
$map = @{
    'portal_hero_workbench_1791177604819.jpg' = 'hero-workbench.jpg'
    'portal_frontier_infra_1791177621713.jpg' = 'frontier-infra.jpg'
    'portal_ai_symbiosis_1791177642346.jpg' = 'ai-symbiosis.jpg'
    'portal_sentis_mockup_1791177660729.jpg' = 'sentis-showcase.jpg'
    'portal_artisan_craft_1791177678451.jpg' = 'artisan-craft.jpg'
}

$destDirs = @('site\assets\images', 'assets\images')
foreach ($d in $destDirs) {
    if (-not (Test-Path $d)) {
        New-Item -ItemType Directory -Path $d -Force | Out-Null
    }
    foreach ($entry in $map.GetEnumerator()) {
        $src = Join-Path $brain $entry.Key
        $dst = Join-Path $d $entry.Value
        if (Test-Path $src) {
            Copy-Item -Path $src -Destination $dst -Force
            Write-Host "[COPIED] $src -> $dst"
        } else {
            Write-Host "[WARN] Not found: $src"
        }
    }
}
