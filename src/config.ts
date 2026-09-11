/**
 * 站点全局配置：日常需要改的东西基本都在这个文件里。
 * 改完保存，开发服务器会自动刷新。
 */

export const SITE = {
  /** 站点名，显示在浏览器标签与页头 */
  title: "xyavid",
  /** 一句话副标题，显示在首页与页头下方 */
  description: "写点想法，放点东西。",
  /** 站点完整描述，用于 SEO 与 RSS */
  longDescription:
    "xyavid 的个人博客：记录技术实践与日常思考，顺带展示我在做的项目。",
  /** 作者名，出现在文章页与 RSS */
  author: "xyavid",
  lang: "zh-CN",
  /**
   * 主题强调色相（0-360）。整站只有这一个强调色，其余都是中性灰阶。
   * 250≈蓝紫，200≈青蓝，160≈青绿，30≈暖橙，350≈玫红。
   */
  themeHue: 250,
} as const;

/** 顶部导航。顺序即显示顺序。 */
export const NAV = [
  { label: "首页", href: "/" },
  { label: "文章", href: "/posts/" },
  { label: "项目", href: "/projects/" },
  { label: "归档", href: "/archive/" },
  { label: "关于", href: "/about/" },
] as const;

/**
 * 社交与联系方式，显示在页脚与「关于」页。
 * 不需要的直接删掉整行；想加就照着格式补一条（icon 可选值见 src/components/Icon.astro）。
 */
export const SOCIAL = [
  { label: "GitHub", href: "https://github.com/yourname", icon: "github" },
  { label: "邮箱", href: "mailto:you@example.com", icon: "mail" },
  { label: "RSS", href: "/rss.xml", icon: "rss" },
] as const;

/**
 * 固定分类。文章 frontmatter 里的 category 必须从这里选，写错会在构建时直接报错。
 * 增删分类只需改这个数组，分类页面会自动生成。
 */
export const CATEGORIES = ["技术", "随笔", "笔记"] as const;
export type Category = (typeof CATEGORIES)[number];

/** 项目状态：值写在 frontmatter 里，显示文案在这里改。 */
export const PROJECT_STATUS = {
  active: { label: "进行中", tone: "active" },
  completed: { label: "已完成", tone: "done" },
  archived: { label: "已归档", tone: "muted" },
} as const;
export type ProjectStatus = keyof typeof PROJECT_STATUS;

/** 首页各板块展示条数 */
export const HOME_LIMITS = {
  featuredProjects: 3,
  recentPosts: 5,
} as const;

/** 文章列表每页条数 */
export const POSTS_PER_PAGE = 8;
