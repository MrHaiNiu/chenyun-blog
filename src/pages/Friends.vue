<template>
  <div class="flex-1 flex flex-col">
    <BannerSection />
    <main class="w-full max-w-6xl mx-auto px-3 sm:px-6 pt-4 pb-32 relative z-10 flex-1">
    <BackButton />

    <div class="mt-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">友情链接</h1>
        <div class="max-w-sm mt-3 sm:mt-0 sm:ml-4 shrink-0"><SearchBar inline :search-fn="searchFriends" placeholder="搜索友链..." /></div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-20 text-slate-400">
        <div class="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-2"></div>
        <p class="text-sm">加载中...</p>
      </div>

      <template v-else>
        <!-- Apply card -->
        <div class="mb-8 p-6 rounded-3xl bg-glass-40 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl">
          <h3 class="text-lg font-black text-slate-900 dark:text-white mb-3">申请友链</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400 mb-3">请按以下格式提交申请：</p>
          <pre class="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs font-mono text-slate-700 dark:text-slate-300 overflow-x-auto">{{ siteConfig.friendLinkApplyFormat }}</pre>
          <button
            @click="copyApplyFormat"
            class="mt-3 px-4 py-2 bg-accent text-white rounded-xl text-sm font-bold hover:bg-accent-dark transition-colors"
          >
            复制格式
          </button>
        </div>

        <!-- Friends grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <a
            v-for="(friend, i) in friendsData"
            :key="friend.id"
            :href="friend.url"
            target="_blank"
            rel="noopener noreferrer"
            class="group rounded-3xl bg-glass-40 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer p-5 flex items-center gap-4 animate-fade-in-up"
            :style="{ animationDelay: `${i * 30}ms` }"
          >
            <img :src="friend.avatar" :alt="friend.name" class="w-16 h-16 rounded-full object-cover border-2 border-white/30 shadow-md" loading="lazy" />
            <div>
              <h4 class="text-base font-black text-slate-900 dark:text-white group-hover:text-accent dark:group-hover:text-accent-light transition-colors">
                {{ friend.name }}
              </h4>
              <p class="text-xs text-slate-600 dark:text-slate-400 mt-1 font-serif line-clamp-2">
                {{ friend.description }}
              </p>
            </div>
          </a>
        </div>
      </template>
    </div>
  </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { siteConfig } from '@/siteConfig'
import { useToastStore } from '@/stores/toast'
import BannerSection from '@/components/BannerSection.vue'
import BackButton from '@/components/BackButton.vue'
import SearchBar from '@/components/SearchBar.vue'
import type { SearchResultItem } from '@/components/SearchBar.vue'
import type { Friend } from '@/types'

const toastStore = useToastStore()
const friendsData = ref<Friend[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const baseUrl = import.meta.env.BASE_URL || '/'
    const resp = await fetch(`${baseUrl}Friends/friends.json?t=${Date.now()}`)
    if (resp.ok) {
      friendsData.value = await resp.json()
    }
  } catch (e) {
    console.error('[Friends] 加载失败:', e)
  } finally {
    loading.value = false
  }
})

function copyApplyFormat() {
  navigator.clipboard.writeText(siteConfig.friendLinkApplyFormat)
  toastStore.showToast('✨ 友链格式已复制', 'success')
}

function searchFriends(query: string): SearchResultItem[] {
  const q = query.toLowerCase()
  return friendsData.value
    .filter(f =>
      f.name.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q)
    )
    .map(f => ({
      title: f.name,
      description: f.description,
      tag: 'a' as const,
      bindings: { href: f.url, target: '_blank', rel: 'noopener noreferrer' },
    }))
}
</script>
