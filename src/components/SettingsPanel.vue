<template>
  <div
    class="absolute top-full right-4 w-80 mt-2 z-[2000] float-panel"
    :class="{ 'float-panel-closed': !isOpen }"
  >
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden max-h-[70vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-slate-200/50 dark:border-slate-700/50">
        <h2 class="text-base font-black text-slate-800 dark:text-white">设置</h2>
        <button @click="close" class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="px-4 py-3 space-y-4">
        <!-- ========== Theme Color ========== -->
        <section>
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300 relative ml-3
              before:w-1 before:h-4 before:rounded-md before:bg-(--primary)
              before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2"
            >
              主题色
            </h3>
            <div class="flex items-center gap-1">
              <div class="w-8 h-6 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 rounded">
                {{ localHue }}
              </div>
            </div>
          </div>
          <div class="w-full h-6 px-1 rounded select-none"
            :style="{ background: 'linear-gradient(to right, hsl(0,70%,55%), hsl(60,70%,55%), hsl(120,70%,55%), hsl(180,70%,55%), hsl(240,70%,55%), hsl(300,70%,55%), hsl(360,70%,55%))' }"
          >
            <input
              aria-label="Theme Color"
              type="range"
              min="0"
              max="360"
              step="5"
              v-model.number="localHue"
              class="slider color-slider w-full"
              @input="onHueChange"
            />
          </div>
        </section>

        <!-- ========== Wallpaper ========== -->
        <section>
          <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300 relative ml-3 mb-2
            before:w-1 before:h-4 before:rounded-md before:bg-(--primary)
            before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2"
          >
            壁纸
          </h3>
          <div class="space-y-2">
            <input
              v-model="localWallpaper"
              type="text"
              placeholder="输入壁纸 URL（留空恢复默认）"
              class="w-full px-3 py-2 text-xs rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 outline-none focus:ring-2 focus:ring-(--primary)/30"
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
          <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300 relative ml-3 mb-2
            before:w-1 before:h-4 before:rounded-md before:bg-(--primary)
            before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2"
          >
            横幅选项
          </h3>
          <div class="space-y-1">
            <!-- Banner toggle (Mizuki-style) -->
            <button
              class="w-full rounded-lg py-2.5 px-3 flex items-center gap-3 text-left active:scale-[0.98] transition-all bg-slate-100 dark:bg-slate-700/50"
              :class="{ 'bg-slate-200 dark:bg-slate-600/50': themeStore.bannerEnabled }"
              @click="toggleBanner"
            >
              <svg class="w-[1.125rem] h-[1.125rem] shrink-0 opacity-80 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="text-xs font-bold flex-1 text-slate-700 dark:text-slate-300">显示横幅</span>
              <div
                class="w-10 h-[22px] rounded-full transition-all duration-200 relative shrink-0"
                :class="themeStore.bannerEnabled ? 'bg-(--primary)' : 'bg-slate-300 dark:bg-slate-600'"
              >
                <div
                  class="absolute top-[3px] w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200"
                  :class="themeStore.bannerEnabled ? 'left-[23px]' : 'left-[3px]'"
                />
              </div>
            </button>

            <!-- Banner height slider (Mizuki-style) -->
            <div class="rounded-lg bg-slate-100 dark:bg-slate-700/50 p-2.5">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-medium text-slate-500 dark:text-slate-400">横幅高度</span>
                <span class="text-xs text-slate-600 dark:text-slate-300 font-mono">{{ localBannerHeight }}vh</span>
              </div>
              <input
                aria-label="Banner height"
                type="range"
                min="30"
                max="100"
                v-model.number="localBannerHeight"
                class="slider range-slider w-full"
                @input="onBannerHeightChange"
              />
            </div>

            <!-- Waves toggle (Mizuki-style) -->
            <button
              class="w-full rounded-lg py-2.5 px-3 flex items-center gap-3 text-left active:scale-[0.98] transition-all bg-slate-100 dark:bg-slate-700/50"
              :class="{ 'bg-slate-200 dark:bg-slate-600/50': wavesEnabled }"
              @click="toggleWaves"
            >
              <svg class="w-[1.125rem] h-[1.125rem] shrink-0 opacity-80 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 4h.01M10 4h.01M14 4h.01M18 4h.01M6 20h.01M10 20h.01M14 20h.01M18 20h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M3 8h18M3 16h18" />
              </svg>
              <span class="text-xs font-bold flex-1 text-slate-700 dark:text-slate-300">显示波浪</span>
              <div
                class="w-10 h-[22px] rounded-full transition-all duration-200 relative shrink-0"
                :class="wavesEnabled ? 'bg-(--primary)' : 'bg-slate-300 dark:bg-slate-600'"
              >
                <div
                  class="absolute top-[3px] w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200"
                  :class="wavesEnabled ? 'left-[23px]' : 'left-[3px]'"
                />
              </div>
            </button>
          </div>
        </section>

        <!-- ========== Layout ========== -->
        <section>
          <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300 relative ml-3 mb-2
            before:w-1 before:h-4 before:rounded-md before:bg-(--primary)
            before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2"
          >
            布局
          </h3>
          <div class="space-y-2">
            <!-- Layout mode buttons (Mizuki-style) -->
            <div class="flex gap-2">
              <button
                @click="setLayout('sidebar')"
                class="flex-1 rounded-md py-2 px-3 flex items-center justify-center gap-2 active:scale-95 transition-all"
                :class="themeStore.layoutMode === 'sidebar'
                  ? 'bg-(--primary) text-white'
                  : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600/50'"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
                </svg>
                <span class="text-xs font-bold">侧栏</span>
              </button>
              <button
                @click="setLayout('full')"
                class="flex-1 rounded-md py-2 px-3 flex items-center justify-center gap-2 active:scale-95 transition-all"
                :class="themeStore.layoutMode === 'full'
                  ? 'bg-(--primary) text-white'
                  : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600/50'"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                </svg>
                <span class="text-xs font-bold">全宽</span>
              </button>
            </div>

            <!-- Page width slider (Mizuki-style) -->
            <div class="rounded-lg bg-slate-100 dark:bg-slate-700/50 p-2.5">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-medium text-slate-500 dark:text-slate-400">页面宽度</span>
                <span class="text-xs text-slate-600 dark:text-slate-300 font-mono">{{ localPageWidth }}rem</span>
              </div>
              <input
                aria-label="Page width"
                type="range"
                min="48"
                max="100"
                v-model.number="localPageWidth"
                class="slider range-slider w-full"
                @input="onPageWidthChange"
              />
            </div>

            <!-- Card radius slider (Mizuki-style) -->
            <div class="rounded-lg bg-slate-100 dark:bg-slate-700/50 p-2.5">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-medium text-slate-500 dark:text-slate-400">卡片圆角</span>
                <span class="text-xs text-slate-600 dark:text-slate-300 font-mono">{{ localCardRadius }}px</span>
              </div>
              <input
                aria-label="Card radius"
                type="range"
                min="0"
                max="32"
                v-model.number="localCardRadius"
                class="slider range-slider w-full"
                @input="onCardRadiusChange"
              />
            </div>

          </div>
        </section>

        <!-- Reset -->
        <button
          @click="resetSettings"
          class="w-full px-4 py-2.5 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
        >
          恢复默认设置
        </button>
      </div>
    </div>
  </div>
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
    // Re-set range progress after DOM updates
    requestAnimationFrame(refreshRangeProgress)
  }
})

function refreshRangeProgress() {
  const panel = document.querySelector('.float-panel:not(.float-panel-closed)')
  if (!panel) return
  const ranges = panel.querySelectorAll('input[type="range"].range-slider') as NodeListOf<HTMLInputElement>
  ranges.forEach(updateRangeProgress)
}

function updateRangeProgress(input: HTMLInputElement) {
  const minVal = Number(input.min || 0)
  const maxVal = Number(input.max || 100)
  const val = Number(input.value || 0)
  const progress = ((val - minVal) * 100) / (maxVal - minVal || 1)
  input.style.setProperty('--range-progress', `${Math.min(100, Math.max(0, progress))}%`)
}

function handleRangeInput(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.type === 'range') {
    updateRangeProgress(target)
  }
}

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

function handleClickOutside(e: MouseEvent) {
  if (!props.isOpen) return
  const panel = document.querySelector('.float-panel:not(.float-panel-closed)')
  const btn = document.getElementById('settings-btn')
  if (panel && !panel.contains(e.target as Node) && btn && !btn.contains(e.target as Node)) {
    close()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('click', handleClickOutside)

  // Init range progress when panel opens initially
  if (props.isOpen) {
    requestAnimationFrame(refreshRangeProgress)
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.float-panel {
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.15s ease;
  transform-origin: top right;
}

.float-panel-closed {
  transform: scaleY(0) scaleX(0.6);
  opacity: 0;
  pointer-events: none;
}

/* Default slider track */
.slider {
  -webkit-appearance: none;
  appearance: none;
  height: 0.85rem;
  border-radius: 999px;
  cursor: pointer;
  outline: none;
}

.range-slider {
  background-image: linear-gradient(90deg, var(--primary) 0 var(--range-progress, 50%), hsl(var(--hue, 240), 22%, 85%) var(--range-progress, 50%) 100%);
  transition: background-image 0.1s ease;
}

.dark .range-slider {
  background-image: linear-gradient(90deg, var(--primary) 0 var(--range-progress, 50%), hsla(var(--hue, 240), 22%, 28%, 0.6) var(--range-progress, 50%) 100%);
}

/* Color slider — rainbow track */
.color-slider {
  border-radius: 0;
  height: 1.5rem;
  background: transparent;
}

.color-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 1rem;
  width: 0.5rem;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  cursor: pointer;
}

.color-slider::-webkit-slider-thumb:hover {
  background: rgba(255, 255, 255, 0.95);
}

.color-slider::-webkit-slider-thumb:active {
  background: rgba(255, 255, 255, 0.7);
}

.color-slider::-moz-range-thumb {
  height: 1rem;
  width: 0.5rem;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  border: none;
  cursor: pointer;
}

/* Standard range slider thumb */
.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 0.875rem;
  width: 0.875rem;
  border-radius: 50%;
  background: white;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2), 0 0 0 2px var(--primary);
  cursor: pointer;
  transition: transform 0.15s ease;
}

.range-slider::-webkit-slider-thumb:hover {
  transform: scale(1.15);
}

.range-slider::-webkit-slider-thumb:active {
  transform: scale(1.05);
}

.range-slider::-moz-range-thumb {
  height: 0.875rem;
  width: 0.875rem;
  border-radius: 50%;
  background: white;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2), 0 0 0 2px var(--primary);
  cursor: pointer;
  border: none;
}

/* Scrollbar inside panel */
.float-panel > div::-webkit-scrollbar {
  width: 4px;
}

.float-panel > div::-webkit-scrollbar-thumb {
  background: hsla(var(--hue, 240), 70%, 55%, 0.2);
  border-radius: 4px;
}
</style>
