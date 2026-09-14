---
title: 草稿示例：还没写完的一篇
description: "这是一个 draft 为 true 的示例文章，用来验证草稿不会出现在线上。"
published: 2026-09-12
category: 笔记
tags:
  - 示例
draft: true
---

这篇文章的 frontmatter 里写了 draft: true。

构建时它会被排除，不出现在文章列表、归档、分类、标签和 RSS 里，但 `npm run dev` 时可以看到，方便边写边预览。

写好之后把 draft 改成 false，或者整行删掉即可发布。
