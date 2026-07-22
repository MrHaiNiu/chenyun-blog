import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(true)
  const mounted = ref(false)

  // Theme color (hue 0-360)
  const themeHue = ref(240) // default indigo
  // Page width
  const pageWidth = ref(75) // rem
  // Banner height
  const bannerHeight = ref(60) // vh
  // Card border radius
  const cardRadius = ref(24) // px
  // Enable card border
  const enableCardBorder = ref(true)
  // Layout: full / sidebar
  const layoutMode = ref<'sidebar' | 'full'>('sidebar')
  // Wallpaper (custom bg image)
  const wallpaperUrl = ref<string>('')
  // Banner enabled
  const bannerEnabled = ref(true)

  function init() {
    mounted.value = true
    const savedTheme = localStorage.getItem('blog-theme')
    isDark.value = savedTheme !== 'light'

    // Load saved settings
    const savedHue = localStorage.getItem('blog-hue')
    if (savedHue) themeHue.value = parseInt(savedHue)

    const savedWidth = localStorage.getItem('blog-page-width')
    if (savedWidth) pageWidth.value = parseInt(savedWidth)

    const savedBannerHeight = localStorage.getItem('blog-banner-height')
    if (savedBannerHeight) bannerHeight.value = parseInt(savedBannerHeight)

    const savedRadius = localStorage.getItem('blog-card-radius')
    if (savedRadius) cardRadius.value = parseInt(savedRadius)

    const savedLayout = localStorage.getItem('blog-layout')
    if (savedLayout === 'full' || savedLayout === 'sidebar') layoutMode.value = savedLayout

    const savedWallpaper = localStorage.getItem('blog-wallpaper')
    if (savedWallpaper) wallpaperUrl.value = savedWallpaper

    const savedBanner = localStorage.getItem('blog-banner-enabled')
    if (savedBanner !== null) bannerEnabled.value = savedBanner === 'true'

    applyTheme()
    applySettings()
  }

  function applyTheme() {
    const root = document.documentElement
    if (isDark.value) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  function applySettings() {
    const root = document.documentElement
    // Set CSS variables — use --hue for the CSS color system
    root.style.setProperty('--hue', `${themeHue.value}`)
    root.style.setProperty('--page-width', `${pageWidth.value}rem`)
    root.style.setProperty('--banner-height', `${bannerHeight.value}vh`)
    root.style.setProperty('--card-radius', `${cardRadius.value}px`)

    // Wallpaper
    if (wallpaperUrl.value) {
      document.body.style.backgroundImage = `url(${wallpaperUrl.value})`
      document.body.style.backgroundSize = 'cover'
      document.body.style.backgroundAttachment = 'fixed'
      document.body.style.backgroundPosition = 'center'
    } else {
      document.body.style.backgroundImage = ''
    }
  }

  function toggleTheme() {
    isDark.value = !isDark.value
    localStorage.setItem('blog-theme', isDark.value ? 'dark' : 'light')
    applyTheme()
  }

  function setHue(hue: number) {
    themeHue.value = hue
    localStorage.setItem('blog-hue', `${hue}`)
    applySettings()
  }

  function setPageWidth(width: number) {
    pageWidth.value = width
    localStorage.setItem('blog-page-width', `${width}`)
    applySettings()
  }

  function setBannerHeight(height: number) {
    bannerHeight.value = height
    localStorage.setItem('blog-banner-height', `${height}`)
    applySettings()
  }

  function setCardRadius(radius: number) {
    cardRadius.value = radius
    localStorage.setItem('blog-card-radius', `${radius}`)
    applySettings()
  }

  function setLayoutMode(mode: 'sidebar' | 'full') {
    layoutMode.value = mode
    localStorage.setItem('blog-layout', mode)
    applySettings()
  }

  function setWallpaper(url: string) {
    wallpaperUrl.value = url
    localStorage.setItem('blog-wallpaper', url)
    applySettings()
  }

  function setBannerEnabled(enabled: boolean) {
    bannerEnabled.value = enabled
    localStorage.setItem('blog-banner-enabled', `${enabled}`)
    applySettings()
  }

  function resetSettings() {
    themeHue.value = 240
    pageWidth.value = 75
    bannerHeight.value = 60
    cardRadius.value = 24
    layoutMode.value = 'sidebar'
    wallpaperUrl.value = ''
    bannerEnabled.value = true
    localStorage.removeItem('blog-hue')
    localStorage.removeItem('blog-page-width')
    localStorage.removeItem('blog-banner-height')
    localStorage.removeItem('blog-card-radius')
    localStorage.removeItem('blog-layout')
    localStorage.removeItem('blog-wallpaper')
    localStorage.removeItem('blog-banner-enabled')
    applySettings()
  }

  watch(isDark, () => {
    if (mounted.value) applyTheme()
  })

  return {
    isDark, mounted,
    themeHue, pageWidth, bannerHeight, cardRadius, layoutMode, wallpaperUrl, bannerEnabled,
    init, toggleTheme, applySettings,
    setHue, setPageWidth, setBannerHeight, setCardRadius, setLayoutMode, setWallpaper, setBannerEnabled, resetSettings,
  }
})
