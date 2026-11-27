# 外观 Atlas 维护说明

- [产品设计](../DESIGN.md)：主题定位、成员范围与成功标准。
- [中文用户说明](../README.zh.md) · [English README](../README.md)：安装与使用说明。

聚合包在插件页提供一张卡，卡内使用 DSH 原生插件行。
成员顺序依次为 Claude 风格 UI 皮肤、登录后隐藏账号卡片、侧栏品牌、激进侧边栏、低调侧边栏和峰谷时间。
[清单](../aggregate.yml)声明成员及其 `link:` 来源。
生成的 [patch](../cordis.patch.yml)保留成员自己的行 ID、包名和配置，并追加聚合运行时行，
自动把成员在 `plugins.bundle.config` 注册的设置汇总到详情页。
一个 profile 只能选用同一行 ID 的一种装载方式。

## 准备与兼容

包名 `@miorin/dsh-atlas-visual` 发布至 npm。目标 DSH 版本为 `0.2.2-rc.5` 或更新版本。
源码准备需要 Node.js 22.18 或更新的 22.x 版本，或 24.11 及更新版本，以及 pnpm。
本地联调时，六个同级源码目录 `../dsh-claudelike-ui`、`../dsh-hide-signed-in-card`、`../dsh-sidebar-brand`、
`../dsh-aggressive-sidebar`、`../dsh-subtle-sidebar` 与 `../dsh-peak-pricing-sidebar` 须已完成各自的构建。
在本目录运行 `pnpm install --frozen-lockfile`，安装会在本目录建立依赖并生成聚合文件。
安装至 DSH 的入口见[用户说明](../README.zh.md)。

## 维护与校验

本包使用默认工作区的 `tools/dsh-aggregate` 生成聚合文件。
变更成员时先编辑清单，再运行生成命令、更新锁文件并校验。
提交清单、生成的 patch、包清单、锁文件以及生成的运行时入口（`index.js`、`client.js`），
以便独立仓库 CI 无需工作区工具即可校验和发布。

- `pnpm test` 重新生成，然后运行全部检查。
- `pnpm run check` 只读检查生成文件是否有漂移，并用本地测试检查原生行及成员入口解析。
- 在默认工作区根目录运行 `node tools/new-dsh-plugin/cli.mts --check plugins/dsh-atlas-visual` 检查骨架与元数据。

图标保留 Atlas 系列的罗盘徽记，主体是调色盘，代表界面外观与视觉主题调整。
