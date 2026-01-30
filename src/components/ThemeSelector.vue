<script setup lang="ts">
import { ref } from 'vue'
import { PREVIEW_THEMES } from '@/types'

interface Props {
  currentTheme: string
}

defineProps<Props>()

interface Emits {
  (e: 'change', themeId: string): void
}

const emit = defineEmits<Emits>()

const isOpen = ref(false)

const handleThemeChange = (themeId: string) => {
  emit('change', themeId)
  isOpen.value = false
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="theme-selector">
    <button class="theme-trigger" @click="toggleDropdown" :title="`当前主题: ${PREVIEW_THEMES.find(t => t.id === currentTheme)?.name}`">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="5"/>
        <path d="M12 1v2"/>
        <path d="M12 21v2"/>
        <path d="M4.22 4.22l1.42 1.42"/>
        <path d="M18.36 18.36l1.42 1.42"/>
        <path d="M1 12h2"/>
        <path d="M21 12h2"/>
        <path d="M4.22 19.78l1.42-1.42"/>
        <path d="M18.36 5.64l1.42-1.42"/>
      </svg>
      <span class="theme-icon">{{ PREVIEW_THEMES.find(t => t.id === currentTheme)?.icon }}</span>
    </button>

    <Transition name="dropdown">
      <div v-if="isOpen" class="theme-dropdown">
        <div class="dropdown-header">
          <span>选择预览主题</span>
          <button class="close-btn" @click="isOpen = false">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="theme-list">
          <button
            v-for="theme in PREVIEW_THEMES"
            :key="theme.id"
            class="theme-option"
            :class="{ active: currentTheme === theme.id }"
            @click="handleThemeChange(theme.id)"
          >
            <span class="theme-option-icon">{{ theme.icon }}</span>
            <div class="theme-option-info">
              <span class="theme-option-name">{{ theme.name }}</span>
              <span class="theme-option-desc">{{ theme.description }}</span>
            </div>
            <svg v-if="currentTheme === theme.id" class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </button>
        </div>
      </div>
    </Transition>

    <div v-if="isOpen" class="dropdown-backdrop" @click="isOpen = false"></div>
  </div>
</template>

<style scoped>
.theme-selector {
  position: relative;
}

.theme-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-trigger svg {
  width: 16px;
  height: 16px;
}

.theme-trigger:hover {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
}

.theme-icon {
  font-size: 14px;
}

.theme-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 280px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  z-index: 300;
  overflow: hidden;
}

.dropdown-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 299;
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.close-btn {
  padding: 4px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  border-radius: 4px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.close-btn svg {
  width: 14px;
  height: 14px;
}

.theme-list {
  padding: 8px;
  max-height: 320px;
  overflow-y: auto;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.theme-option:hover {
  background: var(--bg-secondary);
}

.theme-option.active {
  background: rgba(24, 144, 255, 0.1);
  border-color: var(--accent-color);
}

.theme-option-icon {
  font-size: 20px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  border-radius: 8px;
  flex-shrink: 0;
}

.theme-option.active .theme-option-icon {
  background: var(--accent-color);
}

.theme-option-info {
  flex: 1;
  min-width: 0;
}

.theme-option-name {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.theme-option-desc {
  display: block;
  font-size: 11px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.check-icon {
  width: 18px;
  height: 18px;
  color: var(--accent-color);
  flex-shrink: 0;
}

/* Dropdown animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .theme-dropdown {
    width: calc(100vw - 32px);
    right: -8px;
  }
}
</style>
