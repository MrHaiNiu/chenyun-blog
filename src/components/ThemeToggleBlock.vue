<template>
  <div
    @click="themeStore.toggleTheme"
    :class="themeStore.isDark ? 'bg-slate-800/40 border-slate-600/50' : 'bg-white/40 border-white/60'"
    class="w-full rounded-3xl backdrop-blur-md border shadow-lg p-5 flex flex-col items-center transition-all duration-500 hover:scale-[1.02] cursor-pointer group relative overflow-hidden"
  >
    <div class="relative w-16 h-16 rounded-full overflow-hidden mb-2 shadow-inner flex-shrink-0">
      <div
        :class="themeStore.isDark ? '-translate-y-full' : 'translate-y-0'"
        class="absolute inset-0 bg-gradient-to-b from-amber-200 to-orange-300 transition-transform duration-700"
      />
      <div
        :class="themeStore.isDark ? 'translate-y-0' : 'translate-y-full'"
        class="absolute inset-0 bg-gradient-to-b from-slate-700 to-slate-900 transition-transform duration-700"
      />
      <div
        :class="themeStore.isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'"
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 text-2xl"
      >
        🌸
      </div>
      <div
        :class="themeStore.isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'"
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 text-2xl"
      >
        ✨
      </div>
    </div>
    <div class="text-center z-10">
      <h3 :class="themeStore.isDark ? 'text-white' : 'text-slate-800'" class="text-sm font-bold transition-colors duration-500">
        {{ themeStore.isDark ? '夜间模式' : '日间模式' }}
      </h3>
      <p :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-600'" class="text-xs mt-0.5 transition-colors duration-500">
        {{ themeStore.isDark ? '流萤飞舞的深空' : '落樱漫舞的清晨' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'
const themeStore = useThemeStore()
</script>
