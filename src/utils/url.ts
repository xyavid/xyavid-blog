/**
 * 统一处理站内链接。
 * Astro 不会自动给 <a href> 加 base 前缀，所以站内链接一律走这里，
 * 这样部署到子路径（例如 GitHub Pages 的 /blog）时不会全站 404。
 */

const BASE = import.meta.env.BASE_URL;

/** 把站内路径拼上 base 前缀：withBase("posts/") → "/blog/posts/" */
export function withBase(path: string): string {
  if (/^(https?:)?\/\//.test(path) || path.startsWith("mailto:") || path.startsWith("#")) {
    return path;
  }
  const clean = path.replace(/^\/+/, "");
  const prefix = BASE.endsWith("/") ? BASE : `${BASE}/`;
  return `${prefix}${clean}`;
}
