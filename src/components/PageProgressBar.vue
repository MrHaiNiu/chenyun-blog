<template>
  <div id="page-progress-bar" />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

let removeBeforeEach: (() => void) | undefined
let removeAfterEach: (() => void) | undefined
let finishTimer: ReturnType<typeof setTimeout> | undefined
let doneTimer: ReturnType<typeof setTimeout> | undefined

// ===== Scroll-based progress =====
let ticking = false

function updateScrollProgress() {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  const bar = document.getElementById('page-progress-bar')
  if (!bar) return

  if (docHeight <= 0 || scrollTop <= 0) {
    // At top — hide bar
    bar.style.width = '0'
    bar.classList.remove('loading', 'finishing', 'done')
    bar.style.opacity = '0'
    return
  }

  const percent = Math.min((scrollTop / docHeight) * 100, 100)
  bar.style.width = percent + '%'
  bar.style.opacity = '1'
}

function onScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateScrollProgress()
      ticking = false
    })
    ticking = true
  }
}

// ===== Route-change progress =====
function clearTimers() {
  if (finishTimer) { clearTimeout(finishTimer); finishTimer = undefined }
  if (doneTimer) { clearTimeout(doneTimer); doneTimer = undefined }
}

function handleRouteChangeStart() {
  clearTimers()
  const bar = document.getElementById('page-progress-bar')
  if (bar) {
    bar.classList.remove('finishing', 'done')
    // Force reflow
    void bar.offsetWidth
    bar.classList.add('loading')
  }
}

function handleRouteChangeEnd() {
  const bar = document.getElementById('page-progress-bar')
  if (bar) {
    bar.classList.remove('loading')
    bar.classList.add('finishing')
    finishTimer = setTimeout(() => {
      bar.classList.remove('finishing')
      bar.classList.add('done')
      doneTimer = setTimeout(() => {
        bar.classList.remove('done')
      }, 300)
    }, 200)
  }
}

function handleProgressTrigger() {
  handleRouteChangeStart()
  setTimeout(() => {
    handleRouteChangeEnd()
  }, 600)
}

onMounted(() => {
  // Route listeners
  removeBeforeEach = router.beforeEach(() => {
    handleRouteChangeStart()
  })
  removeAfterEach = router.afterEach(() => {
    handleRouteChangeEnd()
  })

  // Scroll listener
  window.addEventListener('scroll', onScroll, { passive: true })
  // Custom progress trigger event
  window.addEventListener('page-progress-trigger', handleProgressTrigger)
  // Initial check
  updateScrollProgress()
})

onUnmounted(() => {
  clearTimers()
  if (removeBeforeEach) removeBeforeEach()
  if (removeAfterEach) removeAfterEach()
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('page-progress-trigger', handleProgressTrigger)
})
</script>
