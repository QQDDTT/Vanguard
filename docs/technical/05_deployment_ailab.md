# 05. GCP 全栈部署指南 — Vanguard

## 1. GCP 目标环境总览

| 资源 | 服务 | 规格 / 配置 |
|------|------|------------|
| 后端容器 | Cloud Run (`vanguard-backend`) | 2 vCPU / 2 GiB，min-instances=1 |
| 数据库 | Cloud SQL PostgreSQL 16 (`vanguard-db`) | db-g1-small，启用 `pgvector` 扩展 |
| 素材存储 | Cloud Storage (`evotensor-ai-lab-vanguard-artifacts`) | Standard 区域 Storage |
| 身份认证 | Google IAP / Firebase Auth | 统一双端认证入口 |
| Web UI 静态托管 | Firebase Hosting | 全球 CDN，自动 HTTPS |
| Android 分发 | Firebase App Distribution | 内测；正式版走 Google Play Console |
| CI/CD 流水线 | Cloud Build | Rust 后端 + React Web + Android 构建 |
| 镜像仓库 | Artifact Registry (`us-central1-docker.pkg.dev/evotensor-ai-lab/vanguard`) | Docker 镜像托管 |
| **Project ID** | — | `evotensor-ai-lab` |
| **Region** | — | `us-central1`（备选 `asia-east1`） |

> ⚠️ **编译策略规范**：所有生产编译与镜像打包全权交由 GCP Cloud Build 运维平台调度，严禁在本地 DevContainer 内进行生产打包。

---

## 2. 组件一：Rust 后端部署（Cloud Run）

### 2.1 Dockerfile（`infra/Dockerfile`）

```dockerfile
# 多阶段构建
FROM rust:1.75-slim AS builder
WORKDIR /app
COPY . .
RUN cargo build --release -p vanguard-api

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/target/release/vanguard-api /usr/local/bin/vanguard-api
ENV PORT=8080
EXPOSE 8080
CMD ["vanguard-api"]
```

### 2.2 Cloud Build 配置（`infra/cloudbuild.yaml`）

```yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', '$_IMAGE_TAG', '-f', 'infra/Dockerfile', '.']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', '$_IMAGE_TAG']
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run', 'deploy', 'vanguard-backend'
      - '--image', '$_IMAGE_TAG'
      - '--region', 'us-central1'
      - '--set-env-vars', 'DATABASE_URL=$$DATABASE_URL,GEMINI_API_KEY=$$GEMINI_API_KEY'
      - '--min-instances', '1'
      - '--memory', '2Gi'

substitutions:
  _IMAGE_TAG: us-central1-docker.pkg.dev/evotensor-ai-lab/vanguard/backend:$COMMIT_SHA
```

### 2.3 数据库初始化

```bash
# 首次部署时在 Cloud SQL 上执行 init.sql
gcloud sql connect vanguard-db --user=postgres < infra/sql/init.sql
```

### 2.4 环境变量清单（通过 Secret Manager 注入）

| 变量名 | 说明 |
|--------|------|
| `DATABASE_URL` | Cloud SQL 连接串（Unix Socket 格式） |
| `GEMINI_API_KEY` | Gemini API 密钥 |
| `GCS_BUCKET` | GCS 素材存储桶名 |
| `GCP_PROJECT_ID` | GCP 项目 ID |

---

## 3. 组件二：React Web UI 部署（Firebase Hosting）

### 3.1 构建命令

```bash
cd web
npm ci
npm run build      # 输出至 web/dist/
```

### 3.2 Firebase Hosting 配置（`web/firebase.json`）

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      { "source": "**", "destination": "/index.html" }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [{ "key": "Cache-Control", "value": "max-age=31536000" }]
      }
    ]
  }
}
```

### 3.3 Cloud Build 自动部署（`.cloudbuild/web.yaml`）

```yaml
steps:
  - name: 'node:20'
    dir: 'web'
    entrypoint: 'npm'
    args: ['ci']
  - name: 'node:20'
    dir: 'web'
    entrypoint: 'npm'
    args: ['run', 'build']
  - name: 'gcr.io/firebase-cli/firebase'
    args: ['deploy', '--only', 'hosting', '--project', 'evotensor-ai-lab']
```

### 3.4 环境变量（`web/.env.production`）

```ini
VITE_API_BASE_URL=https://api.vanguard.evotensor.ai
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=evotensor-ai-lab.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=evotensor-ai-lab
```

---

## 4. 组件三：Android 应用发布

### 4.1 构建与签名

```bash
cd android
./gradlew bundleRelease           # 生成 .aab 文件
./gradlew assembleRelease         # 生成 .apk 文件（仅内测）
```

### 4.2 内测分发：Firebase App Distribution

```bash
# 使用 Firebase CLI 上传内测包
firebase appdistribution:distribute \
  android/app/build/outputs/apk/release/app-release.apk \
  --app $FIREBASE_ANDROID_APP_ID \
  --release-notes "$(git log -1 --pretty=%B)" \
  --groups "fbe-testers"
```

### 4.3 Cloud Build 自动发布（`.cloudbuild/android.yaml`）

```yaml
steps:
  - name: 'openjdk:17'
    dir: 'android'
    entrypoint: './gradlew'
    args: ['assembleRelease']
    env:
      - 'ANDROID_HOME=/opt/android-sdk'
  - name: 'gcr.io/firebase-cli/firebase'
    args:
      - 'appdistribution:distribute'
      - 'android/app/build/outputs/apk/release/app-release.apk'
      - '--app', '$$FIREBASE_ANDROID_APP_ID'
      - '--groups', 'fbe-testers'
```

### 4.4 正式版发布（Google Play Console）

1. 使用 `bundleRelease` 构建 `.aab` 文件。
2. 在 Google Play Console 上传至**内部测试轨道** → 逐步推进至**生产轨道**。
3. 签名密钥统一存储于 GCP Secret Manager，CI 环境通过 Workload Identity Federation 获取。

---

## 5. CI/CD 触发规则

| 触发条件 | 目标流水线 | 部署环境 |
|---------|-----------|---------|
| `main` 分支 Push | `cloudbuild.yaml`（后端）+ `web.yaml`（Web） | 生产环境 |
| `develop` 分支 Push | 全量构建 | 测试环境 |
| Pull Request | 仅构建，不部署 | — |
| 手动触发 | `android.yaml` | Firebase App Distribution |
