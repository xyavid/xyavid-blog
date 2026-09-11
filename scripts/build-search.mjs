/**
 * 构建后运行 Pagefind，为 dist/ 生成站内搜索索引。
 */
import { spawnSync } from "node:child_process";

const result = spawnSync("pagefind", ["--site", "dist"], {
  stdio: "inherit",
  // Windows 上 pagefind 是可执行文件，交给 shell 解析更稳
  shell: process.platform === "win32",
});

if (result.error) {
  console.error("Pagefind 启动失败：", result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
