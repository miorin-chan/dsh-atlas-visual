# Visual Modular Improvement Plan

[中文](README.zh.md)

Visual Atlas brings seven appearance and sidebar tweaks together in one DeepSeek Harness **Plugins** card:
the Claude-like UI skin, hiding the signed-in account card, sidebar brand customization,
Aggressive sidebar, [Subtle sidebar](../dsh-subtle-sidebar/README.md),
[Flipped sidebars](../dsh-sidebar-shortcut-swap/README.md), and the DeepSeek peak pricing timeline.
Aggressive sidebar and the peak pricing timeline are enabled by default, while the strong visual
overrides (Claude-like UI skin, hiding the signed-in account card, sidebar brand customization) as
well as Subtle sidebar and Flipped sidebars default off so visual and shortcut changes are opt-in.
Each plugin row has an independent switch, and settings for sidebar brand, aggressive sidebar,
and peak pricing appear together on the bundle page.

In DeepSeek Harness, choose **Plugins** → **Add plugin** and enter `@miorin/dsh-atlas-visual`
(or select a local directory after building sibling checkouts and running `pnpm install`).
If any member is already installed as a standalone bundle—or via an older List Atlas build
that still includes Peak pricing timeline—disable or update it first to avoid duplicate row IDs.

See the [maintenance guide](docs/README.md) for compatibility and verification commands.
