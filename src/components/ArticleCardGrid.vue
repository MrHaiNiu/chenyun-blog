<template>
  <div class="w-full">
    <!-- Section header -->
    <div class="flex items-center gap-3 mb-4">
      <span class="w-8 md:w-12 h-[1px] bg-slate-300 dark:bg-slate-700" />
      <h3 class="text-lg md:text-xl font-black text-slate-800 dark:text-white tracking-widest uppercase">
        最新文章
      </h3>
      <span class="flex-1 h-[1px] bg-slate-300 dark:bg-slate-700" />
      <RouterLink
        to="/timeline"
        class="text-xs md:text-sm font-bold text-accent hover:text-accent-dark dark:hover:text-accent-light transition-colors"
      >
        全部 →
      </RouterLink>
    </div>

    <!-- Article List -->
    <div class="flex flex-col gap-4 md:gap-5">
      <ArticleCard
        v-for="(post, i) in displayPosts"
        :key="post.slug"
        :post="post"
        :index="i"
        @click="goToPost(post.slug)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { PostMeta } from '@/types'
import ArticleCard from '@/components/ArticleCard.vue'

const props = defineProps<{ posts: PostMeta[]; maxCount?: number }>()
const router = useRouter()

const displayPosts = computed(() =>
  props.posts.slice(0, props.maxCount || 8)
)

function goToPost(slug: string) {
  router.push(`/posts/${slug}`)
}
</script>
