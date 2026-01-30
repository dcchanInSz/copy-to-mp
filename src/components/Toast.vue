<script setup lang="ts">
interface Props {
  show: boolean
  message: string
  type: 'success' | 'error' | 'warning'
}

defineProps<Props>()
</script>

<template>
  <Transition name="toast">
    <div v-if="show" class="toast-wrapper">
      <div class="toast" :class="type">
        <div class="toast-icon">
          <svg v-if="type === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <svg v-else-if="type === 'error'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <span class="toast-message">{{ message }}</span>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.toast-wrapper {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--border-color);
}

.toast.success {
  border-left: 4px solid var(--success-color);
}

.toast.error {
  border-left: 4px solid var(--error-color);
}

.toast.warning {
  border-left: 4px solid var(--warning-color);
}

.toast-icon {
  flex-shrink: 0;
}

.toast-icon svg {
  width: 20px;
  height: 20px;
}

.toast.success .toast-icon {
  color: var(--success-color);
}

.toast.error .toast-icon {
  color: var(--error-color);
}

.toast.warning .toast-icon {
  color: var(--warning-color);
}

.toast-message {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from {
  transform: translateX(100px);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100px);
  opacity: 0;
}

@media (max-width: 768px) {
  .toast-wrapper {
    bottom: 16px;
    right: 16px;
    left: 16px;
  }

  .toast {
    padding: 12px 16px;
  }
}
</style>
