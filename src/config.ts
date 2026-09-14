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
   * 个人卡片上的头像。放 public/ 下填 "/images/avatar.png"；
   * 留空则用作者名首字生成一个字母头像，不会出现裂图。
   */
  avatar: "",
  /** 站点建立时间（"2026-03" 或 "2026-03-15"），侧栏统计里用来算「运行了多久」 */
  startDate: "2026-03",
} as const;

/**
 * 主题色。整站只有一个强调色变量 --hue，改一个数字即可换色。
 * 250≈蓝紫，200≈青蓝，165≈青绿，30≈暖橙，350≈玫红。
 */
export const THEME = {
  /** 默认色相，0-360 */
  hue: 250,
  /** 是否允许访客用页头滑杆自己调色（只存在访客本地，不影响其他人） */
  allowPicker: true,
} as const;

/** 侧栏。首页、文章列表、归档、分类、标签、项目等列表页共用。 */
export const SIDEBAR = {
  /** 关掉后全站退回单栏，正文宽度自动放宽 */
  enable: true,
  /**
   * true 侧栏在左，false 在右。
   * 文章详情页不受这里影响：那里固定是「正文 + 右侧目录」。
   */
  position: "left" as "left" | "right",
  /**
   * 侧栏里显示哪些卡片、按什么顺序。删掉一项即不显示。
   * profile 个人卡片 / stats 站内统计 / categories 分类 / tags 标签
   */
  widgets: ["profile", "stats", "categories", "tags"] as const,
  /** 标签云最多显示几个，0 表示不限 */
  tagLimit: 20,
} as const;

/** 零散的界面开关 */
export const UI = {
  /** 滚到一定距离后右下角出现「回到顶部」 */
  backToTop: true,
  /** 文章列表顶部显示分类快捷条 */
  categoryBar: true,
  /**
   * 归档页每年是否可折叠。true 时只展开最新一年。
   * 用原生 <details> 实现，不需要 JavaScript。
   */
  foldArchiveYears: true,
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
  { label: "GitHub", href: "https://github.com/xyavid", icon: "github" },
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
