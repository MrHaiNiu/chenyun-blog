<template>
  <main class="w-full max-w-6xl mx-auto px-3 sm:px-6 pt-20 md:pt-24 pb-32 relative z-10 flex-1">
    <BackButton />

    <div class="mt-8">
      <h1 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">归档与探索</h1>
      <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">共 {{ posts.length }} 篇文章</p>

      <!-- Tags row -->
      <div v-if="tags.length > 0" class="flex flex-wrap gap-2 mb-4">
        <button
          @click="selectedTag = ''"
          :class="selectedTag === '' ? 'bg-accent text-white' : 'bg-white/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300'"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-colors border border-white/40 dark:border-white/10"
        >
          全部 ({{ posts.length }})
        </button>
        <button
          v-for="tag in tags"
          :key="tag.name"
          @click="selectedTag = tag.name"
          :class="selectedTag === tag.name ? 'bg-accent text-white' : 'bg-white/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300'"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-colors border border-white/40 dark:border-white/10"
        >
          {{ tag.name }} ({{ tag.count }})
        </button>
      </div>

      <!-- View mode toggle (separate row, right-aligned) -->
      <div class="flex justify-end mb-6">
        <div class="flex gap-2 p-1 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-white/40 dark:border-white/10">
          <button
            @click="viewMode = 'timeline'"
            :class="viewMode === 'timeline' ? 'bg-accent text-white shadow-md' : 'text-slate-500 hover:text-accent'"
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
            中枢链路
          </button>
          <button
            @click="viewMode = 'grid'"
            :class="viewMode === 'grid' ? 'bg-accent text-white shadow-md' : 'text-slate-500 hover:text-accent'"
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            矩阵网格
          </button>
        </div>
      </div>

      <!-- Timeline View (中枢链路) -->
      <div v-if="viewMode === 'timeline'" class="relative overflow-hidden p-2 md:p-8 min-h-[500px]">
        <!-- Center vertical line -->
        <div class="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2" :style="{ background: 'linear-gradient(to bottom, hsla(var(--hue), 70%, 55%, 0.5), hsla(270, 70%, 50%, 0.3), transparent)' }" />

        <div class="relative z-10 flex flex-col gap-12 md:gap-16">
          <div
            v-for="(post, i) in filteredPosts"
            :key="post.slug"
            class="relative flex flex-row items-center w-full"
          >
            <!-- Left side (even index) -->
            <div class="hidden md:block w-5/12 pr-4">
              <RouterLink
                v-if="i % 2 === 0"
                :to="`/posts/${post.slug}`"
                class="group block rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500"
              >
                <div class="relative overflow-hidden h-32">
                  <img :src="post.cover || siteConfig.defaultPostCover" :alt="post.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div class="p-4">
                  <p class="text-xs text-slate-400 mb-1">{{ post.date }}</p>
                  <h3 class="text-sm font-bold text-slate-800 dark:text-white mb-1">{{ post.title }}</h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400">{{ post.description }}</p>
                </div>
              </RouterLink>
            </div>

            <!-- Center dot -->
            <div class="z-20 flex items-center justify-center w-6 h-6 rounded-full bg-accent border-4 border-white dark:border-slate-900 shadow-lg shrink-0">
              <div class="w-2 h-2 rounded-full bg-white animate-pulse" />
            </div>

            <!-- Right side (odd index) or full width on mobile -->
            <div class="w-full md:w-5/12 pl-4">
              <RouterLink
                v-if="i % 2 === 1 || true"
                :to="`/posts/${post.slug}`"
                class="group block rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500"
                :class="{ 'md:opacity-0': i % 2 === 0 && false }"
              >
                <div class="relative overflow-hidden h-32" v-if="i % 2 === 1">
                  <img :src="post.cover || siteConfig.defaultPostCover" :alt="post.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div class="p-4">
                  <p class="text-xs text-slate-400 mb-1">{{ post.date }}</p>
                  <h3 class="text-sm font-bold text-slate-800 dark:text-white mb-1">{{ post.title }}</h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400">{{ post.description }}</p>
                  <div class="flex flex-wrap gap-1 mt-2">
                    <span v-for="tag in post.tags.slice(0,3)" :key="tag" class="px-1.5 py-0.5 bg-accent-soft text-accent rounded text-[10px] font-bold">{{ tag }}</span>
                  </div>
                </div>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Grid View (矩阵网格) -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <RouterLink
          v-for="(post, i) in filteredPosts"
          :key="post.slug"
          :to="`/posts/${post.slug}`"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 400, delay: i * 80 } }"
          class="group block rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500"
        >
          <div class="relative overflow-hidden h-40">
            <img :src="post.cover || siteConfig.defaultPostCover" :alt="post.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          </div>
          <div class="p-4">
            <p class="text-xs text-slate-400 mb-1">{{ post.date }}</p>
            <h3 class="text-sm font-bold text-slate-800 dark:text-white mb-1">{{ post.title }}</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">{{ post.description }}</p>
            <div class="flex flex-wrap gap-1 mt-2">
              <span v-for="tag in post.tags.slice(0,3)" :key="tag" class="px-1.5 py-0.5 bg-accent-soft text-accent rounded text-[10px] font-bold">{{ tag }}</span>
            </div>
            <span class="text-[10px] font-bold text-accent group-hover:translate-x-1 transition-transform">阅读 →</span>
          </div>
        </RouterLink>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getAllPosts } from '@/utils/markdown'
import { siteConfig } from '@/siteConfig'
import BackButton from '@/components/BackButton.vue'

const posts = getAllPosts()
const selectedTag = ref('')
const viewMode = ref<'timeline' | 'grid'>('timeline')

const tags = computed(() => {
  const counts: Record<string, number> = {}
  posts.forEach((p) => {
    p.tags.forEach((t) => {
      counts[t] = (counts[t] || 0) + 1
    })
  })
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
})

const filteredPosts = computed(() => {
  if (!selectedTag.value) return posts
  return posts.filter((p) => p.tags.includes(selectedTag.value))
})
</script>
