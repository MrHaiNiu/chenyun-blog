<template>
  <section
    v-if="themeStore.bannerEnabled"
    class="relative w-full overflow-hidden flex flex-col items-center justify-center"
    :style="{ height: `${themeStore.bannerHeight}vh`, minHeight: '350px' }"
  >
    <!-- Banner background images -->
    <div class="absolute inset-0 z-0">
      <Transition name="banner-fade">
        <img
          :key="currentBgIndex"
          :src="bgImages[currentBgIndex]"
          alt="banner"
          class="w-full h-full object-cover"
        />
      </Transition>
      <div class="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />
    </div>

    <!-- Search bar (above the title) -->
    <div class="relative z-20 w-full max-w-2xl px-4 mb-6">
      <SearchBar />
    </div>

    <!-- Banner title -->
    <div class="relative z-10 text-center px-4 mb-4">
      <h1 class="text-5xl md:text-7xl lg:text-8xl font-black text-white drop-shadow-lg mb-2 lg:mb-4 tracking-wider">
        Chenyun
      </h1>
      <p class="text-lg md:text-2xl text-white/90 drop-shadow-md font-serif tracking-widest">
        の 宝藏之地
      </p>
    </div>

    <!-- Typewriter quote -->
    <div class="relative z-10 text-center px-4 min-h-[2rem]">
      <Transition name="quote-fade" mode="out-in">
        <p :key="currentIndex" class="text-sm md:text-base text-white/80 font-serif">
          <span class="text-white/60">「</span>
          <span>{{ displayText }}</span>
          <span v-if="showCursor" class="animate-cursor text-white/60">|</span>
          <span class="text-white/60">」</span>
          <span class="block mt-1 text-xs text-white/50">{{ currentQuote.author }}</span>
        </p>
      </Transition>
    </div>

    <!-- Wave decoration at bottom -->
    <div v-if="wavesEnabled" class="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
      <!-- Wave layer 1 (back, lightest) -->
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
      <!-- Wave layer 2 (middle) -->
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
      <!-- Wave layer 3 (front, solid) -->
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
  </section>

  <!-- When banner disabled, show minimal spacer -->
  <section v-else class="pt-16" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { siteConfig } from '@/siteConfig'
import { useThemeStore } from '@/stores/theme'
import SearchBar from '@/components/SearchBar.vue'

const themeStore = useThemeStore()

const bgImages = siteConfig.bgImages
const currentBgIndex = ref(0)
let bgTimer: ReturnType<typeof setInterval> | null = null

// Wave toggle (from settings panel)
const wavesEnabled = ref(localStorage.getItem('blog-waves-enabled') !== 'false')

function onWavesToggle(e: Event) {
  const detail = (e as CustomEvent).detail
  wavesEnabled.value = detail
}

// ===== Typewriter =====
const quotes = [
  { text: '代码是写给人看的，只是恰好机器也能执行。', author: '—— 架构格言' },
  { text: '万物皆可模拟，只是精度不同罢了。', author: '—— 计算化学' },
  { text: 'Stay hungry, Stay foolish. ', author: '—— Steve Jobs' },
  { text: '每一个 bug 都是成长的契机。', author: '—— 程序员哲学' },
  { text: '在代码与学术间穿梭，在理性与浪漫间游走。', author: '—— Chenyun' },
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
    // Wait ~3s
    let count = 0
    const waitInterval = setInterval(() => {
      count++
      if (count >= 35) {
        clearInterval(waitInterval)
        phase.value = 'deleting'
      }
    }, 100)
    // Use a simpler approach: set a timeout
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
      // Move to next quote
      if (typeTimer) clearInterval(typeTimer)
      setTimeout(() => {
        currentIndex.value = (currentIndex.value + 1) % quotes.length
        currentQuote.value = quotes[currentIndex.value]
        startTypewriter()
      }, 300)
    }
  }
}

watch(phase, (p) => {
  showCursor.value = p !== 'paused'
})

onMounted(() => {
  if (bgImages.length > 1) {
    bgTimer = setInterval(() => {
      currentBgIndex.value = (currentBgIndex.value + 1) % bgImages.length
    }, 8000)
  }
  startTypewriter()
  window.addEventListener('waves-toggle', onWavesToggle as EventListener)
})

onUnmounted(() => {
  if (bgTimer) clearInterval(bgTimer)
  if (typeTimer) clearInterval(typeTimer)
  window.removeEventListener('waves-toggle', onWavesToggle as EventListener)
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
</style>
