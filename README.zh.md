# 外观模块化改良计划

[English](README.md)

外观 Atlas 把七项外观与界面布局插件收在 DeepSeek Harness 的同一张插件卡里：Claude 风格 UI 皮肤、
登录后隐藏账号卡片、侧栏品牌、激进侧边栏、[低调侧边栏](../dsh-subtle-sidebar/README.zh.md)、
[倒反天罡](../dsh-sidebar-shortcut-swap/README.zh.md)和峰谷时间。
其中「激进侧边栏」和「峰谷时间」默认启用，Claude 皮肤、隐藏账号卡片、侧栏品牌、「低调侧边栏」与「倒反天罡」默认关闭，按需开启；七个成员可以分别启停，侧栏品牌、
激进侧边栏和峰谷时间的设置会汇总显示在聚合包详情页。

在 DeepSeek Harness 的 **插件** → **添加插件** 中输入 `@miorin/dsh-atlas-visual`（本地开发时先完成成员构建、
在本目录运行 `pnpm install`，再从目录添加）。
如果已单独安装任一成员，或仍启用了旧版包含峰谷时间的列表 Atlas，先移除或更新对应的加载项，避免出现重复行 ID。

兼容性与校验命令见[维护说明](docs/README.md)。
