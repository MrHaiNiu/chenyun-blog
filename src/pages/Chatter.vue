<template>
  <main class="w-full max-w-4xl mx-auto px-3 sm:px-6 pt-20 md:pt-24 pb-32 relative z-10 flex-1">
    <BackButton />

    <div class="mt-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">说说</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">共 {{ chatters.length }} 条说说</p>
        </div>
        <div class="max-w-sm mt-3 sm:mt-0 sm:ml-4 shrink-0"><SearchBar inline :search-fn="searchChatters" placeholder="搜索说说..." /></div>
      </div>

      <div class="space-y-4">
        <div
          v-for="(chatter, i) in chatters"
          :key="chatter.slug"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 500, delay: i * 100 } }"
          class="rounded-3xl bg-glass-50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg p-5 md:p-6 transition-all duration-500 hover:shadow-xl"
        >
          <div class="flex items-start gap-3">
            <img
              :src="siteConfig.avatarUrl"
              :alt="siteConfig.authorName"
              class="w-10 h-10 rounded-full object-cover border-2 border-white/30 shadow-sm shrink-0"
            />
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-bold text-sm text-slate-800 dark:text-slate-200">{{ siteConfig.authorName }}</span>
                <span class="text-xs text-slate-400">{{ chatter.date }}</span>
              </div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white mb-2">{{ chatter.title }}</h3>
              <p class="text-sm text-slate-600 dark:text-slate-400 font-serif leading-relaxed">{{ chatter.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { chatters } from '@/data/chatters'
import { siteConfig } from '@/siteConfig'
import BackButton from '@/components/BackButton.vue'
import SearchBar from '@/components/SearchBar.vue'
import type { SearchResultItem } from '@/components/SearchBar.vue'

function searchChatters(query: string): SearchResultItem[] {
  const q = query.toLowerCase()
  return chatters
    .filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.content.toLowerCase().includes(q)
    )
    .map(c => ({
      title: c.title,
      description: c.description,
      tag: 'div',
      bindings: {},
    }))
}
</script>
