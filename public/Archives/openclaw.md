---
title: "OpenClaw 部署"
date: "2026-07-24 21:00:00"
description: "OpenClaw + 微信插件 + DeepSeek V4-Pro 完整部署指南，从零到智能体上线全流程"
cover: "https://docs.openclaw.ai/assets/openclaw-hero-dark.png"
tags: ["OpenClaw", "微信", "DeepSeek", "教程", "部署"]
---

## OpenClaw 部署

本文记录 OpenClaw + 微信插件 + DeepSeek V4-Pro 的完整部署流程。

---

### 一、环境准备

1. 注册智谱大模型并创建 API Key：https://www.bigmodel.cn/invite?icode=suc9PAFUKWIi6r8OaMSnxEjPr3uHog9F4g5tjuOUqno%3D
2. `sudo apt update`
3. `sudo apt upgrade -y`
4. `sudo apt install -y git`
5. `curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -`
6. `sudo apt install -y nodejs`
7. 测试 node.js 是否成功（版本要求 22+）：`node -v`
8. 换 npm 源：`npm config set registry https://registry.npmmirror.com/`
9. `git config --global url."https://github.com/".insteadOf "ssh://git@github.com/"`
10. `NODE_LLAMA_CPP_SKIP_DOWNLOAD=true npm install -g openclaw@latest --ignore-scripts`
11. 安装完成后使用 `openclaw -v` 测试是否安装成功，如果看到版本号就说明成功了
12. 配置并启动 OpenClaw：`openclaw onboard`

---

### 二、DeepSeek V4-Pro 模型配置

#### 1. 切换 / 创建智能体 crestodian 配置目录

```shell
mkdir -p ~/.openclaw/workspace/agents/crestodian
```

#### 2. 编辑智能体配置，指定模型

```shell
vim ~/.openclaw/workspace/agents/crestodian/config.json
```

写入内容（按 `i` 进入插入模式，粘贴后 `Esc` → `:wq` 保存退出）：

```json
{
  "model.primary": "deepseek/deepseek-v4-pro",
  "thinking": "high",
}
```

#### 3. 确认全局 DeepSeek API 密钥配置

```shell
vim ~/.openclaw/config.json
```

确认包含以下片段（`apiKey` 替换为你在第一步申请的真实密钥；若 `openclaw onboard` 向导已写入，这里二次核对即可）：

```json
{
  "providers": {
    "deepseek": {
      "apiKey": "sk-xxxxxxxxxxxxxxxxxxxxxxxx",
      "baseUrl": "https://api.deepseek.com/v1"
    }
  }
}
```

#### 4. 重启网关加载智能体配置

```shell
systemctl --user restart openclaw-gateway
```

#### 5. 验证配置是否被正确读取

```shell
journalctl --user -u openclaw-gateway -f
```

---



### 三、微信通道部署

#### 1. 安装微信 ClawBot 插件

```shell
openclaw plugins install "@tencent-weixin/openclaw-weixin"
```

#### 2. 重启网关载入微信插件

```shell
systemctl --user restart openclaw-gateway
```

#### 3. 拉起微信扫码登录

```shell
openclaw channels login --channel openclaw-weixin
```
