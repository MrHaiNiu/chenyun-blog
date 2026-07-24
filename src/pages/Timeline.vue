<template>
  <div class="flex-1 flex flex-col">
    <BannerSection />
    <main
      class="w-full mx-auto px-3 sm:px-4 md:px-6 pt-4 pb-32 relative z-10 flex-1"
      :style="{ maxWidth: themeStore.layoutMode === 'full' ? '100%' : '80rem' }"
    >
      <!-- 3-column layout -->
      <div
        :class="themeStore.layoutMode === 'full'
          ? 'grid grid-cols-1 gap-4 md:gap-6'
          : 'grid grid-cols-1 lg:grid-cols-[16rem_1fr] xl:grid-cols-[16rem_1fr_16rem] gap-4 md:gap-6'"
      >
        <!-- Left Sidebar -->
        <aside v-if="themeStore.layoutMode === 'sidebar'" class="hidden lg:block">
          <div class="sticky top-24 flex flex-col gap-4">
            <div class="flex justify-start">
                <BackButton />
              </div>
              <ProfileCard :post-count="posts.length" :photo-count="0" :friend-count="0" />
            <GreetingCard />
            <CalendarWidget />
          </div>
        </aside>

        <!-- Center Column: Timeline content -->
        <div class="flex flex-col gap-4 min-w-0">
          <div class="rounded-3xl bg-glass-50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl p-4 md:p-6">
            <!-- Header: title + search -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h1 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">归档与探索</h1>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">共 {{ posts.length }} 篇文章</p>
              </div>
              <div class="max-w-sm mt-3 sm:mt-0 sm:ml-4 shrink-0">
                <SearchBar inline :search-fn="searchPosts" placeholder="搜索文章..." />
              </div>
            </div>

            <!-- Loading state -->
            <div v-if="loading" class="flex items-center justify-center py-20">
              <div class="flex flex-col items-center gap-3">
                <div class="w-8 h-8 border-3 border-accent border-t-transparent rounded-full animate-spin" />
                <p class="text-sm text-slate-400">加载中...</p>
              </div>
            </div>

            <!-- Tags row -->
            <div v-if="!loading && tags.length > 0" class="flex flex-wrap gap-2 mb-4">
              <button
                @click="selectedTag = ''"
                :class="selectedTag === '' ? 'bg-accent text-white' : 'bg-glass-50 text-slate-700 dark:text-slate-300'"
                class="px-3 py-1.5 rounded-xl text-xs font-bold transition-colors border border-white/40 dark:border-white/10"
              >
                全部 ({{ posts.length }})
              </button>
              <button
                v-for="tag in tags"
                :key="tag.name"
                @click="selectedTag = tag.name"
                :class="selectedTag === tag.name ? 'bg-accent text-white' : 'bg-glass-50 text-slate-700 dark:text-slate-300'"
                class="px-3 py-1.5 rounded-xl text-xs font-bold transition-colors border border-white/40 dark:border-white/10"
              >
                {{ tag.name }} ({{ tag.count }})
              </button>
            </div>

            <!-- View mode toggle + sort -->
            <div class="flex justify-end mb-6">
              <div class="flex gap-2 p-1 bg-glass-50 rounded-xl border border-white/40 dark:border-white/10">
                <!-- Sort toggle -->
                <button
                  @click="sortAscending = !sortAscending"
                  class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all"
                  :class="sortAscending ? 'bg-accent text-white shadow-md' : 'text-slate-500 hover:text-accent'"
                  :title="sortAscending ? '从新到旧' : '从旧到新'"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                </button>
                <div class="w-px bg-slate-200 dark:bg-slate-600/50" />
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

            <!-- Timeline View -->
            <div v-if="viewMode === 'timeline'" class="relative overflow-hidden p-2 md:p-8 min-h-[500px]">
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
                      class="group block rounded-2xl bg-glass-50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500"
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
                      class="group block rounded-2xl bg-glass-50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500"
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

            <!-- Grid View -->
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <RouterLink
                v-for="(post, i) in filteredPosts"
                :key="post.slug"
                :to="`/posts/${post.slug}`"
                class="group block rounded-2xl bg-glass-50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 animate-fade-in-up"
                :style="{ animationDelay: `${i * 60}ms` }"
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
        </div>

        <!-- Right Sidebar -->
        <aside v-if="themeStore.layoutMode === 'sidebar'" class="hidden xl:block">
          <div class="sticky top-24 flex flex-col gap-4">
            <DailyQuote />
            <CategoriesCard />
            <SiteInfoCard />
            <MusicPlayer />
          </div>
        </aside>
      </div>
    </main>

    <FooterBar />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { fetchArchivesPosts } from '@/utils/markdown'
import type { PostMeta } from '@/types'
import { siteConfig } from '@/siteConfig'
import { useThemeStore } from '@/stores/theme'
import BannerSection from '@/components/BannerSection.vue'
import BackButton from '@/components/BackButton.vue'
import SearchBar from '@/components/SearchBar.vue'
import ProfileCard from '@/components/ProfileCard.vue'
import GreetingCard from '@/components/GreetingCard.vue'
import CalendarWidget from '@/components/CalendarWidget.vue'
import DailyQuote from '@/components/DailyQuote.vue'
import CategoriesCard from '@/components/CategoriesCard.vue'
import SiteInfoCard from '@/components/SiteInfoCard.vue'
import MusicPlayer from '@/components/MusicPlayer.vue'
import FooterBar from '@/components/FooterBar.vue'
import type { SearchResultItem } from '@/components/SearchBar.vue'

const themeStore = useThemeStore()
const posts = ref<PostMeta[]>([])
const loading = ref(true)

/** 检查 posts 列表是否发生了变化（基于 slug 列表） */
function postsHaveChanged(a: PostMeta[], b: PostMeta[]): boolean {
  if (a.length !== b.length) return true
  const slugsA = a.map(p => p.slug).sort().join(',')
  const slugsB = b.map(p => p.slug).sort().join(',')
  return slugsA !== slugsB
}

let pollTimer: ReturnType<typeof setInterval> | null = null

onMounted(async () => {
  posts.value = await fetchArchivesPosts()
  loading.value = false

  // 每 3 秒轮询一次，检测 Archives 是否有新增/删除的文件
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

const selectedTag = ref('')
const viewMode = ref<'timeline' | 'grid'>('grid')
const sortAscending = ref(false)

const tags = computed(() => {
  const counts: Record<string, number> = {}
  posts.value.forEach((p) => {
    p.tags.forEach((t) => {
      counts[t] = (counts[t] || 0) + 1
    })
  })
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
})

const filteredPosts = computed(() => {
  let result = posts.value
  if (selectedTag.value) {
    result = posts.value.filter((p) => p.tags.includes(selectedTag.value))
  }
  let sorted = [...result]
  if (sortAscending.value) {
    sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  } else {
    sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }
  return sorted
})

function searchPosts(query: string): SearchResultItem[] {
  const q = query.toLowerCase()
  return posts.value
    .filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    )
    .map(p => ({
      title: p.title,
      description: p.description,
      tag: 'RouterLink',
      bindings: { to: `/posts/${p.slug}` },
    }))
}
</script>
