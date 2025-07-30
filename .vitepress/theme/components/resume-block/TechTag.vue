<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<template>
  <span
    class="text-3 font-mono font-500 rounded-2.5 flex items-center h-6 px-2 b-1 b-solid print:b-0 print:px-0
    text-#595959 dark:text-[rgba(255,255,255,0.6)]
    b-#DDD dark:b-[rgba(221,221,221,0.2)] print:b-neutral-4 shrink-0"
  >
    {{ label }}
  </span>
</template>
