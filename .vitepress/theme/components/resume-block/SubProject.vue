<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="text-3.5 my-4 p-6 rounded-2 bg-[linear-gradient(rgba(152,236,215,0.2)_0%,rgb(229,239,122,0.2)_100%)] b-solid b-1px b-[rgba(221,221,221,0.2)]">
    <div class="text-4 font-bold mb-2">
      {{ title }}
    </div>
    <slot />
  </div>
</template>
