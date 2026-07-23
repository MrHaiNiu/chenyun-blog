# Git 操作指南 — chenyun-blog

## 项目信息

- **远程仓库**: `https://github.com/MrHaiNiu/chenyun-blog.git`
- **默认分支**: `main`
- **本地路径**: `F:/Project/vue-blog`

---

## 1. 初次克隆

```bash
git clone https://github.com/MrHaiNiu/chenyun-blog.git
cd chenyun-blog
```

---

## 2. 日常工作流

### 2.1 查看当前状态

```bash
git status
```

### 2.2 添加文件到暂存区

```bash
# 添加所有变更（新增、修改、删除）
git add -A

# 或只添加某个文件
git add src/components/SettingsPanel.vue

# 或只添加某个目录
git add src/pages/
```

### 2.3 提交变更

```bash
# 提交并填写提交信息
git commit -m "feat: 你的提交说明"

# 推荐提交信息格式：
# feat: 新功能
# fix: 修复Bug
# refactor: 重构
# style: 样式调整
# docs: 文档更新
# chore: 构建/工具相关
```

### 2.4 推送到远程

```bash
# 首次推送（设置上游分支）
git push -u origin main

# 后续推送
git push
```

### 2.5 拉取最新代码

```bash
git pull
```

---

## 3. 完整提交流程示例

```bash
# 1. 查看哪些文件改了
git status

# 2. 添加所有变更
git add -A

# 3. 提交
git commit -m "feat: 添加毛玻璃导航栏和主题色设置"

# 4. 推送到GitHub
git push
```

---

## 4. 分支操作

### 4.1 创建并切换到新分支

```bash
git checkout -b feature/new-navbar
```

### 4.2 切换到已有分支

```bash
git checkout main
```

### 4.3 合并分支

```bash
# 先切回主分支
git checkout main

# 合并功能分支
git merge feature/new-navbar
```

### 4.4 删除分支

```bash
# 删除本地分支
git branch -d feature/new-navbar

# 删除远程分支
git push origin --delete feature/new-navbar
```

---

## 5. 撤销操作

### 5.1 撤销工作区的修改（未暂存）

```bash
# 撤销某个文件
git restore src/components/SettingsPanel.vue

# 撤销所有文件
git restore .
```

### 5.2 撤销暂存区的文件（已 `git add`）

```bash
git restore --staged src/components/SettingsPanel.vue
```

### 5.3 撤销最近一次提交（保留改动到工作区）

```bash
git reset --soft HEAD~1
```

### 5.4 彻底回退到某个历史版本

```bash
# 查看提交历史
git log --oneline

# 回退到指定commit（保留改动）
git reset --soft <commit-hash>

# 回退到指定commit（彻底丢弃改动）
git reset --hard <commit-hash>
```

---

## 6. 查看历史

```bash
# 查看提交历史（一行模式）
git log --oneline

# 查看详细历史
git log

# 查看某个文件的修改历史
git log --oneline -- src/components/SettingsPanel.vue

# 查看某个commit的具体改动
git show <commit-hash>
```

---

## 7. 远程仓库配置

```bash
# 查看远程仓库
git remote -v

# 添加远程仓库（已配好，无需执行）
git remote add origin https://github.com/MrHaiNiu/chenyun-blog.git

# 修改远程仓库地址（如果更换仓库）
git remote set-url origin https://github.com/你的用户名/新仓库名.git
```

---

## 8. 常见问题

### 8.1 推送被拒绝（non-fast-forward）

```bash
# 先拉取远程代码再推送
git pull --rebase
git push
```

### 8.2 配置用户信息（首次使用Git）

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱@example.com"
```

### 8.3 网络超时无法推送

如果遇到 `Failed to connect to github.com port 443` 错误：

1. 检查网络连接，尝试切换网络
2. 配置代理（如使用VPN/代理）：
   ```bash
   git config --global http.proxy http://127.0.0.1:7890
   git config --global https.proxy http://127.0.0.1:7890
   ```
3. 取消代理：
   ```bash
   git config --global --unset http.proxy
   git config --global --unset https.proxy
   ```

### 8.4 未跟踪的文件不想提交

在项目根目录的 `.gitignore` 中添加规则：

```
# 例如忽略dist目录
dist/
# 例如忽略node_modules
node_modules/
```

---

## 9. 项目当前提交历史

```bash
562966b fix: 去除设置面板重复的主题色模块，增大面板高度至85vh
13848f3 feat: 全面优化导航栏、主页布局、搜索功能、音乐播放器及设置面板
967629b Add comprehensive layout.md documentation for all UI elements and settings
8833612 Add banner Ken Burns zoom effect & enhanced gradient overlay
884eaf0 Remove pageWidth & cardRadius from UI, fix banner height slider progress
```
