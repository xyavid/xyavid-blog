import { getCollection } from "astro:content";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import { siteConfig } from "@/config";
import {
	dynamicSearchText,
	dynamicSlug,
	sortDynamics,
} from "@/utils/dynamic-utils";

const markdownImagePattern = /!\[([^\]]*)\]\((\S+?)(?:\s+["']([^"']*)["'])?\)/g;

/**
 * 动态列表 JSON。本站没有启用「动态」模块，
 * 所以只要页面开关是关的（或集合为空）就直接返回空数组，
 * 不去调用 markdown 处理器，避免构建时刷出无意义的告警。
 */
export async function GET(): Promise<Response> {
	const empty = () =>
		new Response("[]", {
			headers: { "Content-Type": "application/json; charset=utf-8" },
		});

	if (!siteConfig.pages.dynamic) return empty();

	const dynamics = sortDynamics(await getCollection("dynamic"));
	if (dynamics.length === 0) return empty();

	const processor = await createMarkdownProcessor();
	const data = await Promise.all(
		dynamics.map(async (entry) => {
			const images: Array<{ alt: string; src: string; title?: string }> = [];
			const markdown = (entry.body || "").replace(
				markdownImagePattern,
				(_match, alt: string, src: string, title?: string) => {
					images.push({ alt, src, ...(title ? { title } : {}) });
					return "";
				},
			);
			const rendered = await processor.render(markdown);

			return {
				id: dynamicSlug(entry.id),
				published: entry.data.published.getTime(),
				html: rendered.code,
				images,
				searchText: dynamicSearchText(entry),
				pinned: entry.data.pinned || false,
				location: entry.data.location.trim(),
			};
		}),
	);

	return new Response(JSON.stringify(data), {
		headers: {
			"Content-Type": "application/json; charset=utf-8",
		},
	});
}
