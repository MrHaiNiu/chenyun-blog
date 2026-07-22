<template>
  <div class="fixed bottom-0 left-0 right-0 h-[150px] z-0 pointer-events-none overflow-hidden">
    <div
      v-for="blade in blades"
      :key="blade.id"
      class="absolute bottom-0 origin-bottom flex items-end"
      :style="{
        left: blade.left,
        height: `${blade.height}px`,
        width: `${blade.width * 4}px`,
        opacity: blade.opacity,
        animation: `swayWildGrass ${blade.duration}s ease-in-out infinite alternate`,
        animationDelay: `${blade.delay}s`,
      }"
    >
      <div
        :class="themeStore.isDark
          ? 'bg-gradient-to-t from-white/80 to-transparent'
          : 'bg-gradient-to-t from-emerald-500/80 to-transparent'
        "
        class="w-full h-full transition-all duration-1000"
        :style="{
          width: `${blade.width}px`,
          borderRadius: blade.isLeftCurve ? '100% 0 0 100%' : '0 100% 100% 0',
          transform: blade.isLeftCurve ? 'translateX(50%)' : 'translateX(-50%)',
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

interface WildBlade {
  id: number
  height: number
  width: number
  delay: number
  duration: number
  opacity: number
  left: string
  isLeftCurve: boolean
}

const blades = ref<WildBlade[]>([])

onMounted(() => {
  blades.value = Array.from({ length: 150 }).map((_, i) => ({
    id: i,
    height: 30 + Math.random() * 50,
    width: 1 + Math.random() * 2,
    delay: Math.random() * -10,
    duration: 3 + Math.random() * 4,
    opacity: 0.2 + Math.random() * 0.4,
    left: `${(i / 150) * 100 + (Math.random() - 0.5) * 0.5}%`,
    isLeftCurve: Math.random() > 0.5,
  }))
})
</script>
