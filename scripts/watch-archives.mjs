/**
 * watch-archives.mjs
 *
 * 监听 public/Archives/ 下的 .md 文件变化，
 * 自动同步更新 config.json。
 *
 * 用法：
 *   node scripts/watch-archives.mjs          # 监听模式
 *   node scripts/watch-archives.mjs --once    # 单次生成 config.json 后退出
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ARCHIVES_DIR = path.resolve(__dirname, '../public/Archives')
const CONFIG_PATH = path.join(ARCHIVES_DIR, 'config.json')

/** 读取已存在的 config.json（如果存在） */
function readExistingConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const raw = fs.readFileSync(CONFIG_PATH, 'utf-8')
      return JSON.parse(raw)
    }
  } catch {
    // 忽略解析错误，重新生成
  }
  return null
}

/** 扫描目录下的所有 .md 文件 */
function scanMdFiles() {
  try {
    const files = fs.readdirSync(ARCHIVES_DIR)
    return files
      .filter(f => f.endsWith('.md'))
      .sort((a, b) => a.localeCompare(b))
  } catch {
    return []
  }
}

/** 合并已有配置和新扫描结果 */
function mergeConfig(existing, mdFiles) {
  if (!existing || !existing.files) {
    // 没有现有配置，全部标记为新增
    return {
      files: mdFiles.map(filename => ({
        filename,
        enabled: true,
        cover: ''
      }))
    }
  }

  const existingMap = new Map(existing.files.map(f => [f.filename, f]))
  const newFiles = []

  for (const filename of mdFiles) {
    if (existingMap.has(filename)) {
      // 保留现有配置
      newFiles.push(existingMap.get(filename))
    } else {
      // 新增文件，默认启用
      newFiles.push({
        filename,
        enabled: true,
        cover: ''
      })
    }
  }

  return { files: newFiles }
}

/** 写入 config.json */
function writeConfig(config) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2) + '\n', 'utf-8')
  console.log(`[archives] config.json 已更新 — ${config.files.length} 篇文章`)
}

/** 执行一次同步 */
function sync() {
  const mdFiles = scanMdFiles()
  const existing = readExistingConfig()
  const config = mergeConfig(existing, mdFiles)
  writeConfig(config)
}

// ====== 主入口 ======

const isOnce = process.argv.includes('--once')

if (isOnce) {
  console.log('[archives] 单次同步...')
  sync()
  process.exit(0)
}

// 监听模式
console.log('[archives] 开始监听 public/Archives/ 下的 .md 文件变化...')
sync() // 启动时先同步一次

let syncTimer = null
fs.watch(ARCHIVES_DIR, (eventType, filename) => {
  // 只关注 .md 文件，忽略 config.json 本身
  if (!filename || !filename.endsWith('.md')) return

  // 防抖：500ms 内多次变化只同步一次
  if (syncTimer) clearTimeout(syncTimer)
  syncTimer = setTimeout(() => {
    console.log(`[archives] 检测到变化: ${filename} (${eventType})`)
    sync()
  }, 500)
})
