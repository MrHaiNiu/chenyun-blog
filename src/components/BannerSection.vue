<template>
  <!--
    wallpaperMode values:
      'banner'      — 完整横幅，高度由 bannerHeight 控制
      'fullscreen'  — 横幅拉到 100vh，所有 UI 元素保留
      'transparent' — 背景图全屏模糊，不显示横幅 UI 元素
      'solid'       — 不渲染横幅 section
  -->
  <section
    v-if="showBanner"
    class="relative w-full overflow-hidden flex flex-col items-center justify-center pt-20 md:pt-24"
    :style="{ height: bannerHeightStyle, minHeight: '350px' }"
  >
    <!-- Banner background images with Ken Burns zoom -->
    <div class="absolute inset-0 z-0 overflow-hidden">
      <Transition name="banner-fade">
        <div :key="currentBgIndex" class="w-full h-full" :class="{ 'banner-zoom': showGradient }">
          <img
            :src="bgImages[currentBgIndex]"
            alt="banner"
            class="w-full h-full object-cover"
          />
        </div>
      </Transition>
      <!-- Gradient overlay (controlled by wallpaperGradient switch) -->
      <div
        v-if="showGradient"
        class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40"
      />
    </div>

    <!-- ======== UI elements (only shown in 'banner' / 'fullscreen' mode) ======== -->
    <template v-if="showUIElements">
      <!-- Search bar (above the title) -->
      <div class="relative z-20 w-full max-w-2xl px-4 mb-6">
        <SearchBar />
      </div>

      <!-- Banner title (controlled by wallpaperTitle switch) -->
      <div v-if="showTitle" class="relative z-10 text-center px-4 mb-4">
        <h1 class="text-5xl md:text-7xl lg:text-8xl font-black drop-shadow-lg mb-2 lg:mb-4 tracking-wider"
          style="color: var(--primary)"
        >
          Chenyun
        </h1>
        <p class="text-lg md:text-2xl drop-shadow-md font-serif tracking-widest"
          style="color: var(--primary)"
        >
          の 宝藏之地
        </p>
      </div>

      <!-- Typewriter quote (controlled by wallpaperTitle switch) -->
      <div v-if="showTitle" class="relative z-10 text-center px-4 min-h-[2rem]">
        <Transition name="quote-fade" mode="out-in">
          <p :key="currentIndex" class="text-sm md:text-base font-serif"
            style="color: var(--primary)"
          >
            <span class="opacity-70">「</span>
            <span>{{ displayText }}</span>
            <span v-if="showCursor" class="animate-cursor opacity-70">|</span>
            <span class="opacity-70">」</span>
            <span class="block mt-1 text-xs opacity-60">{{ currentQuote.author }}</span>
          </p>
        </Transition>
      </div>

      <!-- Wave decoration at bottom (controlled by wallpaperRipple switch) -->
      <div v-if="showWaves" class="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
        <svg
          class="wave-svg-3 w-[200%] h-[60px] md:h-[80px]"
          viewBox="0 0 2880 80"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 C1680,80 1920,0 2160,40 C2400,80 2640,0 2880,40 L2880,80 L0,80 Z"
            fill="rgba(255,255,255,0.15)"
          />
        </svg>
        <svg
          class="wave-svg-2 absolute bottom-0 left-0 w-[200%] h-[50px] md:h-[60px]"
          viewBox="0 0 2880 60"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 C1680,60 1920,0 2160,30 C2400,60 2640,0 2880,30 L2880,60 L0,60 Z"
            fill="rgba(255,255,255,0.2)"
          />
        </svg>
        <svg
          class="wave-svg absolute bottom-0 left-0 w-[200%] h-[40px] md:h-[50px]"
          viewBox="0 0 2880 50"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,25 C240,50 480,0 720,25 C960,50 1200,0 1440,25 C1680,50 1920,0 2160,25 C2400,50 2640,0 2880,25 L2880,50 L0,50 Z"
            :fill="themeStore.isDark ? 'rgba(2,6,23,0.9)' : 'rgba(248,250,252,0.9)'"
          />
        </svg>
      </div>
    </template>
  </section>

  <!-- When banner hidden (solid / transparent mode) — just a minimal spacer (BackgroundSlider handles the background) -->
  <div v-else class="pt-16" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { siteConfig } from '@/siteConfig'
import { useThemeStore } from '@/stores/theme'
import SearchBar from '@/components/SearchBar.vue'

const themeStore = useThemeStore()

const bgImages = siteConfig.bgImages
const currentBgIndex = ref(0)
let bgTimer: ReturnType<typeof setInterval> | null = null

// ===== Wallpaper Mode =====
const wallpaperMode = ref<string>('solid')

function readWallpaperMode(): string {
  const attr = document.documentElement.getAttribute('data-wallpaper-mode')
  if (attr) return attr
  return localStorage.getItem('theme.wallpaperMode') || 'solid'
}

// ===== Wallpaper Toggle Switches =====
const showTitle = ref(true)
const showWaves = ref(true)
const showGradient = ref(true)

function loadWallpaperSwitches() {
  showTitle.value = localStorage.getItem('theme.wallpaperTitle') !== 'false'
  showWaves.value = localStorage.getItem('theme.wallpaperRipple') !== 'false'
  showGradient.value = localStorage.getItem('theme.wallpaperGradient') !== 'false'
}

// ===== Computed display logic =====
const showBanner = computed(() => {
  // 'solid' and 'transparent' modes — no banner at all
  return wallpaperMode.value !== 'solid' && wallpaperMode.value !== 'transparent'
})

const showUIElements = computed(() => {
  // Only show title/search/waves in 'banner' or 'fullscreen' modes
  return wallpaperMode.value === 'banner' || wallpaperMode.value === 'fullscreen'
})

const bannerHeightStyle = computed(() => {
  if (wallpaperMode.value === 'transparent') {
    return '100vh' // full-screen background image
  }
  if (wallpaperMode.value === 'fullscreen') {
    return '100vh'
  }
  // 'banner' mode — use user-configured height from themeStore
  return `${themeStore.bannerHeight}vh`
})

// ===== Carousel (controlled by wallpaperCarousel switch) =====
const carouselEnabled = ref(true)

function loadCarouselSetting() {
  carouselEnabled.value = localStorage.getItem('theme.wallpaperCarousel') !== 'false'
}

function reloadAllSettings() {
  wallpaperMode.value = readWallpaperMode()
  loadWallpaperSwitches()
  loadCarouselSetting()
}

// ===== Observer to detect data-wallpaper-mode changes =====
let modeObserver: MutationObserver | null = null

// ===== Wave toggle (from settings panel — waves-toggle custom event) =====
function onWavesToggle(e: Event) {
  const detail = (e as CustomEvent).detail
  showWaves.value = detail
}

// ===== Typewriter =====
const quotes = [
  { text: '代码是写给人看的，只是恰好机器也能执行。', author: '—— 架构格言' },
  { text: '万物皆可模拟，只是精度不同罢了。', author: '—— 计算化学' },
  { text: 'Stay hungry, Stay foolish. ', author: '—— Steve Jobs' },
  { text: '每一个 bug 都是成长的契机。', author: '—— 程序员哲学' },
  { text: '在代码与学术间穿梭，在理性与浪漫间游走。', author: '—— 宸云' },
  { text: '模拟不是万能的，但没有模拟是万万不能的。', author: '—— 分子动力学' },
  { text: '最好的代码，是没有代码。', author: '—— 极简主义' },
  { text: 'Hello World! ', author: '—— 一切的开始' },
]

const currentIndex = ref(0)
const currentQuote = ref(quotes[0])
const displayText = ref('')
const showCursor = ref(true)
const phase = ref<'typing' | 'pausing' | 'deleting' | 'paused'>('typing')
let typeTimer: ReturnType<typeof setInterval> | null = null

function startTypewriter() {
  displayText.value = ''
  phase.value = 'typing'
  if (typeTimer) clearInterval(typeTimer)
  typeTimer = setInterval(() => {
    tick()
  }, 80)
}

function tick() {
  const full = currentQuote.value.text
  if (phase.value === 'typing') {
    if (displayText.value.length < full.length) {
      displayText.value = full.slice(0, displayText.value.length + 1)
    } else {
      phase.value = 'pausing'
    }
  } else if (phase.value === 'pausing') {
    phase.value = 'paused'
    if (typeTimer) clearInterval(typeTimer)
    setTimeout(() => {
      phase.value = 'deleting'
      typeTimer = setInterval(() => {
        tick()
      }, 40)
    }, 2500)
  } else if (phase.value === 'deleting') {
    if (displayText.value.length > 0) {
      displayText.value = full.slice(0, displayText.value.length - 1)
    } else {
      if (typeTimer) clearInterval(typeTimer)
      setTimeout(() => {
        currentIndex.value = (currentIndex.value + 1) % quotes.length
        currentQuote.value = quotes[currentIndex.value]
        startTypewriter()
      }, 300)
    }
  }
}

// Watch phase for cursor
import { watch } from 'vue'
watch(phase, (p) => {
  showCursor.value = p !== 'paused'
})

// Watch carousel setting -> restart timer when toggled
watch(carouselEnabled, (enabled) => {
  if (bgTimer) {
    clearInterval(bgTimer)
    bgTimer = null
  }
  if (enabled && bgImages.length > 1) {
    bgTimer = setInterval(() => {
      currentBgIndex.value = (currentBgIndex.value + 1) % bgImages.length
    }, 8000)
  }
})

// Watch wallpaperMode changes to restart typewriter when UI becomes visible
watch(wallpaperMode, () => {
  if (typeTimer) clearInterval(typeTimer)
  if (showUIElements.value && showTitle.value) {
    startTypewriter()
  }
})

onMounted(() => {
  reloadAllSettings()

  // Start carousel if enabled
  if (carouselEnabled.value && bgImages.length > 1) {
    bgTimer = setInterval(() => {
      currentBgIndex.value = (currentBgIndex.value + 1) % bgImages.length
    }, 8000)
  }

  // Start typewriter if UI elements are visible
  if (showUIElements.value && showTitle.value) {
    startTypewriter()
  }

  // Listen for waves-toggle custom event
  window.addEventListener('waves-toggle', onWavesToggle as EventListener)
  window.addEventListener('wallpaper-settings-changed', reloadAllSettings)

  // MutationObserver to detect data-wallpaper-mode changes from SettingsPanel
  modeObserver = new MutationObserver(() => {
    const newMode = readWallpaperMode()
    if (newMode !== wallpaperMode.value) {
      wallpaperMode.value = newMode
    }
  })
  modeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-wallpaper-mode'] })

  // Also re-read settings when settings panel might have changed them
  // (storage event only fires from other tabs, so we poll on focus)
  window.addEventListener('focus', reloadAllSettings)
})

onUnmounted(() => {
  if (bgTimer) clearInterval(bgTimer)
  if (typeTimer) clearInterval(typeTimer)
  if (modeObserver) modeObserver.disconnect()
  window.removeEventListener('waves-toggle', onWavesToggle as EventListener)
  window.removeEventListener('wallpaper-settings-changed', reloadAllSettings)
  window.removeEventListener('focus', reloadAllSettings)
})
</script>

<style scoped>
.banner-fade-enter-active,
.banner-fade-leave-active {
  transition: opacity 1.5s ease;
}
.banner-fade-enter-from,
.banner-fade-leave-to {
  opacity: 0;
}
.quote-fade-enter-active,
.quote-fade-leave-active {
  transition: opacity 0.3s ease;
}
.quote-fade-enter-from,
.quote-fade-leave-to {
  opacity: 0;
}

/* Ken Burns zoom effect — matches carousel interval (8s) */
@keyframes bannerZoom {
  0%   { transform: scale(1.03); }
  100% { transform: scale(1.13); }
}
.banner-zoom {
  animation: bannerZoom 8s ease-out forwards;
  will-change: transform;
}
</style>
