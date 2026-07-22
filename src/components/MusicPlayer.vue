<template>
  <div
    class="rounded-3xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg p-4"
  >
    <h3 class="text-sm font-black text-slate-800 dark:text-white mb-3 flex items-center gap-2">
      <svg class="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
      </svg>
      Music Player
    </h3>

    <!-- Album art + info -->
    <div class="flex items-center gap-3 mb-3">
      <div class="relative w-14 h-14 rounded-full overflow-hidden flexshrink-0 shadow-md">
        <img
          :src="currentSong.cover"
          :alt="currentSong.title"
          class="w-full h-full object-cover transition-transform duration-300"
          :class="{ 'animate-spin': isPlaying }"
          style="animation-duration: 8s;"
        />
      </div>
      <div class="flex-1 min-w-0 overflow-hidden">
        <p class="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{{ currentSong.title }}</p>
        <p class="text-[10px] text-slate-500 dark:text-slate-400 truncate">{{ currentSong.artist }}</p>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="flex items-center gap-2 mb-2">
      <span class="text-[10px] text-slate-400 font-mono w-8 text-right">{{ formatTime(currentTime) }}</span>
      <div
        class="flex-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full cursor-pointer"
        @click="handleSeek"
        ref="progressBar"
      >
        <div class="h-full bg-accent rounded-full transition-all" :style="{ width: progress + '%' }" />
      </div>
      <span class="text-[10px] text-slate-400 font-mono w-8">{{ formatTime(duration) }}</span>
    </div>

    <!-- Controls -->
    <div class="flex items-center justify-center gap-3">
      <button @click="prevSong" class="text-slate-600 dark:text-slate-300 hover:text-accent transition-colors">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
      </button>
      <button @click="togglePlay" class="w-9 h-9 bg-accent text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform">
        <svg v-if="isPlaying" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
        <svg v-else class="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
      </button>
      <button @click="nextSong" class="text-slate-600 dark:text-slate-300 hover:text-accent transition-colors">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
      </button>
    </div>

    <!-- Hidden audio element -->
    <audio
      ref="audioRef"
      :src="currentSong.src"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @ended="nextSong"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Song {
  title: string
  artist: string
  cover: string
  src: string
}

// Using placeholder songs (free audio)
const playlist: Song[] = [
  {
    title: '夜空中最亮的星',
    artist: '逃跑计划',
    cover: 'https://bu.dusays.com/2026/03/24/69c1e38b346cb.jpg',
    src: 'https://music.163.com/song/media/outer/url?id=25705172.mp3',
  },
  {
    title: '晴天',
    artist: '周杰伦',
    cover: 'https://bu.dusays.com/2026/03/24/69c1e38b4c370.jpg',
    src: 'https://music.163.com/song/media/outer/url?id=186016.mp3',
  },
]

const currentIndex = ref(0)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const audioRef = ref<HTMLAudioElement | null>(null)
const progressBar = ref<HTMLDivElement | null>(null)

const currentSong = playlist[currentIndex.value]
const progress = ref(0)

function formatTime(time: number): string {
  if (!time || isNaN(time)) return '00:00'
  const m = Math.floor(time / 60).toString().padStart(2, '0')
  const s = Math.floor(time % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function togglePlay() {
  if (!audioRef.value) return
  if (isPlaying.value) {
    audioRef.value.pause()
    isPlaying.value = false
  } else {
    audioRef.value.play()
    isPlaying.value = true
  }
}

function nextSong() {
  currentIndex.value = (currentIndex.value + 1) % playlist.length
  currentTime.value = 0
  progress.value = 0
  if (audioRef.value) {
    audioRef.value.load()
    if (isPlaying.value) {
      audioRef.value.play()
    }
  }
}

function prevSong() {
  currentIndex.value = (currentIndex.value - 1 + playlist.length) % playlist.length
  currentTime.value = 0
  progress.value = 0
  if (audioRef.value) {
    audioRef.value.load()
    if (isPlaying.value) {
      audioRef.value.play()
    }
  }
}

function onTimeUpdate() {
  if (!audioRef.value) return
  currentTime.value = audioRef.value.currentTime
  progress.value = duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0
}

function onLoadedMetadata() {
  if (!audioRef.value) return
  duration.value = audioRef.value.duration
}

function handleSeek(e: MouseEvent) {
  if (!progressBar.value || !audioRef.value || !duration.value) return
  const rect = progressBar.value.getBoundingClientRect()
  const ratio = (e.clientX - rect.left) / rect.width
  audioRef.value.currentTime = ratio * duration.value
}

onMounted(() => {
  if (audioRef.value) {
    audioRef.value.volume = 0.3
  }
})
</script>
