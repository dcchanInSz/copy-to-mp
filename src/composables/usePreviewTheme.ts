import { ref, onMounted } from 'vue'
import { PREVIEW_THEMES } from '@/types'

export function usePreviewTheme() {
  const currentTheme = ref<string>('default')
  const themes = PREVIEW_THEMES

  const setTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId)
    if (theme) {
      currentTheme.value = themeId
      document.documentElement.setAttribute('data-preview-theme', themeId)
      localStorage.setItem('previewTheme', themeId)
    }
  }

  const initTheme = () => {
    const saved = localStorage.getItem('previewTheme')
    if (saved && themes.some(t => t.id === saved)) {
      currentTheme.value = saved
    } else {
      currentTheme.value = 'default'
    }
    document.documentElement.setAttribute('data-preview-theme', currentTheme.value)
  }

  onMounted(() => {
    initTheme()
  })

  return {
    currentTheme,
    themes,
    setTheme,
    initTheme
  }
}
