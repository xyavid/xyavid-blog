# 第四部分（a）：Jekyll 本体、Chirpy / al-folio、Valaxy

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

