# Chenyun Blog — Layout & 设置系统参考文档

> 本文档详细记录项目中所有 UI 元素的位置、对应的文件、代码行号、CSS 变量体系以及设置项的影响范围。方便后续检索和优化。

---

## 目录

1. [项目架构概览](#1-项目架构概览)
2. [CSS 变量体系](#2-css-变量体系)
3. [导航栏 (Navbar)](#3-导航栏-navbar)
4. [设置面板 (SettingsPanel)](#4-设置面板-settingspanel)
5. [横幅区域 (BannerSection)](#5-横幅区域-bannersection)
6. [页面进度条 (PageProgressBar)](#6-页面进度条-pageprogressbar)
7. [浮动音乐播放器 (FloatingButtons)](#7-浮动音乐播放器-floatingbuttons)
8. [搜索框 (SearchBar)](#8-搜索框-searchbar)
9. [侧栏资料卡 (ProfileCard)](#9-侧栏资料卡-profilecard)
10. [主题 Store (theme.ts)](#10-主题-store-themets)
11. [路由配置](#11-路由配置)
12. [页面布局](#12-页面布局)
13. [动画效果](#13-动画效果)

---

## 1. 项目架构概览

| 层级 | 文件 | 作用 |
|------|------|------|
| 入口 | `index.html` | HTML 模板，含 splash screen 逻辑 |
| 入口 | `src/main.ts` | Vue 应用入口，注册 Pinia/Router/MotionPlugin |
| 根组件 | `src/App.vue` | 组装全局组件：BackgroundSlider, BackgroundEffects, Navbar, PageProgressBar, FloatingButtons, Toast |
| 路由 | `src/router/index.ts` | 10 条路由 (/, /posts/:slug, /timeline, /projects, /gallery, /music, /chatter, /friends, /about, 404) |
| 配置 | `src/siteConfig.ts` | 站点配置（作者名、导航链接、社交链接、背景图等） |
| 状态 | `src/stores/theme.ts` | Pinia store，管理所有主题/设置状态 |
| 全局样式 | `src/assets/styles/main.css` | Tailwind v4 入口 + CSS 变量 + 自定义工具类 + 动画 |
| 数据源 | `public/` 各子目录 | 所有模块数据通过 `public/` 下配置文件 + .md/JSON 文件管理，见 [附录 E](#附录-e-数据源管理) |

---

## 2. CSS 变量体系

### 2.1 核心颜色变量 (`main.css` L10-34)

```css
:root {
  --hue: 240;                        /* 色相值 0-360，由设置面板控制 */
  --primary: hsl(var(--hue), 70%, 55%);  /* 主题色 — 所有强调色使用 */
  --primary-light: hsl(var(--hue), 70%, 65%);
  --primary-dark: hsl(var(--hue), 70%, 45%);
  --primary-bg: hsla(var(--hue), 70%, 55%, 0.1);     /* 10% 透明度 */
  --primary-bg-softer: hsla(var(--hue), 70%, 55%, 0.2); /* 20% */
  --primary-border: hsla(var(--hue), 70%, 55%, 0.3);
  --btn-plain-bg-hover: hsla(var(--hue), 70%, 55%, 0.1);
  --btn-plain-bg-active: hsla(var(--hue), 70%, 55%, 0.15);
  --radius-large: 1rem;             /* 大圆角 */
  --page-bg: #f8fafc;               /* 页面背景色 */
  --card-bg: #ffffff;               /* 卡片背景 */
  --card-bg-transparent: rgba(255, 255, 255, 0.8);
  --float-panel-bg: #ffffff;        /* 浮动面板背景 */
  --glass-95 ~ --glass-30:          /* 不同透明度的玻璃卡片背景 */
}
```

### 2.2 暗色模式覆盖 (`main.css` L36-47)

```css
:root.dark {
  --page-bg: #020617;
  --card-bg: #181926;
  --float-panel-bg: #181926;
  --glass-95 ~ --glass-30: 基于 #1e293b;
}
```

### 2.3 运行时变量（由 `theme.ts:applySettings()` 设置）

在 `theme.ts` L134-168 中动态设置：

| CSS 变量 | 来源 | 用途 |
|----------|------|------|
| `--hue` | `themeHue` | 所有 `hsl(var(--hue), ...)` 计算的基础 |
| `--page-width` | `pageWidth` | 页面最大宽度 |
| `--banner-height` | `bannerHeight` | 横幅区域高度 |
| `--card-radius` | `cardRadius` | 卡片圆角 |
| `--page-bg` | `bgPresets[bgThemeId]` | 页面背景色 |
| `--card-bg` | 同上 | 卡片背景色 |
| `--card-bg-transparent` | 同上 | 半透明卡片 |
| `--float-panel-bg` | 同上 | 设置面板/浮动层背景 |
| `--glass-95 ~ --glass-30` | 同上 | 玻璃卡片各透明度 |

### 2.4 自定义 Tailwind 工具类 (`main.css` L93-99)

```css
@utility bg-page { background-color: var(--page-bg); }
@utility bg-glass-95 { background-color: var(--glass-95); }
@utility bg-glass-70 { background-color: var(--glass-70); }
@utility bg-glass-60 { background-color: var(--glass-60); }
@utility bg-glass-50 { background-color: var(--glass-50); }
@utility bg-glass-40 { background-color: var(--glass-40); }
@utility bg-glass-30 { background-color: var(--glass-30); }
```

### 2.5 主题色工具类 (`main.css` L351-366)

```css
.text-accent          → color: var(--primary)
.text-accent-light    → color: var(--primary-light)
.bg-accent            → background-color: var(--primary)
.bg-accent-soft       → background-color: var(--primary-bg)
.bg-accent-softer     → background-color: var(--primary-bg-softer)
.border-accent        → border-color: var(--primary)
.hover\:text-accent   → hover: color: var(--primary)
.hover\:bg-accent     → hover: background-color: var(--primary)
```

---

## 3. 导航栏 (Navbar)

**文件**: `src/components/Navbar.vue` (235 行)

### 3.1 整体结构

| 区域 | 行号 | 说明 |
|------|------|------|
| header 容器 | L2-4 | `fixed top-0 left-0 right-0 z-[1000]`，`-translate-y-full` 控制显隐 |
| **桌面导航栏** | L7-71 | `hidden md:flex`，宽屏显示 |
| Logo + 标题 | L9-20 | 头像 + `Chenyun の 宝藏之地`，hover 旋转动画 |
| 导航链接 | L23-40 | `absolute left-1/2 -translate-x-1/2` 居中排列 |
| 设置 + 主题按钮 | L43-70 | 右侧两个图标按钮 |
| **移动端导航栏** | L74-121 | `flex md:hidden`，窄屏显示 |
| **移动端浮层面板** | L126-163 | Mizuki 风格缩放动画，z-[2000] |
| **设置面板** | L166-169 | 挂载在 Navbar 末尾，不受 header transform 影响 |

### 3.2 导航链接定义 (`Navbar.vue` L185-194)

```ts
const navLinks = [
  { path: '/', label: '首页' },
  { path: '/projects', label: '项目' },
  { path: '/timeline', label: '归档' },
  { path: '/gallery', label: '照片墙' },
  { path: '/music', label: '音乐' },
  { path: '/chatter', label: '说说' },
  { path: '/friends', label: '友链' },
  { path: '/about', label: '关于' },
]
```

首页 (`path: '/'`) 和其他页面在样式上区分处理：

- **首页链接** (L25-30): `class="... hover:bg-(--primary) hover:text-white"` — 只有 hover 效果，没有持久活跃态
- **其他链接** (L32-39): `class="... hover:bg-(--primary) hover:text-white router-link-exact-active:bg-(--primary) router-link-exact-active:text-white"` — hover 和 `router-link-exact-active` 都触发背景色

### 3.3 滚动隐藏/显示 (`Navbar.vue` L198-206)

```ts
function handleScroll() {
  const currentScrollY = window.scrollY
  if (currentScrollY > lastScrollY.value && currentScrollY > 100) {
    showNav.value = false   // 向下滚动 > 100px 时隐藏
  } else {
    showNav.value = true    // 向上滚动时显示
  }
  lastScrollY.value = currentScrollY
}
```

### 3.4 Header 字体颜色

| 状态 | 选择器/位置 | 颜色 |
|------|-------------|------|
| 浅色模式 | `text-black/75 dark:text-white/75` | `rgba(0,0,0,0.75)` / `rgba(255,255,255,0.75)` |
| 悬停/活跃 | `hover:bg-(--primary) hover:text-white` / `router-link-exact-active:bg-(--primary) router-link-exact-active:text-white` | 主题色背景 + 白色文字 |

### 3.5 移动端菜单动画 (`Navbar.vue` L220-234)

```css
.mobile-menu-panel {
  transform-origin: top right;
  transition: transform 0.15s ease-out, opacity 0.15s ease-out;
}
.mobile-menu-panel.is-closed {
  transform: scale(0.65, 0);   /* Mizuki 风格：从右上角缩回 */
  opacity: 0;
  pointer-events: none;
}
```

### 3.6 关键交互

| 交互 | 位置 | 说明 |
|------|------|------|
| 设置按钮点击 | L47 | `@click.stop="isSettingsOpen = !isSettingsOpen"`，stopPropagation 阻止冒泡 |
| 移动端菜单切换 | L113 | `@click.stop="toggleMobileMenu"` |
| 点击背景关闭移动菜单 | L133 | 半透明背景 `@click="isMobileMenuOpen = false"` |
| 设置面板 | L166-169 | 传入 `isOpen` 和 `@close` 事件 |

---

## 4. 设置面板 (SettingsPanel)

**文件**: `src/components/SettingsPanel.vue` (449 行)

### 4.1 面板定位与动画

| 属性 | 行号 | 值 |
|------|------|------|
| 定位 | L4 | `fixed top-14 right-4 z-[2000]` |
| 宽度 | L4 | `w-72 sm:w-80` |
| 打开/关闭 | L5, `main.css` L118-131 | `float-panel` / `float-panel-closed` |
| 关闭动画 | `main.css` L122-125 | `-translate-y-1 + opacity-0 + pointer-events-none` |
| 背景色 | L7 | `var(--float-panel-bg)`，由主题 preset 控制 |

### 4.2 设置项列表

| 设置组 | 行号 | 说明 | 本地状态变量 | Store 方法 |
|--------|------|------|------------|-----------|
| **背景颜色** | L20-49 | 7 个预设色块选择 | `localBgThemeId` | `themeStore.setBgThemeId(id)` |
| **壁纸** | L51-84 | URL 输入框 + 应用按钮 | `localWallpaper` | `themeStore.setWallpaper(url)` |
| **横幅选项** | L86-164 | 显示开关 + 高度滑块 + 波浪开关 | `localBannerHeight`, `wavesEnabled` | `setBannerEnabled`, `setBannerHeight`, 自定义 `toggleWaves` |
| **主题色** | L167-205 | HSL 色相滑块 (0-360) | `localHue` | `themeStore.setHue(hue)` |
| **重置全部** | L207-213 | 一键恢复所有默认值 | — | `themeStore.resetSettings()` |

### 4.3 每个设置项的重置按钮

每个设置组标题右侧都有一个重置按钮（SVG 循环箭头）：
- 背景颜色重置 (L28-36) → `resetBgTheme()`
- 壁纸重置 (L60-68) → `resetWallpaper()`
- 横幅选项重置 (L95-103) → `resetBanner()`
- 主题色重置 (L177-184) → `resetHue()`

### 4.4 背景颜色预设定义（`theme.ts` L71-121）

7 个预设，每个包含 light/dark 的 page bg、card bg、透明 card bg、float panel bg：

| id | 名称 | light | dark |
|----|------|-------|------|
| 0 | 默认 | `#f8fafc` | `#020617` |
| 1 | 靛蓝 | `#eef2ff` | `#0f1219` |
| 2 | 暖白 | `#fdf6ee` | `#1a1612` |
| 3 | 雾蓝 | `#eef2f7` | `#0f141e` |
| 4 | 薄暮 | `#fdf0f5` | `#1e1218` |
| 5 | 青绿 | `#f0f5f2` | `#111a15` |
| 6 | 星夜 | `#f5f0eb` | `#0d1117` |

### 4.5 波浪开关

波浪动画作用于 `BannerSection.vue`，通过 `CustomEvent('waves-toggle')` 通信：
- `SettingsPanel.vue` L289-291: `window.dispatchEvent(new CustomEvent(...))`
- `BannerSection.vue` L114-117: `window.addEventListener('waves-toggle', ...)`

### 4.6 滑块进度条样式 (`SettingsPanel.vue` L355-438)

- `.range-slider`: 使用 `--range-progress` CSS 自定义属性控制渐变填充
- `.color-slider`: 彩虹色渐变轨道，半透明滑块
- 通过 `handleRangeInput()` (L271-276) 和 `updateRangeProgress()` (L263-268) 实时更新

### 4.7 点击外部关闭 (`SettingsPanel.vue` L330-337)

监听 `document` 的 `click` 事件，判断点击是否在面板或设置按钮之外。

---

## 5. 横幅区域 (BannerSection)

**文件**: `src/components/BannerSection.vue` (237 行)

### 5.1 结构

| 区域 | 行号 | 说明 |
|------|------|------|
| 容器 | L2-5 | `v-if="themeStore.bannerEnabled"`，高度 `themeStore.bannerHeight vh`，最小 350px |
| 背景轮播 | L8-20 | Ken Burns zoom 动画，3 张背景图轮播（每 8s），渐变覆盖层 |
| 搜索框 | L23-25 | `max-w-2xl` 居中，使用 `<SearchBar />` 组件 |
| 大标题 | L28-39 | `Chenyun` + `の 宝藏之地`，颜色使用 `var(--primary)` |
| 打字机 | L42-52 | 逐字输出名言，带光标闪烁 |
| 波浪装饰 | L55-92 | 3 层 SVG 波浪动画 |

### 5.2 Ken Burns 缩放 (`BannerSection.vue` L228-236)

```css
@keyframes bannerZoom {
  0%   { transform: scale(1.03); }
  100% { transform: scale(1.13); }
}
.banner-zoom { animation: bannerZoom 8s ease-out forwards; }
```

### 5.3 打字机效果 (`BannerSection.vue` L119-187)

- 引文列表 L120-128: 8 条名言，循环显示
- 时间线: 打字(80ms/字) → 暂停(2.5s) → 删除(40ms/字) → 下一句
- 光标闪烁使用 `animate-cursor` 类，在 `main.css` L216-223 和 `App.vue` L124-130 都有定义

### 5.4 波浪动画 (`App.vue` L100-138 和 `main.css` L236-254)

3 层波浪不同速度:
- `.wave-svg`: 12s 线性无限
- `.wave-svg-2`: 18s 线性无限 reverse
- `.wave-svg-3`: 24s 线性无限

---

## 6. 页面进度条 (PageProgressBar)

**文件**: `src/components/PageProgressBar.vue` (101 行)
**样式**: `main.css` L394-439

### 6.1 功能

| 功能 | 行号 | 说明 |
|------|------|------|
| 滚动进度 | L19-46 | 基于 `window.scrollY` 计算百分比，`scrollTop <= 0` 时隐藏 |
| 路由跳转进度 | L54-77 | 加载时显示 0→95% 动画，完成后 95%→100%→消失 |
| 初始检查 | L92 | `onMounted` 时调用 `updateScrollProgress()` |

### 6.2 CSS 样式 (`main.css` L394-439)

| 状态 | 类名 | 动画 |
|------|------|------|
| 固定定位 | `#page-progress-bar` | `position: fixed; top: 0; z-index: 9999` |
| 路由加载中 | `.loading` | `page-progress-loading` 动画，8s 内从 0→95% |
| 路由加载完成 | `.finishing` | 瞬间 100% |
| 完成消失 | `.done` | 300ms `opacity: 0` 过渡 |
| 滚动模式下 | 直接设置 width | 实时更新百分比 |

### 6.3 样式变量

| CSS 变量 | 默认值 | 作用 |
|----------|--------|------|
| `--page-progress-bar-height` | 3px | 进度条高度 |
| `--page-progress-bar-duration` | 8s | 加载动画持续时间 |

颜色 = `var(--primary)` + `color-mix` 发光阴影。

---

## 7. 浮动音乐播放器 (FloatingButtons)

**文件**: `src/components/FloatingButtons.vue` (760 行)

### 7.1 结构

| 区域 | 行号 | 说明 |
|------|------|------|
| 容器 | L2 | `fixed bottom-6 right-6 z-[9999]` |
| 音乐面板 | L6-189 | Mizuki 风格毛玻璃，含 × 关闭按钮 |
| 音乐 FAB 按钮 | L194-209 | 底部右上角的音符图标按钮 |
| 回到顶部按钮 | L213-235 | logo 图片，hover 变主题色箭头 |

### 7.2 音乐面板内容

| 区域 | 行号 | 说明 |
|------|------|------|
| 封面 + 歌曲信息 | L21-46 | 圆形旋转封面，标题/歌手/时间 |
| 进度条 | L49-58 | 点击跳转 |
| 控制按钮 | L61-119 | 循环模式 / 上一首 / 播放暂停 / 下一首 / 播放列表 |
| 音量控制 | L123-150 | pointer drag 拖动，静音按钮 |
| 播放列表 | L153-176 | 可展开的歌曲列表 |
| 隐藏 audio 元素 | L179-187 | 播放核心 |

### 7.3 循环模式 (`FloatingButtons.vue` L63-78, L386-388)

| 模式 | `repeatMode` | 图标 | 行为 |
|------|-------------|------|------|
| 列表循环 | 0 | 普通循环箭头 | 播放完毕自动下一首 |
| 单曲循环 | 1 | 循环箭头 + "1" 文字 | 播放完毕重新开始 |

### 7.4 播放列表 (`theme.ts` L253-281)

4 首内置歌曲，使用网易云音乐外链。

### 7.5 面板样式 (`FloatingButtons.vue` L443-759)

| 元素 | CSS 行 | 说明 |
|------|--------|------|
| 面板背景 | L445-458 | `rgba(255,255,255,0.92)` + `backdrop-filter: blur(16px)` |
| 进度条 | L483-499 | 4px 高，`var(--primary)` 填充 |
| 播放按钮 | L534-552 | 圆形，阴影，主题色背景 |
| 音量滑块 | L576-596 | 可拖拽，hover 变粗 |
| 脉冲动画 | L713-717 | 播放时 FAB 按钮脉冲边框 |

---

## 8. 搜索框 (SearchBar)

**文件**: `src/components/SearchBar.vue` (233 行)

### 8.1 两种模式

| 模式 | prop `inline` | 用途 | 行号 |
|------|---------------|------|------|
| **Overlay 模式** | `false`（默认） | 主页搜索，按钮点击弹出新层 | L46-120 |
| **Inline 模式** | `true` | 其他页面，直接显示输入框 | L3-43 |

### 8.2 Overlay 模式（主页）

- 按钮 (L47-58): `Ctrl K` 快捷键提示
- 弹出层 (L63-119): `Teleport to="body"`，半透明背景 + 搜索输入 + 结果列表
- 搜索结果使用 `getAllPosts()` 在 `posts` 数组中搜索标题/描述/标签

### 8.3 Inline 模式（其他页面）

- 直接显示搜索输入框 (L9-15)
- 接收 `searchFn` prop 进行自定义搜索
- 每个页面传入自己的 `searchFn`：
  - Timeline: `searchPosts` (L177-191) — 搜索文章
  - Projects: `searchProjects` (L177-191) — 搜索项目名称/描述/标签
  - Gallery: `searchAlbums` (L93-106) — 搜索相册
  - Music: `searchMusic` (L32-34) — 占位，返回空
  - Chatter: `searchChatters` (L51-65) — 搜索说说
  - Friends: `searchFriends` (L67-80) — 搜索友链

### 8.4 搜索结果项类型 (`SearchBar.vue` L128-135)

```ts
export interface SearchResultItem {
  title: string
  description?: string
  tag: string          // 'RouterLink' | 'a' | 'div'
  bindings: Record<string, unknown>  // v-bind 绑定
}
```

---

## 9. 侧栏资料卡 (ProfileCard)

**文件**: `src/components/ProfileCard.vue` (115 行)

### 9.1 结构

| 区域 | 行号 | 说明 |
|------|------|------|
| 卡片容器 | L2-9 | `bg-glass-50 backdrop-blur-md`，`hover:scale-[1.02]` |
| 头像 | L17-23 | w-24 h-24 圆形，`@click.stop="goToAbout"` 跳转关于页 |
| 作者名 | L25 | `siteConfig.authorName` |
| 签名 | L26-29 | 分隔线 + bio 文字 |
| 统计按钮 | L33-43 | 文章/照片/友链数量，点击跳转对应页面 |
| 社交链接 | L46-69 | GitHub/Email/微信 |

### 9.2 头像点击跳转 (`ProfileCard.vue` L88-90)

```ts
function goToAbout() {
  router.push('/about')
}
```

### 9.3 位置

在 `Home.vue` L20-27 中作为左侧栏内容，`sticky top-24`。

---

## 10. 主题 Store (theme.ts)

**文件**: `src/stores/theme.ts` (274 行)

### 10.1 状态变量

| 变量 | 默认值 | localStorage key | 说明 |
|------|--------|-----------------|------|
| `isDark` | `true` | `blog-theme` | 暗色/浅色模式 |
| `themeHue` | `240` | `blog-hue` | 色相值 0-360 |
| `pageWidth` | `75` | `blog-page-width` | 页面宽度(rem) |
| `bannerHeight` | `100` | `blog-banner-height` | 横幅高度(vh) |
| `cardRadius` | `24` | `blog-card-radius` | 卡片圆角(px) |
| `layoutMode` | `'sidebar'` | `blog-layout` | 侧栏/全宽布局 |
| `wallpaperUrl` | `''` | `blog-wallpaper` | 自定义壁纸 URL |
| `bannerEnabled` | `true` | `blog-banner-enabled` | 横幅显示开关 |
| `bgThemeId` | `0` | `blog-bg-theme-id` | 背景颜色预设 ID |

### 10.2 核心方法

| 方法 | 行号 | 作用 |
|------|------|------|
| `init()` | L29-64 | 从 localStorage 加载所有设置（含 wallpaper），调用 `applyTheme()` + `applySettings()` |
| `applyTheme()` | L66-73 | 切换 `<html>.dark` class |
| `applySettings()` | L139-175 | 设置 CSS 变量 `--hue`, `--page-bg`, `--card-bg`, `--bg-image` 等 |
| `toggleTheme()` | L75-80 | 切换暗/亮 + 持久化 + 重新应用 |
| `setHue(n)` | L178-182 | 设置色相 + 持久化 + 重新应用 |
| `setWallpaper(url)` | L208-216 | 设置壁纸 URL + 持久化 + 重新应用 |
| `setBgThemeId(n)` | L224-228 | 设置背景预设 + 持久化 + 重新应用 |
| `resetSettings()` | L235-261 | 重置所有为默认值 + 清除 localStorage（含 wallpaper） |

### 10.3 `applySettings()` 详细逻辑 (`theme.ts` L139-175)

1. 设置 `--hue`, `--page-width`, `--banner-height`, `--card-radius`
2. 根据 `bgThemeId` 和 `isDark` 找到对应 preset，设置 `--page-bg`, `--card-bg`, `--card-bg-transparent`, `--float-panel-bg`
3. 从当前 card 颜色计算 5 个 glass 透明度变量 (95%/70%/60%/50%/40%/30%)
4. 如果有 wallpaper URL，设置 `--bg-image`, `--bg-attachment`, `--bg-size`, `--bg-position`；否则移除这些变量

> **注意**: 暗色/亮色切换已分离到独立的 `toggleTheme()` 函数 (L75-80)，`applySettings()` 不再负责切换主题逻辑。

---

## 11. 路由配置

**文件**: `src/router/index.ts` (62 行)

| 路径 | 名称 | 页面组件 | 说明 |
|------|------|---------|------|
| `/` | home | `Home.vue` | 主页，含横幅 + 侧栏布局 |
| `/posts/:slug` | post | `PostDetail.vue` | 文章详情 |
| `/timeline` | timeline | `Timeline.vue` | 归档（中枢链路/矩阵网格） |
| `/projects` | projects | `Projects.vue` | 项目展示 |
| `/gallery` | gallery | `Gallery.vue` | 照片墙 |
| `/music` | music | `Music.vue` | 音乐页（占位） |
| `/chatter` | chatter | `Chatter.vue` | 说说 |
| `/friends` | friends | `Friends.vue` | 友链 |
| `/about` | about | `About.vue` | 关于 |
| `/:pathMatch(.*)*` | not-found | `NotFound.vue` | 404 |

`scrollBehavior` (L57-59): 路由切换时滚动到顶部。

---

## 12. 页面布局

### 12.1 主页 (`Home.vue`) — 3 列侧栏布局

| 区域 | 行号 | 说明 |
|------|------|------|
| BannerSection | L4 | 横幅（搜索+打字机+波浪） |
| 主容器 | L7-71 | `maxWidth=80rem`（或 100% 全宽） |
| 左侧栏 | L19-28 | ProfileCard + CalendarWidget，`sticky top-24`，`hidden lg:block` |
| 中间 | L31-44 | ArticleCardGrid + PaginationBar + SiteDashboard |
| 右侧栏 | L47-69 | MusicPlayer + 近期文章，`sticky top-24`，`hidden xl:block` |
| Footer | L74 | FooterBar |

布局切换：`themeStore.layoutMode === 'sidebar'` 决定是否显示两个侧栏。

### 12.2 其他页面 — 统一结构

所有子页面 (`Timeline`, `Projects`, `Gallery`, `Music`, `Chatter`, `Friends`, `About`) 遵循相同布局：

```html
<main class="w-full max-w-6xl mx-auto px-3 sm:px-6 pt-20 md:pt-24 pb-32 relative z-10 flex-1">
  <BackButton />
  <div class="mt-8">
    <!-- 标题 + SearchBar 行 -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <h1>页面标题</h1>
      <SearchBar inline :search-fn="..." placeholder="..." />
    </div>
    <!-- 内容 -->
  </div>
</main>
```

- `pt-20 md:pt-24`: 为固定导航栏留出空间
- `pb-32`: 底部留白
- `BackButton` (位于 `src/components/BackButton.vue`): 返回按钮

### 12.3 文章详情 (`PostDetail.vue`)

不在上述列表中，但引用为 `src/pages/PostDetail.vue`，含文章内容、目录、推荐阅读。

---

## 13. 动画效果

### 13.1 页面过渡 (`App.vue` L76-86)

```css
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: opacity 0.25s ease;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
}
```

### 13.2 Toast 动画 (`App.vue` L88-97)

```css
.toast-enter-active, .toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
```

### 13.3 导航栏移动端面板 (`Navbar.vue` L220-234)

```css
.mobile-menu-panel {
  transform-origin: top right;
  transition: transform 0.15s ease-out, opacity 0.15s ease-out;
}
.is-closed { transform: scale(0.65, 0); opacity: 0; }
```

### 13.4 音乐面板 (`FloatingButtons.vue` L719-734)

```css
.music-panel-enter-active, .music-panel-leave-active {
  transition: all 0.25s ease-out;
}
.music-panel-enter-from, .music-panel-leave-to {
  opacity: 0; transform: translateY(12px) scale(0.95);
}
```

### 13.5 设置面板 (`main.css` L118-131)

```css
.float-panel-closed {
  transform: translateY(-4px);
  opacity: 0;
  pointer-events: none;
  transition-duration: 0.15s;
}
```

### 13.6 横幅轮播 (`BannerSection.vue` L210-218, L228-236)

```css
.banner-fade-enter-active, .banner-fade-leave-active {
  transition: opacity 1.5s ease;
}
.banner-zoom {
  animation: bannerZoom 8s ease-out forwards;
}
```

### 13.7 引文切换 (`BannerSection.vue` L219-226)

```css
.quote-fade-enter-active, .quote-fade-leave-active {
  transition: opacity 0.3s ease;
}
```

### 13.8 资料卡悬浮 (`Home.vue` 使用 `v-motion`)

`ProfileCard` 和 `ArticleCardGrid` 使用 `@vueuse/motion` 的 `v-motion` 指令实现滚动入场动画。

### 13.9 回到顶部 logo 旋转

`FloatingButtons.vue` L223: `class="animate-spin"` + `animation-duration: 6s`
`Navbar.vue` L13: `group-hover:rotate-[360deg] transition-transform duration-700`

### 13.10 搜索框动画 (`SearchBar.vue` L214-232)

Overlay 模式淡入淡出，Inline 模式向上滑入。

---

## 附录 A：页面文件速查表

| 组件 | 文件路径 | 行数 |
|------|---------|------|
| App.vue | `src/App.vue` | 139 |
| Navbar.vue | `src/components/Navbar.vue` | 235 |
| SettingsPanel.vue | `src/components/SettingsPanel.vue` | 434 |
| BannerSection.vue | `src/components/BannerSection.vue` | 237 |
| PageProgressBar.vue | `src/components/PageProgressBar.vue` | 101 |
| FloatingButtons.vue | `src/components/FloatingButtons.vue` | 760 |
| SearchBar.vue | `src/components/SearchBar.vue` | 233 |
| ProfileCard.vue | `src/components/ProfileCard.vue` | 115 |
| Home.vue | `src/pages/Home.vue` | 134 |
| Timeline.vue | `src/pages/Timeline.vue` | 192 |
| Projects.vue | `src/pages/Projects.vue` | 192 |
| Gallery.vue | `src/pages/Gallery.vue` | 164 |
| Music.vue | `src/pages/Music.vue` | 36 |
| Chatter.vue | `src/pages/Chatter.vue` | 66 |
| Friends.vue | `src/pages/Friends.vue` | 104 |
| About.vue | `src/pages/About.vue` | 68 |
| theme.ts | `src/stores/theme.ts` | 274 |
| siteConfig.ts | `src/siteConfig.ts` | 89 |
| main.css | `src/assets/styles/main.css` | 441 |
| router/index.ts | `src/router/index.ts` | 62 |
| types/index.ts | `src/types/index.ts` | 48 |
| watch-archives.mjs | `scripts/watch-archives.mjs` | 138 |
| watch-archives-server.cjs | `scripts/watch-archives-server.cjs` | 59 |
| sync-archives.cjs | `scripts/sync-archives.cjs` | 91 |

## 附录 B：设置与影响范围

| 设置项 | 控制变量 | 影响文件 | 影响元素 |
|--------|---------|---------|---------|
| 主题色 (Hue) | `themeHue` | 全局 | 所有 `var(--primary)` 使用处：导航栏活跃背景、按钮、链接、进度条、音乐播放器强调色 |
| 背景颜色预设 | `bgThemeId` | 全局 | `--page-bg`, `--card-bg`, `--float-panel-bg`, `--glass-*` |
| 暗色/浅色 | `isDark` | 全局 | 切换 `.dark` class，改变所有文本/背景变量 |
| 横幅开关 | `bannerEnabled` | `BannerSection.vue` | 横幅区域显隐 |
| 横幅高度 | `bannerHeight` | `BannerSection.vue` L5 | 横幅容器 height |
| 壁纸 | `wallpaperUrl` | `theme.ts` L164-175 | body 背景图片 |
| 波浪 | localStorage | `BannerSection.vue` L55-92 | 底部波浪 SVG |
| 音乐循环模式 | `repeatMode` | `FloatingButtons.vue` L365-374 | 播放完毕后的行为 |
| 主题切换 `toggleTheme()` | `isDark` | 全局 | 切换 `.dark` class + 更新所有 CSS 变量 |

## 附录 C：关键 CSS 选择器

| 选择器 | 文件:行 | 作用 |
|--------|--------|------|
| `#page-progress-bar` | `main.css:394` | 顶部滚动/加载进度条 |
| `#display-setting` | `SettingsPanel.vue:3` | 设置面板容器 |
| `#settings-btn` | `Navbar.vue:46` | 设置齿轮按钮 |
| `#mobile-menu-btn` | `Navbar.vue:111` | 移动端菜单按钮 |
| `.float-panel` / `.float-panel-closed` | `main.css:118-131` | 浮动面板动画 |
| `.mobile-menu-panel` | `Navbar.vue:222-234` | 移动端菜单缩放动画 |
| `.top-gradient-highlight` | `main.css:369-391` | 顶部渐变高亮层（未在模板中使用，保留样式） |
| `.fab-music-panel` | `FloatingButtons.vue:445` | 音乐面板毛玻璃容器 |
| `.music-fab` | `FloatingButtons.vue:647` | 音乐 FAB 按钮 |
| `.back-top-btn` | `FloatingButtons.vue:689` | 回到顶部按钮 |

## 附录 D：Toast 使用

**Store**: `src/stores/toast.ts`

**使用方式**:
```ts
import { useToastStore } from '@/stores/toast'
const toastStore = useToastStore()
toastStore.showToast('✨ 消息内容', 'success') // success | warning | error | info
```

Toast 在 `App.vue` L34-42 渲染，`fixed top-20 left-1/2 z-[3000]`，按类型应用不同背景色 (`App.vue` L62-68)。

## 附录 E：数据源管理

项目数据从 `public/` 下的 JSON + .md 配置文件中读取，每个模块独立管理：

### Archives（归档文章）

- **配置文件**: `public/Archives/config.json`
- **数据文件**: `public/Archives/*.md`
- **监听脚本**: `scripts/watch-archives.mjs` + `scripts/watch-archives-server.cjs`（服务器端）
- **手动同步**: `node scripts/sync-archives.cjs /web/blog/Archives`

### Chatter（说说）

- **配置文件**: `public/Chatter/config.json`
- **数据文件**: `public/Chatter/*.md`
- 格式同上，由同一个 watch 脚本同时监听 Archives/ 和 Chatter/。

### About（关于页面）

- **配置文件**: `public/About/config.json`
- **数据文件**: `public/About/*.md`
- **监听**: 由 `watch-archives.mjs` / `watch-archives-server.cjs` 统一监听
- **读取方式**: `About.vue` (L43-67) 先 fetch `config.json`，取 `files[0].filename` 再 fetch 对应的 .md 文件内容，用 `renderMarkdown()` 渲染

config.json 格式（与 Archives 统一）：
```json
{
  "files": [
    { "filename": "about me.md", "enabled": true, "cover": "" }
  ]
}
```

### Friends（友链）

- **配置文件**: `public/Friends/friends.json`
- **数据格式**: 直接存放友链数组
- **读取方式**: `Friends.vue` (L71-83) 在 `onMounted` 时 fetch JSON，渲染为友链卡片网格
- **手动管理**: 直接编辑 `friends.json` 增删条目

friends.json 格式：
```json
[
  {
    "id": "friend-id",
    "name": "站点名",
    "description": "站点描述",
    "avatar": "头像URL",
    "url": "站点链接",
    "themeColor": "rgba(..., ..., ..., 0.5)"
  }
]
```

### Gallery（照片墙）

- **配置文件**: `public/Gallery/albums.json`
- **数据格式**: 相册数组，每个相册包含标题、描述、封面、照片列表
- **读取方式**: `Gallery.vue` (L139-151) 在 `onMounted` 时 fetch JSON，渲染为相册网格 + 点击查看大图
- **手动管理**: 直接编辑 `albums.json` 增删相册和照片

albums.json 格式：
```json
[
  {
    "id": "album-id",
    "title": "相册标题",
    "description": "相册描述",
    "cover": "封面图片URL",
    "date": "2026.01",
    "photos": [
      { "url": "图片URL", "caption": "图片说明" }
    ]
  }
]
```

### 配置文件统一格式（Archives / Chatter / About）

```json
{
  "files": [
    { "filename": "example.md", "enabled": true, "cover": "" }
  ]
}
```

### Watch 脚本

`watch-archives.mjs` (L19-32) 定义了 `WATCH_DIRS` 数组，包含 archives、chatter、about 三个目录。服务器端 `watch-archives-server.cjs` (L14-18) 同理。

### 已删除的旧数据文件

以下旧文件已删除，数据已迁移至 `public/`：
- `src/data/friends.ts` → `public/Friends/friends.json`
- `src/data/albums.ts` → `public/Gallery/albums.json`
- `src/data/chatters.ts` → `public/Chatter/config.json`

**仍保留的 `src/data/` 文件**：
- `src/data/projects.ts` — 项目数据（尚未迁移）
- `src/data/quotes.ts` — 每日一言数据（尚未迁移）
