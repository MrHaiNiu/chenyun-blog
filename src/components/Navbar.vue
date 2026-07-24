<template>
  <header
    class="fixed top-0 left-0 right-0 z-[1000] transition-all duration-300"
    :class="{ '-translate-y-full': !showNav }"
  >
    <!-- Desktop Navbar -->
    <nav class="hidden md:flex items-center justify-between px-6 py-2.5 max-w-(--page-width) mx-auto">
      <!-- Left: Logo -->
      <RouterLink to="/" class="flex items-center gap-2 group flex-shrink-0">
        <span class="w-11 h-11 rounded-full overflow-hidden bg-white dark:bg-slate-800 inline-flex items-center justify-center flex-shrink-0">
          <img
            :src="siteConfig.avatarUrl"
            :alt="siteConfig.authorName"
            class="w-full h-full object-cover object-[54%_center] group-hover:rotate-[360deg] transition-transform duration-700"
          />
        </span>
        <span class="text-base font-black text-black/75 dark:text-white/75 tracking-wider">
          {{ siteConfig.navTitle }}
          <span class="text-(--primary)">{{ siteConfig.navSuffix }}</span>
          {{ siteConfig.navAfter }}
        </span>
      </RouterLink>

      <!-- Center: Navigation Links -->
      <div class="absolute left-1/2 -translate-x-1/2 flex items-center gap-0.5">
        <!-- Home link: no persistent active background -->
        <RouterLink
          to="/"
          class="px-3 py-1.5 rounded-lg text-[0.925rem] font-bold transition-all duration-150 text-black/75 dark:text-white/75 hover:bg-(--primary) hover:text-white"
        >
          首页
        </RouterLink>
        <!-- Other links: show theme-color background on active page -->
        <RouterLink
          v-for="link in otherNavLinks"
          :key="link.path"
          :to="link.path"
          class="px-3 py-1.5 rounded-lg text-[0.925rem] font-bold transition-all duration-150 text-black/75 dark:text-white/75 hover:bg-(--primary) hover:text-white router-link-exact-active:bg-(--primary) router-link-exact-active:text-white"
        >
          {{ link.label }}
        </RouterLink>
      </div>

      <!-- Right: Search (when banner hidden) + Settings + Theme toggle -->
      <div class="flex items-center gap-1 flex-shrink-0">
        <!-- Compact search bar when banner is hidden (wallpaperMode = transparent or solid) -->
        <div v-if="bannerHidden" class="flex items-center">
          <input
            v-model="navSearchQuery"
            @keydown.enter="onNavSearch"
            type="text"
            placeholder="搜索文章..."
            class="w-28 lg:w-36 h-8 px-3 text-xs rounded-lg bg-white/80 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-(--primary) transition-colors"
          />
        </div>

        <!-- Settings button -->
        <button
          id="settings-btn"
          @click.stop="isSettingsOpen = !isSettingsOpen"
          class="w-9 h-9 rounded-lg flex items-center justify-center text-black/70 dark:text-white/70 hover:bg-(--primary) hover:text-white transition-all duration-150"
          title="设置"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        <!-- Theme toggle -->
        <button
          @click="themeStore.toggleTheme()"
          class="w-9 h-9 rounded-lg flex items-center justify-center text-black/70 dark:text-white/70 hover:bg-(--primary) hover:text-white transition-all duration-150"
          title="切换主题"
        >
          <svg v-if="!themeStore.isDark" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
      </div>
    </nav>

    <!-- Mobile Navbar -->
    <nav class="flex md:hidden items-center justify-between px-4 py-2.5">
      <RouterLink to="/" class="flex items-center gap-2 group">
        <span class="w-8 h-8 rounded-full overflow-hidden bg-white dark:bg-slate-800 inline-flex items-center justify-center flex-shrink-0">
          <img
            :src="siteConfig.avatarUrl"
            :alt="siteConfig.authorName"
            class="w-full h-full object-cover object-[54%_center]"
          />
        </span>
        <span class="text-sm font-black text-black/75 dark:text-white/75 tracking-wider">
          {{ siteConfig.navTitle }}
          <span class="text-(--primary)">{{ siteConfig.navSuffix }}</span>
          {{ siteConfig.navAfter }}
        </span>
      </RouterLink>

      <div class="flex items-center gap-1">
        <!-- Mobile search when banner hidden -->
        <div v-if="bannerHidden" class="flex items-center">
          <input
            v-model="navSearchQuery"
            @keydown.enter="onNavSearch"
            type="text"
            placeholder="搜索..."
            class="w-20 h-7 px-2 text-xs rounded-lg bg-white/80 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-(--primary) transition-colors"
          />
        </div>
        <!-- Mobile Settings button (Mizuki-style: gear before theme toggle) -->
        <button
          @click.stop="isSettingsOpen = !isSettingsOpen"
          class="w-8 h-8 rounded-lg flex items-center justify-center text-black/70 dark:text-white/70 hover:bg-(--primary) hover:text-white transition-all duration-150"
          title="设置"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        <button
          @click="themeStore.toggleTheme()"
          class="w-8 h-8 rounded-lg flex items-center justify-center text-black/70 dark:text-white/70 hover:bg-(--primary) hover:text-white transition-all duration-150"
        >
          <svg v-if="!themeStore.isDark" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
        <button
          id="mobile-menu-btn"
          @click.stop="toggleMobileMenu"
          class="mobile-menu-btn w-8 h-8 rounded-lg flex items-center justify-center text-black/70 dark:text-white/70 hover:bg-(--primary) hover:text-white transition-all duration-150"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>

  </header>

  <!-- Mobile menu floating panel (Mizuki-style) -->
  <div class="fixed inset-0 z-[2000] md:hidden"
    :class="{ 'pointer-events-none': !isMobileMenuOpen }"
  >
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-black/30 transition-opacity duration-200 cursor-default"
      :class="{ 'opacity-100': isMobileMenuOpen, 'opacity-0': !isMobileMenuOpen }"
      @click="isMobileMenuOpen = false"
    />
    <!-- Floating panel -->
    <div
      class="absolute top-16 right-3 w-56 mobile-menu-panel"
      :class="{ 'is-closed': !isMobileMenuOpen }"
    >
      <div class="bg-white dark:bg-[#181926] rounded-xl shadow-xl border border-black/5 dark:border-white/10 overflow-hidden">
        <RouterLink
          to="/"
          @click="isMobileMenuOpen = false"
          class="flex items-center gap-3 px-4 py-3 text-sm font-bold text-black/75 dark:text-white/75 hover:bg-(--primary) hover:text-white transition-colors"
        >
          首页
        </RouterLink>
        <div class="h-px bg-black/5 dark:bg-white/5" />
        <RouterLink
          v-for="link in otherNavLinks"
          :key="link.path"
          :to="link.path"
          @click="isMobileMenuOpen = false"
          class="flex items-center gap-3 px-4 py-3 text-sm font-bold text-black/75 dark:text-white/75 hover:bg-(--primary) hover:text-white router-link-exact-active:bg-(--primary) router-link-exact-active:text-white transition-colors"
        >
          {{ link.label }}
          <svg class="w-4 h-4 ml-auto opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </RouterLink>
      </div>
    </div>
  </div>

  <!-- Settings Panel (outside header to avoid transform / stacking issues) -->
  <SettingsPanel
    :is-open="isSettingsOpen"
    @close="isSettingsOpen = false"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { siteConfig } from '@/siteConfig'
import { useThemeStore } from '@/stores/theme'
import SettingsPanel from '@/components/SettingsPanel.vue'

const themeStore = useThemeStore()
const showNav = ref(true)
const lastScrollY = ref(0)
const isMobileMenuOpen = ref(false)
const isSettingsOpen = ref(false)

// ===== Navigation search (when banner hidden) =====
const navSearchQuery = ref('')
const bannerHidden = ref(false)

function readWallpaperMode(): string {
  const attr = document.documentElement.getAttribute('data-wallpaper-mode')
  if (attr) return attr
  return localStorage.getItem('theme.wallpaperMode') || 'solid'
}

function updateBannerHidden() {
  const mode = readWallpaperMode()
  bannerHidden.value = mode === 'transparent' || mode === 'solid'
}

function onNavSearch() {
  const q = navSearchQuery.value.trim()
  if (!q) return
  // Navigate to home and let the browser handle the search
  window.location.href = `${import.meta.env.BASE_URL || '/'}?s=${encodeURIComponent(q)}`
}

const navLinks = [
  { path: '/', label: '首页' },
  { path: '/projects', label: '项目' },
  { path: '/timeline', label: '归档' },
  { path: '/gallery', label: '照片墙' },
  { path: '/music', label: '音乐' },
  { path: '/chatter', label: '说说' },
  { path: '/friends', label: '友链' },
  { path: '/about', label: '关于' },
]

const otherNavLinks = computed(() => navLinks.filter(l => l.path !== '/'))

function handleScroll() {
  const currentScrollY = window.scrollY
  if (currentScrollY > lastScrollY.value && currentScrollY > 100) {
    showNav.value = false
  } else {
    showNav.value = true
  }
  lastScrollY.value = currentScrollY
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

let modeObserver: MutationObserver | null = null

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })

  // Initialize bannerHidden state
  updateBannerHidden()

  // Observe data-wallpaper-mode changes from SettingsPanel
  modeObserver = new MutationObserver(() => {
    updateBannerHidden()
  })
  modeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-wallpaper-mode'] })

  // Also re-read on focus (for cross-tab changes)
  window.addEventListener('focus', updateBannerHidden)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (modeObserver) modeObserver.disconnect()
  window.removeEventListener('focus', updateBannerHidden)
})
</script>

<style scoped>
/* Mizuki-style mobile menu panel animation */
.mobile-menu-panel {
  transform-origin: top right;
  transition: transform 0.15s ease-out, opacity 0.15s ease-out;
}
.mobile-menu-panel.is-closed {
  transform: scale(0.65, 0);
  opacity: 0;
  pointer-events: none;
}
.mobile-menu-panel:not(.is-closed) {
  transform: scale(1, 1);
  opacity: 1;
}
</style>
