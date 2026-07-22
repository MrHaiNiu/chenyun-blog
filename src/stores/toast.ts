import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ToastMessage {
  text: string
  type: 'success' | 'warning' | 'error' | 'info'
}

export const useToastStore = defineStore('toast', () => {
  const toast = ref<ToastMessage | null>(null)
  let timer: ReturnType<typeof setTimeout> | null = null

  function showToast(text: string, type: ToastMessage['type'] = 'success') {
    toast.value = { text, type }
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      toast.value = null
    }, 3000)
  }

  return { toast, showToast }
})
