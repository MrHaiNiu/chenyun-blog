<template>
  <Transition name="dropdown">
    <div
      v-if="isOpen"
      ref="dropdownRef"
      class="absolute top-full right-0 mt-2 w-72 rounded-2xl bg-glass-95 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-2xl overflow-hidden z-[1100] origin-top-right"
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

// Sync when opened
watch(() => props.isOpen, (open) => {
  if (open) {
    localHue.value = themeStore.themeHue
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
