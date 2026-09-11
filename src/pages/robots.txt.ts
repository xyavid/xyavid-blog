import type { APIRoute } from "astro";
import { withBase } from "../utils/url";

export const GET: APIRoute = ({ site }) => {
  const lines = ["User-agent: *", "Allow: /", ""];
  if (site) {
    lines.push(`Sitemap: ${new URL(withBase("sitemap-index.xml"), site).href}`);
  }
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
