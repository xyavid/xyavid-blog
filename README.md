# xyavid blog

个人博客：写文章、展示项目。基于 Astro 的纯静态站点，**没有数据库、没有后台、没有服务端**——内容都是仓库里的 Markdown 文件，`npm run build` 之后是一堆静态 HTML。

## 技术栈

| 用途 | 方案 |
| --- | --- |
| 框架 | Astro 7（默认零客户端 JS，只有搜索与主题切换有少量脚本） |
| 内容 | Content Collections + zod 校验（字段写错在构建时就报错） |
| 样式 | Tailwind CSS v4（`@tailwindcss/vite`，CSS-first 配置） |
| 代码高亮 | Shiki，构建期渲染，明暗两套主题 |
| 站内搜索 | Pagefind，构建后对 `dist/` 生成索引 |
| 订阅/收录 | `@astrojs/rss`、`@astrojs/sitemap` |
| 部署 | GitHub Pages（GitHub Actions 构建） |

## 快速开始

需要 Node ≥ 22.12（`node -v` 检查）。**不需要 npm 账号**，`npm install` 从公开源拉包不会要求登录。

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # 生成 dist/，随后自动建搜索索引
npm run preview    # 本地预览构建产物（搜索只有在这一步才可用）
npm run check:links # 检查 dist/ 里有没有死链
```

## 目录结构

```text
site.config.mjs            # 部署地址与子路径（部署前唯一必须改的文件）
astro.config.mjs           # Astro 配置：主题色变量、Shiki 主题、sitemap
src/
├─ config.ts               # 站点名、导航、社交链接、分类、主题色相
├─ content.config.ts       # 文章/项目/关于 的字段定义（zod schema）
├─ content/
│  ├─ posts/*.md           # 文章：一个文件一篇，文件名就是 URL 里的 slug
│  ├─ projects/*.md        # 项目：一个文件一个
│  └─ about.md             # 「关于我」页面的正文
├─ layouts/BaseLayout.astro
├─ components/             # 页头、页脚、卡片、分页、目录、图标等
├─ pages/                  # 路由：首页、文章、项目、归档、分类、标签、关于、搜索
├─ styles/global.css       # 设计变量（配色、字体、留白）与正文排版
└─ utils/                  # 内容查询与链接拼接
scripts/
├─ build-search.mjs        # 构建后跑 Pagefind
└─ check-links.mjs         # 死链自检
.github/workflows/deploy.yml  # 推送到 main 后自动部署到 GitHub Pages
```

## 日常使用

### 写一篇新文章

在 `src/content/posts/` 下新建一个 `.md` 文件，文件名会成为网址（如 `my-post.md` → `/posts/my-post/`），然后写 frontmatter：

```yaml
---
title: 文章标题
description: 一句话摘要，显示在列表页并用于 SEO，建议 40-120 字
pubDate: 2026-09-12
updatedDate: 2026-09-20   # 可选，填了会显示「修订于」
category: 技术             # 只能填 src/config.ts 里 CATEGORIES 中的值
tags: [Astro, 建站]        # 自由填写，建议 1-4 个
draft: false              # true 时只在本地可见，不进构建产物
featured: false           # true 时有资格进首页精选
---

正文从这里开始……
```

保存后首页、文章列表、归档、分类页、标签页、RSS、搜索索引**全部自动更新**，不需要改任何代码。

### 加一个项目

在 `src/content/projects/` 下新建 `.md` 文件：

```yaml
---
name: 项目名
tagline: 一句话介绍，显示在卡片上
description: 稍长一点的描述，用于列表页与 SEO
stack: [TypeScript, Node.js]
status: active            # active 进行中 / completed 已完成 / archived 已归档
startDate: 2026-03        # 格式为 2026 或 2026-03
endDate: 2026-05          # 可选，不填显示「至今」
links:
  repo: https://github.com/you/repo
  demo: https://example.com        # 两个都可不填
cover: /images/projects/x.png      # 可选，放 public/ 下；不填则显示色块占位
featured: true            # 进首页精选
order: 1                  # 列表排序，数字小的在前
---

正文写详细介绍，支持完整的 Markdown。
```

### 改站点信息

日常要改的东西集中在 `src/config.ts`：

| 字段 | 作用 |
| --- | --- |
| `SITE.title` | 站点名，显示在页头与浏览器标签 |
| `SITE.description` | 一句话副标题 |
| `SITE.longDescription` | 完整描述，用于 SEO 与 RSS |
| `SITE.author` | 作者名 |
| `SITE.themeHue` | **整站强调色相，0-360 一个数字换色**（250 蓝紫 / 200 青蓝 / 160 青绿 / 30 暖橙） |
| `NAV` | 顶部导航，增删条目即可 |
| `SOCIAL` | 页脚与关于页的社交链接 |
| `CATEGORIES` | 固定分类枚举，增删分类后分类页自动生成 |
| `HOME_LIMITS` | 首页展示的精选项目数与最新文章数 |
| `POSTS_PER_PAGE` | 文章列表每页条数 |

「关于我」的正文在 `src/content/about.md`。

> 改主题色时记得同步 `public/favicon.svg` 里的填充色：SVG 图标读不到 CSS 变量。

## 部署到 GitHub Pages

**前置：不需要 npm 账号。** 需要的是一个 GitHub 仓库，以及把 Pages 的发布来源设为 GitHub Actions。

1. 把项目推到一个 GitHub 仓库（`git init` → `git add .` → `git commit` → `git remote add origin …` → `git push -u origin main`）。
2. 进仓库 **Settings → Pages**，把 **Source** 改成 **GitHub Actions**。
3. 推送到 `main` 分支即触发 `.github/workflows/deploy.yml`，构建完成后站点地址会显示在 Actions 的运行结果里。

工作流通过 `actions/configure-pages` 自动取得站点地址与子路径，再以环境变量传给构建，所以**不需要手改 `site.config.mjs`**，两种情况都能正确处理：

- 用户主页仓库（仓库名形如 `你的用户名.github.io`）→ 站点在 `https://用户名.github.io`，无子路径；
- 普通仓库（如 `blog`）→ 站点在 `https://用户名.github.io/blog`，所有内部链接会自动带上 `/blog` 前缀。

### 本地模拟子路径部署

```bash
SITE_URL=https://yourname.github.io BASE_PATH=/blog npm run build
npm run check:links      # 会按 BASE_PATH 校验链接前缀
```

### 换自定义域名

在仓库 Settings → Pages 里填上域名并配置 DNS，工作流会据此把 `SITE_URL` 换成新域名、`BASE_PATH` 变回 `/`；同时在 `public/` 下放一个内容为域名的 `CNAME` 文件即可。

## 内容规则与机制

- **文章文件平铺**：`src/content/posts/` 下不再分子目录（`glob` 只匹配 `*.md`），这样 URL 与文件一一对应。
- **草稿**：`draft: true` 的文章在构建时被排除，不会出现在任何列表、归档、RSS 与搜索索引里，但 `npm run dev` 时可见。
- **分类是固定枚举**：写错会在构建时报错，避免出现「前端 / 前端开发 / Frontend」这样碎掉的归档。空分类不生成页面，也不会出现在分类索引里。
- **空值保护**：`title`、`description` 等必填字段缺失时构建直接失败并指出文件位置。
- **搜索**：只索引文章详情、项目详情与关于页（`BaseLayout` 的 `index` 属性控制），列表页不进索引，避免搜出一堆重复的标题集合。索引在 `npm run build` 阶段生成，所以开发模式下搜索页会提示先构建。
- **Tailwind 内容探测已排除 `docs/` 与 `.shots/`**：`global.css` 顶部有两行 `@source not`。不加这两行，调研笔记里的长文本会被当成类名，CSS 会从 22 KB 膨胀到 249 KB。以后新增「不是站点源码但放在仓库里」的目录，记得一起排除。

## 以后要加数学公式

当前没有公式需求，所以没装 KaTeX。需要时按 Astro 7 的正确写法接（注意：**Astro 7 默认的 Markdown 处理器是 Sätteri，它没有 remark-math 的对应实现，必须先切回 unified 处理器**）：

```bash
npm i @astrojs/markdown-remark remark-math rehype-katex katex
```

```js
// astro.config.mjs
import { unified } from "@astrojs/markdown-remark";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default defineConfig({
  markdown: {
    processor: unified({
      // 正文里会写金额时关掉单美元行内公式，避免 $100 被当成公式
      remarkPlugins: [[remarkMath, { singleDollarTextMath: false }]],
      rehypePlugins: [[rehypeKatex, { strict: false }]],
    }),
  },
});
```

```astro
---
// 在 BaseLayout.astro 顶部加一行，KaTeX 的 CSS 必须本地引入，不要用 CDN
import "katex/dist/katex.min.css";
---
```

`src/styles/global.css` 里已经有 `.katex-display { overflow-x: auto }`，长公式不会撑破布局。

## 交付验收对照

| 项目 | 验证方式 | 结果 |
| --- | --- | --- |
| 构建无错误无警告 | `npm run build` | ✅ 22 个页面，0 警告 |
| 站内无死链 | `npm run check:links` | ✅ 413 条链接全部可达 |
| 分类/标签/归档/搜索/RSS 自动更新 | 新增 Markdown 后重建 | ✅ |
| 草稿不进产物 | `grep -r draft-example dist/` | ✅ 无结果 |
| 响应式 375 / 768 / 1280 | 无头浏览器实测横向溢出 | ✅ 10 个页面 × 3 档全部通过 |
| 暗色模式 | 点击切换 + 跨页保持 | ✅ 通过，localStorage 持久化 |
| 移动端导航 | 375px 点击汉堡按钮 | ✅ 面板展开，aria-expanded 同步 |
| 站内搜索 | 在搜索页输入关键词 | ✅ 命中结果，链接可跳转 |
| 代码高亮 | 文章页 `pre.astro-code` | ✅ 构建期着色，明暗双主题 |
| 中文阅读排版 | 正文行高比 | ✅ 1.80 |
| 浏览器行为总检 | 41 项自动化检查（见下） | ✅ 41/41 通过，无脚本报错、无 4xx/5xx |
| Lighthouse（首页，移动端） | 无头 Chromium 实测 | 无障碍 100 / SEO 100 / 性能 94 / 最佳实践 82\* |
| CSS 体积 | `dist/_astro/*.css` | ✅ 21.8 KB（gzip 后 5.8 KB） |

\* 最佳实践 82 与性能 94 的失分来自**本机环境**，不是站点本身：测试用的浏览器被宿主机的卡巴斯基扩展注入了 3.7 MB 的 `content_main.js` 和多个指向 `me.kis.v2.scr.kaspersky-labs.com` 的阻塞请求（单个请求延迟 2.1 秒），Lighthouse 的 `is-on-https` 与 `bootup-time` 因此全部记在这些外部 URL 上。站点自己的指标是：服务端响应 20 ms、总阻塞时间 0 ms、累积布局偏移 0。部署到 GitHub Pages 后不会有这些注入。

验证手法：用 Chrome DevTools 协议驱动无头浏览器，逐页读取真实布局与运行时状态（`scrollWidth` 对比 `innerWidth`、`localStorage`、`getComputedStyle`、Pagefind 查询结果），而不是只看构建日志。

## 需要你替换的占位内容

- `site.config.mjs` —— 部署地址（用 GitHub Actions 时可不改）
- `src/config.ts` —— 站点名、描述、作者、社交链接、主题色相
- `src/content/about.md` —— 自我介绍
- `src/content/posts/` 下 4 篇文章 —— 示例文章，可删可改（其中 `draft-example.md` 是草稿示例）
- `public/favicon.svg` —— 站点图标
