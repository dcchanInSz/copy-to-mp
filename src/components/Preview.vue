<script setup lang="ts">
interface Props {
  html: string
  isPreviewOnly: boolean
}

defineProps<Props>()
</script>

<template>
  <div class="preview-section" :class="{ fullscreen: isPreviewOnly }">
    <div class="preview-pane">
      <div class="pane-header">
        <span class="pane-title">
          <svg class="title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          预览
        </span>
        <slot name="preview-actions"></slot>
      </div>
      <div class="preview-wrapper">
        <div class="preview-content" v-html="html"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.preview-section {
  display: flex;
  flex-direction: column;
  width: 50%;
  height: 100%;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.preview-section.fullscreen {
  width: 100%;
  position: absolute;
  top: 57px;
  left: 0;
  height: calc(100vh - 57px);
  z-index: 100;
  background: var(--preview-bg);
}

.preview-pane {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: var(--preview-bg);
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

.preview-wrapper {
  flex: 1;
  overflow: hidden;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.preview-content {
  padding: 32px 40px;
  min-height: 100%;
}

/* Responsive */
@media (max-width: 768px) {
  .preview-section {
    width: 100%;
    height: 50%;
  }

  .preview-section.fullscreen {
    height: calc(100vh - 57px);
  }

  .pane-header {
    padding: 10px 16px;
  }

  .preview-content {
    padding: 20px 24px;
  }
}
</style>
