/**
 * watch-archives-server.cjs
 *
 * 服务器端监听脚本：同时监听 Archives/ 和 Chatter/ 下的 .md 文件变化，
 * 自动更新对应目录的 config.json。
 *
 * 用法（服务器上）：
 *   pm2 start /web/blog/scripts/watch-archives-server.cjs --name watch-archives
 */

const fs = require('fs');
const path = require('path');

const WATCH_DIRS = [
  { name: 'Archives', dir: '/web/blog/Archives' },
  { name: 'Chatter',  dir: '/web/blog/Chatter'  },
  { name: 'About',    dir: '/web/blog/About'    },
  { name: 'Projects', dir: '/web/blog/Projects' },
];

function syncOne(cfg) {
  const configPath = path.join(cfg.dir, 'config.json');
  try {
    const files = fs.readdirSync(cfg.dir)
      .filter(f => f.endsWith('.md'))
      .sort((a, b) => a.localeCompare(b, 'zh-CN'));

    let existing = { files: [] };
    try { existing = JSON.parse(fs.readFileSync(configPath, 'utf-8')); } catch(e) {}
    const map = new Map();
    if (Array.isArray(existing.files)) existing.files.forEach(f => map.set(f.filename, f));
    const merged = files.map(f => map.has(f) ? map.get(f) : { filename: f, enabled: true, cover: '' });
    fs.writeFileSync(configPath, JSON.stringify({ files: merged }, null, 2) + '\n', 'utf-8');
    console.log('[watch] [' + cfg.name + '] synced ' + merged.length + ' items');
  } catch(e) {
    console.error('[watch] [' + cfg.name + '] error:', e.message);
  }
}

function syncAll() {
  WATCH_DIRS.forEach(syncOne);
}

// 启动时先同步一次
syncAll();

// 监听所有目录
WATCH_DIRS.forEach(function(cfg) {
  try {
    fs.watch(cfg.dir, { encoding: 'utf-8' }, function(event, filename) {
      if (filename && filename.endsWith('.md') && filename !== 'config.json') {
        console.log('[watch] [' + cfg.name + '] ' + filename + ' changed (' + event + ')');
        setTimeout(function() { syncOne(cfg); }, 300);
      }
    });
    console.log('[watch] 监听目录: ' + cfg.dir);
  } catch(e) {
    console.error('[watch] 无法监听 ' + cfg.dir + ':', e.message);
  }
});
