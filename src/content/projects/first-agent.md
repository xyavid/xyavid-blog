---
name: first-agent
tagline: 面向本地 workspace 的多智能体工程助手，规划、研究、实现、验证四个阶段接力推进。
description: MokioClaw 是一个多智能体工程助手，用 LangGraph 把任务拆成规划、研究、实现、验证几个阶段，可在终端或 TUI 中运行，文件与命令操作都被限制在显式 workspace 内。
stack:
  - Python
  - LangGraph
  - Textual
  - uv
status: active
startDate: 2026-08
links:
  repo: https://github.com/xyavid/first-agent
featured: true
order: 1
---

跟着 [木乔_mokio 的开源 agent 教程](https://github.com/Wood-Q/MokioAgent/tree/master) 一路写下来的多智能体工程助手，仓库里的项目名是 MokioClaw。

## 它做什么

一个请求进来先过意图路由：普通问答走轻量的 chat 路径，需要动 workspace 的才进入完整 workflow。完整流程由四个角色接力：

- `planner` 拆解任务，产出结构化 TODO 和验收标准
- `searchAgent` 负责网页研究，收集资料
- `codeAgent` 通过 workspace 工具读写文件、执行命令
- `verifier` 根据命令结果和只读检查判断任务是否通过

没通过就退回 planner 重来，直到通过或者耗尽尝试次数。

## 几个我在意的点

**边界要显式。** 文件读写、搜索和 Bash 命令都限制在指定 workspace 内，越界的操作直接拒绝。

**危险操作要人确认。** 装包、网络下载、起开发服务器这类命令默认弹审批，也可以切成自动批准或全部拒绝。

**状态比对话记录重要。** 计划、验证结果和压缩摘要都存成结构化状态，关键阶段写 checkpoint 和 trace，失败了能恢复现场接着查。

## 上下文管理

上下文由 session、工作计划、`NOTEPAD.md`、`HISTORY_SUMMARY.md` 和最近几次工具结果拼起来，快撑满时自动压缩。

## 现状

已经写到 Stage 6（MultiAgent + Context/Harness）。终端和 Textual TUI 都能跑，支持多轮 session、历史切换和检查点恢复。接口和工作流还在调整，属于早期版本。

环境要求 Python ≥ 3.12，依赖用 uv 管理。
