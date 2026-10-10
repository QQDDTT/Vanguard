# Vanguard 架构师画像设计与制作指南

> **适用范围**：Vanguard 官方门户第 5 幕 (`Screen 5: ARCHITECT PROFILE - 工匠精神与自研哲学`) 个人肖像制作与视觉规范。

---

## 1. 目标与视觉调性定位

Vanguard 秉承**极简黑曜石 (Deep Space Obsidian)、极客理性与掌控底层**的核心哲学。此处的个人肖像并非传统写字楼商务证件照，而是传递出**“深邃专注、极客工匠、全栈掌控”**的首席数字架构师气质。

### 视觉特征对照表

| 维度 | 推荐标准 | 严格避免 |
| :--- | :--- | :--- |
| **人物气场** | 沉着、冷静、理性、专注造物的高智感工匠 | 浮夸张扬姿势、假笑摆拍、刻板推销感 |
| **服饰着装** | 纯黑极简高领毛衣、深黑/炭灰西服内搭纯黑 T 恤、极客暗色工装 | 亮色衬衫、复杂大条纹/花纹、传统白衬衫系领带 |
| **背景环境** | 暗色工作室、隐约多屏终端、弱光金属工作台、全息微光深景深 | 明亮白色办公室、杂乱家庭房间、户外自然风景 |
| **色彩光影** | **冷峻低饱和暗色**（黑曜石基底 `#0b0f17` + 边缘青蓝轮廓光 `#06b6d4`/`#38bdf8`） | 大面积暖黄高饱和光、杂乱彩色霓虹、大面积白色死高光 |

---

## 2. 规格参数与工程标准

* **画面比例**：**严格 `4 : 3` 横版（Landscape）**（前端容器锁定 `aspect-ratio: 4 / 3`）。
* **分辨率规范**：`1200 × 900 px` 或 `1600 × 1200 px`（兼顾 2x/3x Retina 屏幕高清呈现）。
* **文件大小与格式**：推荐优化后的 `JPG` 或 `WebP`，单图文件体积控制在 **200KB ~ 400KB** 以内，确保无阻塞秒开。
* **文件路径与命名规范**：
  * 主发布目录：`site/assets/images/artisan-craft.jpg`
  * 根目录镜像：`assets/images/artisan-craft.jpg`
* **构图布局**：
  * **三分法则 / 偏侧沉思**：人物主体位于画面中右或中左，视线微侧或专注注视工作台，留出一侧暗部过渡空间，与页面右侧的文字信息栏自然呼应。
  * **半身或中近景（Medium Close-up）**：保留肩颈部与部分工作台，切忌大头贴式贴脸特写。

---

## 3. 三大制作实现路径

### 路径 A：AI 垫图与特征保持重绘（最推荐）

利用真实生活照作为底模，通过 AI 赋予科幻工匠质感与电影级暗调光影。

#### Midjourney 实操公式
1. 准备一张自己清晰、免冠、正面或微侧角度的半身照（光线均匀、面部无遮挡），上传至 Discord 获取图片链接。
2. 使用 `--cref`（Character Reference，角色一致性）参数并指定高权重：

```text
[您的照片URL] a cinematic medium shot of a visionary male technology architect, late 30s, sharp focused calm gaze, wearing a minimalist black matte turtleneck sweater, sitting by a dark sleek metallic studio workbench, subtle holographic interface glow reflecting on glasses and edge of face, deep obsidian ambient lighting, cold cyan and indigo rim lighting, dark moody background with subtle server racks out of focus, Hasselblad 80mm lens, cinematic 8k, ultra-realistic skin texture, masterpiece, photorealistic, professional lighting --ar 4:3 --cref [您的照片URL] --cw 80 --style raw --v 6.1
```

#### 参数解析
* `--ar 4:3`：严格锁定页面所需横版黄金比例。
* `--cref [URL]`：锁定面部五官轮廓，保持与本人高度一致。
* `--cw 80`：角色参考权重（80 兼顾五官相似度与 AI 赋予的暗调黑毛衣着装风格）。
* `--style raw`：减少 Midjourney 的过度艺术糖水化，保留真实皮肤纹理与工业质感。

---

### 路径 B：手机 / 相机极简暗调实拍（低成本真实现场）

只需一部具备“人像模式”或“专业模式”的手机，在夜晚即可完成布光拍摄：

1. **暗室环境**：夜间关闭室内所有吸顶大灯，消除杂乱漫反射。
2. **主面光（正面 45° 柔光）**：
   * 用一台 iPad / 笔记本屏幕打开一张纯白或冷青色壁纸，将屏幕亮度调至约 30%~40%，放置于脸部斜前方 45 度作为柔光主光源，打亮单侧面部轮廓。
3. **轮廓光（侧后方冷光，灵魂所在）**：
   * 在脑后侧上方约 45 度放置一盏冷白/冰蓝色小台灯或用手机闪光灯（表面覆一层白色纸巾柔光）。
   * 目标是在头发丝、肩颈处勾勒出一条极细冷色高光线（Rim Light），瞬间将人物从深黑背景中剥离，形成立体纵深。
4. **拍摄角度**：
   * 镜头与胸口平齐略微仰视，人物微偏头，眼神沉稳注视笔记本屏幕或斜前方，避免面对镜头产生僵硬感。
5. **手机后期微调**：
   * **曝光**：略微下调（-0.3 ~ -0.7 EV）
   * **对比度**：提升 15%~20%
   * **阴影 / 黑色色阶**：压低至纯黑（将背景完全隐入黑暗）
   * **色温**：向冷色调偏调 5%~10%（呈现冷峻科技蓝灰色）

---

### 路径 C：低调工匠剪影 / 隐私方案

若不便公开个人清晰正面容貌，可选择隐去五官的专业意象图：

* **冷光侧面剪影（Silhouette & Rim Light）**：全黑背景下，仅由背部冷光勾勒出脸庞、鼻梁与下颌线的利落线条，五官隐于暗部，神秘且充满思考深度。
* **工匠动作特写（Artisan Craftsmanship）**：特写双手在深色机械键盘、手写板或精密电路工作台上的沉浸操作，弱化面部、强化“造物”动作。

---

## 4. 替换与部署上线工作流

制作好图片后，仅需 2 步即可完成线上部署：

### 第一步：覆盖图片资源文件
将裁剪为 `4:3` 比例的最终图片命名为 `artisan-craft.jpg`，覆盖以下两个目录：
1. `site/assets/images/artisan-craft.jpg`（GitHub Pages 发布目录）
2. `assets/images/artisan-craft.jpg`（本地镜像目录）

### 第二步：解开前端页面注释
打开 `site/index.html`（约第 1280 行）及根目录 `index.html`，定位到 `artisan-portrait-wrap`：

```html
<!-- 将原本被注释的 img 标签恢复 -->
<div class="artisan-portrait-wrap" id="artisanPortrait">
  <img src="./assets/images/artisan-craft.jpg" alt="Nick - Vanguard 平台创始人" loading="lazy">
  <!-- 可移除或保留内层的占位 svg，img 会通过 absolute 自动顶层平铺覆盖 -->
</div>
```

### 第三步：双模质检验证
1. **本地离线检查**：双击直接打开 `site/index.html`（`file:///` 协议），检查 4:3 比例是否被拉伸变形、图片边缘是否平滑融入卡片。
2. **响应式断点检查**：按 `F12` 打开开发者工具，切换至移动端模式（`< 900px`），验证图片容器是否自适应转换为垂直单列居中自适应。
