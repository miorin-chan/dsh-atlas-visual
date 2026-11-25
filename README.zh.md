# 外观模块化改良计划

[English](README.md)

外观 Atlas 把六项外观与界面布局插件收在 DeepSeek Harness 的同一张插件卡里：
Claude 风格 UI 皮肤、登录后隐藏账号卡片、侧栏品牌、激进侧边栏、[低调侧边栏](../dsh-subtle-sidebar/README.zh.md)和峰谷时间。
六个成员可以分别启停，侧栏品牌、激进侧边栏和峰谷时间的设置会汇总显示在聚合包详情页。

这个私有聚合包链接同级目录 `dsh-claudelike-ui`、`dsh-hide-signed-in-card`、`dsh-sidebar-brand`、
`dsh-aggressive-sidebar`、`dsh-subtle-sidebar` 与 `dsh-peak-pricing-sidebar`。
先完成成员构建，再在本目录运行 `pnpm install`，然后从 DSH 的 **插件** → **添加插件** 选择本目录。
如果已单独安装任一成员，或仍启用了旧版包含峰谷时间的列表 Atlas，先移除或更新对应的加载项，避免出现重复行 ID。

兼容性与校验命令见[维护说明](docs/README.md)。
