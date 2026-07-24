/**
 * sync-archives.cjs
 *
 * 服务器端同步脚本：扫描指定目录下的所有 .md 文件，
 * 合并现有的 config.json（保留 cover 和 enabled 设置），
 * 然后写出更新后的 config.json。
 *
 * 用法：
 *   node scripts/sync-archives.cjs [目录路径]
 *
 * 如果不传目录路径，默认使用当前工作目录下的 Archives/。
 * 在服务器上使用时：
 *   node /web/blog/scripts/sync-archives.cjs /web/blog/Archives
 *
 * 配合 cron 实现自动同步（每 5 分钟检查一次）：
 *   crontab -e
 *   (cron) /5 * * * * cd /web/blog && node scripts/sync-archives.cjs /web/blog/Archives >/dev/null 2>&1
 */

const fs = require('fs')
const path = require('path')

// 获取目标目录（命令行参数或当前目录下的 Archives）
const targetDir = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(process.cwd(), 'Archives')

const configPath = path.join(targetDir, 'config.json')

console.log('[sync-archives] 目标目录: ' + targetDir)

// 1. 扫描所有 .md 文件
let mdFiles = []
try {
  const allFiles = fs.readdirSync(targetDir)
  mdFiles = allFiles
    .filter(f => f.endsWith('.md'))
    .sort(function (a, b) { return a.localeCompare(b, 'zh-CN') })
} catch (err) {
  console.error('[sync-archives] 错误: 无法读取目录 ' + targetDir)
  console.error(err.message)
  process.exit(1)
}

console.log('[sync-archives] 找到 ' + mdFiles.length + ' 个 .md 文件')

// 2. 读取现有的 config.json（如果存在）
let existingConfig = { files: [] }
try {
  if (fs.existsSync(configPath)) {
    const raw = fs.readFileSync(configPath, 'utf-8')
    existingConfig = JSON.parse(raw)
    console.log('[sync-archives] 读取到现有配置，' + existingConfig.files.length + ' 条记录')
  }
} catch (_e) {
  console.log('[sync-archives] 无有效现有配置，将全新生成')
}

// 3. 合并：保留现有配置中存在的文件的设置，新文件默认启用
const existingMap = new Map()
if (Array.isArray(existingConfig.files)) {
  for (var i = 0; i < existingConfig.files.length; i++) {
    var f = existingConfig.files[i]
    existingMap.set(f.filename, f)
  }
}

var mergedFiles = mdFiles.map(function (filename) {
  if (existingMap.has(filename)) {
    return existingMap.get(filename)
  }
  return {
    filename: filename,
    enabled: true,
    cover: ''
  }
})

// 4. 写出 config.json
var newConfig = { files: mergedFiles }
try {
  fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2) + '\n', 'utf-8')
  console.log('[sync-archives] OK config.json 已更新 - ' + mergedFiles.length + ' 篇文章')
  for (var j = 0; j < mergedFiles.length; j++) {
    console.log('  [' + (j + 1) + '] ' + mergedFiles[j].filename + ' (enabled: ' + mergedFiles[j].enabled + ')')
  }
} catch (err) {
  console.error('[sync-archives] 错误: 无法写入 ' + configPath)
  console.error(err.message)
  process.exit(1)
}
