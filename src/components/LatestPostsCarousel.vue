<template>
  <div
    v-if="posts.length > 0"
    class="md:col-span-4 rounded-3xl bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl overflow-hidden relative min-h-[200px] cursor-pointer group"
    @click="goToPost(currentPost.slug)"
  >
    <!-- Background image with overlay -->
    <div class="absolute inset-0">
      <Transition name="carousel-fade">
        <img
          :key="currentPost.slug"
          :src="currentPost.cover || siteConfig.defaultPostCover"
          :alt="currentPost.title"
          class="w-full h-full object-cover"
        />
      </Transition>
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
    </div>

    <!-- Content -->
    <div class="relative z-10 p-6 md:p-8 flex flex-col justify-end min-h-[200px] h-full">
      <div class="flex flex-wrap gap-2 mb-3">
        <span
          v-for="tag in currentPost.tags.slice(0, 3)"
          :key="tag"
          class="px-2 py-1 bg-accent-mid backdrop-blur-sm rounded-md text-[10px] font-bold text-white border border-white/20"
        >
          {{ tag }}
        </span>
      </div>
      <h2 class="text-xl md:text-2xl font-black text-white mb-2 group-hover:-translate-y-1 transition-transform drop-shadow-md">
        {{ currentPost.title }}
      </h2>
      <p class="text-sm text-gray-300 line-clamp-3 drop-shadow-sm mb-6">
        {{ currentPost.description }}
      </p>
    </div>

    <!-- Dots -->
    <div v-if="posts.length > 1" class="absolute bottom-4 right-6 z-30 flex gap-2">
      <button
        v-for="(_, i) in posts"
        :key="i"
        @click.stop="setCurrentIndex(i)"
        :class="i === currentIndex ? 'w-6 bg-accent-light' : 'w-2 bg-white/40 hover:bg-white/80'"
        class="h-1.5 rounded-full transition-all duration-500"
        :aria-label="`切换到第 ${i + 1} 篇文章`"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { siteConfig } from '@/siteConfig'
import type { PostMeta } from '@/types'

const props = defineProps<{ posts: PostMeta[] }>()
const router = useRouter()

const currentIndex = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const currentPost = computed(() => props.posts[currentIndex.value] || props.posts[0])

function setCurrentIndex(i: number) {
  currentIndex.value = i
  restartTimer()
}

function goToPost(slug: string) {
  router.push(`/posts/${slug}`)
}

function restartTimer() {
  if (timer) clearInterval(timer)
  if (props.posts.length <= 1) return
  timer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % props.posts.length
  }, 5000)
}

onMounted(restartTimer)
onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.carousel-fade-enter-active,
.carousel-fade-leave-active {
  transition: opacity 1s ease;
}

.carousel-fade-enter-from,
.carousel-fade-leave-to {
  opacity: 0;
}
</style>
