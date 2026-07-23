<template>
  <div class="w-full">
    <!-- Section header -->
    <div class="flex items-center gap-3 mb-4">
      <span class="w-8 md:w-12 h-[1px] bg-slate-300 dark:bg-slate-700" />
      <h3 class="text-lg md:text-xl font-black text-slate-800 dark:text-white tracking-widest uppercase">
        最新文章
      </h3>
      <!-- List/Grid toggle -->
      <div class="flex gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 ml-2">
        <button
          @click="isGrid = false"
          class="p-1.5 rounded-md transition-all duration-200"
          :class="!isGrid ? 'bg-white dark:bg-slate-600 text-accent shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'"
          title="列表布局"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </button>
        <button
          @click="isGrid = true"
          class="p-1.5 rounded-md transition-all duration-200"
          :class="isGrid ? 'bg-white dark:bg-slate-600 text-accent shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'"
          title="网格布局"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
          </svg>
        </button>
      </div>
      <span class="flex-1 h-[1px] bg-slate-300 dark:bg-slate-700" />
      <RouterLink
        to="/timeline"
        class="text-xs md:text-sm font-bold text-accent hover:text-accent-dark dark:hover:text-accent-light transition-colors"
      >
        全部 →
      </RouterLink>
    </div>

    <!-- Article List (list mode) -->
    <div v-if="!isGrid" class="flex flex-col gap-4 md:gap-5">
      <ArticleCard
        v-for="(post, i) in displayPosts"
        :key="post.slug"
        :post="post"
        :index="i"
        mode="list"
        @click="goToPost(post.slug)"
      />
    </div>

    <!-- Article Grid (grid mode) -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
      <ArticleCard
        v-for="(post, i) in displayPosts"
        :key="post.slug"
        :post="post"
        :index="i"
        mode="grid"
        @click="goToPost(post.slug)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { PostMeta } from '@/types'
import ArticleCard from '@/components/ArticleCard.vue'

const props = defineProps<{ posts: PostMeta[]; maxCount?: number }>()
const router = useRouter()

const isGrid = ref(false)

const displayPosts = computed(() =>
  props.posts.slice(0, props.maxCount || 8)
)

function goToPost(slug: string) {
  router.push(`/posts/${slug}`)
}
</script>

<style scoped>
/* Minimal override: grid mode cards get height: 100% from their wrapper */
</style>
