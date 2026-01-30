export interface EditorState {
  content: string
  wordCount: number
  charCount: number
  isFullscreen: boolean
  isPreviewOnly: boolean
}

export interface ThemeState {
  isDark: boolean
}

export interface PreviewTheme {
  id: string
  name: string
  icon: string
  description: string
}

export const PREVIEW_THEMES: PreviewTheme[] = [
  {
    id: 'default',
    name: '默认',
    icon: '◐',
    description: '现代简洁，适合日常写作'
  },
  {
    id: 'academic',
    name: '学术',
    icon: '📚',
    description: '衬线字体，正式严谨'
  },
  {
    id: 'tech',
    name: '技术',
    icon: '💻',
    description: '深色主题，代码突出'
  },
  {
    id: 'magazine',
    name: '杂志',
    icon: '✨',
    description: '优雅文艺，视觉丰富'
  }
]

export type ToastMessage = {
  id: number
  message: string
  type: 'success' | 'error' | 'warning'
}

export type InsertMode = 'prefix' | 'wrap'
