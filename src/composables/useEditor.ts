import { ref, computed, watch } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

export function useEditor() {
  const content = ref('')
  const isFullscreen = ref(false)
  const isPreviewOnly = ref(false)

  const wordCount = computed(() => {
    const text = content.value.trim()
    return text ? text.split(/\s+/).length : 0
  })

  const charCount = computed(() => content.value.length)

  const previewHtml = computed(() => {
    if (!content.value.trim()) {
      return '<p style="color: var(--text-muted); text-align: center; margin-top: 40px;">开始编辑，实时预览将显示在这里</p>'
    }

    marked.setOptions({
      breaks: true,
      gfm: true
    })

    const html = marked.parse(content.value)
    return DOMPurify.sanitize(html as string)
  })

  const toggleFullscreen = () => {
    isFullscreen.value = !isFullscreen.value
  }

  const togglePreviewOnly = () => {
    isPreviewOnly.value = !isPreviewOnly.value
  }

  const insertText = (prefix: string, suffix = '') => {
    const editor = document.getElementById('editor') as HTMLTextAreaElement
    if (!editor) return

    const start = editor.selectionStart
    const end = editor.selectionEnd
    const selectedText = content.value.substring(start, end)

    const before = content.value.substring(0, start)
    const after = content.value.substring(end)

    content.value = before + prefix + selectedText + suffix + after

    // Restore cursor position
    setTimeout(() => {
      const newPos = start + prefix.length + selectedText.length + suffix.length
      editor.focus()
      editor.setSelectionRange(newPos, newPos)
    }, 0)
  }

  const loadSample = () => {
    content.value = `# 欢迎使用 Markdown 编辑器

这是一个功能强大的 Markdown 编辑器，专为公众号排版设计。

## 主要功能

- **实时预览**：左侧编辑，右侧实时预览
- **主题切换**：支持亮色/暗色模式
- **公众号兼容**：一键复制为公众号优化格式
- **自动保存**：内容自动保存到本地

## 支持的语法

### 标题
\`\`\`
# 一级标题
## 二级标题
### 三级标题
\`\`\`

### 列表
- 无序列表项 1
- 无序列表项 2

1. 有序列表项 1
2. 有序列表项 2

### 代码
行内代码：\`const a = 1;\`

代码块：
\`\`\`javascript
function hello() {
    console.log('Hello, World!');
}
\`\`\`

### 表格
| 功能 | 描述 |
|------|------|
| 编辑 | 实时编辑 |
| 预览 | 实时预览 |

### 引用
> 这是一段引用文字
> 可以有多行

## 开始使用

直接在左侧编辑区输入 Markdown 内容，点击右上角的「复制为公众号格式」按钮即可复制到剪贴板。
`
  }

  const saveToLocal = () => {
    localStorage.setItem('markdownContent', content.value)
    return true
  }

  const loadFromLocal = () => {
    const saved = localStorage.getItem('markdownContent')
    if (saved) {
      content.value = saved
      return true
    }
    return false
  }

  // Auto-save
  let autoSaveTimer: ReturnType<typeof setInterval>
  watch(content, () => {
    clearInterval(autoSaveTimer)
    autoSaveTimer = setInterval(() => {
      localStorage.setItem('markdownContent', content.value)
    }, 2000)
  })

  return {
    content,
    wordCount,
    charCount,
    previewHtml,
    isFullscreen,
    isPreviewOnly,
    toggleFullscreen,
    togglePreviewOnly,
    insertText,
    loadSample,
    saveToLocal,
    loadFromLocal
  }
}
