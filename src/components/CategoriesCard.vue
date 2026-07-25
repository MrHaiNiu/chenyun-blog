<template>
  <div
    class="rounded-3xl bg-glass-50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg p-5"
  >
    <h4 class="text-sm font-black text-slate-800 dark:text-white mb-3 border-l-4 border-accent pl-2">
      分类
    </h4>
    <div class="space-y-1.5">
      <RouterLink
        v-for="cat in categories"
        :key="cat.name"
        to="/timeline"
        class="flex items-center justify-between px-3 py-2 rounded-xl transition-colors hover:bg-accent/10 dark:hover:bg-accent/10 group"
      >
        <span class="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-accent transition-colors">
          {{ cat.name }}
        </span>
        <span
          class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/10 text-accent dark:text-accent-light"
        >
          {{ cat.count }}
        </span>
      </RouterLink>
    </div>
    <div v-if="categories.length === 0" class="text-xs text-slate-400 text-center py-3">
      暂无分类
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { fetchArchivesPosts } from '@/utils/content-loader'
import type { PostMeta } from '@/types'

const posts = ref<PostMeta[]>([])

interface Category {
  name: string
  count: number
}

const categories = computed<Category[]>(() => {
  const map = new Map<string, number>()
  for (const post of posts.value) {
    for (const tag of post.tags) {
      map.set(tag, (map.get(tag) || 0) + 1)
    }
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
})

function postsHaveChanged(a: PostMeta[], b: PostMeta[]): boolean {
  if (a.length !== b.length) return true
  const slugsA = a.map(p => p.slug).sort().join(',')
  const slugsB = b.map(p => p.slug).sort().join(',')
  return slugsA !== slugsB
}

let pollTimer: ReturnType<typeof setInterval> | null = null

onMounted(async () => {
  posts.value = await fetchArchivesPosts()
  pollTimer = setInterval(async () => {
    const fresh = await fetchArchivesPosts()
    if (postsHaveChanged(posts.value, fresh)) {
      posts.value = fresh
    }
  }, 3000)
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
})
</script>
