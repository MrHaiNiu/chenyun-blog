<template>
  <article
    @click="$emit('click')"
    :class="[
      'post-card-wrapper card-base rounded-2xl md:rounded-3xl bg-glass-50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg overflow-hidden transition-all duration-500 hover:shadow-xl cursor-pointer relative animate-fade-in-up',
      mode === 'grid' ? 'flex flex-col' : 'flex flex-col md:flex-row',
      hasCover ? 'has-cover' : 'no-cover',
    ]"
    :style="{ animationDelay: `${index * 30}ms` }"
  >
    <!-- Content area -->
    <div
      :class="[
        'post-card-content pl-4 md:pl-9 pr-4 md:pr-2 pt-4 md:pt-7 pb-4 md:pb-7 relative flex flex-col h-full flex-1 min-w-0',
        mode === 'grid' ? 'w-full' : 'w-full md:w-[calc(100%-var(--coverWidth)-1.5rem)]',
      ]"
    >
      <!-- Title with decorative bar -->
      <h3
        @click.stop="$emit('click')"
        class="post-card-title font-black text-slate-900 dark:text-white mb-3 leading-tight cursor-pointer
          hover:text-accent dark:hover:text-accent-light transition-colors
          relative pl-0 md:pl-0
          before:w-1 before:h-5 before:rounded-md before:bg-accent
          before:absolute before:top-[6px] before:left-0
          before:hidden md:before:block"
        :class="mode === 'grid' ? 'text-base md:text-lg' : 'text-lg md:text-xl'"
      >
        {{ post.title }}
      </h3>

      <!-- Tags -->
      <div v-if="post.tags.length > 0 && mode === 'list'" class="flex flex-wrap gap-1.5 mb-2">
        <span
          v-for="tag in post.tags.slice(0, 3)"
          :key="tag"
          class="px-2 py-0.5 bg-accent-soft text-accent dark:text-accent-light rounded-md text-[10px] font-bold"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Description -->
      <p
        class="description text-sm text-slate-600 dark:text-slate-400 font-serif leading-relaxed line-clamp-2 mb-3 flex-1"
        :title="post.description"
      >
        {{ post.description }}
      </p>

      <!-- Stats (date + reading time) -->
      <div class="stats flex items-center gap-3 mt-auto pt-2 text-xs text-slate-400 dark:text-slate-500">
        <span class="flex items-center gap-1">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span class="font-bold">{{ formattedDate }}</span>
        </span>
        <span class="flex items-center gap-1">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6l4 2" />
            <circle cx="12" cy="12" r="10" />
          </svg>
          <span class="font-bold">{{ readingTime }} min</span>
        </span>
        <span class="flex-1 text-right text-accent group-hover:translate-x-1 transition-transform font-bold">
          阅读更多 →
        </span>
      </div>
    </div>

    <!-- Cover image -->
    <div
      v-if="hasCover"
      :class="[
        'post-card-image overflow-hidden',
        mode === 'grid'
          ? 'w-full aspect-[16/9] relative bg-slate-100 dark:bg-slate-800'
          : 'w-full md:w-(--coverWidth) relative md:absolute md:top-4 md:bottom-4 md:right-4 aspect-[16/10] md:aspect-auto rounded-none md:rounded-xl',
      ]"
    >
      <img
        :src="post.cover || siteConfig.defaultPostCover"
        :alt="post.title"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent md:bg-gradient-to-l" />
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
  mode?: 'list' | 'grid'
}>()

defineEmits<{ (e: 'click'): void }>()

const hasCover = computed(() => {
  return props.post.cover || siteConfig.defaultPostCover
})

const formattedDate = computed(() => {
  try {
    const date = new Date(props.post.date)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  } catch {
    return props.post.date
  }
})

const readingTime = computed(() => {
  const wordCount = (props.post.description || '').split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / 200))
})
</script>

<style scoped>
.post-card-wrapper {
  --coverWidth: 30%;
}
</style>
