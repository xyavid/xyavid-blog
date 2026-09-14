import type { SidebarLayoutConfig } from "../types/sidebarConfig";

/**
 * 侧边栏布局配置
 *
 * 左栏：个人资料（置顶）+ 分类、标签（吸顶跟随）
 * 右栏：站内统计、站点信息 + 文章目录（仅文章详情页）
 *
 * 与 Firefly 默认配置的差别：关掉了公告、音乐播放器、最新动态、日历、广告，
 * 本站暂时用不到这些模块；想加回来把对应条目的 enable 改成 true 即可。
 */
export const sidebarLayoutConfig: SidebarLayoutConfig = {
	// 是否启用侧边栏功能
	enable: true,

	// 侧边栏位置：
	// left: 仅显示左侧边栏
	// right: 仅显示右侧边栏
	// both: 双侧边栏，1280px以上同时显示左右，769-1279px根据tabletSidebar配置显示其中一侧
	position: "both",

	// 平板端(769-1279px)显示哪侧侧边栏，仅position为both时生效
	tabletSidebar: "left",

	// 文章详情页隐藏侧边栏：false 表示文章页也保留右栏目录
	hideSidebarOnPostPage: false,

	// 本页没有侧栏列时，内容栏占「侧栏 + 内容栏」总宽的比例（0–1），不设置或 ≥1 则铺满
	noSidebarContentWidth: 0.7,

	// 左侧边栏组件配置列表
	// 渲染顺序取决于数组顺序，但 position 为 top 的组件会优先于 sticky 的组件
	leftComponents: [
		{
			// 组件类型：用户资料组件
			type: "profile",
			enable: true,
			position: "top",
			showOnPostPage: true,
		},
		{
			// 组件类型：分类组件
			type: "categories",
			enable: true,
			position: "sticky",
			showOnPostPage: true,
			specificConfig: {
				// 折叠阈值：分类数量超过 5 个时自动折叠
				collapseThreshold: 5,
			},
		},
		{
			// 组件类型：标签组件
			type: "tags",
			enable: true,
			position: "sticky",
			showOnPostPage: true,
			specificConfig: {
				// 折叠阈值：标签数量超过 10 个时自动折叠
				collapseThreshold: 10,
			},
		},
	],

	// 右侧边栏组件配置列表
	rightComponents: [
		{
			// 组件类型：站点统计组件
			type: "stats",
			enable: true,
			position: "top",
			showOnPostPage: false,
		},
		{
			// 组件类型：站点信息组件
			type: "siteInfo",
			enable: true,
			position: "top",
			showOnPostPage: false,
			specificConfig: {
				siteInfo: {
					// 未能识别的构建平台回退显示文本，可自定义
					unknownBuildPlatform: "本地构建",
				},
			},
		},
		{
			// 组件类型：侧边栏目录组件（只在文章详情页显示）
			type: "sidebarToc",
			enable: true,
			position: "sticky",
			showOnPostPage: true,
			// 是否在非文章详情页隐藏
			hideOnNonPostPage: true,
		},
	],

	// 移动端底部组件配置列表
	// 这些组件只在移动端(<768px)显示在页面底部，独立于左右侧边栏配置
	mobileBottomComponents: [
		{
			type: "profile",
			enable: true,
			showOnPostPage: true,
		},
		{
			type: "categories",
			enable: true,
			showOnPostPage: true,
			specificConfig: {
				collapseThreshold: 5,
			},
		},
		{
			type: "tags",
			enable: true,
			showOnPostPage: true,
			specificConfig: {
				collapseThreshold: 10,
			},
		},
		{
			type: "stats",
			enable: true,
			showOnPostPage: true,
		},
		{
			type: "siteInfo",
			enable: true,
			showOnPostPage: true,
			specificConfig: {
				siteInfo: {
					unknownBuildPlatform: "本地构建",
				},
			},
		},
	],
};
