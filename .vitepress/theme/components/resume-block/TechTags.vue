<script setup lang="ts">
import TechTag from './TechTag.vue'

defineProps<{
  tags?: string[]
}>()
</script>

<template>
  <div class="text-#595959 dark:text-[rgba(255,255,255,0.6)]">
    <div v-if="tags" class="flex print:hidden items-center gap-2">
      <TechTag
        v-for="tag in tags"
        :key="tag"
        :label="tag"
      />
    </div>
    <div v-if="tags" class="hidden print:block text-3 font-mono font-500">
      {{ tags.join(' / ') }}
    </div>
  </div>
</template>
