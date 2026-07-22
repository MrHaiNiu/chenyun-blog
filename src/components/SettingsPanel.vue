<template>
  <Teleport to="body">
    <Transition name="settings-panel">
      <div v-if="isOpen" class="fixed inset-0 z-[2000]">
        <!-- Overlay backdrop -->
        <div
          class="absolute inset-0 bg-black/30 backdrop-blur-sm"
          @click="close"
        />

        <!-- Panel (right-side drawer) -->
        <div class="absolute top-0 right-0 h-full w-[340px] max-w-[90vw] bg-white dark:bg-slate-800 shadow-2xl overflow-y-auto">
          <!-- Header -->
          <div class="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-800">
            <h2 class="text-base font-black text-slate-800 dark:text-white">设置</h2>
            <button @click="close" class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="px-5 py-5 space-y-6">
            <!-- ========== Theme Color ========== -->
            <section>
              <div class="flex items-center gap-2 mb-3">
                <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300">Theme Color</h3>
              </div>
              <div class="flex items-center gap-3">
                <input
                  v-model.number="localHue"
                  type="range"
                  min="0"
                  max="360"
                  class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                  :style="{ background: `linear-gradient(to right, hsl(0,70%,55%), hsl(60,70%,55%), hsl(120,70%,55%), hsl(180,70%,55%), hsl(240,70%,55%), hsl(300,70%,55%), hsl(360,70%,55%))` }"
                  @input="onHueChange"
                />
                <div
                  class="w-8 h-8 rounded-full flex-shrink-0 border-2 border-white/50 shadow"
                  :style="{ background: `hsl(${localHue}, 70%, 55%)` }"
                />
              </div>
            </section>

            <!-- ========== Wallpaper ========== -->
            <section>
              <div class="flex items-center gap-2 mb-3">
                <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300">Wallpaper</h3>
              </div>
              <div class="space-y-2">
                <input
                  v-model="localWallpaper"
                  type="text"
                  placeholder="输入壁纸 URL（留空恢复默认）"
                  class="w-full px-3 py-2 text-xs rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 outline-none focus:ring-2 focus:ring-accent/30"
                  @input="onWallpaperInput"
                />
                <div class="flex gap-2">
                  <button
                    @click="setWallpaper('')"
                    class="flex-1 px-2 py-1.5 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    默认
                  </button>
                  <button
                    @click="setWallpaper('https://bu.dusays.com/2026/03/24/69c26fe4acdb5.jpg')"
                    class="flex-1 px-2 py-1.5 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    应用
                  </button>
                </div>
              </div>
            </section>

            <!-- ========== Banner Options ========== -->
            <section>
              <div class="flex items-center gap-2 mb-3">
                <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300">Banner Options</h3>
              </div>
              <div class="space-y-3">
                <!-- Banner toggle -->
                <div class="flex items-center justify-between">
                  <span class="text-xs text-slate-500 dark:text-slate-400">显示横幅</span>
                  <button
                    @click="toggleBanner"
                    class="relative w-10 h-5 rounded-full transition-colors duration-200"
                    :class="themeStore.bannerEnabled ? 'bg-accent' : 'bg-slate-300 dark:bg-slate-600'"
                  >
                    <div
                      class="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200"
                      :class="themeStore.bannerEnabled ? 'translate-x-5' : 'translate-x-0.5'"
                    />
                  </button>
                </div>
                <!-- Banner height -->
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-xs text-slate-500 dark:text-slate-400">横幅高度</span>
                    <span class="text-xs font-bold text-slate-600 dark:text-slate-300">{{ localBannerHeight }}vh</span>
                  </div>
                  <input
                    v-model.number="localBannerHeight"
                    type="range"
                    min="30"
                    max="100"
                    class="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-slate-200 dark:bg-slate-700"
                    @input="onBannerHeightChange"
                  />
                </div>
                <!-- Waves toggle -->
                <div class="flex items-center justify-between">
                  <span class="text-xs text-slate-500 dark:text-slate-400">显示波浪</span>
                  <button
                    @click="toggleWaves"
                    class="relative w-10 h-5 rounded-full transition-colors duration-200"
                    :class="wavesEnabled ? 'bg-accent' : 'bg-slate-300 dark:bg-slate-600'"
                  >
                    <div
                      class="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200"
                      :class="wavesEnabled ? 'translate-x-5' : 'translate-x-0.5'"
                    />
                  </button>
                </div>
              </div>
            </section>

            <!-- ========== Layout ========== -->
            <section>
              <div class="flex items-center gap-2 mb-3">
                <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
                <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300">Layout</h3>
              </div>
              <div class="space-y-3">
                <!-- Layout mode -->
                <div class="flex gap-2">
                  <button
                    @click="setLayout('sidebar')"
                    class="flex-1 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors"
                    :class="themeStore.layoutMode === 'sidebar' ? 'bg-accent text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'"
                  >
                    侧栏布局
                  </button>
                  <button
                    @click="setLayout('full')"
                    class="flex-1 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors"
                    :class="themeStore.layoutMode === 'full' ? 'bg-accent text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'"
                  >
                    全宽布局
                  </button>
                </div>
                <!-- Page width -->
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-xs text-slate-500 dark:text-slate-400">页面宽度</span>
                    <span class="text-xs font-bold text-slate-600 dark:text-slate-300">{{ localPageWidth }}rem</span>
                  </div>
                  <input
                    v-model.number="localPageWidth"
                    type="range"
                    min="48"
                    max="100"
                    class="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-slate-200 dark:bg-slate-700"
                    @input="onPageWidthChange"
                  />
                </div>
                <!-- Card radius -->
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-xs text-slate-500 dark:text-slate-400">卡片圆角</span>
                    <span class="text-xs font-bold text-slate-600 dark:text-slate-300">{{ localCardRadius }}px</span>
                  </div>
                  <input
                    v-model.number="localCardRadius"
                    type="range"
                    min="0"
                    max="32"
                    class="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-slate-200 dark:bg-slate-700"
                    @input="onCardRadiusChange"
                  />
                </div>
              </div>
            </section>

            <!-- Reset -->
            <button
              @click="resetSettings"
              class="w-full px-4 py-2.5 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
            >
              恢复默认设置
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '@/stores/theme'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const themeStore = useThemeStore()

const localHue = ref(themeStore.themeHue)
const localWallpaper = ref(themeStore.wallpaperUrl)
const localBannerHeight = ref(themeStore.bannerHeight)
const localPageWidth = ref(themeStore.pageWidth)
const localCardRadius = ref(themeStore.cardRadius)
const wavesEnabled = ref(localStorage.getItem('blog-waves-enabled') !== 'false')

// Sync when panel opens
watch(() => props.isOpen, (open) => {
  if (open) {
    localHue.value = themeStore.themeHue
    localWallpaper.value = themeStore.wallpaperUrl
    localBannerHeight.value = themeStore.bannerHeight
    localPageWidth.value = themeStore.pageWidth
    localCardRadius.value = themeStore.cardRadius
    wavesEnabled.value = localStorage.getItem('blog-waves-enabled') !== 'false'
  }
})

function onHueChange() { themeStore.setHue(localHue.value) }
function onWallpaperInput() { /* debounce - apply on blur or button */ }
function setWallpaper(url: string) { localWallpaper.value = url; themeStore.setWallpaper(url) }
function toggleBanner() { themeStore.setBannerEnabled(!themeStore.bannerEnabled) }
function onBannerHeightChange() { themeStore.setBannerHeight(localBannerHeight.value) }
function setLayout(mode: 'sidebar' | 'full') { themeStore.setLayoutMode(mode) }
function onPageWidthChange() { themeStore.setPageWidth(localPageWidth.value) }
function onCardRadiusChange() { themeStore.setCardRadius(localCardRadius.value) }
function toggleWaves() {
  wavesEnabled.value = !wavesEnabled.value
  localStorage.setItem('blog-waves-enabled', `${wavesEnabled.value}`)
  // Dispatch event for BannerSection to pick up
  window.dispatchEvent(new CustomEvent('waves-toggle', { detail: wavesEnabled.value }))
}
function resetSettings() {
  themeStore.resetSettings()
  localHue.value = 240
  localWallpaper.value = ''
  localBannerHeight.value = 60
  localPageWidth.value = 75
  localCardRadius.value = 24
  wavesEnabled.value = true
  localStorage.setItem('blog-waves-enabled', 'true')
  window.dispatchEvent(new CustomEvent('waves-toggle', { detail: true }))
}
function close() { emit('close') }

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.isOpen) {
    close()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.settings-panel-enter-active,
.settings-panel-leave-active {
  transition: opacity 0.3s ease;
}
.settings-panel-enter-active > div:last-child,
.settings-panel-leave-active > div:last-child {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.settings-panel-enter-from,
.settings-panel-leave-to {
  opacity: 0;
}
.settings-panel-enter-from > div:last-child,
.settings-panel-leave-to > div:last-child {
  transform: translateX(100%);
}

/* Slider thumb styling */
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: white;
  border: 2px solid var(--primary, hsl(240, 70%, 55%));
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

input[type="range"]::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: white;
  border: 2px solid var(--primary, hsl(240, 70%, 55%));
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
</style>
