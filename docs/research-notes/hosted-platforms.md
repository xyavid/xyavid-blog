# 托管平台类博客方案调研笔记

> **调研日期：2026-09-11**。下列所有数字、版本号、价格与结论均来自该日实际抓取成功的**官方来源**（官方站点、官方定价页、官方文档、官方 GitHub 仓库 / Release / Changelog、官方帮助中心）。每条关键结论后以 markdown 链接标注来源 URL。
>
> 抓取受限或官方未披露的条目，一律在正文中标注「**未核实**」并说明失败的 URL，汇总见文末「附：未核实事项汇总」。本文件是**带引用的调研笔记**，不是最终报告。

## 覆盖范围与本笔记的对应关系

| # | 任务清单条目 | 本笔记对应小节 |
| --- | --- | --- |
| 1 | WordPress（WordPress.com + WordPress.org） | 1. WordPress（WordPress.com 托管版 + WordPress.org 自托管版） |
| 2 | Ghost（Ghost Pro + 自托管） | 2. Ghost（Ghost Pro 托管版 + 自托管版） |
| 3 | Hashnode | 3. Hashnode |
| 4 | Substack | 4. Substack |
| 5 | Medium | 5. Medium |
| 6 | Bear Blog | 6. Bear Blog（bearblog.dev） |
| 7 | Obsidian Publish | 7. Obsidian Publish |
| 8 | Notion 系方案 | 8a. Notion 官方站点 / 8b. NotionNext / 8c. Nobelium |
| 9 | micro.blog | 9. micro.blog |
| 10 | Halo | 10. Halo |
| 11 | Typlog | 11. Typlog |
| 12 | WriteFreely / Write.as | 12. WriteFreely / Write.as |

每个平台均按同一模板记录 9 个小节：技术栈与托管方式 / 最新版本或最近更新时间 / 社区活跃度证据 / 上手难度 / 费用 / Markdown 支持情况 / LaTeX 数学公式支持 / 视觉风格评价 / 优缺点与适用人群。

---

## 1. WordPress（WordPress.com 托管版 + WordPress.org 自托管版）

### 技术栈与托管方式
- **WordPress.com（SaaS 托管版）**：全托管，主机、安全、备份、更新都由 Automattic 负责，官方明确「Every WordPress.com plan, including the free plan, comes with hosting included」，含全球 CDN、SSL、DDoS 防护、暴力破解防护与受管核心更新，不需要自己买服务器（[wordpress.com/pricing](https://wordpress.com/pricing/)）。
- **WordPress.org（自托管版）**：开源软件自行下载安装，官方要求主机支持 PHP 8.3+ 与 MySQL 8.0+ / MariaDB 10.11+（仍可跑在 PHP 7.4+/MySQL 5.5.5+，但均已 EOL 有安全风险），推荐 Apache 或 Nginx（[wordpress.org/about/requirements](https://wordpress.org/about/requirements/)、[wordpress.org/download](https://wordpress.org/download/)）。服务器、域名、备份、加固都要自己负责（[developer.wordpress.org 加固指南](https://developer.wordpress.org/advanced-administration/security/hardening/)）。
- 核心语言为 PHP，数据库 MySQL/MariaDB；官方下载页给出的安装方式是自行上传安装（[wordpress.org/download](https://wordpress.org/download/)）。

### 最新版本或最近更新时间
- 核心最新大版本 **WordPress 7.1（代号 “Mary Lou”）**，发布日期 2026-08-19（[wordpress.org/news](https://wordpress.org/news/)、[wordpress.org/news/2026/08/mary-lou](https://wordpress.org/news/2026/08/mary-lou/)）。
- 官方版本检查接口当前返回 `current: 7.1`（[api.wordpress.org/core/version-check/1.7](https://api.wordpress.org/core/version-check/1.7/)）。
- GitHub：WordPress/WordPress（SVN 镜像）star 21,410、最近 commit 2026-09-11、最新 tag 7.1；WordPress/wordpress-develop star 3,434、最近 commit 2026-09-11（[github.com/WordPress/WordPress](https://github.com/WordPress/WordPress)、[github.com/WordPress/wordpress-develop](https://github.com/WordPress/wordpress-develop)，指标日期 2026-09-11）。
- WordPress.com 托管版的套餐与 FAQ 页面标注 `dateModified: 2026-08-18`，版本跟随核心自动更新（[wordpress.com/pricing](https://wordpress.com/pricing/)）。

### 社区活跃度证据
- WordPress/WordPress star 21,410、wordpress-develop star 3,434，两者最近 commit 均为 2026-09-11（[github.com/WordPress/wordpress-develop](https://github.com/WordPress/wordpress-develop)，指标日期 2026-09-11）。
- 7.1 由 800+ 位贡献者参与，其中 170+ 位首次贡献者，合计交付 1,500+ 项增强与修复，20+ 语言在发布首日完成完整翻译（[wordpress.org/news/2026/08/mary-lou](https://wordpress.org/news/2026/08/mary-lou/)）。
- 插件目录收录 **72,000+ 免费插件**（[wordpress.org/plugins](https://wordpress.org/plugins/)）；主题目录 **15,000+ 免费主题**（目录页当前筛选计数显示 8,584 个主题）（[wordpress.org/themes](https://wordpress.org/themes/)）。
- WordPress.com 官方首页只写「Millions of creators」，没有给出具体用户数，具体数字未核实（[wordpress.com](https://wordpress.com/)）。
- 官方自托管用户论坛与本地社群入口见 [wordpress.org/download](https://wordpress.org/download/) 页脚链接（[wordpress.org/support/forum/installation](https://wordpress.org/support/forum/installation/)）。

### 上手难度
- **WordPress.com**：注册 → 选主题 → 用 Web 区块编辑器写第一篇，全程无需 CLI/Git；免费计划即可发布，地址是 `yoursite.wordpress.com` 子域（[wordpress.com/pricing](https://wordpress.com/pricing/)）。只有 Business/Commerce 才提供 SFTP/SSH、WP-CLI、Git 命令与 GitHub Deployments（[wordpress.com/pricing](https://wordpress.com/pricing/)）。官方另有浏览器里的临时演示环境 WordPress Playground（[wordpress.org/playground](https://wordpress.org/playground/)）。
- **WordPress.org**：需要自己买主机与域名、上传程序、建数据库并完成安装，官方安装指南见 [developer.wordpress.org 安装指南](https://developer.wordpress.org/advanced-administration/before-install/howto-install/)；长期维护（备份、权限、更新策略）也由自己承担（[developer.wordpress.org 加固指南](https://developer.wordpress.org/advanced-administration/security/hardening/)）。

### 费用
- **WordPress.com**（官方定价页的价格标记，均为「每月单价」，按结算周期）：Free $0；Personal 月付 $9、年付 $4、两年付 $3.25、三年付 $2.75；Premium 月付 $18、年付 $8、两年付 $6.50、三年付 $5.50；Business 月付 $40、年付 $25、两年付 $20、三年付 $17.50；Commerce 月付 $70、年付 $45、两年付 $36、三年付 $31.50（[wordpress.com/pricing](https://wordpress.com/pricing/)）。
- 免费计划：WordPress.com 子域、1 GB 存储、无限页面与文章、仅最近 7 天基础统计；不含自定义域名、不含插件安装、访客会看到广告（[wordpress.com/pricing](https://wordpress.com/pricing/)）。
- 所有付费计划都可安装 **50,000+ 插件**，且年付/多年付含首年免费自定义域名（月付不含）（[wordpress.com/pricing](https://wordpress.com/pricing/)）。价格随国家/货币不同（[wordpress.com/support/plan-features](https://wordpress.com/support/plan-features/)）。
- **WordPress.org 自托管**：软件本身免费开源（[wordpress.org/download](https://wordpress.org/download/)），成本为主机 + 域名；官方只列出推荐主机清单，未给出统一价格，具体托管费用**未核实**（[wordpress.org/hosting](https://wordpress.org/hosting/)）。

### Markdown 支持情况
- **不是默认书写方式**：区块编辑器默认用区块排版；WordPress.com 支持文档写明「Before you can use the Markdown block, you must enable Markdown for your site」，需在设置里打开 “Use Markdown for posts and pages”，装插件的站点则在 Jetpack → Settings → Composing 打开（[wordpress.com/support/markdown](https://wordpress.com/support/markdown/)）。
- Markdown block 可用于文章、页面与评论，遵循 **CommonMark** 规范，页面也提到 Markdown Extra 与 Classic Editor 下的用法（[wordpress.com/support/markdown](https://wordpress.com/support/markdown/)）。
- **自托管**的 Markdown block 由 Jetpack 提供，官方说明其为免费功能、所有接入 Jetpack 的站点可用，解析器是 **markdown-it（CommonMark）**（[jetpack.com/support/markdown](https://jetpack.com/support/markdown/)）。
- 插件生态：自托管可用插件目录 72,000+ 款；WordPress.com 付费计划可用 50,000+ 款（[wordpress.org/plugins](https://wordpress.org/plugins/)、[wordpress.com/pricing](https://wordpress.com/pricing/)）。

### LaTeX 数学公式支持
- **WordPress.com**：内置 **Math block**，在区块插入器里搜索 “Math” 插入；也支持行内公式（把光标放进段落/标题/列表/表格，在区块工具栏里选 Math），官方文档最后审阅日期 2026-08-11（[wordpress.com/support/latex](https://wordpress.com/support/latex/)）。
- 语法写错时前端不渲染，Math block 内会显示错误提示（[wordpress.com/support/latex](https://wordpress.com/support/latex/)）。该文档没有写渲染引擎是 KaTeX 还是 MathJax，也没写需要哪个付费档位——这两点**未核实**。
- **自托管 WordPress**：核心没有内置公式支持；Jetpack 的 LaTeX 文档页已失效（尝试 [jetpack.com/support/latex](https://jetpack.com/support/latex/) 与 [jetpack.com/support/math](https://jetpack.com/support/math/) 均返回 404）。可行路径是官方插件目录里的数学插件：**KaTeX** v2.2.5，2,000+ 活跃安装，最后更新约 1 年前，可选支持 `[latex]...[/latex]` 短代码（[wordpress.org/plugins/katex](https://wordpress.org/plugins/katex/)）；**WP-KaTeX** v1.11.0，700+ 活跃安装，最后更新约 7 年前（[wordpress.org/plugins/wp-katex](https://wordpress.org/plugins/wp-katex/)）。
- 是否需要 CDN、`\$` 转义细节、以及各插件对行内公式的支持程度：**未核实**。

### 视觉风格评价
- **WordPress.com**：官方称有「thousands of free and premium themes」，Site Editor 可改颜色、字体、布局与模板；Partner 主题需要 Business 计划并额外订阅（[wordpress.com/themes](https://wordpress.com/themes/)）。具体主题页示例：[wordpress.com/theme/macchiato](https://wordpress.com/theme/macchiato)。整体观感取决于所选主题，默认偏保守，靠主题市场与少量颜色/字体开关提升质感。
- **WordPress.org**：官方主题目录 15,000+ 免费主题，当前筛选显示 8,584 个（[wordpress.org/themes](https://wordpress.org/themes/)）。官方默认主题为 **Twenty Twenty-Five**，带官方预览页：[wordpress.org/themes/twentytwentyfive](https://wordpress.org/themes/twentytwentyfive/)、预览 [wordpress.org/themes/twentytwentyfive/preview](https://wordpress.org/themes/twentytwentyfive/preview/)；目录里热度较高的第三方主题包括 [Astra](https://wordpress.org/themes/astra/)、[Blocksy](https://wordpress.org/themes/blocksy/)、[Kadence](https://wordpress.org/themes/kadence/)、[OceanWP](https://wordpress.org/themes/oceanwp/)、[Hello Elementor](https://wordpress.org/themes/hello-elementor/)（[wordpress.org/themes](https://wordpress.org/themes/)）。
- 自定义 CSS：WordPress.com 需 Business 及以上（自定义代码属于 Business 起的特性）（[wordpress.com/support/plan-features](https://wordpress.com/support/plan-features/)）；自托管可自由加自定义 CSS/子主题。

### 优缺点与适用人群
- **WordPress.com 优点**：零运维、注册即写、价格透明且低门槛（Personal $2.75/月 三年付），付费计划即可装插件；**缺点**：免费计划有广告与子域、自定义代码/SFTP 要到 Business（$25/月起年付），多年锁定才拿到最低单价（[wordpress.com/pricing](https://wordpress.com/pricing/)）。适合不想碰服务器、预算有限、但仍想用生态插件的个人博主与小型站点。
- **WordPress.org 优点**：完全掌控、插件/主题生态最大（72,000+ 插件、15,000+ 主题）、可自定 CSS 与主题；**缺点**：要自己买主机、装环境、做备份与安全加固，PHP/MySQL 版本与 EOL 版本风险要自己判断（[wordpress.org/about/requirements](https://wordpress.org/about/requirements/)、[加固指南](https://developer.wordpress.org/advanced-administration/security/hardening/)）。适合愿意承担运维、需要深度定制或已有主机的开发者。

---

## 2. Ghost（Ghost Pro 托管版 + 自托管版）

### 技术栈与托管方式
- **同一套核心，两种交付方式**。Ghost 核心是开源应用（MIT 许可），官方架构文档写明：默认使用 Bookshelf.js ORM，开发环境默认 SQLite3、生产推荐 MySQL；主题层是 Handlebars.js，由 Express.js 提供 Web 服务；Ghost-Admin 是独立客户端，前端可选可替换，也能当 headless CMS 用（[docs.ghost.org/architecture](https://docs.ghost.org/architecture/)、[github.com/TryGhost/Ghost](https://github.com/TryGhost/Ghost)）。
- **Ghost Pro（官方 SaaS 托管）**：官方托管，站点默认带 `ghost.io` 子域，也可绑自定义域名，不需要自己买服务器（[ghost.org/pricing](https://ghost.org/pricing/)）。
- **自托管**：官方推荐 Ubuntu 22.04/24.04/26.04 + NGINX（≥1.9.5）+ 受支持版本 Node.js + MySQL 8.0/8.4 + Systemd + 至少 1 GB 内存，用 Ghost-CLI 安装（[docs.ghost.org/install/ubuntu](https://docs.ghost.org/install/ubuntu/)）。官方另提供 Docker（预览）、Docker compose、本地安装与从源码安装等方式（[docs.ghost.org/install](https://docs.ghost.org/install/)）。注意：Ghost-CLI 安装支持 Ghost(Pro) 托管的 ActivityPub 服务，但**不兼容 web analytics**（[docs.ghost.org/install/ubuntu](https://docs.ghost.org/install/ubuntu/)）。

### 最新版本或最近更新时间
- 最新 release **v6.63.0（2026-09-08）**，最近 commit 2026-09-11，star 55,269（[github.com/TryGhost/Ghost](https://github.com/TryGhost/Ghost)，指标日期 2026-09-11）。
- 官方 Changelog 最近条目：2026-08-27「Gift subscription improvements」、2026-08-07「Analytics for email sequences」、2026-07-16「Optimize your site for AI search」、2026-07-06「Publisher gift links」、2026-06-24「Email sequences for new members（Beta）」（[ghost.org/changelog](https://ghost.org/changelog/)）。

### 社区活跃度证据
- GitHub star 55,269、最新 release v6.63.0（2026-09-08）、最近 commit 2026-09-11（[github.com/TryGhost/Ghost](https://github.com/TryGhost/Ghost)，指标日期 2026-09-11）。
- 官方论坛统计（2026-09-11 读取）：18,988 个主题、144,088 条帖子、16,846 名用户；近 30 天新增 63 主题/452 帖/105 用户，近 30 天活跃用户 371（[forum.ghost.org/about.json](https://forum.ghost.org/about.json)）。
- 官方定价页写「Join thousands of creators」，未给出具体用户规模数字，具体数字**未核实**（[ghost.org/pricing](https://ghost.org/pricing/)）。

### 上手难度
- **Ghost Pro**：注册 → 试用 → 在卡片式编辑器里发布，官方 CTA 为 “Get Started — free” / “Try for free”，全程不需要 CLI 或 Git（[ghost.org/pricing](https://ghost.org/pricing/)）；官方架构文档也强调写作者不必为了发文章去学 Git（[docs.ghost.org/architecture](https://docs.ghost.org/architecture/)）。
- **自托管**：要 SSH 登录服务器、装 NGINX/MySQL/Node、用 Ghost-CLI 安装并配置 SSL，全程命令行；官方明确这是「给习惯自己安装、维护、升级软件的人」的路径（[docs.ghost.org/install/ubuntu](https://docs.ghost.org/install/ubuntu/)）。

### 费用
- **Ghost Pro（SaaS）**，价格由定价页 + 官方价格脚本给出，且随「受众规模」滑块变化（[ghost.org/pricing](https://ghost.org/pricing/)、[ghost.org/js/pricing.min.js](https://ghost.org/js/pricing.min.js)）：
  - Starter：年付 **$15/月**（$180/年）或月付 **$18/月**；含 1,000 members、1 名 staff、只能用官方主题（市场主题一栏为 “–”）、单文件上传上限 5 MB。
  - Publisher：年付 **$29/月**（$348/年）或月付 **$35/月** 起；3 名 staff、自定义主题、1,000 members 起；members 分档涨价，年付最高 100k members **$3,288/年**、月付同档 $329/月。
  - Business：年付 **$199/月**（$2,388/年）或月付 **$239/月** 起；15 名 staff、优先支持、可加购 Subdirectory Support（$100/月或 $1,200/年）；100k members 时年付 **$4,788/年**、月付 $479/月。
  - Custom：面议，含无限 staff/members、专用 IP、99.9% 可用性 SLA。
- Ghost Pro 各档都自带免费 `ghost.io` 子域与自定义域名支持，并含首年免费 `.link` 域名注册（第二年起按标准价续费）（[ghost.org/pricing](https://ghost.org/pricing/)）。
- **自托管**：软件免费开源（MIT，[github.com/TryGhost/Ghost](https://github.com/TryGhost/Ghost)）；服务器与域名自费，官方指南只给配置要求（Ubuntu + ≥1 GB 内存）不给价格，**自托管实际月成本未核实**（[docs.ghost.org/install/ubuntu](https://docs.ghost.org/install/ubuntu/)）。
- SaaS 与自托管的关键差异：活动、会员、订阅、newsletter 等能力两边都有；差别在于 SaaS 免运维、含托管 ActivityPub 服务与支持，自托管要自己扛服务器运维，且 Ghost-CLI 安装不兼容 web analytics（[docs.ghost.org/install/ubuntu](https://docs.ghost.org/install/ubuntu/)）。

### Markdown 支持情况
- **原生**：Ghost 编辑器会自动解析直接输入的 Markdown；若要保留 Markdown 源码或使用脚注，可以插入 **Markdown card**（[ghost.org/help/using-markdown](https://ghost.org/help/using-markdown/)）。
- 编辑器是卡片式：新行输入 `/` 打开卡片菜单，可插图片、HTML、嵌入、书签、仅邮件内容等（[ghost.org/help/using-the-editor](https://ghost.org/help/using-the-editor/)）。
- 扩展语法：Markdown card 支持脚注语法 `[^1]`，脚注渲染在 Markdown card 下方（[ghost.org/help/using-markdown](https://ghost.org/help/using-markdown/)）。
- **没有 WordPress 式插件市场**：Ghost 的对应物是 integrations 目录，官方明确说「不开放提交」，需要第三方自行在论坛分享（[ghost.org/integrations](https://ghost.org/integrations/)）；Ghost Pro 定价页提到 8,000+ integrations（[ghost.org/pricing](https://ghost.org/pricing/)）。

### LaTeX 数学公式支持
- 在本次抓取的官方来源中**没有找到** Ghost 的 LaTeX/数学公式支持说明：官方开发者文档 sitemap 的 173 条 URL 中没有 math/LaTeX/editor 相关页（[docs.ghost.org](https://docs.ghost.org/)），官方帮助中心 sitemap 的 137 篇文章里只有 [ghost.org/help/using-markdown](https://ghost.org/help/using-markdown/) 与 [ghost.org/help/using-the-editor](https://ghost.org/help/using-the-editor/) 这类编辑器文档，均未提公式；官方 changelog 也未出现 math/LaTeX 条目（[ghost.org/changelog](https://ghost.org/changelog/)）。
- 因此：**是否支持、机制是内置 KaTeX/MathJax 还是自定义代码注入、是否要付费档位、行内公式与 `\$` 转义限制、是否需要 CDN —— 全部未核实**。（社区常见的做法是往 code injection 里塞 KaTeX，但这不是官方来源，本次不据以下结论。）

### 视觉风格评价
- 默认主题是官方的 **Casper**，免费，官方定价页的主题区把它列为 Free（[ghost.org/themes](https://ghost.org/themes/)、[ghost.org/themes/casper](https://ghost.org/themes/casper/)）；Casper 官方演示站：[demo.ghost.io](https://demo.ghost.io)（[ghost.org/themes/casper](https://ghost.org/themes/casper/)）。
- 主题市场有数百个专业主题，官方描述为 “hundreds of professionally designed themes”（[ghost.org/pricing](https://ghost.org/pricing/)）；**Starter 档只能用官方主题，Publisher 及以上才能装市场主题或自定义主题**（[ghost.org/pricing](https://ghost.org/pricing/)）。
- 自托管可自由上传自定义主题并做主题开发（[docs.ghost.org/themes](https://docs.ghost.org/themes)）。整体取向是极简、排版优先，用少量颜色与封面图就能出质感；自定义 CSS 能力以主题开发/代码注入为主，具体开关未在本次抓取中核实。

### 优缺点与适用人群
- **Ghost Pro 优点**：免运维、写作体验干净（Markdown 原生 + 卡片编辑器）、自带会员/订阅/newsletter、四档价格透明（$15/$29/$199 年付起）；**缺点**：Starter 限制只能用官方主题、members 超过 1,000 后 Publisher/Business 涨价明显（100k members 年付到 $3,288/$4,788），公式支持官方缺位（[ghost.org/pricing](https://ghost.org/pricing/)）。适合以写作和订阅变现为核心、不想运维的创作者与小型出版方。
- **自托管优点**：软件免费、可完全掌控主题与数据、可当 headless CMS；**缺点**：需要 Ubuntu 服务器 + Ghost-CLI + MySQL 运维，且不兼容 web analytics（[docs.ghost.org/install/ubuntu](https://docs.ghost.org/install/ubuntu/)）。适合懂服务器、想省订阅费或要做深度定制的开发者。

---

## 3. Hashnode

### 技术栈与托管方式
- **纯 SaaS**：只能在 hashnode.com 上注册 publication 发布，官方没有任何自托管安装路径；官方 changelog 说明站点已迁移到 streaming server components，抓取到的页面资源也全部是 `/_next/` 构建产物，即前端为 Next.js/React（[hashnode.com/changelog/2026-02-24-a-fresh-new-look](https://hashnode.com/changelog/2026-02-24-a-fresh-new-look)）。后端语言与数据库官方未公布，**未核实**。
- 平台源码仓库已不存在：`github.com/Hashnode/hashnode` 与 `github.com/Hashnode/blog-starter-kit` 均返回 404（尝试 URL：[github.com/Hashnode/hashnode](https://github.com/Hashnode/hashnode)、[github.com/Hashnode/blog-starter-kit](https://github.com/Hashnode/blog-starter-kit)）。官方 GitHub 组织仍在，但剩下的是 headless/前端类仓库：**starter-kit、starter-kit-hashnode-blog、changelog-starter-kit、gql-skill、publish-github-action、umami、webembeds** 等（[github.com/Hashnode](https://github.com/Hashnode)）。
- 官方**是否正式公告过停止开源自托管 / 关闭 blog-starter-kit**：本次未找到公告文本，**未核实**；可确认的只是上述仓库 404、[Hashnode/starter-kit](https://github.com/Hashnode/starter-kit) 仍在但最近提交停在 2025-01-13（[commits/main.atom](https://github.com/Hashnode/starter-kit/commits/main.atom)）。

### 最新版本或最近更新时间
- 官方 Changelog 最新条目 **2026-09-01（GraphQL image uploads: presignedPost is deprecated）**，往前是 2026-08-25、2026-08-12（AEO 相关）、2026-07-29（consent management）（[hashnode.com/changelog](https://hashnode.com/changelog)）。
- 产品层面最近的重大更新：2026-06-11 推出 **Hashnode Pro**，2026-06-22 写作优先改版，2026-06-23 文章可导出 Markdown（[hashnode.com/changelog](https://hashnode.com/changelog)）。
- Headless 侧的 starter kit 已一年多未更新（[github.com/Hashnode/starter-kit/commits/main.atom](https://github.com/Hashnode/starter-kit/commits/main.atom)）。

### 社区活跃度证据
- 官方首页实时统计（2026-09-11 抓取）：**最近 24 小时 341 篇文章、278 位作者**（[hashnode.com](https://hashnode.com/)）。
- 累计用户数/博客数官方首页未给出，**未核实**（[hashnode.com](https://hashnode.com/)）。
- GitHub star：平台仓库已 404，且 `api.github.com` 对本机 IP 返回 403 rate limit，**Hashnode 各仓库 star 数未核实**（尝试 [api.github.com/repos/Hashnode/starter-kit](https://api.github.com/repos/Hashnode/starter-kit)、[api.github.com/orgs/Hashnode](https://api.github.com/orgs/Hashnode)）。
- 社区功能：Hashnode Forums 于 2026-02-28 上线，带 tag、投票与 markdown 评论（[hashnode.com/changelog/2026-02-28-forums](https://hashnode.com/changelog/2026-02-28-forums)）。

### 上手难度
- 注册后直接用 Web 编辑器写文章即可发布，免费 publication 使用 `hashnode.dev` 子域；绑定自定义域名需要 Pro（[hashnode.com/pro](https://hashnode.com/pro)）。不需要 CLI/Git。
- API 与 headless 用法门槛更高：GraphQL API 现在只在 Pro 下提供（[hashnode.com/changelog/2026-05-13-graphql-api-paid-access](https://hashnode.com/changelog/2026-05-13-graphql-api-paid-access)）；官方另外提供了一个「一条命令教会 AI coding agent 使用 GraphQL API」的 skill，仓库在 [github.com/Hashnode/gql-skill](https://github.com/Hashnode/gql-skill)。

### 费用
- 注意：**`hashnode.com/pricing` 已经不再展示价格档位**，抓取该 URL 返回的是首页内容（[hashnode.com/pricing](https://hashnode.com/pricing)）；当前官方价格页是 **/pro**。
- Free：$0，默认 `hashnode.dev` 子域，账号下 1 个 publication（[hashnode.com/pro](https://hashnode.com/pro)）。
- **Hashnode Pro：$5/月，或 $50/年（官方标注相当于省 2 个月）**，按 publication 计费；升级一个 publication 后账号上限从 1 提到 10（1 个 Pro + 9 个免费）（[hashnode.com/pro](https://hashnode.com/pro)）。
- Pro 解锁：自定义域名、GraphQL API、API 的 agent skill、编辑器内 AI 工具、webhooks、headless mode、GitHub 备份、批量 Markdown 导入、去品牌、定时发布、多博客、免 automoderation 移除（[hashnode.com/pro](https://hashnode.com/pro)、[changelog 2026-06-11](https://hashnode.com/changelog/2026-06-11-introducing-hashnode-pro)）。
- 免费 GraphQL API 已取消：读和写都需要 Pro（[hashnode.com/changelog/2026-05-13-graphql-api-paid-access](https://hashnode.com/changelog/2026-05-13-graphql-api-paid-access)）。
- **自托管版不存在**，因此没有自托管费用可比；SaaS 与自托管的差异在这里是「只能 SaaS」（[github.com/Hashnode](https://github.com/Hashnode)）。

### Markdown 支持情况
- **原生 Markdown**：官方首页明确「Or skip the editor and write raw Markdown」；任何文章 URL 加 `.md`（或发 `Accept: text/markdown`）可拿到源 Markdown（[hashnode.com](https://hashnode.com/)、[changelog 2026-06-23](https://hashnode.com/changelog/2026-06-23-posts-as-markdown)）。
- 编辑器支持 Markdown 与富文本两种写法，输入 `/` 打开卡片菜单（代码块、图片、表格、callouts、可折叠区块、math (LaTeX) 等），支持 Unsplash 搜图、@mention 与多种嵌入（CodePen/CodeSandbox/Replit/YouTube/Spotify/Loom）（[changelog 2026-02-24](https://hashnode.com/changelog/2026-02-24-a-fresh-new-look)）。
- 官方首页列出的能力还有「25 种语言的语法高亮、LaTeX、表格、嵌入」；评论同样是 markdown 渲染（[hashnode.com](https://hashnode.com/)）。
- 没有插件系统，扩展走 GraphQL API/headless（Pro）（[hashnode.com/pro](https://hashnode.com/pro)）。

### LaTeX 数学公式支持
- **支持**：官方 changelog 明确编辑器卡片菜单包含 **math (LaTeX)**（[hashnode.com/changelog/2026-02-24-a-fresh-new-look](https://hashnode.com/changelog/2026-02-24-a-fresh-new-look)）；官方首页也把 LaTeX 列为编辑器内置能力（[hashnode.com](https://hashnode.com/)）。
- 渲染引擎是 KaTeX 还是 MathJax：官方页面未说明，**未核实**。
- 是否需要付费档位：官方 /pro 的 Pro 功能清单里没有 LaTeX（列的是自定义域名、API、AI 工具、webhooks 等），首页也把它当编辑器内置能力描述，因此看起来免费 publication 可用，但没有官方明说，**这一点算部分未核实**（[hashnode.com/pro](https://hashnode.com/pro)、[hashnode.com](https://hashnode.com/)）。
- 行内公式、`\$` 转义写法、是否需要 CDN 或自定义代码注入：**未核实**。旧的 API 文档域名 `apidocs.hashnode.com` 已无法解析（web_fetch 与 python 均报 DNS/SSL 失败），API 说明现在只能从 [hashnode.com/pro](https://hashnode.com/pro) 与 [github.com/Hashnode/gql-skill](https://github.com/Hashnode/gql-skill) 侧证。

### 视觉风格评价
- 2026 年的改版走「安静」路线：单色 **cobalt** 主色 + 石墨中性色，去掉卡片堆叠、扁平描边表面，**默认深色主题**（已有用户自选主题会保留）（[changelog 2026-02-24](https://hashnode.com/changelog/2026-02-24-a-fresh-new-look)）。默认风格属于极简、排版优先，符合技术博客的观感。
- 自定义能力有限：没有主题市场；官方未说明自定义 CSS；能做的定制主要是换主题（浅/深）、Pro 去品牌与绑自定义域名（[hashnode.com/pro](https://hashnode.com/pro)）。
- **具体主题名与示例站 URL：官方没有主题库可给，未核实**；可参考的官方 publication 是侧栏里的官方博客 “The foreword by Hashnode”（入口见 [hashnode.com](https://hashnode.com/)）。

### 优缺点与适用人群
- **优点**：零运维、$0 即可开写、Markdown 原生且支持 LaTeX/语法高亮、SEO 与 AI 引用导向的 AEO 功能做得早、社区 feed 自带流量（[hashnode.com](https://hashnode.com/)、[hashnode.com/pro](https://hashnode.com/pro)）。
- **缺点**：平台完全封闭，不能自托管、不能自定义主题/CSS（**未核实**是否有自定义 CSS）、免费层没有自定义域名、GraphQL API 已改收费；且平台历史上有过多次大改版，仓库生态明显收缩（[changelog](https://hashnode.com/changelog)、[github.com/Hashnode](https://github.com/Hashnode)）。
- **适用人群**：想以最低成本开技术博客、需要公式与代码高亮、愿意接受平台锁定并用 $5/月换自定义域名与 API 的开发者。

---

## 4. Substack

### 技术栈与托管方式
Substack 是闭源 SaaS 平台，没有自托管版本；官方未公开后端语言与数据库（[substack.com/about](https://substack.com/about)、[on.substack.com](https://on.substack.com/) 均未披露技术栈，故该项为未核实）。官方声明平台方负责邮件投递、CDN 媒体托管、实时消息基础设施、多语言支持、MFA 账户安全与数据隐私控制，创作者无需自购服务器（[substack.com/features](https://substack.com/features)）。发布形态包括文本、播客、视频与社区（[substack.com/features](https://substack.com/features)）。自定义域名不是自建服务器，而是把域名 CNAME 指向 Substack（[support.substack.com 自定义域名指南](https://support.substack.com/hc/en-us/articles/360051222571-How-do-I-set-up-my-custom-domain-on-Substack)）。

### 最新版本或最近更新时间
SaaS 无版本号。官方新闻与产品更新发布在 on.substack.com，归档页最新一篇日期为 2026-09-10（[on.substack.com/archive](https://on.substack.com/archive)）。官方帮助中心的文章更新日期最新为 2026-09-11（如 "What are Substack Pledges?"）（[support.substack.com Pledges](https://support.substack.com/hc/en-us/articles/11463706473108-What-are-Substack-Pledges)）。

### 社区活跃度证据
官方 /about 页声明：平台已有 500 万付费订阅（"5 million paid subscriptions and counting"）（[substack.com/about](https://substack.com/about)）；每周有数千万人阅读、观看或收听；每天有 100 万+ 篇帖子在 app 内被潜在订阅者发现；30%+ 的付费订阅来自 Substack 网络内部（推荐、Notes、协作）（[substack.com/about](https://substack.com/about)）。Substack 为闭源 SaaS，没有公开仓库，因此无 GitHub star/commit 指标。

### 上手难度
注册即用：官网提供 "Start your Substack" 入口，注册时选择唯一 handle，个人页形如 substack.com/@handle（[substack.com/about](https://substack.com/about)、[support.substack.com 发布指南](https://support.substack.com/hc/en-us/articles/29152946791188-How-can-I-publish-on-Substack)）。发布走网页 publisher dashboard 的 "Create → Article"，在编辑器里直接写作（[support.substack.com 发布指南](https://support.substack.com/hc/en-us/articles/29152946791188-How-can-I-publish-on-Substack)）。全程无需 CLI、Git 或本地构建。若要开付费订阅，需要额外连接 Stripe 账户并在 Settings → Payments 里设置月度/年度/founding member 价格（[support.substack.com 设置付费出版](https://support.substack.com/hc/en-us/articles/360037459952-How-do-I-set-up-a-paid-publication)）。官方 /about 页给出的规模量级是"每周数千万读者"，属于平台自带流量入口，起步不需要自己导流（[substack.com/about](https://substack.com/about)）。

### 费用
发布本身免费且订阅者数量不限："Publishing is free on Substack– no matter how many subscribers you have!"（[support.substack.com 费用说明](https://support.substack.com/hc/en-us/articles/360037607131-How-much-does-Substack-cost)）。若开启付费订阅：Substack 对每笔交易抽成 10%，Stripe 另收信用卡费 2.9% + $0.30/笔，以及循环订阅的 Billing fee 0.7%（2024 年 7 月起）（[support.substack.com 费用说明](https://support.substack.com/hc/en-us/articles/360037607131-How-much-does-Substack-cost)）。注意官方另一篇文章写 Billing fee 为 0.5%（[support.substack.com 读者付款方式](https://support.substack.com/hc/en-us/articles/18687769631252-How-can-readers-pay-for-a-subscription-on-my-Substack-publication)），两处口径不一致。订阅最低价格为 $5/月、$30/年（美金额度 Stripe 账户）（[support.substack.com 设置付费出版](https://support.substack.com/hc/en-us/articles/360037459952-How-do-I-set-up-a-paid-publication)）。自定义域名一次性收费 $50（不含销售税/VAT）（[support.substack.com 自定义域名指南](https://support.substack.com/hc/en-us/articles/360051222571-How-do-I-set-up-my-custom-domain-on-Substack)）。官方 /about 页表述为"作者保留 90% 收入（扣信用卡费前）"（[substack.com/about](https://substack.com/about)）。官方定价页 https://substack.com/pricing 在 2026-09-11 返回 HTTP 404，https://substack.com/fees 亦为 404，故以上数字全部取自官方帮助中心与 about 页。

### Markdown 支持情况
不支持 Markdown。官方帮助中心明确写着 "We do not currently support Markdown in the post editor."（[support.substack.com Do you support Markdown?](https://support.substack.com/hc/en-us/articles/360037463132-Do-you-support-Markdown)，该文更新于 2026-08-19）。编辑器是网页富文本编辑器（工具栏加块级插入），支持代码块并带语法高亮、自动语言识别、稳定缩进与行号，订阅者可在网页端一键复制代码片段（[support.substack.com 代码块](https://support.substack.com/hc/en-us/articles/46860260687380-How-do-I-embed-a-code-block-in-a-Substack-post)）。不支持自定义 CSS 或 HTML，也包括直接粘贴原始 <iframe>（[support.substack.com 能否编辑 CSS/HTML](https://support.substack.com/hc/en-us/articles/360037463152-Can-I-edit-the-CSS-or-HTML-on-Substack)）。因此不存在 Markdown 插件生态，排版能力受编辑器限制。

### LaTeX 数学公式支持
原生支持 LaTeX，但入口是编辑器内的块级公式：在编辑器工具栏点 "More"，从下拉菜单选 "LaTeX"，插入公式块后编辑并 Save，再 Preview 查看效果（[support.substack.com 添加公式](https://support.substack.com/hc/en-us/articles/12291042958996-How-do-I-add-equations-to-my-Substack-post)）。它不是 Markdown 的 $/$$ 语法，也不需要自己注入 CDN 或自定义代码。官方文章只描述了块级插入，未说明底层渲染引擎是 KaTeX 还是 MathJax，也未提及行内公式、$ 转义或是否需要付费档位，这些均为未核实。官方博客页确认 Substack 支持 LaTeX 公式（[substack.com/features](https://substack.com/features)）与 Datawrapper 图表、Polymarket 赔率、财经图表等一并作为内嵌能力（[support.substack.com 嵌入媒体](https://support.substack.com/hc/en-us/articles/360037832971-How-do-I-embed-media-in-my-post-e-g-images-video-GIFs)）。

### 视觉风格评价
默认主题偏 Newsletter/杂志式，简洁以文字为中心。可在 Settings → Website 选择 "Custom theme"，用 Website editor 改首页背景色与强调色、标题字体、Logo 与 wordmark（建议 256×256 / 1344×256 以上）、首页 header 布局（Standard / Wide / Hamburger / Inline）等（[support.substack.com 自定义主题](https://support.substack.com/hc/en-us/articles/360055169471-How-do-I-set-a-custom-theme-for-my-Substack)）。由于不能注入自定义 CSS/HTML（[support.substack.com 能否编辑 CSS/HTML](https://support.substack.com/hc/en-us/articles/360037463152-Can-I-edit-the-CSS-or-HTML-on-Substack)），装饰能力限于主题编辑器的可视化选项，做不出与平台差异很大的视觉。官方页面引用的成品站示例：The Free Press https://www.thefp.com/w/the-free-press 、Lenny's Newsletter https://www.lennysnewsletter.com/ 、Nate Silver 的 https://www.natesilver.net/ 、Honest Broker https://www.honest-broker.com 、Citrini Research https://www.citriniresearch.com 、Drop Site News https://www.dropsitenews.com/ 、Zeteo https://www.zeteo.com/ （[substack.com/about](https://substack.com/about)），以及 Popular Information https://popular.info/ 、Heated https://heated.world/ （[substack.com/going-paid](https://substack.com/going-paid)）。

### 优缺点与适用人群
优点：免费起步且订阅者数量不限，付费订阅/邮件投递/落地页/支付一体化，平台自带发现网络（官方称 30%+ 付费订阅来自网络内部，[substack.com/about](https://substack.com/about)），作者保留 90% 收入（[substack.com/about](https://substack.com/about)）。缺点：不支持 Markdown 写作（[support.substack.com](https://support.substack.com/hc/en-us/articles/360037463132-Do-you-support-Markdown)），正文不能注入自定义 CSS/HTML（[support.substack.com](https://support.substack.com/hc/en-us/articles/360037463152-Can-I-edit-the-CSS-or-HTML-on-Substack)），订阅最低 $5/月（[support.substack.com](https://support.substack.com/hc/en-us/articles/360037459952-How-do-I-set-up-a-paid-publication)）且抽成 10% 加 Stripe 费用（[support.substack.com](https://support.substack.com/hc/en-us/articles/360037607131-How-much-does-Substack-cost)），内容与读者绑定在平台内，自定义域名还要一次性 $50（[support.substack.com](https://support.substack.com/hc/en-us/articles/360051222571-How-do-I-set-up-my-custom-domain-on-Substack)）。适用人群：以付费订阅或 Newsletter/播客变现为目的的写作者；不适合坚持 Markdown 源码写作、要求深度自定义主题或完全掌控数据的用户。

---

## 5. Medium

### 技术栈与托管方式
闭源 SaaS，没有自托管版本，也没有可供统计的官方开源仓库。官方未公开后端语言与数据库；medium.com/about、about.medium.com、blog.medium.com 在本环境均返回 HTTP 403（Cloudflare），无法核对，故技术栈为未核实。用户不需要买服务器：写作、托管、分发都在 platform 内完成（[help.medium.com 写第一篇故事](https://help.medium.com/hc/en-us/articles/225168768-Writing-and-publishing-your-first-story)）。也可以把自有域名指向 Medium，但这仍属于 SaaS 托管而非自建（[help.medium.com 自定义域名](https://help.medium.com/hc/en-us/articles/115003053487-Setting-up-a-custom-domain-for-your-profile-or-publication)）。

### 最新版本或最近更新时间
SaaS 无版本号，也没有公开 changelog 页（medium.com 域下页面均 403）。可用的官方更新信号是帮助中心文章的更新时间：抓取官方帮助中心全部 194 篇文章后，最新更新日期为 2026-09-11（如 "Connect social media accounts"）（[help.medium.com 文章 API](https://help.medium.com/api/v2/help_center/en-us/articles.json)）。其中会员与定价文章 "Become a Medium Member" 更新于 2026-09-09（[help.medium.com Become a Medium Member](https://help.medium.com/hc/en-us/articles/115004545567-Become-a-Medium-Member)），自定义域名文章更新于 2026-07-29（[help.medium.com 自定义域名](https://help.medium.com/hc/en-us/articles/115003053487-Setting-up-a-custom-domain-for-your-profile-or-publication)）。

### 社区活跃度证据
未核实。Medium 官方主站与周边域名（https://medium.com/plans 、https://medium.com/about 、https://about.medium.com/ 、https://blog.medium.com/ ）在 2026-09-11 均返回 HTTP 403（Cloudflare 拦截），无法取得官方用户规模或月活数字。官方帮助中心里最接近的表述只是会员文章提到 me.dm（Medium 的 Mastodon 实例）可以把内容分享给 "millions of potential readers"，属营销措辞而非量化指标（[help.medium.com Become a Medium Member](https://help.medium.com/hc/en-us/articles/115004545567-Become-a-Medium-Member)）。

### 上手难度
注册后在首页点 "Write" 即开始草稿，草稿自动保存；移动浏览器不支持写作，需要在 iOS/Android app 里写（[help.medium.com 写第一篇故事](https://help.medium.com/hc/en-us/articles/225168768-Writing-and-publishing-your-first-story)）。编辑器是所见即所得富文本：选中文字后用工具栏做 Bold、Italics、链接、标题/副标题/kicker、引用块等，代码块与行内代码也在工具栏里（[help.medium.com 使用故事编辑器](https://help.medium.com/hc/en-us/articles/215194537-Using-the-story-editor)、[help.medium.com 代码块](https://help.medium.com/hc/en-us/articles/35756844492439-Using-code-blocks-and-inline-code)）。全程不需要 CLI、Git 或本地构建。若要变现，加入 Partner Program 需满足：拥有有效 Medium 会员订阅、至少发布 1 篇故事、资料完整、银行位于支持收款的国家、年满 18 岁，并同意相关条款（[help.medium.com Partner Program 资格](https://help.medium.com/hc/en-us/articles/39121627791639-Medium-Partner-Program-eligibility)）。

### 费用
会员档位（官方帮助中心，更新于 2026-09-09）：Medium Member 为 $5/月 或 $50/年，Friend of Medium 为 $15/月 或 $150/年（[help.medium.com Become a Medium Member](https://help.medium.com/hc/en-us/articles/115004545567-Become-a-Medium-Member)）。写作与发布本身官方未列出收费（未在任何抓取到的官方页面看到发布收费说明）。自定义域名的前提是"拥有有效的 Medium 会员订阅"，即必须付费会员才能绑定（[help.medium.com 自定义域名](https://help.medium.com/hc/en-us/articles/115003053487-Setting-up-a-custom-domain-for-your-profile-or-publication)，更新于 2026-07-29）。Partner Program 的收益按会员阅读/收听时长与 claps、highlights、replies、follows 等互动综合计算（[help.medium.com Partner Program 总览](https://help.medium.com/hc/en-us/articles/25267383906711-Medium-Partner-Program-overview)）。注意：起点 URL https://medium.com/plans 在 2026-09-11 返回 HTTP 403，无法作为定价来源，上面数字改引官方帮助中心文章。

### Markdown 支持情况
官方文档没有 Markdown 支持声明。抓取官方帮助中心全部 194 篇文章后，正文与标题中检索 "Markdown" 零命中（[help.medium.com 文章 API](https://help.medium.com/api/v2/help_center/en-us/articles.json)）。官方对编辑器的描述完全基于工具栏式富文本，未提供 Markdown 输入模式（[help.medium.com 使用故事编辑器](https://help.medium.com/hc/en-us/articles/215194537-Using-the-story-editor)）。支持代码块与行内代码（[help.medium.com 代码块](https://help.medium.com/hc/en-us/articles/35756844492439-Using-code-blocks-and-inline-code)）。跨平台迁移方面，官方只说把内容复制粘贴进新建草稿，或使用 import 工具，同样没有提 Markdown（[help.medium.com 上传 Word/PDF](https://help.medium.com/hc/en-us/articles/1500009146761-Can-I-upload-a-Microsoft-Word-document-PDF-file-or-other-file-to-publish-as-a-Medium-story)、[help.medium.com import 工具排错](https://help.medium.com/hc/en-us/articles/360033931713-Trouble-importing-content-using-the-import-tool)）。是否存在未文档化的 Markdown 粘贴行为为未核实。

### LaTeX 数学公式支持
不原生支持。官方原文："Medium does not natively support writing mathematical expressions, but you can use an embed, such as embed.fun, to add LaTeX math formulas to your story."（[help.medium.com 使用故事编辑器](https://help.medium.com/hc/en-us/articles/215194537-Using-the-story-editor)）。机制是第三方 embed：Medium 的嵌入由 Embed.ly 提供，支持 300+ 提供方，官方列出的数学方案为 embed.fun（[help.medium.com 使用嵌入](https://help.medium.com/hc/en-us/articles/214981378-Using-embeds)）。Medium 不允许用户注入并运行自定义脚本（"Medium does not allow users to insert and run scripts into the site for security and privacy reasons."，[help.medium.com 使用嵌入](https://help.medium.com/hc/en-us/articles/214981378-Using-embeds)），所以也不存在自带 KaTeX/MathJax 或自定义代码注入的路径。行内公式、$ 转义等细节无官方说明，为未核实；embed 方案在正文中的排版自由度也明显受限。

### 视觉风格评价
Medium 采用平台统一的极简排版，个性主要体现在出版物信息层：出版物可设置名称、简介（上限 280 字符）、头像、社交链接、最多 5 个 topic、编辑与作者名单及其显示标题（[help.medium.com 出版物设置与布局](https://help.medium.com/hc/en-us/articles/34508714374679-Info-Homepage-Customizing-your-publication-settings-and-layout)）。出版物的 About 页可编辑 "Note from the Editor"，但该字段不支持富文本或 markup，只支持链接（[help.medium.com About](https://help.medium.com/hc/en-us/articles/33289328001047-About)）。平台不允许用户注入或运行脚本，因此无法通过自定义 CSS/JS 大幅改造外观（[help.medium.com 使用嵌入](https://help.medium.com/hc/en-us/articles/214981378-Using-embeds)）。官方未见主题市场；由于 medium.com 域全部 403，主题名与示例站 URL 均未核实。

### 优缺点与适用人群
优点：免费写作并自带分发与会员分成机制，无需任何运维，自定义域名可用（但需付费会员）（[help.medium.com 自定义域名](https://help.medium.com/hc/en-us/articles/115003053487-Setting-up-a-custom-domain-for-your-profile-or-publication)），Partner Program 提供了基于互动的收益路径（[help.medium.com Partner Program 总览](https://help.medium.com/hc/en-us/articles/25267383906711-Medium-Partner-Program-overview)），移动端有官方 app 可写作（[help.medium.com 写第一篇故事](https://help.medium.com/hc/en-us/articles/225168768-Writing-and-publishing-your-first-story)）。缺点：不原生支持 Markdown 与 LaTeX（数学要走 embed.fun 嵌入，[help.medium.com 使用故事编辑器](https://help.medium.com/hc/en-us/articles/215194537-Using-the-story-editor)），不能注入自定义 CSS/HTML/JS（[help.medium.com 使用嵌入](https://help.medium.com/hc/en-us/articles/214981378-Using-embeds)），视觉个性化空间小，变现需先自付会员费并满足资格与地区限制（[help.medium.com Partner Program 资格](https://help.medium.com/hc/en-us/articles/39121627791639-Medium-Partner-Program-eligibility)）。适用人群：希望通过平台流量获得读者、且不介意富文本写作的作者；不适合需要 Markdown/LaTeX 原生排版、深度自定义外观或数据自主的用户。

---

## 6. Bear Blog（bearblog.dev）

### 技术栈与托管方式
SaaS 平台，不是可自托管的静态站点生成器。官方 README 明确："It is more like Substack than Hugo. Due to this it isn't possible to individually self-host a Bear Blog."（[github.com/HermanMartinus/bearblog](https://github.com/HermanMartinus/bearblog)）。源码公开（source-available）：Python + Django 应用，依赖清单含 Django==6.0.8、psycopg2（PostgreSQL）、gunicorn、whitenoise、mistune 3.3.3（Markdown 解析）、latex2mathml 3.77.0、Pygments、boto3、feedgen、geoip2 等（[requirements.txt](https://github.com/HermanMartinus/bearblog/blob/master/requirements.txt)），仓库根有 manage.py 与 conf/、Procfile（web 由 gunicorn 启动）（[仓库文件与 Procfile](https://github.com/HermanMartinus/bearblog)）。许可证为 Bear Blog License 2.0（基于 Elastic License 的 copyleft，禁止把该软件作为托管或管理服务提供）（[LICENSE.md](https://github.com/HermanMartinus/bearblog/blob/master/LICENSE.md)），作者在 2025-09-01 公告把 MIT 改为这一许可（[herman.bearblog.dev/license](https://herman.bearblog.dev/license/)）。用户不需要买服务器；自定义域名通过 DNS CNAME/ALIAS 指向 domain-proxy.bearblog.dev（[docs.bearblog.dev/custom-domains](https://docs.bearblog.dev/custom-domains/)）。

### 最新版本或最近更新时间
没有版本化 release：GitHub Releases 页显示 "There aren't any releases here"（[github.com/HermanMartinus/bearblog/releases](https://github.com/HermanMartinus/bearblog/releases)），GitHub API 的 releases 端点返回空数组 []（[api.github.com releases](https://api.github.com/repos/HermanMartinus/bearblog/releases)，访问日期 2026-09-11）。最近一次 commit 为 2026-09-09（commit message "update: remove tag"）（[commits API](https://api.github.com/repos/HermanMartinus/bearblog/commits?per_page=3)）。官方 Changelog 记录到 2026 年 8 月，含 Security updates、Anti-bot hardening、HEIC support（[docs.bearblog.dev/changelog](https://docs.bearblog.dev/changelog/)）；文档站 sitemap 中 /changelog/ 的 lastmod 为 2026-09-02、/roadmap/ 为 2026-09-11（[docs.bearblog.dev/sitemap.xml](https://docs.bearblog.dev/sitemap.xml)）。

### 社区活跃度证据
GitHub star 5,193、fork 163（[github.com/HermanMartinus/bearblog](https://github.com/HermanMartinus/bearblog)，2026-09-11 抓取的仓库页显示 stars 5,193）。最近 commit 2026-09-09，说明维护活跃（[commits API](https://api.github.com/repos/HermanMartinus/bearblog/commits?per_page=3)）。平台侧的社区规模无法核实：官方 discover 页 https://bearblog.dev/discover/ 在 2026-09-11 返回 HTTP 403（Cloudflare 拦截）。官方 roadmap 显示社区驱动的插件与功能在推进（[docs.bearblog.dev/roadmap](https://docs.bearblog.dev/roadmap/)），插件仓库为 https://github.com/HermanMartinus/bear-plugins/ （[docs.bearblog.dev](https://docs.bearblog.dev/) 的 Plugins 链接）。

### 上手难度
官网首页宣称 "Seconds to sign up"（[bearblog.dev](https://bearblog.dev/)）。注册具体步骤未核实：https://bearblog.dev/accounts/signup/ 与 https://bearblog.dev/accounts/login/ 在 2026-09-11 均返回 HTTP 403（Cloudflare 拦截），无法实测注册流程。写作方式是纯文本 Markdown 编辑框加 front matter：标题、link、alias、canonical_url、published_date、is_page、meta_description、meta_image、tags、make_discoverable、class_name 等写在正文上方、以分隔行结束（[docs.bearblog.dev/post](https://docs.bearblog.dev/post/)）。全程不需要 CLI、Git 或本地构建，所有配置在网页 dashboard 完成（[docs.bearblog.dev/styling](https://docs.bearblog.dev/styling/)）。自定义域名需要在注册商处配置 CNAME/ALIAS（或退而用 A 记录 159.223.204.176），然后回后台验证（[docs.bearblog.dev/custom-domains](https://docs.bearblog.dev/custom-domains/)）。

### 费用
具体金额未核实。https://bearblog.dev/pricing/ 在 2026-09-11 返回 HTTP 404，https://bearblog.dev/upgrade/ 与 https://bearblog.dev/static/pricing 也是 404；注册与升级入口 https://bearblog.dev/accounts/signup/ 、https://bearblog.dev/accounts/upgrade/ 均返回 HTTP 403（Cloudflare 拦截）。官方可证实的只有计费存在与形式：Changelog 提到部分能力只对 "upgraded blogs" 开放，例如媒体中心（[docs.bearblog.dev/changelog](https://docs.bearblog.dev/changelog/)），文档也提到付费用户可移除 "Made with Bear" 页脚（[docs.bearblog.dev/styling](https://docs.bearblog.dev/styling/)）；付费形式分为"订阅"与"Lifetime（一次性买断）"，并说明无法直接从订阅升级为买断（[docs.bearblog.dev/upgrading-from-subscription-to-lifetime](https://docs.bearblog.dev/upgrading-from-subscription-to-lifetime/)）。该文档给出的 Lifetime 结账链接 https://bear.lemonsqueezy.com/checkout/buy/2f0a4d87-10d9-4a74-b241-ba2c4d6b821b 直接访问返回 HTTP 404，加 ?embed=1 虽返回 200，但页面为 JS 渲染、服务端 HTML 中没有价格数字，故无法取得任何官方报价。官网首页列出的能力包含 "Free themes"、"RSS & Atom feeds"、"Connect your custom domain" 等，但没有标注各档免费/付费边界（[bearblog.dev](https://bearblog.dev/)）。

### Markdown 支持情况
原生 Markdown，是平台的主要写作格式。官方 README："All the post content is written in markdown."（[github.com/HermanMartinus/bearblog](https://github.com/HermanMartinus/bearblog)）。渲染由 mistune 3.3.3 完成（[requirements.txt](https://github.com/HermanMartinus/bearblog/blob/master/requirements.txt)）。官方 Markdown cheatsheet 列出的语法包括 **bold**、*italics*、~~strikethrough~~、==mark==、多级标题、有序/无序列表、链接（含 tab: 前缀开新标签与标题 id 内链）、上下标 H~2~O 与 6^th^、排版替换 ®©™±、单换行需行尾反斜杠或两个空格、脚注、引用块、行内代码与代码块等（[herman.bearblog.dev/markdown-cheatsheet](https://herman.bearblog.dev/markdown-cheatsheet/)）。编辑器是 dashboard 里的纯文本 Markdown 输入框加 front matter（[docs.bearblog.dev/post](https://docs.bearblog.dev/post/)）；插件生态提供可选的 markdown editor、代码块复制按钮、分页、目录、站内搜索、密码保护等，用法是把 JS 粘贴到页脚指令里（[bear-plugins](https://github.com/HermanMartinus/bear-plugins/)）。有导出备份能力：2026 年 3 月起备份导出为 MD 文件而非 CSV（[docs.bearblog.dev/changelog](https://docs.bearblog.dev/changelog/)）。

### LaTeX 数学公式支持
原生支持 LaTeX，且是内置能力而非插件：官方文档原文 "Bear supports LaTeX and MathML"，LaTeX 用 $...$ 写行内、$$...$$ 写块级，最终渲染为 MathML（[docs.bearblog.dev/mathematical-notation](https://docs.bearblog.dev/mathematical-notation/)）。实现方式由依赖清单印证：使用 latex2mathml 3.77.0 做 LaTeX→MathML 转换，而不是 KaTeX 或 MathJax（[requirements.txt](https://github.com/HermanMartinus/bearblog/blob/master/requirements.txt)）。已知限制（官方）：只在兼容 MathML 的浏览器渲染，部分 RSS 阅读器不渲染（[docs.bearblog.dev/mathematical-notation](https://docs.bearblog.dev/mathematical-notation/)）。行内 $ 与块级 $$ 都支持，官方示例还注明普通文本中的 $ 和 $$ 会照常显示（[docs.bearblog.dev/mathematical-notation](https://docs.bearblog.dev/mathematical-notation/)）。不需要 CDN 或自定义代码注入，因为转换在服务端完成。是否属于付费档位官方未提及，为未核实。

### 视觉风格评价
默认风格极其简约：官网口号 "No trackers, no javascript, no stylesheets. Just your words."，并强调页面约 2.7kb、自适应任意设备（[bearblog.dev](https://bearblog.dev/)）。自定义能力在纯 SaaS 里算强的：dashboard 的 Themes 提供若干预置主题，可在 "Edit theme CSS" 里用纯 CSS 覆盖变量（含 light/dark 的 @media (prefers-color-scheme: dark)），也可用 @import 引入任意 no-class CSS 主题或自定义字体（[docs.bearblog.dev/styling](https://docs.bearblog.dev/styling/)）。官方提供成套 Bear CSS 选择器（.home、.post、.page、.blog、.subscribe、.not-found、.title h1、.blog-posts、nav、.highlight/.code 等），每篇还能用 front matter 的 class_name 单独加类（[docs.bearblog.dev/styling](https://docs.bearblog.dev/styling/)）。因此用少量 CSS 装饰即可明显提升质感，且可通过页脚 JS 插入阅读时长、目录、分页等小部件（[bear-plugins](https://github.com/HermanMartinus/bear-plugins/)）。官方文档给出的示例站：https://360training.bearblog.dev （文档所说的"小型商业网站"示例）与 https://herman.bearblog.dev （作者博客），文档站本身也是用 Bear 搭建的 https://docs.bearblog.dev/ （[docs.bearblog.dev/styling](https://docs.bearblog.dev/styling/)、[docs.bearblog.dev](https://docs.bearblog.dev/)）。

### 优缺点与适用人群
优点：原生 Markdown 与原生 LaTeX（MathML）、页面极简且快（约 2.7kb）、无追踪/广告/脚本（[bearblog.dev](https://bearblog.dev/)）、支持自定义 CSS 与页脚 JS 插件、支持把备份导出为 Markdown 文件（[docs.bearblog.dev/changelog](https://docs.bearblog.dev/changelog/)）、维护活跃（最近 commit 2026-09-09，[commits API](https://api.github.com/repos/HermanMartinus/bearblog/commits?per_page=3)）。缺点：不能自托管，且许可证明确禁止把源码作为托管服务运营（[README](https://github.com/HermanMartinus/bearblog)、[LICENSE.md](https://github.com/HermanMartinus/bearblog/blob/master/LICENSE.md)）；没有版本化 release，升级是平台侧静默进行（[releases 页](https://github.com/HermanMartinus/bearblog/releases)）；没有官方主题市场，roadmap 里 "Community themes" 仍处于 Under consideration（[docs.bearblog.dev/roadmap](https://docs.bearblog.dev/roadmap/)）；付费价格未在公开页面透明列出（见文末）；官网 discover 页与注册页对自动化访问有 Cloudflare 拦截（[bearblog.dev/discover](https://bearblog.dev/discover/)，2026-09-11 返回 403）。适用人群：写技术或长文博客、需要 Markdown 与数学公式、偏好极简与速度的个人作者；不适合需要自托管、需要版本化发布，或需要平台内置读者推荐网络（这点明显弱于 Substack/Medium）的人。

---

## 7. Obsidian Publish

### 技术栈与托管方式
- 闭源 SaaS：官方只提供托管版，没有自托管服务端方案；站点默认托管在 `publish.obsidian.md/your-site`，可绑定自定义域名（[Introduction to Obsidian Publish](https://obsidian.md/help/publish)、[Manage sites](https://obsidian.md/help/publish/sites)）。
- 内容源是本地 Obsidian vault（本地 Markdown 文件），客户端桌面/移动端免费下载；用户不需要自己买服务器，只为订阅付费（[obsidian.md/pricing](https://obsidian.md/pricing/)）。
- 托管配额：站点容量上限 4GB，单个上传文件上限 50MB（[obsidian.md/publish](https://obsidian.md/publish)、[Publish limitations](https://obsidian.md/help/publish/limitations)）。
- 后端语言/数据库官方未公开（闭源 SaaS），本条未核实。

### 最新版本或最近更新时间
- Obsidian 桌面 1.14.1（Early access，2026-09-08）与移动 1.14.1（2026-09-08），其中桌面版明确写入「Math rendering now uses MathJax 4.1.3, replacing MathJax 3 and Temml」（[changelog 2026-09-08 desktop v1.14.1](https://obsidian.md/changelog/2026-09-08-desktop-v1.14.1/)）。
- 最近一个正式（Public）版本 1.13.8，2026-08-21 发布（[GitHub release v1.13.8](https://github.com/obsidianmd/obsidian-releases/releases/tag/v1.13.8)）。
- Publish 本身没有独立版本号；官方帮助站点（本身就是一个 Publish 站点）源码仓库最近一次 commit 为 2026-09-08（[obsidianmd/obsidian-help commits](https://github.com/obsidianmd/obsidian-help/commits/master)）。

### 社区活跃度证据
- 官方主题索引 `community-css-themes.json` 收录 735 个社区主题，官方插件索引 `community-plugins.json` 收录 7509 个社区插件（[community-css-themes.json](https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-css-themes.json)、[community-plugins.json](https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugins.json)）。
- 官方社区入口为 Discord 与论坛（[obsidian.md](https://obsidian.md/) 页脚 Community 区）。
- Publish 的用户数/站点数官方未公布，未核实。
- `obsidianmd/obsidian-releases` 的 star 数未取得（该仓库页面本次抓取未含计数），未核实。

### 上手难度
- 无需 CLI、Git 或本地构建：安装 Obsidian → 设置里登录 Obsidian 账号 → 启用核心插件 Publish → 在「Publish changes」里填 Site ID 创建站点 → 勾选笔记 → Publish（[Set up Obsidian Publish](https://obsidian.md/help/publish/setup)）。
- 唯一涉及文件操作的是自定义样式：需要外部编辑器写 `publish.css`（可选 `publish.js`），两者必须放在 vault 根目录；使用自定义 JavaScript 还要求先绑定自定义域名（[Customize your site](https://obsidian.md/help/publish/customize)）。
- 发布后站点内容随 vault 更新，手机端也能发布（[obsidian.md/publish](https://obsidian.md/publish)）。

### 费用
- Publish：$8/站/月（年付），$10/站/月（月付）（[obsidian.md/pricing](https://obsidian.md/pricing/)、[obsidian.md/publish](https://obsidian.md/publish)）。
- Sync（可选）：$4/用户/月（年付），$5/用户/月（月付）（[obsidian.md/pricing](https://obsidian.md/pricing/)）。
- 客户端本体免费、无需注册即可使用；Catalyst 一次性 $25、商用授权 $50/用户/年均为自愿支持性质（[obsidian.md/pricing](https://obsidian.md/pricing/)）。
- 学生/教师/非营利可享 Sync 与 Publish 的 40% 折扣；Sync 与 Publish 支持 7 天无理由全额退款（[obsidian.md/pricing](https://obsidian.md/pricing/)）。
- 功能上限与站点数由订阅决定：可同时存在的站点数取决于订阅档位（[Manage sites](https://obsidian.md/help/publish/sites)）。
- 自托管版差异：官方没有自托管 Publish，因此不存在「自托管省钱」这一档；想省钱只能不用 Publish、改用其他开源静态站方案。

### Markdown 支持情况
- 原生 Markdown：Publish 页面由 vault 内 Markdown 直接生成，官方页面明确写「Edit with Markdown / Blazing fast text editing built on the simplicity and reliability of Markdown」（[obsidian.md/publish](https://obsidian.md/publish)）。
- 编辑器为 Obsidian 的 Live Preview（所见即所得式 Markdown 编辑），核心插件体系可与 Publish 联动（[Set up Obsidian Publish](https://obsidian.md/help/publish/setup)）。
- 扩展语法：表格、Mermaid 图表（流程图/时序图/时间线）、代码块、内部链接 `[[ ]]`、嵌入、Frontmatter 属性等（[Advanced formatting syntax](https://obsidian.md/help/advanced-syntax)）。
- 插件生态在 Publish 上非常受限：只有输出原始 Markdown 的插件（如 Waypoint）可用；Dataview、Fantasy Statblocks 这类需要插件代码块渲染的插件默认不工作；嵌入搜索、图谱完整排序等也不支持（[Publish limitations](https://obsidian.md/help/publish/limitations)）。
- 没有 Publish 专属主题市场：官方做法是把任意社区主题的 CSS 复制到 vault 根目录并重命名为 `publish.css`；依赖 Style Settings 的主题设置在 Publish 上不生效（[Customize your site](https://obsidian.md/help/publish/customize)）。

### LaTeX 数学公式支持
- 内置 MathJax（非插件、非可选付费功能）：块级公式用 `$$...$$`，行内公式用 `$...$`，官方文档并给出 MathJax 教程与 TeX/LaTeX 扩展列表链接（[Advanced formatting syntax](https://obsidian.md/help/advanced-syntax)）。
- 引擎版本：桌面 1.14.1（2026-09-08）起改用 MathJax 4.1.3，替换 MathJax 3 与 Temml（[changelog 2026-09-08 desktop v1.14.1](https://obsidian.md/changelog/2026-09-08-desktop-v1.14.1/)）。
- 无需 CDN、无需自定义代码注入、任何订阅档位都能用；Obsidian 官方帮助站点（help.obsidian.md）就是一个 Publish 站点，其数学示例即由该链路渲染（[Introduction to Obsidian Publish](https://obsidian.md/help/publish)、[Advanced formatting syntax](https://obsidian.md/help/advanced-syntax)）。
- 已知限制：官方文档未说明 `$` 的转义/货币符号冲突处理，也未说明行内公式的额外限制（未核实）；Publish 主题若用自定义 JS，仍需要自定义域名（[Customize your site](https://obsidian.md/help/publish/customize)）。

### 视觉风格评价
- 默认风格极简、以内容和链接为主，官方帮助站 help.obsidian.md 即默认样式示例（[Introduction to Obsidian Publish](https://obsidian.md/help/publish)）。
- 自定义能力很强：官方原话「The look of your Obsidian Publish site can be fully customized with CSS and Javascript」，并支持自定义域名、密码保护（[obsidian.md/publish](https://obsidian.md/publish)）。
- 少量装饰即可出效果：直接改 CSS 变量（示例：`--background-primary`、`--background-secondary`、`--text-normal`、`--text-accent`）就能做整套配色，官方在产品页直接演示了一个 Solarized 主题片段（[obsidian.md/publish](https://obsidian.md/publish)）。
- 可选主题名（来自官方主题索引，均可复制为 publish.css）：Amethyst、Ars Magna、Atom、Ayu、Ayu Mirage、Base2Tone、Blue Topaz、Charcoal、Cybertron、Dark Graphite、Dracula for Obsidian、Gastown 等（[community-css-themes.json](https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-css-themes.json)）。
- 示例站：<https://help.obsidian.md/>（官方帮助站，官方文档明确其为 Publish 站点）。
- 局限：这些社区主题是为 Obsidian 应用界面写的，Publish 只吃其中的 CSS 部分，官方没有「哪些主题在 Publish 上验证可用」的列表（未核实）。

### 优缺点与适用人群
- 优点：零构建、零运维、零服务器；笔记内链、hover 预览、图谱视图、backlinks、堆叠页面是原生能力（[obsidian.md/publish](https://obsidian.md/publish)）；手机可发布；自带 SEO 与移动端性能优化；每站独立计费、可多站。
- 缺点：单价高（$8–10/月/站，是本次调研几家里最贵的托管档）；社区插件基本不可用；没有原生博客要素（RSS/评论/分类归档需自行想办法）；内容与 Obsidian vault 强绑定。
- 适用人群：已经在用 Obsidian 做笔记、想把知识库/数字花园/文档站公开、且愿意为「零维护」付费的人；不适合预算敏感或需要复杂博客功能的人。

---

> **第 8 项「Notion 系方案」由以下三节组成**：8a 是 Notion 官方闭源 SaaS，8b/8c 是社区开源的 Notion 渲染前端，三者定位不同，请对照阅读。

## 8a. Notion 官方站点（Notion Sites）

### 技术栈与托管方式
- 闭源 SaaS，由 Notion 托管；内容在 Notion 页面里维护，`Share → Publish` 即上线，地址为 `notion.site` 子域或自定义域名（[Publish a website with Notion Sites](https://www.notion.com/help/public-pages-and-web-publishing)）。
- 无自托管版本；后端语言/数据库官方未公开，未核实。
- 自定义域名不通过 Notion 购买：必须自己已有域名，并在 DNS 添加 CNAME 指向 `external.notion.site.`，且必须使用子域名（通常 www），根域需自行用 DNS 服务商做跳转（[Connect a custom domain with Notion Sites](https://www.notion.com/help/connect-a-custom-domain-with-notion-sites)）。
- 发布机制：选中页面发布后，内容改动会自动同步到站点；发布一个页面会连带发布它的全部子页面（[Publish a website with Notion Sites](https://www.notion.com/help/public-pages-and-web-publishing)）。

### 最新版本或最近更新时间
- Notion 不开源、无公开版本号；官方 What's New 页面最新条目为 2026-09-09（AI 模型管控），其前一条为 2026-08-28（[notion.com/releases](https://www.notion.com/releases)）。

### 社区活跃度证据
- 闭源 SaaS，没有 GitHub star 可引；官方在本次抓取到的页面里未给出用户数/工作区数，未核实。
- 可用于侧面判断的官方口径：Notion 帮助中心设有独立的「Notion Sites」分类与多篇文档（[Notion Sites 分类](https://www.notion.com/help/category/notion-sites)）；Notion Sites 产品页提供模板入口（[notion.com/product/sites](https://www.notion.com/product/sites)）。

### 上手难度
- 无需 CLI/Git/本地构建：打开页面 → 右上角 Share → Publish → 得到 `notion.site` 链接，改内容站点自动更新；可选「Embed this page」把页面嵌进别的网站（[Publish a website with Notion Sites](https://www.notion.com/help/public-pages-and-web-publishing)）。
- 需要留意的细节：slug 要逐页手动设置，且不会自动套用到子页面；同一工作区内 slug 不能重复；页面永久删除后 slug 不可复用（[同上](https://www.notion.com/help/public-pages-and-web-publishing)）。
- 自定义域名这一步需要动 DNS（CNAME + 子域名规则），是整条链路里唯一的「技术动作」（[Connect a custom domain with Notion Sites](https://www.notion.com/help/connect-a-custom-domain-with-notion-sites)）。

### 费用
- 工作区档位：Free $0；Plus $10/成员/月；Business $20/成员/月；Enterprise 需联系销售（[notion.com/pricing](https://www.notion.com/pricing)）。
- 站点能力分层：Free = Basic sites（无限发布站点、1 个 notion.site 域名、可开启搜索引擎索引）；付费档 = Custom sites（最多 5 个 notion.site 域名、可设首页、可自定义站点外观、可接 Google Analytics、可购买自定义域名 add-on，最多 25 个域名）（[Notion Sites availability & pricing](https://www.notion.com/help/notion-sites-availability-and-pricing)、[notion.com/pricing](https://www.notion.com/pricing)）。
- 自定义域名 add-on：额外 $8/月（年付）或 $10/月（月付），每个域名单独收费，且只有付费工作区的 owner 能购买；add-on 的计费周期必须与 Notion 订阅一致（[Notion Sites availability & pricing](https://www.notion.com/help/notion-sites-availability-and-pricing)、[Connect a custom domain](https://www.notion.com/help/connect-a-custom-domain-with-notion-sites)）。
- 免费档的其他限制：多人工作区有 block 数量上限；免费档单个上传文件上限 5MB，付费档为不限量上传、单文件约 5GB 上限（[notion.com/pricing](https://www.notion.com/pricing)）。
- 自托管版本差异：Notion 官方站点没有自托管选项，自定义域名只能通过 add-on 叠加在付费订阅之上，无法用「自己部署」降低这部分成本。

### Markdown 支持情况
- 不是纯 Markdown 编辑器，而是块编辑器；官方口径是「Notion supports many Markdown shortcuts」，支持 `/h1`、`-`、`>`、`---`、`[]` 等快捷输入（[Intro to writing & editing in Notion](https://www.notion.com/help/writing-and-editing-basics)）。
- 导出侧支持 Markdown：任意非数据库页面可导出为 Markdown 文件；整页数据库导出为 CSV，其子页面各自生成 Markdown；Callout 块会导出成 HTML（因为 Markdown 没有对应语法）（[Export your Notion content](https://www.notion.com/help/export-your-content)）。
- 插件生态：靠 Notion 官方集成与嵌入（官方称可嵌入 500+ 应用的内容）（[Intro to writing & editing](https://www.notion.com/help/writing-and-editing-basics)）；官方站点本身没有自定义 CSS/JS 的能力项，可自定义的是主题（System/Light/Dark）、favicon、站内搜索与 Google Analytics（[Edit & customize your Notion Sites](https://www.notion.com/help/edit-and-customize-your-notion-sites)）。

### LaTeX 数学公式支持
- 内置 KaTeX，官方原话「Notion uses the KaTeX library to render math equations, which supports a large subset of LaTeX functions」，不是插件、也不需要额外付费档位（[Math equations in Notion](https://www.notion.com/help/math-equations)）。
- 用法：块级公式用 `/math`；行内公式可以打两个 `$` 触发，或用 `ctrl/cmd + shift + E`；选中文本也可一键转公式（[Math equations in Notion](https://www.notion.com/help/math-equations)）。
- 支持 mhchem 扩展的 `\ce`、`\pu` 化学公式宏；块级与行内公式可用「Turn into」互转（[Math equations in Notion](https://www.notion.com/help/math-equations)）。
- 已知限制：KaTeX 只覆盖 LaTeX 的子集；官方直接引用 KaTeX 的常见问题说明「KaTeX 不支持 align 环境，应改用 aligned」；公式渲染错误时需对照 KaTeX 的 Supported Functions 表（[Math equations in Notion](https://www.notion.com/help/math-equations)）。
- `$` 转义、发布后公开站点上的渲染差异官方文档未说明（未核实）；但不需要 CDN 或自定义代码注入。

### 视觉风格评价
- 默认就是「Notion 页面」既视感：干净、留白多、强一致，但品牌感很强，一眼能认出是 Notion。
- 可调范围有限：付费档可设 System/Light/Dark 主题、上传自定义 favicon、开启站内搜索、接 Google Analytics；官方文档没有提供自定义 CSS/JS（[Edit & customize your Notion Sites](https://www.notion.com/help/edit-and-customize-your-notion-sites)）。
- 提升质感主要靠模板与页面排版本身，官方产品页提供模板入口（含 "Notion Link in bio" 等示例）（[notion.com/product/sites](https://www.notion.com/product/sites)）。
- 已知可用性问题：自定义 favicon 目前在 Safari 浏览器不支持；站点最长可能需要约 4 周才被搜索引擎收录（[Edit & customize your Notion Sites](https://www.notion.com/help/edit-and-customize-your-notion-sites)、[Publish a website with Notion Sites](https://www.notion.com/help/public-pages-and-web-publishing)）。
- 具体示例站 URL：官方页面未给出可直接引用的公开站点清单，未核实。

### 优缺点与适用人群
- 优点：起步成本 $0（Free 就能无限发布站点）；全流程无 CLI/Git；内容与 Notion 数据库天然同源，改完即生效；非技术用户最容易上手。
- 缺点：自定义域名要叠加 $8–10/月/域名，且必须先是付费工作区（Plus 起步 $10/成员/月）；不能自定义 CSS/JS，视觉天花板明显；SEO 收录慢（官方称最长 4 周）；站点是 Notion 渲染结果、性能与结构受平台限制。
- 适用人群：个人简历、作品集、活动页、轻量知识页；不适合需要精细排版、公式密度高且要求排版控制的学术博客或需要代码级控制的站长。

---

## 8b. NotionNext

### 技术栈与托管方式
- 开源自托管（MIT 许可）：Next.js + Notion API，`package.json` 中 `"license": "MIT"`、`"next": "^15.5.25"`、`"@notionhq/client": "^2.2.15"`，运行环境要求 Node `">=22 <25"`（[package.json](https://github.com/notionnext-org/NotionNext/blob/main/package.json)、[README](https://github.com/notionnext-org/NotionNext)）。
- 部署方式：官方 README 推荐 Fork 仓库后部署到 Vercel，文档另列 Netlify、Cloudflare Pages、VPS、Docker、Zeabur、EdgeOne 等路径，即「不需要自己买服务器」也能跑（[README](https://github.com/notionnext-org/NotionNext)、[部署索引](https://notionnext.tangly1024.com/user-guide/deploy/vercel)）。
- 内容不搬家：文章、分类、标签、菜单、页面仍在 Notion 数据库里维护，站点只负责读取和渲染（[README](https://github.com/notionnext-org/NotionNext)、[Notion 数据与 4.x 能力](https://notionnext.tangly1024.com/user-guide/reference/notion-4x)）。
- 可选依赖较杂：依赖里含 Supabase、Algolia、ioredis、Clerk 等，属于按需开启的可选能力（[package.json](https://github.com/notionnext-org/NotionNext/blob/main/package.json)）。

### 最新版本或最近更新时间
- 最新 release：v4.10.10，2026-08-13 发布，属小版本维护（[release v4.10.10](https://github.com/notionnext-org/NotionNext/releases/tag/v4.10.10)）。
- 最近 commit：2026-09-08（dependabot 升级 next 15.5.25）（[commits/main](https://github.com/notionnext-org/NotionNext/commits/main)、[release feed](https://github.com/notionnext-org/NotionNext/releases.atom)）。
- 仓库 `package.json` 里 version 字段为 4.10.10，与 release 一致（[package.json](https://github.com/notionnext-org/NotionNext/blob/main/package.json)）。
- 文档站同步维护：最新版本页写明「当前主线：4.10.10」（[最新版本与更新日志](https://notionnext.tangly1024.com/user-guide/changelog/latest)）。

### 社区活跃度证据
- star 11815，最新 release v4.10.10（2026-08-13），最近 commit 2026-09-08（[GitHub 仓库](https://github.com/notionnext-org/NotionNext)；指标取自父代理 2026-09-11 通过 GitHub API 抓取的 `docs/research-notes/github-metrics.json`）。
- 社区渠道：GitHub Discussions 讨论区（[讨论区](https://github.com/notionnext-org/NotionNext/discussions)）、文档站的「参与社区 / 交流群 / 众筹计划」入口（[文档站](https://notionnext.tangly1024.com/)）。
- 维护活跃度：release feed 顶部 `<updated>` 为 2026-08-13，commits feed 顶部 `<updated>` 为 2026-09-08，说明仓库仍在持续提交（[releases.atom](https://github.com/notionnext-org/NotionNext/releases.atom)、[commits/main.atom](https://github.com/notionnext-org/NotionNext/commits/main.atom)）。

### 上手难度
- 官方给出的「20 分钟部署路线」：复制官方 Notion 模板 → Fork 仓库到自己的 GitHub → 用 Vercel 部署 → 在环境变量里填 Notion 页面 ID 等配置（[README](https://github.com/notionnext-org/NotionNext)、[从这里开始](https://notionnext.tangly1024.com/user-guide/start-here)）。
- 涉及 Git（Fork）与部署平台的环境变量配置，但不要求写代码；本地开发才需要 Node 22 + Yarn 1（`yarn dev`）（[README](https://github.com/notionnext-org/NotionNext)）。
- 必填项 `NOTION_PAGE_ID` 是站点根页 32 位 ID；非公开数据库还需要 `NOTION_TOKEN_V2`（[Notion 数据与 4.x 能力](https://notionnext.tangly1024.com/user-guide/reference/notion-4x)）。

### 费用
- 软件本身免费且开源（MIT）（[package.json](https://github.com/notionnext-org/NotionNext/blob/main/package.json)）；项目没有官方定价页。
- 实际成本来自三块：Notion 账号（可用免费档）、部署平台、域名。NOTION_PAGE_ID 的读取方式对公开分享的数据库不需要付费功能（[Notion 数据与 4.x 能力](https://notionnext.tangly1024.com/user-guide/reference/notion-4x)、[notion.com/pricing](https://www.notion.com/pricing)）。
- 部署平台的具体档位与金额未核实：本次抓取了 <https://vercel.com/pricing>，但页面文本未解析出明确金额，故不列数字。
- SaaS 与自托管差异：NotionNext 是「自托管 + 自带前端」路线，省掉 SaaS 月费，但换来的是自己维护部署、域名、缓存与依赖升级（文档专设升级与维护工作流页）（[维护工作流](https://notionnext.tangly1024.com/user-guide/maintain-docs)、[这里开始](https://notionnext.tangly1024.com/user-guide/start-here)）。

### Markdown 支持情况
- 写作格式不是 Markdown，而是 Notion 块结构：站点通过 react-notion-x 把 Notion 页面渲染成网页；官方定位是「数据链路可迁移」，即后续可以从 Notion 迁到 Markdown 或其他系统，而不是原生 Markdown 写作（[README](https://github.com/notionnext-org/NotionNext)、[文档首页](https://notionnext.tangly1024.com/)）。
- 站点侧可配置能力很全：主题、URL 前缀、RSS（可配全文/摘要）、Sitemap、PWA、评论（Twikoo/Waline/Giscus/Artalk/Cusdis/Utterances/Gitalk/Valine）、统计（GA4/百度/Umami/Clarity/51LA/Ackee）、Algolia 搜索、广告等（[全站功能与配置索引](https://notionnext.tangly1024.com/user-guide/reference/features)）。
- 主题生态：README 称内置 26 个主题，文档侧边栏主题列表为 27 项，覆盖博客（simple/hexo/next/nobelium/typography）、文档（gitbook/claude/thoughtlite）、作品集（opc/proxio/starter）、官网（landing/commerce）、相册（photo/plog）、导航站（nav）（[README](https://github.com/notionnext-org/NotionNext)、[主题全览](https://notionnext.tangly1024.com/user-guide/themes/THEMES_CATALOG)）。
- 支持外链 CSS/JS 注入（配置项 `CUSTOM_EXTERNAL_JS / CUSTOM_EXTERNAL_CSS`），因此理论上可以自行接入更多 Markdown 渲染扩展（[全站功能与配置索引](https://notionnext.tangly1024.com/user-guide/reference/features)）。

### LaTeX 数学公式支持
- 支持，机制是内置 KaTeX（经 react-notion-x）：核心组件 `components/NotionPage.js` 第 6 行直接 `import 'katex/dist/katex.min.css'`，并通过 `NotionRenderer`（react-notion-x 7.12.1）渲染 Notion 的公式块（[NotionPage.js](https://github.com/notionnext-org/NotionNext/blob/main/components/NotionPage.js)、[package.json](https://github.com/notionnext-org/NotionNext/blob/main/package.json)）。
- 不是插件、不涉及付费档位、不需要 CDN 注入；公式语法跟随 Notion 自身的行内/块级公式语法（[Math equations in Notion](https://www.notion.com/help/math-equations)）。
- 已知限制：本次未在官方文档站找到专门的数学公式章节，仅从源码与依赖确认；行内公式、`$` 转义、以及特定主题下的渲染表现未逐项核实（未核实）。

### 视觉风格评价
- 默认主题偏简洁博客风，开箱最接近「极简技术博客」的是 `simple`、`hexo`、`next`、`nobelium`、`typography`；也有 `gitbook`/`claude` 这类文档风与 `starter`/`landing`/`proxio` 这类官网风（[主题全览](https://notionnext.tangly1024.com/user-guide/themes/THEMES_CATALOG)）。
- 自定义能力：支持自定义样式、自建主题（官方有「自定义样式」「开发自己的主题」文档），并可注入外链 CSS/JS（[全站功能与配置索引](https://notionnext.tangly1024.com/user-guide/reference/features)、[文档站](https://notionnext.tangly1024.com/)）。
- 「少量装饰提升质感」可行：站点公告、网页字体、Font Awesome/Iconfont、代码样式、鼠标点击特效、Live2D 宠物、音乐播放器都是配置项（[全站功能与配置索引](https://notionnext.tangly1024.com/user-guide/reference/features)）。
- 具体主题名与示例站（官方用户作品墙）：主题预览站 <https://preview.tangly1024.com/>；Tangly Blog（magzine 主题，<https://blog.tangly1024.com/>）；（heo 主题，<https://blog.88lin.eu.org>）；<https://cloud09.space/>（[用户作品墙](https://notionnext.tangly1024.com/user-guide/showcase)）。
- 改动 4.10.10 起默认不再加载 Noto Sans SC 等第三方中文 Web Font，未配置字体的站点改用系统字体，首屏更轻（[最新版本与更新日志](https://notionnext.tangly1024.com/user-guide/changelog/latest)）。

### 优缺点与适用人群
- 优点：免费开源、可控性高（源码、部署平台、主题都在自己手里）；主题数量与场景覆盖最广；功能配置齐全（评论/统计/搜索/RSS/Sitemap/广告/邮件订阅）；社区与文档中文友好、仍在活跃维护。
- 缺点：需要自己维护部署与依赖升级，文档也专门提示「Notion API / 数据结构多次变更，请保持 NotionNext 与 latest 推荐版本一致，否则可能无法完整拉取页面」（[Notion 数据与 4.x 能力](https://notionnext.tangly1024.com/user-guide/reference/notion-4x)）；写作介质是 Notion 而非 Markdown，存在 Notion 依赖；环境变量与部署配置对纯小白仍有门槛。
- 适用人群：愿意动手配置、想用 Notion 当 CMS 又不想付 Notion Sites 域名 add-on 的人；需要多主题/多场景（博客+文档+作品集）的内容创作者与独立开发者。

---

## 8c. Nobelium

### 技术栈与托管方式
- 开源自托管（MIT）静态博客：Next.js（`next@^14.0.2`）+ Notion（`react-notion-x@^6.16.0`、`notion-client@^6.16.0`），官方推荐部署到 Vercel，也提供 Docker 镜像 `ghcr.io/craigary/nobelium:main`（[package.json](https://github.com/craigary/nobelium/blob/main/package.json)、[README](https://github.com/craigary/nobelium)）。
- 内容存储在 Notion：公开分享页面用 `NOTION_PAGE_ID`；不想公开数据库则用 `NOTION_ACCESS_TOKEN`（从浏览器 cookie `token_v2` 取，官方 README 明确其只 180 天有效，且图片可能无法正常渲染）（[README](https://github.com/craigary/nobelium)）。
- 需要 GitHub 账号 + Vercel（或自己的 Docker 环境）；不涉及自购服务器，但涉及前端构建流程（[README](https://github.com/craigary/nobelium)）。

### 最新版本或最近更新时间
- 最后一次 release：v1.3.0，2021-05-06（[releases feed](https://github.com/craigary/nobelium/releases.atom)、[releases 页](https://github.com/craigary/nobelium/releases)）。
- 最近 commit：2025-06-07（内容为 "Update README.md"），其上一条 commit 为 2024-03-25，同样是 README 改动（[commits/main.atom](https://github.com/craigary/nobelium/commits/main.atom)、[commits](https://github.com/craigary/nobelium/commits/main)）。
- `package.json` 中 version 仍为 `1.3.0`，与 2021 年的 release 一致（[package.json](https://github.com/craigary/nobelium/blob/main/package.json)）。

### 社区活跃度证据
- star 3157（[GitHub 仓库](https://github.com/craigary/nobelium)；指标取自父代理 2026-09-11 通过 GitHub API 抓取的 `docs/research-notes/github-metrics.json`）。
- 维护状态：无 2021 年之后的新 release，2024-03 与 2025-06 两次提交均为 README 改动 → 可以判定为「事实停更/仅零星维护」（[releases](https://github.com/craigary/nobelium/releases)、[commits](https://github.com/craigary/nobelium/commits/main)）。
- 官方 Demo 仍在线可访问：<https://nobelium.vercel.app/>（[README](https://github.com/craigary/nobelium)）。
- 生态旁证：NotionNext 至今仍内置一个名为 `nobelium` 的主题，说明其风格被后来者沿用（[主题全览](https://notionnext.tangly1024.com/user-guide/themes/THEMES_CATALOG)）。

### 上手难度
- README 的 Quick Start：Star 仓库 → 复制 Notion 模板并公开分享 → Fork 仓库 → 改 `blog.config.js` → 部署到 Vercel 并设置环境变量 `NOTION_PAGE_ID`（[README](https://github.com/craigary/nobelium)）。
- 需要 Git（Fork）+ Vercel 配置；也提供 Docker 自建路径（`docker run -e NOTION_PAGE_ID=...`）（[README](https://github.com/craigary/nobelium)）。
- 相比 NotionNext，几乎没有中文文档与详细配置索引，遇到问题主要靠读源码与 Issue（[README](https://github.com/craigary/nobelium)）。

### 费用
- 开源免费（MIT），项目本身无定价页（[package.json](https://github.com/craigary/nobelium/blob/main/package.json)）。
- 成本＝部署平台（Vercel 等）+ 域名；具体平台档位与金额未核实（本次抓取 <https://vercel.com/pricing> 未解析出明确金额）。
- SaaS 与自托管差异：Nobelium 没有 SaaS 托管版，也不像 Notion 官方站点那样存在「域名 add-on」；代价是全部运维自负（[README](https://github.com/craigary/nobelium)）。

### Markdown 支持情况
- 写作介质是 Notion，不是 Markdown；渲染由 react-notion-x 完成（[README](https://github.com/craigary/nobelium)、[package.json](https://github.com/craigary/nobelium/blob/main/package.json)）。
- 支持 Mermaid 图表（依赖 `mermaid@^10.6.1`）（[package.json](https://github.com/craigary/nobelium/blob/main/package.json)）。
- 功能特性（README 自述）：评论、整宽页面、快速搜索、标签筛选、RSS、统计、Web Vitals、深浅色模式、Tailwind CSS 便于自定义、中英文界面（[README](https://github.com/craigary/nobelium)）。
- 官方无 Markdown 语法文档，扩展语法支持范围未核实。

### LaTeX 数学公式支持
- 代码层面具备 KaTeX 能力：`pages/_app.js` 引入了 `katex/dist/katex.min.css`（[pages/_app.js](https://github.com/craigary/nobelium/blob/main/pages/_app.js)），且其核心渲染依赖 `react-notion-x@6.16.0` 自身把 `katex@^0.15.3` 与 `@matejmazur/react-katex` 列为正式依赖（[npm registry react-notion-x 6.16.0](https://registry.npmjs.org/react-notion-x/6.16.0)）。
- 因此机制是内置 KaTeX、非插件、不需要额外付费或 CDN 注入；公式语法跟随 Notion 的行内/块级公式（[Math equations in Notion](https://www.notion.com/help/math-equations)）。
- 未在线上示例站验证渲染效果，也未找到官方说明；行内公式表现、`$` 转义等未核实（未核实）。

### 视觉风格评价
- 默认风格极简、卡片式技术博客，基于 Tailwind CSS，支持深色模式与整宽页面（[README](https://github.com/craigary/nobelium)）。
- 自定义通过 `blog.config.js` 的丰富配置项 + Tailwind 类名完成，官方未提供主题市场（[README](https://github.com/craigary/nobelium)）。
- 示例站：<https://nobelium.vercel.app/>（README 中的官方 Demo）；仓库内提供 `desktop.png` 桌面截图（[README](https://github.com/craigary/nobelium)）。
- 具体主题名：Nobelium 本身只有一套默认主题；其风格后来被 NotionNext 复刻为同名主题 `nobelium`（[主题全览](https://notionnext.tangly1024.com/user-guide/themes/THEMES_CATALOG)）。

### 优缺点与适用人群
- 优点：代码干净、Tailwind + Next.js 便于二次开发；极简风格对技术博客友好；Docker 可自建；MIT 开源无费用。
- 缺点：事实停更（2021 年后无 release，2024/2025 仅改 README），依赖版本停留在 next 14 / react-notion-x 6.x，长期存在安全与兼容风险；无中文文档、无主题生态；使用 `token_v2` 的方式官方自己也不推荐（180 天失效）。
- 适用人群：想以最小前端代码量搭一个极简 Notion 博客、并且有能力自己维护分叉的开发者；不适合依赖持续维护与社区支持的用户。

---

## 9. micro.blog

### 技术栈与托管方式
- 付费托管 SaaS，官方自述为「a paid hosting service for personal blogs」；没有自托管服务端方案（[About Micro.blog](https://micro.blog/about/)）。
- 博客由 Hugo 引擎生成：官方文档明确「Custom themes contain HTML and CSS templates using the Hugo blogging engine」（[Custom themes](https://help.micro.blog/t/59)）。
- 客户端是一套原生 App（iOS / Android / macOS），并有 Inkwell 阅读器、Sunlit、Epilogue、Strata、Wavelength 等官方 App 矩阵（[Latest app versions](https://help.micro.blog/t/4415)、[About](https://micro.blog/about/)）。
- 也支持把 Micro.blog 当发布前端接到外部博客：付费订阅可「Connect to WordPress」1 个外部博客，Premium 可接 5 个，并支持用 RSS/JSON Feed 把外部博客聚合进时间线（[Posting to external blogs](https://help.micro.blog/t/4368)）。
- 开源情况：官方 GitHub 组织有 122 个仓库（[GitHub org](https://github.com/orgs/microdotblog/repositories)），包含官方客户端与主题/插件（[microblog-mac](https://github.com/microdotblog/microblog-mac)、[microblog-ios](https://github.com/microdotblog/microblog-ios)、[theme-blank](https://github.com/microdotblog/theme-blank)、[theme-marfa](https://github.com/microdotblog/theme-marfa)、[plugin-tufte](https://github.com/microdotblog/plugin-tufte)）；但服务端仓库 `microdotblog/microblog` 不存在（404），未发现官方自托管服务端（[404](https://github.com/microdotblog/microblog)）。

### 最新版本或最近更新时间
- 官方「Latest app versions」页（2026-08-01 更新）：Micro.blog iOS 3.7.4、Android 3.0.2、Mac 4.1；Inkwell iOS 1.1 / Android 1.1 / Mac 1.5.1；Sunlit iOS 3.6.2；Wavelength iOS 2.0 / Android 2.0（[Latest app versions](https://help.micro.blog/t/4415)）。
- 服务端不开源、没有公开版本号；官方帮助论坛的最近活动时间为 2026-09-10 21:27（[Micro.blog Help Center](https://help.micro.blog/)）。
- 官方定价说明页会持续更新（如年付说明），其内容在本次抓取时为有效状态（[Pricing 文档](https://help.micro.blog/t/pricing/19)）。

### 社区活跃度证据
- 官方帮助论坛（help.micro.blog）共 12 个分类；其中核心分类「Hosting on Micro.blog」有 1093 个主题 / 6182 条帖子，最近活动 2026-09-10；「Cross-posting」325 个主题 / 1888 条帖子（[categories.json](https://help.micro.blog/categories.json)、[Help Center](https://help.micro.blog/)）。
- 2017 年通过 Kickstarter 众筹启动，官方称有 3000 名支持者（[About Micro.blog](https://micro.blog/about/)）。
- GitHub 组织累计 122 个仓库，涵盖客户端、主题与插件（[GitHub org](https://github.com/orgs/microdotblog/repositories)）。
- 当前用户数/博客数官方未公布，未核实。

### 上手难度
- 注册账号 → 选计划 → 直接在网页或原生 App 里用 Markdown 写帖发布；无需 CLI、Git 或本地构建（[About Micro.blog](https://micro.blog/about/)、[Blogging](https://micro.blog/about/blogging)）。
- 自定义域名与 SSL 属于平台能力：Micro.one（$1/月）档就已包含「使用自己的域名」和「自定义域名 SSL」（[Pricing 文档](https://help.micro.blog/t/pricing/19)）。
- 想改外观才涉及代码：主题是 Hugo 模板，可在后台直接编辑 HTML/CSS，或从 GitHub 克隆主题仓库进来自定义（[Custom themes](https://help.micro.blog/t/59)）。

### 费用
- Micro.one $1/月；Micro.blog $5/月；Micro.blog Premium $10/月；Micro.blog Family $15/月；Micro.blog Studio $20/月（[micro.blog/pricing](https://micro.blog/pricing)、[Pricing 文档](https://help.micro.blog/t/pricing/19)）。
- 年付：Micro.blog $50/年、Premium $100/年、Family $150/年（[Pricing 文档](https://help.micro.blog/t/pricing/19)）。
- 免费额度：官方说法是「When a trial expires, it switches to the free plan」，即试用结束后转为免费计划；免费计划的具体功能限制官方未在这两页列出，未核实（[Pricing 文档](https://help.micro.blog/t/pricing/19)）。
- 各档差异（官方列举）：$1 档已有独立域名+SSL、照片/短视频/播客托管（单视频、MP3 上限 75MB）、自定义 CSS、多平台导入；$5 档增加自动跨平台分发（Mastodon/Threads/Bluesky/Medium/Tumblr/LinkedIn/Flickr/Pixelfed/Nostr）、自定义主题（可改 HTML 模板）、私密与共享笔记；$10 档增加最多 5 个完整博客、书签归档、邮件订阅；$15 档增加协作者（最多 5 人）；$20 档增加视频播放与录音室能力（[Pricing 文档](https://help.micro.blog/t/pricing/19)、[micro.blog/pricing](https://micro.blog/pricing)）。
- SaaS 与自托管差异：micro.blog 只有 SaaS，没有自托管服务端；官方提供的「灵活路线」是把外部博客（如 WordPress）接进来当发布后端，而不是自建 micro.blog 服务（[Posting to external blogs](https://help.micro.blog/t/4368)）。

### Markdown 支持情况
- 原生 Markdown：官方文档《Why Micro.blog uses Markdown》说明「Micro.blog uses Markdown for styling and links in your blog posts」，并把 Markdown 作为从短帖到长文的统一格式，不足处可直接写 HTML 标签（[Why Micro.blog uses Markdown](https://help.micro.blog/t/4154)）。
- 官方 Markdown 参考页列出强调（`_斜体_` / `**粗体**`）、链接、引用（`>`）、标题等基础语法，并提示「应把标记限制在简单格式与链接」，且时间线会剥离部分 HTML 标签（[Markdown reference](https://help.micro.blog/t/30)）。
- 编辑器为标准 Markdown 文本编辑；App 版本说明里明确提到「improve Markdown highlighting」（[Latest app versions](https://help.micro.blog/t/4415)）。
- 扩展生态：主题层用 Hugo 模板 + 插件（plug-ins）体系扩展，主题可编辑 HTML、Markdown、JSON、CSS 等文件类型（[Custom themes](https://help.micro.blog/t/59)）；插件的官方介绍见 [Plug-ins 文档](https://help.micro.blog/t/104)。

### LaTeX 数学公式支持
- 不内置，需要自己注入：官方论坛中关于「Equation support in Markdown」的答复是「You'll need to add something like MathJax support by editing your theme」，并给出 Hugo 下添加数学支持的示例文章（[Equation support in Markdown](https://help.micro.blog/t/1269)）。
- 官方给出的替代做法：把 KaTeX 的 CSS/JS 与 auto-render 脚本贴进文章或主题 head；若 head 模板不生效，可改用官方插件目录里名为 **Meta tags** 的插件把这些脚本塞进 head（[Equation support in Markdown](https://help.micro.blog/t/1269)）。
- 具体代价：需要外链 CDN（论坛示例用 jsdelivr 的 katex 0.16.3）、需要自己声明定界符（示例里同时配置了 `$$` 与 `$` 两组 delimiters），行内公式因此要自己调参（[Equation support in Markdown](https://help.micro.blog/t/1269)）。
- 不涉及付费档位；也不需要 Notion 那样的内置库。已知限制：官方没有正式的数学公式文档页，仅论坛答复（未核实是否存在其他内置开关）。

### 视觉风格评价
- 内置设计偏简约排版向：官方仓库提供 `theme-blank`（默认模板集合）、`theme-marfa`（受 Jekyll 的 Cactus 主题启发）、`plugin-tufte`（官方 Tufte 主题，以旁注式学术排版著称）（[theme-blank](https://github.com/microdotblog/theme-blank)、[theme-marfa](https://github.com/microdotblog/theme-marfa)、[plugin-tufte](https://github.com/microdotblog/plugin-tufte)）。
- 自定义能力：$1 档即有自定义 CSS，$5 档起可完全自定义 HTML 模板；支持从 GitHub 克隆主题仓库、支持在插件目录里预览主题（会开一个 `yourname-preview.micro.blog` 预览站）（[Pricing 文档](https://help.micro.blog/t/pricing/19)、[Custom themes](https://help.micro.blog/t/59)）。
- 「少量装饰提升质感」：可直接在后台改 HTML/CSS，或用现成的 Tufte/Marfa 这类风格化主题，改动成本低（[Custom themes](https://help.micro.blog/t/59)）。
- 示例站：<https://www.manton.org/>（创始人 Manton Reece 的博客，官方 About 页直接外链）、<https://news.micro.blog/>（官方新闻站）（[About Micro.blog](https://micro.blog/about/)）。

### 优缺点与适用人群
- 优点：$1 起就有独立域名 + SSL；短帖/长文/图/播客/邮件订阅/书签在同一产品内；自带社交时间线、ActivityPub 与多平台自动分发；原生 iOS/Android/Mac App 体验好；Markdown 优先、主题基于 Hugo、可深度自定义；论坛活跃（核心分类 1093 主题，最近活动 2026-09-10）（[micro.blog/pricing](https://micro.blog/pricing)、[categories.json](https://help.micro.blog/categories.json)）。
- 缺点：没有长期免费档，试用后免费计划能力受限且官方未列明；数学公式要自己注入 KaTeX/MathJax，学术写作不友好；服务端闭源不可自托管；主题/插件生态规模远小于 Obsidian、Notion 生态。
- 适用人群：想要「独立域名 + 自带社区/分发 + 少运维」的独立博主、微型博客（microblog）用户、播客与摄影博主；大量写数学公式的人需额外配置主题。

---

## 10. Halo

### 技术栈与托管方式
- **纯自托管，没有官方 SaaS。** 官方文档把发行版本分为 Halo 社区版、Halo 专业版、Halo 商城版三类，三者都是「部署到你自己的服务器」，没有任何官方托管站点（[docs.halo.run/guide/prepare.md](https://docs.halo.run/guide/prepare.md)）。
- 后端 Java（仓库语言标记 Java，[github.com/halo-dev/halo](https://github.com/halo-dev/halo)），Spring Boot 4.1.1（v2.26.1 release notes 的依赖更新条目，[release v2.26.1](https://github.com/halo-dev/halo/releases/tag/v2.26.1)）。
- 数据库支持 PostgreSQL / MySQL / MariaDB / H2；需要 JRE 21（2.21 以上版本），官方主推 Docker 部署（[docs.halo.run/guide/prepare.md](https://docs.halo.run/guide/prepare.md)）。
- **需要自己买服务器。** 官方明确写「Halo 目前不支持市面上的云虚拟主机，请使用云服务器或者 VPS」，建议至少 1G 内存（[docs.halo.run/guide/prepare.md](https://docs.halo.run/guide/prepare.md)）。部署方式包括 Docker Compose、Docker、1Panel、宝塔、Helm、Podman、JAR、离线包（[docs.halo.run/guide/install/](https://docs.halo.run/guide/install/)）。
- **官方的「云托管」选项其实是云市场镜像，不是 SaaS**：阿里云计算巢部署、阿里云云市场部署（含「购买服务器」步骤）、腾讯云轻量应用模板（含「购买轻量应用服务器」步骤），服务器仍由用户自行购买（[阿里云云市场部署](https://docs.halo.run/guide/install/cloud/alibaba-cloud-market.md)、[腾讯云轻量应用模板](https://docs.halo.run/guide/install/cloud/tencent-cloud-lighthouse.md)）。
- **付费版的商业实体是凌霞软件**，卖的是自托管许可证而非托管服务：官方文档称「Halo 付费版包含专业版和商城版，是凌霞软件旗下的商业产品」，版本对比页指向 lxware.cn/halo；许可证同一时段只能绑定激活一个设备/站点，激活需联网向校验服务器请求（[docs.halo.run/guide/prepare.md](https://docs.halo.run/guide/prepare.md)、[lxware.cn/halo](https://www.lxware.cn/halo)）。
- 本笔记未找到任何 Halo 官方或官方认证的免运维托管服务。

### 最新版本或最近更新时间
- 最新 Release：**v2.26.1，发布于 2026-09-01**（[github.com/halo-dev/halo/releases/tag/v2.26.1](https://github.com/halo-dev/halo/releases/tag/v2.26.1)，release 时间戳 2026-09-01T08:03:42Z）。
- v2.26.1 内容为功能优化与问题修复，并把 Spring Boot 升级到 4.1.1（[release v2.26.1](https://github.com/halo-dev/halo/releases/tag/v2.26.1)）。
- 2.26.0 正式发布于 2026-08-14，官方发布说明见 2026-08-17 的博客《Halo 2.26 发布》（[halo.run/archives/halo-2.26-released](https://www.halo.run/archives/halo-2.26-released)）。
- 版本发布汇总页：[releases.halo.run](https://releases.halo.run/)。
- 仓库最近 commit：2026-09-11T09:53:09Z，提交信息 Fix theme selection after activation (#10306)（[github.com/halo-dev/halo](https://github.com/halo-dev/halo)，亦见工作区已核实的 docs/research-notes/github-metrics.json）。

### 社区活跃度证据
- GitHub Star **39715**，fork 10331，最近 commit 2026-09-11（[github.com/halo-dev/halo](https://github.com/halo-dev/halo)）。
- 官方 2026 年 Q3 声明：Halo 在 Docker Hub 获得**超过 380 万次下载**、**GitHub Star 数接近 4 万**、拥有**超过 150 名社区贡献者**（[halo.run/archives/halo-2.26-released](https://www.halo.run/archives/halo-2.26-released)）。
- 应用市场体量：官方应用市场接口显示共 **319 个应用**，其中 **127 款主题**（[halo.run/store/apps](https://www.halo.run/store/apps)，数据取自 [applications 接口](https://www.halo.run/apis/api.store.halo.run/v1alpha1/applications?page=1&size=1000)）。
- 社区入口：官方论坛 [bbs.halo.run](https://bbs.halo.run/)、GitHub Issues/Discussions、Telegram 频道与群（[halo.run](https://www.halo.run/)）。
- 缺口：论坛帖子/用户规模数字未取到（见文末未核实事项）。

### 上手难度
- 前置门槛在服务器：需要云服务器/VPS + Docker 或 JRE 21（[docs.halo.run/guide/prepare.md](https://docs.halo.run/guide/prepare.md)）。
- 装完后是纯 Web 流程，**不需要 CLI 和 Git**：浏览器访问 /console 登录管理端 → 点击仪表盘「创建文章」→ 在编辑器里写内容 → 右上角「发布」填标题/别名 → 发布成功（[docs.halo.run/guide/first-post.md](https://docs.halo.run/guide/first-post.md)）。
- 想先看效果可用官方演示环境 <https://demo.halocms.site>（后台 /console，文档直接给了演示账号密码）（[docs.halo.run/guide/demo.md](https://docs.halo.run/guide/demo.md)）。
- 只有选 JAR 部署、源码开发或自己写主题/插件时才涉及命令行与本地构建（[docs.halo.run/guide/install/jar-file.md](https://docs.halo.run/guide/install/jar-file.md)）。
- 默认编辑器不是 Markdown 编辑器（见下一节），这会明显抬高「Markdown 写作者」的上手成本。

### 费用
- **Halo 社区版：¥0 / 开源免费**（GPL-3.0），含内容管理、应用市场的免费主题与免费插件（[halo.run/halo-shop](https://www.halo.run/halo-shop)、[docs.halo.run/guide/prepare.md](https://docs.halo.run/guide/prepare.md)）。
- **Halo 专业版：¥540 / 年起**（页面标注「页面展示稳定起价。实际价格、优惠活动与订单结算以凌霞软件购买页为准」），在社区版之上加移动端 App、专业版专享插件与主题、AI 建站、RAG 智能问答、SEO 工具、手机号注册登录、登录人机验证、限制邮箱域名、自定义 LOGO/品牌、全站私有化、Redis 会话存储（[halo.run/halo-shop](https://www.halo.run/halo-shop)）。
- **Halo 商城版：¥1,500 / 年起**，在专业版之上加在线商城、商城小程序、商品发布（实体/虚拟/链接）、支付宝/微信支付/易支付/Stripe 收款、库存与发货（[halo.run/halo-shop](https://www.halo.run/halo-shop)）。
- 付费版是**自托管许可证**：一证同一时段只能激活一个站点，可换绑；永久授权已于 2024 年发行后停止常规出售（[lxware.cn/halo](https://www.lxware.cn/halo)）。
- 教育优惠：凌霞「云心计划」校园用户 3 折（[lxware.cn/halo](https://www.lxware.cn/halo)）。
- **SaaS 版费用：不存在**（无官方 SaaS，故无订阅式托管价）。自托管的隐性成本 = 服务器 + 域名 + 自行运维/升级，官方文档未给出托管价格。
- 凌霞购买页价格由 JS 动态渲染，未能抓到月付/续费/买断的全部档位数字（见未核实事项）。

### Markdown 支持情况
- **不原生。** Halo 2.0 起默认是 Tiptap 富文本块编辑器，官方迁移文档明确写「Halo 2.0 目前没有内置 Markdown 编辑器，如果需要重新编辑迁移后的文章，需要额外安装 Markdown 编辑器插件」，并指向应用市场的 Markdown 插件标签页（[docs.halo.run/guide/migrate-from-1.x](https://docs.halo.run/guide/migrate-from-1.x)、[halo.run/store/apps?tag=editor](https://www.halo.run/store/apps?tag=editor)）。
- 官方文档也确认编辑器可插拔：文章编辑页可在「编辑器切换」处切换已安装的编辑器插件（[docs.halo.run/guide/use/posts.md](https://docs.halo.run/guide/use/posts.md)）。
- 应用市场可选的 Markdown 编辑器（均为免费插件）：
  - **Vditor 编辑器** v1.10.3（2026-08-14 发布，下载 23721，第三方 justice2001）（[store/apps/app-uBcYw](https://www.halo.run/store/apps/app-uBcYw)）。
  - **ByteMD** v1.9.0（2026-06-26，官方 official 标签）（[store/apps/app-HTyhC](https://www.halo.run/store/apps/app-HTyhC)）。
  - **StackEdit** v1.2.0（2025-06-10，官方 official 标签）（[store/apps/app-hDXMG](https://www.halo.run/store/apps/app-hDXMG)）。
  - **Willow Markdown 编辑器** v1.1.1（2025-12-04，基于 Ink MDE + CodeMirror）（[store/apps/app-kqZUw](https://www.halo.run/store/apps/app-kqZUw)）。
  - **Markdown / HTML 内容块** v1.7.0（2026-08-17，官方，为默认富文本编辑器加 Markdown/HTML 内容块）（[store/apps/app-NgHnY](https://www.halo.run/store/apps/app-NgHnY)）。
  - 辅助类：文章导入导出（Markdown/HTML）v1.2.5（2025-09-15）、内容助手 v1.8.0（2026-08-14）（[应用市场](https://www.halo.run/store/apps)）。
- 扩展语法靠插件而非主题：官方文档把 halo-sigs/plugin-bytemd、plugin-stackedit、plugin-text-diagram（文本绘图）、第三方 halo-plugin-vditor 列为编辑器扩展的官方实现案例（[editor-create.md](https://docs.halo.run/developer-guide/plugin/extension-points/ui/editor-create.md)）。市场另有文本绘图、Typst、TikZ、Shiki 代码高亮等扩展类插件（[应用市场](https://www.halo.run/store/apps)）。
- 结论：**写 Markdown 必须先装插件**，插件安装是后台一键（插件市场/本地上传 JAR），不涉及 Git 或本地构建（[docs.halo.run/guide/use/plugins](https://docs.halo.run/guide/use/plugins)）。

### LaTeX 数学公式支持
- **不内置，靠官方插件**：KaTeX 插件（应用市场 ID app-ISCsX，仓库 [github.com/halo-sigs/plugin-katex](https://github.com/halo-sigs/plugin-katex)，官方 official 标签，GPL-3.0，**免费**）（[store/apps/app-ISCsX](https://www.halo.run/store/apps/app-ISCsX)）。
- 版本：**v3.0.0，2026-01-16 发布，要求 Halo >= 2.22.2**；市场统计下载 11021、浏览 15766（[store/apps/app-ISCsX](https://www.halo.run/store/apps/app-ISCsX)、[插件 releases 接口](https://www.halo.run/apis/api.store.halo.run/v1alpha1/applications/app-ISCsX/releases)）。
- 机制是 **KaTeX（不是 MathJax）**，且 v3.0.0 改为**预渲染**：release notes 写「不再需要在前台加载 KaTeX 的依赖来渲染公式」（[store/apps/app-ISCsX](https://www.halo.run/store/apps/app-ISCsX)）。不需要自己挂 CDN。
- 具体用法（官方 README，[raw README](https://raw.githubusercontent.com/halo-sigs/plugin-katex/main/README.md)、[store/apps/app-ISCsX](https://www.halo.run/store/apps/app-ISCsX)）：
  - 默认编辑器：用 $ 开头和结尾的语句渲染为**行内公式**；输入 $$ 并回车插入**块级公式**；也可从工具栏工具箱或指令菜单（/）选「KaTeX 块级公式 / 行内公式」；默认编辑器下会自动生成 DOM，**无需额外配置**。
  - **非默认编辑器（ByteMD / StackEdit / Vditor 等）需要在插件设置里开启「启用 KaTex 客户端渲染」**，并配置行内/块级公式的 CSS 选择器，默认值分别是 [math-inline] 与 [math-display]；已知选择器：ByteMD 用 .math-inline，StackEdit 用 .katex--inline；多编辑器用逗号分隔。
  - 已知升级限制：v3.0.0 重构了默认编辑器保存的结构，从旧版本升级后若公式不显示，需要在插件设置里开启「启用 KaTex 客户端渲染」，或把旧文章重新打开保存一次。
  - 行内公式的 $ 转义方式：README 未给出说明（见未核实事项）。
- 备选：市场还有第三方数学公式插件 **KMath** v0.3.5（2026-05-07，描述「为编辑器和文章渲染提供 数学公式 支持」，应用 ID app-szrtpwd9）（[应用市场](https://www.halo.run/store/apps)）。
- 付费门槛：KaTeX 插件本身免费，社区版即可用（[store/apps/app-ISCsX](https://www.halo.run/store/apps/app-ISCsX)、[halo.run/halo-shop](https://www.halo.run/halo-shop)）。

### 视觉风格评价
- 主题生态大：应用市场 127 款主题，绝大多数免费；下载量前列为 Hao（58088）、Earth（53596，official 标签）、Sakura（30641）、Joe 3.0（29191）、Dream for Halo 2.x（18032）、Chirpy（16083）、Ocean（14368，知识库向）（[halo.run/store/apps?type=THEME](https://www.halo.run/store/apps?type=THEME)）。
- 默认观感偏「产品化」而非极简纸面：官方站点与演示站都是内容型/门户型布局（<https://demo.halocms.site>，[docs.halo.run/guide/demo.md](https://docs.halo.run/guide/demo.md)）。
- 主题自定义能力强：主题是 Thymeleaf 模板 + 主题设置，可自定义 CSS/静态资源、页面布局、SEO（[docs.halo.run/developer-guide/theme/](https://docs.halo.run/developer-guide/theme/)、[主题设置](https://docs.halo.run/developer-guide/theme/settings)）。
- 少量装饰即可提质感：换一个中文圈成熟主题（如 Sakura、Joe 3.0、Hao）后调主题内置设置项即可，不必写代码；官方还发布了支持可视化模块编排的 Publica 主题（[halo.run/archives/halo-2.26-released](https://www.halo.run/archives/halo-2.26-released)）。
- 示例站集合（官方 Showcase，可按个人博客/知识库/企业官网筛选）：[halo.run/showcase/websites?tag=personal-website](https://www.halo.run/showcase/websites?tag=personal-website)。
- 付费版含「专业版专享主题」（[halo.run/halo-shop](https://www.halo.run/halo-shop)）。

### 优缺点与适用人群
- 优点：中文文档与中文社区完善；Docker 一条命令部署，后台全图形化；主题/插件市场成熟（319 个应用、127 款主题，含大量国产主题）；官方 KaTeX 插件质量高于一般博客系统；社区版免费档功能完整。
- 缺点：**没有官方 SaaS**，必须自备服务器并自行运维、备份、升级；**默认不带 Markdown 编辑器**，Markdown 与数学公式都要额外装插件；内存最低 1G 且不支持虚拟主机；专业版/商城版是自托管许可证，购买页价格动态渲染且需联网激活校验。
- 适用人群：愿意自己买 VPS/Docker 的中文博主、知识库/官网用户；已经在用 1Panel/宝塔的人；需要商城或小程序能力、且坚持数据自持的商家。纯想「注册就写 Markdown + 公式」的人不合适（在 Halo 上要额外装编辑器与 KaTeX 插件）。

---

## 11. Typlog

### 技术栈与托管方式
- **闭源 SaaS，没有自托管版。** 官方站点页脚署名为 Typlog © 2017 Hsiaoming Ltd.，产品形态是「注册站点 → 在 typlog.com 后台写作 → 站点托管在 Typlog」（[typlog.com](https://typlog.com/)、[typlog.com/pricing](https://typlog.com/pricing)）。
- 后端语言/数据库未公开（闭源，无源码仓库）；官方文档只披露 Markdown 解析器为 **Mistune**（[docs.typlog.com/en/article/markdown/](https://docs.typlog.com/en/article/markdown/)）。
- 不需要自己买服务器；可绑定自有域名（三档都支持 Custom Domain，含 SSL & CDN）（[typlog.com/pricing](https://typlog.com/pricing)）。
- 主题层面开放：可用 Jinja2 模板开发自有主题，文档给出主题结构、模板设计、提交主题的流程（[docs.typlog.com/en/topic/theme/](https://docs.typlog.com/en/topic/theme/)）；同时提供 Content API、Webhook、MarsEdit 等外部接入（[docs.typlog.com](https://docs.typlog.com/)）。
- 支持从 WordPress / Ghost 一键导入，也能导入播客 RSS（[typlog.com](https://typlog.com/)）。

### 最新版本或最近更新时间
- 无版本号（SaaS 闭源）。官方 Changelog 最新一条为 **2023-03-15「Convert to Markdown」**（HTML→Markdown 转换按钮），其下还有 2023-02-07（移除 Twitter 集成、GA4 支持）、2022-11-25（预览 URL）等（[typlog.com/changelog/](https://typlog.com/changelog/)）。
- 文档站的 Recent updates 最新条目为 **Mar 27, 2023**（Integrate with Google Search Console）（[docs.typlog.com](https://docs.typlog.com/)）。
- 也就是说：**能核实到的最新官方更新记录停留在 2023 年**；2024–2026 年是否有更新未能核实（见未核实事项）。

### 社区活跃度证据
- 闭源产品，无 GitHub Star 可查；官方社区渠道为 Twitter/X（@typlog）与 Telegram 群（[typlog.com](https://typlog.com/)），官方博客 Type A Log（[blog.typlog.com](https://blog.typlog.com/)）。
- 主题为开源，分布在 GitHub 的 typlog 组织下（如 [github.com/typlog/akasaka](https://github.com/typlog/akasaka)）。
- **用户规模：未核实**，官方站点与定价页均未公布用户数/站点数（[typlog.com](https://typlog.com/)、[typlog.com/pricing](https://typlog.com/pricing)）。
- 集成生态（官方列举）：Mailchimp、AMP、Telegram、Twitter、Webhooks、Disqus、Analytics、Chartable、Discord、Zapier、Slack、Unsplash、Vimeo、YouTube、Pixabay、Spotify（[typlog.com](https://typlog.com/)）。

### 上手难度
- 最低：注册 → 7 天免费试用 → 选模板 → 在网页编辑器里用 Markdown 写 → 发布（[typlog.com](https://typlog.com/)、[typlog.com/pricing](https://typlog.com/pricing)）。
- **不涉及 CLI / Git / 本地构建**，全部在 Web 后台完成；编辑器有大量快捷键（加粗 ⌘/Ctrl+B、标题 ⌘+⌥+1~6、列表、引用、代码等）（[docs.typlog.com/en/article/markdown/](https://docs.typlog.com/en/article/markdown/)）。
- 也可以走 API：文档提供 Content API、Webhook，以及用 MarsEdit 这类桌面客户端写作（[docs.typlog.com](https://docs.typlog.com/)）。
- 进阶成本在主题：自定义主题需要 API token + Jinja2 模板语言，属于开发者向（[docs.typlog.com/en/topic/theme/](https://docs.typlog.com/en/topic/theme/)）。
- 支持从其他平台导入（WordPress/Ghost 一键导入，也可让官方代导）（[typlog.com](https://typlog.com/)）。

### 费用
官方定价页（[typlog.com/pricing](https://typlog.com/pricing)）博客档位：
- **Basic：$4/月**，年付 $40（省 $8）。1 名成员，10k 页面浏览/月，图片上限 2M，Simple 搜索，HTML 注入 不支持，受保护文章 不支持，订阅者 不支持。
- **Standard：$8/月**，年付 $80（省 $16）。3 名成员，100k 页面浏览/月，图片上限 5M，Simple 搜索，**HTML 注入 支持**，受保护文章 不支持，订阅者 不支持。
- **Professional：$12/月**，年付 $120（省 $24）。5 名成员，400k 页面浏览/月，图片上限 8M，**Algolia 搜索**，HTML 注入 支持，**受保护文章 支持**，**订阅者 支持**。
- 三档共同点：文章/页面/图片上传无限，自定义域名 支持，SSL & CDN 支持，基础统计 支持。
- 试用与计费：新用户 7 天免费试用；一个账号可以有多个站点，**每个站点各自订阅**；接受 Stripe 的各类借记卡/信用卡（含 Visa、Mastercard、American Express、JCB、UnionPay）；年付相当于 2 个月优惠；无学生/非营利折扣；订阅到期后站点保留一个月（[typlog.com/pricing](https://typlog.com/pricing)）。
- 播客（Podcast）档位价格未渲染出数字，未能核实（见未核实事项）。
- **无自托管选项，因此不存在「自托管费用」**；对比自托管方案时，Typlog 的成本是纯订阅费（[typlog.com/pricing](https://typlog.com/pricing)）。

### Markdown 支持情况
- **原生，且是 Markdown-first。** 官方首页即写「use the complete markdown syntax」「A simple yet powerful editor」（[typlog.com](https://typlog.com/)）；Changelog 也强调 Typlog 是 designed with a Markdown-first approach（[typlog.com/changelog/](https://typlog.com/changelog/)）。
- 解析器为 **Mistune**（官方文档明示）（[docs.typlog.com/en/article/markdown/](https://docs.typlog.com/en/article/markdown/)）。
- 基础语法：加粗/斜体/行内代码/删除线/链接/图片/标题/有序无序与嵌套列表/引用/分隔线/手动换行/代码块/脚注，并有大量跨平台快捷键（[docs.typlog.com/en/article/markdown/](https://docs.typlog.com/en/article/markdown/)）。
- 扩展语法（Advanced markdown，[docs.typlog.com/en/article/advanced-markdown/](https://docs.typlog.com/en/article/advanced-markdown/)）：表格；围栏代码块的三类选项 lineno（行号）、highlight=2-5,9（高亮行）、filename=hello.py（显示文件名），可组合；Admonitions（Note 等提示块）。
- 生态：可用 HTML 注入（Standard 及以上档位）插自定义代码；主题可用 Jinja2 自行开发；有 Content API/Webhook 便于外部工具（[typlog.com/pricing](https://typlog.com/pricing)、[docs.typlog.com/en/topic/theme/](https://docs.typlog.com/en/topic/theme/)）。

### LaTeX 数学公式支持
- **内置支持，机制是 MathJax**（不是 KaTeX，不需要装插件）。官方文档「Advanced markdown syntax」里有独立小节 Math：「Math is supported via MathJax」（[docs.typlog.com/en/article/advanced-markdown/](https://docs.typlog.com/en/article/advanced-markdown/)）。
- 三种写法（同一文档）：
  - 行内公式：用 $ ... $ 包裹，例如 $ax^2 + bx + c = 0$。
  - 块级公式：$$ ... $$，例如 $$ax^2 + bx + c = 0$$。
  - 或者用语言标记为 math 的围栏代码块写块级公式（三个反引号 + math）。
- 是否要付费档位：官方文档未把 Math 标为付费特性，定价页的档位对比表中也没有数学公式这一行；数学公式属于 Markdown 渲染能力（[docs.typlog.com/en/article/advanced-markdown/](https://docs.typlog.com/en/article/advanced-markdown/)、[typlog.com/pricing](https://typlog.com/pricing)）。
- 已知限制：**未核实**。文档未说明 $ 的转义方式，也未说明是否需要自行注入 MathJax 脚本/CDN（文档把它当作内置渲染能力描述）；美元符号与普通文本冲突如何处理，官方文档没有给出（见未核实事项）。

### 视觉风格评价
- 默认走极简、排版优先路线，官方自述「Elegant photo layouts in markdown」「Curated templates suitable for different purposes」（[typlog.com](https://typlog.com/)）。
- 内置主题（官方主题库 [themes.typlog.com](https://themes.typlog.com/)，主题源码在 GitHub 的 typlog 组织）：**ueno（上野）v0.8.0**（blog/podcast）、**nezu（根津）v0.8.0**（blog/podcast）、**ginza（银座）v0.4.3**（blog/podcast）、**meguro（目黑）v0.5.0**（blog）、**akasaka（赤坂）v0.5.0**（doc）、**aoyama（青山）v1.0.1**（blog/podcast）、**coffee（咖啡）v0.4.1**（podcast）、**puti（菩提）v0.1.8**（[themes.typlog.com](https://themes.typlog.com/)）。
- 主题在线预览：每个主题有 https://theme-<id>.typlog.io/ 形式的 demo，例如 <https://theme-ueno.typlog.io/>（[themes.typlog.com](https://themes.typlog.com/)）；akasaka 的官方预览就是本产品的文档站 <https://docs.typlog.com/en/>（[themes.typlog.com/data/akasaka.json](https://themes.typlog.com/data/akasaka.json)）。
- 自定义 CSS 能力：**HTML 注入（含自定义代码/样式）从 Standard 档位起才开放**，Basic 档不允许（[typlog.com/pricing](https://typlog.com/pricing)）。
- 用少量装饰提升质感：官方主题本身已经完成排版与图片版式，切主题 + 换封面/头图即可；想做品牌化再上 Standard 的自定义代码注入（[typlog.com](https://typlog.com/)、[typlog.com/pricing](https://typlog.com/pricing)）。

### 优缺点与适用人群
- 优点：开箱即用的极简排版；**Markdown 与 MathJax 数学公式都是原生**，不需要装任何插件；自带主题质量高（日本地名系列）；支持自定义域名、SSL/CDN、Analytics、Newsletter、内容 API、Webhook；对中文/日文写作者友好。
- 缺点：**闭源 SaaS，无法自托管**，数据只能靠导出；能核实到的官方更新记录停在 2023 年，产品迭代节奏不明；页面浏览有档位上限（10k/100k/400k 每月，按 3 个月滚动平均判定）；自定义样式要 Standard 起步；用户规模不透明。
- 适用人群：想「注册就写 Markdown + 数学公式」、不想碰服务器与插件的中文/日文技术写作者、播客主；不适合要求自托管、数据自持或需要主题深度改造的人。

---

## 12. WriteFreely / Write.as

### 技术栈与托管方式
- 双形态：**WriteFreely 是开源自托管版**（Go 编写，AGPL-3.0，[github.com/writefreely/writefreely](https://github.com/writefreely/writefreely)）；**Write.as 是官方 SaaS 托管版**，由项目方 Musing Studio 运营（[writefreely.org](https://writefreely.org/)、[writefreely.org/services/hosting](https://writefreely.org/services/hosting)）。
- 自托管依赖极简：官方称 installation is as easy as downloading a binary and a few supporting files, no other dependencies required；用 Go 写所以资源占用很小，甚至能跑在 Raspberry Pi 上；数据库可选 SQLite 或 MySQL（5.6+，时区需为 UTC）（[writefreely.org](https://writefreely.org/)、[writefreely.org/start](https://writefreely.org/start)）。
- 自托管仍然**需要自己买服务器**（官方 Getting Started 原话：requires technical knowledge and access to a server you control）（[writefreely.org/start](https://writefreely.org/start)）。
- SaaS 版不需要服务器；官方托管还提供自动备份与升级、固定月费、优先体验新特性（[writefreely.org/services/hosting](https://writefreely.org/services/hosting)）。
- 第三方托管也已在官方页面列出：**Cloud68**、**Spacebear** 提供 WriteFreely 托管服务（[writefreely.org/services/hosting](https://writefreely.org/services/hosting)）。
- 联邦能力：基于 ActivityPub 与 Mastodon/Pleroma 等互通（[writefreely.org](https://writefreely.org/)、[writefreely.org/features](https://writefreely.org/features)）。

### 最新版本或最近更新时间
- 最新 Release：**v0.17.2，2026-08-10**（[github.com/writefreely/writefreely/releases/tag/v0.17.2](https://github.com/writefreely/writefreely/releases/tag/v0.17.2)）。
- v0.17.2 是一次**关键安全修复**版本：修复了闭站注册实例上「任何人用无效邀请码即可注册账号」的漏洞（#1723，由 #1724 修复），并包含少量 UI/图标修复（[release v0.17.2](https://github.com/writefreely/writefreely/releases/tag/v0.17.2)，亦见 [releases.atom](https://github.com/writefreely/writefreely/releases.atom)）。
- 更早版本：v0.17.1（2026-07-20）、v0.17（2026-07-18，含 CVE-2025-24337 等安全修复）、v0.16.0（2025-08-29）（[releases.atom](https://github.com/writefreely/writefreely/releases.atom)）。
- 仓库最近 commit：2026-08-28T19:46:51Z，Merge pull request #1731 from writefreely/improve-missing-dir-errors（[github.com/writefreely/writefreely](https://github.com/writefreely/writefreely)）。
- 许可协议：AGPL-3.0（同上）。

### 社区活跃度证据
- GitHub Star **5251**，最近 commit 2026-08-28，最新 release v0.17.2（2026-08-10）（[github.com/writefreely/writefreely](https://github.com/writefreely/writefreely)）。
- 官方站点自述：「WriteFreely has spent the past decade reliably powering **more than 550,000 blogs on Write.as**」，以及「WriteFreely powers **tens of thousands of individual blogs, and hundreds of communities**」（[writefreely.org](https://writefreely.org/)）。
- 官方实例目录（含各实例的博客/文章数，页面实时统计）：Write.as 条目显示 **8.4k blogs · 98.2k articles**；Rant.li 14.7k blogs / 29.2k articles；DTTH 14.9k blogs；tchncs 1.2k blogs；noblogo.org 1.5k blogs（[writefreely.org/instances](https://writefreely.org/instances)）。注意该页的 8.4k 与首页 550,000+ 口径不同，前者应为该目录公开统计到的实例，后者是官方对 Write.as 累计博客数的表述。
- 论坛：官方社区讨论区 <https://discuss.write.as/c/writefreely>（[writefreely.org](https://writefreely.org/)）。
- 联邦实例统计：<https://writefreely.fediverse.observer/stats>（[writefreely.org](https://writefreely.org/)）。

### 上手难度
- **SaaS（Write.as）**：注册即可开始写；首页强调「You will see our editor screen first, every time you open the app」、写作时自动保存到浏览器，还支持**不注册先试写一篇**（[write.as](https://write.as/)、[writefreely.org/features](https://writefreely.org/features)）。
- **自托管（WriteFreely）**：官方 Quick Start 给出的路径是——下载对应系统的最新 release → 解压进目录 → 运行 writefreely config start 交互式配置 → 启动；官方估计**约 30 分钟**；走 MySQL 时需先建库。无 Git、无本地构建要求（只有 OS/架构不在预编译列表里才需要从源码构建）（[writefreely.org/start](https://writefreely.org/start)）。
- 写文章本身不需要 CLI/Git：标题可用井号加空格写标题行（会写入浏览器标题栏），或首行单独写一行后空行分隔（显示为正文同字号）（[writefreely.org/docs/main/writer/writing](https://writefreely.org/docs/main/writer/writing)）。
- 进阶：自定义 CSS（Customize → Custom CSS）、联邦、订阅、草稿、静态页等在 Writer Guide 里分节说明（[writefreely.org/docs/main/writer/css](https://writefreely.org/docs/main/writer/css)、[writefreely.org/docs/main/writer](https://writefreely.org/docs/main/writer)）。

### 费用
- **自托管 WriteFreely：软件免费**（AGPL-3.0），成本只有你自己的服务器（[github.com/writefreely/writefreely](https://github.com/writefreely/writefreely)、[writefreely.org/start](https://writefreely.org/start)）。
- **SaaS（Write.as）定价**（[write.as/pricing](https://write.as/pricing)）：
  - **Free：$0**，标注 Always。1 个博客、每天 3–15 篇、纯文本编辑器、带 Write.as 品牌、RSS、ActivityPub 联邦、Markdown 与 MathJax 支持。
  - **Pro：年付起 $6/月，月付 $9/月**。3 个个人博客、自定义域名（含 SSL）、自定义主题与代码注入、Newsletter 订阅者 1–500、照片托管（Snap.as）、富文本编辑器、静态页、私密/密码保护博客、邮件发布、命令行发布、开发者 API、桌面应用 40% 折扣。
  - **Team：年付起 $25/月，月付 $30/月**。含 Pro 全部特性，团队博客（1 个协作博客）、1–5 名成员、用户权限，Team 档订阅者 500+。
  - 附加项：Submit.as 投稿 +$12 / +$15 / +$18（按档位）；Post Signature $10 一次性；ePub 导出 $10 一次性；额外个人博客 $1/博客/月；额外团队博客 $5/博客/月。
  - 计费细节：官方在「Free」旁边标着 **Closed for now**（含义见未核实事项）；订阅到期后会被降级到 Free，付费特性（自定义设计、自定义域名）关闭，但写作内容仍在线。
- **官方托管与 SaaS 的价格一致**：托管页写明 As low as $6 / month for personal blogs, when paid yearly，并列出自定义域名（含 SSL）、邮件订阅、多博客/多笔名、自动备份与升级、固定月费（[writefreely.org/services/hosting](https://writefreely.org/services/hosting)）。
- 第三方托管（Cloud68、Spacebear）价格官方页面未列数字（[writefreely.org/services/hosting](https://writefreely.org/services/hosting)）。

### Markdown 支持情况
- **原生、Markdown-first。** 官方 Features 页写「Formatting with Markdown — You do not have to leave the keyboard to add special formatting... Just use Markdown (or even HTML)」（[writefreely.org/features](https://writefreely.org/features)）。
- 编辑器：极简纯文本编辑器，自动保存，无工具栏、无弹窗；官方描述 distraction-free、pared down to let you do just one thing: write（[writefreely.org/features](https://writefreely.org/features)）。Write.as 的 Pro/Team 额外提供富文本编辑器（[write.as/pricing](https://write.as/pricing)）。
- 标题语法：可用井号加空格写标题行（会作为真正的标题，进浏览器标题栏），或首行单独写一行后空行分隔（显示为正文同字号）（[writefreely.org/docs/main/writer/writing](https://writefreely.org/docs/main/writer/writing)）。
- HTML 也支持：官方 Writer Guide 有「Adding HTML」一节，列出允许的标签（h1–h4、p、ul/ol/li、blockquote、pre/code、img、a、hr 等）（[writefreely.org/docs/main/writer/html](https://writefreely.org/docs/main/writer/html)）。
- 插件/扩展生态：**基本没有插件体系**（自托管是单二进制，SaaS 无插件市场）；扩展手段主要是自定义 CSS、主题文件改动（自托管）与 HTML 注入（Write.as 付费档）（[writefreely.org/docs/main/writer/css](https://writefreely.org/docs/main/writer/css)、[write.as/pricing](https://write.as/pricing)）。
- 其他写作功能：草稿、定时发布、摘要、标签（hashtags）、静态页、发布控制等见 Writer Guide 目录（[writefreely.org/docs/main/writer](https://writefreely.org/docs/main/writer)）。

### LaTeX 数学公式支持
- **Write.as（SaaS）：支持，机制为 MathJax。** 官方定价页的档位对比表把 Markdown and MathJax support 列为 Free / Pro / Team **三档全部包含（打勾）**（[write.as/pricing](https://write.as/pricing)）。
- 官方首页/Features 页对数学公式没有单独的详细文档页，写法与转义规则**未能核实**（见未核实事项）。
- **WriteFreely（自托管）：未核实。** Writer Guide 与 Admin Config 文档全文均未检索到 math/MathJax/KaTeX 相关内容（检索了 [writer 文档](https://writefreely.org/docs/main/writer) 各页与 [admin config](https://writefreely.org/docs/main/admin/config)）。
- 是否需要 CDN/自定义代码注入：SaaS 侧属于内置能力（无需自挂 CDN）；自托管侧未核实。

### 视觉风格评价
- 默认极其简约：单栏、无侧栏、无 feed、无点赞/通知，官方原话「没有 news feed、notifications、likes 或 claps」(no news feed, notifications, or unnecessary likes or claps to take you away from your train of thought)，读者端是干净的阅读版面（[writefreely.org](https://writefreely.org/)、[writefreely.org/features](https://writefreely.org/features)）。
- 主题机制：**没有主题市场**。自定义方式是写 CSS（Customize → Custom CSS），官方文档给出了 #blog-title a、header p.description、.post-title、article p a 等常用选择器示例（[writefreely.org/docs/main/writer/css](https://writefreely.org/docs/main/writer/css)）；Write.as 端同样以 custom themes + 代码注入实现（Pro 起）（[write.as/pricing](https://write.as/pricing)）。
- 少量装饰提升质感：因为默认太素，加一点点 CSS（配色、标题字体、右上角头像）就能明显改善；官方也提供 Display Format（时间倒序/正序、是否显示日期）等版式开关（[writefreely.org/docs/main/writer/display-format](https://writefreely.org/docs/main/writer/display-format)）。
- 实例/示例站（官方 Created with WriteFreely）：<https://quiethabits.net>、<https://darnell.day>、<https://deaconpatrick.org>、<https://people.kernel.org>、<https://wordsmith.social>、<https://noblogo.org>、<https://howto.write.as>（[writefreely.org/createdwith](https://writefreely.org/createdwith)）。

### 优缺点与适用人群
- 优点：同一套代码既能 SaaS 也能自托管，迁移路径清晰（可导出，也能自托管）；Markdown 原生；**数学公式在 Write.as 全档位含免费档**；AGPL 开源 + ActivityPub 联邦，可直接被 Mastodon 等关注；编辑器与阅读版面极简、无广告无追踪；自托管资源占用极小（可跑树莓派）。
- 缺点：功能刻意做得很少，没有插件生态、没有主题市场、没有内置评论系统；默认版面过于朴素，不写 CSS 很难有「质感」；格式化能力有限（无表格/脚注等扩展语法的官方文档支持）；自托管的数学公式支持情况不明；Write.as 免费档标注 Closed for now（注册策略不明确）；SaaS 用户规模口径不一致（首页 550,000+ vs 实例页 8.4k）。
- 适用人群：纯文字/随笔/技术笔记作者，尤其是看重隐私、想用联邦宇宙触达读者的人；想「先 SaaS 起步、以后可自托管」的人；不适合需要丰富排版、主题美化、公式细节控制或插件扩展的人。

---

## 附：未核实事项汇总

以下按来源分文件汇总所有未能核实的条目（含失败 URL）；正文对应位置亦已标注「未核实」。

### 1-3. WordPress / Ghost / Hashnode
1. WordPress.com 的具体用户规模：官方首页只写 "Millions of creators"，无具体数字（[wordpress.com](https://wordpress.com/)）。
2. WordPress 自托管的实际托管费用：官方只给推荐主机清单，无统一价格（[wordpress.org/hosting](https://wordpress.org/hosting/)）。
3. WordPress.com Math block（LaTeX）的渲染引擎（KaTeX/MathJax）与是否需要特定付费档位：官方支持页未说明（[wordpress.com/support/latex](https://wordpress.com/support/latex/)）。
4. 自托管 WordPress 的官方 LaTeX 方案：Jetpack LaTeX 文档页失效，尝试 [https://jetpack.com/support/latex/](https://jetpack.com/support/latex/) 与 [https://jetpack.com/support/math/](https://jetpack.com/support/math/) 均返回 404；只能给出插件目录里的 KaTeX/WP-KaTeX（[wordpress.org/plugins/katex](https://wordpress.org/plugins/katex/)）。
5. WordPress 自托管数学插件的行内公式、`\$` 转义、是否需 CDN 或自定义代码注入：未逐个抓取核实。
6. Ghost 的 LaTeX/数学公式支持：官方文档 sitemap（173 条 URL）与帮助中心 sitemap（137 篇文章）都没有 math/LaTeX 条目，changelog 也没有；是否支持、机制、档位、行内语法与转义全部未核实（[docs.ghost.org](https://docs.ghost.org/)、[ghost.org/help](https://ghost.org/help/)、[ghost.org/changelog](https://ghost.org/changelog/)）。
7. Ghost 自托管的实际月成本与自定义 CSS 开关：官方只给服务器配置要求（[docs.ghost.org/install/ubuntu](https://docs.ghost.org/install/ubuntu/)）。
8. Ghost 具体用户规模：定价页只有 "Join thousands of creators"（[ghost.org/pricing](https://ghost.org/pricing/)）。
9. Hashnode 各仓库 star 数与最近 release：`api.github.com` 返回 403 rate limit，平台仓库 [Hashnode/hashnode](https://github.com/Hashnode/hashnode) 与 [Hashnode/blog-starter-kit](https://github.com/Hashnode/blog-starter-kit) 均 404；仅确认 [Hashnode/starter-kit](https://github.com/Hashnode/starter-kit) 最近提交为 2025-01-13。
10. Hashnode 是否发布过「停止开源自托管/关闭 blog-starter-kit」的官方公告：未找到，未核实。
11. Hashnode 的后端技术栈（语言/数据库）：官方未公布，未核实。
12. Hashnode LaTeX 的渲染引擎、是否需要 Pro、行内公式与 `\$` 转义、是否需要 CDN/自定义代码注入：官方未说明，未核实。
13. Hashnode 累计用户/博客规模：首页只给最近 24 小时实时数字（[hashnode.com](https://hashnode.com/)）。
14. Hashnode 是否支持自定义 CSS 与可用主题清单：官方没有主题市场，未核实。
15. 失败的抓取 URL 汇总：https://apidocs.hashnode.com/（DNS 解析失败 ENOTFOUND）、https://hashnode.com/pricing（返回首页内容，不再有价格档位）、https://jetpack.com/support/latex/ 与 https://jetpack.com/support/math/（404）、https://api.github.com/repos/Hashnode/hashnode、https://api.github.com/repos/Hashnode/blog-starter-kit、https://api.github.com/orgs/Hashnode（均 403 rate limit）、https://hashnode.com/changelog（首页可读，单篇 2026-06-22 等部分内容未在详情页渲染，已改用索引页与 2026-02-24 条目核实）。

### 4-6. Substack / Medium / Bear Blog
以下条目在 2026-09-11 未能通过官方来源核实，逐条列出失败 URL：

1. Substack 后端技术栈（语言、数据库）：官方页面未披露；尝试 https://substack.com/about 、https://on.substack.com/ ，均无技术栈信息。
2. Substack LaTeX 的渲染引擎（KaTeX / MathJax）、行内公式、$ 转义、是否需要付费档：官方文章只描述块级插入；尝试 https://support.substack.com/hc/en-us/articles/12291042958996-How-do-I-add-equations-to-my-Substack-post 。
3. Substack 官方定价页不存在：https://substack.com/pricing 返回 HTTP 404，https://substack.com/fees 返回 404；价格只能引自官方帮助中心与 about 页。
4. Substack 的 Stripe Billing fee 官方两处口径不一致（0.7% 与 0.5%）：https://support.substack.com/hc/en-us/articles/360037607131-How-much-does-Substack-cost 与 https://support.substack.com/hc/en-us/articles/18687769631252-How-can-readers-pay-for-a-subscription-on-my-Substack-publication 。
5. Medium 官方站点全部被拦截（HTTP 403 Cloudflare），因此官方定价页、用户规模、主题市场、示例站 URL 均未核实。失败 URL：https://medium.com/plans 、https://medium.com/about 、https://medium.com/membership 、https://medium.com/creators 、https://about.medium.com/ 、https://blog.medium.com/ 、https://policy.medium.com/ 、https://medium.design/ 。Medium 价格改引自官方帮助中心 https://help.medium.com/hc/en-us/articles/115004545567-Become-a-Medium-Member 。
6. Medium 是否支持 Markdown（含未文档化的粘贴行为）：官方帮助中心 194 篇文章中检索 "Markdown" 零命中；尝试 https://help.medium.com/api/v2/help_center/en-us/articles.json 与 https://help.medium.com/hc/en-us/articles/215194537-Using-the-story-editor 。
7. Medium 的社区规模数字：未核实（所有可能含该数字的官方页面均 403，见第 5 条）。
8. Medium 视觉风格的具体主题名与示例站 URL：未核实（medium.com 域名 403）。
9. Bear Blog 的具体价格与各档权益边界：https://bearblog.dev/pricing/ 返回 404，https://bearblog.dev/upgrade/ 返回 404，https://bearblog.dev/static/pricing 返回 404，https://bearblog.dev/accounts/signup/ 与 https://bearblog.dev/accounts/upgrade/ 返回 403（Cloudflare）；文档给出的 Lifetime 结账链接 https://bear.lemonsqueezy.com/checkout/buy/2f0a4d87-10d9-4a74-b241-ba2c4d6b821b 返回 404，加 ?embed=1 的页面由 JS 渲染、服务端 HTML 无价格。
10. Bear Blog 注册到发布第一篇的实测流程：https://bearblog.dev/accounts/signup/ 返回 403，只能引用官网 "Seconds to sign up" 的说法。
11. Bear Blog 社区规模（用户数/博客数）：https://bearblog.dev/discover/ 返回 403。
12. Bear Blog LaTeX 是否属于付费档位：官方文档未提及收费；https://docs.bearblog.dev/mathematical-notation/ 未涉及定价。
13. Bear Blog 免费档的具体额度（如可建博客数、自定义域名的付费要求）：官网首页与 docs 均未列出免费/付费边界。

### 7-9. Obsidian Publish / Notion 系 / micro.blog
1. Obsidian Publish 的用户数/站点数：官方未公布（尝试 <https://obsidian.md/about>、<https://obsidian.md/publish>，均无数字）。
2. Obsidian 仓库 star 数：`obsidianmd/obsidian-releases` 页面 HTML 本次未含 star 计数，`https://api.github.com/repos/obsidianmd/obsidian-releases` 返回 403 `API rate limit exceeded for 58.19.5.11`。
3. Obsidian Publish 是否存在官方「Publish 主题市场」、以及哪些社区主题在 Publish 上验证可用：官方只提供 community-css-themes.json 索引，无 Publish 专属列表。
4. Obsidian 数学公式中 `$` 的转义/货币符号冲突处理、行内公式的额外限制：<https://obsidian.md/help/advanced-syntax> 未说明。
5. Obsidian Publish 是否支持 RSS、评论、标签归档等博客要素：官方 Publish 文档未提供该能力（<https://obsidian.md/help/publish>、<https://obsidian.md/help/publish/limitations>），按「不支持」处理但未逐条核实。
6. Notion 官方用户数/工作区规模：<https://www.notion.com/about> 未给出任何数字。
7. Notion 月付与年付的具体单价差异：<https://www.notion.com/pricing> 页面文本只解析出 Plus $10、Business $20（展示为按年付折算），月付价未从页面确认；Notion AI 的「$10 per 1,000 monthly Notion credits」为 Agent 计费口径，未展开核实。
8. Notion 数学公式在「发布后的公开站点」上的渲染表现：<https://www.notion.com/help/math-equations> 只描述编辑器内的添加与编辑方式。
9. Notion 从 Markdown 批量导入的支持范围：只抓取了导出侧文档 <https://www.notion.com/help/export-your-content>，未抓取 <https://www.notion.com/help/import-data-into-notion>。
10. Notion 官方站点是否有可公开引用的示例站 URL：<https://www.notion.com/product/sites> 只给出模板入口，未给具体站点清单。
11. NotionNext / Nobelium 的部署平台费用：<https://vercel.com/pricing> 抓取成功但未解析出明确金额，两个项目自身也没有定价页。
12. NotionNext 的数学公式官方文档章节：文档站未检索到 math/katex 条目，仅从源码 `components/NotionPage.js` 确认。
13. Nobelium 线上示例站 <https://nobelium.vercel.app/> 的数学公式实际渲染效果：未验证。
14. Nobelium 的 Markdown 扩展语法范围与官方支持清单：README 与 package.json 未提供。
15. micro.blog 当前用户数/博客数：<https://micro.blog/about/> 只给出 2017 年 Kickstarter 3000 名支持者。
16. micro.blog 免费计划的具体功能限制：<https://help.micro.blog/t/pricing/19> 与 <https://micro.blog/pricing> 都只提到「试用结束转免费计划」，未列免费档能力。
17. micro.blog GitHub 组织的完整仓库清单：<https://github.com/orgs/microdotblog/repositories> 只给出「122 repositories」计数，仓库列表为客户端渲染未能抓取；<https://api.github.com/orgs/microdotblog/repos> 返回 403 `API rate limit exceeded for 58.19.5.11`。
18. micro.blog 是否存在开源自托管服务端：仅确认 <https://github.com/microdotblog/microblog> 为 404，不能完全排除其他仓库。
19. micro.blog 数学支持的正式文档页：只找到论坛答复 <https://help.micro.blog/t/1269>，未找到 help.micro.blog 的正式数学条目；<https://help.micro.blog/search.json?q=mathjax> 与 `?q=latex` 只返回该主题。
20. micro.blog 「Meta tags」插件的官方文档页：仅在论坛答复中被点名，未找到其文档链接。

### 10-12. Halo / Typlog / WriteFreely
1. **Typlog 用户规模 / 站点数**：官方未公布。尝试 https://typlog.com/ 、https://typlog.com/pricing 、https://docs.typlog.com/ 均无数字。
2. **Typlog 2024–2026 年是否仍有更新**：Changelog 最新条目为 2023-03-15（https://typlog.com/changelog/ ），文档 Recent updates 最新为 Mar 27, 2023（https://docs.typlog.com/ ）；未能证明此后无更新，也未能找到更新记录。
3. **Typlog Podcast 档位价格**：定价页 Podcast 标签页内容由前端交互渲染，抓到的是 Blog 档位数字。尝试 https://typlog.com/pricing 。
4. **Typlog 数学公式的行内/转义细节与付费门槛**：官方文档只说明使用 MathJax、$...$ 与 $$...$$ / math 围栏；未说明美元符号转义、是否需要自挂 CDN、以及是否受档位限制。尝试 https://docs.typlog.com/en/article/advanced-markdown/ 、https://typlog.com/pricing 。
5. **Halo 官方论坛 bbs.halo.run 的帖子/用户规模**：页面由 JS 渲染，统计接口返回 403 Forbidden。尝试 https://bbs.halo.run/ 、https://bbs.halo.run/api/statistics 、https://bbs.halo.run/api/users 。
6. **Halo 历史 Release 列表与更早版本时间线**：https://api.github.com/repos/halo-dev/halo/releases 返回 403（API rate limit），仅核实到 latest = v2.26.1（https://api.github.com/repos/halo-dev/halo/releases/latest 抓取成功）。
7. **Halo 专业版/商城版的完整价格矩阵（月付、续费、买断）**：凌霞购买页价格由 JS 动态渲染，只从官方 halo-shop 页取到「¥540/年起」「¥1,500/年起」。尝试 https://www.lxware.cn/halo 。
8. **Halo KaTeX 插件在默认编辑器中对美元符号的转义方式**：README 未说明。尝试 https://raw.githubusercontent.com/halo-sigs/plugin-katex/main/README.md 、https://www.halo.run/store/apps/app-ISCsX 。
9. **Halo 是否存在官方或官方认证的托管/SaaS 服务**：未找到任何此类页面；文档只提供自托管部署与云市场镜像，付费版是自托管许可证。依据 https://docs.halo.run/guide/prepare.md 、https://www.halo.run/halo-shop 、https://www.lxware.cn/halo 。（倾向结论是「没有」，但无法核实「绝对没有」。）
10. **Write.as 免费档旁边 Closed for now 的确切含义**：是否表示暂停免费注册，还是仅暂停某一入口。尝试 https://write.as/pricing ，页面无进一步说明。
11. **WriteFreely 自托管版的数学公式/MathJax 支持**：Writer Guide 与 Admin Config 全文未检出 math/MathJax/KaTeX。尝试 https://writefreely.org/docs/main/writer 、https://writefreely.org/docs/main/writer/writing 、https://writefreely.org/docs/main/admin/config 。
12. **Write.as 数学公式的写法与转义规则**：官方定价页仅列出 Markdown and MathJax support，未找到对应的帮助文档页。尝试 https://write.as/pricing 、https://howto.write.as/ 、https://write.as/guide 。
13. **WriteFreely 第三方托管（Cloud68、Spacebear）的具体价格**：官方托管页仅给出链接，未列数字。尝试 https://writefreely.org/services/hosting 。
14. **WriteFreely 的 star 数与最近 commit 未在本轮再次调用 GitHub API 交叉验证**：https://api.github.com/repos/writefreely/writefreely 未抓取（本机 IP 已被 rate limit）；数值依据工作区 docs/research-notes/github-metrics.json（访问日期 2026-09-11）与 https://github.com/writefreely/writefreely 。

