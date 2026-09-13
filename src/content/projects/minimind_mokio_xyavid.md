---
name: minimind_mokio_xyavid
tagline: 从零手写并预训练一个小型语言模型，把 Transformer 的每个参数弄明白。
description: 跟着教程从零实现的 MiniMind 风格小模型：自定义 Transformer 配置（GQA、RoPE、可选 MoE）、语料处理与预训练脚本，用 PyTorch 跑通完整的预训练流程。
stack:
  - Python
  - PyTorch
  - Transformers
  - uv
status: active
startDate: 2026-08
links:
  repo: https://github.com/xyavid/minimind_mokio_xyavid
featured: true
order: 2
---

跟着教程从零实现的小型语言模型。目的不是刷指标，而是把「预训练到底发生了什么」这件事弄明白。

## 模型

`Model/Model.py` 里定义了 `MokioMindConfig`，直接继承 Hugging Face 的 `PretrainedConfig`，所以配置能按 transformers 那一套复用。默认规模很小：

- hidden size 512，8 层，8 个注意力头
- 用了 GQA，KV 头只留 2 个
- 词表 6400，位置编码用 RoPE（`rope_theta` 取 1e6），最长 32768
- RMSNorm + SiLU，flash attention 可开关
- MoE 是可选项，默认关闭；打开后 4 个路由专家、每个 token 激活 2 个，另有 1 个共享专家

## 训练与数据

预训练脚本是 `Trainer/train_pretrain.py`，工具函数单独放在 `train_utlis.py`；`dataset/dataset.py` 负责把语料切分、拼成训练样本。项目用 uv 管理依赖（`pyproject.toml` + `uv.lock`），要求 Python ≥ 3.14，主要依赖 torch、transformers、numpy 和 pandas。

## 现状

模型定义和预训练管线已经跑通，剩下的细节还在边看教程边补。README 暂时没写。
