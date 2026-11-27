# AGENTS.local

本仓库维护外观 Atlas 私有聚合包。
中文界面标题是「外观模块化改良计划」，英文是 `Visual Modular Improvement Plan`，卡片元数据同步维护八种语言。

[聚合清单](aggregate.yml)记录成员顺序和同级源码链接。
本包使用 `@miorin/dsh-aggregate` 生成依赖、契约、[patch](cordis.patch.yml) 与 `src/` 下的 TypeScript 入口，
再通过 `scripts/build.mjs` 编译出 `index.js`、`client.js`（构建产物不入库），保留原插件的行 ID 和配置；
成员行为在各自的仓库维护。

[产品设计](DESIGN.md)是本聚合包的设计入口（修改成员范围或聚合契约前先阅读它，成功标准只写目标不标已实现/已通过）。
[英文说明](README.md)与[中文说明](README.zh.md)面向用户，[项目文档](docs/README.md)记录安装前提、维护和验证。
进度、排期与调试记录留在任务记录，任务收尾前将已确认的产品决定写回 [DESIGN.md](DESIGN.md) 并在任务记录中留链接。
变更清单后运行 `pnpm test` 和工作区脚手架的 `--check`。
用 `docs/scripts/reflow md <path>` 重排 Markdown，Git 钩子用 `prek install` 安装。
保持生成的 [AGENTS.md](AGENTS.md) 与工作区模板一致。
