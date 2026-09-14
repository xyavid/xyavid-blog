/**
 * 构建产物链接自检：把 dist/ 里所有 HTML 的站内链接逐个对照文件系统，
 * 报出指向不存在页面的链接。交付前用来确认「没有死链」。
 *
 * 用法：BASE_PATH=/xyavid-blog pnpm check:links
 * 注意 BASE_PATH 要和构建时一致，否则前缀剥不掉，所有链接都会被误判成死链。
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join } from "node:path";

const DIST = "dist";

/** 递归列出目录下所有文件 */
function walk(dir) {
	const out = [];
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) out.push(...walk(full));
		else out.push(full);
	}
	return out;
}

if (!existsSync(DIST)) {
	console.error("找不到 dist/，请先执行 pnpm build");
	process.exit(1);
}

const base = process.env.BASE_PATH ?? "/xyavid-blog";
const prefix = base.endsWith("/") ? base.slice(0, -1) : base;

const htmlFiles = walk(DIST).filter((file) => extname(file) === ".html");
const missing = [];
let checked = 0;

for (const file of htmlFiles) {
	const html = readFileSync(file, "utf8");
	const attrs = html.matchAll(/(?:href|src)="([^"]+)"/g);

	for (const [, raw] of attrs) {
		if (!raw.startsWith("/") || raw.startsWith("//")) continue; // 外链、锚点、mailto 跳过
		let path = raw.split("#")[0].split("?")[0];
		if (prefix && path.startsWith(prefix)) path = path.slice(prefix.length);
		if (path === "") path = "/";

		const decoded = decodeURIComponent(path);
		const candidates = [join(DIST, decoded)];
		if (path.endsWith("/")) candidates.push(join(DIST, decoded, "index.html"));
		else candidates.push(`${join(DIST, decoded)}.html`);

		checked += 1;
		if (!candidates.some((candidate) => existsSync(candidate))) {
			missing.push(`${file} → ${raw}`);
		}
	}
}

if (missing.length > 0) {
	console.error(`发现 ${missing.length} 条死链：`);
	for (const item of missing.slice(0, 40)) console.error(`  ${item}`);
	process.exit(1);
}

console.log(`链接自检通过：${htmlFiles.length} 个页面，${checked} 条站内链接全部可达。`);
