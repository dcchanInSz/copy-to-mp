<script setup lang="ts">
import { ref } from 'vue'
import Header from './components/Header.vue'
import Editor from './components/Editor.vue'
import Preview from './components/Preview.vue'
import Toast from './components/Toast.vue'
import WordCount from './components/WordCount.vue'
import ThemeSelector from './components/ThemeSelector.vue'
import { useTheme } from './composables/useTheme'
import { useEditor } from './composables/useEditor'
import { useClipboard } from './composables/useClipboard'
import { usePreviewTheme } from './composables/usePreviewTheme'

// Composables
const { isDark, toggleTheme } = useTheme()
const { currentTheme, setTheme } = usePreviewTheme()
const {
  content,
  wordCount,
  charCount,
  previewHtml,
  isFullscreen,
  isPreviewOnly,
  toggleFullscreen,
  insertText,
  loadSample,
  saveToLocal,
  loadFromLocal
} = useEditor()
const { copyForWeChat } = useClipboard()

// Handle theme change
const handleThemeChange = (themeId: string) => {
  setTheme(themeId)
  showToast(`已切换到「${['默认', '学术', '技术', '杂志'][['default', 'academic', 'tech', 'magazine'].indexOf(themeId)]}」主题`)
}

// Toast state
const toastShow = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error' | 'warning'>('success')

// Show toast notification
const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
  toastMessage.value = message
  toastType.value = type
  toastShow.value = true
  setTimeout(() => {
    toastShow.value = false
  }, 3000)
}

// Handle copy for WeChat
const handleCopy = async () => {
  const success = await copyForWeChat(content.value, currentTheme.value)
  if (success) {
    showToast('✅ 已复制到剪贴板，可以粘贴到公众号编辑器了！')
  } else {
    showToast('❌ 复制失败，请手动选择复制', 'error')
  }
}

// Handle save
const handleSave = () => {
  if (saveToLocal()) {
    showToast('✅ 已保存到本地存储')
  }
}

// Handle load
const handleLoad = () => {
  if (loadFromLocal()) {
    showToast('✅ 已从本地加载')
  } else {
    showToast('没有保存的内容', 'error')
  }
}

// Handle sample
const handleSample = () => {
  loadSample()
  showToast('✅ 已加载示例内容')
}

// Handle toolbar insert (from Editor component)
const handleToolbarInsert = (prefix: string, suffix = '') => {
  insertText(prefix, suffix)
}

// Toggle preview only mode
const togglePreview = () => {
  isPreviewOnly.value = !isPreviewOnly.value
}
</script>

<template>
  <div class="app-container">
    <Header
      :is-dark="isDark"
      :is-fullscreen="isFullscreen"
      :word-count="wordCount"
      :char-count="charCount"
      @toggle-theme="toggleTheme"
      @toggle-fullscreen="toggleFullscreen"
      @copy="handleCopy"
      @load-sample="handleSample"
      @save="handleSave"
      @load="handleLoad"
    />

    <main class="main-container">
      <Editor
        v-model="content"
        :is-fullscreen="isFullscreen"
        :is-preview-only="isPreviewOnly"
        @insert="handleToolbarInsert"
      >
        <template #header-actions>
          <WordCount :word-count="wordCount" :char-count="charCount" />
        </template>
      </Editor>

      <Preview :html="previewHtml" :is-preview-only="isPreviewOnly">
        <template #preview-actions>
          <div class="preview-actions">
            <ThemeSelector
              :current-theme="currentTheme"
              @change="handleThemeChange"
            />
            <button
              class="preview-toggle-btn"
              :class="{ active: isPreviewOnly }"
              @click="togglePreview"
              title="仅预览"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          </div>
        </template>
      </Preview>
    </main>

    <Toast
      :show="toastShow"
      :message="toastMessage"
      :type="toastType"
    />
  </div>
</template>

<style scoped>
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main-container {
  display: flex;
  flex: 1;
  overflow: hidden;
  height: calc(100vh - 57px);
  background: var(--bg-primary);
}

.preview-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.preview-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.preview-toggle-btn svg {
  width: 16px;
  height: 16px;
}

.preview-toggle-btn:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.preview-toggle-btn.active {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
}

@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
    height: calc(100vh - 110px);
  }
}
</style>
