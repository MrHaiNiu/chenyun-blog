<template>
  <div class="flex-1 flex flex-col">
    <!-- Banner Section (includes search + typewriter quote) -->
    <BannerSection />

    <!-- Main content area -->
    <main
      class="w-full mx-auto px-3 sm:px-4 md:px-6 pt-6 pb-32 relative z-10 flex-1"
      :style="{ maxWidth: themeStore.layoutMode === 'full' ? '100%' : '80rem' }"
    >
      <!-- 3-column layout (or full width if layout mode is 'full') -->
      <div
        :class="themeStore.layoutMode === 'full'
          ? 'grid grid-cols-1 gap-4 md:gap-6'
          : 'grid grid-cols-1 lg:grid-cols-[16rem_1fr] xl:grid-cols-[16rem_1fr_16rem] gap-4 md:gap-6'"
      >

        <!-- Left Sidebar: Profile Card + Greeting + Calendar (sticky) -->
        <aside v-if="themeStore.layoutMode === 'sidebar'" class="hidden lg:block">
          <div class="sticky top-24 flex flex-col gap-4">
            <ProfileCard
              :post-count="posts.length"
              :photo-count="photoCount"
              :friend-count="friendsData.length"
            />
            <DailyQuote />
            <CalendarWidget />
          </div>
        </aside>

        <!-- Center Column -->
        <div class="flex flex-col gap-4 md:gap-5 min-w-0">
          <!-- Article list with pagination (moved up to top) -->
          <!-- Filter indicator -->
          <div v-if="selectedTag" class="flex items-center gap-2 px-4 py-2 rounded-2xl bg-accent/10 border border-accent/20">
            <span class="text-sm text-slate-600 dark:text-slate-300">
              筛选：<span class="font-bold text-accent">{{ selectedTag }}</span>
            </span>
            <button
              @click="clearFilter"
              class="ml-auto text-xs font-bold px-3 py-1 rounded-lg bg-accent text-white hover:bg-accent/80 transition-colors"
            >
              清除筛选
            </button>
          </div>
          <ArticleCardGrid :posts="paginatedPosts" :max-count="100" />

          <!-- Pagination -->
          <PaginationBar
            :current-page="currentPage"
            :total-pages="totalPages"
            @page-change="onPageChange"
          />

          <!-- Dashboard -->
          <SiteDashboard />
        </div>

        <!-- Right Sidebar -->
        <aside v-if="themeStore.layoutMode === 'sidebar'" class="hidden xl:block">
          <div class="sticky top-24 flex flex-col gap-4">
            <GreetingCard />
            <CategoriesCard @select="onCategorySelect" />
            <SiteInfoCard />
            <MusicPlayer />
          </div>
        </aside>
      </div>
    </main>

    <!-- Footer -->
    <FooterBar />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { fetchArchivesPosts } from '@/utils/content-loader'
import type { PostMeta, Album, Friend } from '@/types'
import { useThemeStore } from '@/stores/theme'
import ProfileCard from '@/components/ProfileCard.vue'
import BannerSection from '@/components/BannerSection.vue'
import CalendarWidget from '@/components/CalendarWidget.vue'
import ArticleCardGrid from '@/components/ArticleCardGrid.vue'
import PaginationBar from '@/components/PaginationBar.vue'
import MusicPlayer from '@/components/MusicPlayer.vue'
import SiteDashboard from '@/components/SiteDashboard.vue'
import FooterBar from '@/components/FooterBar.vue'
import GreetingCard from '@/components/GreetingCard.vue'
import DailyQuote from '@/components/DailyQuote.vue'
import CategoriesCard from '@/components/CategoriesCard.vue'
import SiteInfoCard from '@/components/SiteInfoCard.vue'

const themeStore = useThemeStore()
const posts = ref<PostMeta[]>([])
const albums = ref<Album[]>([])
const friendsData = ref<Friend[]>([])
const photoCount = computed(() => albums.value.reduce((sum, a) => sum + a.photos.length, 0))

const selectedTag = ref('')
const filteredPosts = computed(() => {
  if (!selectedTag.value) return posts.value
  return posts.value.filter(p => p.tags.includes(selectedTag.value))
})

const POSTS_PER_PAGE = 4
const currentPage = ref(1)
const totalPages = computed(() => Math.max(1, Math.ceil(filteredPosts.value.length / POSTS_PER_PAGE)))
const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * POSTS_PER_PAGE
  return filteredPosts.value.slice(start, start + POSTS_PER_PAGE)
})

function onPageChange(page: number) {
  currentPage.value = page
  window.scrollTo({ top: 300, behavior: 'smooth' })
}

function onCategorySelect(category: string) {
  selectedTag.value = category
  currentPage.value = 1
}

function clearFilter() {
  selectedTag.value = ''
  currentPage.value = 1
}

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

  // 异步加载 Albums 和 Friends 数据
  const baseUrl = import.meta.env.BASE_URL || '/'
  try {
    const albumResp = await fetch(`${baseUrl}Gallery/albums.json?t=${Date.now()}`)
    if (albumResp.ok) albums.value = await albumResp.json()
  } catch (_e) { /* ignore */ }
  try {
    const friendResp = await fetch(`${baseUrl}Friends/friends.json?t=${Date.now()}`)
    if (friendResp.ok) friendsData.value = await friendResp.json()
  } catch (_e) { /* ignore */ }
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
})
</script>
