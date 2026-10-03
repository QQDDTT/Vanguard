<#
.SYNOPSIS
    SENTIS 官方 Logo 素材全规格生成工具 (Windows 原生 PowerShell)
.DESCRIPTION
    利用 System.Drawing 进行高保真像素平滑、羽化透明化抠图、自动边界裁切与多尺寸规格导出。
#>

Add-Type -AssemblyName System.Drawing

$rawDir = "G:\我的云端硬盘\workspace\Vanguard\cases\sentis-crm-system\raw"
$outDir = "G:\我的云端硬盘\workspace\Vanguard\cases\sentis-crm-system\site\assets\logo"
$siteDir = "G:\我的云端硬盘\workspace\Vanguard\cases\sentis-crm-system\site"

$file01 = Join-Path $rawDir "SENTIS_01.jpg" # 完整组合标
$file02 = Join-Path $rawDir "SENTIS_02.jpg" # 纯罗盘徽标

# 高质量透明化处理函数（平滑羽化，消除白边锯齿）
function Convert-ToTransparentBitmap {
    param([System.Drawing.Bitmap]$sourceBmp)
    
    $w = $sourceBmp.Width
    $h = $sourceBmp.Height
    $targetBmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

    $rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
    $srcData = $sourceBmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $dstData = $targetBmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

    $numBytes = $w * $h * 4
    $pixelBytes = New-Object byte[] $numBytes
    [System.Runtime.InteropServices.Marshal]::Copy($srcData.Scan0, $pixelBytes, 0, $numBytes)

    for ($i = 0; $i -lt $numBytes; $i += 4) {
        $b = $pixelBytes[$i]
        $g = $pixelBytes[$i + 1]
        $r = $pixelBytes[$i + 2]
        
        # 亮度计算
        $minVal = [Math]::Min($r, [Math]::Min($g, $b))
        $maxVal = [Math]::Max($r, [Math]::Max($g, $b))
        
        # 如果是白色或高光接近白色
        if ($minVal -gt 240) {
            $pixelBytes[$i + 3] = 0 # 全透
        } elseif ($minVal -gt 210) {
            # 平滑半透明过渡
            $factor = (240 - $minVal) / 30.0
            $pixelBytes[$i + 3] = [byte]($factor * 255)
        } else {
            $pixelBytes[$i + 3] = 255 # 全实
        }
    }

    [System.Runtime.InteropServices.Marshal]::Copy($pixelBytes, 0, $dstData.Scan0, $numBytes)
    $sourceBmp.UnlockBits($srcData)
    $targetBmp.UnlockBits($dstData)

    return $targetBmp
}

# 自动内容边界裁切函数
function Crop-ToContent {
    param([System.Drawing.Bitmap]$bmp, [int]$padding = 10)
    $minX = $bmp.Width
    $minY = $bmp.Height
    $maxX = 0
    $maxY = 0

    for ($y = 0; $y -lt $bmp.Height; $y++) {
        for ($x = 0; $x -lt $bmp.Width; $x++) {
            $pixel = $bmp.GetPixel($x, $y)
            if ($pixel.A -gt 20) {
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }

    $minX = [Math]::Max(0, $minX - $padding)
    $minY = [Math]::Max(0, $minY - $padding)
    $maxX = [Math]::Min($bmp.Width - 1, $maxX + $padding)
    $maxY = [Math]::Min($bmp.Height - 1, $maxY + $padding)

    $cropWidth = $maxX - $minX + 1
    $cropHeight = $maxY - $minY + 1

    $cropRect = New-Object System.Drawing.Rectangle($minX, $minY, $cropWidth, $cropHeight)
    $cropped = New-Object System.Drawing.Bitmap($cropWidth, $cropHeight, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    
    $g = [System.Drawing.Graphics]::FromImage($cropped)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.DrawImage($bmp, 0, 0, $cropRect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()

    return $cropped
}

# 高质量缩放函数
function Resize-Image {
    param([System.Drawing.Bitmap]$source, [int]$targetW, [int]$targetH)
    $dest = New-Object System.Drawing.Bitmap($targetW, $targetH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($dest)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.DrawImage($source, 0, 0, $targetW, $targetH)
    $g.Dispose()
    return $dest
}

Write-Host ">>> 正在处理 SENTIS 品牌素材..." -ForegroundColor Cyan

# 1. 处理 SENTIS_02 (罗盘徽标)
$src02 = New-Object System.Drawing.Bitmap($file02)
$trans02 = Convert-ToTransparentBitmap -sourceBmp $src02
$croppedEmblem = Crop-ToContent -bmp $trans02 -padding 12

# 制作正方形徽标基底
$maxDim = [Math]::Max($croppedEmblem.Width, $croppedEmblem.Height)
$squareEmblem = New-Object System.Drawing.Bitmap($maxDim, $maxDim, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($squareEmblem)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$offX = ($maxDim - $croppedEmblem.Width) / 2
$offY = ($maxDim - $croppedEmblem.Height) / 2
$g.DrawImage($croppedEmblem, $offX, $offY)
$g.Dispose()

# 导出各种尺寸的透明罗盘徽标
$emblemSizes = @(512, 256, 180, 128, 64, 48, 32, 16)
foreach ($size in $emblemSizes) {
    $resized = Resize-Image -source $squareEmblem -targetW $size -targetH $size
    $savePath = Join-Path $outDir "sentis-emblem-${size}.png"
    $resized.Save($savePath, [System.Drawing.Imaging.ImageFormat]::Png)
    $resized.Dispose()
    Write-Host "  -> 已生成: sentis-emblem-${size}.png" -ForegroundColor Green
}

# 导出 Apple Touch Icon (180x180)
$appleIcon = Resize-Image -source $squareEmblem -targetW 180 -targetH 180
$appleIcon.Save((Join-Path $outDir "apple-touch-icon.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$appleIcon.Save((Join-Path $siteDir "apple-touch-icon.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$appleIcon.Dispose()

# 导出 Favicon (32x32 & 16x16)
$fav32 = Resize-Image -source $squareEmblem -targetW 32 -targetH 32
$fav32.Save((Join-Path $outDir "favicon-32x32.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$fav32.Save((Join-Path $siteDir "favicon.png"), [System.Drawing.Imaging.ImageFormat]::Png)

# 生成兼容 .ico 文件 (将 32x32 PNG 封装写入 ICO 头部)
$icoPath = Join-Path $siteDir "favicon.ico"
$icoLogoPath = Join-Path $outDir "favicon.ico"
$ms = New-Object System.IO.MemoryStream
$fav32.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
$pngBytes = $ms.ToArray()
$ms.Dispose()

$icoFs = New-Object System.IO.FileStream($icoPath, [System.IO.FileMode]::Create)
$bw = New-Object System.IO.BinaryWriter($icoFs)
$bw.Write([UInt16]0)          # Reserved
$bw.Write([UInt16]1)          # Type 1 = ICO
$bw.Write([UInt16]1)          # 1 image
$bw.Write([byte]32)           # Width
$bw.Write([byte]32)           # Height
$bw.Write([byte]0)            # Color count (0 if >= 8bpp)
$bw.Write([byte]0)            # Reserved
$bw.Write([UInt16]1)          # Color planes
$bw.Write([UInt16]32)         # Bits per pixel
$bw.Write([UInt32]$pngBytes.Length) # Image data size
$bw.Write([UInt32]22)         # Offset of image data
$bw.Write($pngBytes)
$bw.Flush()
$bw.Close()
$icoFs.Close()
Copy-Item $icoPath $icoLogoPath -Force
Write-Host "  -> 已生成: favicon.ico 与 favicon.png" -ForegroundColor Green

# 2. 处理 SENTIS_01 (完整横版组合标)
$src01 = New-Object System.Drawing.Bitmap($file01)
$trans01 = Convert-ToTransparentBitmap -sourceBmp $src01
$croppedFull = Crop-ToContent -bmp $trans01 -padding 16

# 导出高清横版透明 PNG
$fullW = $croppedFull.Width
$fullH = $croppedFull.Height
$ratio = $fullH / [double]$fullW

$horizWidths = @(800, 600, 400, 240)
foreach ($w in $horizWidths) {
    $h = [int][Math]::Round($w * $ratio)
    $resized = Resize-Image -source $croppedFull -targetW $w -targetH $h
    $savePath = Join-Path $outDir "sentis-logo-full-${w}w.png"
    $resized.Save($savePath, [System.Drawing.Imaging.ImageFormat]::Png)
    $resized.Dispose()
    Write-Host "  -> 已生成: sentis-logo-full-${w}w.png ($w x $h)" -ForegroundColor Green
}

# 导出主 Logo (默认透明版与默认白底版)
$croppedFull.Save((Join-Path $outDir "sentis-logo-full.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$croppedEmblem.Save((Join-Path $outDir "sentis-emblem.png"), [System.Drawing.Imaging.ImageFormat]::Png)

# 释放原始资源
$src01.Dispose()
$trans01.Dispose()
$croppedFull.Dispose()
$src02.Dispose()
$trans02.Dispose()
$croppedEmblem.Dispose()
$squareEmblem.Dispose()
$fav32.Dispose()

Write-Host ">>> 全部规格 Logo 素材生成成功！" -ForegroundColor Cyan

