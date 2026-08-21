# 01. 开发环境与工作流指南 — Vanguard

## 1. 开发环境前置要求

### 1.1 通用工具

| 工具 | 版本要求 | 说明 |
|------|---------|------|
| Git | >= 2.40 | 版本控制 |
| Docker | >= 24.0 | 本地服务依赖（PostgreSQL） |
| GCP CLI (`gcloud`) | 最新版 | 部署与 Secret 访问 |
| Firebase CLI | 最新版（`npx -y firebase-tools@latest`） | Web & Android 分发 |

### 1.2 后端（Rust）

| 工具 | 版本要求 | 安装命令 |
|------|---------|---------|
| Rust Toolchain | stable >= 1.75 | `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \| sh` |
| cargo-watch | 任意 | `cargo install cargo-watch` |
| sqlx-cli | >= 0.7 | `cargo install sqlx-cli --no-default-features --features postgres` |

### 1.3 Web 前端（React）

| 工具 | 版本要求 | 安装命令 |
|------|---------|---------|
| Node.js | >= 20 LTS | `nvm install 20` |
| pnpm | >= 9 | `npm install -g pnpm` |

### 1.4 Android（Kotlin）

| 工具 | 版本要求 | 说明 |
|------|---------|------|
| Android Studio | Hedgehog 以上 | 含 SDK 34 / Gradle 8.x |
| JDK | 17 | 项目强制使用 Java 17 |

---

## 2. 本地开发启动

### 2.1 启动本地 PostgreSQL（Docker）

```bash
# 启动带 pgvector 扩展的 PostgreSQL
docker run -d \
  --name vanguard-db \
  -e POSTGRES_DB=vanguard \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=devpassword \
  -p 5432:5432 \
  pgvector/pgvector:pg16

# 初始化数据库结构
psql postgresql://postgres:devpassword@localhost:5432/vanguard \
  -f infra/sql/init.sql
```

### 2.2 启动 Rust 后端

```bash
# 复制本地开发环境变量文件
cp .env.example .env
# 编辑 .env 填入本地配置（DATABASE_URL、GEMINI_API_KEY 等）

# 热重载启动（需安装 cargo-watch）
cargo watch -x 'run -p vanguard-api'

# 或直接运行
DATABASE_URL=postgresql://postgres:devpassword@localhost:5432/vanguard \
GEMINI_API_KEY=your_key \
cargo run -p vanguard-api
```

后端默认监听 `http://localhost:8080`，健康检查：`curl http://localhost:8080/health`

### 2.3 启动 React Web UI

```bash
cd web
pnpm install
pnpm dev
# 默认访问 http://localhost:5173
```

本地开发时，`VITE_API_BASE_URL` 指向 `http://localhost:8080`，无需 Google IAP 鉴权（使用 Dev-Mock 中间件）。

### 2.4 启动 Android 应用

1. 在 Android Studio 中打开 `android/` 目录。
2. 在 `android/app/src/main/res/values/config.xml` 中将 `api_base_url` 修改为本地 IP（如 `http://10.0.2.2:8080`）。
3. 点击 **Run**，选择 Emulator 或真机调试。

---

## 3. 环境变量说明（`.env.example`）

```ini
# 数据库连接
DATABASE_URL=postgresql://postgres:devpassword@localhost:5432/vanguard

# Gemini API
GEMINI_API_KEY=

# GCS（本地开发可留空，使用本地文件系统模拟）
GCS_BUCKET=
GCP_PROJECT_ID=evotensor-ai-lab

# 开发模式鉴权（跳过 Google IAP 验证）
DEV_MOCK_AUTH=true
DEV_MOCK_USER_EMAIL=dev@evotensor.ai
DEV_MOCK_TEAM_ID=team-dev-001

# 服务端口
PORT=8080
```

---

## 4. 分支策略（Git Branching）

```text
main          ──── 生产分支，仅通过 PR 合并，自动触发 GCP Cloud Build 部署
  │
develop       ──── 集成测试分支，功能分支 PR 目标
  │
  ├── feat/backend-llm-client    后端功能分支
  ├── feat/web-engagement-form   Web 前端功能分支
  ├── feat/android-audio-record  Android 功能分支
  └── fix/token-log-missing-id   Bug 修复分支
```

**分支命名规范**：`feat/<端>-<功能简述>` / `fix/<简述>` / `docs/<简述>`

**PR 要求**：
- 每个 PR 只改动一个模块（后端 / Web / Android）。
- 提交信息格式：`feat(backend): 实现 Gemini LLM 客户端 HTTP 请求体`。

---

## 5. 编译与测试

### 5.1 后端

```bash
# 编译检查（不运行）
cargo check --workspace

# 运行测试
cargo test --workspace

# 构建 Release 包（仅 GCP Cloud Build 执行，本地禁止）
# cargo build --release  ← 禁止在本地运行
```

> ⚠️ **编译规范**：生产 Release 构建全权由 GCP Cloud Build 负责，本地仅允许 `cargo check` / `cargo test` / `cargo run`（dev 模式）。

### 5.2 Web 前端

```bash
cd web
pnpm typecheck   # TypeScript 类型检查
pnpm lint        # ESLint 代码规范检查
pnpm test        # Vitest 单元测试
pnpm build       # 本地验证构建（输出 dist/，不部署）
```

### 5.3 Android

```bash
cd android
./gradlew lint           # 静态分析
./gradlew test           # 单元测试
./gradlew connectedTest  # 仪器测试（需真机/模拟器）
```

---

## 6. 后端 API 本地调试

推荐使用 [Bruno](https://www.usebruno.com/)（或 Insomnia）管理 API 集合，集合文件存于 `scripts/api/`。

```bash
# 快速测试健康检查
curl http://localhost:8080/health

# 新建事务（本地 Dev-Mock 鉴权）
curl -X POST http://localhost:8080/api/v1/engagements \
  -H "X-Dev-User-Email: dev@evotensor.ai" \
  -H "Content-Type: application/json" \
  -d '{"type": "INTERVIEW", "customer_name": "测试客户", "title": "本地调试会话"}'
```

---

## 7. 代码规范速查

### 7.1 Rust

- 统一使用 `anyhow::Result` 作为函数错误返回类型（业务层）。
- 数据库查询使用 SQLx `query_as!` 宏，保持编译期 SQL 校验。
- 每个 crate 内部模块按 `handler` / `service` / `model` 三层划分。

### 7.2 TypeScript / React

- 组件文件使用 PascalCase，工具函数文件使用 camelCase。
- API 请求统一封装在 `src/services/` 中，禁止在组件内直接 `fetch`。
- 使用 TanStack Query 管理所有服务端状态，禁止全局 `useState` 存储远程数据。

### 7.3 Kotlin / Compose

- 遵循 Clean Architecture 分层，UI 层（Compose）不直接依赖 Repository。
- `suspend` 函数必须在 ViewModel 的 `viewModelScope` 或 UseCase 中调用。
- 所有字符串资源必须提取至 `strings.xml`，禁止硬编码。
