# xyavid blog

个人博客：写文章、展示项目。基于 [Astro](https://astro.build/) 的纯静态站点，**没有数据库、没有后台、没有服务端**——内容都是仓库里的 Markdown 文件，`pnpm build` 之后是一堆静态 HTML。

界面基于 [Firefly](https://github.com/CuteLeaf/Firefly) 主题（Tailwind CSS v4 + Svelte 岛），已按本站需要裁剪：只保留文章、项目、归档、分类、标签、关于、搜索，其余模块（动态、相册、书签导航、追番、打赏、评论、音乐播放器、Live2D、Mermaid/PlantUML 图表）全部关闭并从代码里移除。

## 技术栈

| 用途 | 方案 |
| --- | --- |
| 框架 | Astro 7（静态输出，只有搜索、主题切换、目录高亮等少量客户端脚本） |
| 交互岛 | Svelte 5（仅搜索面板、显示设置、分享海报等几处） |
| 内容 | Content Collections + zod 校验（字段写错在构建时就报错） |
| 样式 | Tailwind CSS v4（`@tailwindcss/vite`，CSS-first 配置）+ Stylus 遗留样式 |
| 代码高亮 | Expressive Code（明暗双主题，按 `data-theme` 切换） |
| 数学公式 | KaTeX |
| 站内搜索 | Pagefind，构建后对 `dist/` 生成索引 |
| 订阅/收录 | `@astrojs/rss`（RSS + Atom）、`@astrojs/sitemap` |
| 部署 | GitHub Pages（GitHub Actions 构建） |

## 快速开始

需要 Node ≥ 22.12（`node -v` 检查）与 pnpm（`corepack enable pnpm` 或 `npm i -g pnpm`）。

```bash
pnpm install
pnpm dev            # http://localhost:4321/xyavid-blog/
pnpm build          # 生成 dist/，随后自动建 Pagefind 搜索索引
pnpm preview        # 本地预览构建产物（搜索只有在这一步才可用）

pnpm check:links    # 检查 dist/ 里有没有死链
pnpm type-check     # TypeScript 类型检查
pnpm new-post       # 交互式新建一篇文章
```

想按根路径 `/` 而不是 `/xyavid-blog/` 预览：

```bash
BASE_PATH=/ pnpm dev
```

## 目录结构

```text
astro.config.mjs           # Astro 配置：base 子路径、字体、Expressive Code、sitemap 白名单
package.json               # 依赖与脚本
scripts/
├─ build-search.mjs        # 构建后跑 Pagefind
├─ check-links.mjs         # 死链自检
└─ new-post.js             # 新建文章
src/
├─ config/                 # 全部站点配置（见下方「配置在哪」）
├─ content/
│  ├─ posts/*.md           # 文章：一个文件一篇，文件名就是 URL 里的 slug
│  ├─ projects/*.md        # 项目：一个文件一个
│  └─ spec/about.md        # 「关于我」页面的正文
├─ layouts/
│  ├─ Layout.astro         # <html>/<head>：主题初始化、SEO、字体、全局脚本
│  └─ MainGridLayout.astro # 页面骨架：导航栏 + 侧栏 + 内容 + 页脚
├─ components/             # 布局、卡片、控件、侧栏组件、Svelte 交互岛
├─ pages/                  # 路由（见下方「路由」）
├─ styles/                 # 设计变量、布局、Markdown 排版
├─ i18n/                   # 界面文案（zh_CN 等）
└─ utils/                  # 内容查询、链接拼接、SEO 结构化数据
.github/workflows/
├─ ci.yml                  # 类型检查 + 构建 + 死链自检
└─ deploy.yml              # 推送到 main 后自动部署到 GitHub Pages
```

## 路由

| 路径 | 说明 |
| --- | --- |
| `/` | 首页：文章列表 + 分页（`/2/`、`/3/`…） |
| `/posts/` | 全部文章（含分页，与原站路径一致） |
| `/posts/<slug>/` | 文章详情 |
| `/archive/` | 归档，按年份分组 |
| `/categories/`、`/categories/<分类>/` | 分类总览与分类下的文章 |
| `/tags/`、`/tags/<标签>/` | 标签总览与标签下的文章 |
| `/projects/`、`/projects/<slug>/` | 项目列表与详情 |
| `/about/` | 关于我 |
| `/search/` | 站内搜索（Pagefind） |
| `/rss.xml`、`/atom.xml` | 订阅源 |
| `/sitemap-index.xml`、`/robots.txt`、`/llms.txt` | 收录相关 |

## 日常使用

### 写一篇新文章

在 `src/content/posts/` 下新建 `.md` 文件（或跑 `pnpm new-post`），文件名会成为网址（`my-post.md` → `/posts/my-post/`）：

```yaml
---
title: 文章标题
published: 2026-09-12       # 必填，发布日期
updated: 2026-09-20         # 可选，填了会显示「修订于」
description: 一句话摘要，显示在列表卡片并用于 SEO
category: 技术               # 自由填写，会在分类页自动出现
tags: [Astro, 建站]          # 自由填写
draft: false                # true 时只在本地可见，不进构建产物
pinned: false               # true 时会显示在列表前面的精选位
image: ""                   # 可选，卡片封面图（放 public/ 下，如 /images/cover.png）
---

正文从这里开始……
```

保存后首页、文章列表、归档、分类页、标签页、RSS、搜索索引**全部自动更新**，不需要改任何代码。

### 加一个项目

在 `src/content/projects/` 下新建 `.md` 文件：

```yaml
---
title: "项目名"
published: 2026-08-01
draft: false
order: 1                    # 越大越靠前
description: "卡片上的一句话介绍"
image: ""                   # 可选封面
tags: ["Python", "Astro"]
link:
  - label: "源码仓库"
    icon: "fa7-brands:github"
    value: "https://github.com/..."
status: "developing"        # planning / developing / published / archived
---
正文写项目详情，就是详情页的内容。
```

### 配置在哪

日常要改的东西集中在 `src/config/`：

| 想改什么 | 改哪个文件 |
| --- | --- |
| 站点名、副标题、描述、关键词、主题色相、页面宽度、导航栏样式、分页条数 | `config/siteConfig.ts` |
| 导航栏菜单项与顺序 | `config/navBarConfig.ts` |
| 侧栏显示哪些卡片、左右位置、移动端底部卡片 | `config/sidebarConfig.ts` |
| 头像、昵称、签名、社交链接 | `config/profileConfig.ts` |
| 页脚 | `config/FooterConfig.html` |
| 版权协议 | `config/licenseConfig.ts` |
| 代码块主题与插件 | `config/expressiveCodeConfig.ts` |
| 界面文案（中文） | `i18n/languages/zh_CN.ts` |

已关闭但保留配置文件的模块（想要就在对应文件里打开，再恢复相应的页面文件）：评论 `commentConfig.ts`、公告 `announcementConfig.ts`、背景壁纸 `backgroundWallpaper.ts`、背景特效 `effectsConfig.ts`、音乐 `musicConfig.ts`、看板娘 `pioConfig.ts`、相册 `galleryConfig.ts`、友链 `friendsConfig.ts`、打赏 `sponsorConfig.ts`、统计 `analyticsConfig.ts`。

### 换主题色

改 `src/config/siteConfig.ts` 里的 `themeColor.hue`（0–360）：

| 色相 | 效果 |
| --- | --- |
| 250 | 蓝紫（默认） |
| 200 | 青蓝 |
| 165 | 青绿 |
| 30 | 暖橙 |
| 345 | 玫红 |

访客也可以用导航栏上的调色板按钮自己调，值存在各自浏览器的 localStorage 里，不影响其他人。

## 部署

推送到 `main` 即自动部署（`.github/workflows/deploy.yml`）。工作流用 `actions/configure-pages` 读出仓库对应的站点地址与子路径，注入 `SITE_URL` / `BASE_PATH` 两个环境变量，所以：

- 仓库名形如 `你的用户名.github.io` → `base=/`
- 普通仓库（如 `xyavid-blog`）→ `base=/仓库名`
- 配置了自定义域名 → `base=/`

先在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**，之后推送即可。

> `astro.config.mjs` 的 `base` 与 `siteConfig.site_url` 都以环境变量为准，本地默认按 `https://xyavid.github.io` + `/xyavid-blog` 走。子路径部署时站内链接全部经 `url()` 拼 `BASE_URL`，不会 404。

## 与原自建版本的差异

这次改造把主题换成了 Firefly 基底，内容与路由保持不变，工程能力保留：

- **内容**：4 篇文章（1 篇草稿仍在构建时排除）、3 个项目、关于页，正文一字未改；
  项目 frontmatter 从 `name/tagline/stack/startDate/links` 映射到 Firefly 的
  `title/description/tags/published/link`，原来的 `tagline` 保留为正文首段以免丢失。
- **路由**：`/posts/`、`/posts/<slug>/`、`/archive/`、`/categories/`、`/categories/<分类>/`、
  `/tags/`、`/tags/<标签>/`、`/projects/`、`/projects/<slug>/`、`/about/`、`/search/`、
  `/rss.xml`、`/robots.txt` 全部保留。
  唯一变化：分页从 `/posts/page/2/` 变成 `/posts/2/`（Firefly 的分页约定，首页 `/2/` 同理）。
- **保留的工程能力**：Pagefind 站内搜索、`check:links` 死链自检、`new-post` 脚手架、
  RSS + Atom、sitemap（改成路由白名单，避免收录已关闭的占位页）、子路径部署、GitHub Actions 工作流。
- **移除的重依赖**：Mermaid / PlantUML 图表、OG 图片生成（`takumi-js`）、Cloudflare 适配器、
  字体子集化与 LQIP 等 8 个构建脚本，以及 `public/` 里 15MB 的 Live2D 模型等未使用素材
  （`public/` 从 17MB 降到 1 个文件）。
