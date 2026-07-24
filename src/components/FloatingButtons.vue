<template>
  <div class="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">

    <!-- ===== Music Panel (Mizuki-style) ===== -->
    <Transition name="music-panel">
      <div
        v-if="showMusicPanel"
        class="fab-music-panel w-[20rem] max-w-[80vw] rounded-2xl p-4 shadow-2xl overflow-hidden"
      >
        <!-- × Close button -->
        <button
          @click="showMusicPanel = false"
          class="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all z-10"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Header: Cover + Track Info -->
        <div class="flex items-center gap-3 mb-3 pr-6">
          <!-- Album cover -->
          <div class="relative w-14 h-14 rounded-full overflow-hidden shrink-0 shadow-md">
            <img
              :src="currentSong.cover"
              :alt="currentSong.title"
              class="w-full h-full object-cover"
              :class="{ 'animate-spin': isPlaying }"
              style="animation-duration: 8s;"
            />
            <div
              v-if="isPlaying"
              class="absolute inset-0 rounded-full border-2 border-white/20"
            />
          </div>
          <!-- Track info -->
          <div class="flex-1 min-w-0">
            <p class="title-text truncate">{{ currentSong.title }}</p>
            <p class="artist-text truncate">{{ currentSong.artist }}</p>
            <div class="flex items-center gap-2 mt-1">
              <span class="time-label">{{ formatTime(currentTime) }}</span>
              <span class="time-label opacity-60">/</span>
              <span class="time-label">{{ formatTime(duration) }}</span>
            </div>
          </div>
        </div>

        <!-- Progress bar -->
        <div
          class="progress-bar"
          @click="handleSeek"
          ref="progressBarRef"
          role="slider"
          tabindex="0"
          aria-label="Music progress"
        >
          <div class="progress-fill" :style="{ width: progress + '%' }" />
        </div>

        <!-- Controls row -->
        <div class="controls-row">
          <!-- Repeat mode toggle -->
          <button
            @click="toggleRepeatMode"
            class="icon-btn"
            :class="{ 'active': repeatMode > 0 }"
            :title="repeatMode === 1 ? '单曲循环' : '列表循环'"
          >
            <!-- Single repeat (loop + 1) -->
            <svg v-if="repeatMode === 1" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
              <text x="12" y="16" text-anchor="middle" font-size="10" font-weight="bold" fill="currentColor">1</text>
            </svg>
            <!-- List loop (regular repeat) -->
            <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
            </svg>
          </button>

          <!-- Prev -->
          <button @click="prevSong" class="icon-btn" title="上一首">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
            </svg>
          </button>

          <!-- Play/Pause (larger, themed) -->
          <button
            @click="togglePlay"
            class="play-btn"
            :style="{ background: 'var(--primary)' }"
            :title="isPlaying ? '暂停' : '播放'"
          >
            <svg v-if="isPlaying" class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
            <svg v-else class="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>

          <!-- Next -->
          <button @click="nextSong" class="icon-btn" title="下一首">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
            </svg>
          </button>

          <!-- Playlist toggle -->
          <button
            @click="showPlaylist = !showPlaylist"
            class="icon-btn"
            :class="{ 'active': showPlaylist }"
            title="播放列表"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/>
            </svg>
          </button>
        </div>

        <!-- Volume control -->
        <div class="volume-wrap">
          <button
            @click="toggleMute"
            class="volume-btn"
            :title="isMuted || volume === 0 ? '取消静音' : '静音'"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path v-if="isMuted || volume === 0" d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
              <path v-else d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          </button>
          <div
            class="volume-slider"
            ref="volumeSliderRef"
            @pointerdown="startVolumeDrag"
            role="slider"
            tabindex="0"
            aria-label="音量"
            aria-valuemin="0"
            aria-valuemax="100"
            :aria-valuenow="Math.round((isMuted ? 0 : volume) * 100)"
          >
            <div class="volume-fill" :style="{ width: (isMuted ? 0 : volume * 100) + '%' }" />
          </div>
          <span class="volume-pct text-[10px] text-slate-400 font-mono w-8 text-right">
            {{ Math.round((isMuted ? 0 : volume) * 100) }}
          </span>
        </div>

        <!-- Playlist -->
        <Transition name="playlist-slide">
          <div v-if="showPlaylist && playlist.length > 0" class="playlist-shell">
            <div class="playlist-content">
              <div
                v-for="(song, i) in playlist"
                :key="song.id || i"
                @click="playIndex(i)"
                class="playlist-item"
                :class="{ 'current': i === currentIndex }"
              >
                <img
                  :src="song.cover"
                  :alt="song.title"
                  class="w-8 h-8 rounded-lg object-cover shrink-0"
                />
                <div class="min-w-0 flex-1">
                  <p class="playlist-title truncate">{{ song.title }}</p>
                  <p class="playlist-artist truncate">{{ song.artist }}</p>
                </div>
                <span v-if="i === currentIndex && isPlaying" class="text-[10px] text-(--primary) shrink-0">♫</span>
              </div>
            </div>
          </div>
        </Transition>

        <!-- Hidden audio element -->
        <audio
          ref="audioRef"
          :src="currentSong.src"
          @timeupdate="onTimeUpdate"
          @loadedmetadata="onLoadedMetadata"
          @ended="onEnded"
          @loadstart="isLoading = true"
          @loadeddata="isLoading = false"
        />
      </div>
    </Transition>

    <!-- ===== Bottom buttons (stacked vertically) ===== -->
    <div class="flex flex-col items-center gap-3">
      <!-- Music FAB button (top) -->
      <button
        @click="toggleMusicPanel"
        class="music-fab"
        :class="{ active: showMusicPanel, playing: isPlaying }"
        :title="showMusicPanel ? '收起音乐' : '音乐'"
      >
        <svg
          class="w-5 h-5"
          :class="showMusicPanel ? 'text-white' : ''"
          :style="showMusicPanel ? {} : { color: 'var(--primary)' }"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
        </svg>
      </button>

      <!-- Back to top (logo) - bottom -->
      <button
        @click="scrollToTop"
        @mouseenter="logoHovered = true"
        @mouseleave="logoHovered = false"
        class="back-top-btn flex items-center justify-center"
        title="回到顶部"
      >
        <div
          v-show="!logoHovered"
          class="w-full h-full rounded-full overflow-hidden bg-white dark:bg-slate-800 flex items-center justify-center"
        >
          <img
            src="/logo.png"
            alt="logo"
            class="w-full h-full object-cover animate-spin"
            style="animation-duration: 6s;"
          />
        </div>
        <div
          v-show="logoHovered"
          class="w-full h-full flex items-center justify-center"
          :style="{ background: 'var(--primary)' }"
        >
          <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Song {
  id?: number
  title: string
  artist: string
  cover: string
  src: string
}

type RepeatMode = 0 | 1 // 0 = list loop, 1 = single repeat

const playlist: Song[] = [
  {
    id: 1,
    title: '夜空中最亮的星',
    artist: '逃跑计划',
    cover: 'https://bu.dusays.com/2026/03/24/69c1e38b346cb.jpg',
    src: 'https://music.163.com/song/media/outer/url?id=25705172.mp3',
  },
  {
    id: 2,
    title: '晴天',
    artist: '周杰伦',
    cover: 'https://bu.dusays.com/2026/03/24/69c1e38b4c370.jpg',
    src: 'https://music.163.com/song/media/outer/url?id=186016.mp3',
  },
  {
    id: 3,
    title: '起风了',
    artist: '买辣椒也用券',
    cover: 'https://bu.dusays.com/2026/03/24/69c1e38b346cb.jpg',
    src: 'https://music.163.com/song/media/outer/url?id=505262458.mp3',
  },
  {
    id: 4,
    title: '稻香',
    artist: '周杰伦',
    cover: 'https://bu.dusays.com/2026/03/24/69c1e38b4c370.jpg',
    src: 'https://music.163.com/song/media/outer/url?id=186016.mp3',
  },
]

const showMusicPanel = ref(false)
const showPlaylist = ref(false)
const logoHovered = ref(false)

const currentIndex = ref(0)
const isPlaying = ref(false)
const isLoading = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(0.3)
const isMuted = ref(false)
const repeatMode = ref<RepeatMode>(1) // Default: single repeat

const audioRef = ref<HTMLAudioElement | null>(null)
const progressBarRef = ref<HTMLDivElement | null>(null)
const volumeSliderRef = ref<HTMLDivElement | null>(null)

const currentSong = computed(() => playlist[currentIndex.value])
const progress = computed(() => duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0)

function formatTime(time: number): string {
  if (!time || isNaN(time)) return '00:00'
  const m = Math.floor(time / 60)
  const s = Math.floor(time % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

function toggleMusicPanel() {
  showMusicPanel.value = !showMusicPanel.value
  if (!showMusicPanel.value) {
    showPlaylist.value = false
  }
}

function togglePlay() {
  if (!audioRef.value) return
  if (isPlaying.value) {
    audioRef.value.pause()
  } else {
    audioRef.value.play().catch(() => {})
  }
}

function loadSong(index: number, autoPlay = true) {
  currentIndex.value = index
  currentTime.value = 0
  if (audioRef.value) {
    audioRef.value.src = playlist[index].src
    audioRef.value.load()
    if (autoPlay) {
      audioRef.value.play().catch(() => {})
    }
  }
}

function nextSong() {
  const next = (currentIndex.value + 1) % playlist.length
  loadSong(next, true)
}

function prevSong() {
  const prev = (currentIndex.value - 1 + playlist.length) % playlist.length
  loadSong(prev, true)
}

function playIndex(index: number) {
  if (index < 0 || index >= playlist.length) return
  loadSong(index, true)
}

function onTimeUpdate() {
  if (!audioRef.value) return
  currentTime.value = audioRef.value.currentTime
}

function onLoadedMetadata() {
  if (!audioRef.value) return
  duration.value = audioRef.value.duration
}

function onEnded() {
  if (repeatMode.value === 1) {
    // Single repeat: restart current song
    if (audioRef.value) {
      audioRef.value.currentTime = 0
      audioRef.value.play().catch(() => {})
    }
  } else {
    // List loop: go to next
    nextSong()
  }
}

function handleSeek(e: MouseEvent) {
  if (!progressBarRef.value || !audioRef.value || !duration.value) return
  const rect = progressBarRef.value.getBoundingClientRect()
  const ratio = (e.clientX - rect.left) / rect.width
  const time = Math.max(0, Math.min(1, ratio)) * duration.value
  audioRef.value.currentTime = time
  currentTime.value = time
}

function toggleRepeatMode() {
  repeatMode.value = repeatMode.value === 0 ? 1 : 0
}

function toggleMute() {
  isMuted.value = !isMuted.value
  if (audioRef.value) {
    audioRef.value.muted = isMuted.value
  }
}

let volumeDragging = false

function startVolumeDrag(e: PointerEvent) {
  if (!volumeSliderRef.value) return
  volumeDragging = true
  updateVolume(e)
  volumeSliderRef.value.setPointerCapture(e.pointerId)

  const handleMove = (moveEvent: PointerEvent) => {
    if (!volumeDragging) return
    updateVolume(moveEvent)
  }

  const handleEnd = () => {
    volumeDragging = false
    document.removeEventListener('pointermove', handleMove)
    document.removeEventListener('pointerup', handleEnd)
  }

  document.addEventListener('pointermove', handleMove)
  document.addEventListener('pointerup', handleEnd)
}

function updateVolume(e: PointerEvent) {
  if (!volumeSliderRef.value) return
  const rect = volumeSliderRef.value.getBoundingClientRect()
  const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  volume.value = ratio
  isMuted.value = ratio === 0
  if (audioRef.value) {
    audioRef.value.volume = ratio
    audioRef.value.muted = ratio === 0
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  if (audioRef.value) {
    audioRef.value.volume = volume.value
  }
})
</script>

<style scoped>
/* ===== Music Panel (Mizuki-style) ===== */
.fab-music-panel {
  position: relative;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(148, 163, 184, 0.35);
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.08);
}

:global(.dark) .fab-music-panel {
  background: rgba(24, 25, 38, 0.92);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.5);
}

.title-text {
  font-weight: 600;
  font-size: 0.875rem;
  color: #1e293b;
  line-height: 1.2;
}

:global(.dark) .title-text {
  color: #f5f5f5;
}

.artist-text {
  font-size: 0.75rem;
  color: #94a3b8;
}

.time-label {
  font-size: 0.7rem;
  color: #94a3b8;
  font-family: inherit;
}

/* Progress bar */
.progress-bar {
  position: relative;
  width: 100%;
  height: 0.375rem;
  border-radius: 9999px;
  background: rgba(148, 163, 184, 0.25);
  overflow: hidden;
  cursor: pointer;
  margin-bottom: 0.6rem;
}

.progress-fill {
  height: 100%;
  border-radius: inherit;
  background: var(--primary);
  transition: width 100ms linear;
}

/* Controls */
.controls-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.25rem;
  margin-bottom: 0.6rem;
}

.icon-btn {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  border-radius: 0.5rem;
  transition: color 150ms ease, transform 150ms ease;
  flex: 0 0 auto;
}

.icon-btn:hover {
  color: var(--primary);
}

.icon-btn:active {
  transform: scale(0.96);
}

.icon-btn.active {
  color: var(--primary);
}

.play-btn {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 150ms ease, box-shadow 150ms ease;
  flex: 0 0 auto;
}

.play-btn:hover {
  transform: scale(1.08);
}

.play-btn:active {
  transform: scale(0.96);
}

/* Volume */
.volume-wrap {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.volume-btn {
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  border-radius: 0.375rem;
  transition: color 150ms ease;
}

.volume-btn:hover {
  color: var(--primary);
}

.volume-slider {
  position: relative;
  flex: 1;
  height: 0.25rem;
  border-radius: 9999px;
  background: rgba(148, 163, 184, 0.25);
  overflow: hidden;
  cursor: pointer;
  transition: height 150ms ease;
}

.volume-slider:hover {
  height: 0.375rem;
}

.volume-fill {
  height: 100%;
  background: var(--primary);
  border-radius: inherit;
  transition: width 100ms linear;
}

/* Playlist */
.playlist-shell {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(148, 163, 184, 0.15);
}

.playlist-content {
  overflow-y: auto;
  max-height: 10rem;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.playlist-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.4rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 150ms ease;
}

.playlist-item:hover {
  background: rgba(148, 163, 184, 0.12);
}

.playlist-item.current {
  background: rgba(var(--primary-rgb, 99, 102, 241), 0.08);
}

.playlist-title {
  font-size: 0.75rem;
  font-weight: 500;
  color: #1e293b;
}

:global(.dark) .playlist-title {
  color: #e2e8f0;
}

.playlist-artist {
  font-size: 0.625rem;
  color: #94a3b8;
}

/* ===== FAB Buttons ===== */
.music-fab {
  position: relative;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(148, 163, 184, 0.45);
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
}

.music-fab:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.music-fab:active {
  transform: scale(0.94);
}

.music-fab.active {
  background: var(--primary);
}

.music-fab.playing::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: 1px solid color-mix(in srgb, var(--primary) 35%, transparent);
  animation: fab-pulse 1.8s ease-out infinite;
}

:global(.dark) .music-fab {
  background: rgba(30, 41, 59, 0.8);
  border-color: rgba(255, 255, 255, 0.15);
}

.back-top-btn {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 9999px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid rgba(148, 163, 184, 0.45);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
}

.back-top-btn:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: scale(1.05);
}

:global(.dark) .back-top-btn {
  border-color: rgba(255, 255, 255, 0.15);
}

/* Animations */
@keyframes fab-pulse {
  0% { opacity: 0; transform: scale(0.92); }
  30% { opacity: 0.75; }
  100% { opacity: 0; transform: scale(1.12); }
}

.music-panel-enter-active,
.music-panel-leave-active {
  transition: all 0.25s ease-out;
}

.music-panel-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.95);
  pointer-events: none;
}

.music-panel-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.95);
  pointer-events: none;
}

.playlist-slide-enter-active,
.playlist-slide-leave-active {
  transition: all 0.2s ease-out;
}

.playlist-slide-enter-from,
.playlist-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Responsive */
@media (width < 640px) {
  .fab-music-panel {
    padding: 0.9rem 0.85rem;
    border-radius: 1rem;
  }
  .music-fab,
  .back-top-btn {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.75rem;
  }
}
</style>
