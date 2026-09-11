/**
 * 部署参数。只有这个文件需要在部署前改。
 *
 * 两种常见情况：
 *   1. 用户主页仓库（仓库名形如 你的用户名.github.io）
 *        SITE_URL = "https://你的用户名.github.io"
 *        BASE_PATH = "/"
 *   2. 普通仓库（仓库名随便，比如 blog）
 *        SITE_URL = "https://你的用户名.github.io"
 *        BASE_PATH = "/blog"                ← 仓库名，前后都要有斜杠补齐
 *
 * 自定义域名时，SITE_URL 改成域名，BASE_PATH 改回 "/"。
 *
 * 用 GitHub Actions 部署时不需要改这里：工作流会根据仓库名自动注入下面两个环境变量。
 */

export const SITE_URL = process.env.SITE_URL ?? "https://yourname.github.io";
export const BASE_PATH = process.env.BASE_PATH ?? "/";
