<template>
  <main class="w-full max-w-6xl mx-auto px-3 sm:px-6 pt-20 md:pt-24 pb-32 relative z-10 flex-1">
    <BackButton />

    <div class="mt-8">
      <h1 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-8 text-center">友情链接</h1>

      <div class="max-w-sm mx-auto mb-6"><SearchBar /></div>

      <!-- Apply card -->
      <div class="mb-8 p-6 rounded-3xl bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl">
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
      <div v-motion :initial="{ opacity: 0 }" :visibleOnce="{ opacity: 1, transition: { duration: 600 } }" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <a
          v-for="(friend, i) in friendsData"
          :key="friend.id"
          :href="friend.url"
          target="_blank"
          rel="noopener noreferrer"
          v-motion
          :initial="{ opacity: 0, y: 30, scale: 0.9 }"
          :visibleOnce="{ opacity: 1, y: 0, scale: 1, transition: { duration: 500, delay: i * 100 } }"
          class="group rounded-3xl bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer p-5 flex items-center gap-4"
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
    </div>
  </main>
</template>

<script setup lang="ts">
import { siteConfig } from '@/siteConfig'
import { friendsData } from '@/data/friends'
import { useToastStore } from '@/stores/toast'
import BackButton from '@/components/BackButton.vue'
import SearchBar from '@/components/SearchBar.vue'

const toastStore = useToastStore()

function copyApplyFormat() {
  navigator.clipboard.writeText(siteConfig.friendLinkApplyFormat)
  toastStore.showToast('✨ 友链格式已复制', 'success')
}
</script>
