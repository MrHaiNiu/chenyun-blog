<template>
  <div
    id="display-setting"
    class="float-panel fixed top-14 right-4 w-80 z-[2000]"
    :class="{ 'float-panel-closed': !isOpen }"
  >
    <div class="bg-(--float-panel-bg) backdrop-blur-xl rounded-(--radius-large) overflow-hidden max-h-[80vh] overflow-y-auto border border-black/5 dark:border-white/10 shadow-xl dark:shadow-2xl px-3 pt-0 pb-3">
      <!-- ========== Tab Navigation ========== -->
      <div class="flex border-b border-black/5 dark:border-white/10 -mx-1 mb-2 sticky top-0 bg-(--float-panel-bg)/80 backdrop-blur-xl z-10 pt-2">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          class="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-1 text-xs font-medium truncate transition-all duration-200 relative"
          :class="activeTab === tab.key
            ? 'text-(--primary)'
            : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'"
        >
          <!-- Icon SVG -->
          <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path v-if="tab.key === 'appearance'" stroke-linecap="round" stroke-linejoin="round" d="M12 22q-2.05 0-3.875-.788t-3.187-2.15t-2.15-3.187T2 12q0-2.075.813-3.9t2.2-3.175T8.25 2.788T12.2 2q2 0 3.775.688t3.113 1.9t2.125 2.875T22 11.05q0 2.875-1.75 4.413T16 17h-1.85q-.225 0-.312.125t-.088.275q0 .3.375.863t.375 1.287q0 1.25-.687 1.85T12 22m-3.5-11q.425 0 .713-.288T9 10t-.288-.712T8.5 9t-.713.288T7.5 10t.288.713T8.5 11m3.5 0q.425 0 .713-.288T13 10t-.288-.712T12 9t-.713.288T11 10t.288.713T12 11m3.5 0q.425 0 .713-.288T16.5 10t-.288-.712T15.5 9t-.713.288T14.5 10t.288.713T15.5 11M12 14.5q-.825 0-1.412-.587T10 12.5h4q0 .825-.587 1.413T12 14.5" />
            <path v-else-if="tab.key === 'wallpaper'" stroke-linecap="round" stroke-linejoin="round" d="M5 21q-.825 0-1.412-.587T3 19v-6h2v6h6v2zm8 0v-2h6v-6h2v6q0 .825-.587 1.413T19 21zm-7-4l3-4l2.25 3l3-4L18 17zm-3-6V5q0-.825.588-1.412T5 3h6v2H5v6zm16 0V5h-6V3h6q.825 0 1.413.588T21 5v6z" />
            <path v-else-if="tab.key === 'effects'" stroke-linecap="round" stroke-linejoin="round" d="M18.5 12A3.5 3.5 0 0 0 22 8.5A6.5 6.5 0 0 0 15.5 2A3.5 3.5 0 0 0 12 5.5A3.5 3.5 0 0 0 8.5 2A6.5 6.5 0 0 0 2 8.5A3.5 3.5 0 0 0 5.5 12A3.5 3.5 0 0 0 2 15.5A6.5 6.5 0 0 0 8.5 22a3.5 3.5 0 0 0 3.5-3.5a3.5 3.5 0 0 0 3.5 3.5a6.5 6.5 0 0 0 6.5-6.5a3.5 3.5 0 0 0-3.5-3.5" />
          </svg>
          <span>{{ tab.label }}</span>
          <!-- Active underline -->
          <span
            v-if="activeTab === tab.key"
            class="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-(--primary) transition-all duration-200"
          />
        </button>
      </div>

      <!-- ========== Content Area ========== -->
      <div class="space-y-3">

        <!-- ==================== 外观 (Appearance) ==================== -->
        <div v-show="activeTab === 'appearance'" class="space-y-3">

          <!-- Section: 主题色相 -->
          <section>
            <div class="section-title">
              <h3>主题色相</h3>
              <span class="flex items-center gap-0.5 mr-auto">
                <span class="w-3.5 h-3.5 rounded-sm border border-black/80 bg-black cursor-pointer hover:scale-125 transition-transform ring-1 ring-offset-1" :class="localPrimaryOverride === 'black' ? 'ring-(--primary)' : 'ring-transparent'" title="黑色" @click="setPrimaryOverride('black')"></span>
              </span>
              <button
                v-show="localHue !== DEFAULT_HUE"
                @click="resetHue"
                class="flex items-center gap-1 px-1.5 py-0.5 rounded text-[0.65rem] font-medium text-(--btn-content) hover:text-(--primary) transition-colors"
                aria-label="Reset to Default"
              >
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                重置
              </button>
              <span class="hue-value">{{ localHue }}</span>
            </div>
            <div class="w-full h-6 rounded-lg select-none relative"
              :style="{ background: 'linear-gradient(to right, oklch(0.80 0.10 0), oklch(0.80 0.10 30), oklch(0.80 0.10 60), oklch(0.80 0.10 90), oklch(0.80 0.10 120), oklch(0.80 0.10 150), oklch(0.80 0.10 180), oklch(0.80 0.10 210), oklch(0.80 0.10 240), oklch(0.80 0.10 270), oklch(0.80 0.10 300), oklch(0.80 0.10 330), oklch(0.80 0.10 360))' }"
            >
              <input
                type="range"
                min="0"
                max="360"
                step="5"
                v-model.number="localHue"
                class="slider w-full h-full"
                @input="onHueChange"
                :style="{
                  '--thumb-color': 'hsl(' + localHue + ', 70%, 55%)'
                }"
              />
            </div>
          </section>

          <!-- Section: 卡片样式 -->
          <section>
            <div class="section-title">
              <h3>卡片样式</h3>
              <button
                v-show="localCardBorderShadow !== true || localCardFollowHue !== true"
                @click="resetCardStyle"
                class="flex items-center gap-1 px-1.5 py-0.5 rounded text-[0.65rem] font-medium text-(--btn-content) hover:text-(--primary) transition-colors"
                aria-label="Reset to Default"
              >
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                重置
              </button>
            </div>
            <div class="space-y-1">
              <!-- Toggle: 卡片边框和阴影 -->
              <button
                class="toggle-row"
                :class="localCardBorderShadow ? 'toggle-active' : ''"
                @click="toggleCardBorderShadow"
              >
                <svg class="w-4 h-4 shrink-0 text-(--btn-content)" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11.288 8.713Q11 8.425 11 8t.288-.712T12 7t.713.288T13 8t-.288.713T12 9t-.712-.288m-4 4Q7 12.426 7 12t.288-.712T8 11t.713.288T9 12t-.288.713T8 13t-.712-.288m4 0Q11 12.426 11 12t.288-.712T12 11t.713.288T13 12t-.288.713T12 13t-.712-.288m4 0Q15 12.426 15 12t.288-.712T16 11t.713.288T17 12t-.288.713T16 13t-.712-.288m-4 4Q11 16.426 11 16t.288-.712T12 15t.713.288T13 16t-.288.713T12 17t-.712-.288M5 19h14V5H5zm0 2q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21z" />
                </svg>
                <span class="text-xs flex-1 text-left text-(--btn-content)">卡片边框和阴影</span>
                <div class="toggle-switch" :class="localCardBorderShadow ? 'toggle-on' : ''">
                  <div class="toggle-knob" :class="localCardBorderShadow ? 'knob-on' : ''" />
                </div>
              </button>
              <!-- Toggle: 卡片跟随主题色 -->
              <button
                class="toggle-row"
                :class="localCardFollowHue ? 'toggle-active' : ''"
                @click="toggleCardFollowHue"
              >
                <svg class="w-4 h-4 shrink-0 text-(--btn-content)" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 22q-2.05 0-3.875-.788t-3.187-2.15t-2.15-3.187T2 12q0-2.075.813-3.9t2.2-3.175T8.25 2.788T12.2 2q2 0 3.775.688t3.113 1.9t2.125 2.875T22 11.05q0 2.875-1.75 4.413T16 17h-1.85q-.225 0-.312.125t-.088.275q0 .3.375.863t.375 1.287q0 1.25-.687 1.85T12 22m-3.5-11q.425 0 .713-.288T9 10t-.288-.712T8.5 9t-.713.288T7.5 10t.288.713T8.5 11m3.5 0q.425 0 .713-.288T13 10t-.288-.712T12 9t-.713.288T11 10t.288.713T12 11m3.5 0q.425 0 .713-.288T16.5 10t-.288-.712T15.5 9t-.713.288T14.5 10t.288.713T15.5 11M12 14.5q-.825 0-1.412-.587T10 12.5h4q0 .825-.587 1.413T12 14.5" />
                </svg>
                <span class="text-xs flex-1 text-left text-(--btn-content)">卡片跟随主题色</span>
                <div class="toggle-switch" :class="localCardFollowHue ? 'toggle-on' : ''">
                  <div class="toggle-knob" :class="localCardFollowHue ? 'knob-on' : ''" />
                </div>
              </button>
            </div>
          </section>
        </div>

        <!-- ==================== 壁纸 (Wallpaper) ==================== -->
        <div v-show="activeTab === 'wallpaper'" class="space-y-3">

          <!-- Section: 壁纸模式 -->
          <section>
            <div class="section-title">
              <h3>壁纸模式</h3>
              <button
                v-show="localWallpaperMode !== 'fullscreen'"
                @click="resetWallpaperMode"
                class="flex items-center gap-1 px-1.5 py-0.5 rounded text-[0.65rem] font-medium text-(--btn-content) hover:text-(--primary) transition-colors"
                aria-label="Reset to Default"
              >
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                重置
              </button>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="opt in wallpaperModeOptions"
                :key="opt.value"
                @click="setWallpaperMode(opt.value)"
                class="flex items-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 active:scale-95"
                :class="localWallpaperMode === opt.value
                  ? 'bg-(--primary) text-white shadow-sm'
                  : 'btn-regular text-(--btn-content) opacity-70 hover:opacity-100'"
              >
                <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                  <path v-if="opt.value === 'banner'" stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  <path v-else-if="opt.value === 'fullscreen'" stroke-linecap="round" stroke-linejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  <path v-else-if="opt.value === 'transparent'" stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  <path v-else-if="opt.value === 'solid'" stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                {{ opt.label }}
              </button>
            </div>
          </section>

          <!-- Section: 横幅高度 -->
          <section v-show="localWallpaperMode === 'banner'">
            <div class="section-title">
              <h3>横幅高度</h3>
              <button
                v-show="localBannerHeight !== 50"
                @click="resetBannerHeight"
                class="flex items-center gap-1 px-1.5 py-0.5 rounded text-[0.65rem] font-medium text-(--btn-content) hover:text-(--primary) transition-colors"
                aria-label="Reset to Default"
              >
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                重置
              </button>
              <span class="hue-value">{{ localBannerHeight }}%</span>
            </div>
            <div class="w-full h-6 rounded-lg select-none bg-gray-200/40 dark:bg-gray-700/30">
              <input
                type="range"
                min="20"
                max="100"
                step="5"
                v-model.number="localBannerHeight"
                class="slider w-full h-full"
                @input="onBannerHeightChange"
                :style="{
                  '--thumb-color': 'var(--primary)'
                }"
              />
            </div>
          </section>

          <!-- Section: 壁纸设置 -->
          <section>
            <div class="section-title">
              <h3>壁纸设置</h3>
              <button
                v-show="localWallpaperTitle !== true || localWallpaperCarousel !== true || localWallpaperRipple !== true || localWallpaperGradient !== true"
                @click="resetWallpaperSettings"
                class="flex items-center gap-1 px-1.5 py-0.5 rounded text-[0.65rem] font-medium text-(--btn-content) hover:text-(--primary) transition-colors"
                aria-label="Reset to Default"
              >
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                重置
              </button>
            </div>
            <div class="space-y-1">
              <button
                v-for="ws in wallpaperSwitchOptions"
                :key="ws.key"
                @click="toggleWallpaperSwitch(ws.key)"
                class="toggle-row"
                :class="getWallpaperSwitchVal(ws.key) ? 'toggle-active' : ''"
              >
                <svg class="w-4 h-4 shrink-0 text-(--btn-content)" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                  <path v-if="ws.key === 'title'" stroke-linecap="round" stroke-linejoin="round" d="M4 7V4h16v3M9 20h6M12 4v16" />
                  <path v-else-if="ws.key === 'carousel'" stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  <path v-else-if="ws.key === 'ripple'" stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  <path v-else-if="ws.key === 'gradient'" stroke-linecap="round" stroke-linejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <span class="text-xs flex-1 text-left text-(--btn-content)">{{ ws.label }}</span>
                <div class="toggle-switch" :class="getWallpaperSwitchVal(ws.key) ? 'toggle-on' : ''">
                  <div class="toggle-knob" :class="getWallpaperSwitchVal(ws.key) ? 'knob-on' : ''" />
                </div>
              </button>
            </div>
          </section>
        </div>

        <!-- ==================== 特效 (Effects) ==================== -->
        <div v-show="activeTab === 'effects'" class="space-y-3">
          <section>
            <div class="section-title">
              <h3>特效设置</h3>
              <button
                v-show="!localEffectSakura"
                @click="resetSakura"
                class="flex items-center gap-1 px-1.5 py-0.5 rounded text-[0.65rem] font-medium text-(--btn-content) hover:text-(--primary) transition-colors"
                aria-label="Reset to Default"
              >
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                重置
              </button>
            </div>
            <button
              class="w-full flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 active:scale-[0.98]"
              :class="localEffectSakura ? 'bg-pink-50 dark:bg-pink-900/15' : 'btn-regular'"
              @click="toggleSakura"
            >
              <div class="w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 border-pink-300 dark:border-pink-500/40 text-lg bg-white/50 dark:bg-white/10">
                🌸
              </div>
              <span class="text-sm font-medium flex-1 text-left text-rose-600 dark:text-rose-300">樱花特效</span>
              <div class="toggle-switch rounded-full" :class="localEffectSakura ? 'toggle-on bg-gradient-to-r from-pink-400 to-purple-400' : ''">
                <div class="toggle-knob" :class="localEffectSakura ? 'knob-on shadow-md' : ''" />
              </div>
            </button>
          </section>
        </div>

        <!-- ====== Reset All ====== -->
        <button
          @click="resetSettings"
          class="w-full py-2.5 rounded-lg text-xs font-medium transition-colors btn-regular text-(--btn-content) hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
        >
          恢复默认设置
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '@/stores/theme'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const themeStore = useThemeStore()

// ---------- Constants ----------
const DEFAULT_HUE = 240

// ---------- Tab ----------
const tabs = [
  { key: 'appearance', label: '外观' },
  { key: 'wallpaper', label: '壁纸' },
  { key: 'effects', label: '特效' },
]
const activeTab = ref('appearance')

// ---------- Appearance State ----------
const localHue = ref(DEFAULT_HUE)
const localBannerHeight = ref(50)
const localCardBorderShadow = ref(true)
const localCardFollowHue = ref(true)
const localPrimaryOverride = ref<string | null>(null) // null | 'black' | 'white'

// ---------- Wallpaper State ----------
const localWallpaperMode = ref<'banner' | 'fullscreen' | 'transparent' | 'solid'>('solid')
const localWallpaperTitle = ref(true)
const localWallpaperCarousel = ref(true)
const localWallpaperRipple = ref(true)
const localWallpaperGradient = ref(true)

// ---------- Effects State ----------
const localEffectSakura = ref(false)

// ---------- Option definitions ----------
const wallpaperModeOptions = [
  { value: 'banner' as const, label: '横幅壁纸' },
  { value: 'fullscreen' as const, label: '全屏壁纸' },
  { value: 'transparent' as const, label: '全屏透明' },
  { value: 'solid' as const, label: '纯色背景' },
]

const wallpaperSwitchOptions = [
  { key: 'title' as const, label: '首页壁纸标题' },
  { key: 'carousel' as const, label: '壁纸轮播' },
  { key: 'ripple' as const, label: '水波纹动画' },
  { key: 'gradient' as const, label: '渐变过渡' },
]

function getWallpaperSwitchVal(key: string): boolean {
  const map: Record<string, boolean> = {
    title: localWallpaperTitle.value,
    carousel: localWallpaperCarousel.value,
    ripple: localWallpaperRipple.value,
    gradient: localWallpaperGradient.value,
  }
  return map[key]
}

// ---------- Load / Sync ----------
function loadSettings() {
  localHue.value = themeStore.themeHue
  localBannerHeight.value = themeStore.bannerHeight
  localCardBorderShadow.value = loadBool('theme.cardBorderShadow', true)
  localCardFollowHue.value = loadBool('theme.cardFollowHue', true)
  localWallpaperMode.value = loadStr('theme.wallpaperMode', 'solid') as any
  localWallpaperTitle.value = loadBool('theme.wallpaperTitle', true)
  localWallpaperCarousel.value = loadBool('theme.wallpaperCarousel', true)
  localWallpaperRipple.value = loadBool('theme.wallpaperRipple', true)
  localWallpaperGradient.value = loadBool('theme.wallpaperGradient', true)
  localEffectSakura.value = loadBool('theme.effectSakura', false)
  loadPrimaryOverride()
}

// ---------- Persistence helpers ----------
function loadStr(key: string, fallback: string): string {
  return localStorage.getItem(key) || fallback
}
function loadBool(key: string, fallback: boolean): boolean {
  const v = localStorage.getItem(key)
  return v !== null ? v === 'true' : fallback
}
function saveNum(key: string, val: number) { localStorage.setItem(key, String(val)) }
function saveStr(key: string, val: string) { localStorage.setItem(key, val) }
function saveBool(key: string, val: boolean) { localStorage.setItem(key, String(val)) }

// ---------- Primary Override (black / white) ----------
function setPrimaryOverride(val: 'black' | 'white') {
  localPrimaryOverride.value = val
  localStorage.setItem('theme.primaryOverride', val)
  applyPrimaryOverride()
}
function clearPrimaryOverride() {
  localPrimaryOverride.value = null
  localStorage.removeItem('theme.primaryOverride')
  applyPrimaryOverride()
}
function applyPrimaryOverride() {
  if (localPrimaryOverride.value === 'black') {
    document.documentElement.style.setProperty('--primary', '#000000')
  } else if (localPrimaryOverride.value === 'white') {
    document.documentElement.style.setProperty('--primary', '#ffffff')
  } else {
    document.documentElement.style.removeProperty('--primary')
    themeStore.applySettings()
  }
}
function loadPrimaryOverride() {
  const val = localStorage.getItem('theme.primaryOverride')
  localPrimaryOverride.value = (val === 'black' || val === 'white') ? val : null
  applyPrimaryOverride()
}

// ---------- Hue ----------
function onHueChange() { clearPrimaryOverride(); applyHue() }
function applyHue() {
  saveNum('theme.hue', localHue.value)
  themeStore.setHue(localHue.value)
}
function resetHue() { clearPrimaryOverride(); localHue.value = DEFAULT_HUE; applyHue() }

// ---------- Banner Height ----------
function onBannerHeightChange() { applyBannerHeight() }
function applyBannerHeight() {
  themeStore.setBannerHeight(localBannerHeight.value)
}
function resetBannerHeight() {
  localBannerHeight.value = 50
  themeStore.setBannerHeight(50)
}

// ---------- Card Styles ----------
function toggleCardBorderShadow() {
  localCardBorderShadow.value = !localCardBorderShadow.value
  applyCardStyles()
}
function toggleCardFollowHue() {
  localCardFollowHue.value = !localCardFollowHue.value
  applyCardStyles()
}
function applyCardStyles() {
  saveBool('theme.cardBorderShadow', localCardBorderShadow.value)
  saveBool('theme.cardFollowHue', localCardFollowHue.value)
  document.documentElement.classList.toggle('enable-card-border', localCardBorderShadow.value)
  document.documentElement.classList.toggle('card-follow-hue', localCardFollowHue.value)
}
function resetCardStyle() {
  localCardBorderShadow.value = true
  localCardFollowHue.value = true
  applyCardStyles()
}

// ---------- Wallpaper Mode ----------
function setWallpaperMode(mode: string) {
  localWallpaperMode.value = mode as any
  saveStr('theme.wallpaperMode', localWallpaperMode.value)
  document.documentElement.setAttribute('data-wallpaper-mode', localWallpaperMode.value)

  if (mode === 'banner') {
    localBannerHeight.value = 30
    themeStore.setBannerHeight(30)
  } else if (mode === 'fullscreen') {
    localBannerHeight.value = 100
    themeStore.setBannerHeight(100)
  }

  // Trigger page progress bar animation
  window.dispatchEvent(new CustomEvent('page-progress-trigger'))
  window.dispatchEvent(new CustomEvent('wallpaper-settings-changed'))
}
function resetWallpaperMode() {
  localWallpaperMode.value = 'solid'
  localBannerHeight.value = 50
  saveStr('theme.wallpaperMode', 'solid')
  document.documentElement.setAttribute('data-wallpaper-mode', 'solid')
  themeStore.setBannerHeight(50)
  window.dispatchEvent(new CustomEvent('wallpaper-settings-changed'))
}

// ---------- Wallpaper Settings ----------
function toggleWallpaperSwitch(key: string) {
  if (key === 'title') { localWallpaperTitle.value = !localWallpaperTitle.value; saveBool('theme.wallpaperTitle', localWallpaperTitle.value) }
  else if (key === 'carousel') { localWallpaperCarousel.value = !localWallpaperCarousel.value; saveBool('theme.wallpaperCarousel', localWallpaperCarousel.value) }
  else if (key === 'ripple') { localWallpaperRipple.value = !localWallpaperRipple.value; saveBool('theme.wallpaperRipple', localWallpaperRipple.value) }
  else if (key === 'gradient') { localWallpaperGradient.value = !localWallpaperGradient.value; saveBool('theme.wallpaperGradient', localWallpaperGradient.value) }
  window.dispatchEvent(new CustomEvent('wallpaper-settings-changed'))
}
function resetWallpaperSettings() {
  localWallpaperTitle.value = true; saveBool('theme.wallpaperTitle', true)
  localWallpaperCarousel.value = true; saveBool('theme.wallpaperCarousel', true)
  localWallpaperRipple.value = true; saveBool('theme.wallpaperRipple', true)
  localWallpaperGradient.value = true; saveBool('theme.wallpaperGradient', true)
  window.dispatchEvent(new CustomEvent('wallpaper-settings-changed'))
}

// ---------- Sakura ----------
function toggleSakura() {
  localEffectSakura.value = !localEffectSakura.value
  saveBool('theme.effectSakura', localEffectSakura.value)
  window.dispatchEvent(new CustomEvent('sakura-toggle', { detail: localEffectSakura.value }))
}
function resetSakura() {
  localEffectSakura.value = false
  saveBool('theme.effectSakura', false)
  window.dispatchEvent(new CustomEvent('sakura-toggle', { detail: false }))
}

// ---------- Reset All ----------
function resetSettings() {
  clearPrimaryOverride()
  localHue.value = DEFAULT_HUE; applyHue()
  localBannerHeight.value = 50; themeStore.setBannerHeight(50)
  localCardBorderShadow.value = true; localCardFollowHue.value = true; applyCardStyles()
  localWallpaperMode.value = 'solid'; saveStr('theme.wallpaperMode', 'solid'); document.documentElement.setAttribute('data-wallpaper-mode', 'solid')
  localWallpaperTitle.value = true; localWallpaperCarousel.value = true; localWallpaperRipple.value = true; localWallpaperGradient.value = true
  saveBool('theme.wallpaperTitle', true); saveBool('theme.wallpaperCarousel', true); saveBool('theme.wallpaperRipple', true); saveBool('theme.wallpaperGradient', true)
  localEffectSakura.value = false; saveBool('theme.effectSakura', false)
  window.dispatchEvent(new CustomEvent('sakura-toggle', { detail: false }))
  window.dispatchEvent(new CustomEvent('wallpaper-settings-changed'))
  window.dispatchEvent(new CustomEvent('page-progress-trigger'))
}

// ---------- Close ----------
function close() { emit('close') }

// ---------- Keyboard & outside click ----------
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.isOpen) close()
}
function handleClickOutside(e: MouseEvent) {
  if (!props.isOpen) return
  const el = document.getElementById('display-setting')
  const btn = document.getElementById('settings-btn')
  if (el && !el.contains(e.target as Node) && btn && !btn.contains(e.target as Node)) {
    close()
  }
}

watch(() => props.isOpen, (open) => {
  if (open) loadSettings()
})

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('click', handleClickOutside)
  if (props.isOpen) loadSettings()
  // Apply card styles on mount
  document.documentElement.classList.toggle('enable-card-border', loadBool('theme.cardBorderShadow', true))
  document.documentElement.classList.toggle('card-follow-hue', loadBool('theme.cardFollowHue', true))
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Section title pattern */
.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.section-title::before {
  content: '';
  width: 0.25rem;
  height: 1rem;
  border-radius: 0.375rem;
  background: var(--primary, oklch(0.62 0.19 240));
  flex-shrink: 0;
}
.section-title h3 {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--btn-content, rgba(0,0,0,0.8));
  flex: 1;
}
:root.dark .section-title h3 {
  color: rgba(255,255,255,0.8);
}
.section-title .hue-value {
  padding: 0 0.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 700;
  color: #fff;
  border-radius: 0.375rem;
  background: var(--primary, oklch(0.62 0.19 240));
}

/* Toggle row (button with icon + label + switch) */
.toggle-row {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  transition: all 0.15s ease;
  cursor: pointer;
  text-align: left;
}
.toggle-row:active {
  transform: scale(0.98);
}
.toggle-row.toggle-active {
  background: rgba(233, 213, 255, 0.25);
}
:root.dark .toggle-row.toggle-active {
  background: rgba(139, 92, 246, 0.1);
}
.toggle-row:not(.toggle-active) {
  background: rgba(148, 163, 184, 0.08);
}
:root.dark .toggle-row:not(.toggle-active) {
  background: rgba(51, 65, 85, 0.25);
}
.toggle-row:hover:not(.toggle-active) {
  background: rgba(148, 163, 184, 0.15);
}
:root.dark .toggle-row:hover:not(.toggle-active) {
  background: rgba(51, 65, 85, 0.4);
}

/* Toggle switch */
.toggle-switch {
  width: 2rem;
  height: 1.1rem;
  border-radius: 9999px;
  position: relative;
  flex-shrink: 0;
  transition: all 0.2s ease;
  background: rgba(148, 163, 184, 0.4);
}
:root.dark .toggle-switch {
  background: rgba(51, 65, 85, 0.6);
}
.toggle-switch.toggle-on {
  background: var(--primary, oklch(0.62 0.19 240));
}
.toggle-knob {
  position: absolute;
  top: 0.12rem;
  left: 0.12rem;
  width: 0.85rem;
  height: 0.85rem;
  background: white;
  border-radius: 9999px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}
.toggle-knob.knob-on {
  left: 1.03rem;
}
:root.dark .toggle-knob {
  background: #e2e8f0;
}

/* btn-regular */
.btn-regular {
  background: rgba(148, 163, 184, 0.08);
}
:root.dark .btn-regular {
  background: rgba(51, 65, 85, 0.25);
}
.btn-regular:hover {
  background: rgba(148, 163, 184, 0.15);
}
:root.dark .btn-regular:hover {
  background: rgba(51, 65, 85, 0.4);
}

/* Slider base */
.slider {
  -webkit-appearance: none;
  appearance: none;
  height: 100%;
  width: 100%;
  cursor: pointer;
  outline: none;
  background: transparent;
  border-radius: 9999px;
  position: relative;
  z-index: 1;
  margin: 0;
}

/* WebKit track — no fill, just the container bg shows through */
.slider::-webkit-slider-runnable-track {
  -webkit-appearance: none;
  appearance: none;
  height: 100%;
  border-radius: 9999px;
  background: transparent;
}

/* Slider thumb — WebKit: solid white disc with colored border, no tricks */
.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 9999px;
  background: white;
  border: 3px solid var(--thumb-color, hsl(240, 70%, 55%));
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  margin-top: 0;
}
.slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.3);
}
.slider::-webkit-slider-thumb:active {
  transform: scale(0.95);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

/* Slider track — Firefox */
.slider::-moz-range-track {
  height: 100%;
  border-radius: 9999px;
  background: transparent;
  border: none;
}

/* Slider thumb — Firefox */
.slider::-moz-range-thumb {
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 9999px;
  background: white;
  border: 3px solid var(--thumb-color, hsl(240, 70%, 55%));
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  cursor: pointer;
}
.slider::-moz-range-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.3);
}

/* Scrollbar for panel */
#display-setting > div::-webkit-scrollbar {
  width: 4px;
}
#display-setting > div::-webkit-scrollbar-thumb {
  background: hsla(var(--hue, 240), 70%, 55%, 0.2);
  border-radius: 4px;
}
</style>
