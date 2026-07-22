<template>
  <main class="w-full max-w-4xl mx-auto px-3 sm:px-6 pt-20 md:pt-24 pb-32 relative z-10 flex-1">
    <BackButton />

    <div class="mt-8">
      <h1 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">音乐</h1>
      <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">放松一下，听听歌吧</p>

      <div class="rounded-3xl bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl p-6 md:p-10">
        <div class="text-center py-12">
          <div class="text-5xl mb-4">🎵</div>
          <h3 class="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">音乐模块</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 font-serif max-w-md mx-auto">
            原站首页的云音乐歌词模块已替换为「佳句展示」。此页面保留音乐功能占位，后续可接入音乐 API。
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import BackButton from '@/components/BackButton.vue'
</script>
