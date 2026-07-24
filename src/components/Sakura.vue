<template>
  <div v-if="enabled" class="fixed inset-0 w-full h-full pointer-events-none z-10 overflow-hidden">
    <div
      v-for="p in petals"
      :key="p.id"
      class="absolute top-0 bg-pink-300/70 shadow-[0_0_5px_rgba(255,182,193,0.6)]"
      :style="{
        left: p.left,
        width: `${p.size}px`,
        height: `${p.size * 1.2}px`,
        borderRadius: '100% 0 100% 0',
        animation: `sakuraFall ${p.duration}s linear infinite`,
        animationDelay: `${p.delay}s`,
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Petal {
  id: number
  left: string
  size: number
  duration: number
  delay: number
}

const petals = ref<Petal[]>([])
const enabled = ref(true)

function onSakuraToggle(e: Event) {
  enabled.value = (e as CustomEvent).detail
}

onMounted(() => {
  petals.value = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: 8 + Math.random() * 12,
    duration: 6 + Math.random() * 8,
    delay: Math.random() * -15,
  }))

  // Read initial state from localStorage
  const stored = localStorage.getItem('theme.effectSakura')
  enabled.value = stored !== null ? stored === 'true' : true

  window.addEventListener('sakura-toggle', onSakuraToggle as EventListener)
})

onUnmounted(() => {
  window.removeEventListener('sakura-toggle', onSakuraToggle as EventListener)
})
</script>
