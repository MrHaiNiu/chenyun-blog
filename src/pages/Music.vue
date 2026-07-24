<template>
  <div class="flex-1 flex flex-col">
    <BannerSection />
    <main class="w-full max-w-4xl mx-auto px-3 sm:px-6 pt-4 pb-32 relative z-10 flex-1">
    <BackButton />

    <div class="mt-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">音乐</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">放松一下，听听歌吧</p>
        </div>
        <div class="max-w-sm mt-3 sm:mt-0 sm:ml-4 shrink-0"><SearchBar inline :search-fn="searchMusic" placeholder="搜索歌曲..." /></div>
      </div>

      <div class="rounded-3xl bg-glass-40 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl p-6 md:p-10">
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
  </div>
</template>

<script setup lang="ts">
import BannerSection from '@/components/BannerSection.vue'
import BackButton from '@/components/BackButton.vue'
import SearchBar from '@/components/SearchBar.vue'
import type { SearchResultItem } from '@/components/SearchBar.vue'

function searchMusic(_query: string): SearchResultItem[] {
  // 音乐页面暂无数据，搜索返回空
  return []
}
</script>
