<template>
  <div
    class="w-full rounded-3xl bg-glass-30 backdrop-blur-md border border-white/30 dark:border-white/10 shadow-lg p-5 md:p-6"
  >
    <div class="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6">
      <!-- Left: Time & Uptime -->
      <div class="flex items-center gap-3 md:gap-4">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span class="text-sm font-mono font-bold text-slate-700 dark:text-slate-300">{{ timeStr }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span class="text-xs text-slate-600 dark:text-slate-400 font-medium">已运行 {{ uptimeStr }}</span>
        </div>
      </div>

      <!-- Right: Badges & ICP -->
      <div class="flex items-center gap-2 flex-wrap justify-center">
        <span
          v-for="badge in badges"
          :key="badge.name"
          class="px-2 py-1 bg-white/50 dark:bg-slate-700/50 rounded-md shadow-sm flex items-center gap-1 border border-white/40 dark:border-slate-600 text-xs font-bold"
          :class="badge.color"
        >
          {{ badge.icon }} {{ badge.name }}
        </span>

        <a
          v-if="siteConfig.icpConfig"
          :href="siteConfig.icpConfig.link"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-accent transition-colors border-b border-dashed border-slate-400 dark:border-slate-500 pb-0.5 text-xs"
        >
          {{ siteConfig.icpConfig.name }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { siteConfig } from '@/siteConfig'

const timeStr = ref('')
const uptimeStr = ref('')
let timer: ReturnType<typeof setInterval> | null = null

const START_DATE = new Date(siteConfig.buildDate).getTime()

const badges = [
  { name: 'Vue 3', icon: '💚', color: 'text-green-600 dark:text-green-400' },
  { name: 'Vite', icon: '⚡', color: 'text-purple-600 dark:text-purple-400' },
  { name: 'TailwindCSS', icon: '🎨', color: 'text-cyan-600 dark:text-cyan-400' },
]

function updateTime() {
  const now = new Date()
  timeStr.value = now.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  const diff = now.getTime() - START_DATE
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  uptimeStr.value = `${days}天 ${hours}小时`
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>
