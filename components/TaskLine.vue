<script setup lang="ts">
defineProps<{
  id: string
  status: 'in-progress' | 'todo' | 'done'
}>()

// Split the ID into parts for styling
// Format: PREFIX-uniqueXXXXXX (e.g., CCTA-vojsagkz)
function splitId(id: string) {
  const dashIndex = id.indexOf('-')
  if (dashIndex === -1) {
    return { prefix: '', unique: id.slice(0, 3), rest: id.slice(3) }
  }
  const prefix = id.slice(0, dashIndex + 1) // e.g., "CCTA-"
  const hash = id.slice(dashIndex + 1) // e.g., "vojsagkz"
  return {
    prefix,
    unique: hash.slice(0, 4), // first 4 chars emphasized
    rest: hash.slice(4) // rest muted
  }
}
</script>

<template>
  <div class="task-line">
    <span class="task-id">
      <span class="id-prefix">{{ splitId(id).prefix }}</span>
      <span class="id-unique">{{ splitId(id).unique }}</span>
      <span class="id-rest">{{ splitId(id).rest }}</span>
    </span>
    <span class="task-status" :class="`status-${status}`">
      [{{ status }}]
    </span>
    <span class="task-description">
      <slot />
    </span>
  </div>
</template>

<style scoped>
.task-line {
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
  --accent: #FE7100;

  display: flex;
  align-items: baseline;
  gap: 12px;
  font-family: 'JetBrains Mono', monospace;
}

.task-id {
  font-family: 'JetBrains Mono', monospace;
  white-space: nowrap;
}

.id-prefix {
  color: var(--terminal-500);
  font-weight: 400;
}

.id-unique {
  color: var(--terminal-50);
  font-weight: 600;
}

.id-rest {
  color: var(--terminal-500);
  font-weight: 400;
}

.task-status {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}

.status-in-progress {
  background: rgba(254, 113, 0, 0.2);
  color: #FE7100;
  border: 1px solid rgba(254, 113, 0, 0.4);
}

.status-todo {
  background: var(--terminal-800);
  color: var(--terminal-400);
  border: 1px solid var(--terminal-700);
}

.status-done {
  background: rgba(40, 200, 64, 0.15);
  color: #28c840;
  border: 1px solid rgba(40, 200, 64, 0.3);
}

.task-description {
  color: var(--terminal-200);
  font-weight: 400;
}
</style>
