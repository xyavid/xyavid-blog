// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { BASE_PATH, SITE_URL } from "./site.config.mjs";

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  trailingSlash: "always",
  output: "static",
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      // 明暗两套代码主题，靠 CSS 变量切换，不需要两遍高亮
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
      wrap: false,
    },
  },
  build: {
    format: "directory",
  },
});
