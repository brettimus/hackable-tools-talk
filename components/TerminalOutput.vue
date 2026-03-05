<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <div class="terminal">
    <div class="terminal-header">
      <div class="terminal-dots">
        <span class="dot dot-red"></span>
        <span class="dot dot-yellow"></span>
        <span class="dot dot-green"></span>
      </div>
      <span class="terminal-title">{{ title || 'fp tree' }}</span>
    </div>
    <div class="terminal-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.terminal {
  --terminal-950: #0c0a08;
  --terminal-900: #141210;
  --terminal-800: #1c1a16;
  --terminal-700: #2a2622;
  --terminal-600: #3d3830;
  --terminal-500: #5c5448;
  --terminal-400: #8b8070;
  --terminal-300: #b5a898;
  --terminal-200: #d4c9b8;
  --terminal-100: #e8e0d4;
  --terminal-50: #f5f2ec;

  background: var(--terminal-950);
  border: 1px solid var(--terminal-700);
  border-radius: 8px;
  overflow: hidden;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.9rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
}

.terminal-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--terminal-900);
  border-bottom: 1px solid var(--terminal-700);
}

.terminal-dots {
  display: flex;
  gap: 8px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot-red { background: #ff5f57; }
.dot-yellow { background: #febc2e; }
.dot-green { background: #28c840; }

.terminal-title {
  font-size: 0.75rem;
  color: var(--terminal-500);
  letter-spacing: 0.02em;
}

.terminal-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  line-height: 1.6;
}
</style>
