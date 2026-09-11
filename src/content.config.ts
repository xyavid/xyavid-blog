import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { CATEGORIES, PROJECT_STATUS } from "./config";

/**
 * 文章集合。字段写错或漏填会在构建时直接报错，不会等到线上才发现。
 * 新增文章：在 src/content/posts/ 下新建 .md 文件即可，其余页面自动更新。
 */
const posts = defineCollection({
  // 文章文件平铺在目录里（不再分子目录），文件名即 URL 中的 slug
  loader: glob({ base: "./src/content/posts", pattern: "*.md" }),
  schema: z.object({
    /** 文章标题 */
    title: z.string().min(1).max(120),
    /** 列表页与 SEO 用的摘要，建议 40-120 字 */
    description: z.string().min(1).max(300),
    /** 发布日期 */
    pubDate: z.coerce.date(),
    /** 最后修改日期，可选，会在文章页显示「修订于」 */
    updatedDate: z.coerce.date().optional(),
    /** 分类：只能从 src/config.ts 的 CATEGORIES 里选 */
    category: z.enum(CATEGORIES),
    /** 标签：自由填写，建议每篇 1-4 个 */
    tags: z.array(z.string()).default([]),
    /** true 时只在本地开发可见，不进入构建产物 */
    draft: z.boolean().default(false),
    /** true 时可出现在首页「精选」位 */
    featured: z.boolean().default(false),
  }),
});

/**
 * 项目集合。一个项目一个文件，正文部分写详细介绍。
 */
const projects = defineCollection({
  // 同理，项目文件平铺，文件名即 slug
  loader: glob({ base: "./src/content/projects", pattern: "*.md" }),
  schema: z.object({
    /** 项目名 */
    name: z.string().min(1).max(80),
    /** 一句话介绍，显示在卡片上 */
    tagline: z.string().min(1).max(160),
    /** 列表页与 SEO 用的描述 */
    description: z.string().min(1).max(300),
    /** 技术栈标签 */
    stack: z.array(z.string()).default([]),
    /** 状态：active 进行中 / completed 已完成 / archived 已归档 */
    status: z.enum(Object.keys(PROJECT_STATUS) as [string, ...string[]]),
    /** 开始时间，格式 "2026-03" */
    startDate: z.string().regex(/^\d{4}(-\d{2})?$/, "格式应为 2026 或 2026-03"),
    /** 结束时间，可选，格式同上 */
    endDate: z.string().regex(/^\d{4}(-\d{2})?$/, "格式应为 2026 或 2026-03").optional(),
    /** 外部链接，只需要填用得到的那个 */
    links: z
      .object({
        repo: z.string().optional(),
        demo: z.string().optional(),
      })
      .default({}),
    /** 封面图路径（放 public/ 下，如 "/images/projects/orbit.png"）；不填则显示占位块 */
    cover: z.string().optional(),
    /** true 时出现在首页精选 */
    featured: z.boolean().default(false),
    /** 项目列表排序，数字小的在前 */
    order: z.number().default(99),
  }),
});

/**
 * 「关于我」页面。正文写在 src/content/about.md 里，改内容不需要动代码。
 */
const about = defineCollection({
  // file() 装载器不认 Markdown 语法，所以这里仍用 glob 精确匹配单个文件
  loader: glob({ base: "./src/content", pattern: "about.md" }),
  schema: z.object({
    title: z.string().default("关于我"),
    description: z.string().default("关于这个站点和写它的人。"),
    updatedDate: z.coerce.date().optional(),
  }),
});

export const collections = { posts, projects, about };
