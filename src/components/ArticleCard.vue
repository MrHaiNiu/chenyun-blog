<template>
  <article
    v-motion
    :initial="{ opacity: 0, y: 20 }"
    :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 500, delay: index * 80 } }"
    @click="$emit('click')"
    class="group rounded-2xl md:rounded-3xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg overflow-hidden transition-all duration-500 hover:shadow-xl cursor-pointer flex flex-col md:flex-row"
  >
    <!-- Cover image -->
    <div class="relative overflow-hidden md:w-64 shrink-0 aspect-[16/10] md:aspect-auto">
      <img
        :src="post.cover || siteConfig.defaultPostCover"
        :alt="post.title"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:bg-gradient-to-r" />
    </div>

    <!-- Content -->
    <div class="flex-1 p-5 md:p-6 flex flex-col">
      <!-- Tags -->
      <div v-if="post.tags.length > 0" class="flex flex-wrap gap-1.5 mb-2">
        <span
          v-for="tag in post.tags.slice(0, 3)"
          :key="tag"
          class="px-2 py-0.5 bg-accent-soft text-accent dark:text-accent-light rounded-md text-[10px] font-bold"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Title -->
      <h3 class="text-base md:text-lg font-black text-slate-900 dark:text-white group-hover:text-accent dark:group-hover:text-accent-light transition-colors mb-2 line-clamp-2">
        {{ post.title }}
      </h3>

      <!-- Description -->
      <p class="text-sm text-slate-600 dark:text-slate-400 font-serif leading-relaxed line-clamp-2 mb-3 flex-1">
        {{ post.description }}
      </p>

      <!-- Meta -->
      <div class="flex items-center justify-between mt-auto">
        <div class="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span class="font-bold">{{ formattedDate }}</span>
        </div>
        <span class="text-xs font-bold text-accent group-hover:translate-x-1 transition-transform">
          阅读更多 →
        </span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { siteConfig } from '@/siteConfig'
import type { PostMeta } from '@/types'

const props = defineProps<{
  post: PostMeta
  index: number
}>()

defineEmits<{ (e: 'click'): void }>()

const formattedDate = computed(() => {
  try {
    const date = new Date(props.post.date)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  } catch {
    return props.post.date
  }
})
</script>
