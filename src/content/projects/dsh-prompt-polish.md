---
title: "dsh-prompt-polish"
published: 2026-09-01
draft: false
order: 3
description: "DeepSeek Harness 输入框里的一键提示词润色按钮，草稿直接改写成可执行的提示词。"
image: ""
tags:
  - "TypeScript"
  - "React"
  - "DSH 插件"
  - "active"
link:
  - label: "源码仓库"
    icon: "fa7-brands:github"
    value: "https://github.com/xyavid/dsh-prompt-polish"
status: "developing"
---
DeepSeek Harness 输入框里的一键提示词润色按钮，草稿直接改写成可执行的提示词。

给 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的 Web 界面写的插件。输入框里原本只是一句随手记的草稿，点一下模型名旁边的小星星，就变成一条结构清楚、能直接交给 agent 执行的提示词。

## 为什么做这个

能让编码 agent 干活的 prompt，通常要说清四件事：做什么、在哪做、有什么约束、怎么算做完了。随手写的草稿一般都没有这些。这个插件加的就是「润色」这一步：把草稿交给一次低温度的重写，再写回输入框，原文始终留一次撤销的距离。

它只让表达更清楚，不会替你加需求。

## 交互

一个按钮三种状态：

- 空闲时是星星，点了开始润色
- 运行中是转圈，再点取消
- 完成后变成撤销箭头，点了还原原文

没有多余的面板、进度条和弹窗，按钮就待在模型名左边，跟着那一行走。

## 几个细节

**用你正在用的模型。** 调用走 harness 自己的 `ctx.llm`，也就是当前会话的路由；没配就回落到全局默认模型。不需要再单独配一个模型或者密钥。

**密钥不落到浏览器。** 凭据从 harness 的 credential store 取，只在服务端使用。

**草稿安全。** 空草稿、只有附件、超长、以及带命令或引用 chip 的草稿会直接拒绝；调用失败也不会改动你已经写好的内容。

**撤销有两种。** 原生 `Ctrl+Z` 和按钮上的撤销箭头都能用。

## 现状

已经发布到 npm：`@xyavid/dsh-prompt-polish`，MIT 协议，CI 跑在 GitHub Actions 上。
