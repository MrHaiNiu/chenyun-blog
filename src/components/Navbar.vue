<template>
  <header
    class="fixed top-0 left-0 right-0 z-[1000] transition-all duration-300"
    :class="{ '-translate-y-full': !showNav }"
  >
    <!-- Desktop Navbar -->
    <nav class="hidden md:flex items-center justify-between px-6 py-2.5 max-w-(--page-width) mx-auto">
      <!-- Left: Logo -->
      <RouterLink to="/" class="flex items-center gap-2 group flex-shrink-0">
        <img
          :src="siteConfig.avatarUrl"
          :alt="siteConfig.authorName"
          class="w-9 h-9 rounded-full object-cover shadow-md group-hover:rotate-[360deg] transition-transform duration-700"
        />
        <span class="text-base font-black text-[#000] tracking-wider">
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
          class="px-3 py-1.5 rounded-lg text-[0.925rem] font-bold transition-all duration-150 text-[#000] hover:bg-(--primary) hover:text-white"
        >
          首页
        </RouterLink>
        <!-- Other links: show theme-color background on active page -->
        <RouterLink
          v-for="link in otherNavLinks"
          :key="link.path"
          :to="link.path"
          class="px-3 py-1.5 rounded-lg text-[0.925rem] font-bold transition-all duration-150 text-[#000] hover:bg-(--primary) hover:text-white router-link-exact-active:bg-(--primary) router-link-exact-active:text-white"
        >
          {{ link.label }}
        </RouterLink>
      </div>

      <!-- Right: Settings + Theme toggle -->
      <div class="flex items-center gap-1 flex-shrink-0">
        <!-- Settings button -->
        <button
          id="settings-btn"
          @click="isSettingsOpen = !isSettingsOpen"
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
        <img
          :src="siteConfig.avatarUrl"
          :alt="siteConfig.authorName"
          class="w-8 h-8 rounded-full object-cover shadow-md"
        />
        <span class="text-sm font-black text-[#000] tracking-wider">
          {{ siteConfig.navTitle }}
          <span class="text-(--primary)">{{ siteConfig.navSuffix }}</span>
          {{ siteConfig.navAfter }}
        </span>
      </RouterLink>

      <div class="flex items-center gap-1">
        <button
          id="settings-btn"
          @click="isSettingsOpen = !isSettingsOpen"
          class="w-8 h-8 rounded-lg flex items-center justify-center text-black/70 dark:text-white/70 hover:bg-(--primary) hover:text-white transition-all duration-150"
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
        <button @click="toggleMobileMenu" class="w-8 h-8 rounded-lg flex items-center justify-center text-black/70 dark:text-white/70 hover:bg-(--primary) hover:text-white transition-all duration-150">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>

    <!-- Mobile menu -->
    <Transition name="mobile-menu">
      <div v-if="isMobileMenuOpen" class="md:hidden border-t border-black/5 dark:border-white/5">
        <RouterLink
          to="/"
          @click="isMobileMenuOpen = false"
          class="block px-6 py-2.5 text-[0.925rem] font-bold text-[#000] hover:bg-(--primary) hover:text-white transition-colors duration-150"
        >
          首页
        </RouterLink>
        <RouterLink
          v-for="link in otherNavLinks"
          :key="link.path"
          :to="link.path"
          @click="isMobileMenuOpen = false"
          class="block px-6 py-2.5 text-[0.925rem] font-bold text-[#000] hover:bg-(--primary) hover:text-white router-link-exact-active:bg-(--primary) router-link-exact-active:text-white transition-colors duration-150"
        >
          {{ link.label }}
        </RouterLink>
      </div>
    </Transition>

    <!-- Settings Panel -->
    <SettingsPanel
      :is-open="isSettingsOpen"
      @close="isSettingsOpen = false"
    />
  </header>
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

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.25s ease;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
