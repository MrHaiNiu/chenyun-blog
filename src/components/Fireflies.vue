<template>
  <div class="fixed inset-0 w-full h-full pointer-events-none z-10 overflow-hidden">
    <div
      v-for="fly in flies"
      :key="fly.id"
      class="absolute"
      :style="{
        top: fly.top,
        left: fly.left,
        animation: `${fly.floatPath} ${fly.floatDuration}s ease-in-out infinite`,
        animationDelay: `${fly.floatDelay}s`,
      }"
    >
      <div
        class="rounded-full"
        :style="{
          width: `${fly.size}px`,
          height: `${fly.size}px`,
          backgroundColor: 'rgba(200, 255, 200, 0.9)',
          animation: `fireflyBreathe ${fly.breatheDuration}s ease-in-out infinite`,
          animationDelay: `${fly.breatheDelay}s`,
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Firefly {
  id: number
  top: string
  left: string
  size: number
  breatheDuration: number
  breatheDelay: number
  floatDuration: number
  floatDelay: number
  floatPath: string
}

const flies = ref<Firefly[]>([])
const floatPaths = ['fireflyFloatA', 'fireflyFloatB', 'fireflyFloatC', 'fireflyFloatD']

onMounted(() => {
  flies.value = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: 3 + Math.random() * 4,
    breatheDuration: 3 + Math.random() * 5,
    breatheDelay: Math.random() * -10,
    floatDuration: 20 + Math.random() * 30,
    floatDelay: Math.random() * -15,
    floatPath: floatPaths[Math.floor(Math.random() * floatPaths.length)],
  }))
})
</script>
