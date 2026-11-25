# Visual Modular Improvement Plan

[中文](README.zh.md)

Visual Atlas brings five appearance and layout tweaks together in one DeepSeek Harness **Plugins** card:
the Claude-like UI skin, hiding the signed-in account card, sidebar brand customization,
the aggressive right sidebar layout, and the DeepSeek peak pricing timeline.
Each plugin row has an independent switch, and settings for sidebar brand, aggressive sidebar,
and peak pricing appear together on the bundle page.

This private bundle links the sibling `dsh-claudelike-ui`, `dsh-hide-signed-in-card`,
`dsh-sidebar-brand`, `dsh-aggressive-sidebar`, and `dsh-peak-pricing-sidebar` checkouts.
Build those checkouts first, then run `pnpm install` here.
In DSH, choose **Plugins** → **Add plugin** and select this directory.
If any member is already installed as a standalone bundle—or via an older List Atlas build
that still includes Peak pricing timeline—disable or update it first to avoid duplicate row IDs.

See the [maintenance guide](docs/README.md) for compatibility and verification commands.
