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
            <GreetingCard />
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
            <DailyQuote />
            <CategoriesCard />
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
import { ref, computed } from 'vue'
import { getAllPosts } from '@/utils/markdown'
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
import GreetingCard from '@/components/GreetingCard.vue'
import DailyQuote from '@/components/DailyQuote.vue'
import CategoriesCard from '@/components/CategoriesCard.vue'
import SiteInfoCard from '@/components/SiteInfoCard.vue'

const themeStore = useThemeStore()
const posts = getAllPosts()
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
