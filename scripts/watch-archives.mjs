/**
 * watch-archives.mjs
 *
 * 监听 public/Archives/ 和 public/Chatter/ 下的 .md 文件变化，
 * 自动同步更新各目录下的 config.json。
 *
 * 用法：
 *   node scripts/watch-archives.mjs          # 监听模式
 *   node scripts/watch-archives.mjs --once    # 单次生成 config.json 后退出
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ====== 配置：要监听的目录列表 ======
const WATCH_DIRS = [
  {
    name: 'archives',
    dir: path.resolve(__dirname, '../public/Archives'),
  },
  {
    name: 'chatter',
    dir: path.resolve(__dirname, '../public/Chatter'),
  },
  {
    name: 'about',
    dir: path.resolve(__dirname, '../public/About'),
  },
  {
    name: 'projects',
    dir: path.resolve(__dirname, '../public/Projects'),
  },
]

/** 读取已存在的 config.json（如果存在） */
function readExistingConfig(configPath) {
  try {
    if (fs.existsSync(configPath)) {
      const raw = fs.readFileSync(configPath, 'utf-8')
      return JSON.parse(raw)
    }
  } catch {
    // 忽略解析错误，重新生成
  }
  return null
}

/** 扫描目录下的所有 .md 文件 */
function scanMdFiles(dir) {
  try {
    const files = fs.readdirSync(dir)
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
      newFiles.push(existingMap.get(filename))
    } else {
      newFiles.push({
        filename,
        enabled: true,
        cover: ''
      })
    }
  }

  return { files: newFiles }
}

/** 同步单个目录 */
function syncOne(cfg) {
  const configPath = path.join(cfg.dir, 'config.json')
  const mdFiles = scanMdFiles(cfg.dir)
  const existing = readExistingConfig(configPath)
  const config = mergeConfig(existing, mdFiles)
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n', 'utf-8')
  console.log(`[${cfg.name}] config.json 已更新 — ${config.files.length} 条记录`)
}

/** 同步所有目录 */
function syncAll() {
  for (const cfg of WATCH_DIRS) {
    try {
      syncOne(cfg)
    } catch (err) {
      console.error(`[${cfg.name}] 同步失败:`, err.message)
    }
  }
}

// ====== 主入口 ======

const isOnce = process.argv.includes('--once')

if (isOnce) {
  console.log('[watch] 单次同步...')
  syncAll()
  process.exit(0)
}

// 监听模式
console.log('[watch] 开始监听 public/Archives/, public/Chatter/, public/About/, public/Projects/ 下的 .md 文件变化...')
syncAll() // 启动时先同步一次

for (const cfg of WATCH_DIRS) {
  let syncTimer = null
  fs.watch(cfg.dir, (eventType, filename) => {
    if (!filename || !filename.endsWith('.md')) return
    if (syncTimer) clearTimeout(syncTimer)
    syncTimer = setTimeout(() => {
      console.log(`[${cfg.name}] 检测到变化: ${filename} (${eventType})`)
      try {
        syncOne(cfg)
      } catch (err) {
        console.error(`[${cfg.name}] 同步失败:`, err.message)
      }
    }, 500)
  })
}
