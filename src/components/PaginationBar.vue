<template>
  <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-8">
    <!-- Prev button -->
    <button
      @click="goToPage(currentPage - 1)"
      :disabled="currentPage === 1"
      class="px-3 py-2 rounded-lg text-sm font-bold transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
      :class="currentPage === 1
        ? 'bg-slate-200/50 dark:bg-slate-700/50 text-slate-400'
        : 'bg-glass-50 text-slate-700 dark:text-slate-300 hover:bg-accent hover:text-white'"
    >
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
    </button>

    <!-- Page numbers -->
    <button
      v-for="page in displayPages"
      :key="page"
      @click="goToPage(page)"
      class="w-9 h-9 rounded-lg text-sm font-bold transition-all duration-300"
      :class="page === currentPage
        ? 'bg-accent text-white shadow-lg scale-110'
        : 'bg-glass-50 text-slate-700 dark:text-slate-300 hover:bg-accent-soft'"
    >
      {{ page }}
    </button>

    <!-- Next button -->
    <button
      @click="goToPage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="px-3 py-2 rounded-lg text-sm font-bold transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
      :class="currentPage === totalPages
        ? 'bg-slate-200/50 dark:bg-slate-700/50 text-slate-400'
        : 'bg-glass-50 text-slate-700 dark:text-slate-300 hover:bg-accent hover:text-white'"
    >
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits<{ (e: 'page-change', page: number): void }>()

const displayPages = computed(() => {
  const pages: number[] = []
  const total = props.totalPages
  const current = props.currentPage

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push(-1) // ellipsis
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (current < total - 2) pages.push(-1) // ellipsis
    pages.push(total)
  }

  return pages.filter((p) => p !== -1 || true).filter((p) => p > 0)
})

function goToPage(page: number) {
  if (page < 1 || page > props.totalPages || page === props.currentPage) return
  emit('page-change', page)
}
</script>
