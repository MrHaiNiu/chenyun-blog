<template>
  <Transition name="dropdown">
    <div
      v-if="isOpen"
      ref="dropdownRef"
      class="absolute top-full right-0 mt-2 w-72 rounded-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-2xl overflow-hidden z-[1100] origin-top-right"
    >
      <div class="px-4 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
        <!-- ========== Preset Colors (Mizuki-style swatches) ========== -->
        <section>
          <div class="flex items-center justify-between mb-2.5">
            <div class="flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <h3 class="text-xs font-bold text-slate-600 dark:text-slate-300">主题色</h3>
            </div>
          </div>
          <!-- Preset swatches grid -->
          <div class="grid grid-cols-8 gap-2 mb-3">
            <button
              v-for="swatch in presetColors"
              :key="swatch.hue"
              @click="selectHue(swatch.hue)"
              class="w-6 h-6 rounded-full transition-all duration-200 border-2"
              :class="localHue === swatch.hue ? 'border-white scale-110 shadow-lg ring-2 ring-offset-1 ring-offset-transparent' : 'border-transparent hover:scale-110'"
              :style="{ backgroundColor: swatch.color, ringColor: swatch.color }"
              :title="swatch.name"
            />
          </div>
          <!-- Hue slider -->
          <div class="flex items-center gap-2.5">
            <input
              v-model.number="localHue"
              type="range"
              min="0"
              max="360"
              class="flex-1 h-1.5 rounded-full appearance-none cursor-pointer color-slider"
              :style="{ background: `linear-gradient(to right, hsl(0,70%,55%), hsl(60,70%,55%), hsl(120,70%,55%), hsl(180,70%,55%), hsl(240,70%,55%), hsl(300,70%,55%), hsl(360,70%,55%))` }"
              @input="onHueChange"
            />
            <button
              @click="resetHue"
              class="w-6 h-6 rounded-full flex-shrink-0 border-2 border-white/60 shadow-md transition-transform hover:scale-110 active:scale-95"
              :style="{ background: `hsl(${localHue}, 70%, 55%)` }"
              title="重置"
            />
          </div>
        </section>

        <!-- ========== Separator ========== -->
        <div class="border-t border-slate-200/60 dark:border-slate-700/60" />

        <!-- ========== Layout + Settings ========== -->
        <section>
          <div class="flex items-center gap-1.5 mb-2.5">
            <svg class="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            <h3 class="text-xs font-bold text-slate-600 dark:text-slate-300">布局</h3>
          </div>
          <div class="flex gap-2">
            <button
              @click="setLayout('sidebar')"
              class="flex-1 px-2 py-1.5 text-xs font-bold rounded-lg transition-all duration-200"
              :class="themeStore.layoutMode === 'sidebar'
                ? 'text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'"
              :style="themeStore.layoutMode === 'sidebar' ? { backgroundColor: `hsl(${localHue}, 70%, 55%)` } : {}"
            >
              侧栏
            </button>
            <button
              @click="setLayout('full')"
              class="flex-1 px-2 py-1.5 text-xs font-bold rounded-lg transition-all duration-200"
              :class="themeStore.layoutMode === 'full'
                ? 'text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'"
              :style="themeStore.layoutMode === 'full' ? { backgroundColor: `hsl(${localHue}, 70%, 55%)` } : {}"
            >
              全宽
            </button>
          </div>
          <!-- Page width slider -->
          <div class="mt-2.5">
            <div class="flex items-center justify-between mb-1">
              <span class="text-[10px] text-slate-400 dark:text-slate-500">页面宽度</span>
              <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 tabular-nums">{{ localPageWidth }}rem</span>
            </div>
            <input
              v-model.number="localPageWidth"
              type="range"
              min="48"
              max="100"
              class="w-full h-1 rounded-full appearance-none cursor-pointer bg-slate-200 dark:bg-slate-700"
              @input="onPageWidthChange"
            />
          </div>
          <!-- Card radius slider -->
          <div class="mt-2.5">
            <div class="flex items-center justify-between mb-1">
              <span class="text-[10px] text-slate-400 dark:text-slate-500">卡片圆角</span>
              <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 tabular-nums">{{ localCardRadius }}px</span>
            </div>
            <input
              v-model.number="localCardRadius"
              type="range"
              min="0"
              max="32"
              class="w-full h-1 rounded-full appearance-none cursor-pointer bg-slate-200 dark:bg-slate-700"
              @input="onCardRadiusChange"
            />
          </div>
        </section>

        <!-- ========== Separator ========== -->
        <div class="border-t border-slate-200/60 dark:border-slate-700/60" />

        <!-- ========== Wallpaper ========== -->
        <section>
          <div class="flex items-center gap-1.5 mb-2.5">
            <svg class="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 class="text-xs font-bold text-slate-600 dark:text-slate-300">壁纸</h3>
          </div>
          <div class="flex gap-2 mb-2">
            <button
              v-for="mode in wallpaperModes"
              :key="mode.value"
              @click="setWallpaperMode(mode.value)"
              class="flex-1 px-2 py-1.5 text-xs font-bold rounded-lg transition-all duration-200"
              :class="wallpaperMode === mode.value
                ? 'text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'"
              :style="wallpaperMode === mode.value ? { backgroundColor: `hsl(${localHue}, 70%, 55%)` } : {}"
            >
              {{ mode.label }}
            </button>
          </div>
          <input
            v-model="localWallpaper"
            type="text"
            placeholder="壁纸 URL（留空恢复默认）"
            class="w-full px-2.5 py-1.5 text-[11px] rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 outline-none focus:ring-2 transition-all placeholder:text-slate-400"
            :style="{ '--tw-ring-color': `hsl(${localHue}, 70%, 55%)` }"
            @input="onWallpaperInput"
          />
        </section>

        <!-- ========== Reset ========== -->
        <button
          @click="resetSettings"
          class="w-full px-3 py-1.5 text-[11px] font-bold rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
        >
          恢复默认
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '@/stores/theme'

defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const themeStore = useThemeStore()
const dropdownRef = ref<HTMLElement | null>(null)

const localHue = ref(themeStore.themeHue)
const localWallpaper = ref(themeStore.wallpaperUrl)
const localPageWidth = ref(themeStore.pageWidth)
const localCardRadius = ref(themeStore.cardRadius)
const wallpaperMode = ref(getWallpaperMode())

interface PresetColor {
  name: string
  hue: number
  color: string
}

const presetColors: PresetColor[] = [
  { name: '靛蓝', hue: 240, color: 'hsl(240, 70%, 55%)' },
  { name: '天蓝', hue: 200, color: 'hsl(200, 70%, 55%)' },
  { name: '青色', hue: 170, color: 'hsl(170, 70%, 55%)' },
  { name: '翠绿', hue: 140, color: 'hsl(140, 70%, 55%)' },
  { name: '草绿', hue: 100, color: 'hsl(100, 70%, 55%)' },
  { name: '黄色', hue: 50, color: 'hsl(50, 70%, 55%)' },
  { name: '橙色', hue: 30, color: 'hsl(30, 70%, 55%)' },
  { name: '红色', hue: 0, color: 'hsl(0, 70%, 55%)' },
  { name: '玫红', hue: 340, color: 'hsl(340, 70%, 55%)' },
  { name: '紫色', hue: 280, color: 'hsl(280, 70%, 55%)' },
  { name: '紫罗兰', hue: 260, color: 'hsl(260, 70%, 55%)' },
  { name: '粉色', hue: 330, color: 'hsl(330, 55%, 70%)' },
  { name: '棕色', hue: 20, color: 'hsl(20, 45%, 45%)' },
  { name: '灰色', hue: 0, color: 'hsl(0, 0%, 50%)' },
  { name: '深蓝', hue: 220, color: 'hsl(220, 60%, 40%)' },
  { name: '薄荷', hue: 155, color: 'hsl(155, 55%, 50%)' },
]

const wallpaperModes = [
  { label: '横幅', value: 'banner' },
  { label: '全屏', value: 'fullscreen' },
  { label: '无', value: 'none' },
]

function getWallpaperMode(): string {
  if (!themeStore.wallpaperUrl) return 'none'
  const saved = localStorage.getItem('blog-wallpaper-mode')
  return saved || 'banner'
}

// Sync when opened
watch(() => props.isOpen, (open) => {
  if (open) {
    localHue.value = themeStore.themeHue
    localWallpaper.value = themeStore.wallpaperUrl
    localPageWidth.value = themeStore.pageWidth
    localCardRadius.value = themeStore.cardRadius
    wallpaperMode.value = getWallpaperMode()
  }
})

function selectHue(hue: number) {
  localHue.value = hue
  themeStore.setHue(hue)
}

function onHueChange() {
  themeStore.setHue(localHue.value)
}

function resetHue() {
  selectHue(240)
}

function setWallpaperMode(mode: string) {
  wallpaperMode.value = mode
  localStorage.setItem('blog-wallpaper-mode', mode)
  if (mode === 'none') {
    localWallpaper.value = ''
    themeStore.setWallpaper('')
  } else if (localWallpaper.value) {
    themeStore.setWallpaper(localWallpaper.value)
  }
}

function onWallpaperInput() {}

function setLayout(mode: 'sidebar' | 'full') {
  themeStore.setLayoutMode(mode)
}

function onPageWidthChange() {
  themeStore.setPageWidth(localPageWidth.value)
}

function onCardRadiusChange() {
  themeStore.setCardRadius(localCardRadius.value)
}

function resetSettings() {
  themeStore.resetSettings()
  localHue.value = 240
  localWallpaper.value = ''
  localPageWidth.value = 75
  localCardRadius.value = 24
  wallpaperMode.value = 'banner'
  localStorage.removeItem('blog-wallpaper-mode')
}

function close() {
  emit('close')
}

// Click outside handler
function handleClickOutside(e: MouseEvent) {
  if (props.isOpen && dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    close()
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.isOpen) {
    close()
  }
}

onMounted(() => {
  window.addEventListener('mousedown', handleClickOutside, true)
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('mousedown', handleClickOutside, true)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-4px);
}

/* Color slider thumb */
.color-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: white;
  border: 2px solid hsl(v-bind(localHue), 70%, 55%);
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}
.color-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: white;
  border: 2px solid hsl(v-bind(localHue), 70%, 55%);
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}

/* Generic range thumb */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: white;
  border: 2px solid hsl(v-bind(localHue), 70%, 55%);
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
input[type="range"]::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: white;
  border: 2px solid hsl(v-bind(localHue), 70%, 55%);
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
</style>
