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

        <!-- Left Sidebar: Profile Card + Calendar (sticky) -->
        <aside v-if="themeStore.layoutMode === 'sidebar'" class="hidden lg:block">
          <div class="sticky top-24 flex flex-col gap-4">
            <ProfileCard
              :post-count="posts.length"
              :photo-count="photoCount"
              :friend-count="friendsData.length"
            />
            <CalendarWidget />
          </div>
        </aside>

        <!-- Center Column -->
        <div class="flex flex-col gap-4 md:gap-5 min-w-0">
          <!-- Article list with pagination (moved up to top) -->
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
            <MusicPlayer />

            <!-- Recent posts -->
            <div
              class="rounded-3xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg p-4"
            >
              <h4 class="text-sm font-black text-slate-800 dark:text-white mb-3">近期文章</h4>
              <RouterLink
                v-for="post in recentPosts"
                :key="post.slug"
                :to="`/posts/${post.slug}`"
                class="block py-1.5 border-b border-slate-200/30 dark:border-slate-700/30 last:border-0 hover:text-accent transition-colors"
              >
                <p class="text-xs font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
                  {{ post.title }}
                </p>
                <p class="text-[10px] text-slate-400 mt-1">{{ post.date }}</p>
              </RouterLink>
            </div>
          </div>
        </aside>
      </div>
    </main>

    <!-- Footer -->
    <FooterBar />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getAllPosts, getRecentPosts } from '@/utils/markdown'
import { albums } from '@/data/albums'
import { friendsData } from '@/data/friends'
import { useThemeStore } from '@/stores/theme'
import ProfileCard from '@/components/ProfileCard.vue'
import BannerSection from '@/components/BannerSection.vue'
import CalendarWidget from '@/components/CalendarWidget.vue'
import ArticleCardGrid from '@/components/ArticleCardGrid.vue'
import PaginationBar from '@/components/PaginationBar.vue'
import MusicPlayer from '@/components/MusicPlayer.vue'
import SiteDashboard from '@/components/SiteDashboard.vue'
import FooterBar from '@/components/FooterBar.vue'

const themeStore = useThemeStore()
const posts = getAllPosts()
const recentPosts = getRecentPosts(5)
const photoCount = computed(() => albums.reduce((sum, a) => sum + a.photos.length, 0))

const POSTS_PER_PAGE = 4
const currentPage = ref(1)
const totalPages = computed(() => Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE)))
const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * POSTS_PER_PAGE
  return posts.slice(start, start + POSTS_PER_PAGE)
})

function onPageChange(page: number) {
  currentPage.value = page
  window.scrollTo({ top: 300, behavior: 'smooth' })
}
</script>
