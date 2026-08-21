<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  text: string
}>()

const HASHTAG_RE = /#([\p{L}0-9_]+)/gu

interface TextPart {
  type: 'text' | 'hashtag'
  value: string
}

const parts = computed<TextPart[]>(() => {
  const result: TextPart[] = []
  let lastIndex = 0
  for (const match of props.text.matchAll(HASHTAG_RE)) {
    if (match.index! > lastIndex) {
      result.push({ type: 'text', value: props.text.slice(lastIndex, match.index) })
    }
    result.push({ type: 'hashtag', value: match[1] })
    lastIndex = match.index! + match[0].length
  }
  if (lastIndex < props.text.length) {
    result.push({ type: 'text', value: props.text.slice(lastIndex) })
  }
  return result
})
</script>

<template>
  <span class="hashtag-text">
    <template v-for="(part, i) in parts" :key="i">
      <RouterLink v-if="part.type === 'hashtag'" :to="{ path: '/', query: { hashtag: part.value } }" class="hashtag-inline"
        >#{{ part.value }}</RouterLink
      >
      <template v-else>{{ part.value }}</template>
    </template>
  </span>
</template>

<style scoped>
.hashtag-text {
  white-space: pre-wrap;
  word-break: break-word;
}

.hashtag-inline {
  color: var(--accent);
  font-weight: 600;
  text-decoration: none;
}

.hashtag-inline:hover {
  text-decoration: underline;
}
</style>
