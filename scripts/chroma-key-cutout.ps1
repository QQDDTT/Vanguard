# 洋红(#FF00FF)色键去底：将纯洋红底的图片批量转为透明 PNG（含去溢色与自动裁边）
# 用法: .\chroma-key-cutout.ps1 -SrcDir <源图目录> -OutDir <输出目录> [-Lo 40] [-Hi 140]
param(
    [Parameter(Mandatory=$true)][string]$SrcDir,
    [Parameter(Mandatory=$true)][string]$OutDir,
    [int]$Lo = 40,
    [int]$Hi = 140,
    [int]$Pad = 4
)
Add-Type -AssemblyName System.Drawing
Add-Type -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
public static class Keyer {
    public static Bitmap Run(Bitmap src, int lo, int hi, int pad) {
        int w = src.Width, h = src.Height;
        Bitmap bmp = new Bitmap(w, h, PixelFormat.Format32bppArgb);
        using (Graphics g = Graphics.FromImage(bmp)) { g.DrawImage(src, 0, 0, w, h); }
        BitmapData d = bmp.LockBits(new Rectangle(0,0,w,h), ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
        int stride = d.Stride; byte[] buf = new byte[stride*h];
        System.Runtime.InteropServices.Marshal.Copy(d.Scan0, buf, 0, buf.Length);
        int minX=w, minY=h, maxX=-1, maxY=-1;
        for (int y=0;y<h;y++) for (int x=0;x<w;x++) {
            int i=y*stride+x*4; int B=buf[i], G=buf[i+1], R=buf[i+2];
            int m = Math.Min(R,B) - G;
            double a = 1.0 - Math.Max(0.0, Math.Min(1.0, (m-lo)/(double)(hi-lo)));
            if (m > 0) { int spill = (int)(m*0.9); R = Math.Max(G, R-spill); B = Math.Max(G, B-spill); }
            buf[i]=(byte)B; buf[i+1]=(byte)G; buf[i+2]=(byte)R; buf[i+3]=(byte)(a*255);
            if (a > 0.05) { if(x<minX)minX=x; if(x>maxX)maxX=x; if(y<minY)minY=y; if(y>maxY)maxY=y; }
        }
        System.Runtime.InteropServices.Marshal.Copy(buf, 0, d.Scan0, buf.Length);
        bmp.UnlockBits(d);
        if (maxX < 0) return bmp;
        minX=Math.Max(0,minX-pad); minY=Math.Max(0,minY-pad); maxX=Math.Min(w-1,maxX+pad); maxY=Math.Min(h-1,maxY+pad);
        Rectangle r = new Rectangle(minX,minY,maxX-minX+1,maxY-minY+1);
        Bitmap outBmp = bmp.Clone(r, PixelFormat.Format32bppArgb);
        bmp.Dispose();
        return outBmp;
    }
}
"@ -ReferencedAssemblies System.Drawing

New-Item -ItemType Directory -Force $OutDir | Out-Null
Get-ChildItem $SrcDir -Include *.jpg,*.jpeg,*.png -Recurse | ForEach-Object {
    $img = [System.Drawing.Bitmap]::FromFile($_.FullName)
    $res = [Keyer]::Run($img, $Lo, $Hi, $Pad)
    $dst = Join-Path $OutDir ($_.BaseName + '.png')
    $res.Save($dst, [System.Drawing.Imaging.ImageFormat]::Png)
    $img.Dispose(); $res.Dispose()
    Write-Host "OK: $dst"
}
