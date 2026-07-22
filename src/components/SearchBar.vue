<template>
  <div class="relative">
    <button
      @click="toggleSearch"
      class="w-full h-12 md:h-14 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg px-5 flex items-center gap-3 hover:shadow-xl transition-all duration-300 cursor-pointer group"
    >
      <svg class="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <span class="text-sm text-slate-500 dark:text-slate-400 font-medium flex-1 text-left">
        搜索文章...
      </span>
      <kbd class="hidden md:inline px-2 py-0.5 text-[10px] font-bold bg-slate-200/50 dark:bg-slate-700/50 rounded text-slate-500 dark:text-slate-400">Ctrl K</kbd>
    </button>

    <!-- Search overlay -->
    <Teleport to="body">
      <Transition name="search-overlay">
        <div
          v-if="isSearchOpen"
          class="fixed inset-0 z-[2000] flex items-start justify-center pt-20 px-4"
          @click.self="closeSearch"
        >
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeSearch" />
          <div class="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 overflow-hidden">
            <!-- Search input -->
            <div class="flex items-center gap-3 px-5 py-4 border-b border-slate-200/50 dark:border-slate-700/50">
              <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref="searchInputRef"
                v-model="searchQuery"
                type="text"
                placeholder="输入关键词搜索..."
                class="flex-1 bg-transparent outline-none text-slate-800 dark:text-white placeholder-slate-400 text-sm font-medium"
                @keydown.esc="closeSearch"
              />
              <button @click="closeSearch" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Results -->
            <div class="max-h-[60vh] overflow-y-auto">
              <!-- Only show results when there's a query -->
              <div v-if="!searchQuery.trim()" class="px-5 py-8 text-center text-sm text-slate-400">
                输入关键词开始搜索
              </div>
              <div v-else-if="searchResults.length === 0" class="px-5 py-8 text-center text-sm text-slate-400">
                未找到匹配的文章
              </div>
              <div v-else>
                <RouterLink
                  v-for="post in searchResults"
                  :key="post.slug"
                  :to="`/posts/${post.slug}`"
                  @click="closeSearch"
                  class="block px-5 py-3 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-200/30 dark:border-slate-700/30 last:border-0"
                >
                  <p class="text-sm font-bold text-slate-800 dark:text-slate-200" v-html="highlightMatch(post.title)" />
                  <p class="text-xs text-slate-400 mt-1 line-clamp-2" v-html="highlightMatch(post.description)" />
                  <div class="flex flex-wrap gap-1 mt-1.5">
                    <span v-for="tag in post.tags" :key="tag" class="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-[10px] font-bold text-slate-500 dark:text-slate-400">{{ tag }}</span>
                  </div>
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { getAllPosts } from '@/utils/markdown'
import type { PostMeta } from '@/types'

const posts = getAllPosts()
const isSearchOpen = ref(false)
const searchQuery = ref('')
const searchInputRef = ref<HTMLInputElement>()

const searchResults = computed<PostMeta[]>(() => {
  if (!searchQuery.value.trim()) return []
  const q = searchQuery.value.toLowerCase()
  return posts.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.tags.some(t => t.toLowerCase().includes(q))
  ).slice(0, 10)
})

function highlightMatch(text: string): string {
  if (!searchQuery.value.trim() || !text) return text
  const safeQuery = searchQuery.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${safeQuery})`, 'gi')
  return text.replace(regex, '<mark class="bg-accent-mid text-inherit rounded px-0.5">$1</mark>')
}

function toggleSearch() {
  isSearchOpen.value = !isSearchOpen.value
  if (isSearchOpen.value) {
    nextTick(() => searchInputRef.value?.focus())
  }
}

function closeSearch() {
  isSearchOpen.value = false
  searchQuery.value = ''
}

function handleKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    toggleSearch()
  }
  if (e.key === 'Escape' && isSearchOpen.value) {
    closeSearch()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.search-overlay-enter-active,
.search-overlay-leave-active {
  transition: opacity 0.25s ease;
}
.search-overlay-enter-from,
.search-overlay-leave-to {
  opacity: 0;
}
</style>
