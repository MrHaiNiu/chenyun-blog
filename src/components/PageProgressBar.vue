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

onMounted(() => {
  removeBeforeEach = router.beforeEach(() => {
    handleRouteChangeStart()
  })
  removeAfterEach = router.afterEach(() => {
    handleRouteChangeEnd()
  })
})

onUnmounted(() => {
  clearTimers()
  if (removeBeforeEach) removeBeforeEach()
  if (removeAfterEach) removeAfterEach()
})
</script>
