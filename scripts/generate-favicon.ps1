# Vanguard Platform Favicon Generator
Add-Type -AssemblyName System.Drawing

$svgContent = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="vgBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0e1320" />
      <stop offset="100%" stop-color="#05070c" />
    </linearGradient>
    <linearGradient id="vgBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.9" />
      <stop offset="50%" stop-color="#6366f1" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.3" />
    </linearGradient>
    <linearGradient id="vgLeftWing" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="60%" stop-color="#2563eb" />
      <stop offset="100%" stop-color="#1d4ed8" />
    </linearGradient>
    <linearGradient id="vgRightWing" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4" />
      <stop offset="50%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#4f46e5" />
    </linearGradient>
    <filter id="vgGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <rect x="2" y="2" width="60" height="60" rx="14" ry="14" fill="url(#vgBg)" stroke="url(#vgBorder)" stroke-width="1.8" />
  <circle cx="32" cy="33" r="16" fill="#2563eb" opacity="0.3" filter="url(#vgGlow)" />
  <path d="M 14 16 L 25 16 L 32 44 L 23 44 Z" fill="url(#vgLeftWing)" />
  <path d="M 50 16 L 39 16 L 32 44 L 41 44 Z" fill="url(#vgRightWing)" />
  <polygon points="23,44 41,44 32,53" fill="#1e3a8a" />
  <polygon points="32,44 41,44 32,53" fill="#4338ca" />
  <polygon points="32,10 34.2,15 39,17.2 34.2,19.4 32,24 29.8,19.4 25,17.2 29.8,15" fill="#38bdf8" />
  <circle cx="32" cy="17.2" r="1.5" fill="#ffffff" />
</svg>
'@

$dirs = @("site")
foreach ($d in $dirs) {
    if (-not (Test-Path $d)) { New-Item -ItemType Directory -Path $d -Force | Out-Null }
    $svgPath = Join-Path $d "favicon.svg"
    [System.IO.File]::WriteAllText($svgPath, $svgContent, [System.Text.Encoding]::UTF8)
    Write-Host "[OK] SVG: $svgPath"
}

function Generate-VanguardBitmap([int]$size) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    $scale = [double]$size / 64.0
    $corner = [float](14 * $scale)
    $d = [float]($corner * 2)
    $rect = New-Object System.Drawing.RectangleF(1.0, 1.0, [float]($size - 2), [float]($size - 2))

    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddArc($rect.X, $rect.Y, $d, $d, 180, 90)
    $path.AddArc($rect.Right - $d, $rect.Y, $d, $d, 270, 90)
    $path.AddArc($rect.Right - $d, $rect.Bottom - $d, $d, $d, 0, 90)
    $path.AddArc($rect.X, $rect.Bottom - $d, $d, $d, 90, 90)
    $path.CloseFigure()

    $p1 = New-Object System.Drawing.PointF(0, 0)
    $p2 = New-Object System.Drawing.PointF($size, $size)
    $cBg1 = [System.Drawing.Color]::FromArgb(255, 14, 19, 32)
    $cBg2 = [System.Drawing.Color]::FromArgb(255, 5, 7, 12)
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($p1, $p2, $cBg1, $cBg2)
    $g.FillPath($bgBrush, $path)

    $penColor = [System.Drawing.Color]::FromArgb(180, 56, 189, 248)
    $penWidth = [float]([Math]::Max(1.0, 1.5 * $scale))
    $pen = New-Object System.Drawing.Pen($penColor, $penWidth)
    $g.DrawPath($pen, $path)

    # Left Wing
    $l1 = New-Object System.Drawing.PointF([float](14 * $scale), [float](16 * $scale))
    $l2 = New-Object System.Drawing.PointF([float](25 * $scale), [float](16 * $scale))
    $l3 = New-Object System.Drawing.PointF([float](32 * $scale), [float](44 * $scale))
    $l4 = New-Object System.Drawing.PointF([float](23 * $scale), [float](44 * $scale))
    [System.Drawing.PointF[]]$leftPts = @($l1, $l2, $l3, $l4)
    $cLeft1 = [System.Drawing.Color]::FromArgb(255, 56, 189, 248)
    $cLeft2 = [System.Drawing.Color]::FromArgb(255, 29, 78, 216)
    $leftBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($l1, $l3, $cLeft1, $cLeft2)
    $g.FillPolygon($leftBrush, $leftPts)

    # Right Wing
    $r1 = New-Object System.Drawing.PointF([float](50 * $scale), [float](16 * $scale))
    $r2 = New-Object System.Drawing.PointF([float](39 * $scale), [float](16 * $scale))
    $r3 = New-Object System.Drawing.PointF([float](32 * $scale), [float](44 * $scale))
    $r4 = New-Object System.Drawing.PointF([float](41 * $scale), [float](44 * $scale))
    [System.Drawing.PointF[]]$rightPts = @($r1, $r2, $r3, $r4)
    $cRight1 = [System.Drawing.Color]::FromArgb(255, 6, 182, 212)
    $cRight2 = [System.Drawing.Color]::FromArgb(255, 99, 102, 241)
    $rightBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($r1, $r3, $cRight1, $cRight2)
    $g.FillPolygon($rightBrush, $rightPts)

    # Bottom Tip
    $t1 = New-Object System.Drawing.PointF([float](23 * $scale), [float](44 * $scale))
    $t2 = New-Object System.Drawing.PointF([float](32 * $scale), [float](44 * $scale))
    $t3 = New-Object System.Drawing.PointF([float](32 * $scale), [float](53 * $scale))
    $t4 = New-Object System.Drawing.PointF([float](41 * $scale), [float](44 * $scale))

    [System.Drawing.PointF[]]$tipLPts = @($t1, $t2, $t3)
    $tipLBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 30, 58, 138))
    $g.FillPolygon($tipLBrush, $tipLPts)

    [System.Drawing.PointF[]]$tipRPts = @($t2, $t4, $t3)
    $tipRBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 67, 56, 202))
    $g.FillPolygon($tipRBrush, $tipRPts)

    # Top Sparkle
    if ($size -ge 24) {
        $s1 = New-Object System.Drawing.PointF([float](32 * $scale), [float](10 * $scale))
        $s2 = New-Object System.Drawing.PointF([float](34.2 * $scale), [float](15 * $scale))
        $s3 = New-Object System.Drawing.PointF([float](39 * $scale), [float](17.2 * $scale))
        $s4 = New-Object System.Drawing.PointF([float](34.2 * $scale), [float](19.4 * $scale))
        $s5 = New-Object System.Drawing.PointF([float](32 * $scale), [float](24 * $scale))
        $s6 = New-Object System.Drawing.PointF([float](29.8 * $scale), [float](19.4 * $scale))
        $s7 = New-Object System.Drawing.PointF([float](25 * $scale), [float](17.2 * $scale))
        $s8 = New-Object System.Drawing.PointF([float](29.8 * $scale), [float](15 * $scale))
        [System.Drawing.PointF[]]$starPts = @($s1, $s2, $s3, $s4, $s5, $s6, $s7, $s8)
        $starBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 56, 189, 248))
        $g.FillPolygon($starBrush, $starPts)

        $centerR = [float](1.2 * $scale)
        $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
        $g.FillEllipse($whiteBrush, [float](32 * $scale - $centerR), [float](17.2 * $scale - $centerR), [float]($centerR * 2), [float]($centerR * 2))
    }

    $g.Dispose()
    return $bmp
}

$pngSizes = @(
    @{ Name = "favicon-16x16.png"; Size = 16 },
    @{ Name = "favicon-32x32.png"; Size = 32 },
    @{ Name = "favicon.png"; Size = 64 },
    @{ Name = "apple-touch-icon.png"; Size = 180 }
)

foreach ($item in $pngSizes) {
    $fname = $item.Name
    $sz = $item.Size
    $bmp = Generate-VanguardBitmap $sz
    foreach ($d in $dirs) {
        $out = Join-Path $d $fname
        $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
        Write-Host "[OK] PNG: $out ($sz x $sz)"
    }
    $bmp.Dispose()
}

# Build multi-size ICO (16, 32, 48)
function Build-IcoFile([int[]]$iconSizes, [string]$outputPath) {
    $pngDataList = @()
    foreach ($s in $iconSizes) {
        $b = Generate-VanguardBitmap $s
        $ms = New-Object System.IO.MemoryStream
        $b.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
        $pngDataList += ,@($s, $ms.ToArray())
        $b.Dispose()
        $ms.Dispose()
    }

    $fs = [System.IO.File]::Create($outputPath)
    $bw = New-Object System.IO.BinaryWriter($fs)

    $bw.Write([UInt16]0)
    $bw.Write([UInt16]1)
    $bw.Write([UInt16]$pngDataList.Count)

    $offset = 6 + (16 * $pngDataList.Count)
    foreach ($entry in $pngDataList) {
        $s = $entry[0]
        $bytes = $entry[1]
        $w = if ($s -ge 256) { [byte]0 } else { [byte]$s }
        $h = if ($s -ge 256) { [byte]0 } else { [byte]$s }

        $bw.Write([byte]$w)
        $bw.Write([byte]$h)
        $bw.Write([byte]0)
        $bw.Write([byte]0)
        $bw.Write([UInt16]1)
        $bw.Write([UInt16]32)
        $bw.Write([UInt32]$bytes.Length)
        $bw.Write([UInt32]$offset)
        $offset += $bytes.Length
    }

    foreach ($entry in $pngDataList) {
        $bw.Write($entry[1])
    }

    $bw.Flush()
    $bw.Close()
    $fs.Close()
    Write-Host "[OK] ICO: $outputPath"
}

foreach ($d in $dirs) {
    $icoPath = Join-Path $d "favicon.ico"
    Build-IcoFile @(16, 32, 48) $icoPath
}

Write-Host "Favicon generation successfully completed!"
