# CLAUDE.md — Chenyun Blog 项目指南

## 项目概览

基于 Vue 3 + Vite + Pinia + TypeScript 的个人博客系统。使用 Tailwind v4 样式、Vue Router 前端路由、Pinia 状态管理。

## 开发命令

```bash
npm run dev      # 本地开发（自动监听 archives/chatter/about 的 .md 变化）
npm run build    # 生产构建
npm run deploy   # 构建 + 复制到 public/
```

## 目录结构说明

- `src/pages/` — 页面组件（路由对应）
- `src/components/` — 可复用组件
- `src/stores/` — Pinia store（theme.ts / toast.ts）
- `src/assets/styles/` — 全局样式（main.css）
- `public/` — 静态资源 + 数据文件
  - `Archives/` — 归档文章（.md + config.json）
  - `Chatter/` — 说说（.md + config.json）
  - `About/` — 关于页面（.md + config.json）
  - `Friends/` — 友链数据（friends.json）
  - `Gallery/` — 照片墙数据（albums.json）
  - `Projects/` — 项目数据（.md + config.json）
- `scripts/` — 文件监听/同步脚本

## 数据源约定

**所有模块数据从 `public/` 下读取，不再使用 `src/data/` 下的静态 TS 文件。**

### .md 类型（Archives / Chatter / About）

每个目录包含一个 `config.json` 和若干 `.md` 文件。config.json 格式：

```json
{
  "files": [
    { "filename": "example.md", "enabled": true, "cover": "" }
  ]
}
```

- `enabled: false` 表示该文章不展示
- 新 `.md` 文件添加到目录后会自动同步到 config.json（由 watch 脚本处理）
- 删除 `.md` 文件会自动从 config.json 移除

### JSON 类型（Friends / Gallery）

直接编辑 JSON 文件，无需同步脚本：
- `public/Friends/friends.json` — 友链数组
- `public/Gallery/albums.json` — 相册数组

## 监听脚本

- **开发环境**: `node scripts/watch-archives.mjs`（通过 `npm run dev` 自动启动）
- **生产环境**: 服务器上用 `pm2 start scripts/watch-archives-server.cjs --name watch-archives` 管理

监听目录：Archives/、Chatter/、About/

## 部署

1. `npm run build` 生成 `dist/`
2. 复制 `dist/` 下所有内容到服务器 `/web/blog/`
3. 同时复制 `public/` 下的数据目录到 `/web/blog/`（如 `Archives/`、`Chatter/`、`About/`、`Friends/`、`Gallery/`、`Projects/`）
4. `pm2 restart watch-archives` 重启监听脚本
5. nginx 配置见服务器 `/etc/nginx/sites-enabled/defalut`

## 浏览器兼容

- 使用 `base: '/blog/'`（构建时），本地开发用 `base: '/'`
- 路由使用 `createWebHistory(import.meta.env.BASE_URL)`
