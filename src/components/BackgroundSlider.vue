<template>
  <div class="absolute inset-0 z-[-10] overflow-hidden">
    <div
      v-for="(img, i) in images"
      :key="img"
      class="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out transform-gpu"
      :style="{
        backgroundImage: `url(${img})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: i === index ? 1 : 0,
        visibility: Math.abs(i - index) <= 1 || (i === images.length - 1 && index === 0) ? 'visible' : 'hidden',
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { siteConfig } from '@/siteConfig'

const images = siteConfig.bgImages
const index = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  if (images.length <= 1) return
  timer = setInterval(() => {
    index.value = (index.value + 1) % images.length
  }, 10000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>
