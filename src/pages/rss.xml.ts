import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { SITE } from "../config";
import { getPublishedPosts } from "../utils/content";
import { withBase } from "../utils/url";

export const GET: APIRoute = async (context) => {
  const posts = await getPublishedPosts();
  const site = context.site ?? new URL("https://example.com");

  return rss({
    title: SITE.title,
    description: SITE.longDescription,
    site,
    trailingSlash: true,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      // 带上 base 前缀，否则部署到子路径后 RSS 里的链接会 404
      link: withBase(`posts/${post.id}/`),
      categories: [post.data.category, ...post.data.tags],
      author: SITE.author,
    })),
    customData: "<language>zh-cn</language>",
  });
};
