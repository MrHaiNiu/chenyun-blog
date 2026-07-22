<template>
  <div
    v-if="danmakus.length > 0"
    class="absolute top-0 left-0 right-0 h-[30vh] z-0 overflow-hidden pointer-events-none"
  >
    <div
      v-for="item in danmakus"
      :key="item.id"
      class="absolute whitespace-nowrap text-white/30 dark:text-white/10 font-bold text-lg tracking-wider select-none"
      :style="{
        top: `${item.top}%`,
        right: '-100%',
        animation: `float-left ${item.duration}s linear ${item.delay}s infinite`,
      }"
    >
      {{ item.text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { siteConfig } from '@/siteConfig'

interface DanmakuItem {
  id: number
  text: string
  top: number
  duration: number
  delay: number
}

const danmakus = ref<DanmakuItem[]>([])

onMounted(() => {
  const list = siteConfig.danmakuList
  if (list.length === 0) return

  const generated: DanmakuItem[] = []
  const count = 15

  for (let i = 0; i < count; i++) {
    generated.push({
      id: i,
      text: list[Math.floor(Math.random() * list.length)],
      top: Math.random() * 80 + 10,
      duration: 20 + Math.random() * 15,
      delay: Math.random() * 20,
    })
  }

  danmakus.value = generated
})
</script>
