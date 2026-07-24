<template>
  <div
    class="group relative cursor-pointer overflow-hidden rounded-3xl bg-glass-50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl transition-all duration-700 hover:scale-[1.02]"
  >
    <!-- Gradient glow -->
    <div class="absolute -top-10 -right-10 w-40 h-40 bg-accent-softer dark:bg-accent-light/10 rounded-full blur-3xl group-hover:bg-accent-mid transition-all duration-700" />

    <!-- Avatar section with floating animation -->
    <div class="relative pt-8 pb-4 flex flex-col items-center">
      <div class="relative mb-4 flex items-center justify-center">
        <div class="w-24 h-24 rounded-full overflow-hidden bg-white dark:bg-slate-800">
          <img
            :src="siteConfig.avatarUrl"
            :alt="siteConfig.authorName"
            @click.stop="goToAbout"
            class="w-full h-full object-cover object-[54%_center] profile-avatar-float group-hover:rotate-[360deg] transition-transform duration-700 cursor-pointer"
          />
        </div>
      </div>

      <h2 class="text-lg font-black text-slate-900 dark:text-white">{{ siteConfig.authorName }}</h2>
      <div class="w-8 h-0.5 bg-accent mx-auto rounded-full my-2" />
      <p class="text-xs text-slate-500 dark:text-slate-400 font-serif leading-relaxed px-4 text-center">
        {{ bioText }}
      </p>
    </div>

    <!-- Stats -->
    <div class="flex justify-around px-4 py-3 border-t border-slate-200/50 dark:border-slate-700/50">
      <button
        v-for="stat in stats"
        :key="stat.label"
        @click.stop="stat.action"
        class="flex flex-col items-center group/stat hover:scale-110 transition-transform duration-300"
      >
        <span class="text-lg font-black text-slate-900 dark:text-white group-hover/stat:text-accent transition-colors">{{ stat.value }}</span>
        <span class="text-[10px] text-slate-500 dark:text-slate-400 group-hover/stat:text-accent transition-colors">{{ stat.label }}</span>
      </button>
    </div>

    <!-- Social links -->
    <div class="flex justify-center gap-3 py-3 border-t border-slate-200/50 dark:border-slate-700/50">
      <a
        v-for="link in socialLinks"
        :key="link.type"
        :href="link.url"
        :target="link.url ? '_blank' : undefined"
        :rel="link.url ? 'noopener noreferrer' : undefined"
        @click.stop="link.onClick"
        class="w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-accent hover:text-white transition-all duration-300 hover:scale-110"
      >
        <!-- GitHub -->
        <svg v-if="link.type === 'github'" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
        </svg>
        <!-- Email -->
        <svg v-else-if="link.type === 'email'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <!-- Wechat -->
        <svg v-else-if="link.type === 'wechat'" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.5 13.5c-3.59 0-6.5-2.42-6.5-5.4 0-2.98 2.91-5.4 6.5-5.4s6.5 2.42 6.5 5.4c0 2.98-2.91 5.4-6.5 5.4zm7.5 7.8c-2.76 0-5-2.02-5-4.5 0-2.48 2.24-4.5 5-4.5s5 2.02 5 4.5c0 2.48-2.24 4.5-5 4.5z" />
        </svg>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { siteConfig } from '@/siteConfig'
import { useToastStore } from '@/stores/toast'
import { fetchAboutBio } from '@/utils/markdown'

const props = defineProps<{
  postCount: number
  photoCount: number
  friendCount: number
}>()

const router = useRouter()
const toastStore = useToastStore()
const bioText = ref(siteConfig.bio)

onMounted(async () => {
  const fmBio = await fetchAboutBio()
  if (fmBio) bioText.value = fmBio
})

function goToAbout() {
  router.push('/about')
}

const stats = computed(() => [
  { label: '文章', value: props.postCount, action: () => router.push('/timeline') },
  { label: '照片', value: props.photoCount, action: () => router.push('/gallery') },
  { label: '友链', value: props.friendCount, action: () => router.push('/friends') },
])

const socialLinks = computed(() =>
  siteConfig.socialLinks.map((link) => ({
    ...link,
    onClick: link.type === 'wechat' ? (e: Event) => {
      e.preventDefault()
      navigator.clipboard.writeText('g2875135523')
      toastStore.showToast('✨ 微信已复制到剪贴板', 'success')
    } : undefined,
  }))
)
</script>

<style scoped>
@keyframes profileFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
</style>
