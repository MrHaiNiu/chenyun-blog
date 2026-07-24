<template>
  <div class="absolute inset-0 z-[-10] overflow-hidden" :class="{ 'opacity-0': !visible }">
    <div
      v-for="(img, i) in images"
      :key="img"
      class="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out transform-gpu"
      :class="{ 'blur-xl scale-110': blurred }"
      :style="{
        backgroundImage: `url(${img})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: i === index ? 1 : 0,
        visibility: Math.abs(i - index) <= 1 || (i === images.length - 1 && index === 0) ? 'visible' : 'hidden',
      }"
    />
    <!-- Gradient overlay for transparent mode -->
    <div
      v-if="blurred && showGradient"
      class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { siteConfig } from '@/siteConfig'

const images = siteConfig.bgImages
const index = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const visible = ref(true)
const blurred = ref(false)
const showGradient = ref(true)

let modeObserver: MutationObserver | null = null

function readWallpaperMode(): string {
  const attr = document.documentElement.getAttribute('data-wallpaper-mode')
  if (attr) return attr
  return localStorage.getItem('theme.wallpaperMode') || 'solid'
}

function loadGradientSetting() {
  showGradient.value = localStorage.getItem('theme.wallpaperGradient') !== 'false'
}

function applyMode() {
  const mode = readWallpaperMode()
  if (mode === 'solid') {
    visible.value = false
    blurred.value = false
  } else if (mode === 'transparent') {
    visible.value = true
    blurred.value = true
    loadGradientSetting()
  } else {
    // 'banner' / 'fullscreen' — hide to avoid double rendering with BannerSection
    visible.value = false
    blurred.value = false
  }
}

function reloadAllSettings() {
  applyMode()
}

onMounted(() => {
  applyMode()

  if (images.length <= 1) return
  timer = setInterval(() => {
    index.value = (index.value + 1) % images.length
  }, 10000)

  // MutationObserver to detect data-wallpaper-mode changes
  modeObserver = new MutationObserver(() => {
    applyMode()
  })
  modeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-wallpaper-mode'] })

  window.addEventListener('wallpaper-settings-changed', reloadAllSettings)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  if (modeObserver) modeObserver.disconnect()
  window.removeEventListener('wallpaper-settings-changed', reloadAllSettings)
})
</script>
