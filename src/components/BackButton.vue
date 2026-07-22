<template>
  <button
    @click="goBack"
    class="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-md hover:bg-accent hover:text-white transition-all duration-300 group"
  >
    <svg class="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
    <span class="text-sm font-bold">返回</span>
  </button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>
