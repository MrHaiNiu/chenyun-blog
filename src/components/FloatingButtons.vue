<template>
  <!-- Bottom-right floating buttons -->
  <div class="fixed bottom-6 right-6 z-[9999] flex flex-col items-center gap-3">
    <!-- Music icon (above back-to-top) -->
    <button
      @click="scrollToMusic"
      class="w-12 h-12 rounded-full flex items-center justify-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xl hover:scale-110 transition-all duration-300 group"
      title="音乐"
    >
      <svg class="w-5 h-5 text-accent group-hover:animate-bounce" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
      </svg>
    </button>

    <!-- Back to top (rotating logo) -->
    <button
      @click="scrollToTop"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      class="w-12 h-12 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300 overflow-hidden relative group"
      title="回到顶部"
    >
      <!-- Logo image (visible when not hovering) -->
      <img
        v-show="!isHovered"
        src="/logo.png"
        alt="logo"
        class="w-full h-full object-cover animate-spin"
        style="animation-duration: 6s;"
      />
      <!-- Arrow icon (visible when hovering) -->
      <div
        v-show="isHovered"
        class="w-full h-full bg-accent flex items-center justify-center"
      >
        <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isHovered = ref(false)

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function scrollToMusic() {
  router.push('/music')
}
</script>
