<script setup lang="ts">
interface Props {
  wordCount: number
  charCount: number
}

defineProps<Props>()
</script>

<template>
  <div class="word-count">
    <span class="count-item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
      <strong>{{ wordCount }}</strong> 字
    </span>
    <span class="count-item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="4 7 4 4 20 4 20 7"/>
        <line x1="9" y1="20" x2="15" y2="20"/>
        <line x1="12" y1="4" x2="12" y2="20"/>
      </svg>
      <strong>{{ charCount }}</strong> 字符
    </span>
  </div>
</template>

<style scoped>
.word-count {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: var(--text-muted);
}

.count-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.count-item svg {
  width: 14px;
  height: 14px;
}

.count-item strong {
  font-weight: 600;
  color: var(--text-secondary);
}
</style>
