<script setup lang="ts">
import TechTag from './TechTag.vue'

defineProps<{
  tags?: string[]
}>()
</script>

<template>
  <div v-if="tags">
    <div class="flex print:hidden items-center gap-2 text-#595959 dark:text-[rgba(255,255,255,0.6)]">
      <TechTag
        v-for="tag in tags"
        :key="tag"
        :label="tag"
      />
    </div>
    <div class="hidden print:block text-3 font-mono font-600">
      {{ tags.join(', ') }}
    </div>
  </div>
</template>
