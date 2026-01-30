<script setup lang="ts">
interface Props {
  isDark: boolean
  isFullscreen: boolean
  wordCount: number
  charCount: number
}

interface Emits {
  (e: 'toggle-theme'): void
  (e: 'toggle-fullscreen'): void
  (e: 'copy'): void
  (e: 'load-sample'): void
  (e: 'save'): void
  (e: 'load'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<template>
  <header class="header">
    <div class="header-content">
      <div class="logo">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <path d="M14 2v6h6"/>
            <path d="M16 13H8"/>
            <path d="M16 17H8"/>
            <path d="M10 9H8"/>
          </svg>
        </div>
        <span class="logo-text">Markdown</span>
        <span class="logo-subtext">编辑器</span>
      </div>

      <div class="header-actions">
        <button class="action-btn" @click="$emit('load-sample')" title="加载示例">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <path d="M14 2v6h6"/>
          </svg>
          <span>示例</span>
        </button>
        
        <button class="action-btn" @click="$emit('save')" title="保存">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
            <polyline points="17 21 17 13 7 13 7 21"/>
            <polyline points="7 3 7 8 15 8"/>
          </svg>
          <span>保存</span>
        </button>
        
        <button class="action-btn" @click="$emit('load')" title="加载">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <span>加载</span>
        </button>

        <div class="divider"></div>

        <button 
          class="action-btn" 
          :class="{ active: isFullscreen }"
          @click="$emit('toggle-fullscreen')" 
          title="全屏模式"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 3 21 3 21 9"/>
            <polyline points="9 21 3 21 3 15"/>
            <line x1="21" y1="3" x2="14" y2="10"/>
            <line x1="3" y1="21" x2="10" y2="14"/>
          </svg>
        </button>

        <button class="action-btn theme-toggle" @click="$emit('toggle-theme')" title="切换主题">
          <svg class="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <svg class="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>

        <button class="primary-btn" @click="$emit('copy')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          <span>复制为公众号格式</span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  background: linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
  border-bottom: 1px solid var(--border-color);
  padding: 12px 24px;
  position: sticky;
  top: 0;
  z-index: 200;
  backdrop-filter: blur(20px);
  background: rgba(var(--bg-primary-rgb), 0.9);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 100%;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, var(--accent-color) 0%, #096dd9 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

.logo-icon svg {
  width: 20px;
  height: 20px;
  color: white;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.5px;
}

.logo-subtext {
  font-size: 18px;
  font-weight: 400;
  color: var(--text-muted);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

.action-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--border-color);
}

.action-btn.active {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
}

.divider {
  width: 1px;
  height: 24px;
  background: var(--border-color);
  margin: 0 8px;
}

.theme-toggle {
  position: relative;
  overflow: hidden;
}

.theme-toggle .sun-icon,
.theme-toggle .moon-icon {
  transition: all 0.3s ease;
}

.theme-toggle .sun-icon {
  opacity: 1;
  transform: rotate(0deg);
}

.theme-toggle .moon-icon {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, 100%);
  opacity: 0;
}

[data-theme="dark"] .theme-toggle .sun-icon {
  transform: translateY(-100%);
  opacity: 0;
}

[data-theme="dark"] .theme-toggle .moon-icon {
  transform: translate(-50%, -50%);
  opacity: 1;
}

.primary-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: linear-gradient(135deg, var(--accent-color) 0%, #096dd9 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.25);
}

.primary-btn svg {
  width: 18px;
  height: 18px;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(24, 144, 255, 0.35);
}

.primary-btn:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .header {
    padding: 10px 16px;
  }

  .header-content {
    flex-wrap: wrap;
    gap: 12px;
  }

  .header-actions {
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .action-btn span {
    display: none;
  }

  .action-btn {
    padding: 8px;
  }

  .primary-btn span {
    display: none;
  }

  .primary-btn {
    padding: 10px;
  }

  .divider {
    display: none;
  }
}
</style>
