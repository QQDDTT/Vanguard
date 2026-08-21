# 🖥️ Vanguard Web UI 使用手册 (FBE 操作指南)

欢迎使用 Vanguard FBE 平台！本手册将指导前线部署工程师（FBE）如何在客户现场高效地使用 Web UI 界面，完成驻场上下文初始化、智能排查与现场跟进。

## 1. 登录与初始化

- **访问地址**: 访问预先配置好的平台域名（例如 `https://vanguard-web.evotensor.dev`）。
- **状态确认**: 进入系统后，请留意界面右上角的指示灯。如果显示绿色的 `Data Connect Emulator Active` 或 `Database Active`，说明平台与底层后端的实时数据流已成功接通。

## 2. 新建驻场契约 (Create Engagement)

当您到达客户现场时，第一步是创建一个 **Engagement (驻场契约)**。这相当于为本次客户拜访或技术支持建立一个专属的“案件档案”，所有的日志、对话和 AI 分析都将与该档案挂钩。

**操作步骤：**
1. 在页面顶部的输入框中，输入本次任务的描述或客户名称（如：`Acme Corp 数据库迁移评估` 或 `网络延迟故障排查`）。
2. 在下拉菜单中选择准确的任务类型：
   - `INTERVIEW` (客户访谈/需求调研)
   - `WORKSHOP` (技术工作坊/研讨会)
   - `POC` (概念验证/测试)
   - `DEPLOYMENT` (现场部署交付)
   - `TROUBLESHOOTING` (现场故障排查)
3. 点击 **"Create Engagement" (创建契约)** 按钮提交。

## 3. 任务大盘 (Engagement Dashboard)

创建成功后，任务大盘 (Engagement Card List) 会实时刷新并展示您当前及历史负责的案件。

**卡片状态解读：**
- **OPEN (进行中)**：刚刚建立，正在客户现场处理中。
- **PENDING (挂起)**：等待客户反馈，或需要后台研发团队协助排查。
- **CLOSED (已关闭)**：任务已完成，Vanguard 已自动生成交付报告并归档。

*(点击任意卡片即可进入该 Engagement 的专属控制台。目前系统主要实现了新建与大盘总览功能。)*

---

## 4. [未来开放] 智能排查与自动验证 (Live Probing & Auto-Execution)
*即将上线：进入单个 Engagement 后，您可以直接拖拽客户的错误日志、网络抓包包至 Web UI 中。底层的 Rust 引擎会立即调度大模型进行诊断。更强大的是，Agent 可以在 UI 上自动唤起终端，替您执行 `ping`、`curl` 或通过 API 拉取云监控指标进行双重验证！*

## 5. [未来开放] 配置文件审查与热修复 (Config Patching & Diff Viewer)
*即将上线：当 Vanguard 发现客户配置文件（如 K8s YAML 或 Nginx.conf）中的错误时，它将直接在 Web UI 输出美观的代码 Diff 对比面板（左侧旧代码，右侧新代码）。您可以轻松一键审查并 Copy 至剪贴板，彻底告别手动改错！*

## 6. [未来开放] 自动述职与报告归档 (Auto-Reporting)
*即将上线：点击任务卡片的 "Generate Report"，系统将融合当前 Engagement 的所有数据，一键导出《现场技术排查总结书》PDF/Markdown，供您直接交付给客户或内部汇报。*
