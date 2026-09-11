# 静态站点生成器（SSG）的 Markdown/LaTeX 实现与视觉风格调研

> **调研日期（全篇数据访问日期）：2026-09-11（UTC）**
> 工作目录：`D:\xyavid blog`。所有 star 数、版本号、release/commit 时间均为当日实测。
> 无法核实的信息一律显式标注「**未核实**」，不做推测性断言。

## 0. 调研范围与方法

覆盖 9 个方案：

1. **Hexo**（Node.js）
2. **Hugo**（Go）
3. **Astro**（含 Fuwari / Firefly / AstroPaper / Astro Theme Typography / Retypeset 五大主题）
4. **Jekyll**（含 Chirpy、al-folio）
5. **Valaxy**（Vue 系，中文圈）
6. **Eleventy (11ty)**
7. **Zola**（Rust）
8. **VitePress**
9. **Docusaurus / MkDocs Material**（文档型，作为对照）

### 0.1 取数方法（可复现）

| 数据类型 | 取数方式 | 备注 |
| --- | --- | --- |
| star 数 | `curl https://github.com/OWNER/REPO`，解析 `id="repo-stars-counter-star"` 的 `title` 属性 | 精确值（HTML 里的 `title` 为完整数字） |
| 最近 release / commit | `https://github.com/OWNER/REPO/releases.atom`、`.../commits.atom` | 不消耗 GitHub API 配额 |
| 版本与发布时间 | `https://registry.npmjs.org/<pkg>`（`dist-tags.latest` + `time`） | npm 官方 registry |
| Ruby gem 版本 | `https://rubygems.org/api/v1/gems/<gem>.json` | RubyGems API |
| PyPI 版本 | `https://pypi.org/pypi/<pkg>/json` | PyPI JSON API |
| 官方文档原文 | 直接抓取官方文档页 / `raw.githubusercontent.com` 源码 | 优先一手来源 |
| 源码级事实（如 Zola 无数学支持） | 读取仓库源码与 `Cargo.toml` / `package.json` | 比二手描述可信 |

> ⚠️ **本次调研全程未使用 `api.github.com`**：未认证配额（60 次/小时，按 IP 共享）在开工时已耗尽。星标与时间线改由 GitHub HTML 页面与 Atom feed 获取，结论等价。
> 另：本会话的 `web_search` 端点故障不可用，检索改由直接抓取官方域名与 GitHub 页面完成。

### 0.2 目录

- **第一部分** Hexo / Hugo / Zola（核心三方案）
- **第二部分** LaTeX 数学公式的通用技术事实（KaTeX vs MathJax、构建期 vs 客户端、五个通用坑）
- **第三部分** Astro 生态（本体 + 五大主题）
- **第四部分** Jekyll（Chirpy / al-folio）与 Valaxy
- **第五部分** Eleventy / VitePress / Docusaurus / MkDocs Material（文档型对照）
- **第六部分** 横向总表与选型建议

---

---

# 第一部分：Hexo / Hugo / Zola（核心三方案）

> 数据访问日期：2026-09-11。star 数与 release/commit 时间均由 GitHub 页面与 Atom feed 现场抓取（https://github.com/OWNER/REPO ，https://github.com/OWNER/REPO/releases.atom ，https://github.com/OWNER/REPO/commits.atom ）。

---

## 1. Hexo（Node.js）

### 1.1 技术栈与部署

| 项目 | 结论 | 来源 |
| --- | --- | --- |
| 仓库 | hexojs/hexo，**41,763 star** | https://github.com/hexojs/hexo |
| 最近 release | **v8.1.2（2026-05-06）** | https://github.com/hexojs/hexo/releases |
| 最近 commit | 2026-08-29 | https://github.com/hexojs/hexo/commits/master |
| 语言 / 运行时 | Node.js，**`node >= 20.19.0`** | npm registry `hexo@8.1.2` 的 `engines` 字段：https://registry.npmjs.org/hexo |
| 模板引擎 | **Nunjucks**（hexo 依赖 `nunjucks ^3.2.4`）；主题层普遍用 EJS | https://registry.npmjs.org/hexo |
| 输出形态 | 纯静态 HTML + 主题自带的客户端 JS（搜索、Pjax、评论等） | https://hexo.io/docs/ |

安装到跑起来（官方）：

```bash
npm install -g hexo-cli
hexo init <folder>
cd <folder>
npm install
hexo server     # 或 hexo s
```

来源：https://hexo.io/docs/setup

部署方式：

- **GitHub Pages / GitLab Pages 是官方文档覆盖的两种**：https://hexo.io/docs/github-pages 、https://hexo.io/docs/gitlab-pages
- 一键部署（`hexo deploy` + `hexo-deployer-git`）：https://hexo.io/docs/one-command-deployment
- Vercel / Netlify / Cloudflare Pages：**Hexo 官方文档没有专门页面**（截至 2026-09-11 的 sitemap 仅有 github-pages / gitlab-pages / one-command-deployment）。实践中可行（三者都能跑 `hexo generate`），但属于平台侧通用能力，**官方未背书**。

### 1.2 Markdown 渲染管线

- **默认渲染器是 `hexo-renderer-marked`**（基于 **marked**），`hexo init` 生成的 `package.json` 默认包含它。来源：https://hexo.io/docs/setup（模板 `package.json` 中 `"hexo-renderer-marked": "^6.0.0"`）
- npm 上 `hexo-renderer-marked` 最新 **7.0.1（2025-03-06）**，依赖 `marked ^15.0.4`。来源：https://www.npmjs.com/package/hexo-renderer-marked
- 替代渲染器 **`hexo-renderer-markdown-it`** 最新 **7.1.1（2024-01-11）**。来源：https://www.npmjs.com/package/hexo-renderer-markdown-it

> **这是 Hexo 数学公式问题的根源**：marked 会先把 `_`、`*`、`\\` 等当成 Markdown 语法吃掉，导致复杂公式解析错误。hexo-math 的作者在 README 中明确写道：hexo-math 采用 tag plugin 方式，正是因为 LaTeX 与 **marked（Hexo 默认渲染器）存在不兼容**。来源：https://github.com/hexojs/hexo-math

### 1.3 LaTeX 数学公式的具体实现

Hexo 有 **四条互斥/半互斥的路线**，务必只选一条。

#### 路线 A：`hexo-math`（官方组织插件，构建期渲染，tag 语法）

- 包名：**`hexo-math`**，最新 **5.0.0（2024-04-03）**。来源：https://www.npmjs.com/package/hexo-math
- 仓库：https://github.com/hexojs/hexo-math
- 安装：`npm i hexo-math --save`（要求 Hexo 5+）
- **构建期（server-side）渲染**，README 原文：“Equations are rendered in Hexo (server-side), so browser-side javascript library is not needed and should be removed.”
- 同时支持 **KaTeX** 与 **MathJax**，通过 tag 调用：
  - `{% katex %} ... {% endkatex %}`
  - `{% mathjax %} ... {% endmathjax %}`
- 配置位置：站点 `_config.yml` 的 `math` 段：

```yaml
# _config.yml
math:
  katex:
    css: 'https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css'
    options:
      throwOnError: false
  mathjax:
    css: 'https://cdn.jsdelivr.net/npm/hexo-math@4.0.0/dist/style.css'
    options:
      conversion:
        display: false
      tex:
      svg:
```

- 支持逐文章覆盖，通过 front-matter：

```yaml
---
katex: false
mathjax: false
---
```

- 优先级：tag 参数 > front-matter > 全局 `_config.yml`。
- **关键限制**：只能用 `{% %}` tag 写公式，**不能直接写 `$...$` 行内公式**。这正是为了绕开 marked 的冲突。

来源：https://github.com/hexojs/hexo-math

#### 路线 B：`hexo-filter-mathjax`（构建期 MathJax，支持真正的行内 `$...$`）

- 包名：**`hexo-filter-mathjax`**，最新 **0.11.1（2026-07-31）**，描述为 “Server side MathJax renderer plugin for Hexo.”。来源：https://www.npmjs.com/package/hexo-filter-mathjax
- 仓库：https://github.com/next-theme/hexo-filter-mathjax
- **这是 Hexo 生态里最接近「像 LaTeX 一样写行内公式」的方案**：无需 tag，正文里直接 `$...$` / `$$...$$` 即可，构建期转成 SVG/CHTML。
- 与 NexT 主题深度集成：NexT 的 `_config.yml` 直接引用它并给出配置：

```yaml
# NExT _config.yml
math:
  every_page: false   # false = 仅 front-matter 含 mathjax: true 的页面加载
  mathjax:
    enable: false
    tags: none        # none | ams | all —— 公式编号
    display_overflow: scroll
  katex:
    enable: false
    copy_tex: false
```

来源：https://github.com/next-theme/hexo-theme-next/blob/master/_config.yml

#### 路线 C：`hexo-renderer-markdown-it` + `@traptitech/markdown-it-katex`（Fluid 官方推荐）

Fluid 主题文档给出**可直接复制的三步操作**（原文）：

> 2. 更换 Markdown 渲染器：由于 Hexo 默认的 Markdown 渲染器不支持复杂公式，所以需要更换渲染器（mathjax 可选择性更换）。

**KaTeX 路线**：

```bash
npm uninstall hexo-renderer-marked --save
npm install hexo-renderer-markdown-it --save
npm install @traptitech/markdown-it-katex --save
```

站点配置 `_config.yml` 增加：

```yaml
markdown:
  plugins:
    - "@traptitech/markdown-it-katex"
```

**MathJax 路线**（需要本机装 Pandoc）：

```bash
npm uninstall hexo-renderer-marked --save
npm install hexo-renderer-pandoc --save
```

主题配置 `_config.fluid.yml`：

```yaml
post:
  math:
    enable: true
    specific: false        # true = 仅 front-matter math: true 的文章才转换，提速
    engine: mathjax        # mathjax | katex
```

书写格式：`$$ E=mc^2 $$`（行内亦可）。

**Fluid 官方给出的坑（原文 WARNING）**：

> 如果公式没有被正确渲染，请仔细检查是否符合上面三步操作。**不可以同时安装多个渲染插件**，包括 hexo-math 或者 hexo-katex 这类插件，请注意检查 package.json。如果更换公式引擎，对应渲染器也要一并更换。不同的渲染器，可能会导致一些 Markdown 语法不支持，或者渲染样式有细微差异。自定义页面默认不加载渲染，如需使用，需在 front-matter 中指定 math: true

来源：https://fluid.ist/docs/guide/（章节「LaTeX 数学公式」）

#### 路线 D：Hexo 主题内置开关（不装插件，但依赖渲染器）

| 主题 | 配置位置 | 关键配置项 | star |
| --- | --- | --- | --- |
| **Butterfly** | `_config.butterfly.yml` | `math.use: mathjax\|katex`、`math.per_page`、`math.mathjax.tags: all\|ams\|none`、`math.katex.copy_tex` | 8,362 |
| **Fluid** | `_config.fluid.yml` | `post.math.enable / specific / engine` | 8,169 |
| **NexT** | `_config.next.yml` | `math.every_page`、`math.mathjax.enable/tags/display_overflow`、`math.katex.enable/copy_tex` | 2,779 |
| **Stellar** | 主题配置 | 内置标签与组件（未逐一核实数学开关） | 2,026 |

Butterfly 配置来源：https://github.com/jerryc127/hexo-theme-butterfly/blob/dev/_config.yml
Fluid 配置来源：https://github.com/fluid-dev/hexo-theme-fluid/blob/master/_config.yml
NexT 配置来源：https://github.com/next-theme/hexo-theme-next/blob/master/_config.yml

### 1.4 常见坑（Hexo）

1. **`$$` 与 Markdown 冲突**：默认 marked 渲染器会把公式里的 `_` 变成 `<em>`、把 `\\` 吃掉；hexo-math 干脆放弃 `$` 改用 `{% %}` tag（README 明说原因）。
2. **渲染器冲突**：Fluid 文档明确警告不能同时装 `hexo-math` / `hexo-katex` 与其它渲染插件，否则公式静默失效。**排查方法**：看 `package.json` 里到底装了几个 `hexo-renderer-*`。
3. **改了配置必须 `hexo clean`**：Fluid 文档反复强调 `hexo g` / `hexo s` 前先 `hexo clean`。
4. **自定义页面（page）默认不加载公式**，要在 front-matter 写 `math: true`（或对应主题的开关）。
5. **CDN 依赖**：主题默认从 CDN 拉 KaTeX CSS/MathJax JS（Fluid 默认走 `lib.baomitu.com`），国内可用性好，但离线/内网构建会失败，需改为自托管。

### 1.5 视觉风格与主题

Hexo 默认主题是 **Landscape**（`hexo-theme-landscape`），外观相当朴素，基本没人直接用于正式博客。

| 主题 | 风格 | GitHub | star | 最近 commit |
| --- | --- | --- | --- | --- |
| **Butterfly** | 卡片式、功能极全（Pjax、双栏、外挂标签、自定义 CDN），中文圈最流行 | https://github.com/jerryc127/hexo-theme-butterfly | 8,362 | 2026-08-13 |
| **Fluid** | Material Design、简洁克制、文档质量高（中英双语） | https://github.com/fluid-dev/hexo-theme-fluid | 8,169 | 2026-05-09 |
| **NexT** | 极简、经典、老牌；功能偏保守 | https://github.com/next-theme/hexo-theme-next | 2,779 | 2026-09-08 |
| **Stellar** | 「全能个人知识库」，内置海量标签与动态数据组件 | https://github.com/xaoxuu/hexo-theme-stellar | 2,026 | 2026-09-11 |

- **是否基于 Tailwind**：以上四个**都不是 Tailwind**，均使用手写 Stylus/SCSS + CSS 变量（Butterfly/Fluid 通过主题配置暴露颜色变量）。
- **提升观感的手段**：三者都支持自定义颜色（主题配置里的 `theme_color` / `color`）、字体、圆角、背景图；Butterfly 与 Stellar 提供大量「外挂标签」（提示框、卡片、时间线），能低成本做出精致排版。
- **动效**：Butterfly 的 Pjax 页面切换、Fluid 的 `nprogress` 加载条、打字机 Slogan；均可在配置里开关。
- **示例站**：Butterfly 官方示例 https://butterfly.js.org/ ；Fluid 官方文档站 https://fluid.ist/ ；NexT 官方站 https://theme-next.js.org/ ；Stellar 文档 https://xaoxuu.com/wiki/stellar/ 。

### 1.6 优缺点与适用人群

**优点**：中文生态最成熟、主题与教程最多；Node 环境门槛低于 Ruby；标签插件体系（tag plugins）做「富文本卡片」非常方便；`hexo-filter-mathjax` 能做到构建期渲染 + 行内 `$`。

**缺点**：默认 marked 渲染器与 LaTeX 天然冲突，必须换渲染器或改用 tag 语法，**配置链路长且容易踩坑**；构建速度属于中等（生成数千篇文章明显慢于 Hugo/Zola）；官方只覆盖 GitHub Pages / GitLab Pages 部署。

**适用人群**：中文写作者（首选）、混合内容技术博客（需要卡片/标签/相册）、不追求极致构建速度的个人站点。**公式密集的学术写作不推荐**——渲染链路脆弱。

---

## 2. Hugo（Go）

### 2.1 技术栈与部署

| 项目 | 结论 | 来源 |
| --- | --- | --- |
| 仓库 | gohugoio/hugo，**89,787 star** | https://github.com/gohugoio/hugo |
| 最近 release | **v0.166.0（2026-09-10）** | https://github.com/gohugoio/hugo/releases |
| 最近 commit | 2026-09-10 | https://github.com/gohugoio/hugo/commits/master |
| 语言 | Go，**编译为单个二进制**，终端用户无需 Go 环境 | https://gohugo.io/installation/ |
| 模板引擎 | Go `html/template` + 自有 shortcode 体系 | https://gohugo.io/templates/ |
| 输出形态 | 纯静态 HTML；数学可选构建期 MathML 或客户端 JS | https://gohugo.io/functions/transform/tomath/ |

**安装**：直接下载 release 预编译二进制即可（Linux/macOS/Windows 均有）。**Go 仅在「从源码构建」或「使用 Hugo Modules」时才需要**；Git 用于主题 submodule、Modules 与 CI 部署。来源：https://gohugo.io/installation/linux/

**Editions（官方表格）**：standard / deploy / extended / extended+deploy。
- `deploy` 版才有「直接部署到 Google Cloud Storage / AWS S3 / Azure Storage」的能力（v0.159.2 新增）。
- `extended` 版才有 LibSass 支持，**LibSass 已于 v0.153.0 废弃**，官方建议改用 Dart Sass（任何 edition 都能用）。

来源：https://gohugo.io/installation/linux/

**部署**（官方文档齐备）：GitHub Pages https://gohugo.io/host-and-deploy/host-on-github-pages/ 、Netlify https://gohugo.io/host-and-deploy/host-on-netlify/ 、Cloudflare https://gohugo.io/host-and-deploy/host-on-cloudflare/ 、Vercel https://gohugo.io/host-and-deploy/host-on-vercel/ 、GitLab Pages、AWS Amplify、Azure Static Web Apps、Firebase、Render、Sourcehut、Codeberg，以及 `hugo deploy` / rclone / rsync。

### 2.2 Markdown 渲染管线

- **Goldmark**（CommonMark 兼容，Go 实现），通过 `markup.goldmark` 配置。来源：https://gohugo.io/getting-started/configuration-markup/
- 关键扩展：**`passthrough`**（原样保留被定界符包裹的文本）、`renderHooks`、`typographer` 等。

### 2.3 LaTeX 数学公式：Hugo 是三者中最强的（两条官方路线）

#### 路线 A：Goldmark passthrough + 客户端 MathJax/KaTeX（官方推荐的「标准做法」）

**Step 1** 在项目配置里开启并配置 passthrough 扩展：

```yaml
markup:
  goldmark:
    extensions:
      passthrough:
        delimiters:
          block:
            - ['\[', '\]']
            - ['$$', '$$']
          inline:
            - ['\(', '\)']
        enable: true
params:
  math: true
```

- `math` 参数为 `true` 时**全站每页**都加载数学渲染；若设为 `false`，则需在 front-matter 里逐篇写：

```yaml
---
title: Math examples
params:
  math: true
---
```

**Step 2** 建 partial `layouts/_partials/math.html`（官方示例用 MathJax 4）：

```html
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@4/tex-mml-chtml.js"></script>
<script>
  MathJax = {
    tex: {
      displayMath: [['\\[', '\\]'], ['$$', '$$']],
      inlineMath: [['\\(', '\\)']]
    },
    loader: { load: ['ui/safe'] }
  };
</script>
```

**Step 3** 在 `layouts/baseof.html` 里条件引入：

```html
<head>
  {{ if .Param "math" }}
    {{ partialCached "math.html" . }}
  {{ end }}
</head>
```

**官方明示的坑（原文）**：

> The configuration above precludes the use of the `$...$` delimiter pair for inline equations. Although you can add this delimiter pair to the configuration and JavaScript, **you must double-escape the `$` symbol when used outside of math contexts** to avoid unintended formatting.

也就是说：Hugo **默认不给你 `$...$` 行内公式**，因为 `$` 在普通正文里太常见（价格、shell 变量），容易误伤。要用就得自己加进 `inline` 列表，并承担「正文里的 `$` 要写成 `$$`」的代价。行内官方推荐的定界符是 `\(...\)`。

另外官方允许**自定义定界符**，例如用 `@@`（块）/ `@`（行内）来彻底避开 `$`：

```yaml
markup:
  goldmark:
    extensions:
      passthrough:
        delimiters:
          block:
            - ['@@', '@@']
          inline:
            - ['@', '@']
```

来源（以上三张配置片段与两段坑说明均出自此页）：https://gohugo.io/content-management/mathematics/

#### 路线 B：`transform.ToMath`（Hugo 内置 KaTeX，构建期渲染，无需 JS）

- **Hugo 内嵌了 KaTeX 引擎**，不需要安装任何东西、不需要 CDN、不需要客户端 JS。官方原文：“Hugo uses an embedded instance of the KaTeX display engine to render mathematical markup to HTML. You do not need to install the KaTeX display engine.”
- 用法（注意是 `transform.ToMath`）：

```go-html-template
{{ transform.ToMath "c = \\pm\\sqrt{a^2 + b^2}" }}
```

- **默认输出 MathML**，官方称不需要任何 CSS 即可显示；追求更好观感与可访问性时用 `htmlAndMathml`（需要外部 KaTeX 样式表）：

```go-html-template
{{ $opts := dict "output" "htmlAndMathml" }}
{{ transform.ToMath "c = \\pm\\sqrt{a^2 + b^2}" $opts }}
```

- **会缓存到磁盘**（misc file cache），重复调用无额外开销。
- 支持的选项（KaTeX 选项子集）：`displayMode`、`errorColor`（默认 `#cc0000`）、`fleqn`、**`macros`**（自定义宏映射，默认 `{}`）、`minRuleThickness`（默认 `0.04`）、`output`（`html` / `mathml` / `htmlAndMathml`）。
- **宏（`\newcommand`）官方支持**：

```go-html-template
{{ $macros := dict
  "\\addBar" "\\bar{#1}"
  "\\bold" "\\mathbf{#1}"
}}
{{ $opts := dict "macros" $macros }}
{{ transform .ToMath "\\addBar{y} + \\bold{H}" $opts }}
```

来源：https://gohugo.io/functions/transform/tomath/

> **结论**：Hugo 是本次调研中**唯一同时提供「框架级构建期 KaTeX」与「官方 passthrough 客户端渲染指南」**的 SSG。公式密集 + 需要无 JS/可访问性 → 选 `transform.ToMath`；需要完整 MathJax 宏包生态（如 `\\require{}`、AMS 全量、`\\tag{}`） → 选 passthrough + MathJax。

### 2.4 视觉风格与主题

| 主题 | 风格 | GitHub | star | 最近 commit |
| --- | --- | --- | --- | --- |
| **PaperMod** | 极简、干净、响应式；**无内置数学开关**（README 未提及 math），靠 Hugo 的 passthrough/ToMath | https://github.com/adityatelange/hugo-PaperMod | 13,902 | 2026-08-02 |
| **Stack** | 卡片式、图片导向、适合摄影/随笔；**内置 KaTeX** | https://github.com/CaiJimmy/hugo-theme-stack | 6,468 | 2026-05-25 |
| **LoveIt** | 简洁优雅、功能丰富、中文友好 | https://github.com/dillonzq/LoveIt | 3,868 | **2026-03-11（维护放缓）** |
| **Blowfish** | Tailwind 系、高度可定制、文档极详尽 | https://github.com/nunocoracao/blowfish | 2,889 | 2026-09-03 |
| **FixIt** | LoveIt 的精神续作，持续维护 | https://github.com/hugo-fixit/FixIt | 1,118 | 2026-09-10 |

**Stack 的数学配置**（官方文档字段说明）：

```toml
[article]
    math = false   # Enable math support by KaTeX. Can be overridden by front matter field math.
```

来源：https://stack.jimmycai.com/config/article 与 https://github.com/CaiJimmy/hugo-theme-stack/blob/master/config/_default/params.toml

- **Tailwind 情况**：**Blowfish 是 Tailwind CSS**；PaperMod / Stack / LoveIt / FixIt 为手写 SCSS + CSS 变量（PaperMod 通过 `assets/css/extended/` 覆盖变量）。
- **提升观感的手段**：PaperMod 支持自定义字体、配色变量、封面图、`homeInfoParams` 首页简介；Blowfish 提供主题色切换、多语言、多作者、极丰富的 shortcode。
- **示例站**：PaperMod demo https://adityatelange.github.io/hugo-PaperMod/ ；Stack demo https://demo.stack.jimmycai.com/ ；Blowfish https://blowfish.page/ ；FixIt https://fixit.lruihao.cn/ 。

### 2.5 优缺点与适用人群

**优点**：构建速度最快（单二进制、并行渲染）；**数学公式方案最完善且完全官方文档化**；部署平台覆盖最全；无运行时依赖，CI 里一个二进制搞定。

**缺点**：Go 模板语法（`html/template`）学习曲线陡峭，比 Liquid/Nunjucks/JSX 都别扭；主题定制要改模板而非配置；生态偏英文。

**适用人群**：**公式密集的技术/学术博客（强烈推荐）**、追求构建速度与部署自由度的人、愿意学一点 Go 模板的开发者。**不适合**只想改配置不动模板的纯记录型用户。

---

## 3. Zola（Rust）

### 3.1 技术栈与部署

| 项目 | 结论 | 来源 |
| --- | --- | --- |
| 仓库 | getzola/zola，**17,419 star** | https://github.com/getzola/zola |
| 最近 release | **v0.23.4（2026-08-20）** | https://github.com/getzola/zola/releases |
| 最近 commit | 2026-09-09 | https://github.com/getzola/zola/commits/master |
| 语言 | Rust，**单一静态二进制，无运行时依赖** | https://www.getzola.org/documentation/getting-started/installation/ |
| 模板引擎 | **Tera**（Jinja2 风格，比 Go 模板友好） | https://www.getzola.org/documentation/templates/overview/ |
| Markdown 解析器 | **pulldown-cmark** | https://github.com/getzola/zola/blob/master/components/markdown/Cargo.toml |

**安装**（官方给了各平台命令）：macOS `brew install zola`，Arch `pacman -S zola`，Windows 可从 GitHub release 下载预编译包，也可用 `cargo install`。来源：https://www.getzola.org/documentation/getting-started/installation/

**部署**（官方文档覆盖极广）：GitHub Pages、GitLab Pages、Netlify、Vercel、Cloudflare Pages、Cloudflare Workers、Codeberg Pages、Sourcehut Pages、Azure Static Web Apps、Fly.io、AWS S3、Edgio、Zeabur、Docker 镜像。来源：https://www.getzola.org/documentation/deployment/overview/

### 3.2 Markdown 渲染管线

**pulldown-cmark**（Rust 生态标准 CommonMark 解析器）。证据：`components/markdown/Cargo.toml` 的依赖列表中只有 `pulldown-cmark`、`pulldown-cmark-escape`、`tera`、`giallo`（语法高亮）等，**没有任何数学相关依赖**。来源：https://github.com/getzola/zola/blob/master/components/markdown/Cargo.toml

### 3.3 LaTeX 数学公式：**Zola 没有内置数学支持**（重要结论）

这是一个**需要明确纠正的常见误解**。核实过程与证据：

1. **源码层面没有数学处理**：`components/markdown/src/markdown.rs`（32,733 字节）中检索 `math` / `katex` / `dollar` **零命中**。来源：https://github.com/getzola/zola/blob/master/components/markdown/src/markdown.rs
2. **依赖层面没有数学库**：见上条 Cargo.toml，无 katex/mathjax crate。
3. **文档层面没有数学页**：`https://www.getzola.org/sitemap.xml` 列出的 documentation 页面中**不存在任何 math/mathjax 页面**（content 下仅有 overview / section / page / linking / multilingual / syntax-highlighting / table-of-contents / taxonomies / search / sass / image-processing）。直接访问 `/documentation/content/mathematical-formulas/`、`/documentation/content/mathjax/`、`/documentation/content/math/` 均返回 **404**。来源：https://www.getzola.org/sitemap.xml

**因此 Zola 的数学公式必须自己动手**，有两条实际路径：

**路径 1：手动引入 CDN 脚本**（最简单）。在模板 `templates/base.html` 的 `<head>` 里加载 KaTeX 或 MathJax，并按主题需要决定是否开启 `[markdown]` 的 raw HTML 透传。**注意**：因为 Zola 没有 passthrough 机制，`_`、`*` 等仍会被 pulldown-cmark 当作强调处理，**行内 `$...$` 中的下划线有较大概率被吃掉**——这是 Zola 做数学最典型的坑。实践上建议：

- 块级公式用 `$$ ... $$`（独立段落，风险较小）；
- 行内公式尽量用 `\\( ... \\)` 定界符，并避免在行内使用 `_` 下标（改写为 `\_\_` 或改到块级）；
- 或使用转义 `\_`。

**路径 2：用已内置 KaTeX 的主题**。例如 **tabi** 主题即内置 KaTeX 支持（README 勾选项：“KaTeX support for mathematical notation”，并链到 https://katex.org/ ）。来源：https://github.com/welpo/tabi

| 主题 | GitHub | star | 最近 commit |
| --- | --- | --- | --- |
| **tabi** | https://github.com/welpo/tabi | 264 | 2026-09-10 |

> 注：Zola 官方主题库 https://www.getzola.org/themes/ 中的主题数量与质量均明显少于 Hugo/Hexo；**数学支持取决于主题作者是否顺手加了 KaTeX**，没有框架级保障。

**「未核实」项**：Zola 官方文档、源码中均未给出数学公式的推荐做法，上文的「路径 1」是根据 pulldown-cmark 行为推导的**实践建议，非官方结论**，请读者自行验证。以下内容我未能找到一手来源，标注为未核实：Zola 处理 `$...$` 时的具体转义行为细节。

### 3.4 优缺点与适用人群

**优点**：单一二进制、构建极快、Tera 模板比 Go 模板友好、部署平台覆盖极广、无 Node/Ruby/Go 运行时负担；配置即约定（`config.toml` + `content/`），上手快。

**缺点**：**数学公式无内置支持，是本调研 9 个方案里数学体验最差的之一**；主题生态小、中文资料少；Tera 宏与 shortcode 生态远不如 Hugo。

**适用人群**：追求「一个二进制搞定一切」的极简主义者、纯记录型/文档型站点、Rust 爱好者。**公式密集的学术写作不推荐**，除非愿意自己维护模板里的 MathJax 引入与转义规则。

---

## 附：三方案横向速查

| 维度 | Hexo | Hugo | Zola |
| --- | --- | --- | --- |
| 运行时依赖 | Node ≥ 20.19 | 无（单二进制） | 无（单二进制） |
| Markdown 解析器 | marked（默认）/ markdown-it / pandoc | Goldmark | pulldown-cmark |
| 公式渲染时机 | 构建期（hexo-math、hexo-filter-mathjax）或客户端 | **两者皆可**：构建期 `transform.ToMath`（内嵌 KaTeX）/ 客户端 MathJax | **仅客户端**（自己引 CDN） |
| 行内 `$...$` | 路线 B/D 支持；路线 A 不支持 | 默认不支持（需自定义 delimiter + 双写 `$`） | 不保证（pull-cmark 会吃 `_`） |
| 复杂宏 / `\newcommand` | 取决于引擎；hexo-math 支持 KaTeX/MathJax 选项 | **官方支持 `macros` map** | 取决于所选 MathJax 配置 |
| 官方数学文档 | 无专页（靠插件 README 与主题文档） | **有完整专页** | **无** |
| 部署平台官方覆盖 | GH Pages / GitLab Pages | 全平台 | 全平台 |

> 本文由多个子代理分工核实后合并：核心三方案（Hexo/Hugo/Zola）与通用 LaTeX 事实、Astro 生态、Jekyll+Valaxy、文档型对照，各自独立查证并附来源。

---

# 第二部分：LaTeX 数学公式的通用技术事实（跨方案复用）

> 访问日期：2026-09-11。这一节与具体 SSG 无关，是判断「某方案能不能扛住公式密集写作」的底层依据。

## 1. KaTeX vs MathJax：能力边界（有官方证据）

| 能力 | KaTeX | MathJax 4.0 |
| --- | --- | --- |
| 渲染速度 | 极快，可构建期渲染 | 较慢，通常客户端渲染 |
| 构建期渲染 | ✅ 多数 SSG 用 Node 版 KaTeX 在构建时产出 HTML/MathML | ⚠️ 需 Node/jsdom 适配（MathJax 官方有 node 组件） |
| `\label` / `\ref` / `\eqref` 交叉引用 | ❌ **Not supported**（官方 support table 逐条列出） | ✅ 支持，配合 `tags: 'ams'` 自动编号 |
| 编号体系 | ⚠️ 支持 `\begin{align}`/`{gather}`/`{equation}` 等环境与 `\tag{}`；官方说明 `equation*`、`gather*`、`align*`、`alignat*`「have no automatic numbering」；**无跨表达式引用能力** | ✅ `tags: 'ams'` / `'all'`，配合 `\notag` / `\nonumber` / `\tag{}` |
| `\require{}` 动态载入宏包 | ❌ **Not supported** | ✅ 有 `require` 扩展 |
| `\newcommand` / `\def` | ✅ 支持 | ✅ 支持，且可用 `configmacros` 全局预置 |
| AMS 环境 `align` / `gather` / `equation` / `split` / `cases` / `matrix` / `pmatrix` / `bmatrix` / `array` | ✅ 支持（须用 `\begin{...}` 形式） | ✅ 支持（AMS 完整） |
| 扩展宏包生态 | 有限（无第三方宏包加载机制） | ✅ `ams`、`mathtools`、`mhchem`、`physics`、`braket`、`cancel`、`boldsymbol`、`unicode`、`units`、`upgreek`、`verb`、`dsfont` 等一长串扩展 |
| MathML 无障碍输出 | ✅ `output: 'htmlAndMathml'`（默认）或 `'mathml'` | ✅ 支持 |

**证据来源**

- KaTeX 支持表（逐条列出 `\label` = Not supported、`\ref` = Not supported (Issue #350)、`\eqref` = Not supported、`\require` = Not supported；`\newcommand`、`\def`、`\tag` = 支持；`{align}`、`{gather}`、`{equation}`、`{cases}`、`{matrix}`、`{pmatrix}`、`{bmatrix}`、`{array}`、`{split}` = 支持）：https://katex.org/docs/support_table
- KaTeX 选项（`displayMode`、`output: html|mathml|htmlAndMathml`，默认 htmlAndMathml；`leqno`、`fleqn`、`errorColor`、`trust`）：https://katex.org/docs/options
- KaTeX auto-render 扩展（当前示例版本 **0.18.7**）：https://katex.org/docs/autorender
- **KaTeX auto-render 的默认定界符**（官方原文，注意**不含单个 `$`**）：

```js
[ { left: "$$",  right: "$$",  display: true  },
  { left: "\\(", right: "\\)", display: false },
  { left: "\\begin{equation}", right: "\\end{equation}", display: true },
  { left: "\\begin{align}",     right: "\\end{align}",     display: true },
  { left: "\\begin{alignat}",   right: "\\end{alignat}",   display: true },
  { left: "\\begin{gather}",    right: "\\end{gather}",    display: true },
  { left: "\\begin{CD}",        right: "\\end{CD}",        display: true },
  { left: "\\[", right: "\\]", display: true  } ]
```

- 官方警告：若要加 `$...$`，**必须排在 `$$` 之后**，否则 `$$` 会被 `$` 规则先截断成空表达式。
- `ignoredTags` 默认 `["script","noscript","style","textarea","pre","code","option"]`；`ignoredClasses` 默认未设置；`preProcess: (math) => math` 可在渲染前改写公式。
- **宏的跨公式累积**：官方说明 `options.macros`（默认 `{}`）会被传入多次 `katex.render` 调用，因此**连续的公式可以通过 `\gdef` 累积共享宏**。
- MathJax 自动公式编号（`tags: 'ams'` / `'all'`、`\notag`、`\nonumber`、`\tag{}`、`\label` + `\ref`/`\eqref`、starred/unstarred 环境区别）：https://docs.mathjax.org/en/latest/input/tex/eqnumbers.html
- MathJax TeX 扩展清单（`ams amscd autoload bbm bboldx bbox begingroup boldsymbol braket bussproofs cancel cases centernot color colortbl colorv2 configmacros dsfont empheq enclose extpfeil fontsizev3 gensymb html mathtools mhchem newcommand noerrors noundefined physics require setoptions tagformat texhtml textcomp textmacros unicode units upgreek verb`；**`autobold`、`autoload-all`、`mediawiki-texvc` 尚未移植到当前版本**）：https://docs.mathjax.org/en/latest/input/tex/extensions/index.html
- MathJax 支持的 TeX 宏总表：https://docs.mathjax.org/en/latest/input/tex/macros/index.html

## 2. 「构建期渲染」vs「客户端渲染」的取舍

| 维度 | 构建期渲染 | 客户端渲染 |
| --- | --- | --- |
| 代表实现 | Hugo `transform.ToMath`（内嵌 KaTeX）、Hexo `hexo-math` / `hexo-filter-mathjax`、Docusaurus（remark-math + rehype-katex） | Hugo passthrough + MathJax、Zola 手引 CDN、MkDocs Material `pymdownx.arithmatex`（默认 generic → MathJax） |
| 页面体积 / 首屏 | ✅ 无数学 JS，首屏最快 | ❌ 需下载数百 KB 的 MathJax/KaTeX JS |
| 复杂宏包 | ❌ 基本只有 KaTeX 能构建期（能力受限，见上表） | ✅ MathJax 全量宏包可用 |
| 交叉引用 / 自动编号 | ❌ KaTeX 不支持 | ✅ MathJax 支持 |
| 无 JS 环境可读性 | ✅ 可读（MathML） | ❌ 不渲染 |
| 构建耗时 | 文章多时变慢 | 构建快，代价转移到浏览器 |

> **实践结论**：若是「定理—证明—引用前文公式」的学术写作，**必须选 MathJax**，基本只能接受客户端渲染（或 Hugo 的 passthrough + MathJax）。若只是偶尔出现公式的技术博客，**构建期 KaTeX 是性价比最高的选择**。

## 3. 跨方案最容易踩的五个坑

### 坑 1：`$$` 与 Markdown 的冲突（最普遍）

Markdown 解析器会把公式里的 `_`、`*`、`\\` 当成自己的语法。**两种解法**：

- **解析器层面保护**：Hugo 的 `goldmark.extensions.passthrough` 最干净——它 preserves raw Markdown within delimited snippets of text。（https://gohugo.io/content-management/mathematics/）
- **换渲染器 + 插件**：Hexo 必须把 `hexo-renderer-marked` 换成 `hexo-renderer-markdown-it` 或 `hexo-renderer-pandoc`。（https://fluid.ist/docs/guide/）

Zola 因为**没有 passthrough 机制**且使用 pulldown-cmark，是这一类问题最严重的方案。

### 坑 2：`$` 定界符本身太危险

- **Hugo 官方立场**：默认**不启用** `$...$` 行内公式，原文——“The configuration above precludes the use of the `$...$` delimiter pair for inline equations. Although you can add this delimiter pair to the configuration and JavaScript, you must double-escape the `$` symbol when used outside of math contexts to avoid unintended formatting.”（https://gohugo.io/content-management/mathematics/）
- **KaTeX 官方立场**：auto-render 默认定界符表里**没有单个 `$`**，要用必须自己加进 `delimiters` 且**必须排在 `$$` 之后**。（https://katex.org/docs/autorender）
- **建议**：中文技术博客里价格、shell 变量、正则都爱用 `$`。除非必要，**优先用 `\\(...\\)` 做行内公式**。

### 坑 3：转义层级叠加

Markdown 里写 `\\(` 还是 `\(`，取决于「Markdown 解析器 → 模板引擎 → JS 字符串」的层数。典型症状是「本地 `hexo s` 正常，部署后公式变成半截」。各方案都有自己的推荐写法，**照抄官方示例比自己推导可靠**。

### 坑 4：CDN 与离线构建

- Hexo 主题默认从 CDN 取 KaTeX/MathJax（如 Fluid 默认 `lib.baomitu.com`，Butterfly 在 `_config.yml` 有整段 CDN 覆盖项）。
- KaTeX 官方 CDN 示例使用 **jsDelivr + SRI integrity**（https://katex.org/docs/autorender）。
- 国内网络下 jsDelivr 可能不稳，**建议自托管**：把 `katex.min.css` / `katex.min.js` 放进站点静态目录。

### 坑 5：一次只装一个数学插件

Hexo/Fluid 官方警告：不可同时安装多个 Markdown 渲染插件（含 `hexo-math`、`hexo-katex`），否则公式静默失效；换引擎必须同时换渲染器。（https://fluid.ist/docs/guide/）

## 4. 各方案「数学能力」一句话速判

| 方案 | 一句话 |
| --- | --- |
| **Hugo** | 唯一有框架级构建期 KaTeX（`transform.ToMath`）+ 官方 passthrough 指南，**数学最强** |
| **Docusaurus** | remark-math + rehype-katex，构建期 KaTeX 且官方文档完整，但受 KaTeX 能力限制（无 `\ref`） |
| **VitePress** | markdown-it 插件体系，配置简单 |
| **Hexo** | 四条路线可选，但默认渲染器与 LaTeX 冲突，**能跑通但要折腾** |
| **Astro** | remark-math + rehype-katex 生态成熟，主题层集成度高 |
| **Jekyll** | Kramdown 自带 math 支持（`math_engine`），但 GitHub Pages 插件白名单是限制 |
| **Eleventy** | 自己搭 markdown-it 插件，灵活但零开箱支持 |
| **Zola** | **无内置，全靠手动引 CDN** |
| **MkDocs Material** | `pymdownx.arithmatex` + MathJax，配置成熟（项目定位变化见文档型章节） |

---

# 第三部分：Astro 生态（本体 + 五大热门主题）

## 第三部分正文：Astro 生态调研（本体 + 热门主题）

> **调研与访问日期（全篇口径）：2026-09-11（UTC）**
> 工作目录：`D:\xyavid blog`（WSL 视角 `/mnt/d/xyavid blog`）
> 本文所有 star 数、版本号、提交时间均为当日实测；无法核实的一律标注「未核实」。

---

## 0. 核实方法与数据来源

| 数据类型 | 取数方式 | 说明 |
|---|---|---|
| star 数 | `curl https://github.com/OWNER/REPO` 中 `id="repo-stars-counter-star"` 的 `title` 属性 | 精确值，非四舍五入 |
| 最近 commit / 最近 release | `/commits.atom`、`/releases.atom` | 不消耗 API 配额 |
| 版本号 | npm registry `registry.npmjs.org/<pkg>/latest` 与 `/astro`（含发布时间） | 官方发布产物 |
| 官方文档原文 | `raw.githubusercontent.com/withastro/docs/main/src/content/docs/en/**.mdx` | 比渲染后的 HTML 更可信、可精确定位 |
| 主题真实配置 | `git clone --depth 1` 浅克隆 5 个主题后 grep | 直接读源码，非二手描述 |
| 线上渲染结果 | 抓取示例站 HTML，检查是否存在 `<span class=katex>`、`katex-mathml`、`katex.min.*.css` | 用于判定「构建期渲染 vs 客户端渲染」 |

> **本次调研未使用 api.github.com**：未认证配额（60 次/小时/IP）已耗尽，全部改用 HTML / Atom / npm / raw 通道。

---

## 1. Astro 本体（withastro/astro）

### 1.1 基本信息（2026-09-11 实测）

| 项目 | 值 | 来源 |
|---|---|---|
| 仓库 | [withastro/astro](https://github.com/withastro/astro) | — |
| Stars | **62,474** | [github.com/withastro/astro](https://github.com/withastro/astro)（HTML star 计数） |
| License | **未核实**（未读 LICENSE 正文） | — |
| npm 最新版 | **astro@7.3.2**，发布于 2026-09-08 | [registry.npmjs.org/astro](https://registry.npmjs.org/astro) |
| 大版本发布时间 | 5.0.0 → 2024-12-03；6.0.0 → 2026-03-10；**7.0.0 → 2026-06-22** | 同上 |
| 仓库最近 commit | 2026-09-11（`[ci] format`） | [commits.atom](https://github.com/withastro/astro/commits.atom) |
| monorepo 最近 release | `@astrojs/mdx@8.0.1`（2026-09-08） | [releases.atom](https://github.com/withastro/astro/releases.atom) |
| Node 要求 | **Node.js >= 22.12.0**（npm >= 9.6.5、pnpm >= 7.1.0） | [install-and-setup](https://docs.astro.build/en/install-and-setup/) 与 [package.json](https://raw.githubusercontent.com/withastro/astro/main/packages/astro/package.json) |

**官方性能说法（非 benchmark）**：文档称「An Astro website can load 40% faster with 90% less JavaScript than the same site built with the most popular React web framework」，但引用来源是一条 Twitter 帖，属厂商宣传口径，**不构成可复现的构建速度基准** → 构建速度（build time）**未核实**。
来源：[docs.astro.build/en/concepts/why-astro](https://docs.astro.build/en/concepts/why-astro/)（源文件 `concepts/why-astro.mdx` 第 67 行）。

### 1.2 技术栈

- **语言**：TypeScript 为主（`packages/astro` 开发依赖 `typescript ^6.0.3`）；组件格式为 `.astro`（类 JSX 模板 + 顶部 `---` frontmatter 脚本）。
- **构建器**：**Vite 8.0.13** + esbuild 0.28 + rollup；`astro` 包直接依赖 `vite ^8.0.13`、`esbuild ^0.28.0`。
- **语法高亮**：**Shiki 4.0.2**（`shiki ^4.0.2`），默认 `markdown.syntaxHighlight.type = 'shiki'`，可切 `prism` 或 `false`。
- **校验**：`zod ^4.5.4`（content collections schema）。
- **输出形态**：默认**每页预渲染为纯静态 HTML**，页面默认 0 KB 客户端 JS；只有显式写 `client:*` 指令的组件才会注入 hydration JS。要 SSR/ISR 才需要装 adapter。
- 来源：[packages/astro/package.json](https://raw.githubusercontent.com/withastro/astro/main/packages/astro/package.json)、[配置参考 markdown.syntaxHighlight](https://docs.astro.build/en/reference/configuration-reference/#marksyntaxhighlight)

### 1.3 Islands 架构

官方定义（源文件 `concepts/islands.mdx`）：

- 默认行为：`By default, Astro will automatically render every UI component to just HTML & CSS, stripping out all client-side JavaScript automatically.`
- 加交互只需一个指令：`<MyReactComponent client:load />`；可选 `client:idle` / `client:visible` / `client:media` / `client:only`。
- 同一项目可混用 React / Preact / Svelte / Vue / Solid（各自装对应 integration）。
- 另有 **Server Islands**（服务端独立渲染的动态岛）。
- 官方文档：<https://docs.astro.build/en/concepts/islands/>

**对公式博客的意义**：数学公式是纯静态内容 → 走构建期渲染，公式页面的客户端 JS 可以为 0；只有搜索框、主题切换、评论、TOC 滚动高亮这类才需要 island。

### 1.4 Markdown 渲染管线（Astro 7 有重大变化，务必注意）

Astro 7 起提供**两个官方 Markdown 处理器**，二选一（源文件 `guides/markdown-content.mdx` 第 212–319 行）：

| 处理器 | 包名（npm 最新版，2026-09-11） | 实现 | 何时用 |
|---|---|---|---|
| **Sätteri**（v7 起**默认**） | `@astrojs/markdown-satteri@0.4.1`（底层 `satteri@0.10.5`） | **Rust 实现的 Markdown/MDX 编译器** | 不需要 remark/rehype 生态插件时 |
| **Unified**（旧默认） | `@astrojs/markdown-remark@7.3.1` | remark/rehype（unified 生态） | 需要 remark/rehype 插件、recma 插件时 |

**关键结论**：

- **`markdown.remarkPlugins` / `markdown.rehypePlugins` / `markdown.gfm` / `markdown.smartypants` 在 Astro 7 中已标记 Deprecated**，官方原话：`This property is deprecated and will be removed in a future major version. Pass plugins to the configured markdown.processor instead.`
  来源：[configuration-reference#markdownremarkplugins](https://docs.astro.build/en/reference/configuration-reference/#markdownremarkplugins)
- 因此 **Astro 5/6 时代主题的数学公式配置写法（顶层 remarkPlugins）现在还能跑，但已进入倒计时**；Astro 7 的正确写法是 `markdown.processor: unified({ remarkPlugins, rehypePlugins })`。
- `markdown.processor` 选项自 **v6.4.0**（npm 发布 2026-05-28）引入。

**Unified 处理器的正确配置写法（官方文档原文）**：

```js title="astro.config.mjs"
import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import remarkToc from "remark-toc";

export default defineConfig({
  markdown: {
    processor: unified({
      remarkPlugins: [remarkToc],
    }),
  },
});
```

来源：[configuration-reference#markdownprocessor](https://docs.astro.build/en/reference/configuration-reference/#markdownprocessor)

### 1.5 官方数学公式方案：**没有第一方方案**

- 我把 `docs.astro.build/sitemap-0.xml` 全量拉下来（842 条 `/en/` 页面），**没有任何 math / formula / katex / latex 专用页面**；`guides/markdown-content.mdx` 全文 grep `math|formula|latex|katex` 为 **0 命中**。
- 官方态度：把 Markdown 扩展完全交给 remark/rehype 插件生态，原文鼓励 `browse awesome-remark and awesome-rehype for popular plugins`。
  来源：[guides/markdown-content#markdown-processor-plugins](https://docs.astro.build/en/guides/markdown-content/#markdown-processor-plugins)
- **结论：数学公式的唯一主流官方兼容路径 = Unified 处理器 + `remark-math` + `rehype-katex`（或 `rehype-mathjax`）。** 这两个插件来自同一个官方 monorepo [remarkjs/remark-math](https://github.com/remarkjs/remark-math)（513 stars，最近 commit 2025-02-20）。

**数学插件版本（2026-09-11，npm registry）**：

| 包 | 版本 | 发布时间 | 说明 |
|---|---|---|---|
| `remark-math` | **6.0.0** | 2023-09-19 | 解析 `$...$` / `$$` / 三反引号 math 为 mdast math 节点 |
| `rehype-katex` | **7.0.1** | 2024-08-19 | 构建期用 KaTeX 渲染；**自带依赖 `katex ^0.16.0`** |
| `rehype-mathjax` | **7.1.0** | 2025-02-20 | 构建期用 MathJax（默认 SVG 输出） |
| `katex` | **0.18.7** | 2026-09-06 | 渲染器本体（CSS 也在这里） |

> 官方插件 README 明确写了构建期渲染这一点（可直接引用）：
> *"This project is also useful as it renders math with KaTeX or MathJax at compile time, which means that there is no client side JavaScript needed."*
> 来源：[remark-math readme](https://github.com/remarkjs/remark-math#when-should-i-use-this)

**Astro 官方文档没有给配置片段，以下是按官方 API 组合出的最小可用配置**（与 Fuwari / Firefly / Retypeset 实际源码写法一致）：

```bash
npx astro add mdx            # 可选：需要 .mdx 时再加
npm i remark-math rehype-katex katex
```

```js title="astro.config.mjs"
import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default defineConfig({
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [[rehypeKatex, { macros: { "\\RR": "\\mathbb{R}" }, strict: false }]],
    }),
  },
});
```

KaTeX CSS 必须自己引入（`remark-math` README 的 CSS 小节明确说 *"This package does not relate to CSS"*）：

```astro title="src/layouts/Layout.astro"
---
import "katex/dist/katex.min.css";
---
```

### 1.6 部署方式（官方支持情况）

| 平台 | 官方文档 | 静态站点 | Adapter 包（npm 最新版） |
|---|---|---|---|
| **GitHub Pages** | [guides/deploy/github](https://docs.astro.build/en/guides/deploy/github/) | 支持，官方推荐用 [withastro/action](https://github.com/withastro/action)（最近 commit 2026-07-10） | 不需要（纯静态） |
| **Vercel** | [guides/deploy/vercel](https://docs.astro.build/en/guides/deploy/vercel/) | 支持，零配置 | `@astrojs/vercel@11.0.10`，`npx astro add vercel` |
| **Netlify** | [guides/deploy/netlify](https://docs.astro.build/en/guides/deploy/netlify/) | 支持，零配置 | `@astrojs/netlify@8.2.5`，`npx astro add netlify` |
| **Cloudflare** | [guides/deploy/cloudflare](https://docs.astro.build/en/guides/deploy/cloudflare/) | 支持 | `@astrojs/cloudflare@14.3.1`，`npx astro add cloudflare` |

> 注：旧仓库 [withastro/adapters](https://github.com/withastro/adapters) 已 **archived**（2025-02-10），三个 adapter 的代码与 npm 发布已回到主仓库 [withastro/astro](https://github.com/withastro/astro) 的 `packages/integrations/*`。

**结论**：纯静态公式博客 → **GitHub Pages（withastro/action）或 Vercel / Netlify / Cloudflare 的静态模式**，全部不需要 adapter；只有在用 Server Islands / 评论后端 / 动态 OG 图这类按需渲染功能时才需要装 adapter。

### 1.7 上手命令（准确可执行）

```bash
# 前提：Node >= 22.12.0
# 官方原文："Node.js - v22.12.0 or higher. Odd-numbered versions like v23 are not supported."
npm create astro@latest        # 或 pnpm create astro@latest / yarn create astro
cd <project>
npm install
npm run dev                    # 默认 http://localhost:4321
npm run build                  # 产物在 ./dist
npm run preview
```

来源：[install-and-setup](https://docs.astro.build/en/install-and-setup/)

---

## 2. 五个主题逐个调研

**总览（2026-09-11 实测）**

| 主题 | Stars | 最近 commit | 最近 release | 维护活跃度 | Astro 大版本 | 样式方案 | 数学公式内置 |
|---|---|---|---|---|---|---|---|
| [saicaca/fuwari](https://github.com/saicaca/fuwari) | 4,992 | 2025-12-11 | 无 release | 约 9 个月无提交 | 5.13.10 | Tailwind **v3** | 内置 remark-math + rehype-katex |
| [CuteLeaf/Firefly](https://github.com/CuteLeaf/Firefly) | 2,111 | **2026-09-11（当天）** | 无 release | 极活跃 | 7.2.10 | Tailwind **v4** | 内置 + mhchem 扩展 |
| [satnaing/astro-paper](https://github.com/satnaing/astro-paper) | 5,037 | 2026-08-05 | v6.1.0（2026-06-06） | 稳定维护 | ^7.0.3 | Tailwind **v4** | 无，需自行加装 |
| [moeyua/astro-theme-typography](https://github.com/moeyua/astro-theme-typography) | 623 | 2025-07-24 | v0.1.0（2024-04-10） | 约 14 个月无提交 | ^5.11.1 | UnoCSS | 内置但**默认关闭** + CDN CSS |
| [radishzzz/astro-theme-retypeset](https://github.com/radishzzz/astro-theme-retypeset) | 696 | 2026-04-12 | v1.0.0（2025-08-07） | 约 5 个月无提交 | ^6.1.5 | UnoCSS | 内置 + Mermaid |

---

### 2.1 Fuwari（saicaca/fuwari）

**仓库与维护**：[github.com/saicaca/fuwari](https://github.com/saicaca/fuwari) · 4,992 stars · 最近 commit `2025-12-12 08:51 +0900  chore(deps): bump the patch-updates group (#681)`（浅克隆 git log 实测）· **无 GitHub Release** · 无 archive 标记。截至 2026-09-11 已约 9 个月无功能提交。

**技术栈**

- Astro **5.13.10**（锁定小版本）、TypeScript 5.9.3、Svelte **5.39.8**（`@astrojs/svelte@7.2.3`；源码 4 个 `.svelte` 文件，主要是搜索与主题切换）。
- 样式：**Tailwind CSS v3.4.19**，走**已弃用路线** `@astrojs/tailwind@6.0.2` + `tailwind.config.cjs`（非 Astro 7 推荐的 `@tailwindcss/vite`）。
- 页面过渡：`@swup/astro`；搜索：**Pagefind 1.4.0**（`pnpm build` 里跑第二次：`astro build && pagefind --site dist`）；代码块：Expressive Code（行号 / 折叠 / 自定义复制按钮）。
- 输出形态：纯静态 HTML；客户端 JS 仅 Svelte 岛 + Swup + Pagefind。

**Markdown 管线**

- Astro 5 的 **remark/rehype（Unified）** 管线，配置在根目录 `astro.config.mjs` → `markdown.remarkPlugins` / `markdown.rehypePlugins`（**Astro 7 已 Deprecated 的写法**）。
- remark 插件：`remarkMath`、`remarkReadingTime`、`remarkExcerpt`、`remarkGithubAdmonitionsToDirectives`、`remarkDirective`、`remarkSectionize`；rehype：`rehypeKatex`、`rehypeSlug`、`rehypeComponents`、`rehypeAutolinkHeadings`。

**数学公式（真实配置片段，源码 `astro.config.mjs`）**

```js
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
// ...
markdown: {
  remarkPlugins: [ remarkMath, /* ...其他插件 */ ],
  rehypePlugins: [ rehypeKatex, rehypeSlug, /* ... */ ],
},
```

- 依赖版本：`remark-math ^6.0.0`、`rehype-katex ^7.0.1`、`katex ^0.16.27`。
- **CSS 位置**：`src/layouts/Layout.astro:21` → `import "katex/dist/katex.css";`（注意是 `.css` 不是 `.min.css`，本地打包，非 CDN）。
- **构建期渲染已实测确认**：抓取 <https://fuwari.vercel.app/posts/markdown/> 的 HTML，命中 `class="katex"` ×3、`class="katex-html"` ×3、`class="katex-mathml"` ×3、`class="katex-display"` ×1，且样式表是 `/_astro/katex.min.*.css`（本地哈希名）→ **无 CDN、无客户端渲染 JS**。
- 附加优化：`Layout.astro` 内用 IntersectionObserver 把每个 `.katex-display` 包进 `.katex-display-container`（`aria-label="scrollable container for formulas"`），配合 `src/styles/markdown.css` 的 `overflow-x: auto` 解决**长公式横向溢出**——公式博客非常实用的细节。
- 示例 Markdown：`src/content/posts/markdown.md` 内含行内 `$\omega = d\phi / dt$`、行间 display math 与 `\begin{equation*}`。

**视觉风格**

- 默认**极简卡片流**：左侧 profile 卡 + 顶部 banner（默认关闭）+ 右侧 TOC。
- 颜色：**CSS 变量 + HSL 色相**，`src/config.ts → siteConfig.themeColor = { hue: 250, fixed: false }`（0–360 全色相可调，提供访客取色器）。
- 字体：`@fontsource/roboto`（正文）+ `@fontsource-variable/jetbrains-mono`（代码），**中文字体靠系统回退**——中文排版观感一般，需自行换字体。
- 暗色模式：内置 light / dark；动效：Swup 页面过渡 + 卡片 hover；TOC：`src/components/widget/TOC.astro`（默认 depth 2，可调 1–3）；搜索：Pagefind（`src/components/Search.svelte`）。
- 示例站：<https://fuwari.vercel.app>（HTTP 200，实测）

**部署**：README 指向 Astro 官方 deploy 指南；仓库自带 `vercel.json`；demo 跑在 Vercel。GitHub Pages / Netlify 同样可用（纯静态）。

**上手**（README 原文，Node >= 20、pnpm >= 9）

```bash
npm create fuwari@latest      # 或 pnpm create fuwari@latest / bun create fuwari@latest
pnpm install
pnpm dev                      # localhost:4321
pnpm build                    # astro build && pagefind --site dist
```

**优缺点**

- 优点：生态最成熟、星最多、文档多语言齐全、公式开箱可用、长公式溢出处理到位、Swup 过渡顺滑。
- 缺点：**技术栈落后一个大版本**（Astro 5 + Tailwind 3 + 已弃用的 `@astrojs/tailwind`），且 **9 个月无提交**；迁移 Astro 7 需把 `markdown.remarkPlugins` 改成 `markdown.processor: unified()`、Tailwind 换 v4 的 Vite 插件。
- 适用人群：想要「好看、开箱即用、公式能跑」的**中文技术博客 / 记录型博主**；不适合追求最新 Astro 特性的人。

---

### 2.2 Firefly（CuteLeaf/Firefly）—— **Fuwari 的二创**

**仓库与维护**：[github.com/CuteLeaf/Firefly](https://github.com/CuteLeaf/Firefly) · 2,111 stars · 最近 commit `2026-09-11 19:06 +0800  fix: OG 图改用本地中文字体，构建期不再请求 Google Fonts`（**调研当天仍在提交**）· 无 GitHub Release（版本号在 `package.json`：**6.16.8**）。

**与 Fuwari 的关系（已核实）**：README 原文 *"Firefly 是一款基于 Astro 框架和 Fuwari 模板开发的清新美观且现代化个人博客主题模板"*，License 章节写明 *"最初 Fork 自 saicaca/fuwari"*，并保留 fuwari 原布局可切换。

**技术栈**

- Astro **7.2.10**、TypeScript 6.0.3、Svelte **5.57.0**（`@astrojs/svelte@9.0.1`，**28 个 `.svelte` 组件**，是本列表里最重的 island 使用者）。
- 样式：**Tailwind CSS v4.3.3 + `@tailwindcss/vite`**（无 `tailwind.config`，v4 的 CSS-first 配置）；仍带 stylus。
- 内容：`@astrojs/mdx@7.0.8`、RSS、sitemap；代码块 Expressive Code 0.44.2（含 ec-lang-logo / 折叠 / 语言徽章）；搜索 Pagefind 1.5.2；页面过渡 Swup。
- **可选 Cloudflare adapter**（`@astrojs/cloudflare@14.2.6`，仅当环境变量 `CF_WORKERS` 存在时才启用，源码 `astro.config.mjs` 顶部 `const adapter = process.env.CF_WORKERS ? cloudflare({...}) : undefined`）→ 静态优先，想上 Workers 时才切 SSR。
- 其他：Mermaid、PlantUML、KaTeX、看板娘（pio）、音乐播放器、Bangumi / VNDB / MyAnimeList 页面、Waline / Twikoo 评论；`pnpm build` 里还有 LQIP 生成 + 字体子集化 + inline script 压缩 + Pagefind 索引。
- 环境要求：**Node >= 22.23.0，pnpm >= 11**（`engines` 字段实测）。

**Markdown 管线**

- **Astro 7 新写法**：`markdown.processor: unified({ remarkPlugins: [...], rehypePlugins: [...] })`，`unified` 从 `@astrojs/markdown-remark@7.3.0` 导入。
- remark：`remarkMath`、`remarkReadingTime`、`remarkWikiLink`、`remarkImageGrid`、`remarkExcerpt`、`remarkDirective`、`remarkSectionize`、`remarkMermaid`、`remarkPlantuml`、`remarkAdmonitionToBlockquoteCallout`。
- rehype：`rehypeKatex`、`rehypeCallouts`、`rehypeSlug`、`rehypeCodeGroup`、`rehypeMermaid`、`rehypePlantuml`、`rehypeFigure`、`rehypeExternalLinks`、`rehypeEmailProtection`、`rehypeAutolinkHeadings` 等。

**数学公式（真实配置片段，源码 `astro.config.mjs`）**

```js
import katex from "katex";
import "katex/dist/contrib/mhchem.mjs"; // 加载 mhchem 扩展（化学式）
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
// ...
markdown: {
  processor: unified({
    remarkPlugins: [ /* ..., */ remarkMath, /* ... */ ],
    rehypePlugins: [
      [rehypeKatex, { katex }],          // 原样照抄，见下方「坑」
      [rehypeCallouts, { theme: siteConfig.post.rehypeCallouts.theme }],
      // ...
    ],
  }),
},
```

- 依赖版本：`remark-math ^6.0.0`、`rehype-katex ^7.0.1`、`katex ^0.18.5`（**本列表中 KaTeX 最新**）。
- **CSS 位置**：`src/components/features/KatexManager.astro` —— 整个文件只有一行有效代码：`import "katex/dist/katex.min.css";`，即「只在文章页加载 KaTeX 样式」。
- **构建期渲染已实测确认**：<https://firefly.cuteleaf.cn/posts/katex-math-example/> 的 HTML 命中 `class="katex"` ×16、`katex-display` ×7、`katex-mathml` ×16；**全文无 `mathjax` 字样**，无 CDN 引用。
- 附加：`src/utils/swup-transitions.ts` 在每次 Swup 切页后重跑 `scheduleContentOverflowEnhancements()`（含 katex 元素的容器处理）→ 解决「客户端路由切换后公式溢出容器失效」。
- 主题演示文章：<https://firefly.cuteleaf.cn/posts/katex-math-example/>

**⚠️ 一个必须知道的坑（源码级核实）**

Firefly 写的是 `[rehypeKatex, { katex }]`，意图是覆盖 KaTeX 实例，但 **rehype-katex@7.0.1 的源码并不读取 `options.katex`**：

```js
// packages/rehype-katex/lib/index.js
import katex from 'katex'                    // ← 用的是它自己依赖的 katex ^0.16.0
const settings = options || emptyOptions
result = katex.renderToString(value, { ...settings, displayMode, throwOnError: true })
```

（官方类型定义：`type Options = Omit<KatexOptions, 'displayMode' | 'throwOnError'>`，来源 [rehype-katex readme](https://github.com/remarkjs/remark-math/tree/main/packages/rehype-katex)）

→ 在 pnpm 严格依赖下，`rehype-katex` 会**另装一份 katex 0.16.x**，与项目根目录的 `katex@0.18.5` 不是同一实例。因此：

1. 项目里的 `import "katex/dist/contrib/mhchem.mjs"` 注册到的是 **0.18.5** 实例，而构建期实际渲染用的是 **0.16.x** → **`\ce{}` 是否真的生效需要自测（未核实）**；稳妥做法是显式装 `katex@^0.16.27` 对齐，或改用 KaTeX 的 `macros` 选项注入。
2. CSS 来自 0.18.5、HTML 来自 0.16.x → 版本错配，通常兼容但不保证。

**视觉风格**

- 默认**清新二次元 / 渐变卡片风**，比 Fuwari 花哨：4 种背景模式（横幅壁纸 / 全屏壁纸 / 透明覆盖 / 纯色）、樱花等特效、看板娘、音乐播放器。
- 颜色：`src/config/siteConfig.ts → themeColor: { hue: 165, defaultMode: "system" }`（0–360 色相可调；默认跟随系统）。
- 字体：`fontConfig.ts` 支持 google / fontsource / local / bunny / fontshare / npm 六种 provider，用 Astro 官方 **Font API**（`fonts: [...]`）+ 构建期字体子集化脚本；`@fontsource-variable/noto-sans-sc` 是**中文友好**的默认项。
- TOC：三个组件 `SidebarTOC.astro` / `ImmersiveTOC.astro` / `FloatingTOC.astro`（悬浮目录）；搜索：Pagefind + 高级搜索页 `AdvancedSearch.svelte`；暗色模式：light / dark / system；动效：Swup。
- **配置全在 `src/config/` 目录**（26 个文件：`siteConfig.ts`、`fontConfig.ts`、`backgroundWallpaper.ts`、`effectsConfig.ts`、`sidebarConfig.ts` …），中文文档齐全。
- 示例站：<https://firefly.cuteleaf.cn>（200）；文档站 <https://docs-firefly.cuteleaf.cn>（200）；作者博客 <https://blog.cuteleaf.cn>。

**部署**：README 明确写「参考 Astro 官方指南部署至 Vercel / Netlify / Cloudflare Pages / EdgeOne Pages」，并给了一键部署按钮；仓库自带 `vercel.json` + `wrangler.jsonc`。构建命令 `pnpm run build`、输出 `dist`。默认**只出静态产物**（Cloudflare adapter 需 `CF_WORKERS` 开启）。

**上手**

```bash
git clone https://github.com/CuteLeaf/Firefly.git   # 建议先 Fork
cd Firefly
npm install -g pnpm
pnpm install
pnpm dev          # localhost:4321
pnpm build
```

**优缺点**

- 优点：唯一同时满足「Astro 7 + Tailwind 4 + 公式开箱 + 中文字体 + 活跃维护」的主题；中文文档；配置项极多；作者当天还在修 OG 中文字体。
- 缺点：**重**——43 MB 仓库、28 个 Svelte 组件、看板娘 / 音乐播放器 / 樱花特效等非刚需能力多，定制要读的代码量大；KaTeX 实例覆盖写法有上述隐患；无 GitHub Release，只能跟 commit。
- 适用人群：**中文技术博客 / 公式密集且想要好看**的个人站；不适合要素极简、想要轻量可控的人（那种选 AstroPaper 或 Retypeset）。

---

### 2.3 AstroPaper（satnaing/astro-paper）

**仓库与维护**：[github.com/satnaing/astro-paper](https://github.com/satnaing/astro-paper) · **5,037 stars** · 最近 commit `2026-08-05` · 最近 release **v6.1.0（2026-06-06）** · 有 CHANGELOG、Conventional Commits、Dockerfile。

**技术栈**

- Astro **^7.0.3**（已跟到 Astro 7）、TypeScript 6.0.3。
- 样式：**Tailwind CSS v4.3.2 + `@tailwindcss/vite`**（v4 路线，无 `tailwind.config`）。
- **零 island**：源码里 0 个 `.svelte` / `.vue` / `.tsx` —— 全静态 Astro 组件，JS 极少。
- 搜索：**Pagefind 1.5.2**（`pnpm build` = `astro check && astro build && pagefind --site dist && cp -r dist/pagefind public/`）。
- 特色：Satori + Sharp + Astro Font API 做**动态 OG 图**；MDX；类型安全 frontmatter（content collections + zod）。
- Node >= 22.12.0。

**Markdown 管线**

- **Astro 7 正确写法已用上**：`markdown.processor: unified({ remarkPlugins: [remarkToc, [remarkCollapse, {test:"Table of contents"}]], rehypePlugins: [rehypeCallouts] })`，`unified` 从 `@astrojs/markdown-remark@^7.2.0` 导入。
- Shiki：`shikiConfig.themes = { light: "min-light", dark: "night-owl" }`，`defaultColor: false` + `@shikijs/transformers`（diff / highlight / wordHighlight / 文件名）。

**数学公式：默认不支持**

- 源码全文 grep `katex` **0 命中**（`astro.config.ts`、`src/`）。
- 但仓库里**自带一篇官方教程**：`src/content/posts/how-to-add-latex-equations-in-blog-posts.md`（*How to add LaTeX Equations in Astro blog posts*，modDatetime 2025-03-22），原文给的步骤：

```bash
pnpm install rehype-katex remark-math katex
```

```ts file=astro.config.ts
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
export default defineConfig({
  markdown: {
    remarkPlugins: [ remarkMath, remarkToc, [remarkCollapse, { test: "Table of contents" }] ],
    rehypePlugins: [rehypeKatex],
    shikiConfig: { themes: { light: "min-light", dark: "night-owl" }, wrap: false },
  },
});
```

并且 KaTeX CSS 用 **CDN** 引入（原文 `src/layouts/Layout.astro`）：

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/katex.min.css" />
```

- **⚠️ 这篇官方教程已过时**，照抄会有两个问题：
  1. `markdown.remarkPlugins` / `rehypePlugins` 在 **Astro 7 已 Deprecated**（当前 v6.1.0 的官方配置本身已经改成 `unified(...)`），正确写法是：

```ts
import { unified } from "@astrojs/markdown-remark";
markdown: {
  processor: unified({
    remarkPlugins: [remarkMath, remarkToc, [remarkCollapse, { test: "Table of contents" }]],
    rehypePlugins: [rehypeKatex],
  }),
},
```

  2. 教程钉的是 **katex@0.15.2**，而 npm 最新是 **0.18.7**（2026-09-06）；且 `rehype-katex@7.0.1` 自带 `katex ^0.16.0`。**别用 @0.15.2，也别用 `katex@latest` 这种浮动 CDN 链接**。建议 `npm i katex` 后 `import "katex/dist/katex.min.css"` 本地打包。

**视觉风格**

- 默认**极度简约**：单列、大留白、无 sidebar、无头像卡；官方定位 `minimal, responsive, accessible and SEO-friendly`。
- 颜色：`astro-paper.config.ts` 选 **predefined color schemes**，官方文档有 `src/content/posts/customizing-astropaper-theme-color-schemes.md` 与 `predefined-color-schemes.md`；用 Tailwind v4 的 CSS 变量。
- 字体：Astro Font API + `Google Sans Code`（`astro.config.ts` 的 `fonts: [...]`）；**默认无中文字体**，中文需自己补 provider 或 system fallback。
- 暗色模式：内置（`features.lightAndDarkMode`）；TOC：可折叠（`remark-toc` + `remarkCollapse`）；动效：克制；搜索：Pagefind（`features.search = "pagefind"`）。
- 有 Figma 设计文件：<https://www.figma.com/community/file/1356898632249991861>
- 示例站：<https://astro-paper.pages.dev>（200）；作者博客 <https://satnaing.dev/blog>（200）

**部署**：README 明写 **Deployment - Cloudflare Pages**；同时提供 Dockerfile / compose.yaml（自托管）。任何静态托管都行。

**上手**

```bash
pnpm create astro@latest --template satnaing/astro-paper   # 或 npm create astro@latest -- --template satnaing/astro-paper
pnpm install
pnpm dev
```

**优缺点**

- 优点：Astro 7 + Tailwind 4 全对齐；最干净、最快、无障碍与 SEO 最好；零 island（公式页 JS 约等于 0）；有 CHANGELOG 与正式 release。
- 缺点：**数学公式要自己动手**（自带教程还过时）；视觉朴素，中文排版观感一般（需自行配字体 / Tailwind typography 微调）；无中文界面。
- 适用人群：**技术博客、纯记录型、注重性能与可维护性**的写作者；公式密集者需自己补约 20 行配置（不难，但要会 Astro 配置）。

---

### 2.4 Astro Theme Typography（moeyua/astro-theme-typography）

**仓库与维护**：[github.com/moeyua/astro-theme-typography](https://github.com/moeyua/astro-theme-typography) · 623 stars · 最近 commit `2025-07-17 13:48 +0800  chore: 添加类型检查脚本并恢复 TypeScript 依赖项`（约 **14 个月无提交**）· 最近 release **v0.1.0（2024-04-10）**。灵感来自 Hexo 的 [sumimakito/hexo-theme-typography](https://github.com/sumimakito/hexo-theme-typography)。

**技术栈**

- Astro **^5.11.1**（落后两个大版本）、TypeScript ~5.8.3。
- 样式：**UnoCSS 66.3.3** + `unocss-preset-theme`（`uno.config.js`）；**非 Tailwind**。
- **零 island**（0 个 Svelte / Vue / TSX）；页面过渡用 `@swup/astro`；评论支持 Disqus / Giscus / Twikoo；SEO 用 `astro-seo` + `astro-robots-txt`；`@astrojs/mdx@4.3.0`。
- 输出形态：纯静态 HTML。

**Markdown 管线**

- Astro 5 的 Unified 管线，配置在根目录 **`astro.config.ts`**：`markdown.remarkPlugins: [remarkMath]` / `markdown.rehypePlugins: [rehypeKatex]`，外加 `shikiConfig: { theme: 'dracula', wrap: true }`。

**数学公式（真实配置片段，源码 `astro.config.ts`）**

```ts
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
export default defineConfig({
  markdown: {
    remarkPlugins: [ remarkMath ],
    rehypePlugins: [ rehypeKatex ],
    shikiConfig: { theme: 'dracula', wrap: true },
  },
})
```

- 依赖：`remark-math ^6.0.0`、`rehype-katex ^7.0.1`（package.json **没有直接列 katex**，靠 rehype-katex 的依赖带入 katex ^0.16.x）。
- **⚠️ 默认关闭！** 开关在主题配置里：`src/.config/default.ts` →

```ts
latex: {
  katex: false,   // ← 默认 false，必须改成 true
},
```

  类型定义 `src/types/themeConfig.ts`：`ConfigLaTeX { katex: boolean }`。
- **CSS 用 CDN（且是浮动版本）**：`src/components/LaTeX.astro` 全文：

```astro
{ katex && (
  <link rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/katex@latest/dist/katex.min.css"
    crossorigin="anonymous" />
) }
```

  ⚠️ `katex@latest` 会随 KaTeX 升级漂移，与构建期由 `rehype-katex`（katex 0.16.x）产出的 HTML 可能不匹配；国内访问 jsDelivr 也可能失败 → 建议改成本地 `import 'katex/dist/katex.min.css'`。这是**本主题最需要在生产环境修的一处**。
- 示例文章：`src/content/posts/Latex Example.md`（行内 `$E = mc^2$`、行间 `\int_a^b f(x)dx`、`\frac{d}{dx}`），但 frontmatter 里 `draft: true` → **线上示例站看不到**（<https://astro-theme-typography.vercel.app/posts/latex-example> 实测返回 404）。
- 配置自定义：`src/.config/default.ts`（默认值）→ 建议在 `src/.config/user.ts` 覆盖。

**视觉风格**

- 定位就是**中文排版阅读体验**：README 原文 *"Typography: Derived from prevalent Chinese typographic norms"*。
- 颜色：`src/.config/default.ts → style.colorsLight = { primary: '#2e405b', background: '#ffffff' }`，`colorsDark = { primary: '#FFFFFF', background: '#232222' }`（只有 2 个颜色，最小化）。
- **字体是核心卖点**：`fonts.header = '"HiraMinProN-W6","Source Han Serif CN",...,serif`、`fonts.ui = '"Source Sans Pro","Roboto",...,"Source Han Sans SC","PingFang SC",...'` → 中文衬线标题 + 无衬线 UI，中文站点可直接用。
- 暗色模式：`themeStyle: 'light' | 'dark' | 'system'`；i18n：`locale: 'zh-cn'`（支持 en-us / zh-cn / zh-tw / ja-jp / it-it）；**无搜索**（README TODO 里 `[ ] search`）；TOC 无独立组件；动效仅 Swup。
- 示例站：<https://astro-theme-typography.vercel.app>（200）；作者博客 <https://blog.moeyua.com/>；社区示例 <https://julyfun.fun/>、<https://blog.mytest.cc/>、<https://books.beyondxin.top/>（均见 README）。

**部署**：README 给 Vercel / Netlify 一键按钮并指向 Astro 官方部署指南；纯静态。

**上手**

```bash
# Fork + clone 后
pnpm install
pnpm dev            # dev 脚本是 astro check && astro dev
pnpm build
pnpm theme:create   # 新建文章
```

（仓库有 `.nvmrc`，具体 Node 版本**未核实**；package.json 未声明 `engines`。）

**优缺点**

- 优点：中文排版 / 字体是三家里最讲究的；配置文件极简；公式管线已接好（打开开关即可）；纯静态无岛。
- 缺点：**维护停滞 14 个月**；Astro 5（落后两个大版本），升级 Astro 7 需改 `markdown.processor`；公式默认关闭且 CSS 走 `katex@latest` CDN；**无搜索**；生态 / 文档量最少。
- 适用人群：**中文写作者、以阅读体验为第一优先、文章以文字为主偶尔插公式**的人；不适合需要搜索、需要最新 Astro 的人。

---

### 2.5 Retypeset（radishzzz/astro-theme-retypeset）—— 基于 Typography 的衍生

**仓库与维护**：[github.com/radishzzz/astro-theme-retypeset](https://github.com/radishzzz/astro-theme-retypeset) · 696 stars · 最近 commit `2026-04-12 18:39 +0800  chore: update dependencies`（约 5 个月前）· 最近 release **v1.0.0（2025-08-07）**。
README 自述 *"Inspired by Typography"*，Credits 同时列了 Typography、Fuwari、AstroPaper、Hexo Redefine。

**技术栈**

- Astro **^6.1.5**、TypeScript ~6.0.2。
- 样式：**UnoCSS 66.6.8 + `unocss-preset-theme`**（`uno.config.ts`）；**非 Tailwind**。
- **零 island**：0 个 Svelte / Vue / TSX；动效用 **Astro 原生 View Transitions**（`<ClientRouter />` from `astro:transitions`）。
- `@astrojs/mdx@5.0.3`、`@astrojs/partytown`（第三方脚本挪到 Web Worker）、`astro-compress`（CSS/HTML/JS 压缩）、sitemap、`astro-og-canvas` + CanvasKit 生成 OG 图。
- 评论：Waline 3.13 / Twikoo；Mermaid 11.14 通过 `rehype-mermaid` 构建期转 SVG。
- 输出形态：纯静态 HTML。

**Markdown 管线（源码 `astro.config.ts`）**

- Astro 6 的 Unified 管线，顶层 `markdown.remarkPlugins` / `rehypePlugins`（Astro 7 已 Deprecated），外加 `syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid'] }` 与 light/dark 双 Shiki 主题。

**数学公式（真实配置片段，源码 `astro.config.ts`）**

```ts
import rehypeKatex from 'rehype-katex'
import rehypeMermaid from 'rehype-mermaid'
import remarkMath from 'remark-math'
export default defineConfig({
  markdown: {
    remarkPlugins: [ remarkDirective, remarkMath, /* ... */ ],
    rehypePlugins: [
      rehypeKatex,
      [rehypeMermaid, { strategy: 'pre-mermaid' }],
      rehypeSlug, rehypeHeadingAnchor, rehypeImageProcessor, rehypeExternalLinks, rehypeCodeCopyButton,
    ],
    syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid'] },
  },
})
```

- 依赖：`remark-math ^6.0.0`、`rehype-katex ^7.0.1`、**`katex ^0.16.45`（显式安装，与 rehype-katex 的 ^0.16.0 同线，版本匹配正确）**。
- **开关**：`src/config.ts` → `global.katex: true`（注释原文 `// enable katex math rendering`，**默认已开**），并且 `global.toc: true`、`global.fontStyle: 'sans' | 'serif'`。
- **CSS 位置**：`src/layouts/Head.astro:3` → `import katexCSS from 'katex/dist/katex.min.css?url'`，第 63 行 `{katexEnabled && <link rel="stylesheet" href={katexCSS} media="print" onload="this.media='all'" />}` —— **本地打包 + 非阻塞加载**，写法最讲究。
- 溢出处理：`src/styles/extension.css` → `.katex-display { --at-apply: 'my-6 overflow-x-auto overflow-y-hidden scrollbar-hidden'; }`。
- **构建期渲染已实测确认**：<https://retypeset.radishzz.cc/posts/katex-mathematical-demo/> 的 HTML 为 `<span class=katex><span class=katex-mathml><math ...>` + `katex-html`（注意该站 HTML 属性无引号，用带引号的 grep 会误判为空），CSS 为本地 `/_astro/katex.min.HM2DiD67.css`。
- **能力演示（本列表最完整的公式测试文章）**：`src/content/posts/examples/KaTeX Mathematical Demo-zh.md` 覆盖：
  - 行内 `$\wedge$`、`$\mathbb{Z}/n\mathbb{Z}$`
  - `\begin{align}` + `\tag{1}` / `\tag{$\ddagger$}`、`\begin{align*}`、`\begin{aligned}`、`\begin{vmatrix}` 矩阵
  - `\text{}`、`\mathbf{}`、`\colon`、`\mapsto`、`\prod`、`\lvert q\rvert`、希腊字母全表、箭头全表
  - 出处标注 *"示例取自 KaTeX Live Demo"*
  - → 说明 **KaTeX 对 AMS 风格的 align / align* / tag / 矩阵 / 文本混排支持良好**（见 3.2）

**视觉风格**

- 官方定位 *"creating a reading experience reminiscent of paper books"* —— **纸质书感**，本列表中最「文学 / 学术」的一套。
- 颜色：**oklch 四色系统**，`src/config.ts → color.light = { primary, secondary, background: 'oklch(96% 0.005 298)', highlight: 'oklch(0.93 0.195089 103.2532 / 0.5)' }`（高亮是半透明黄，像荧光笔），`mode: 'light' | 'dark' | 'auto'` 默认 light。
- 字体：自带 `public/fonts`（`STIX-VF.woff2`、`STIX-Italic-VF.woff2`、`Snell-Bold-SF.woff2`），Head 里 preload；**STIX 是数学字体族**，与公式氛围一致；`fontStyle: 'sans' | 'serif'` 可切正文字体。
- i18n：`locale: 'zh'` 默认中文，`moreLocales: ['en','es','ja','ru','zh-tw']`；TOC：`src/components/Widgets/TOC.astro`；**无站内搜索**（README 出现的 `search` 属 Waline 评论组件配置，不是站内搜索 —— 判定为基本没有，**未穷举核实**）；暗色模式：内置；动效：View Transitions 淡入淡出。
- 示例站：<https://retypeset.radishzz.cc/en/>（200，另有 zh-tw / ja / es / ru 多语言站）；公式演示 <https://retypeset.radishzz.cc/posts/katex-mathematical-demo/>

**部署**：README 指向 Astro 官方部署指南 + Netlify / Vercel 按钮；纯静态。

**上手**

```bash
git clone <repository-url> && cd <repository-name>
npm install -g pnpm
pnpm install
pnpm dev
pnpm build          # astro check && astro build && pnpm apply-lqip
pnpm update-theme   # 主题升级（README 有冲突处理视频）
```

**优缺点**

- 优点：**公式能力与预处理写得最规范**（本地 CSS + 非阻塞加载 + katex 版本对齐 + 溢出修复 + 完整公式示例文章）；默认中文；纸质书视觉辨识度高；有 View Transitions 与 Partytown；支持 Mermaid。
- 缺点：基于 Astro 6（顶层 remarkPlugins 写法需迁移到 `markdown.processor` 才能在 Astro 7 长期使用）；无站内搜索；约 5 个月未提交；UnoCSS 而非 Tailwind，生态笔记 / 教程相对少。
- 适用人群：**中文 / 学术公式密集 / 想要「书卷气」阅读感**的博客；不适合需要搜索、需要最新 Astro 的人。

---

## 3. 数学公式：横向结论与坑（跨主题通用）

### 3.1 构建期 vs 客户端（实测口径）

| 主题 | 渲染时机 | 证据 |
|---|---|---|
| Fuwari | **构建期（SSG）** | 线上 HTML 含 `katex-html` / `katex-mathml`，CSS 为本地哈希文件 |
| Firefly | **构建期（SSG）** | 同上，16 处 `class="katex"`，无 mathjax 字样 |
| AstroPaper | 默认无；按官方教程加装后为构建期 | 源码无 katex |
| Typography | 构建期渲染 + **CDN CSS（`katex@latest`）** | `src/components/LaTeX.astro` |
| Retypeset | **构建期（SSG）** | 线上 HTML `<span class=katex>`，本地 `katex.min.*.css` |

**结论：Astro 系（`remark-math` + `rehype-katex`）全部是构建期渲染，客户端 0 个数学 JS**。这正是它与客户端 KaTeX / MathJax（如 Hexo 自动注入、Hugo 的 KaTeX auto-render）最大的差别。

### 3.2 KaTeX 能力边界（对照 <https://katex.org/docs/supported.html>）

**支持**（官方支持表实测命中）：

- 宏定义：`\def`、`\gdef`、`\edef`、`\xdef`、`\newcommand`、`\renewcommand`、`\providecommand`、`\let`、`\global\def`；宏可用 KaTeX 渲染选项（`macros`）注入；最多 9 个参数。
- 环境：`\begin{align}`、`align*`、`aligned`、`gather`、`split`、`equation`、`cases`、`pmatrix` / `vmatrix` / `bmatrix` / `array` 等（AMS 风格多行对齐、矩阵 OK）。
- 其它：`\tag`、`\text`、`\mathbb`、`\operatorname*`、`\href`。

**不支持**：`\usepackage`、`\require`、`\ce{}`（需另加载 mhchem 扩展）、完整 LaTeX 包系统 —— 支持表里 0 命中。

### 3.3 常见坑（按踩到概率排序）

1. **`$$...$$` 被当成 `<p><code>`**：只发生在**没有装 `remark-math`**（或没走 Unified 处理器）时——Markdown 把 `$$` 当普通文本 / 代码。只要装了 `remark-math`，三反引号 math、`$...$`、`$$` 三种语法都可用（官方 readme 的 Authoring 小节）。另外注意 `$$` 要**独占一行且与正文之间留空行**才稳定解析为 display math。
2. **`$` 与货币符号冲突**：`remark-math` 的 `singleDollarTextMath` **默认 true**，官方 readme 原话 *"Single dollars work in Pandoc and many other places, but often interfere with 'normal' dollars in text. If you turn this off, you can still use two or more dollars for text math."* → 中文写作常出现「价格 $5」，建议关闭：

```js
remarkPlugins: [[remarkMath, { singleDollarTextMath: false }]]
```

3. **忘引 KaTeX CSS**：`remark-math` readme 的 CSS 小节明确 *"This package does not relate to CSS"*；不引 CSS 公式会渲染成一堆错位 HTML。两种引法：本地 `import "katex/dist/katex.min.css"`（推荐）或 CDN `<link>`（Typography 的写法）。
4. **CDN 与版本漂移**：Typography 用 `katex@latest` 的 CDN URL；AstroPaper 官方教程钉 `katex@0.15.2` —— 两者都会与 `rehype-katex` 实际使用的 katex 版本错配。**推荐本地安装 katex 并在 Layout 里 import**。
5. **`rehype-katex` 自带 katex ^0.16.0，你的 katex 版本可能管不着它**（见 2.2 Firefly）：源码 `import katex from 'katex'` 硬编码，`options.katex` 不被读取。想让 mhchem 等扩展生效，要么把项目 katex 版本对齐到 0.16.x，要么改用 `macros` 选项注入宏。
6. **长公式横向溢出**：display math 比正文宽时会撑破布局。Fuwari 用 IntersectionObserver + `.katex-display-container{overflow-x:auto}`；Retypeset 直接 `.katex-display{overflow-x:auto}`。两者都建议照抄。
7. **Swup / View Transitions 之后失效**：用客户端路由过渡（Fuwari / Firefly / Typography 用 Swup）时，切页后新页面的公式容器增强、图标、滚动监听都要重新初始化。Firefly 在 `src/utils/swup-transitions.ts` 里 `scheduleContentOverflowEnhancements()` 就是干这个。**构建期渲染的公式本身不会失效（HTML 里已有），失效的是包在公式外面的 JS 增强。**
8. **SSR / `window is not defined`**：Astro 默认静态构建，KaTeX 构建期在 Node 里跑，不碰 `window`，因此**本组合天然没有 SSR window 问题**；只有自己在 `.astro` frontmatter 里写浏览器 API，或在 `client:*` 组件顶层访问 `window` 时才会踩到。`rehype-katex` 使用 `hast-util-from-html-isomorphic`（isomorphic 版本）正是为规避 DOM 依赖。
9. **PDF 导出**：KaTeX 输出 HTML + MathML（`katex-html` 供屏幕渲染、`katex-mathml` 供辅助 / 复制），**不是矢量公式对象**；浏览器「打印为 PDF」通常可用但断页 / 缩放需 CSS 调优；若要 LaTeX 级 PDF，应走「同一份 Markdown → Pandoc/LaTeX」的旁路，Astro 侧不做这件事。此条为工程经验，**本次未实测 → 未核实**。
10. **`markdown.remarkPlugins` 在 Astro 7 已 Deprecated**：新项目直接用 `markdown.processor: unified({...})`；Astro 5/6 主题（Fuwari / Typography / Retypeset）升级时会看到 deprecated 提示，需要迁移。

### 3.4 KaTeX vs MathJax（在 Astro 里的取舍）

| | KaTeX（`rehype-katex`） | MathJax（`rehype-mathjax`） |
|---|---|---|
| npm 版本 | 7.0.1（2024-08-19），依赖 katex ^0.16.0 | 7.1.0（2025-02-20） |
| 渲染 | 构建期，输出 HTML + MathML | 构建期（默认 SVG，`rehype-mathjax/svg`）；另有 `/browser`、`/chtml` 变体（客户端） |
| 速度 | 快 | 慢（但构建期只跑一次） |
| 覆盖度 | LaTeX 子集，未支持命令会报错 / 红字 | 覆盖更广（TeX 宏包更多） |
| 生态 | 被测五个主题**全部选 KaTeX** | 无主题默认使用 |

来源：[remark-math readme](https://github.com/remarkjs/remark-math)、[npm rehype-mathjax](https://registry.npmjs.org/rehype-mathjax)

---

## 4. 「Astro 系做公式密集中文博客」的推荐组合

### 推荐 A（稳妥、开箱即用）：Firefly + 版本对齐修正 —— **首选**

- 理由：唯一同时满足 Astro 7 + Tailwind 4 + 公式开箱 + 中文字体（Noto Sans SC）+ 当天仍在维护；公式演示文章、KatexManager、Swup 后置增强都现成。
- 必做修正：
  1. 把 `katex` 固定到与 `rehype-katex` 同线（`^0.16.27`），或删掉 `import "katex/dist/contrib/mhchem.mjs"` 并在 `rehypeKatex` 的 `macros` 里注入需要的东西；
  2. `[rehypeKatex, { katex }]` 里的 `katex` 字段实际不生效，按需换成官方支持的 `macros` / `strict` / `trust`；
  3. `remarkPlugins: [[remarkMath, { singleDollarTextMath: false }]]`（若正文有货币符号）。
- 部署：Vercel 或 Cloudflare Pages 静态模式（`pnpm build` → `dist`；不要设 `CF_WORKERS`，除非要 Workers SSR）。

### 推荐 B（极简、性能优先）：AstroPaper + 约 20 行公式配置

```bash
pnpm create astro@latest --template satnaing/astro-paper
cd <project> && pnpm install
pnpm add remark-math rehype-katex katex
```

```ts title="astro.config.ts"
import { unified } from "@astrojs/markdown-remark";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
// ...
markdown: {
  processor: unified({
    remarkPlugins: [[remarkMath, { singleDollarTextMath: false }], remarkToc, [remarkCollapse, { test: "Table of contents" }]],
    rehypePlugins: [rehypeKatex, rehypeCallouts],
  }),
},
```

```astro title="src/layouts/Layout.astro"
---
import "katex/dist/katex.min.css";
---
```

- 再补：中文字体（Astro Font API 增加中文 provider 或本地字体）、`.katex-display{overflow-x:auto}`。
- 适合「要素极简 + 自己掌控一切」的人。

### 推荐 C（中文阅读体验 / 学术书卷气）：Retypeset

- 默认 `katex: true`、`locale: 'zh'`、STIX 数学字体 + 纸书排版；公式配置最规范（本地 CSS + `media="print" onload` 非阻塞）。
- 代价：Astro 6（升级时要改 `markdown.processor`）、无站内搜索、约 5 个月无提交。

### 不推荐作为「公式密集」首选

- **Fuwari**：公式能用，但 Astro 5 + Tailwind 3 + 9 个月无提交，属「上一代」；除非就想要它这层皮。
- **Typography**：中文排版好，但 14 个月无提交、公式默认关闭、CSS 走 `katex@latest` CDN、无搜索 → 只适合「文字为主、公式偶尔」的中文写作者。

### 通用注意事项清单

1. **统一处理器写法**：新项目一律用 `markdown.processor: unified({ remarkPlugins, rehypePlugins })`。**只要用 `remark-math`，就必须走 Unified**——Sätteri 用的是 `satteri-*` 插件生态，**没有** `remark-math` 的对应实现。这是 Astro 7 默认处理器下的**头号陷阱**：默认 Sätteri，不改成 Unified 的话公式插件根本装不上。来源：[guides/markdown-content#choosing-a-markdown-processor](https://docs.astro.build/en/guides/markdown-content/#choosing-a-markdown-processor)
2. **katex 版本对齐**：项目 `katex` 与 `rehype-katex` 内置的 `katex ^0.16.0` 不要跨线。
3. **CSS 本地化**：`import "katex/dist/katex.min.css"`，不要 `@latest` CDN。
4. **`singleDollarTextMath`**：中文写货币符号的场景建议关掉单美元行内公式。
5. **长公式溢出**：加 `.katex-display{overflow-x:auto}`。
6. **中文排版**：正文用思源黑 / 宋或 Noto Sans/Serif SC，行高 1.8–2.0，段间距大于段内行距；公式行上下留白单独调（如 `my-6`）。
7. **MDX 与公式**：MDX 与 Markdown 共用同一个 processor（除非显式分开配置）；装 `@astrojs/mdx` 后确认公式在 `.mdx` 里也能渲染。
8. **部署**：纯静态 → GitHub Pages（[withastro/action](https://github.com/withastro/action)）/ Vercel / Netlify / Cloudflare Pages 都行，**不要装 adapter**；装了 adapter 会把全站切成按需渲染，反而丢掉 SSG 优势。

---

## 5. 本文明确标注「未核实」的项

1. **Astro 构建速度（build time）的官方 / 基准数字** —— 官方只有营销口径（40% faster / 90% less JS，且引用一条推文），无可复现 benchmark。
2. **withastro/astro 的 License 字段** —— 本次未读 LICENSE 正文。
3. **Firefly 的 `\ce{}`（mhchem）在构建期是否真正生效** —— 因 `rehype-katex` 使用自带 katex 0.16.x 实例，未经实测。
4. **Typography 的 Node 版本要求** —— 仓库有 `.nvmrc` 但未读取内容。
5. **各主题的实际构建耗时** —— 本次只做静态源码与官方文档核实，未跑 `pnpm build` 计时。
6. **PDF 导出效果** —— 未做打印 / PDF 实测。
7. **Retypeset 是否内置站内搜索** —— 源码中未见独立搜索组件，判定为「基本没有」，但未穷举所有 `src/pages`。

---

## 6. 参考链接汇总（全部为本次真实访问）

- Astro 官方文档：<https://docs.astro.build/en/guides/markdown-content/> · <https://docs.astro.build/en/reference/configuration-reference/#markdownprocessor> · <https://docs.astro.build/en/install-and-setup/> · <https://docs.astro.build/en/concepts/islands/> · <https://docs.astro.build/en/concepts/why-astro/> · <https://docs.astro.build/en/guides/deploy/github/> · <https://docs.astro.build/en/guides/deploy/vercel/> · <https://docs.astro.build/en/guides/deploy/netlify/> · <https://docs.astro.build/en/guides/deploy/cloudflare/>
- Astro 文档源文件（更精确）：[markdown-content.mdx](https://raw.githubusercontent.com/withastro/docs/main/src/content/docs/en/guides/markdown-content.mdx)、[configuration-reference.mdx](https://raw.githubusercontent.com/withastro/docs/main/src/content/docs/en/reference/configuration-reference.mdx)
- Astro 仓库与包：[withastro/astro](https://github.com/withastro/astro) · [packages/astro/package.json](https://raw.githubusercontent.com/withastro/astro/main/packages/astro/package.json) · [withastro/action](https://github.com/withastro/action)
- 数学插件：[remarkjs/remark-math](https://github.com/remarkjs/remark-math) · [remark-math readme](https://github.com/remarkjs/remark-math#when-should-i-use-this) · [rehype-katex readme](https://github.com/remarkjs/remark-math/tree/main/packages/rehype-katex) · [KaTeX 支持表](https://katex.org/docs/supported.html)
- npm：<https://registry.npmjs.org/astro> · <https://registry.npmjs.org/remark-math> · <https://registry.npmjs.org/rehype-katex> · <https://registry.npmjs.org/rehype-mathjax> · <https://registry.npmjs.org/katex>
- 主题：[saicaca/fuwari](https://github.com/saicaca/fuwari) / <https://fuwari.vercel.app> · [CuteLeaf/Firefly](https://github.com/CuteLeaf/Firefly) / <https://firefly.cuteleaf.cn> / <https://docs-firefly.cuteleaf.cn> · [satnaing/astro-paper](https://github.com/satnaing/astro-paper) / <https://astro-paper.pages.dev> · [moeyua/astro-theme-typography](https://github.com/moeyua/astro-theme-typography) / <https://astro-theme-typography.vercel.app> · [radishzzz/astro-theme-retypeset](https://github.com/radishzzz/astro-theme-retypeset) / <https://retypeset.radishzz.cc>

---

# 第四部分：Jekyll（含 Chirpy / al-folio）与 Valaxy

> **调研日期（本文全部数据的访问日期）：2026-09-11（UTC）**
> 工作目录：`D:\xyavid blog`（WSL：`/mnt/d/xyavid blog`）。
> 所有 star / release / 版本号均为当日实测；无法核实的内容显式标注「**未核实**」，不做推测。
> 通用数学背景（KaTeX vs MathJax 能力边界、构建期/客户端取舍、通用坑）见 `cross-cutting-latex.md`，本文只写各方案的具体落地。

> ⚠️ **重要**：本文**替换**了本文件早先的草稿。早先草稿因为「`_config.yml` 里搜不到 `math`」就断定 Chirpy / al-folio 的数学开关「未核实」。本次进一步核对了**主题源码 + 官方文档 + 历史 tag**，结论是明确的：
> - **Chirpy**：开关在**文章 front matter** 的 `math: true`（**不在** `_config.yml`）→ 见 §2.1.5
> - **al-folio**：开关在 **`_config.yml` 的 `enable_math: true`** → 见 §3.5
> 若已把旧草稿并入总报告，请用本文 §2.1.5 / §3.5 **替换**那两段「未核实」。

## 0. 取数与可信度说明

star 数主要取自 **GitHub 官方 REST API**（`api.github.com`，2026-09-11 实测）；API 配额（60 次/小时，按出口 IP 共享）耗尽后的少量对象改用第三方 GitHub 数据镜像 [ungh.cc](https://ungh.cc)，均在原处标注。release 时间取自官方 Atom feed（`https://github.com/OWNER/REPO/releases.atom`）。配置结论一律以 **raw 源码 / 官方文档原文**为准。

---

## 1. Jekyll 本体（jekyll/jekyll）

### 1.1 定位

Ruby 生态最老牌的 SSG（2008 年至今），**Liquid 模板 + Kramdown + 约定式目录结构**，是 GitHub Pages 的默认内置引擎。

### 1.2 技术栈

| 维度 | 事实 | 来源 |
| --- | --- | --- |
| 语言 | Ruby | GitHub API |
| 模板引擎 | **Liquid**（`liquid ~> 4.0`） | [jekyll.gemspec](https://github.com/jekyll/jekyll/blob/master/jekyll.gemspec) |
| 默认 Markdown | **Kramdown**（`kramdown ~> 2.3, >= 2.3.1`）+ `kramdown-parser-gfm ~> 1.0` | 同上 |
| 语法高亮 | Rouge（`>= 3.0, < 5.0`） | 同上 |
| 输出形态 | **纯静态 HTML**（`_site/`），默认不注入站点级 JS 框架 | [Deployment](https://jekyllrb.com/docs/deployment/) |
| 构建速度 | **官方无 benchmark → 未核实**。官方只对增量构建给定性说明：*"Incremental build only re-builds posts and pages that have changed, resulting in significant performance improvements for large sites, but may also break site generation in certain cases."*，且标为 **EXPERIMENTAL** | [Configuration Options · incremental](https://jekyllrb.com/docs/configuration/options/) |

仓库现状（2026-09-11，GitHub API）：stars **51,655**、forks **10,299**、open issues **258**、license **MIT**、created `2008-10-20`、last push `2026-08-03`、最近 release **[v4.4.1](https://github.com/jekyll/jekyll/releases/tag/v4.4.1)（`2025-01-29`）**。官网 <https://jekyllrb.com>。

### 1.3 部署方式

官方 [Deployment](https://jekyllrb.com/docs/deployment/) 分三档：[手动](https://jekyllrb.com/docs/deployment/manual/)（rsync / S3 / FTP / scp）、[自动 CI](https://jekyllrb.com/docs/deployment/automated/)（GitHub Actions / Travis / CircleCI / Buddy / Razorops）、[第三方托管](https://jekyllrb.com/docs/deployment/third-party/)（**GitHub Pages、GitLab Pages、Netlify、Vercel、Render、CloudCannon、AWS Amplify、DeployHQ、KeyCDN**）。

- **GitHub Pages ✅**：官方文档明确 *"Sites on GitHub Pages are powered by Jekyll behind the scenes"* → <https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll>
- **Netlify ✅ / Vercel ✅**：均在 Jekyll 官方 3rd-party 页中收录并附教程链接。
- **Cloudflare Pages ❌（未核实）**：**未出现**在 Jekyll 官方 3rd-party 列表中；Cloudflare 侧也未查到可引用的官方 Jekyll 指南。技术上可行，但不算「官方支持」。

#### 1.3.1 GitHub Pages 内置构建的版本天花板（关键限制）

GitHub Pages 用自己的一套 gem（github-pages）构建，**不是你 Gemfile 里的 Jekyll 4**。一手依赖清单：

```bash
curl -s https://pages.github.com/versions.json
```

2026-09-11 实测关键版本：**ruby 3.3.4、github-pages 232、jekyll 3.10.0、kramdown 2.4.0、kramdown-parser-gfm 1.1.0、liquid 4.0.4、rouge 3.30.0、jekyll-commonmark-ghpages 0.5.1**。
> 来源 <https://pages.github.com/versions.json>（`pages.github.com/versions/` 页面已 meta refresh 跳转到 `docs.github.com/pages`）

**GitHub Pages 强制锁定、用户不可改的配置**（官方原文）：

```yaml
lsi: false
safe: true
source: [your repo's top level directory]
incremental: false
highlighter: rouge
gist:
  noscript: false
kramdown:
  math_engine: mathjax
  syntax_highlighter: rouge
```

两条硬结论：

1. **内置构建永远是 Jekyll 3.10.0** → 依赖 Jekyll 4.x 的主题（Chirpy、al-folio）**无法走内置构建**。
2. **内置构建不能用白名单外的插件**。官方原文：*"GitHub Pages cannot build sites using unsupported plugins. If you want to use unsupported plugins, generate your site locally and then push your site's static files to GitHub."* `versions.json` 里**没有** `jekyll-archives` / `jekyll-scholar` / `katex` / `execjs`。

### 1.4 上手难度（准确命令）

官方要求（[Installation](https://jekyllrb.com/docs/installation/)）：Ruby **2.7.0+**（含开发头文件）、RubyGems、GCC 与 Make。

```bash
gem install jekyll bundler
jekyll new myblog
cd myblog
bundle exec jekyll serve          # → http://localhost:4000
bundle add webrick                # Ruby 3.0+ 若报错再执行
bundle exec jekyll serve --livereload
```

命令逐字来自 [Jekyll Quickstart](https://jekyllrb.com/docs/)。OS 安装指南：<https://jekyllrb.com/docs/installation/>。
> ⚠️ 官方明确 *"Jekyll is not officially supported for Windows."* → Windows 建议 WSL / Dev Container / Docker。

### 1.5 Markdown 渲染管线

```text
Markdown → front matter 解析 → Kramdown（默认 input: GFM）
         → Liquid 渲染 → Rouge 高亮 → HTML 输出 _site/
```

- **默认 Kramdown + GFM**。官方原文：*"By default, Jekyll uses the GitHub Flavored Markdown (GFM) processor for Kramdown."* → <https://jekyllrb.com/docs/configuration/markdown/>
- 可改 `kramdown: { input: Kramdown }`。
- **CommonMark**：插件 `jekyll-commonmark`（[jekyll/jekyll-commonmark](https://github.com/jekyll/jekyll-commonmark)，**41 stars**、last push `2023-09-21`，来源 ungh.cc）。官方：*"CommonMark ... implemented in C and thus faster than default Kramdown implemented in Ruby. It slightly differs from original Markdown and does not support all the syntax elements implemented in Kramdown."*
  → **换 CommonMark 会丢掉 Kramdown 的数学语法**（两个美元符的公式由 Kramdown 解析）。GitHub Pages 上对应 `jekyll-commonmark-ghpages` 0.5.1。

### 1.6 LaTeX 数学公式的具体实现（Jekyll 本体）

#### 1.6.1 Kramdown 默认引擎是 MathJax，但不会替你加载脚本

- [Kramdown Options](https://kramdown.gettalong.org/options.html)：`math_engine` —— *"If this option is set to `nil`, no math engine is used and the math blocks/spans are output as is."* **Default: `mathjax`**；配套 `math_engine_opts`（默认空 hash ```$$`）。
- [Kramdown HTML Converter](https://kramdown.gettalong.org/converter/html.html)：*"The default math engine is MathJax (which can also be used with KaTeX). **For proper functionality, the HTML template must be configured to link to the engine's Javascript and CSS.**"* 引擎列表：MathJax / KaTeX / SsKaTeX / Mathjax-Node / Ritex / itex2MML；其中 *"precompiling versions ... Mathjax-Node, KaTeX, and SsKaTeX. Each one requires a Javascript engine installed where kramdown runs."*

> **最大坑**：默认 `math_engine: mathjax` 只把公式转成 MathJax 认得的标记，**不引入脚本**。不自己加载就是裸露源码。GitHub Pages 内置构建同样锁定该值，也同样不给脚本。

#### 1.6.2 Kramdown 的数学语法（决定所有写法）

原文（<https://kramdown.gettalong.org/syntax.html>，Math Blocks 一节）：

- 块级：*"A math block needs to start and end on **block boundaries**. It is started using two dollar signs... The math block continues until the next two dollar signs ... that appear at the **end of a line**, i.e. they may only be followed by whitespace characters."*
- 行内：*"Using inline math is also easy: just surround your math content with **two dollar signs**, like with a math block."* → **Kramdown 行内也是 `$$，不是 `$**。写 `$x$` 不会被当数学。
- 转义：想让它当段落而不是数学块 → 转义第一个 `$`（`\$$ 5 + 5 $$`）；完全不想当数学 → 转义前两个（`\$\$ 5 + 5 $$`）。
- 竖线冲突：*"LaTeX code that uses the pipe symbol `|` in inline math statements may lead to a line being recognized as a **table line**. This problem can be avoided by using the `\vert` command instead of `|`."*

#### 1.6.3 方案 A：MathJax 客户端渲染（默认，零 gem 依赖）

```yaml
# _config.yml
kramdown:
  math_engine: mathjax          # 默认值，可省
  math_engine_opts: {}          # 默认值
```

**必须**自己在布局里引入（例如 `_layouts/default.html` 的 `</head>` 前）：

```html
<script>
  window.MathJax = {
    tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']],
      displayMath: [['$$', '$$'], ['\\[', '\\]']],
      tags: 'ams'
    }
  };
</script>
<script id="MathJax-script" async
  src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
```

- **客户端渲染**，产出 CHTML，需 CSS/字体（CDN 版自带）。
- 行内：Kramdown 侧用两个美元符；要单 `$` 也生效需在 `inlineMath` 里加 `['$','$']`——但**单美元符在 Kramdown 层仍是普通文本**，能否渲染完全取决于 MathJax 是否加载成功。
- 宏：`tags: 'ams'` 提供 AMS 编号（`\begin{equation}\label{}\eqref{}`）；`\newcommand` 属 MathJax TeX 宏系统（<https://docs.mathjax.org/en/latest/input/tex/macros/index.html>），**具体边界未逐条实测 → 未核实**。
- **常见坑**：① 公式与正文同段 → 被当行内；想行内却单独成段 → 变 display（块级起止必须落在 block boundary）；② `$$|x|$$` 被当表格 → 用 `\vert`；③ 默认不引 CDN，必须先加 `<script>`；④ 离线/内网需自托管。

#### 1.6.4 方案 B：KaTeX 服务端预渲染（`kramdown-math-katex`）

- gem：`kramdown-math-katex`，仓库 [kramdown/math-katex](https://github.com/kramdown/math-katex)（**10 stars**、last push `2019-01-30`，来源 ungh.cc —— **长期未更新**）
- 安装：`gem install kramdown-math-katex`（或 Gemfile 里 `gem "kramdown-math-katex"`）
- 配置：

```yaml
kramdown:
  math_engine: katex
  math_engine_opts: {}     # 直接透传给 Katex.render
```

- 依赖（官方 README 原文）：`kramdown-math-katex` + `katex` gem + `execjs` gem + **一个 ExecJS 支持的 JS 引擎**（`therubyracer` / `therubyrhino` / `duktape` / **Node.js**）。*"Note that the katex gem includes KaTeX's Javascript, CSS, and fonts... Your HTML templates still need to reference the KaTeX CSS."*
- **构建期（服务端）渲染**：*"This eliminates the need for client-side math-rendering Javascript."*
- **GitHub Pages 内置构建不可用**：`katex` / `execjs` 不在 `versions.json`，该 gem 也非白名单插件 → 必须 Actions / 本地构建。
- 坑：ExecJS 找不到 JS 运行时（`RuntimeError: Could not find a JavaScript runtime`）、CI 没装 Node、`mini_racer`/`therubyracer` 的平台编译问题。

#### 1.6.5 替代方案：jekyll-spaceship

- [jeffreytse/jekyll-spaceship](https://github.com/jeffreytse/jekyll-spaceship)：**667 stars**、forks 74（ungh.cc）、**last push `2024-07-03`**（约两年未更新）。
- `_config.yml`（片段逐字来自其 README raw）：

```yaml
jekyll-spaceship:
  processors: [table-processor, mathjax-processor, mermaid-processor, emoji-processor]
  mathjax-processor:
    src:
      - https://polyfill.io/v3/polyfill.min.js?features=es6
      - https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js
    config:
      tex:
        inlineMath: [['$','$'], ['\\(','\\)']]
        displayMath: [['$$','$$'], ['\\[','\\]']]
      svg:
        fontCache: 'global'
    optimize:                # 构建期扫描页面，只在含公式的页注入脚本
      enabled: true
      include: []
      exclude: []
```

- 引擎：**MathJax 3**（客户端渲染）；插件只做「按需注入脚本」的优化；单/双美元符都支持。
- 坑：**GitHub Pages 内置构建不支持**（非白名单插件）；默认从 `polyfill.io` 拉脚本——该域名在 2024 年发生过被第三方接管的供应链安全事件（**本次未独立核实细节**），建议删掉或自托管；仓库近两年无提交。

### 1.7 视觉风格

- Jekyll **本体不带观感**：只输出 HTML，样式全来自主题（[Themes](https://jekyllrb.com/docs/themes/) / [Showcase](https://jekyllrb.com/showcase/)）。
- GitHub Pages 默认给的官方主题近乎无设计：`minima 2.5.1`、`jekyll-theme-primer`、`cayman`、`midnight` 等（见 `versions.json`）。
- **不用 Tailwind**；要好看必须选第三方主题。

### 1.8 优缺点与适用人群

**优点**：生态最老、资料最多；GitHub Pages 零配置可上线；纯静态、客户端 JS 近零；`jekyll-scholar` 等学术插件成熟；Liquid 对写作者透明。
**缺点**：Ruby 环境门槛最高（Windows 官方不支持）；GitHub Pages 锁死 Jekyll 3.10.0 + 插件白名单；构建速度无官方数据、增量构建 EXPERIMENTAL 且被 Pages 强制关闭；Kramdown 数学语法与主流写法不一致。
**适合**：想要零成本零运维的个人博客（内置构建 + 白名单插件）；需要 `jekyll-scholar` 且愿意用 Actions 的人（→ al-folio）；重文章列表/标签/侧边栏的英文技术博客（→ Chirpy）。

---

## 2. Jekyll 主题（一）：Chirpy（cotes2020/jekyll-theme-chirpy）

### 2.1.1 技术栈

| 维度 | 事实 | 来源 |
| --- | --- | --- |
| 底座 | Jekyll 4 主题（Ruby gem）+ **Bootstrap 5** + Sass + 原生 JS | 仓库 topics（GitHub API） |
| gem | `jekyll-theme-chirpy`，版本 **7.6.0** | [gemspec](https://github.com/cotes2020/jekyll-theme-chirpy/blob/master/jekyll-theme-chirpy.gemspec) |
| **Ruby 要求** | `required_ruby_version = "~> 3.1"` | gemspec |
| Jekyll 要求 | `jekyll ~> 4.3` | gemspec |
| 依赖 | `jekyll-paginate ~> 1.1`、`jekyll-seo-tag ~> 2.8`、**`jekyll-archives ~> 2.2`**、`jekyll-sitemap ~> 1.4`、`jekyll-include-cache ~> 0.2` | gemspec |
| 输出形态 | 纯静态 HTML + 按需 JS（搜索/TOC/PWA/暗色）；MathJax 只在 `math: true` 的页面加载 | [js-selector.html](https://github.com/cotes2020/jekyll-theme-chirpy/blob/master/_includes/js-selector.html) |
| 构建速度 | **官方无 benchmark → 未核实** | — |

仓库现状：stars **10,256**、forks **7,147**、open issues **35**、license **MIT**、created `2019-01-12`、last push `2026-09-10`、最近 release **[v7.6.0](https://github.com/cotes2020/jekyll-theme-chirpy/releases/tag/v7.6.0)（`2026-06-20`）**。文档/演示站 <https://chirpy.cotes.page>。

### 2.1.2 部署方式

**⚠️ Chirpy 不能走 GitHub Pages 内置构建**：① 依赖 `jekyll-archives`（不在 `versions.json` 白名单）；② 要求 Jekyll `~> 4.3`，Pages 内置只有 3.10.0。官方依据：<https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll>。

官方 [Getting Started](https://chirpy.cotes.page/posts/getting-started/) 给出：

- **推荐 GitHub Actions**：Settings → Pages → Build and deployment → Source 选 **GitHub Actions**；推送即触发 `Build and Deploy`；本机非 Linux 且提交了 `Gemfile.lock` 时先跑 `bundle lock --add-platform x86_64-linux`。
- **手动构建**：`JEKYLL_ENV=production bundle exec jekyll b` → 上传 `_site/`。

Vercel / Netlify / Cloudflare Pages：Chirpy 官方文档**未给出**配置 → **未核实**（技术上可行，非官方支持）。

### 2.1.3 上手难度（准确命令）

**路径 1（官方推荐）：starter 模板** —— [cotes2020/chirpy-starter](https://github.com/cotes2020/chirpy-starter) → `Use this template` 建仓（仓库名必须 `<username>.github.io`）→ 本地：

```bash
bundle install
bundle exec jekyll serve        # → http://127.0.0.1:4000
```

> 需要 starter 的原因（其 README 原文）：*"When installing Chirpy through RubyGems.org, Jekyll can only read a subset of theme files (`_data`, `_layouts`, `_includes`, `_sass`, `assets`) and limited `_config.yml` options from the gem."* starter 额外带 `_config.yml` / `_plugins` / `_tabs` / `index.html`。

**路径 2：fork 主题仓库**（要深度改 UI 才用，升级困难）。
**纯 gem 方式**：`gem install jekyll-theme-chirpy` 或 `bundle add jekyll-theme-chirpy`（功能受限）。

**运行时要求**：Ruby **~> 3.1** + Jekyll 4.3+。Windows 官方建议 Dev Container（Docker）：*"Dev Containers offer an isolated environment using Docker... (Recommended for Windows)"*。

### 2.1.4 Markdown 渲染管线

Kramdown（GFM input）；主题 `_config.yml` 只覆写高亮与 footnote：

```yaml
kramdown:
  footnote_backlink: "&#8617;&#xfe0e;"
  syntax_highlighter: rouge
  syntax_highlighter_opts:
    css_class: highlight
    span:
      line_numbers: false
    block:
      line_numbers: true
      start_line: 1
```
（[chirpy `_config.yml`](https://github.com/cotes2020/jekyll-theme-chirpy/blob/master/_config.yml) raw 一手）

Liquid 模板（`_includes` / `_layouts` / `_tabs`）；`_data/locales` 多语言；Rouge 高亮；JS 资源版本集中在 `_data/origin/cors.yml`，DOM 组装在 `_includes/js-selector.html`。

### 2.1.5 LaTeX 数学公式（**核实结果：不是 `_config.yml` 的 `math: true`**）

> 任务描述里提到「我记得有 `_config.yml` 的 `math: true`」——**经核实，这个记忆不准确**。开关在**文章 front matter**。

**三条独立证据**：

1. 判决条件是 `page.math`：

   ```liquid
   {% if page.math %}
     <!-- MathJax -->
     <script src="{{ '/assets/js/data/mathjax.js' | relative_url }}"></script>
     <script id="MathJax-script" async src="{{ site.data.origin[type].mathjax.js | relative_url }}"></script>
   {% endif %}
   ```
   → [`_includes/js-selector.html`](https://github.com/cotes2020/jekyll-theme-chirpy/blob/master/_includes/js-selector.html)（第 68–72 行）

2. `_config.yml` **没有** `math` 键。逐版本核对 raw：`v5.6.1`、`v6.5.5`、`v7.0.0`、master（v7.6.0）四份全部零命中：
   - <https://raw.githubusercontent.com/cotes2020/jekyll-theme-chirpy/master/_config.yml>
   - <https://raw.githubusercontent.com/cotes2020/jekyll-theme-chirpy/v6.5.5/_config.yml>
   - <https://raw.githubusercontent.com/cotes2020/jekyll-theme-chirpy/v5.6.1/_config.yml>

3. 官方文档给的就是 front matter：*"We use MathJax to generate mathematics. For website performance reasons, the mathematical feature won't be loaded by default. But it can be enabled by:"*

   ```yaml
   ---
   math: true
   ---
   ```
   → <https://chirpy.cotes.page/posts/write-a-new-post/>

**引擎与版本**：**MathJax 4**（不是 3），走 jsDelivr、**客户端渲染**：

```yaml
mathjax:
  js: https://cdn.jsdelivr.net/npm/mathjax@4/tex-mml-chtml.js
```
→ [`_data/origin/cors.yml`](https://github.com/cotes2020/jekyll-theme-chirpy/blob/master/_data/origin/cors.yml) 第 57–58 行

**配置位置与真实片段**：自 **v7.0.0** 起，MathJax 选项移到**站点仓库**的 `assets/js/data/mathjax.js`（官方：*"copy that file from the gem installation directory (check with command `bundle info --path jekyll-theme-chirpy`)"*）。真实内容（[raw](https://raw.githubusercontent.com/cotes2020/jekyll-theme-chirpy/master/assets/js/data/mathjax.js)）：

```js
MathJax = {
  tex: {
    inlineMath: [ ['$', '$'], ['\\(', '\\)'] ],
    displayMath: [ ['$$', '$$'], ['\\[', '\\]'] ],
    tags: 'ams'
  },
  output: { displayOverflow: 'scroll' }
};
```

**公式写法（官方规则）**：

| 场景 | 语法 |
| --- | --- |
| 块级（display） | 两个美元符，**前后必须有空行** |
| 行内（段落中） | 两个美元符，**前后不能有空行** |
| 行内（列表里） | `\$$ math $$`（**转义第一个 `$`**） |
| 编号 + 引用 | `\begin{equation} ... \label{eq:label_name}\end{equation}` 包在双美元符内；正文用 `\eqref{eq:label_name}` |

**宏/环境**：`tags: 'ams'` ⇒ AMS 编号环境与 `\label` / `\eqref` **可用**；`\newcommand` 属 MathJax 4 TeX 宏范围（<https://docs.mathjax.org/en/latest/input/tex/macros/index.html>），**具体边界未逐条实测 → 未核实**。

**常见坑**：① 以为 `_config.yml` 有全局开关 → 没有；② 块级公式前后忘留空行 → 被当行内；③ 列表内的行内公式未转义 → 被列表语法吃掉；④ v7.0.0 起配置在站点仓库 `assets/js/data/mathjax.js`，用 gem 装的人不拷贝就改不了；⑤ MathJax 走 `cdn.jsdelivr.net`，国内可改 `_data/origin/cors.yml` 或用 [chirpy-static-assets](https://github.com/cotes2020/chirpy-static-assets) 自托管；⑥ PWA 默认开启，改配置后不生效先清 Service Worker；⑦ **无 PDF 导出能力**。

### 2.1.6 视觉风格

- 定位：*"A minimal, responsive, and feature-rich Jekyll theme for technical writing."*（仓库 description）
- 底座 **Bootstrap 5** + Sass；`theme_mode: [light | dark]`（留空跟随系统 + 切换按钮）。
- 默认**简约、文本优先**：左侧固定侧边栏（头像 + 站点信息 + 社交），正文居中 + 右侧 TOC；无重动效。
- 定制：复制 `assets/css/jekyll-theme-chirpy.scss` 到同路径末尾追加；`_data/origin/cors.yml` 管 CDN；`_data/contact.yml` 管社交。
- **GitHub**：<https://github.com/cotes2020/jekyll-theme-chirpy>　**示例站**：<https://chirpy.cotes.page>（官方文档站本身）、gemspec 登记的 demo <https://cotes2020.github.io/chirpy-demo>（本次访问跳到 `chirpy.cotes.page`）。第三方站点清单官方未维护 → **未核实**。

### 2.1.7 优缺点与适用人群

**优点**：开箱即用的博客全套（归档/分类/标签/相关阅读/TOC/搜索/PWA/暗色/评论 giscus·utterances·disqus）；维护活跃；文档质量高；UI 简约。
**缺点**：① 数学只能逐篇 front matter 开、只有 MathJax 客户端渲染；② 必须走 GitHub Actions；③ 定制深度有限（大改要 fork）；④ Ruby 门槛 + Windows 需 Docker/WSL。
**适合**：中英文技术博客作者、工程师个人站；**公式只要偶尔能用**的人。**不要当公式密集方案。**

---

## 3. Jekyll 主题（二）：al-folio（alshedivat/al-folio）

### 3.1 技术栈

| 维度 | 事实 | 来源 |
| --- | --- | --- |
| 定位 | *"A beautiful, simple, clean, and responsive Jekyll theme for academics"* | 仓库 description（GitHub API） |
| 底座 | Jekyll + Bootstrap + MDB + Sass + Liquid（`_includes` 里几乎全是 `.liquid`） | [`_includes/`](https://github.com/alshedivat/al-folio/tree/master/_includes) |
| 输出形态 | 纯静态 HTML；按需加载 MathJax / Mermaid / TikZJax / chartjs | [`_includes/scripts/`](https://github.com/alshedivat/al-folio/tree/master/_includes/scripts) |
| 构建速度 | **官方无 benchmark → 未核实**（README 里的 Lighthouse 是页面性能分，不是构建耗时） | [README](https://github.com/alshedivat/al-folio#lighthouse-pagespeed-insights) |

仓库现状：stars **16,121**、forks **13,082**、open issues **18**、license **MIT**、created `2016-05-30`、last push `2026-09-07`、最近 release **[al-folio v1.2](https://github.com/alshedivat/al-folio/releases/tag/v1.2)（`2026-08-09`）**（来源官方 `releases.atom`）。demo <https://alshedivat.github.io/al-folio/>。

**插件依赖极重**（[Gemfile](https://github.com/alshedivat/al-folio/blob/master/Gemfile) 原文）：`classifier-reborn、jekyll-archives、jekyll-email-protect、jekyll-feed、jekyll-get-json、jekyll-imagemagick、jekyll-jupyter-notebook、jekyll-link-attributes、jekyll-minifier、jekyll-paginate-v2、jekyll-regex-replace、jekyll-scholar、jekyll-tabs、jekyll-toc、jekyll-twitter-plugin、jemoji、mini_racer、unicode_utils、webrick`。
→ 其中 `jekyll-scholar` / `jekyll-imagemagick` / `jekyll-minifier` / `jekyll-paginate-v2` / `mini_racer` 等**全不在** `versions.json` 白名单 → **al-folio 必须走 GitHub Actions 构建**。

### 3.2 部署方式

官方 [INSTALL.md](https://github.com/alshedivat/al-folio/blob/master/INSTALL.md) 推荐路径（GitHub Pages + Actions）：

1. 用模板建仓（仓库名必须 `<username>.github.io`）
2. Settings → Actions → General → Workflow permissions → **Read and write permissions**
3. `_config.yml`：`url` 设为 `https://<username>.github.io`，`baseurl` **留空但不要删**
4. 等 `Deploy site` workflow 跑完（官方说明 **约 4 分钟**）→ 仓库多出 `gh-pages` 分支
5. Settings → Pages → Source 选 **Deploy from a branch**，分支 **`gh-pages`**（不是 master）
6. 等 `pages-build-deployment` 跑完（官方说明 **约 45 秒**）

- 项目页：`baseurl: /<repo>/`
- 手动部署：`bundle exec jekyll build` → 上传 `_site/`（可选 `purgecss -c purgecss.config.js`）
- **非 GitHub Pages 托管**：INSTALL.md 只说「把 `_site/` 拷到服务器」，**没有** Netlify/Vercel/Cloudflare Pages 官方配置 → **未核实/非官方支持**
- **GitHub Pages 内置构建**：❌ 不可行

### 3.3 上手难度（准确命令）

**A. Docker（官方推荐）**：

```bash
docker compose pull
docker compose up                      # → http://localhost:8080
docker compose -f docker-compose-slim.yml up   # 精简镜像 <100MB
```
首次约拉 400MB 镜像。

**B. Dev Containers**：VSCode 打开仓库按提示安装扩展（<https://containers.dev/supporting>）。

**C. 传统本地（官方标注 *"Legacy, no longer supported"*）**：

```bash
bundle install
pip install jupyter          # jekyll-jupyter-notebook 需要 Python
bundle exec jekyll serve     # → http://localhost:4000
```

官方明确建议 Windows 用 **WSL**：*"If you are using Windows, it is highly recommended to use Windows Subsystem for Linux (WSL)"*。仓库 `Dockerfile` 第一行是 `FROM ruby:latest`（**Ruby 版本未 pin → 下限未核实**）。

### 3.4 Markdown 渲染管线

**Kramdown，`input: GFM`**（[`_config.yml`](https://github.com/alshedivat/al-folio/blob/master/_config.yml) 第 220 行）：

```yaml
kramdown:
  input: GFM
  syntax_highlighter_opts:
    css_class: "highlight"
    span: { line_numbers: false }
    block: { line_numbers: false, start_line: 1 }
```

语法高亮用 `jekyll-pygments-themes`（GitHub 风格 CSS）。`_config.yml` 中**没有** `math_engine` 覆写 → 走 Kramdown 默认 `mathjax`。

### 3.5 LaTeX 数学公式（核实结果）

**结论：纯客户端 MathJax 3.2.2，站点级开关；没有用 jekyll-katex / kramdown-math-katex。**

**开关**（[`_config.yml`](https://github.com/alshedivat/al-folio/blob/master/_config.yml) 第 435 行）：

```yaml
enable_math: true # enables math typesetting (uses MathJax)
```

**注入点**（[`_includes/scripts/mathjax.liquid`](https://github.com/alshedivat/al-folio/blob/master/_includes/scripts/mathjax.liquid)，raw 全文仅 627 字节）：

```liquid
{% if site.enable_math %}
  {% unless page.pseudocode %}
    <!-- MathJax -->
    <script type="text/javascript">
      window.MathJax = { tex: { tags: 'ams' } };
    </script>
    <script defer type="text/javascript" id="MathJax-script"
      src="{{ site.third_party_libraries.mathjax.url.js }}"
      integrity="{{ site.third_party_libraries.mathjax.integrity.js }}"
      crossorigin="anonymous"></script>
    <script defer src="{{ site.third_party_libraries.polyfill.url.js }}" crossorigin="anonymous"></script>
  {% endunless %}
{% endif %}
```

**版本与 URL**（[`_config.yml`](https://github.com/alshedivat/al-folio/blob/master/_config.yml) 第 539–547 行）：

```yaml
third_party_libraries:
  download: false   # true 则把这些库下载到本地使用
  mathjax:
    integrity:
      js: "sha256-MASABpB4tYktI2Oitl4t+78w/lyA+D7b/s9GEP0JOGI="
    local:
      fonts: "output/chtml/fonts/woff-v2/"
    url:
      fonts: "https://cdn.jsdelivr.net/npm/mathjax@{{version}}/es5/output/chtml/fonts/woff-v2/"
      js: "https://cdn.jsdelivr.net/npm/mathjax@{{version}}/es5/tex-mml-chtml.js"
    version: "3.2.2"
```

| 问题 | 答案 |
| --- | --- |
| KaTeX 还是 MathJax？ | **MathJax 3.2.2**（jsDelivr CDN，带 SRI integrity） |
| 构建期还是客户端？ | **客户端**（`defer` 加载） |
| 行内公式 | 两个美元符且**前后不留空行** |
| 显示公式 | 独立成段的两个美元符；也支持 `\begin{equation}...\end{equation}` |
| AMS 宏包 | `tags: 'ams'` → `equation` 自动编号、`\label`/`\eqref` |
| `\newcommand` | **具体边界未逐条核实 → 未核实** |
| 是否用 `jekyll-katex` / `kramdown-math-katex`？ | **否**（无 `math_engine` 覆写、无对应依赖） |
| 伪代码冲突 | `pseudocode: true` 的页面**不加载** MathJax（`{% unless page.pseudocode %}`） |

官方示例文章源：[`_posts/2015-10-20-math.md`](https://github.com/alshedivat/al-folio/blob/master/_posts/2015-10-20-math.md)；渲染结果 <https://alshedivat.github.io/al-folio/blog/2015/math/>（本次 200）。原文：*"You just need to surround your math expression with `$$`... If you leave it inside a paragraph, it will produce an inline expression... To use display mode, again surround your expression with `$$` and place it as a separate paragraph."*
→ 「同一符号靠位置区分行内/块级」正是 Kramdown 语义，**不是 al-folio 自创**。

**常见坑**：① `$$|x|$$` 被当表格（用 `\vert`）；② `enable_math` 是**全站**开启，纯文字页也有 MathJax + polyfill 开销；③ CDN 依赖，可用 `third_party_libraries.download: true` 落地；④ **SRI 校验**——升级 MathJax 时忘改 `integrity` 会静默失败；⑤ **无 PDF 导出**。

### 3.6 视觉风格

- **学术主页风**：About 页 =「头像 + 简介 + 社交 + News」，导航含 Blog / Publications / Projects / CV / Teaching；留白大、信息密度高。
- 底座 Bootstrap + MDB，**CSS 变量换色**：默认紫色，改 `_sass/_themes.scss` 的 `--global-theme-color`（README 原文）；预置色板 [`_sass/_variables.scss`](https://github.com/alshedivat/al-folio/blob/master/_sass/_variables.scss)。
- 默认**简约但不极简**（卡片、过渡动效、暗色模式 `enable_darkmode`）。
- 可定制：Distill 风格 `<d-*>`、TikZJax、chartjs、mermaid、pseudocode、图片 grid、`bib_search`、博客/项目/教学/书籍 collection。
- **GitHub**：<https://github.com/alshedivat/al-folio>　**示例站**（README "User community" 一手清单）：<https://maruan.alshedivat.com>、<https://martinbulla.github.io>、<https://maithraraghu.com>、CMU 课程站 <https://cmudeeprl.github.io/703website_f23/>、ICLR Blog Post Track <https://iclr-blogposts.github.io/2024/about>；完整列表 <https://github.com/alshedivat/al-folio#user-community>。

### 3.7 优缺点与适用人群

**优点**：学术场景功能最全（`jekyll-scholar` 文献、CV、Publications、Teaching、People、News）；**数学站点级默认开启**；CSS 变量换色方便；社区案例多；Pages + Actions 流程官方写得很清楚。
**缺点**：① 依赖极重（20+ gems + Python/Jupyter + Node），首装/CI 慢；② 传统本地安装官方标 "no longer supported"，实际必须 Docker/WSL；③ MathJax 全站加载；④ 主要面向英文，中文排版需自补 CSS；⑤ 公式只有客户端渲染一条路。
**适合**：高校/研究所**个人学术主页 + 博客**、课程主页、workshop / conference 主页、实验室主页 —— **本次调研里「学术/公式密集」最匹配的 Jekyll 方案**。

---

## 4. Valaxy（YunYouJun/valaxy）

### 4.1 技术栈

| 维度 | 事实 | 来源 |
| --- | --- | --- |
| 定位 | *"Next Generation Static Blog Framework (Beta) 下一代静态博客框架（支持页面/配置热重载）"* | 仓库 description |
| 语言 | **TypeScript**（全仓 TS/Vue） | 源码 |
| 核心 | **Vue 3（`vue ^3.5.41` peer）+ Vite + Vue Router 5 + Pinia 3** | [`packages/valaxy/package.json`](https://github.com/YunYouJun/valaxy/blob/main/packages/valaxy/package.json) |
| 样式方案 | **UnoCSS 66.7.2**（workspace `overrides` 强制统一）——**不是 Tailwind** | [`pnpm-workspace.yaml`](https://github.com/YunYouJun/valaxy/blob/main/pnpm-workspace.yaml) |
| Markdown | **markdown-it ^15.0.1** + `@mdit-vue/*`（component/frontmatter/headers/toc/sfc/title）+ markdown-it-anchor/attrs/container/emoji/footnote/task-lists/table-of-contents/image-figures + `markdown-exit` + **Shiki ^3.23.0** | 同上 |
| 输出形态 | 默认输出**带客户端 JS 的 Vue 水合静态站**；模板另有 SSG 预渲染脚本（`valaxy build --ssg`；`demo/yun` 下有 `build:ssg`） | [Deployment](https://valaxy.site/guide/deploy) |
| 版本 | monorepo `@valaxyjs/monorepo` **1.0.0-rc.9**，`pnpm@10.34.4` | 根 `package.json` |
| **Node 要求** | **`engines: { node: ">=22.12.0" }`**。官方解释：来自 `unplugin-vue-markdown@32` + Vite 8（需 Node 20.19+/22.12+） | 根 `package.json` + [Getting Started](https://valaxy.site/guide/getting-started) |
| 构建速度 | **官方无 benchmark → 未核实**。官方仅给内存提示：SSG 构建约需 **4GB 堆** | [Deployment](https://valaxy.site/guide/deploy) |

仓库现状：stars **1,127**、forks **134**（ungh.cc）、license **MIT**、created `2022-03-08`、last push `2026-08-30`、最近 release **[v1.0.0-rc.9](https://github.com/YunYouJun/valaxy/releases/tag/v1.0.0-rc.9)（`2026-08-28`）**（官方 `releases.atom`）。官网 <https://valaxy.site>、**中文文档** <https://valaxy.site/zh>。

**「中文圈活跃度」诚实评估**：作者是中文开发者（YunYouJun），**官方文档有完整中文版**，内置 i18n（Vue i18n + CSS i18n），模板默认中文注释与中文社区链接；但 **1,127 stars** 相对 Hexo（数万级）/ VitePress（约 2 万级）属**小众**，且**仍是 `1.0.0-rc.9`，未 GA**。结论：**中文文档与社区氛围好，但绝对体量小、未 GA**。

### 4.2 部署方式

官方 [Deployment](https://valaxy.site/guide/deploy) 一手覆盖：

| 平台 | 官方支持 | 具体方式 |
| --- | --- | --- |
| **GitHub Pages** | ✅ | 模板自带 `.github/workflows/gh-pages.yml`（`peaceiris/actions-gh-pages@v3`，`publish_dir: ./dist`，`force_orphan: true`）。仓库名非 `<user>.github.io` 时需配 `base: '/repo/'` |
| **Netlify** | ✅ | 模板自带 `netlify.toml`：`publish = "dist"`、`command = "pnpm run build"`、`NODE_VERSION = "20"` |
| **Vercel** | ✅ | Dashboard → Add New → Project → Import → Framework Preset 选 **Other** → 输出目录填 `dist` |
| **Cloudflare Pages** | ✅ | Workers and Pages → Create project → Connect to Git → Build 命令 `pnpm build`、输出目录 `dist` |
| Nginx / Docker | ✅ | 官方给出 `nginx.conf`（cleanUrls 用 `try_files $uri $uri.html $uri/ =404`）与 `Dockerfile` |

GH Pages 步骤（文档原文）：Settings → Action → General → Workflow permissions 选 **read and write**；Settings → Pages 把发布分支选为 **`gh-pages`**。

**base 路径**（v1.0.0-rc.4 起对齐 VitePress 并默认开启）：

```ts
// valaxy.config.ts
import { defineValaxyConfig } from 'valaxy'
export default defineValaxyConfig({
  siteConfig: { url: 'https://user.github.io/repo/' },
  vite: { base: '/repo/' },
})
```

### 4.3 上手难度（准确命令）

**前置**：Node.js **≥ 22.12.0**、pnpm（官方推荐 `npm i -g pnpm`）。Windows 官方建议 **Git Bash 或 WSL**，不要用 CMD/PowerShell。

```bash
pnpm create valaxy          # 交互：type → Blog；project → valaxy-blog；主题 Yun / Press / Custom
cd valaxy-blog
pnpm i
pnpm dev                    # → http://localhost:4859/
pnpm run build              # 产物在 dist/
NODE_OPTIONS=--max-old-space-size=4096 pnpm build   # SSG 内存不足时
pnpm add valaxy@latest && pnpm add valaxy-theme-yun@latest   # 升级
```

来源：[Getting Started](https://valaxy.site/guide/getting-started) / [Deployment](https://valaxy.site/guide/deploy)。最小项目结构：`pages/`、`valaxy.config.ts`、`package.json`。

### 4.4 Markdown 渲染管线

```text
.md → markdown-it ^15.0.1
      ├─ @mdit-vue/plugin-frontmatter / headers / toc / component / sfc / title
      ├─ markdown-it-anchor / attrs / container / emoji / footnote /
      │  task-lists / table-of-contents / image-figures
      ├─ 数学：内建 KaTeX 插件（默认）或 markdown-it-mathjax3
      └─ Shiki ^3.23.0 代码高亮
    → Vue SFC（unplugin-vue-markdown）→ Vite → 静态产物
```
来源：[`setup.ts`](https://github.com/YunYouJun/valaxy/blob/main/packages/valaxy/node/plugins/markdown/setup.ts)、[`package.json`](https://github.com/YunYouJun/valaxy/blob/main/packages/valaxy/package.json)。

官方 [Markdown Extensions](https://valaxy.site/guide/markdown) 原文：*"Unlike Hexo, Valaxy implements some Markdown extensions (such as Container, math formulas) at the framework level... This is similar to many features of VitePress. Valaxy has borrowed a lot from VitePress and reuses plugins from mdit-vue."*

### 4.5 LaTeX 数学公式（核实结果）

#### 4.5.1 双引擎：KaTeX（默认）/ MathJax（可选）

官方 [Markdown Extensions](https://valaxy.site/guide/markdown) 原文：

> *"Valaxy uses KaTeX by default (fast rendering speed), and also supports MathJax (aligned with VitePress, SVG output without external CSS/fonts)."*
> *"Note: Do not enable `features.katex` and `math` at the same time. They use different rendering engines... When `math` (MathJax) is enabled, `features.katex` will be automatically ignored."*

**配置位置：项目根目录的 `valaxy.config.ts`**（官方文档逐字）：

```ts
export default defineValaxyConfig({
  // KaTeX (enabled by default)
  features: { katex: true },
  // Or switch to MathJax (install first: pnpm add markdown-it-mathjax3)
  // math: true,
})
```

类型定义中的官方说明（[`node/types/config.ts`](https://github.com/YunYouJun/valaxy/blob/main/packages/valaxy/node/types/config.ts)）：`katex: boolean`（`@default true`；全局开，可用 `frontmatter.katex: false` 单页关）；`math: boolean`（`@default false`，**与 features.katex 互斥**，启用后 katex 被自动忽略，需先装 `markdown-it-mathjax3`）。

另有 markdown 级选项（[`node/plugins/markdown/types.ts`](https://github.com/YunYouJun/valaxy/blob/main/packages/valaxy/node/plugins/markdown/types.ts)）：

```ts
/** @see https://katex.org/docs/options.html */
katex?: KatexOptions
/** Options for `markdown-it-mathjax3` @see https://github.com/tani/markdown-it-mathjax3 */
mathjax?: any
```
→ 即在 `valaxy.config.ts` 里用 `markdown: { katex: {...}, mathjax: {...} }` 透传引擎选项。

#### 4.5.2 精确的插件名与安装命令

| 引擎 | 包名（npm） | 安装命令 | 版本 |
| --- | --- | --- | --- |
| **KaTeX（默认）** | **内建**（不是第三方 markdown-it 插件）；Valaxy 自维护一份 vendored 实现，依赖 `katex` npm 包 | 无需安装（`valaxy` 已依赖 `katex`） | `katex ^0.16.47`（catalog） |
| **MathJax（可选）** | **`markdown-it-mathjax3`** | `pnpm add markdown-it-mathjax3` | catalog 登记 `^5.2.0` |

> ⚠️ **重要澄清**：Valaxy **不是**直接依赖 `markdown-it-katex` 或 `@mdit/plugin-katex`。其 KaTeX 实现是**源码内 vendored** 的 markdown-it 插件：
> [`packages/valaxy/node/plugins/markdown/plugins/markdown-it/katex.ts`](https://github.com/YunYouJun/valaxy/blob/main/packages/valaxy/node/plugins/markdown/plugins/markdown-it/katex.ts)，
> 文件头注释：`// copy from https://github.com/slidevjs/slidev/blob/main/packages/slidev/node/plugins/markdown-it-katex.ts` 与 `// Ported from https://github.com/waylonflinn/markdown-it-katex`。
> 所以「Valaxy 基于 markdown-it-katex」方向正确（是移植版），但**没有直接依赖该 npm 包**。

#### 4.5.3 构建期 vs 客户端

**两条路都是构建期（Node 侧）渲染**，浏览器端不执行数学库：

- KaTeX：`katex.renderToString(latex, katexOptions)` 直接产出 HTML 字符串（`renderToString` ⇒ 构建期）。
- MathJax：`await import('markdown-it-mathjax3')` 注册进 markdown-it，**构建时渲染为自包含 SVG**；官方源码：

```ts
// setup.ts（节选）
if (isMathJaxEnabled(options?.config)) {
  try {
    const mathPlugin = await import('markdown-it-mathjax3')
    const mathjaxPlugin = mathPlugin.default ?? mathPlugin
    mathjaxPlugin(md, { ...(mdOptions.mathjax || {}) })
    // Add v-pre to prevent Vue from processing MathJax SVG output
    const origMathInline = md.renderer.rules.math_inline!
    md.renderer.rules.math_inline = function (...args) {
      return mapRenderResult(origMathInline.apply(this, args),
        html => html.replace(/^<mjx-container /, '<mjx-container v-pre '))
    }
    // block 版同理，另加 tabindex="0"
  }
  catch {
    throw new Error('You need to install `markdown-it-mathjax3` to use MathJax. Run: pnpm add markdown-it-mathjax3')
  }
}
else if (isKatexPluginNeeded(options?.config)) {
  md.use(Katex, { katexOptions: mdOptions.katex, globalEnabled: options?.config?.features?.katex !== false })
}
```

开关判定（[`node/config/valaxy.ts`](https://github.com/YunYouJun/valaxy/blob/main/packages/valaxy/node/config/valaxy.ts)）：`isMathJaxEnabled = !!config?.math`；`isKatexEnabled` 在 `config.math` 为真时返回 false；`isKatexPluginNeeded = !config?.math`（保证 `features.katex: false` 时仍能支持单页 `frontmatter.katex: true`）。

#### 4.5.4 行内 / 块级 / 宏支持

官方 [Math Formulas 示例页](https://valaxy.site/examples/math)：

| 场景 | 写法 |
| --- | --- |
| 行内 | `$E = mc^2$`、`$\frac{\partial}{\partial t}$` |
| 块级 | 公式独占一段；源码层面 `math_block` 规则以 `$$` 为定界符 |
| 环境 | `\begin{bmatrix}...\end{bmatrix}`、`\begin{equation}\begin{aligned}...\end{aligned}\end{equation}` |
| 含竖线 | `$\{x \vert Ax = b\}$`（示例页首例；原例用竖线，表格内需改写为 \vert） |
| 化学式（MathJax 示例） | `$\ce{CO2 + C -> 2 CO}$` |

KaTeX 插件同时注册 `math_inline`（单美元符）与 `math_block`（双美元符）两条 markdown-it 规则。

**宏与扩展**：

- **`\newcommand`**：属 KaTeX / MathJax 各自宏系统。KaTeX 支持 `\newcommand` / `\def`（官方支持表 <https://katex.org/docs/supported.html>），但**Valaxy 环境未逐条实测 → 未核实**。
- **`\begin{align}` / AMS 环境**：KaTeX 支持 `aligned` / `align`；MathJax 侧由 mathjax3 支持。**Valaxy 环境实测未做 → 未核实**。
- **mhchem（化学式）**：Valaxy 的 KaTeX 插件**显式注册**了 mhchem —— 源码 `// Register mhchem extension for chemical equations (\ce, \pu, etc.)` / `import 'katex/contrib/mhchem'` ⇒ `\ce{}` 在 KaTeX 路径下**可用**（源码级确认）。
- **SSR 下 `window` 未定义**：Valaxy 是 SSG + Vue 水合，数学在构建期已转成 HTML，**客户端不执行数学库**，不存在这类问题；MathJax 路径还给 `<mjx-container>` 注入 `v-pre`，避免 Vue 重编译 MathJax 的 SVG（官方源码明确处理）。

#### 4.5.5 常见坑（Valaxy 特化）

1. **KaTeX 与 MathJax 同开** → 官方明确警告会重复渲染或样式冲突；`math` 开时 `features.katex` 被忽略。
2. **没装 `markdown-it-mathjax3` 就写 `math: true`** → 构建抛错 *"You need to install `markdown-it-mathjax3` to use MathJax. Run: pnpm add markdown-it-mathjax3"*（源码里就是这句）。
3. **Node 版本不够** → `>=22.12.0` 硬要求，Node 20 / 早期 Node 22 直接失败。
4. **美元符与 Markdown 冲突**：`math_block` 挂在 `blockquote` 之后（`md.block.ruler.after('blockquote', 'math_block', ...)`），列表/引用块内嵌公式易有缩进判定问题；`math_inline` 挂在 `escape` 之后，转义优先级要自己测。
5. **KaTeX 样式**：Valaxy 自带 [`packages/valaxy/client/styles/third/katex.scss`](https://github.com/YunYouJun/valaxy/blob/main/packages/valaxy/client/styles/third/katex.scss)（仅 127 字节），只是覆盖 `.katex-display` 的 `overflow/padding` 与编号位置。**KaTeX 官方样式表（`katex/dist/katex.min.css`）自动引入的确切位置本次未定位到 → 未核实**。遇到「公式字体/排版错乱」优先查这条。
6. **PDF 导出**：官方**未提供**任何 pdf 导出能力 → **无/未核实**。
7. **构建内存**：官方提示 SSG 构建约需 4GB 堆，小内存 CI 易 OOM。

### 4.6 主题

| 主题 | 包名 | 定位 | 演示 | 代码位置 |
| --- | --- | --- | --- | --- |
| **Yun**（默认） | `valaxy-theme-yun` | 轻量、干净的博客主题（*"A light & clean blog theme"*） | <https://yun.valaxy.site> | `packages/valaxy-theme-yun`（**独立仓库已不存在**：2026-09-11 访问 `github.com/YunYouJun/valaxy-theme-yun` 返回 404，已并入 monorepo） |
| **Press** | `valaxy-theme-press` | 文档向、**灵感来自 VitePress**（官方文档站自身就用它） | <https://press.valaxy.site> | `packages/valaxy-theme-press`（同上） |
| Starter | `valaxy-theme-starter` | 主题开发模板 | — | [valaxyjs/valaxy-theme-starter](https://github.com/valaxyjs/valaxy-theme-starter)，**12 stars**（ungh.cc）、last push `2025-12-07` |

选择主题：`create-valaxy` 交互里选 Yun / Press / Custom，或手动改 `valaxy.config.ts` 的 `theme` 并安装对应 npm 包。

主题自带视觉能力（[`valaxy-theme-yun/package.json`](https://github.com/YunYouJun/valaxy/blob/main/packages/valaxy-theme-yun/package.json)：`@vueuse/motion`、`animejs`、`gsap`、`@ctrl/tinycolor`、`reka-ui`、`@explosions/fireworks`）⇒ Yun **自带较丰富动效**，不是纯静态简约风。Press 依赖里直接挂了 `vitepress` + `@docsearch/css`/`@docsearch/js` ⇒ 文档搜索由 DocSearch 提供。

### 4.7 视觉风格

- **默认是否简约**：**Yun 走「轻量 + 动效点缀」**（非学究式极简）；**Press 是标准文档风**，与 VitePress 近似。
- **样式底座**：**UnoCSS**（原子化 CSS；官方首页明确写 *"UnoCSS - Freedom in Writing Styles"*），配置入口在 `valaxy.config.ts` 的 `unocss: { safelist }`（见 [Config](https://valaxy.site/guide/config)）。**不用 Tailwind。**
- **CSS 变量换色**：主题有 `styles/css-vars.scss`；站点侧 `styles/` 目录下的 `index.scss` / `vars.css` / `index.css` 会自动加载（官方 Directory Structure）。
- **提升观感的手段**：① `styles/` 覆盖 CSS 变量（配色/字体/留白）；② `components/` 写同名 Vue 组件覆盖主题任意组件（官方：*"Override any component and layout in the theme with identically named Vue components"*）；③ `layouts/` + front matter `layout: xxx`；④ `unocss.safelist` 扩展原子类；⑤ 主题自带动效库（gsap / animejs / `@vueuse/motion`）。
- **示例站**（官方 [Example Sites](https://valaxy.site/examples/site) 当前只列 1 个）：<https://www.yunyoujun.cn>（作者本人站，Yun 主题代表站）、官方文档站 <https://valaxy.site>（Press 主题）、Yun 演示站 <https://yun.valaxy.site>。**更多社区站点未核实**。

### 4.8 优缺点与适用人群

**优点**：**默认 KaTeX 且构建期渲染**——四家方案里开箱体验最好的数学方案（不用装插件、不用引脚本、不用配 CDN）；**每页可开关**（`frontmatter.katex`）；官方文档**原生中文**、i18n 是框架级能力；Vue 3 生态可写组件/交互 demo；部署模板齐全（GH Pages / Netlify / Vercel / CF Pages 全官方覆盖）；SSG + 预渲染。
**缺点**：**仍是 `1.0.0-rc.9`**（未 GA）；**Node ≥ 22.12.0** 门槛高；**输出默认带客户端 JS**（Vue 水合），首屏复杂度高于纯静态的 Hexo/Hugo/Jekyll；**体量小**（1,127 stars，官方主题仅两个）；构建吃内存（官方建议 4GB 堆）；Yun 主题动效偏个人站审美。
**适合**：**会 Vue/TS 的中文写作者**、需要框架级中文文档与中文社区的人、要在 Markdown 里嵌交互组件的人。
**不适合**：追求零客户端 JS / 极致加载速度的人；要求框架已 GA 的人；不碰 JS 生态、只想写 Markdown 的中文作者。

---

## 5. 人群建议

### 5.1 「学术 / 公式密集」人群 → **首选 al-folio**

理由（均有一手证据）：① **数学站点级默认开启**（`enable_math: true`，无需逐篇 front matter）；② `tags: 'ams'` 支持 AMS 编号与 `\eqref` 交叉引用；③ **学术基建在对标方案里无可替代**：`jekyll-scholar`（BibTeX 文献列表）、Publications / CV / Teaching / People / News collection、Distill 风格长文、TikZJax、pseudocode；④ GitHub Pages + Actions 流程官方写得很死（约 4 分钟构建 + 约 45 秒发布）；⑤ 16,121 stars / 13,082 forks，README 列了大量真实学术站可参考。

**代价**：依赖极重（20+ gems + Python/Jupyter + Node），必须 Docker/WSL 或 CI；**不能吃 GitHub Pages 内置构建**；MathJax 全站加载；中文排版要自补 CSS；公式只有客户端渲染一条路。若强行做构建期渲染只能上 `kramdown-math-katex` + ExecJS（仅 10 stars、2019 年后无提交 → **维护风险高，不建议**）。

**次选 / 对照**：**Chirpy** 只适合「偶尔一两个公式」的工程博客（默认关闭、逐篇开、依赖 CDN 的 MathJax 4）；**Valaxy（MathJax 模式）** 构建期 SSR 出 SVG、无外部 CSS/字体、KaTeX 路径还支持 `\ce{}`，数学质量很好，但缺学术基建。

### 5.2 「中文写作者」人群

**首选：Valaxy（会 JS/前端时）** —— 官方文档有完整中文版（<https://valaxy.site/zh>）；**默认 KaTeX + 构建期渲染**，中文写作者最不用折腾数学；i18n 是框架级能力；GH Pages / Netlify / Vercel / CF Pages **都有官方文档**；代表站 <https://www.yunyoujun.cn>。**风险**：未 GA（rc.9）、体量小、Node ≥22.12.0、默认带客户端 JS。

**次选：Jekyll + Chirpy（不想碰 Node/Vue 时）** —— 界面语言可切（`_config.yml` 的 `lang` + `_data/locales`），纯 Markdown 写作、不用写前端；缺点是 Ruby 环境 + 必须 GitHub Actions + 数学弱。**适合只写文字、不折腾样式、不写公式的中文作者。**

> Hexo 中文圈体量最大、中文资料最多，但属同批其它部分，本文不越界评价。

### 5.3 一句话速判表

| 你的画像 | 建议 |
| --- | --- |
| 学术主页 / 论文列表 / 公式密集 | **al-folio**（Jekyll + GitHub Actions） |
| 中文技术博客，会 Vue/TS，公式偶尔有 | **Valaxy**（默认 KaTeX） |
| 中文技术博客，只写 Markdown，不写公式 | **Chirpy**（或 Hexo，见其它部分） |
| 英文工程博客，要归档/标签/搜索/PWA | **Chirpy** |
| 要「构建期渲染公式 + 零客户端数学 JS」 | **Valaxy + KaTeX** |
| 想用 GitHub Pages 内置构建（零 CI） | 只能用 Jekyll 3.10.0 + 白名单插件 → **Chirpy / al-folio 都不行** |

---

## 6. 未核实事项清单（诚实标注）

1. **Jekyll 构建速度的官方数字** —— 官方无 benchmark，本文未给任何耗时数字。
2. **Chirpy / al-folio / Valaxy 的构建耗时** —— 同上（al-folio 只在 INSTALL.md 给了 Actions 运行时长，非本地构建耗时）。
3. **`\newcommand` 在 Chirpy（MathJax 4）与 al-folio（MathJax 3.2.2）下的具体行为边界** —— 未逐条实测。
4. **`\begin{align}` 等在 Valaxy（KaTeX 0.16.x）下的实测结果** —— 未实测。
5. **Valaxy 中 `katex/dist/katex.min.css` 的自动引入位置** —— 未能定位到确切文件。
6. **Cloudflare Pages 是否官方支持 Jekyll** —— Jekyll 官方 3rd-party 列表未收录，Cloudflare 侧未查到可引用的官方 Jekyll 指南。
7. **Chirpy / al-folio 在 Vercel / Netlify 上的官方支持** —— 两家主题官方文档只覆盖 GitHub Pages(+Actions) 与手动构建。
8. **al-folio 的 Ruby 版本下限** —— `Dockerfile` 是 `FROM ruby:latest`，未 pin。
9. **jekyll-spaceship 默认引用的 `polyfill.io` 供应链事件细节** —— 本次未独立核实，仅提示风险。
10. **Chirpy 第三方优秀示例站清单** —— 官方未维护。
11. **Valaxy 社区站点完整清单** —— 官方 Example Sites 页面当前只列 1 个。
12. **Valaxy 构建速度 / 首屏体积数据** —— 官方无 benchmark，未实测。

---

## 7. 附：本文全部一手来源 URL

**Jekyll 本体**
- 仓库 <https://github.com/jekyll/jekyll>　release v4.4.1 <https://github.com/jekyll/jekyll/releases/tag/v4.4.1>
- Quickstart <https://jekyllrb.com/docs/>　Installation <https://jekyllrb.com/docs/installation/>
- Markdown Options <https://jekyllrb.com/docs/configuration/markdown/>　Configuration Options <https://jekyllrb.com/docs/configuration/options/>
- Deployment <https://jekyllrb.com/docs/deployment/> / [manual](https://jekyllrb.com/docs/deployment/manual/) / [automated](https://jekyllrb.com/docs/deployment/automated/) / [third-party](https://jekyllrb.com/docs/deployment/third-party/)
- gemspec <https://github.com/jekyll/jekyll/blob/master/jekyll.gemspec>　jekyll-commonmark <https://github.com/jekyll/jekyll-commonmark>

**Kramdown**
- Options <https://kramdown.gettalong.org/options.html>　Syntax <https://kramdown.gettalong.org/syntax.html>　HTML Converter <https://kramdown.gettalong.org/converter/html.html>
- kramdown-math-katex <https://github.com/kramdown/math-katex>　jekyll-spaceship <https://github.com/jeffreytse/jekyll-spaceship>

**GitHub Pages**
- About GitHub Pages and Jekyll <https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll>
- 依赖版本（一手 JSON）<https://pages.github.com/versions.json>（人类可读页 <https://pages.github.com/versions/>）

**Chirpy**
- 仓库 <https://github.com/cotes2020/jekyll-theme-chirpy>　release v7.6.0 <https://github.com/cotes2020/jekyll-theme-chirpy/releases/tag/v7.6.0>
- 文档/演示站 <https://chirpy.cotes.page>　Getting Started <https://chirpy.cotes.page/posts/getting-started/>　数学与写法 <https://chirpy.cotes.page/posts/write-a-new-post/>
- starter <https://github.com/cotes2020/chirpy-starter>　自托管资源 <https://github.com/cotes2020/chirpy-static-assets>
- [`_config.yml`](https://github.com/cotes2020/jekyll-theme-chirpy/blob/master/_config.yml)　[`_includes/js-selector.html`](https://github.com/cotes2020/jekyll-theme-chirpy/blob/master/_includes/js-selector.html)　[`_data/origin/cors.yml`](https://github.com/cotes2020/jekyll-theme-chirpy/blob/master/_data/origin/cors.yml)　[`assets/js/data/mathjax.js`](https://github.com/cotes2020/jekyll-theme-chirpy/blob/master/assets/js/data/mathjax.js)　[gemspec](https://github.com/cotes2020/jekyll-theme-chirpy/blob/master/jekyll-theme-chirpy.gemspec)

**al-folio**
- 仓库 <https://github.com/alshedivat/al-folio>　release v1.2 <https://github.com/alshedivat/al-folio/releases/tag/v1.2>　demo <https://alshedivat.github.io/al-folio/>
- [INSTALL.md](https://github.com/alshedivat/al-folio/blob/master/INSTALL.md)　[`_config.yml`](https://github.com/alshedivat/al-folio/blob/master/_config.yml)　[`_includes/scripts/mathjax.liquid`](https://github.com/alshedivat/al-folio/blob/master/_includes/scripts/mathjax.liquid)　[Gemfile](https://github.com/alshedivat/al-folio/blob/master/Gemfile)
- 数学示例源 <https://github.com/alshedivat/al-folio/blob/master/_posts/2015-10-20-math.md>　渲染 <https://alshedivat.github.io/al-folio/blog/2015/math/>
- 示例站清单 <https://github.com/alshedivat/al-folio#user-community>

**Valaxy**
- 仓库 <https://github.com/YunYouJun/valaxy>　release v1.0.0-rc.9 <https://github.com/YunYouJun/valaxy/releases/tag/v1.0.0-rc.9>
- 官网 <https://valaxy.site>　中文文档 <https://valaxy.site/zh>　Getting Started <https://valaxy.site/guide/getting-started>
- Markdown Extensions <https://valaxy.site/guide/markdown>　Math Formulas <https://valaxy.site/examples/math>　Deployment <https://valaxy.site/guide/deploy>　Config <https://valaxy.site/guide/config>　Example Sites <https://valaxy.site/examples/site>
- [setup.ts](https://github.com/YunYouJun/valaxy/blob/main/packages/valaxy/node/plugins/markdown/setup.ts)　[katex.ts](https://github.com/YunYouJun/valaxy/blob/main/packages/valaxy/node/plugins/markdown/plugins/markdown-it/katex.ts)　[config/valaxy.ts](https://github.com/YunYouJun/valaxy/blob/main/packages/valaxy/node/config/valaxy.ts)　[types/config.ts](https://github.com/YunYouJun/valaxy/blob/main/packages/valaxy/node/types/config.ts)　[markdown/types.ts](https://github.com/YunYouJun/valaxy/blob/main/packages/valaxy/node/plugins/markdown/types.ts)
- [katex.scss](https://github.com/YunYouJun/valaxy/blob/main/packages/valaxy/client/styles/third/katex.scss)　[yun package.json](https://github.com/YunYouJun/valaxy/blob/main/packages/valaxy-theme-yun/package.json)　[press package.json](https://github.com/YunYouJun/valaxy/blob/main/packages/valaxy-theme-press/package.json)　[pnpm-workspace.yaml](https://github.com/YunYouJun/valaxy/blob/main/pnpm-workspace.yaml)
- 作者站点 <https://www.yunyoujun.cn>　Yun 演示 <https://yun.valaxy.site>　Press 演示 <https://press.valaxy.site>

**第三方数据镜像**
- ungh.cc（GitHub 数据镜像；本会话 `api.github.com` 配额耗尽后用于补齐 star/forks）<https://ungh.cc>

---

# 第五部分：Eleventy / VitePress / Docusaurus / MkDocs Material（文档型对照）

## 第五部分正文：文档型 SSG 对照调研

> **调研与访问日期：2026-09-11**（下文所有 URL 均为该日实际访问并返回 200，GitHub 统计数字为该日快照）。
> 本文是「SSG 调研」的**文档型方案**分支，用于与博客型方案做对照。
> 凡未能从官方文档 / 官方仓库 / npm·PyPI registry 核实的内容，一律明确标注「**未核实**」，不做推测性填充。

---

## 0. 数据快照与方法说明（2026-09-11）

### 0.1 版本与热度

| 项目 | Stars | 最新稳定版 | 最新预发布 | 最近提交 |
| --- | --- | --- | --- | --- |
| [11ty/eleventy](https://github.com/11ty/eleventy) | 19,899 | npm [@11ty/eleventy](https://www.npmjs.com/package/@11ty/eleventy) **3.1.6**（2026-06-02 发布） | 4.0.0-alpha.10（2026-07-02） | 2026-09-02 |
| [vuejs/vitepress](https://github.com/vuejs/vitepress) | 18,308 | npm [vitepress](https://www.npmjs.com/package/vitepress) **1.6.4**（2025-08-05 发布） | 2.0.0-alpha.20（2026-09-04，[release](https://github.com/vuejs/vitepress/releases/tag/v2.0.0-alpha.20)） | 2026-09-04 |
| [facebook/docusaurus](https://github.com/facebook/docusaurus) | 66,226 | npm [@docusaurus/core](https://www.npmjs.com/package/@docusaurus/core) **3.10.2**（2026-07-10，[release](https://github.com/facebook/docusaurus/releases/tag/v3.10.2)） | — | 2026-09-11 |
| [squidfunk/mkdocs-material](https://github.com/squidfunk/mkdocs-material) | 27,418 | PyPI [mkdocs-material](https://pypi.org/project/mkdocs-material/) **9.7.7**（2026-07-17 上传，[release](https://github.com/squidfunk/mkdocs-material/releases/tag/9.7.7)） | — | 2026-08-30 |

### 0.2 数据来源与限流说明

- **Stars**：抓取 GitHub 仓库页 HTML 中 id="repo-stars-counter-star" 的 title 属性（精确数字，如 19,899）。这也是 GitHub API 未认证限流（**60 次/小时，按 IP 共享**）耗尽后的替代方案。
- **Release / commit 时间**：本研究开始时使用了 api.github.com/repos/... 的 releases/latest 与 commits?per_page=1；随后配额耗尽，改用 https://github.com/OWNER/REPO/releases.atom 与 commits.atom（**不消耗配额**）交叉核对，两者一致。
- **包版本 / 发布时间**：registry.npmjs.org、pypi.org/pypi/<pkg>/json 与 raw.githubusercontent.com 源码，均不消耗 GitHub API 配额。
- **同期依赖版本**（2026-09-11，npm registry）：[markdown-it](https://www.npmjs.com/package/markdown-it) 15.0.2、[katex](https://www.npmjs.com/package/katex) 0.18.7（2026-09-06）、[mathjax](https://www.npmjs.com/package/mathjax) 4.1.3、[remark-math](https://www.npmjs.com/package/remark-math) 6.0.0、[rehype-katex](https://www.npmjs.com/package/rehype-katex) 7.0.1、[markdown-it-mathjax3](https://www.npmjs.com/package/markdown-it-mathjax3) 5.2.0。
- **构建速度**：只有 Eleventy 官方页引用了第三方 benchmark（见 §1.1），其余三家官方均未公布可核实的构建耗时数字 → 标注**未核实**。

---

## 1. Eleventy / 11ty（11ty/eleventy）

### 1.1 技术栈

| 维度 | 结论 | 来源 |
| --- | --- | --- |
| 语言 / 运行时 | JavaScript（Node.js）。**Node.js >= 18**（@11ty/eleventy@3.1.6 的 engines.node = ">=18"） | [11ty Get Started](https://www.11ty.dev/docs/)、npm registry |
| 模板引擎 | 多语言：Markdown、Nunjucks、Liquid、Handlebars、Mustache、EJS、HAML、Pug、WebC、JS/TS、JSX | [11ty 文档](https://www.11ty.dev/docs/) |
| Markdown 引擎 | **markdown-it（默认；Eleventy 依赖 markdown-it ^14.2.0）** | [Eleventy Markdown 文档](https://www.11ty.dev/docs/languages/markdown/)、npm registry |
| 构建速度 | 官方 [Performance 页](https://www.11ty.dev/docs/performance/) 引用第三方基准 *Which Generator Builds Markdown the Fastest?*（2022-07），4000 个 Markdown 文件：**Hugo 0.68 s / Eleventy 1.93 s / Astro 22.90 s / Gatsby 29.05 s / Next.js 70.65 s**。这是官方引用的**第三方 2022 年数据**，非 Eleventy 自测；**2026 年的官方基准：未核实** | [11ty Performance](https://www.11ty.dev/docs/performance/) |
| 输出形态 | **纯静态 HTML**，默认**零运行时 JS**（官方原文：by-default we do not include any costly runtime JavaScript bundles）；如需局部交互可用官方 <is-land> 局部水合 | [11ty Performance](https://www.11ty.dev/docs/performance/) |

### 1.2 部署方式

Eleventy **不做平台绑定**，官方 [Deployment & Hosting](https://www.11ty.dev/docs/deployment/) 页列出「Jamstack Providers」与「Classic Web Hosts」，其中包含：

- [GitHub Pages](https://docs.github.com/en/pages)（官方另有教程 *Deploy an Eleventy project to GitHub pages*）
- [Cloudflare Pages](https://pages.cloudflare.com/)
- [Netlify](https://app.netlify.com/)
- [Vercel](https://vercel.com/cli)
- [GitLab Pages](https://docs.gitlab.com/ee/user/project/pages/)
- [Render](https://render.com/docs/static-sites)、[Azure Static Web Apps](https://azure.microsoft.com/en-us/services/app-service/static/)、Codeberg Pages、Sourcehut Pages、Kinsta、Stormkit、CloudCannon 等

官方强调：**npx @11ty/eleventy 的产物默认就是生产就绪**，Eleventy 不在内部区分 dev/prod 行为。

### 1.3 上手难度（从安装到跑起来）

~~~bash
mkdir eleventy-sample && cd eleventy-sample
npm init -y
npm install @11ty/eleventy
npx @11ty/eleventy --serve      # 本地预览（默认 http://localhost:8080）
npx @11ty/eleventy              # 生产构建，输出到 _site/
~~~

- 运行时要求：**Node.js >= 18**（官方文档写作 "version 18 or higher"）。
- 配置文件更名历史：现在叫 **eleventy.config.js**；老文档里的 .eleventy.js 仍被兼容（官方文档以 eleventy.config.js 为准）。
- 官方 Get Started：<https://www.11ty.dev/docs/>

### 1.4 Markdown 渲染管线

- 解析器：**markdown-it**（默认）。
- 默认配置与 markdown-it 原版**唯一显著差异**：Eleventy 设 html: true（markdown-it 默认为 false）。另自 Eleventy 2.0 起**默认关闭缩进代码块（Indented Code Blocks）**。
- 两个官方钩子（[Markdown 文档](https://www.11ty.dev/docs/languages/markdown/)）：
  - eleventyConfig.setLibrary("md", markdownIt(options)) —— 完全替换实例；
  - eleventyConfig.amendLibrary("md", (mdLib) => ...) —— **v2.0.0 起新增**，在现有实例上追加插件（数学公式推荐用这个）。
- 官方语法高亮插件：[@11ty/eleventy-plugin-syntaxhighlight](https://www.npmjs.com/package/@11ty/eleventy-plugin-syntaxhighlight)（基于 Prism.js，最新 **5.0.2**，2025-08-01 发布；文档：<https://www.11ty.dev/docs/plugins/syntaxhighlight/>）。

### 1.5 LaTeX 数学公式的具体实现

> **重要核实结论（与任务书假设不符）**：eleventy-plugin-katex **在 npm 上不存在**。2026-09-11 查询 registry.npmjs.org/eleventy-plugin-katex 返回 {"error":"Not found"}；官方 [Plugins](https://www.11ty.dev/docs/plugins/) 页面也**没有任何 math / katex 条目**。Eleventy **没有内置数学公式方案**，也没有官方数学公式文档页。

**可行路径一（推荐）：自己给 markdown-it 挂插件。** 真实存在且可用的包：

| 包名 | 最新版 | 发布时间 | 说明 |
| --- | --- | --- | --- |
| [@vscode/markdown-it-katex](https://www.npmjs.com/package/@vscode/markdown-it-katex) | 1.1.2 | 2025-07-07 | 微软维护，VS Code 渲染 Markdown 数学公式所用；源码：[microsoft/vscode-markdown-it-katex](https://github.com/microsoft/vscode-markdown-it-katex) |
| [@mdit/plugin-katex](https://www.npmjs.com/package/@mdit/plugin-katex) | 1.1.1 | 2026-09-07 | 社区活跃维护（[mdit-plugins](https://github.com/mdit-plugins/mdit-plugins)，文档 <https://mdit-plugins.github.io/katex.html>） |
| [markdown-it-mathjax3](https://www.npmjs.com/package/markdown-it-mathjax3) | 5.2.0 | 2025-09-29 | 用 MathJax 3 在构建期输出 SVG（[nzt/markdown-it-mathjax3](https://github.com/nzt/markdown-it-mathjax3)），也支持 XyJaX 交换图 |
| [markdown-it-katex](https://www.npmjs.com/package/markdown-it-katex) | 2.0.3 | **2016-10-10** | 原始包，**已 10 年未更新**，不建议新项目使用（[waylonflinn/markdown-it-katex](https://github.com/waylonflinn/markdown-it-katex)） |

**可行路径二（社区插件）**：[eleventy-plugin-mathjax](https://www.npmjs.com/package/eleventy-plugin-mathjax) —— **服务端 MathJax 渲染**，最新 **2.0.4（2021-11-19）**，已近 5 年未更新；源码 [tsung-ju/eleventy-plugin-mathjax](https://github.com/tsung-ju/eleventy-plugin-mathjax)。它是 11ty 官方 [Community Plugins](https://www.11ty.dev/docs/plugins/community/) 列表中的条目。

**安装命令（路径一）：**

~~~bash
npm install @vscode/markdown-it-katex
~~~

**配置文件与真实配置片段。** 位置：项目根目录 **eleventy.config.js**（ESM 写法；.eleventy.js 亦兼容）。
下面片段由 **Eleventy 官方 amendLibrary API**（[来源](https://www.11ty.dev/docs/languages/markdown/)）与 **@vscode/markdown-it-katex 官方 README 用法**（[来源](https://github.com/microsoft/vscode-markdown-it-katex)）组合而成——**Eleventy 官方没有数学公式文档页，因此不存在「官方配置片段」**，请知悉这一点：

~~~js
// eleventy.config.js
import markdownItKatex from "@vscode/markdown-it-katex";

export default function (eleventyConfig) {
  // 在 Eleventy 内置的 markdown-it 实例上追加插件（v2.0.0+）
  eleventyConfig.amendLibrary("md", (md) => {
    md.use(markdownItKatex.default, {
      throwOnError: false, // 单条公式出错不炸整个构建
      errorColor: "#cc0000",
      // KaTeX 的 macros 选项可在这里预定义宏（见下）
    });
  });
}
~~~

如果选择 **完全替换** 实例（markdown-it-mathjax3 场景），官方写法是：

~~~js
// eleventy.config.js
import markdownIt from "markdown-it";
import mathjax3 from "markdown-it-mathjax3";

export default function (eleventyConfig) {
  const md = markdownIt({ html: true, breaks: true, linkify: true });
  md.use(mathjax3);
  eleventyConfig.setLibrary("md", md);
}
~~~

**必须额外引入 KaTeX 样式表**（否则公式排版错乱，插件 README 明确要求）：

~~~html
<link rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css">
~~~

> 注：README 给的是 katex@0.16.4；npm 上 KaTeX 当前最新为 **0.18.7**。**0.18.7 的 CDN 路径未核实**，如需升级请自行确认。

**KaTeX 还是 MathJax？** 取决于你选哪个包：@vscode/markdown-it-katex / @mdit/plugin-katex → **KaTeX**；markdown-it-mathjax3 / eleventy-plugin-mathjax → **MathJax 3**。

**构建期还是客户端？** 这是 Eleventy 路线的**最大优势**：
- @vscode/markdown-it-katex、@mdit/plugin-katex、markdown-it-mathjax3 都是 **markdown-it 插件**，在 **构建期**就把公式编译成 HTML（KaTeX）或 SVG（MathJax 3），客户端**不需要加载数学 JS**（但仍需 KaTeX CSS + 字体）。
- eleventy-plugin-mathjax 是**服务端** MathJax 渲染。

**行内公式支持**：支持（单个美元符包裹）。markdown-it-mathjax3 的 README 明确写明解析规则遵循 pandoc 约定（见下「常见坑」）。

**复杂宏包支持程度（\newcommand、\begin{align}、AMS）**：**未核实（未实测）**。理论上受限于底层 KaTeX / MathJax 的能力：
- KaTeX 支持 \begin{align} 等 environments，\newcommand 需要通过 macros 选项预定义（KaTeX 官方文档：<https://katex.org/docs/supported>）；
- MathJax 3 的 LaTeX 支持面更广（含 AMS 宏包）。
但**本项目未在 Eleventy 下实际构建验证**，标注未核实。

**常见坑（已核实部分）：**
- **美元符与 Markdown 冲突**：markdown-it-mathjax3 README 的 *Syntax* 一节给出 pandoc 规则——「开 $ 右侧必须紧跟非空白字符，闭 $ 左侧必须是非空白字符，且后面不能紧跟数字」。因此 $20,000 and $30,000 **不会**被误判为公式；要输出字面美元符用反斜杠转义。
- **CDN 引入**：KaTeX 必须引入 katex.min.css，MathJax 3 构建期方案则不需要。
- **块级公式**：应独占一行、前后各留一个空行（各插件 README 的 block 示例均如此）。
- **Eleventy 默认 html: true**：Markdown 里写原始 HTML 会被保留，配合数学渲染时注意不要嵌套进 code 元素。
- **pdf 导出**：Eleventy 无官方 PDF 方案，**未核实**。
- **SSR / window 未定义**：Eleventy 是纯 Node 构建、无 SSR 框架，**不适用**该坑（这也是它相对 Vue/React 系方案省心的地方）。

### 1.6 视觉风格

- **官方不提供主题系统**，只提供 **starter（脚手架）**：官方 Starter 列表 <https://www.11ty.dev/docs/starter/>。
- **官方 starter**：[eleventy-base-blog](https://github.com/11ty/eleventy-base-blog)（官方唯一 starter，「Official Starter · How to build a blog web site with Eleventy」），极简、无 CSS 框架。
- **社区 starter（官方「Featured」标记）**：
  - [eleventy-excellent](https://github.com/madrilene/eleventy-excellent) —— 受 Andy Bell *buildexcellentwebsit.es* 启发，**CSS 架构讲究、观感现代**，是目前最常被推荐的「好看」11ty starter。
  - **Grease** —— 11ty + Lightning CSS + Esbuild，轻量声明式 CSS 架构。
  - **eleventy-libdoc** —— 面向**文档站**的响应式 starter。
  - **TEAtime Starter**（Tailwind CSS + Alpine.js，部署到 Netlify）、**Fundamenty**（TailwindCSS + Webpack，GitHub/GitLab Pages ready）、**Brutalism**、**Monochrome11ty** 等。
  - 注意：**官方没有「11ty + Tailwind 官方 starter」**；Tailwind 系 starter 均为社区项目（TEAtime、Fundamenty、Grease 等）。
- 结论：**默认不简约也不花哨——取决于你挑哪个 starter**；Tailwind 是社区主流选择；CSS 变量 / 字体 / 留白 / 动效完全自由，因为没有内置主题约束。

### 1.7 优缺点与适用人群

**优点**
- 构建速度在 JS 生态里第一梯队（官方引用的 2022 基准：4000 篇 Markdown 仅 1.93 s）。
- **默认零运行时 JS**、纯静态 HTML，适合公式密集但要求「打开即读、无 JS 也可见」的场景（前提是选了构建期 KaTeX/MathJax 插件）。
- 模板语言自由（Markdown + Nunjucks/Liquid/WebC...），不绑定框架。
- 数学方案走 markdown-it 插件即可，**构建期渲染，无 SSR/window 问题**。

**缺点**
- **数学公式零官方支持**：无官方文档、无官方插件，要自己读 markdown-it 插件 README 拼接；社区主力插件 eleventy-plugin-mathjax 已 5 年未更新。
- 无内置主题、无内置搜索（需接 Pagefind / Algolia 等第三方）、无内置博客功能（靠 starter 或手写 collections）。
- 中文社区资料相对较少。
- 规模化文档站（侧边栏/版本切换/多语言）要自行搭建。

**适用人群**：想要**极致性能 + 完全掌控 HTML 输出**的技术博客作者；把数学公式当「纯静态 HTML 的一部分」、拒绝客户端数学 JS 的人；愿意自己接线、不在乎「开箱即用」的前端工程师。**不适合**想要开箱即用文档站的中文写作者。

---

## 2. VitePress（vuejs/vitepress）

### 2.1 技术栈

| 维度 | 结论 | 来源 |
| --- | --- | --- |
| 语言 / 框架 | **Vue 3 + Vite**，TypeScript 编写，**ESM-only**（不能用 require()） | [VitePress Getting Started](https://vitepress.dev/guide/getting-started) |
| 运行时要求 | **注意版本分裂**：当前 vitepress.dev 默认展示的是 **v2 alpha 文档**，写「**Node.js version 22 or higher**」；稳定版 **1.6.4** 文档写「**Node.js version 18 or higher**」；[部署页](https://vitepress.dev/guide/deploy) 的平台指引写「**Node Version: 20 (or above)**」 | [Getting Started（v2 docs）](https://vitepress.dev/guide/getting-started)、[v1.6.4 getting-started.md](https://raw.githubusercontent.com/vuejs/vitepress/v1.6.4/docs/en/guide/getting-started.md)、[Deploy](https://vitepress.dev/guide/deploy) |
| Markdown 管线 | **markdown-it**（官方原文：VitePress uses markdown-it as the Markdown renderer），内置扩展由自定义插件实现（@mdit/plugin-anchor、@mdit-vue/plugin-toc 等） | [Writing Markdown](https://vitepress.dev/guide/markdown)、[Extending the Default Theme](https://vitepress.dev/guide/extending-default-theme) |
| 构建速度 | **未核实**（官方未公布可复现的 benchmark 数字；官网卖点是 Vite 的冷启动速度） | — |
| 输出形态 | 静态 HTML + **Vue 客户端 hydration**。默认主题会加载 JS（站点搜索、侧边栏、暗色切换、SPA 式导航），比 Eleventy/Docusaurus 的「无 JS 可读」程度略低；但**数学公式在构建期就已渲染进 HTML**（见 §2.5） | [Deploy](https://vitepress.dev/guide/deploy)（官方警告 hydration mismatch）、[SSR Compatibility](https://vitepress.dev/guide/ssr-compat) |

### 2.2 部署方式（官方文档链接）

官方 [Deploy](https://vitepress.dev/guide/deploy) 页覆盖：

- **GitHub Pages** —— 官方给完整 .github/workflows/deploy.yml 样例，使用 actions/configure-pages@v4 + actions/deploy-pages@v4；并要求在仓库 Settings → Pages → Build and deployment → Source 选 **GitHub Actions**。（等价骨架见下）
- **Netlify / Vercel / Cloudflare Pages / AWS Amplify / Render**（官方合并在 "Platform Guides → Generic" 一节）：
  - Build Command：npm run docs:build
  - Output Directory：docs/.vitepress/dist
  - Node Version：20（或以上）
- **官方警告**：不要对 HTML 开启 *Auto Minify* —— 会删掉对 Vue 有意义的注释，导致 **hydration mismatch**。
- 缓存头：docs/public/_headers（Netlify）/ 仓库根 vercel.json（Vercel），对 /assets/* 设 Cache-Control: max-age=31536000, immutable。
- GitHub Pages 必须正确配置 **base**（子路径部署），否则资源 404。

依据官方提及的 action 整理的等价工作流骨架（**非官方原文**，官方页有完整样例，请以官方页为准）：

~~~yaml
# .github/workflows/deploy.yml
name: Deploy VitePress site to Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run docs:build
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
~~~

### 2.3 上手难度（从安装到跑起来）

~~~bash
# 稳定版 1.6.4
npm add -D vitepress
npx vitepress init          # 交互式向导：配置目录 / markdown 目录 / 标题 / 主题 / TS / npm scripts
npx vitepress dev docs      # 本地开发（默认 http://localhost:5173）
npx vitepress build docs    # 产物在 docs/.vitepress/dist
npx vitepress preview docs  # 本地预览构建产物
~~~

当前 vitepress.dev 默认文档走 v2 alpha，安装命令是 **npm add -D vitepress@next**（[Getting Started](https://vitepress.dev/guide/getting-started)）。

要求：Node 18+（v1 稳定版）/ Node 22+（v2 alpha 文档）；**ESM-only**，最近的 package.json 需要有 "type": "module"，或把配置文件写成 .mts / .mjs。

### 2.4 Markdown 渲染管线

- 解析器：**markdown-it**（官方明说）。
- 可用 markdown 选项深度定制（[Writing Markdown → Advanced Configuration](https://vitepress.dev/guide/markdown)）：

~~~js
import { defineConfig } from 'vitepress'
import { headerLink } from '@mdit/plugin-anchor'
import markdownItFoo from 'markdown-it-foo'

export default defineConfig({
  markdown: {
    anchor: { permalink: headerLink() },  // @mdit/plugin-anchor 选项
    toc: { level: [1, 2] },               // @mdit-vue/plugin-toc 选项
  }
})
~~~

- 官方还支持 markdown.config 直接对 markdown-it 实例做任意插件挂载。

### 2.5 LaTeX 数学公式的具体实现（重点核实）

**核实路径**：官方文档 + **v1.6.4 tag 源码**（src/node/markdown/markdown.ts）。

**结论：VitePress 1.x 与 2.x alpha 都「不自带」数学实现，必须手动安装 markdown-it-mathjax3，再打开 markdown.math。**

官方文档原文（[vitepress.dev/guide/markdown#math-equations](https://vitepress.dev/guide/markdown)）：

> *This is currently opt-in. To enable it, you need to install markdown-it-mathjax3 and set markdown.math to true in your config file.*

**安装命令**（官方当前文档写 ^4；npm 上最新为 5.2.0，版本号以官方文档为准）：

~~~sh
npm add -D markdown-it-mathjax3@^4
~~~

**配置文件的准确位置**：.vitepress/config.ts（或 config.js / config.mts，取决于 init 时的选择）。

**真实配置片段**（与官方文档一致）：

~~~ts
// .vitepress/config.ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  markdown: {
    math: true
  }
})
~~~

**源码级证据**（[v1.6.4 markdown.ts](https://raw.githubusercontent.com/vuejs/vitepress/v1.6.4/src/node/markdown/markdown.ts)，2026-09-11 访问）—— 类型定义：

~~~ts
  /**
   * Math support
   *
   * You need to install markdown-it-mathjax3 and set math to true to enable it.
   * You can also pass options to markdown-it-mathjax3 here.
   * @default false
   */
  math?: boolean | any
~~~

运行时实现：

~~~ts
  if (options.math) {
    try {
      const mathPlugin = await import('markdown-it-mathjax3')
      md.use(mathPlugin.default ?? mathPlugin, {
        ...(typeof options.math === 'boolean' ? {} : options.math)
      })
      const orig = md.renderer.rules.math_block!
      md.renderer.rules.math_block = (tokens, idx, options, env, self) => {
        return orig(tokens, idx, options, env, self).replace(
          /^<mjx-container /,
          '<mjx-container tabindex="0" '
        )
      }
    } catch (error) {
      throw new Error(
        'You need to install markdown-it-mathjax3 to use math support.'
      )
    }
  }
~~~

由此可确定：

- **KaTeX 还是 MathJax？** → **MathJax（MathJax 3）**。官方唯一内置路径就是 markdown-it-mathjax3；想用 KaTeX 必须自己装第三方 markdown-it 插件（例如 [@mdit/plugin-katex](https://www.npmjs.com/package/@mdit/plugin-katex)），**官方无 KaTeX 文档**。
- **构建期还是客户端？** → **构建期**。markdown-it-mathjax3 是 markdown-it 插件，在 VitePress 构建（Node）阶段就把公式渲染为 MathJax 3 的 mjx-container 输出并写进 HTML，客户端不需要加载 MathJax。
- **math 选项类型**：boolean | any，默认 false；传对象即透传给 markdown-it-mathjax3。
- **未安装时的行为**：抛 Error: You need to install markdown-it-mathjax3 to use math support.

**行内公式支持**：支持。官方示例同时给出行内与块级写法，且**演示了在 Markdown 表格单元格里渲染公式**（麦克斯韦方程组示例），说明表格环境与公式可以共存。

**复杂宏包支持程度（\newcommand、\begin{align}、AMS）**：**未核实（未实测）**。markdown-it-mathjax3 README 宣称「Full LaTeX support: Supports all standard LaTeX math commands through MathJax」，并特别提到已支持 **XyJaX v3**（可用 xypic 画交换图）——但这是插件方的自述，且 VitePress 只透传选项，宏定义要自己通过 markdown.math 的对象形式传给 MathJax 配置。**建议自行验证。**

**SSR 常见坑（区分「已核实」与「未核实」）：**

- **已核实**：VitePress 生产构建在 **Node 里做 SSR 预渲染**（[SSR Compatibility 官方页](https://vitepress.dev/guide/ssr-compat)：VitePress pre-renders the app in Node.js during the production build）。因此所有自定义主题/组件代码都受 SSR 约束：
  - 只在 beforeMount / mounted 里访问浏览器 / DOM API；
  - 非 SSR 友好的组件用内置 <ClientOnly> 包裹；
  - **在 import 时就访问浏览器 API 的库**必须动态 import，或放进 if (!import.meta.env.SSR) { ... } 分支。
- **已核实**：数学路径本身是安全的——VitePress 用 await import(...) 动态引入 markdown-it-mathjax3，并包在 try/catch 里；渲染发生在 markdown-it 阶段（纯 Node/字符串处理），**不触碰 window**。
- **未核实**：网上流传的「MathJax 在 VitePress SSR 下报 window is not defined」具体报错案例，**本项目未复现、未能找到官方 issue 佐证**，故不写入结论。若你启用了**客户端** MathJax（例如手动 script 引入 MathJax 或用了 KaTeX 的 auto-render），那才会进入上面 SSR 页描述的通用陷阱范围。

**其他坑（已核实）：**
- **ESM-only**：require('vitepress') 会失败；配置文件名需 .mts/.mjs，或 package.json 里 "type": "module"。
- **Auto Minify 会破坏 hydration**（官方部署页警告）：压缩 HTML 会删掉 Vue 注释，出现 hydration mismatch。
- **GitHub Pages 子路径**：base 没配好会整站资源 404。
- **块级公式与 Markdown 的冲突**：由 markdown-it-mathjax3 按 pandoc 规则处理（同 §1.5 的规则）；表格里的竖线与公式并存时官方示例证明可行。
- **pdf 导出**：官方无内置 PDF 方案，**未核实**。

### 2.6 视觉风格

- **默认主题即「文档站」风格**，开箱简洁、对中文排版友好；内置暗色模式、本地搜索、侧边栏、outline、代码组、自定义容器。
- **基于 CSS 变量**（不是 Tailwind）。覆盖方式（[Extending the Default Theme](https://vitepress.dev/guide/extending-default-theme)）：

~~~js
// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default DefaultTheme
~~~

~~~css
/* .vitepress/theme/custom.css */
:root {
  --vp-c-brand-1: #646cff;
  --vp-c-brand-2: #747bff;
}
~~~

- 变量全量清单在仓库源码：[src/client/theme-default/styles/vars.css](https://github.com/vuejs/vitepress/blob/main/src/client/theme-default/styles/vars.css)。
- 官方还给出了**毛玻璃导航栏**的 CSS 变量玩法（--vp-nav-bg-color、--vp-nav-backdrop-filter），可用于提升观感；官方同时警告 backdrop-filter 有滚动性能开销、Safari 17 及更早不支持变量驱动的 backdrop filter。
- **优秀示例站（均于 2026-09-11 抓取页面确认版本号）**：
  - <https://vuejs.org/> → VitePress v2.0.0-alpha.17
  - <https://vite.dev/> → VitePress v2.0.0-alpha.20
  - <https://rollupjs.org/> → VitePress v1.6.4
  - <https://vitest.dev/> → VitePress v2.0.0-alpha.19
  - 说明：VitePress 官网**没有 showcase 页**（https://vitepress.dev/showcase 返回 **404**，本次已核实），故不引用无法验证的站点清单。

### 2.7 优缺点与适用人群

**优点**
- 「Vue 生态文档站」的事实标准，默认主题开箱即用、观感现代。
- 数学公式**构建期渲染**（MathJax 3 写入 HTML），无 JS 也能看到公式，且不引入客户端数学负担。
- 部署文档齐全：GitHub Pages（含 workflow 样例）/ Netlify / Vercel / Cloudflare Pages / AWS Amplify / Render 全部有官方指引。
- CSS 变量定制成本极低。

**缺点**
- 官方**只支持 MathJax**，不支持 KaTeX（除非自己接第三方插件）；且**数学是 opt-in**，必须额外装包。
- 会加载 Vue 客户端 JS（相对 Eleventy 的零 JS 是劣势）。
- ESM-only + 版本分裂（1.6.4 稳定 vs 2.0 alpha 文档）容易踩坑。
- 定位偏「文档」；做时间线博客需要自己写主题/布局。
- 构建速度无官方数字。

**适用人群**：**技术文档 / 技术博客（偏文档形态）**、Vue 生态项目、公式密度中等的技术写作。对**纯记录型**也够用，但需要接受「比 Eleventy 多一些 JS」。

---

## 3. Docusaurus（facebook/docusaurus）

### 3.1 技术栈

| 维度 | 结论 | 来源 |
| --- | --- | --- |
| 语言 / 框架 | **React + MDX v3**，TypeScript 编写 | [Docusaurus 官网](https://docusaurus.io/) |
| 运行时要求 | **Node.js >= 20**（@docusaurus/core@3.10.2 与 create-docusaurus@3.10.2 的 engines.node = ">=20.0"） | [v3.10.2 package.json](https://raw.githubusercontent.com/facebook/docusaurus/v3.10.2/packages/docusaurus/package.json) |
| Markdown 管线 | **remark / rehype（unified 生态）**，docs 插件通过 remarkPlugins / rehypePlugins 扩展；MDX v3 | [Math Equations 文档](https://docusaurus.io/docs/markdown-features/math-equations) |
| 构建速度 | **未核实**（官方未公布可复现的 benchmark 数字） | — |
| 输出形态 | **静态 HTML**。官方原文：A Docusaurus site is statically rendered, and it can generally work without JavaScript! 但默认主题仍会加载 React 运行时（具体 JS 体积**未核实**） | [Deployment](https://docusaurus.io/docs/deployment) |

### 3.2 部署方式（官方文档链接）

官方 [Deployment](https://docusaurus.io/docs/deployment) 页明确列出的托管：**Vercel、GitHub Pages、Netlify、Render、Surge**，以及自托管（Nginx/Apache2）。

- 构建产物在 **build/**；部署方式就是把 build/ 静态托管。
- 必须在 docusaurus.config.js 配好 url 与 baseUrl（子路径部署时）。
- 本地验证：npm run build + npm run serve。
- **注意**：官方 Deployment 页**没有出现 Cloudflare Pages**（2026-09-11 抓取全文检索 "Cloudflare" 结果为 0 命中）。也就是说 **Cloudflare Pages 不在 Docusaurus 官方部署文档内**；想用需自行按静态产物接入。

### 3.3 上手难度（从安装到跑起来）

~~~bash
npx create-docusaurus@latest my-website classic
cd my-website
npm run start     # 开发服务器
npm run build     # 产出 build/
npm run serve     # 本地预览 build/
~~~

- 运行时：**Node.js >= 20**（见 engines）。
- 官方文档：<https://docusaurus.io/docs/installation>

### 3.4 Markdown 渲染管线

- **remark（Markdown AST）→ rehype（HTML AST）**，即 unified 体系；MDX v3 允许在 Markdown 里直接写 JSX。
- docs / blog / pages 三个插件的 remarkPlugins、rehypePlugins 互相独立配置。
- 与 VitePress（markdown-it）和 MkDocs Material（Python-Markdown）**本质不同**：Docusaurus 的扩展点是 unified 插件。

### 3.5 LaTeX 数学公式的具体实现（重点核实）

官方文档页：[**https://docusaurus.io/docs/markdown-features/math-equations**](https://docusaurus.io/docs/markdown-features/math-equations)（页面署名 *Last updated on Jul 10, 2026 by Sébastien Lorber*）。

**方案：remark-math + rehype-katex（= KaTeX，构建期渲染）。**

**安装命令（官方原文）：**

~~~bash
npm install --save remark-math@6 rehype-katex@7
# 其他包管理器：yarn add / pnpm add / bun add remark-math@6 rehype-katex@7
~~~

> 官方**警告**原文：*Make sure to use remark-math 6 and rehype-katex 7 for Docusaurus v3 (using MDX v3). We can't guarantee other versions will work.*

**配置文件位置**：项目根目录 **docusaurus.config.js**（推荐 ESM 写法）。

**真实配置片段（官方 ESM 示例）：**

~~~js
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default {
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: 'docs',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
      },
    ],
  ],
};
~~~

**如果你坚持用 CommonJS 配置**（官方也给了写法，因为这两个插件是 ESM-only）：

~~~js
module.exports = async function createConfigAsync() {
  return {
    presets: [
      [
        '@docusaurus/preset-classic',
        {
          docs: {
            path: 'docs',
            remarkPlugins: [(await import('remark-math')).default],
            rehypePlugins: [(await import('rehype-katex')).default],
          },
        },
      ],
    ],
  };
};
~~~

**必须额外引入 KaTeX CSS。** 官方示例从 jsDelivr 加载 katex.min.css 并带 SRI integrity：

~~~js
export default {
  // ...
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@<VERSION>/dist/katex.min.css',
      type: 'text/css',
      integrity: 'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],
};
~~~

> **诚实说明**：官方页面上的 KaTeX 版本号被渲染层做了邮箱混淆保护（显示成 [email protected]），**我无法从页面正文可靠地读出确切版本号 → 标「未核实」**。上表的 integrity 值是官方页面上原样抓到的。请直接从官方页面复制整段配置，或用下方「自托管」方式。

**自托管 KaTeX 资源**（官方也给）：从 [KaTeX GitHub releases](https://github.com/KaTeX/KaTeX/releases) 下载，解压后把 katex.min.css 和 fonts 目录（官方说只需 .woff2）拷进站点的 static 目录，然后把 stylesheets[].href 改成 /katex/katex.min.css。

**逐项回答：**
- **KaTeX 还是 MathJax？** → **KaTeX**（rehype-katex）。官方页只给 KaTeX 方案。
- **构建期还是客户端？** → **构建期**。rehype-katex 运行在 rehype 阶段，把公式在构建时转成 KaTeX 的 HTML + 内联样式，写入静态 HTML；客户端**不需要数学 JS**，只需 CSS 与 KaTeX 字体。
- **行内公式支持**：支持。remark-math 的语法即行内与显示两种美元符形式；官方文档页头部演示了行内与块级公式（页面里可见渲染后的 KaTeX 产物 span.mord 等，说明是构建期生成的 HTML）。
- **复杂宏包（\newcommand、\begin{align}、AMS）**：**未核实（未实测）**。技术上由 KaTeX 能力决定——KaTeX 支持 \begin{align} 等 environments，\newcommand 需通过 KaTeX 的 macros 选项提供（可在 rehypePlugins: [[rehypeKatex, { macros: {...} }]] 里传）；KaTeX 官方支持列表：<https://katex.org/docs/supported>。但**本项目未实际构建验证 Docusaurus 下的表现**。

**常见坑：**
- **版本必须锁 remark-math@6 + rehype-katex@7**（Docusaurus v3 / MDX v3），官方明确说不保证其他版本可用。
- **两个插件都是 ESM-only**：CommonJS 配置必须改成 async 工厂函数 + 动态 import。
- **忘记引入 KaTeX CSS** 会导致公式排版错乱（这是最常见的新手问题）。
- **CDN 引入**：官方推荐 CDN + SRI；内网/离线场景需按官方「自托管 KaTeX 资源」做。
- **美元符与 Markdown 冲突**：由 remark-math 的 micromark 语法解析，规则与 pandoc 一致；块级公式前后需要空行。
- **MDX 特殊字符**：因为 MDX v3 会解析花括号与尖括号，公式里出现这些字符时需注意（这是 MDX 层面的通用问题；**具体行为未实测**）。
- **pdf 导出**：官方无内置 PDF 方案，**未核实**。
- **SSR / window**：KaTeX 在构建期跑，不存在客户端 window 问题；但**自定义 React 组件**若在渲染期访问 window 仍会预渲染失败（与 VitePress 同类问题）。

### 3.6 视觉风格

- 底层 CSS 框架：**Infima**（官方：@docusaurus/preset-classic uses Infima as the underlying styling framework；[Infima 官网](https://infima.dev/)）。
- **基于 CSS 变量**（--ifm-*），官方给 7 个色阶；覆盖文件为 **/src/css/custom.css**（[Styling your site with Infima](https://docusaurus.io/docs/styling-layout)）：

~~~css
/* src/css/custom.css */
:root {
  --ifm-color-primary: #2e8555;
  --ifm-color-primary-dark: #29784c;
  --ifm-color-primary-darker: #277148;
  --ifm-color-primary-darkest: #205d3b;
  --ifm-color-primary-light: #33925d;
  --ifm-color-primary-lighter: #359962;
  --ifm-color-primary-lightest: #3cad6e;
  --ifm-code-font-size: 95%;
}
~~~

- 暗色模式：html 上的 data-theme="light|dark"，可 [data-theme='dark'] { ... } 单独覆盖。官方提醒主色至少满足 **WCAG-AA** 对比度。
- 默认观感：**偏「产品官网 + 文档」**，首页可做 landing page，视觉比 VitePress 更「重」一些；官方自带颜色生成器预览配色。
- **示例站**：官方 showcase 页 <https://docusaurus.io/showcase>（本报告**未逐个核实**页面内列出的具体站点）。

### 3.7 优缺点与适用人群

**优点**
- 四者中**生态最庞大**（66k+ stars），主题/插件/文档/社区资料最丰富。
- 数学方案是**官方一等公民**：官方文档页给完整安装 + 配置 + 自托管方案，**构建期 KaTeX 渲染**。
- React/MDX 让「文档里直接写交互组件」变得自然（适合 API 文档、SDK 文档）。
- 部署文档覆盖 GitHub Pages / Vercel / Netlify / Render / Surge。
- Infima + CSS 变量定制成熟，配套本地搜索、博客、i18n、版本化内置。

**缺点**
- **Node >= 20**、依赖体量大、node_modules 与构建内存占用高；社区普遍反馈构建偏慢（**具体数字未核实**）。
- MDX v3 + ESM-only 插件对配置文件的写法有硬要求，容易卡在版本不匹配上。
- 默认主题仍加载 React，纯「静态阅读」场景略重。
- **Cloudflare Pages 不在官方部署文档内**。
- 中文写作场景下「文档站」气质强，做轻博客偏重。

**适用人群**：**大型文档站 / SDK 文档 / 需要交互组件的技术内容**；公式密集且希望**官方支持走构建期 KaTeX**的团队；已经有 React 技术栈的团队。

---

## 4. MkDocs Material（squidfunk/mkdocs-material）

### 4.1 技术栈

| 维度 | 结论 | 来源 |
| --- | --- | --- |
| 语言 / 框架 | **Python + MkDocs**；Markdown 引擎是 **Python-Markdown**（**不是 markdown-it**），扩展体系是 **PyMdown Extensions（pymdownx.*）** | [MkDocs Material 文档](https://squidfunk.github.io/mkdocs-material/)、[Arithmatex 文档](https://facelessuser.github.io/pymdown-extensions/extensions/arithmatex/) |
| 运行时要求 | **Python >= 3.8**（pyproject.toml 的 requires-python = ">=3.8"；PyPI requires_python 同为 >=3.8）；底层 **MkDocs 最新稳定版 1.6.1**（PyPI，**2024-08-30** 上传） | [pyproject.toml](https://raw.githubusercontent.com/squidfunk/mkdocs-material/master/pyproject.toml)、<https://pypi.org/pypi/mkdocs/json> |
| 构建速度 | **未核实**（官方未公布可复现的 benchmark 数字） | — |
| 输出形态 | 纯静态 HTML + **客户端 JS**（搜索、导航即时加载 instant loading、明暗切换等由主题 JS 驱动；**数学公式也是客户端渲染**，见 §4.5） | [Publishing your site](https://squidfunk.github.io/mkdocs-material/publishing-your-site/) |

### 4.2 部署方式（官方文档链接）

官方 [Publishing your site](https://squidfunk.github.io/mkdocs-material/publishing-your-site/) 页：

- **GitHub Pages**（官方主线，两种方式）
  - 用 GitHub Actions：.github/workflows/ci.yml + actions/setup-python@v5 + 缓存 ~/.cache + pip install mkdocs-material + mkdocs gh-deploy --force
  - 用 MkDocs 自带：[mkdocs gh-deploy](https://www.mkdocs.org/user-guide/cli/#mkdocs-gh-deploy)
- **GitLab Pages**：官方给完整 .gitlab-ci.yml（image: python:latest、mkdocs build --site-dir public）
- **Other（官方明确说是「社区贡献指南」，不是官方维护）**：
  - Cloudflare Pages → <https://deborahwrites.com/guides/deploy-host-mkdocs/deploy-mkdocs-material-cloudflare/>
  - Netlify → <https://deborahwrites.com/guides/deploy-host-mkdocs/deploy-mkdocs-material-netlify/>
  - Fly.io → <https://documentation.breadnet.co.uk/cloud/fly/mkdocs-on-fly/>
  - Scaleway → <https://www.scaleway.com/en/docs/tutorials/using-bucket-website-with-mkdocs/>
- **Vercel**：**未在官方页面列出**（2026-09-11 逐链接核实）。

### 4.3 上手难度（从安装到跑起来）

~~~bash
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install mkdocs-material        # 官方建议锁定大版本: pip install mkdocs-material=="9.*"
mkdocs new .                       # 生成 mkdocs.yml 与 docs/
mkdocs serve                       # 本地预览 http://127.0.0.1:8000
mkdocs build                       # 产出 site/
mkdocs gh-deploy --force           # 部署到 GitHub Pages
~~~

来源：[Installation](https://squidfunk.github.io/mkdocs-material/getting-started/)（官方还提供 docker 与 git 两种安装方式）。

### 4.4 Markdown 渲染管线

- 引擎：**Python-Markdown**（markdown 包），通过 markdown_extensions 挂扩展。
- 生态主力：**PyMdown Extensions**（pymdownx.*）——官方文档 [Python Markdown Extensions](https://squidfunk.github.io/mkdocs-material/setup/extensions/python-markdown-extensions/)。
- 与前三家（markdown-it / unified）**完全不同**：这里没有 markdown-it，也没有 remark/rehype。

### 4.5 LaTeX 数学公式的具体实现（重点核实）

官方文档页：[**https://squidfunk.github.io/mkdocs-material/reference/math/**](https://squidfunk.github.io/mkdocs-material/reference/math/)

**方案：pymdownx.arithmatex（generic: true）+ 客户端 MathJax 3 或 KaTeX。**

核心机制（[Arithmatex 官方文档](https://facelessuser.github.io/pymdown-extensions/extensions/arithmatex/)）：

- Arithmatex 的作用是 **「保留 LaTeX 公式，让 markdown 转换不要把公式吃掉」**，然后交给浏览器端 MathJax/KaTeX 处理。
- 识别的语法：
  - 行内：美元符包裹 与 \(...\)
  - 块级：双美元符、\[...\]、\begin{}...\end{}
  - 默认**全部启用**，每种格式可单独关闭。
- **smart_dollar 默认开启**：开美元符后面必须紧跟**非空白**字符，闭美元符前面必须是非空白字符。这样 *I have $2.00 and Bob has $10.00* **不需要转义**。需要字面美元符时用反斜杠转义。
- generic: true 时，输出会被**规范化**为 \(...\)（行内）/ \[...\]（块级），并包进 <span class="arithmatex"> / <div class="arithmatex">。
  - 默认（非 generic）输出是 <script type="math/tex">（行内）与 <script type="math/tex; mode=display">（块级），还会生成 MathJax_Preview 预览 span（可用 preview: False 关闭）。
  - **Arithmatex 文档明确说：这个 script 形式在 MathJax 3 里已不再是默认识别格式**（MathJax 2 时代的形式），因此要用 MathJax 3 就必须走 generic: true —— 这正是 Material 官方文档的写法。

**官方 MathJax 配置片段（mkdocs.yml）：**

~~~yaml
markdown_extensions:
  - pymdownx.arithmatex:
      generic: true

extra_javascript:
  - javascripts/mathjax.js
  - https://unpkg.com/mathjax@3/es5/tex-mml-chtml.js
~~~

**配套的 docs/javascripts/mathjax.js（官方原文）：**

~~~js
window.MathJax = {
  tex: {
    inlineMath: [["\\(", "\\)"]],
    displayMath: [["\\[", "\\]"]],
    processEscapes: true,
    processEnvironments: true
  },
  options: {
    ignoreHtmlClass: ".*|",
    processHtmlClass: "arithmatex"
  }
};

document$.subscribe(() => {   // 与 instant loading 集成
  MathJax.startup.output.clearCache()
  MathJax.typesetClear()
  MathJax.texReset()
  MathJax.typesetPromise()
})
~~~

**官方 KaTeX 配置片段（mkdocs.yml）：**

~~~yaml
markdown_extensions:
  - pymdownx.arithmatex:
      generic: true

extra_javascript:
  - javascripts/katex.js
  - https://unpkg.com/katex@0/dist/katex.min.js
  - https://unpkg.com/katex@0/dist/contrib/auto-render.min.js

extra_css:
  - https://unpkg.com/katex@0/dist/katex.min.css
~~~

**配套的 docs/javascripts/katex.js（官方原文）：**

~~~js
document$.subscribe(({ body }) => {   // 与 instant loading 集成
  renderMathInElement(body, {
    delimiters: [
      { left: "$$",  right: "$$",  display: true },
      { left: "$",   right: "$",   display: false },
      { left: "\\(", right: "\\)", display: false },
      { left: "\\[", right: "\\]", display: true }
    ],
  })
})
~~~

**逐项回答：**
- **插件/扩展的准确名称 + 安装**：扩展名 pymdownx.arithmatex（随 PyMdown Extensions 一起装；Material for MkDocs 已把 PyMdown 作为依赖，通常无需单独 pip install）。客户端数学库通过 extra_javascript / extra_css 的 CDN URL 引入（官方给的就是 unpkg 的 mathjax@3 与 katex@0）。
- **配置文件位置**：项目根 **mkdocs.yml**；自定义 JS 放 **docs/javascripts/**（相对 docs_dir）。
- **KaTeX 还是 MathJax**：**两个官方都支持**，任选。官方给了对比结论（[Math 页 Comparing 一节](https://squidfunk.github.io/mkdocs-material/reference/math/)）：
  - **速度**：KaTeX 一般更快；
  - **语法支持**：MathJax 支持更广的 LaTeX 命令，还支持 MathML / AsciiMath；
  - **输出格式**：都支持 HTML 与 SVG，MathJax 另有 MathML（对屏幕阅读器更友好）；
  - **可配置性**：MathJax 选项更多；
  - **浏览器兼容**：MathJax 对老浏览器更友好。
- **构建期还是客户端**：**客户端渲染**（关键差异点）。Arithmatex 只负责「原样保留 + 包裹」，真正的排版发生在浏览器里的 MathJax.typesetPromise() 或 renderMathInElement()。
  - **后果**：① 禁用 JS 时公式不渲染，用户看到的是原始 LaTeX 文本（不像 Docusaurus/VitePress 那样「构建期已成型」）；② 首屏可能出现公式闪烁；③ 必须处理 Material 的 **instant loading**（换页不刷新整页），官方正是用 document$.subscribe(...) 解决的。
- **行内公式支持**：支持。
- **复杂宏包（\newcommand、\begin{align}、AMS）**：**未核实（未实测）**。块级 \begin{align}...\end{align} 是 Arithmatex **原生识别**的语法之一（官方文档把它列为 block 形式），但**实际渲染效果取决于所选 JS 库**：MathJax 支持 AMS 宏包与 tex.macros 里的 \newcommand，KaTeX 只支持子集。本项目**未实际构建验证**。

**常见坑：**
- **必须用 generic: true** 配 MathJax 3，否则 Arithmatex 默认输出的 <script type="math/tex"> 形式在 MathJax 3 里识别不了（官方 Arithmatex 文档专门写了这条）。
- **美元符与 Markdown 冲突**：由 smart_dollar（默认开）处理；$2.00 不会被当公式；要字面美元符用反斜杠转义。这是四家里对「美元符号误判」处理得最体贴的一家。
- **ignoreHtmlClass / processHtmlClass 必须配对**：ignoreHtmlClass: ".*|" + processHtmlClass: "arithmatex" 表示「默认整页不扫描，只扫描 .arithmatex」。写错会导致整页被扫描（性能崩）或公式完全不渲染。
- **instant loading 下必须用 document$.subscribe** 重新 typeset，否则换页后新页面的公式不渲染（Material 用 XHR 局部换 DOM）。
- **KaTeX 的 delimiters 要写全**：官方示例同时列了 $$ / $ / \( / \[ 四种（因为 generic: true 会把美元符规范化成 \(）。
- **CDN 引入**：官方用 unpkg；内网/中国网络环境需自托管（**自托管步骤官方未给，未核实**）。
- **离线/PDF**：Material 有官方的 [Building for offline usage](https://squidfunk.github.io/mkdocs-material/setup/building-for-offline-usage/) 能力，但**PDF 导出方案未核实**。注意客户端渲染的公式在做 print-to-PDF 前必须已 typeset 完成。

### 4.6 2025–2026 年的重要变化：**MkDocs Material 已进入维护模式，团队转向 Zensical**（重点，已核实）

这是本节最重要的结论，全部来自官方博客与官方公告：

1. **2025-11-05《Zensical – A modern static site generator built by the Material for MkDocs team》**
   <https://squidfunk.github.io/mkdocs-material/blog/2025/11/05/zensical/>
   - 发布 **Zensical**，官方定位「next-gen static site generator」，「distilled from a decade of experience ... to overcome the technical limitations of MkDocs」。
   - **MIT 开源**，可商用；**可以原生读取 mkdocs.yml**，目标是「无缝迁移」；当时**只支持一部分插件**，正在做 feature parity。
   - 同时告别 sponsorware 模式，转向商业产品 **Zensical Spark**。

2. **2025-11-11《Material for MkDocs Insiders – Now free for everyone》**
   <https://squidfunk.github.io/mkdocs-material/blog/2025/11/11/insiders-now-free-for-everyone/>
   - **9.7.0 是 Material for MkDocs 的 final version**，所有原 Insiders 功能对所有人免费。
   - 原文：*As we're shifting our efforts to Zensical, **Material for MkDocs is entering maintenance mode**. This means that while we'll continue to fix critical bugs and security issues for 12 month at least, **no new features will be added** to Material for MkDocs.*

3. **2025-11-18《Goodbye, GitHub Discussions》**
   <https://squidfunk.github.io/mkdocs-material/blog/2025/11/18/goodbye-github-discussions/>
   - 再次确认 *Material for MkDocs has entered maintenance mode*，讨论区改为只读。

4. **2026-02-18（2026-08-30 更新）《What MkDocs 2.0 means for your documentation projects》**
   <https://squidfunk.github.io/mkdocs-material/blog/2026/02/18/mkdocs-2.0/>
   - **MkDocs 1.x 无人维护**：issues/PR 堆积、**18 个月无 release**、live-reload 等长期问题无计划修复、安全问题的处理态度不明。
   - **MkDocs 2.0 是 ground-up rewrite**，**与 Material for MkDocs 不兼容**：原文 *MkDocs 2.0 is incompatible with Material for MkDocs – If your documentation is built with Material for MkDocs, it will cease to work with MkDocs 2.0.*
   - 「MkDocs 2.0, in its current form, is not a drop-in replacement for MkDocs 1.x, and does not provide a clear migration path」。
   - 自 **Material 9.7.2** 起构建时会打印 **MkDocs 2.0 兼容性警告**，可用环境变量 NO_MKDOCS_2_WARNING=1 关闭。
   - MkDocs 2.0 **仍是 pre-release**。

**独立事实核对（我自己的 registry 查询，2026-09-11）：**
- PyPI 上 mkdocs 最新稳定版仍是 **1.6.1，2024-08-30 上传**（<https://pypi.org/pypi/mkdocs/json>）—— 与「MkDocs 1.x 已约 2 年无 release」的事实一致。
- PyPI 上 mkdocs-material 最新是 **9.7.7（2026-07-17 上传）** —— 说明维护模式**仍在发补丁**（与「继续修关键 bug 和安全问题至少 12 个月」相符）。
- 「至少 12 个月」若从 2025-11 起算，窗口大约到 **2026-11**；**该期限之后的支持情况：未核实**（官方承诺之后没有新公告）。

**对选型的直接影响：**
- 新项目选 MkDocs Material = 接受「**只修 bug、不加功能、底层 MkDocs 1.x 停更、上游 MkDocs 2.0 不兼容**」的既定事实。
- 迁移目标已经明确是 **Zensical**（[zensical.org](https://zensical.org/)，文档 <https://zensical.org/docs/>，MIT），且 Zensical 能读现有 mkdocs.yml。
- **Zensical 当前的插件覆盖度、数学公式支持成熟度：未核实**（本次未逐一验证 Zensical 的 arithmatex 兼容性）。

### 4.7 视觉风格

- Material Design 风格，四者中**开箱最「成品」的文档主题**：内置搜索、导航即时加载、代码块注解、admonition、内容标签页、数据表格、mermaid、社交卡片、博客插件、标签、版本切换、多语言。
- 配色通过 mkdocs.yml 的 theme.palette（[Changing the colors](https://squidfunk.github.io/mkdocs-material/setup/changing-the-colors/)）：

~~~yaml
theme:
  name: material
  palette:
    - scheme: default      # 亮色（default）/ 暗色（slate）
      primary: indigo
      accent: indigo
      toggle:
        icon: material/brightness-7
        name: Switch to dark mode
    - scheme: slate
      primary: indigo
      accent: indigo
      toggle:
        icon: material/brightness-4
        name: Switch to light mode
  features:
    - navigation.instant
    - navigation.tabs
    - content.code.copy
~~~

- 深度定制可用 **CSS 变量**（官方 Customization → Custom colors）。
- 字体可换（[Changing the fonts](https://squidfunk.github.io/mkdocs-material/setup/changing-the-fonts/)）。
- 默认观感：成熟、克制、阅读舒适，中文文档站非常常见；**在中文圈认知度最高**。
- 示例站：MkDocs Material 官方文档自身 <https://squidfunk.github.io/mkdocs-material/>（**第三方示例站未逐一核实**）。

### 4.8 优缺点与适用人群

**优点**
- 装好即用：pip install mkdocs-material 就能得到一个功能完整的文档站（搜索、导航、主题、博客、标签、版本化）。
- **数学公式官方支持**，且美元符误判（smart_dollar）处理得最贴心；MathJax/KaTeX 任选。
- 中文社区资料最丰富，中文查找支持好。
- 部署到 GitHub Pages 只需 mkdocs gh-deploy --force。

**缺点（本轮调研最需要注意的）**
- **底层 MkDocs 1.x 已停更**，上游 MkDocs 2.0 **与 Material 不兼容且无迁移路径**；Material 自身**进入维护模式**（只修关键 bug/安全，官方承诺「至少 12 个月」）。
- 生态处于迁移期：未来要评估迁到 **Zensical**。
- **数学是客户端渲染**：禁用 JS 时看到的是原始 LaTeX，首屏可能闪烁；需要处理 instant loading 下的重新 typeset。
- 部分高级能力（如社交卡片、离线构建等）历史上属于 Insiders，2025-11 起已对所有人免费（[公告](https://squidfunk.github.io/mkdocs-material/blog/2025/11/11/insiders-now-free-for-everyone/)）——这点对现有用户是利好。
- **Cloudflare Pages / Netlify 只有社区指南**，Vercel 未在官方列出。

**适用人群**：**学术公式密集的中文文档 / 课程笔记 / 项目文档**（开箱体验最好）；**纯记录型**（配置成本最低）；不介意「主题进入维护模式、未来可能迁 Zensical」的人。**不适合**追求长期上游活跃、或要求「无 JS 也能看公式」的场景。

---

## 5. 对比总结：文档型方案 vs 博客型方案，做公式密集内容时的差异

### 5.1 四家文档型横向对比（公式相关）

| 维度 | Eleventy | VitePress | Docusaurus | MkDocs Material |
| --- | --- | --- | --- | --- |
| Markdown 引擎 | markdown-it | markdown-it | remark + rehype (MDX v3) | Python-Markdown + pymdownx |
| 数学方案 | **无官方**，自选 markdown-it 插件 | 官方 opt-in：markdown-it-mathjax3 | **官方文档**：remark-math@6 + rehype-katex@7 | **官方文档**：pymdownx.arithmatex + MathJax/KaTeX |
| 数学库 | KaTeX 或 MathJax（看你装哪个） | **仅 MathJax 3**（官方） | **KaTeX** | MathJax 3 **或** KaTeX（都官方） |
| 构建期 / 客户端 | **构建期** | **构建期** | **构建期** | **客户端** |
| 无 JS 时公式 | 可见（构建期产物） | 可见 | 可见 | **不可见**（原始 LaTeX） |
| 行内公式 | 支持 | 支持 | 支持 | 支持 |
| 美元符误判处理 | pandoc 规则 | pandoc 规则 | pandoc 规则 | smart_dollar 默认开（体验最好） |
| 配置成本 | 高（无官方文档） | 中（装 1 个包 + 1 行配置） | 中（装 2 个包 + preset 配置 + CSS） | 低（mkdocs.yml 十几行） |
| 上手门槛 | 中 | 低 | 中高（Node 20 + ESM） | **最低**（Python + pip） |
| 官方数学文档页 | 无（不存在） | 有 | 有 | 有 |
| 部署官方覆盖 | GitHub Pages / Cloudflare / Netlify / Vercel / GitLab / Render 等 | GH Pages / Netlify / Vercel / Cloudflare / AWS Amplify / Render | Vercel / GH Pages / Netlify / Render / Surge（**无 Cloudflare**） | GH Pages / GitLab Pages（Cloudflare·Netlify 为社区指南，**无 Vercel**） |
| 项目活跃度 | 活跃（v3.1.6 / v4 alpha） | 活跃（v1.6.4 / v2 alpha） | 活跃（3.10.2） | **维护模式**（9.7.7，转向 Zensical） |
| 复杂度宏包 | 未核实（未实测） | 未核实（未实测） | 未核实（未实测） | 未核实（未实测） |

### 5.2 文档型 vs 博客型：核心差异

**1）内容模型与数学能力是两件正交的事。**
文档型 SSG 的价值在「多页 + 层级导航 + 侧边栏 + 全文搜索 + 版本化 + 多语言」；博客型 SSG（Hexo / Hugo / Zola / Astro 主题 / Chirpy / Firefly 等）的价值在「时间线 + 标签 + 分类 + RSS + 首页摘要」。**数学公式能力在两类里都是「插件/主题」问题，不是架构问题** —— 但文档型方案的数学路径通常**有官方文档兜底**（Docusaurus / VitePress / MkDocs Material 三家都有官方数学页），博客型方案则**极度依赖你选的那个主题**是否内置 KaTeX/MathJax。做公式密集内容时，**先确认主题的数学实现，再看主题好不好看**。

**2）构建期 vs 客户端渲染，是公式密集站最该看的指标。**
- **构建期渲染**（Docusaurus 的 rehype-katex、VitePress 的 markdown-it-mathjax3，以及 Eleventy + markdown-it 插件）：
  - 公式是 HTML 的一部分 → **禁用 JS 也能看**（对学术阅读、打印、RSS 阅读器、爬虫友好）；
  - 无首屏闪烁，无 CLS；
  - 大公式时构建时间变长，且公式错误会**在构建期就暴露**（好处也是坏处）。
- **客户端渲染**（MkDocs Material 的 arithmatex + MathJax/KaTeX，以及绝大多数博客主题的做法）：
  - 构建快、主题实现简单；
  - 但**首屏闪烁、无 JS 时只有裸 LaTeX**、打印/PDF 需要等 typeset 完成、SPA 式导航（instant loading / PJAX）下必须重新触发 typeset。
  - **公式密集（一页几十个 align 环境）时这个差异会被放大**，尤其是首屏抖动和「换页后公式不渲染」的问题。

**3）公式密集站对「文档型」更友好的地方：**
- 公式编号、定理/定义环境、交叉引用这类**学术写作刚需**，文档型方案更容易通过插件体系扩展（Docusaurus 的 remark/rehype 插件市场、MkDocs 的 pymdownx 扩展、VitePress 的 markdown-it 插件）。
- 大型公式文档需要**侧边栏 + 搜索 + 稳定锚点**，文档型天生具备。
- MkDocs Material 的 smart_dollar 对中文技术文里频繁出现的「$100」这类文本最友好。

**4）公式密集站对「博客型」更友好的地方：**
- 个人写作流（时间线、草稿、RSS）更顺；Hexo/Hugo 的中文主题生态庞大。
- 如果你只是**偶尔**写公式，博客型主题的「开箱即用 + 好看」性价比更高。
- Hugo 的 Goldmark + passthrough 扩展是构建期数学方案的经典组合（速度快），数据见 §1.1 的 4000 文件基准（Hugo 0.68 s）。

**5）中文写作者的现实选择建议（基于本轮核实到的事实）：**
- **要「开箱即用的中文文档站 + 公式」** → **MkDocs Material**（配置成本最低），但必须接受 **维护模式 + 未来迁 Zensical** 的事实（§4.6）。
- **要「公式与站点都长期活跃、构建期渲染」** → **Docusaurus**（官方 KaTeX 路径，但 Node 20 + ESM 配置门槛）或 **VitePress**（配置更轻，但官方只给 MathJax，且会加载 Vue JS）。
- **要「极致静态、零客户端 JS、自己完全掌控 HTML」** → **Eleventy**（但数学要自己接线，社区插件老旧）。
- **要「个人博客 + 少量公式」** → 博客型方案（见本调研的博客部分）更省心；**不要**为公式去迁就文档型。

---

## 附录 A：核实清单

| 结论 | 核实方式 | 结果 |
| --- | --- | --- |
| eleventy-plugin-katex 在 npm 不存在 | registry.npmjs.org/eleventy-plugin-katex | **Not found** → 任务书假设不成立 |
| Eleventy 官方无数学公式插件 | <https://www.11ty.dev/docs/plugins/> 全文检索 math/katex | 0 命中 |
| eleventy-plugin-mathjax 存在但老旧 | npm registry | 2.0.4 / 2021-11-19 |
| VitePress 数学需手动装 markdown-it-mathjax3 | 官方 markdown 文档 + v1.6.4 源码 markdown.ts | 确认（math?: boolean 默认 false） |
| VitePress 数学是构建期渲染 | 源码：markdown-it 插件 + mjx-container 输出 | 确认 |
| VitePress 无 showcase 页 | https://vitepress.dev/showcase | **404** |
| VitePress 示例站版本 | 抓取 vuejs.org / vite.dev / rollupjs.org / vitest.dev 页面字符串 | v2.0.0-alpha.17 / v2.0.0-alpha.20 / v1.6.4 / v2.0.0-alpha.19 |
| Docusaurus 官方部署页无 Cloudflare | 抓取 deployment 页全文检索 "Cloudflare" | 0 命中 |
| Docusaurus 数学版本约束 | 官方 math-equations 页 | remark-math@6 + rehype-katex@7（v3/MDX v3） |
| Docusaurus Node 要求 | v3.10.2 packages/docusaurus/package.json | >=20.0 |
| MkDocs Material 进入维护模式 | 官方博客 2025-11-11 | 确认（「9.7.0 final version」「at least 12 month」「no new features」） |
| MkDocs 2.0 与 Material 不兼容 | 官方博客 2026-02-18 | 确认 |
| MkDocs 1.x 长期无 release | PyPI mkdocs JSON | 1.6.1 / 2024-08-30 |
| MkDocs Material 仍在发补丁 | PyPI mkdocs-material JSON | 9.7.7 / 2026-07-17 |
| Zensical 官方站 | <https://zensical.org/> | 200，官方文案「built by the creators of Material for MkDocs」 |
| VitePress 1.6.4 的 Node 要求 | raw v1.6.4 docs/en/guide/getting-started.md | Node 18+（与 v2-alpha 文档的 Node 22+ 不同） |

## 附录 B：明确标注为「未核实」的条目

1. 除 Eleventy（其官方页引用 2022 年第三方基准）外，**VitePress / Docusaurus / MkDocs Material 的构建速度数字**。
2. 四家方案在 **\newcommand、\begin{align}、AMS 宏包** 上的实际表现（均未实测）。
3. Docusaurus 官方示例中 **KaTeX 的确切版本号**（页面做了邮箱混淆保护）。
4. **VitePress 下 MathJax 的 SSR 报错案例**（未复现、无官方 issue 佐证）。
5. 除 VitePress 示例站外的**第三方优秀示例站**（Docusaurus showcase 内站点、MkDocs Material 用户站未逐一核实）。
6. 四家的 **PDF 导出**方案（官方均未给出可核实的标准做法）。
7. **Zensical 当前的功能覆盖度**（尤其数学公式 / arithmatex 兼容性）与 MkDocs Material 维护窗口结束（约 2026-11）之后的官方支持状况。
8. katex@0.18.7 的 jsDelivr CDN 路径（README 里给的是 0.16.4）。

---

# 第六部分：横向总表与选型建议

> 访问日期：2026-09-11。所有 star / 版本 / 日期均为当日实测；未核实项已逐条标注。

## 6.1 九大方案总表

| 方案 | 语言 / 运行时 | Stars | 最新版本（日期） | Markdown 解析器 | 官方公式方案 | 渲染时机 | 引擎 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Hexo** | Node ≥ 20.19 | [41,763](https://github.com/hexojs/hexo) | v8.1.2（2026-05-06） | marked（默认）/ markdown-it / pandoc | `hexo-math`、`hexo-filter-mathjax`、换渲染器 | 构建期为主 | KaTeX 或 MathJax |
| **Hugo** | Go（单二进制） | [89,787](https://github.com/gohugoio/hugo) | v0.166.0（2026-09-10） | **Goldmark** | `passthrough`+MathJax / **`transform.ToMath`** | **两者皆可** | 内嵌 KaTeX / MathJax |
| **Zola** | Rust（单二进制） | [17,419](https://github.com/getzola/zola) | v0.23.4（2026-08-20） | pulldown-cmark | **无内置**（自己引 CDN） | 客户端 | 自选 |
| **Astro** | Node ≥ 22.12 | [62,474](https://github.com/withastro/astro) | astro@7.3.2（2026-09-08） | **Sätteri（v7 默认）** / Unified | remark-math + rehype-katex | 构建期 | KaTeX / MathJax |
| **Jekyll** | Ruby | [51,655](https://github.com/jekyll/jekyll) | v4.4.1（2025-01-29） | **Kramdown** | `math_engine` 选项 | 构建期解析 + 客户端渲染 | 默认 `mathjax`，可 `katex` |
| **Valaxy** | Node（Vue 3 + Vite） | [1,127](https://github.com/YunYouJun/valaxy) | v1.0.0-**rc.9**（2026-08-28） | markdown-it | `features.katex`（框架级） | 构建期 | **KaTeX 默认**，可 MathJax |
| **Eleventy** | Node | [19,899](https://github.com/11ty/eleventy) | npm 3.1.6（2026-06-02） | markdown-it | **无官方方案** | 构建期（自接插件） | 自选 |
| **VitePress** | Node（Vue 3 + Vite） | [18,308](https://github.com/vuejs/vitepress) | npm 1.6.4（2025-08-05）/ 2.0.0-alpha.20 | markdown-it | `markdown-it-mathjax3`（opt-in） | 构建期 | **仅 MathJax** |
| **Docusaurus** | Node ≥ 20（React） | [66,226](https://github.com/facebook/docusaurus) | 3.10.2（2026-07-10） | remark/rehype + MDX v3 | `remark-math` + `rehype-katex` | 构建期 | KaTeX |
| **MkDocs Material** | Python | [27,418](https://github.com/squidfunk/mkdocs-material) | 9.7.7（2026-07-17） | **Python-Markdown** + pymdownx | `pymdownx.arithmatex` | **客户端** | MathJax / KaTeX |

### 6.1.1 Astro 五大主题

| 主题 | Stars | 最近 commit | Astro | 样式方案 | 公式 |
| --- | --- | --- | --- | --- | --- |
| [Fuwari](https://github.com/saicaca/fuwari) | 4,992 | 2025-12-11（~9 个月无提交） | 5.13.10 | Tailwind v3 | 内置，构建期 |
| [Firefly](https://github.com/CuteLeaf/Firefly) | 2,111 | **2026-09-11（当天）** | 7.2.10 | Tailwind v4 | 内置 + mhchem |
| [AstroPaper](https://github.com/satnaing/astro-paper) | 5,037 | 2026-08-05 | ^7.0.3 | Tailwind v4 | **默认无** |
| [Typography](https://github.com/moeyua/astro-theme-typography) | 623 | 2025-07-24（~14 个月无提交） | ^5.11.1 | UnoCSS | 有但**默认关** |
| [Retypeset](https://github.com/radishzzz/astro-theme-retypeset) | 696 | 2026-04-12 | ^6.1.5 | UnoCSS | 内置，默认开，中文默认 |

### 6.1.2 Hexo / Hugo 主流主题

| 主题 | Stars | 最近 commit | 公式开关 |
| --- | --- | --- | --- |
| [Hexo Butterfly](https://github.com/jerryc127/hexo-theme-butterfly) | 8,362 | 2026-08-13 | `math.use` |
| [Hexo Fluid](https://github.com/fluid-dev/hexo-theme-fluid) | 8,169 | 2026-05-09 | `post.math.enable` |
| [Hexo NexT](https://github.com/next-theme/hexo-theme-next) | 2,779 | 2026-09-08 | `math.mathjax/katex` |
| [Hexo Stellar](https://github.com/xaoxuu/hexo-theme-stellar) | 2,026 | 2026-09-11 | 未逐一核实 |
| [Hugo PaperMod](https://github.com/adityatelange/hugo-PaperMod) | 13,902 | 2026-08-02 | 无（靠框架能力） |
| [Hugo Stack](https://github.com/CaiJimmy/hugo-theme-stack) | 6,468 | 2026-05-25 | `article.math`（KaTeX） |
| [Hugo LoveIt](https://github.com/dillonzq/LoveIt) | 3,868 | 2026-03-11（放缓） | 未逐一核实 |
| [Hugo Blowfish](https://github.com/nunocoracao/blowfish) | 2,889 | 2026-09-03 | 未逐一核实 |
| [Hugo FixIt](https://github.com/hugo-fixit/FixIt) | 1,118 | 2026-09-10 | 未逐一核实 |
| [Zola tabi](https://github.com/welpo/tabi) | 264 | 2026-09-10 | README 声明内置 KaTeX |

## 6.2 五条硬结论（本调研最有价值的发现）

1. **「构建期 vs 客户端渲染」比「选哪个 SSG」更决定公式体验。** Docusaurus / VitePress / Eleventy / Astro / Hexo（多数路径）/ Hugo(`transform.ToMath`) 是**构建期**——无 JS 也能看、无首屏闪烁、可打印；MkDocs Material 与**多数博客主题**是**客户端**——首屏闪烁、无 JS 只见裸 LaTeX、PJAX 切页后需重新排版。

2. **KaTeX 不支持 `\label` / `\ref` / `\eqref` / `\require`。** 官方 support table 逐条列出（https://katex.org/docs/support_table ）。**要交叉引用与自动编号必须用 MathJax**（`tags: 'ams'`，https://docs.mathjax.org/en/latest/input/tex/eqnumbers.html ）。这一条直接决定「学术写作」的选型。

3. **Hugo 是唯一提供「框架级构建期 KaTeX」的方案**（`transform.ToMath`，内嵌引擎、无需装包、无需 CSS、结果落盘缓存），同时官方文档给了完整的 passthrough + MathJax 客户端方案。**数学能力与文档完备度都是第一。**

4. **Zola 没有内置数学支持**——源码（`markdown.rs` 无 `math`/`katex` 命中）、依赖（`Cargo.toml` 无数学库）、文档（sitemap 无数学页，三个候选 URL 全 404）三重证据。必须手动引 CDN，且因缺 passthrough 机制而更容易被 Markdown 吃掉 `_`。

5. **MkDocs Material 已进入维护模式。** 官方博客 2025-11-11 宣布 9.7.0 为 final version、进入 maintenance mode（至少 12 个月只修关键 bug 与安全问题、不加新功能）；继任者是同一个团队的新项目 **Zensical**（https://zensical.org/ ）；2026-02-18 官方又确认 MkDocs 1.x 无人维护、MkDocs 2.0 与 Material 不兼容且无迁移路径。**新项目不建议现在选它。**

### 6.2.1 三个需要纠正的常见误解

| 常见说法 | 事实 |
| --- | --- |
| 「Zola 内置 MathJax 支持」 | ❌ 无内置，三重证据见上 |
| 「VitePress 内置数学公式」 | ⚠️ 半对：需要手动 `npm add -D markdown-it-mathjax3` 并设 `markdown.math: true`；默认 `false`，未装会抛 `You need to install markdown-it-mathjax3 to use math support.`；**官方只支持 MathJax，无 KaTeX 路径** |
| 「Eleventy 有 `eleventy-plugin-katex`」 | ❌ 该包在 npm **不存在**（registry 返回 Not found）；真实替代 `@vscode/markdown-it-katex`、`@mdit/plugin-katex`、`markdown-it-mathjax3` |

## 6.3 按人群选型

### A. 学术 / 公式密集（定理、证明、引用前文公式）

**推荐：Hugo（passthrough + MathJax）** 或 **Docusaurus（remark-math + rehype-katex + 必要时换 MathJax）**。

- 需要 `\ref`/`\eqref` 交叉引用 → **必须 MathJax**，排除一切构建期 KaTeX 方案。
- Hugo 的 passthrough 能在解析器层面保护公式，且官方文档完整，是首选。
- 备选 **al-folio**（16,121 star）：如果同时需要论文列表（BibTeX）+ CV + 博客的学术主页，Jekyll 生态里它几乎无可替代，代价是 Ruby 环境 + 主题定制要改 Liquid/SCSS。

### B. 中文写作者

**推荐：Hexo + Butterfly/Fluid**（生态最成熟）或 **Valaxy**（配置最省心）。

- Hexo 中文主题与教程最多；但公式是「四条路线选一条」的折腾活，务必照抄 Fluid 官方文档的三步操作，且**只装一个数学插件**。
- Valaxy 的数学是**框架级、默认开启**（`features.katex: true`），中文文档原生，是「少配置跑通公式」的最优解；代价是仍处 **v1.0.0-rc.9**、生态小。
- Astro 侧若偏中文阅读体验，看 **Retypeset**（默认 `locale: 'zh'`、公式默认开）。

### C. 技术博客（要好看、要功能全）

**推荐：Astro + Firefly**（维护最活跃，2026-09-11 当天仍在提交）或 **Hugo + PaperMod/Stack**。

- Firefly 是 Fuwari 的二创，已用 Astro 7 的正确写法（`unified({...})`），Tailwind v4 + 28 个 Svelte 组件 + 中文字体已内置。
- 注意三处修正：katex 版本对齐、`[rehypeKatex, { katex }]` 覆盖实例无效（rehype-katex@7.0.1 硬编码 `import katex from 'katex'`）、有货币符号时设 `singleDollarTextMath: false`。
- Fuwari 本体已约 9 个月无提交，Astro 5 / Tailwind 3 属旧路线。

### D. 纯记录型（少折腾、长期可维护）

**推荐：Hugo**（单二进制、无运行时依赖、部署平台覆盖最全）或 **Zola**（Tera 模板更友好）。

- 不推荐 Zola 做公式，但纯记录型本来就不写公式。
- 避免 Jekyll（Ruby 环境是九个方案里最麻烦的）。

### E. 文档站（产品/项目文档）

**推荐：Docusaurus 或 VitePress**（都活跃、都构建期渲染）。

- **不建议现在新选 MkDocs Material**：进入维护模式 + MkDocs 2.0 不兼容无迁移路径，属于明确的长期风险。若已在用，关注 Zensical 的迁移路径。
- Docusaurus 官方 Deployment 页**全文无 Cloudflare**；MkDocs Material 的 Cloudflare/Netlify 只是社区指南、Vercel 未列出——**部署平台覆盖也是选型变量**。

## 6.4 部署平台覆盖速查

| 方案 | GitHub Pages | Vercel | Netlify | Cloudflare Pages | 来源 |
| --- | --- | --- | --- | --- | --- |
| Hexo | ✅ 官方 | ⚠️ 无专页 | ⚠️ 无专页 | ⚠️ 无专页 | https://hexo.io/docs/github-pages |
| Hugo | ✅ | ✅ | ✅ | ✅ | https://gohugo.io/host-and-deploy/ |
| Zola | ✅ | ✅ | ✅ | ✅ | https://www.getzola.org/documentation/deployment/ |
| Astro | ✅（withastro/action） | ✅ | ✅ | ✅ | https://docs.astro.build/en/guides/deploy/ |
| Jekyll | ✅ 原生但**锁 Jekyll 3.10.0** + 插件白名单（Chirpy/al-folio 均**不可用**，须 Actions） | ⚠️ 平台通用 | ⚠️ 平台通用 | ⚠️ 未核实 | https://pages.github.com/versions.json |
| Valaxy | ✅ | ✅ | ✅ | ✅ | https://valaxy.site/guide/deploy |
| Eleventy | ✅ | ✅ | ✅ | ✅ | https://www.11ty.dev/docs/deployment/ |
| VitePress | ✅（官方 workflow） | ✅ | ✅ | ✅ | https://vitepress.dev/guide/deploying |
| Docusaurus | ✅ | ✅ | ✅ | ❌ **官方未列** | https://docusaurus.io/docs/deployment |
| MkDocs Material | ✅（`mkdocs gh-deploy`） | ❌ 未列出 | ⚠️ 社区指南 | ⚠️ 社区指南 | https://squidfunk.github.io/mkdocs-material/publishing-your-site/ |

## 6.5 视觉风格速查

| 方案 | 默认是否简约 | Tailwind？ | 可调项 | 代表主题 |
| --- | --- | --- | --- | --- |
| Hexo | 默认 Landscape 很朴素 | ❌（Stylus/SCSS） | 主题色、字体、圆角、背景、外挂标签 | Butterfly、Fluid、NexT、Stellar |
| Hugo | 取决于主题 | 部分（Blowfish ✅） | SCSS 变量、CSS 变量、封面、字体 | PaperMod、Stack、Blowfish |
| Zola | 取决于主题 | 部分 | 主题配置 | tabi、以及官方主题库 |
| Astro | 是 | ✅（Fuwari v3 / Firefly v4 / AstroPaper v4） | Tailwind 类、CSS 变量、暗色模式、动效 | Firefly、Retypeset、AstroPaper |
| Jekyll | 是（Chirpy 极简 / al-folio 学术） | ❌（SCSS + Bootstrap） | `_sass` 变量、CSS 变量 | Chirpy、al-folio |
| Valaxy | 是 | ❌（**UnoCSS**） | 主题配置、UnoCSS 类、Vue 组件 | valaxy-theme-yun、press |
| Eleventy | **无官方主题** | 社区 starter | 全自己写 | eleventy-base-blog |
| VitePress | 是 | ❌ | `--vp-c-*` CSS 变量 | 默认主题 |
| Docusaurus | 是 | ❌（**Infima**） | `--ifm-*` CSS 变量 | 默认主题 |
| MkDocs Material | 是 | ❌ | `theme.palette`、CSS 变量 | Material 本身 |

**共同规律**：这 10 个方案的**主流主题默认都走简约路线**，差异主要在「可调深度」与「动效丰俭」。**没有一个是 Tailwind-only**——Tailwind 主要集中在 Astro 主题（Fuwari/Firefly/AstroPaper）与 Hugo 的 Blowfish。提升观感的低成本手段按性价比排序：① 配色（CSS 变量主题色）→ ② 字体（中文尤其重要：Noto Sans SC / 思源黑体，Firefly 与 Retypeset 已内置）→ ③ 留白与行高 → ④ 动效（Pjax / View Transitions / 打字机）。

## 6.6 一句话总结

> **追求构建期 + 中文生态 → Hexo（能忍折腾）或 Valaxy（图省心，但 v1.0 RC）。**
> **追求数学最强 + 长期稳定 → Hugo（构建期 KaTeX 或 passthrough MathJax）。**
> **追求主题好看 + 维护活跃 → Astro + Firefly。**
> **学术主页 → al-folio。文档站 → Docusaurus / VitePress（远离 MkDocs Material）。**
> **别踩的坑：Zola 无内置数学、KaTeX 无 `\ref`、Eleventy 的 `eleventy-plugin-katex` 不存在。**

---

## 附录：本笔记的核实边界

- **已核实**：全部 star 数、release/commit 时间、npm/PyPI/RubyGems 版本号、官方文档中的配置片段与命令、Zola 无数学支持的源码级证据、KaTeX/MathJax 能力边界、MkDocs Material 维护模式公告。
- **已核实（曾误标为未核实）**：Chirpy 的数学开关是**文章 front matter 的 `math: true`**（引擎 MathJax 4，客户端渲染，配置在 `assets/js/data/mathjax.js`）；al-folio 的开关是 **`_config.yml` 的 `enable_math: true`**（引擎 MathJax 3.2.2，带 SRI）。另核实：GitHub Pages **内置构建锁定 Jekyll 3.10.0** 且插件白名单**不含** jekyll-archives / jekyll-scholar / katex / execjs，故 Chirpy 与 al-folio **都必须走 GitHub Actions**。详见第四部分 §2.1.5 / §3.5。
- **标注「未核实」**：各方案实际构建耗时基准（除 Eleventy 官方引用的 2022 第三方基准外）、Astro 构建速度、Firefly 的 mhchem 在构建期是否真正生效、各主题的 PDF 导出、Zensical 的数学兼容度、Valaxy 中 katex.min.css 的自动引入位置。
- **数据来源限制**：本次调研未使用 `api.github.com`（未认证配额耗尽），star 与时间线改由 GitHub 仓库页 HTML 与 `releases.atom`/`commits.atom` 获取；本会话 `web_search` 端点故障，检索由直接抓取官方域名与仓库完成。上述替代路径得到的数值与 API 等价。
