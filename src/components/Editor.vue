<script setup lang="ts">
interface Props {
  modelValue: string
  isFullscreen: boolean
  isPreviewOnly: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'insert', prefix: string, suffix?: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

interface ToolbarItem {
  icon: string
  prefix: string
  suffix?: string
  title: string
}

const toolbarItems: ToolbarItem[] = [
  { icon: 'H1', prefix: '# ', title: '标题1' },
  { icon: 'H2', prefix: '## ', title: '标题2' },
  { icon: 'H3', prefix: '### ', title: '标题3' },
  { icon: 'B', prefix: '**', suffix: '**', title: '粗体' },
  { icon: 'I', prefix: '*', suffix: '*', title: '斜体' },
  { icon: 'S', prefix: '~~', suffix: '~~', title: '删除线' },
  { icon: 'code', prefix: '`', suffix: '`', title: '行内代码' },
  { icon: '```', prefix: '```\n', suffix: '\n```', title: '代码块' },
  { icon: '•', prefix: '- ', title: '无序列表' },
  { icon: '1.', prefix: '1. ', title: '有序列表' },
  { icon: '❝', prefix: '> ', title: '引用' },
  { icon: '—', prefix: '---', title: '分割线' },
  { icon: '🔗', prefix: '[', suffix: '](url)', title: '链接' },
  { icon: '🖼️', prefix: '![alt](', suffix: ')', title: '图片' },
  { icon: '📊', prefix: '| 列1 | 列2 | 列3 |\n| --- | --- | --- |\n| 内容1 | 内容2 | 内容3 |', title: '表格' }
]

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Tab') {
    event.preventDefault()
    const target = event.target as HTMLTextAreaElement
    const start = target.selectionStart
    const end = target.selectionEnd
    
    const newValue = props.modelValue.substring(0, start) + '  ' + props.modelValue.substring(end)
    emit('update:modelValue', newValue)
    
    setTimeout(() => {
      target.selectionStart = target.selectionEnd = start + 2
    }, 0)
  }
}

const handleToolbarClick = (item: ToolbarItem) => {
  emit('insert', item.prefix, item.suffix)
}
</script>

<template>
  <div class="editor-section" :class="{ fullscreen: isFullscreen, hidden: isPreviewOnly }">
    <div class="editor-pane">
      <div class="pane-header">
        <span class="pane-title">
          <svg class="title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          编辑器
        </span>
        <slot name="header-actions"></slot>
      </div>
      
      <div class="toolbar">
        <button
          v-for="item in toolbarItems"
          :key="item.title"
          class="toolbar-btn"
          :title="item.title"
          @click="handleToolbarClick(item)"
        >
          {{ item.icon }}
        </button>
      </div>

      <div class="editor-wrapper">
        <textarea
          id="editor"
          class="editor-textarea"
          :value="modelValue"
          @input="handleInput"
          @keydown="handleKeyDown"
          placeholder="在这里输入 Markdown 内容..."
          spellcheck="false"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<style scoped>
.editor-section {
  display: flex;
  flex-direction: column;
  width: 50%;
  height: 100%;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.editor-section.fullscreen {
  width: 100%;
  position: absolute;
  top: 57px;
  left: 0;
  height: calc(100vh - 57px);
  z-index: 100;
  background: var(--bg-primary);
}

.editor-section.hidden {
  display: none;
}

.editor-pane {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: var(--editor-bg);
  border-right: 1px solid var(--border-color);
}

.pane-header {
  padding: 12px 20px;
  background: linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.pane-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.title-icon {
  width: 18px;
  height: 18px;
  color: var(--accent-color);
}

.toolbar {
  padding: 10px 16px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  gap: 6px;
  flex-wrap: nowrap;
  overflow-x: auto;
  flex-shrink: 0;
}

.toolbar::-webkit-scrollbar {
  height: 3px;
}

.toolbar::-webkit-scrollbar-track {
  background: transparent;
}

.toolbar::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 2px;
}

.toolbar-btn {
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 600;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
}

.toolbar-btn:hover {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
}

.toolbar-btn:active {
  transform: translateY(0);
}

.editor-wrapper {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.editor-textarea {
  width: 100%;
  height: 100%;
  padding: 24px 28px;
  border: none;
  outline: none;
  resize: none;
  font-family: 'JetBrains Mono', 'SF Mono', 'Monaco', 'Menlo', monospace;
  font-size: 14px;
  line-height: 1.9;
  background: var(--editor-bg);
  color: var(--text-primary);
  tab-size: 4;
  letter-spacing: 0.3px;
}

.editor-textarea::placeholder {
  color: var(--text-muted);
  font-style: italic;
}

.editor-textarea:focus {
  background: var(--bg-primary);
}

@media (max-width: 768px) {
  .editor-section {
    width: 100%;
    height: 50%;
  }

  .editor-section.fullscreen {
    height: calc(100vh - 57px);
  }

  .pane-header {
    padding: 10px 16px;
  }

  .toolbar {
    padding: 8px 12px;
    gap: 4px;
  }

  .toolbar-btn {
    padding: 5px 8px;
    font-size: 10px;
  }

  .editor-textarea {
    padding: 16px 20px;
    font-size: 13px;
  }
}
</style>
