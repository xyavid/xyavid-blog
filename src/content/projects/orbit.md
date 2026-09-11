---
name: Orbit
tagline: 终端里的轻量任务管理工具，用纯文本存数据。
description: 一个命令行任务管理工具，数据以纯文本保存，支持项目分组、截止日期与每日回顾。
stack:
  - TypeScript
  - Node.js
  - SQLite
status: active
startDate: 2026-03
links:
  repo: https://github.com/yourname/orbit
  demo: https://example.com/orbit
featured: true
order: 1
---

> 这是占位示例项目，请替换为你的真实项目。

Orbit 是我给自己写的一个任务管理工具。市面上的同类应用大多要求登录、同步、订阅，而我需要的只是「今天该做什么」这一个问题的答案。

## 设计取舍

**纯文本优先。** 所有任务存在一个 Markdown 文件里，格式简单到用手写也不费劲。这样即使用户哪天不用这个工具了，数据依然可读。

**不做同步。** 同步是最容易把简单问题复杂化的功能。需要多设备就用 Git，或者干脆用网盘同步那个文本文件。

**命令要短。** 高频操作的命令控制在一到两个字母，低频操作才用完整单词。

## 现在的状态

日常已经在用了，主要功能稳定。接下来想加的是每周回顾的汇总输出，以及一个把任务导出为周报的模板。
