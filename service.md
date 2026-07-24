# 服务器部署与运维指南

> 服务器地址: 47.95.204.9  
> 站点根目录: `/web/blog/`  
> 访问地址: http://47.95.204.9/blog/

---

## 架构说明

```
┌─────────────────────────────────────────────────────┐
│                    你的电脑 (本地开发)                │
│                                                     │
│  F:\Project\vue-blog\                                │
│    ├── public/Archives/    ← 本地测试文章             │
│    ├── src/                ← Vue 源代码              │
│    ├── scripts/            ← 同步/监听脚本            │
│    └── dist/               ← npm run build 产物       │
│                                                     │
│  npm run dev   →   http://localhost:5173/blog/       │
└──────────────┬──────────────────────────────────────┘
               │ scp 上传 dist/
               ▼
┌─────────────────────────────────────────────────────┐
│              阿里云服务器 (生产环境)                   │
│                                                     │
│  /web/blog/                                         │
│    ├── index.html           ← 静态入口               │
│    ├── assets/              ← JS/CSS 资源            │
│    ├── Archives/            ← 文章 (.md + config.json)│
│    │   ├── 文章1.md                                  │
│    │   ├── 文章2.md                                  │
│    │   └── config.json     ← 文章清单（关键！）       │
│    ├── scripts/                                      │
│    │   └── watch-archives-server.cjs  ← PM2 监听脚本  │
│    └── ...其他静态文件...                             │
│                                                     │
│  PM2 进程: watch-archives  (监听 Archives/ 变化)      │
│   ↓                                                  │
│  检测到 .md 文件变化 → 自动更新 config.json            │
│   ↓                                                  │
│  浏览器刷新 → 读取 config.json → 显示最新文章          │
└─────────────────────────────────────────────────────┘
```

---

## 核心问题：为什么上传 .md 文件后网站不更新？

项目使用 **纯静态站点**（Nginx 托管），没有后端进程运行。文章的展示流程是：

1. 前端 JS 从 `Archives/config.json` 读取文件列表
2. 然后逐个请求对应的 `.md` 文件
3. 解析 Markdown 渲染为页面

**问题**：上传 `.md` 文件后，`config.json` 不会自动更新。前端不知道新文件存在，所以不显示。

**解决**：在服务器上用 PM2 跑一个监听脚本，检测到 `.md` 文件变化自动更新 `config.json`。

---

## 安装记录

### 1. 安装 Node.js

```bash
apt install nodejs
node -v   # v20.20.2
```

### 2. 安装 PM2（进程管理）

```bash
npm install -g pm2
pm2 -v
```

---

## 服务器监听脚本

位置：`/web/blog/scripts/watch-archives-server.cjs`

```javascript
const fs = require('fs');
const path = require('path');
const ARCHIVES_DIR = '/web/blog/Archives';
const CONFIG_PATH = path.join(ARCHIVES_DIR, 'config.json');

function sync() {
  try {
    const files = fs.readdirSync(ARCHIVES_DIR)
      .filter(f => f.endsWith('.md'))
      .sort((a, b) => a.localeCompare(b, 'zh-CN'));
    let existing = { files: [] };
    try { existing = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8')); } catch(e) {}
    const map = new Map();
    if (Array.isArray(existing.files)) existing.files.forEach(f => map.set(f.filename, f));
    const merged = files.map(f => map.has(f) ? map.get(f) : { filename: f, enabled: true, cover: '' });
    fs.writeFileSync(CONFIG_PATH, JSON.stringify({ files: merged }, null, 2) + '\n', 'utf-8');
    console.log('[watch] synced ' + merged.length + ' articles');
  } catch(e) { console.error('[watch] error:', e.message); }
}

sync();
fs.watch(ARCHIVES_DIR, (event, filename) => {
  if (filename && filename.endsWith('.md') && filename !== 'config.json') {
    console.log('[watch] ' + filename + ' changed (' + event + ')');
    setTimeout(sync, 300);
  }
});
```

**功能**：
- 启动时立即同步一次
- 监听 `Archives/` 目录的 `.md` 文件变化
- 新增/删除/重命名文件后 300ms 自动更新 `config.json`
- 保留已有的 `cover` 和 `enabled` 设置

---

## PM2 管理命令

```bash
# 启动监听
pm2 start /web/blog/scripts/watch-archives-server.cjs --name watch-archives

# 查看状态
pm2 status

# 查看日志
pm2 logs watch-archives

# 重启
pm2 restart watch-archives

# 停止
pm2 stop watch-archives

# 保存进程列表（重启后自动恢复）
pm2 save

# 设置开机自启
pm2 startup
```

---

## 日常操作流程

### 开发 → 部署完整流程

```bash
# 步骤 1：本地开发
cd /f/Project/vue-blog
npm run dev                  # 本地预览

# 步骤 2：构建
npm run build                # 生成 dist/

# 步骤 3：上传到服务器
scp -r /f/Project/vue-blog/dist/* root@47.95.204.9:/web/blog/

# 步骤 4：同步 config.json（如果服务器没有 PM2 监听）
ssh root@47.95.204.9
node /web/blog/scripts/sync-archives.cjs /web/blog/Archives
```

### 只在服务器上新增/删除文章

（推荐方式，无需本地构建上传）

```bash
# 1. 上传 .md 文件
scp /d/我的新文章.md root@47.95.204.9:/web/blog/Archives/

# 2. 如果有 PM2 监听：等待几秒，自动同步
# 如果没有 PM2 监听：手动运行
ssh root@47.95.204.9 "node /web/blog/scripts/sync-archives.cjs /web/blog/Archives"

# 3. 刷新网页即可
```

### 删除文章

```bash
# 删除 .md 文件
ssh root@47.95.204.9 "rm /web/blog/Archives/要删除的文章.md"

# PM2 监听会自动同步 config.json
# 网页刷新后该文章消失
```

---

## config.json 文件格式

```json
{
  "files": [
    {
      "filename": "文章1.md",
      "enabled": true,
      "cover": ""
    },
    {
      "filename": "文章2.md",
      "enabled": false,
      "cover": "https://example.com/cover.jpg"
    }
  ]
}
```

字段说明：

| 字段 | 类型 | 说明 |
|------|------|------|
| `filename` | string | .md 文件名（含扩展名） |
| `enabled` | boolean | `true` 显示 / `false` 隐藏 |
| `cover` | string | 封面图片 URL，为空则不显示封面 |

> 监听脚本会**自动保留**这些设置。新增文件默认 `enabled: true, cover: ""`。

---

## .md 文章格式

每篇文章需要 **frontmatter** 头部：

```markdown
---
title: "文章标题"
date: "2026-07-23 07:00:00"
description: "文章简介"
tags: ["标签1", "标签2"]
cover: "https://example.com/cover.jpg"   # 可选
---

这里是文章正文内容...
```

- 必须有 `title` 和 `date` 字段
- 缺失 `title` 会显示"无标题"
- 缺失 `date` 会显示"1970-01-01"

---

## 故障排查

### 网站只显示一篇文章

1. 检查 `config.json` 是否包含所有文章
   ```bash
   cat /web/blog/Archives/config.json
   ```

2. 检查文件名编码是否乱码
   ```bash
   # 如果看到乱码文件名，重新生成
   rm /web/blog/Archives/config.json
   node /web/blog/scripts/sync-archives.cjs /web/blog/Archives
   ```

3. 检查 PM2 是否在运行
   ```bash
   pm2 status
   ```

4. 浏览器硬刷新 `Ctrl + Shift + R`

### 本地开发 vs 线上显示不同

本地 `localhost:5173` 读取的是 `public/Archives/` 下的文件。  
线上 `47.95.204.9/blog` 读取的是 `/web/blog/Archives/` 下的文件。  
两者互不干扰，各自管理各自的文章目录。

### 上传 .md 文件后不自动更新

1. 确认 PM2 进程在运行：`pm2 status`
2. 查看日志：`pm2 logs watch-archives --lines 20`
3. 如果 PM2 挂了：`pm2 restart watch-archives`
4. 手动同步：`node /web/blog/scripts/sync-archives.cjs /web/blog/Archives`

---

## 辅助脚本

### sync-archives.cjs（一次性同步）

位置：`/web/blog/scripts/sync-archives.cjs`

用于手动同步，运行方式：
```bash
node /web/blog/scripts/sync-archives.cjs /web/blog/Archives
```

--- 

> 最后更新：2026-07-23
