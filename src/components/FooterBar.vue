<template>
  <footer class="relative z-10 mt-auto border-t border-dashed border-slate-300 dark:border-slate-700 py-8">
    <div class="max-w-4xl mx-auto px-4 flex flex-col items-center justify-center gap-2">
      <!-- Copyright with rotating logo -->
      <div class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <span>© 2026 Chenyun Sr.</span>
        <img
          src="/logo.png"
          alt="logo"
          class="w-6 h-6 rounded-full object-cover animate-spin"
          style="animation-duration: 4s;"
        />
        <span>保留所有权利</span>
      </div>

      <!-- ICP -->
      <a
        v-if="siteConfig.icpConfig"
        :href="siteConfig.icpConfig.link"
        target="_blank"
        rel="noopener noreferrer"
        class="text-xs text-slate-400 hover:text-accent transition-colors border-b border-dashed border-slate-400 dark:border-slate-500 pb-0.5"
      >
        {{ siteConfig.icpConfig.name }}
      </a>

      <!-- Tech badges -->
      <div class="flex items-center gap-2 mt-2">
        <span class="px-2 py-1 bg-white/50 dark:bg-slate-700/50 rounded-md text-[10px] font-bold text-green-600 dark:text-green-400">💚 Vue 3</span>
        <span class="px-2 py-1 bg-white/50 dark:bg-slate-700/50 rounded-md text-[10px] font-bold text-purple-600 dark:text-purple-400">⚡ Vite</span>
        <span class="px-2 py-1 bg-white/50 dark:bg-slate-700/50 rounded-md text-[10px] font-bold text-cyan-600 dark:text-cyan-400">🎨 TailwindCSS</span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { siteConfig } from '@/siteConfig'
</script>
