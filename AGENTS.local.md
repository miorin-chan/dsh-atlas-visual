# AGENTS.local

本仓库维护外观 Atlas 私有聚合包。
中文界面标题是「外观模块化改良计划」，英文是 `Visual Modular Improvement Plan`，卡片元数据同步维护八种语言。

[聚合清单](aggregate.yml)记录成员顺序和同级源码链接。
本包使用默认工作区的 `tools/dsh-aggregate` 生成依赖、契约、[patch](cordis.patch.yml) 与独立运行时入口（`index.js`、
`client.js`），保留原插件的行 ID 和配置；成员行为在各自的仓库维护。

[英文说明](README.md)与[中文说明](README.zh.md)面向用户，[项目文档](docs/README.md)记录安装前提、维护和验证。
变更清单后运行 `pnpm test` 和工作区脚手架的 `--check`。
用 `docs/scripts/reflow md <path>` 重排 Markdown，Git 钩子用 `prek install` 安装。
保持生成的 [AGENTS.md](AGENTS.md) 与工作区模板一致。
