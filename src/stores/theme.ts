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
  const bannerHeight = ref(100) // vh
  // Card border radius
  const cardRadius = ref(24) // px
  // Enable card border
  const enableCardBorder = ref(true)
  // Layout: full / sidebar
  const layoutMode = ref<'sidebar' | 'full'>('sidebar')
  // Post list layout: list / grid
  const postLayout = ref<'list' | 'grid'>('list')
  // Banner enabled
  const bannerEnabled = ref(true)
  // Background color theme preset id
  const bgThemeId = ref(0)
  // Wallpaper (custom bg image)
  const wallpaperUrl = ref<string>('')

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

    const savedBanner = localStorage.getItem('blog-banner-enabled')
    if (savedBanner !== null) bannerEnabled.value = savedBanner === 'true'

    const savedBgTheme = localStorage.getItem('blog-bg-theme-id')
    if (savedBgTheme !== null) bgThemeId.value = parseInt(savedBgTheme)

    const savedPostLayout = localStorage.getItem('blog-post-layout')
    if (savedPostLayout === 'list' || savedPostLayout === 'grid') postLayout.value = savedPostLayout

    const savedWallpaper = localStorage.getItem('blog-wallpaper')
    if (savedWallpaper) wallpaperUrl.value = savedWallpaper

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

  function toggleTheme() {
    isDark.value = !isDark.value
    localStorage.setItem('blog-theme', isDark.value ? 'dark' : 'light')
    applyTheme()
    applySettings()
  }

  // Background color presets — each has page bg + card/panel colors
  const bgPresets = [
    {
      id: 0, name: '默认',
      light: '#f8fafc', dark: '#020617',
      cardLight: '#ffffff', cardDark: '#181926',
      cardTransLight: 'rgba(255,255,255,0.8)', cardTransDark: 'rgba(24,25,38,0.8)',
      floatLight: '#ffffff', floatDark: '#181926',
    },
    {
      id: 1, name: '靛蓝',
      light: '#eef2ff', dark: '#0f1219',
      cardLight: '#ffffff', cardDark: '#181926',
      cardTransLight: 'rgba(255,255,255,0.8)', cardTransDark: 'rgba(24,25,38,0.8)',
      floatLight: '#ffffff', floatDark: '#181926',
    },
    {
      id: 2, name: '暖白',
      light: '#fdf6ee', dark: '#1a1612',
      cardLight: '#ffffff', cardDark: '#22201c',
      cardTransLight: 'rgba(255,255,255,0.8)', cardTransDark: 'rgba(34,32,28,0.8)',
      floatLight: '#ffffff', floatDark: '#22201c',
    },
    {
      id: 3, name: '雾蓝',
      light: '#eef2f7', dark: '#0f141e',
      cardLight: '#ffffff', cardDark: '#1a1f2e',
      cardTransLight: 'rgba(255,255,255,0.8)', cardTransDark: 'rgba(26,31,46,0.8)',
      floatLight: '#ffffff', floatDark: '#1a1f2e',
    },
    {
      id: 4, name: '薄暮',
      light: '#fdf0f5', dark: '#1e1218',
      cardLight: '#ffffff', cardDark: '#2a1a22',
      cardTransLight: 'rgba(255,255,255,0.8)', cardTransDark: 'rgba(42,26,34,0.8)',
      floatLight: '#ffffff', floatDark: '#2a1a22',
    },
    {
      id: 5, name: '青绿',
      light: '#f0f5f2', dark: '#111a15',
      cardLight: '#ffffff', cardDark: '#1a2420',
      cardTransLight: 'rgba(255,255,255,0.8)', cardTransDark: 'rgba(26,36,32,0.8)',
      floatLight: '#ffffff', floatDark: '#1a2420',
    },
    {
      id: 6, name: '星夜',
      light: '#f5f0eb', dark: '#0d1117',
      cardLight: '#ffffff', cardDark: '#161b22',
      cardTransLight: 'rgba(255,255,255,0.8)', cardTransDark: 'rgba(22,27,34,0.8)',
      floatLight: '#ffffff', floatDark: '#161b22',
    },
  ]

  function hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return '255,255,255'
    return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
  }

  function getCurrentBgColor() {
    const preset = bgPresets.find(p => p.id === bgThemeId.value) || bgPresets[0]
    return isDark.value ? preset.dark : preset.light
  }

  function applySettings() {
    const root = document.documentElement
    // Set CSS variables — use --hue for the CSS color system
    root.style.setProperty('--hue', `${themeHue.value}`)
    root.style.setProperty('--page-width', `${pageWidth.value}rem`)
    root.style.setProperty('--banner-height', `${bannerHeight.value}vh`)
    root.style.setProperty('--card-radius', `${cardRadius.value}px`)

    // Background color from preset — set page bg + card/panel colors
    const preset = bgPresets.find(p => p.id === bgThemeId.value) || bgPresets[0]
    const isDarkMode = isDark.value
    root.style.setProperty('--page-bg', isDarkMode ? preset.dark : preset.light)
    root.style.setProperty('--card-bg', isDarkMode ? preset.cardDark : preset.cardLight)
    root.style.setProperty('--card-bg-transparent', isDarkMode ? preset.cardTransDark : preset.cardTransLight)
    root.style.setProperty('--float-panel-bg', isDarkMode ? preset.floatDark : preset.floatLight)

    // Compute glass card background colors from current card color
    const cardRgb = hexToRgb(isDarkMode ? preset.cardDark : preset.cardLight)
    root.style.setProperty('--glass-95', `rgba(${cardRgb},0.95)`)
    root.style.setProperty('--glass-70', `rgba(${cardRgb},0.7)`)
    root.style.setProperty('--glass-60', `rgba(${cardRgb},0.6)`)
    root.style.setProperty('--glass-50', `rgba(${cardRgb},0.5)`)
    root.style.setProperty('--glass-40', `rgba(${cardRgb},0.4)`)
    root.style.setProperty('--glass-30', `rgba(${cardRgb},0.3)`)

    // Background image (wallpaper)
    if (wallpaperUrl.value) {
      root.style.setProperty('--bg-image', `url(${wallpaperUrl.value})`)
      root.style.setProperty('--bg-attachment', 'fixed')
      root.style.setProperty('--bg-size', 'cover')
      root.style.setProperty('--bg-position', 'center')
    } else {
      root.style.removeProperty('--bg-image')
      root.style.removeProperty('--bg-attachment')
      root.style.removeProperty('--bg-size')
      root.style.removeProperty('--bg-position')
    }
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
    if (url) {
      localStorage.setItem('blog-wallpaper', url)
    } else {
      localStorage.removeItem('blog-wallpaper')
    }
    applySettings()
  }

  function setBannerEnabled(enabled: boolean) {
    bannerEnabled.value = enabled
    localStorage.setItem('blog-banner-enabled', `${enabled}`)
    applySettings()
  }

  function setBgThemeId(id: number) {
    bgThemeId.value = id
    localStorage.setItem('blog-bg-theme-id', `${id}`)
    applySettings()
  }

  function setPostLayout(layout: 'list' | 'grid') {
    postLayout.value = layout
    localStorage.setItem('blog-post-layout', layout)
  }

  function resetSettings() {
    themeHue.value = 240
    pageWidth.value = 75
    bannerHeight.value = 100
    cardRadius.value = 24
    layoutMode.value = 'sidebar'
    bannerEnabled.value = true
    bgThemeId.value = 0
    wallpaperUrl.value = ''
    postLayout.value = 'list'
    localStorage.removeItem('blog-hue')
    localStorage.removeItem('blog-page-width')
    localStorage.removeItem('blog-banner-height')
    localStorage.removeItem('blog-card-radius')
    localStorage.removeItem('blog-layout')
    localStorage.removeItem('blog-banner-enabled')
    localStorage.removeItem('blog-bg-theme-id')
    localStorage.removeItem('blog-wallpaper')
    localStorage.removeItem('blog-post-layout')
    applySettings()
  }

  watch(isDark, () => {
    if (mounted.value) applyTheme()
  })

  return {
    isDark, mounted,
    themeHue, pageWidth, bannerHeight, cardRadius, layoutMode, bannerEnabled, bgThemeId, bgPresets, postLayout, wallpaperUrl,
    init, toggleTheme, applySettings,
    setHue, setPageWidth, setBannerHeight, setCardRadius, setLayoutMode, setBannerEnabled, setBgThemeId, setPostLayout, setWallpaper, resetSettings,
  }
})
