<template>
  <div
    class="rounded-3xl bg-glass-50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg p-5"
  >
    <h4 class="text-sm font-black text-slate-800 dark:text-white mb-3 border-l-4 border-accent pl-2">
      站点信息
    </h4>

    <!-- Main items -->
    <div class="flex flex-col gap-2 mb-2">
      <div class="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-100/50 dark:bg-slate-800/50">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-xs font-medium text-slate-600 dark:text-slate-400">文章总数</span>
        </div>
        <span class="text-xs font-bold text-slate-800 dark:text-slate-200">{{ postCount }}</span>
      </div>
      <div class="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-100/50 dark:bg-slate-800/50">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span class="text-xs font-medium text-slate-600 dark:text-slate-400">分类数</span>
        </div>
        <span class="text-xs font-bold text-slate-800 dark:text-slate-200">{{ categoryCount }}</span>
      </div>
      <div class="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-100/50 dark:bg-slate-800/50">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-xs font-medium text-slate-600 dark:text-slate-400">运行天数</span>
        </div>
        <span class="text-xs font-bold text-slate-800 dark:text-slate-200">{{ daysSinceBuild }}</span>
      </div>
    </div>

    <!-- Collapse toggle -->
    <button
      @click="collapsed = !collapsed"
      class="w-full flex items-center justify-center gap-1 py-2 text-xs font-bold text-accent hover:text-accent-dark transition-colors"
    >
      <svg
        class="w-4 h-4 transition-transform duration-200"
        :class="collapsed ? '' : 'rotate-180'"
        fill="none" viewBox="0 0 24 24" stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
      <span>{{ collapsed ? '展开更多' : '收起详情' }}</span>
    </button>

    <!-- Detail grid (collapsible) -->
    <div
      class="overflow-hidden transition-all duration-300"
      :style="{ maxHeight: collapsed ? '0' : '300px' }"
    >
      <div class="grid grid-cols-2 gap-2 pt-1">
        <div class="flex flex-col items-center gap-1 py-2 px-1 rounded-xl bg-slate-100/50 dark:bg-slate-800/50">
          <span class="text-xs text-slate-500 dark:text-slate-400">框架</span>
          <span class="text-xs font-bold text-slate-800 dark:text-slate-200">Vue 3</span>
        </div>
        <div class="flex flex-col items-center gap-1 py-2 px-1 rounded-xl bg-slate-100/50 dark:bg-slate-800/50">
          <span class="text-xs text-slate-500 dark:text-slate-400">构建工具</span>
          <span class="text-xs font-bold text-slate-800 dark:text-slate-200">Vite</span>
        </div>
        <div class="flex flex-col items-center gap-1 py-2 px-1 rounded-xl bg-slate-100/50 dark:bg-slate-800/50">
          <span class="text-xs text-slate-500 dark:text-slate-400">最后更新</span>
          <span class="text-xs font-bold text-slate-800 dark:text-slate-200">{{ buildDate }}</span>
        </div>
        <div class="flex flex-col items-center gap-1 py-2 px-1 rounded-xl bg-slate-100/50 dark:bg-slate-800/50">
          <span class="text-xs text-slate-500 dark:text-slate-400">作者</span>
          <span class="text-xs font-bold text-slate-800 dark:text-slate-200">{{ siteConfig.authorName }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { siteConfig } from '@/siteConfig'
import { getAllPosts } from '@/utils/markdown'

const collapsed = ref(true)

const posts = getAllPosts()
const postCount = posts.length

const categoryCount = computed(() => {
  const tags = new Set<string>()
  for (const post of posts) {
    for (const tag of post.tags) {
      tags.add(tag)
    }
  }
  return tags.size
})

const buildDate = siteConfig.buildDate
  ? new Date(siteConfig.buildDate).toLocaleDateString('zh-CN')
  : '未知'

const daysSinceBuild = computed(() => {
  if (!siteConfig.buildDate) return 0
  const build = new Date(siteConfig.buildDate)
  const now = new Date()
  return Math.floor((now.getTime() - build.getTime()) / 86400000)
})
</script>
