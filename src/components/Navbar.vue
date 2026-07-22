<template>
  <div
    id="navbar"
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 group"
    :class="{ '-translate-y-full': !showNav }"
    data-transparent-mode="semi"
    data-is-home="true"
  >
    <div class="!overflow-visible max-w-[var(--page-width)] h-[4.5rem] mx-auto flex items-center justify-between px-4 mt-2
      bg-(--card-bg-transparent) backdrop-blur-md shadow-lg rounded-(--radius-large)
      transition-all duration-300 border border-black/5 dark:border-white/10">

      <!-- Logo -->
      <RouterLink
        to="/"
        class="btn-plain scale-animation rounded-lg h-[2.5rem] md:h-[3.25rem] px-5 font-bold active:scale-95 shrink-0 transition-all duration-300"
      >
        <div class="flex flex-row items-center text-md">
          <img
            :src="siteConfig.avatarUrl"
            :alt="siteConfig.authorName"
            class="h-[1.75rem] w-[1.75rem] mr-2 rounded-full object-contain"
          />
          <span class="dark:text-white text-black">
            {{ siteConfig.navTitle }}
            <span class="text-(--primary)">{{ siteConfig.navSuffix }}</span>
            {{ siteConfig.navAfter }}
          </span>
        </div>
      </RouterLink>

      <!-- Desktop links -->
      <div
        id="navbar-links-container"
        class="hidden md:flex items-center space-x-1 transition-opacity duration-300"
      >
        <RouterLink
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="btn-plain scale-animation rounded-lg h-11 font-bold w-11 lg:w-auto lg:px-5 active:scale-95 flex items-center justify-center lg:justify-start whitespace-nowrap"
        >
          <span class="hidden lg:inline truncate">{{ link.label }}</span>
        </RouterLink>
      </div>

      <!-- Right side -->
      <div class="flex items-center gap-1">
        <!-- Settings button -->
        <button
          id="display-settings-switch"
          @click="isSettingsOpen = !isSettingsOpen"
          class="btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90"
          aria-label="Display Settings"
        >
          <svg class="text-[1.25rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        <!-- Theme toggle -->
        <button
          @click="themeStore.toggleTheme()"
          class="btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90"
          aria-label="Toggle theme"
        >
          <svg v-if="!themeStore.isDark" class="text-[1.25rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else class="text-[1.25rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>

        <!-- Mobile hamburger -->
        <button
          id="nav-menu-switch"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="btn-plain scale-animation rounded-lg w-11 h-11 active:scale-90 md:!hidden"
          aria-label="Menu"
        >
          <svg class="text-[1.25rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile menu panel (Mizuki-style float panel) -->
    <div
      id="nav-menu-panel"
      class="float-panel fixed top-full mt-2 right-4 px-2 py-2 max-h-[80vh] overflow-y-auto min-w-[12rem] border border-black/5 dark:border-white/10"
      :class="{ 'float-panel-closed': !isMobileMenuOpen }"
    >
      <RouterLink
        v-for="link in navLinks"
        :key="link.path"
        :to="link.path"
        @click="isMobileMenuOpen = false"
        class="group flex items-center justify-between py-2 pl-3 pr-1 rounded-lg gap-4 hover:bg-(--btn-plain-bg-hover) active:bg-(--btn-plain-bg-active) transition text-black/75 dark:text-white/75 font-bold"
      >
        <span>{{ link.label }}</span>
      </RouterLink>
    </div>

    <!-- Settings Panel (Mizuki-style float panel) -->
    <SettingsPanel
      :is-open="isSettingsOpen"
      @close="isSettingsOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
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

// Click outside to close panels (Mizuki-style)
function handleClickOutside(e: MouseEvent) {
  const panels = ['display-setting', 'nav-menu-panel']
  const buttons = ['display-settings-switch', 'nav-menu-switch']

  panels.forEach((panelId, index) => {
    if (panelId === 'display-setting' && !isSettingsOpen.value) return
    if (panelId === 'nav-menu-panel' && !isMobileMenuOpen.value) return

    const panel = document.getElementById(panelId)
    const button = document.getElementById(buttons[index])
    if (panel && button && !panel.contains(e.target as Node) && !button.contains(e.target as Node)) {
      if (panelId === 'display-setting') isSettingsOpen.value = false
      if (panelId === 'nav-menu-panel') isMobileMenuOpen.value = false
    }
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('click', handleClickOutside)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* No scoped styles needed — all styling comes from global btn-plain, float-panel, and utility classes */
</style>
