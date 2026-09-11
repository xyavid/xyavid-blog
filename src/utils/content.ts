import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"posts">;
export type Project = CollectionEntry<"projects">;

/** 取全部已发布文章，按发布时间倒序。draft 的文章在构建时就被排除。 */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** 取全部项目，按 order 升序，order 相同则按开始时间倒序。 */
export async function getSortedProjects(): Promise<Project[]> {
  const projects = await getCollection("projects");
  return projects.sort((a, b) => {
    if (a.data.order !== b.data.order) return a.data.order - b.data.order;
    return b.data.startDate.localeCompare(a.data.startDate);
  });
}

/** 首页精选项目：优先 featured，不足时用其余项目补齐。 */
export function pickFeaturedProjects(projects: Project[], limit: number): Project[] {
  const featured = projects.filter((p) => p.data.featured);
  const rest = projects.filter((p) => !p.data.featured);
  return [...featured, ...rest].slice(0, limit);
}

export type MonthGroup = { month: number; posts: Post[] };
export type YearGroup = { year: number; months: MonthGroup[]; count: number };

/** 归档用：按年 → 月分组。输入需已按时间倒序。 */
export function groupByYearMonth(posts: Post[]): YearGroup[] {
  const years = new Map<number, Map<number, Post[]>>();
  for (const post of posts) {
    const year = post.data.pubDate.getUTCFullYear();
    const month = post.data.pubDate.getUTCMonth() + 1;
    if (!years.has(year)) years.set(year, new Map());
    const months = years.get(year)!;
    if (!months.has(month)) months.set(month, []);
    months.get(month)!.push(post);
  }
  return [...years.entries()].map(([year, months]) => {
    const monthGroups = [...months.entries()].map(([month, list]) => ({ month, posts: list }));
    return { year, months: monthGroups, count: monthGroups.reduce((n, m) => n + m.posts.length, 0) };
  });
}

/** 统计每个分类的文章数，按 config.ts 里 CATEGORIES 的顺序输出。 */
export function countByCategory(posts: Post[], order: readonly string[]) {
  const counts = new Map<string, number>();
  for (const post of posts) {
    const key = post.data.category;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return order.map((category) => ({ category, count: counts.get(category) ?? 0 }));
}

/** 统计标签，按出现次数倒序，次数相同按名称排序。 */
export function countByTag(posts: Post[]): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, "zh-CN"));
}

/**
 * 估算阅读时长。中文按每分钟 400 字，英文按每分钟 200 词，取两者之和。
 * 这是粗略估计，够用即可。
 */
export function readingMinutes(body: string | undefined): number {
  if (!body) return 1;
  const text = body.replace(/```[\s\S]*?```/g, " ");
  const cjk = (text.match(/[\u4e00-\u9fff]/g) ?? []).length;
  const words = (text.replace(/[\u4e00-\u9fff]/g, " ").match(/[A-Za-z0-9']+/g) ?? []).length;
  return Math.max(1, Math.round(cjk / 400 + words / 200));
}

/** 统一日期格式：2026 年 9 月 12 日 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/** 紧凑日期：2026-09-12，用于归档与卡片 */
export function formatDateISO(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  }).format(date);
}

/** 年月：2026-03 → 2026 年 3 月 */
export function formatYearMonth(value: string): string {
  const [year, month] = value.split("-");
  return month ? `${year} 年 ${Number(month)} 月` : `${year} 年`;
}
