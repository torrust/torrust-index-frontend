<template>
  <div
    class="flex flex-col items-center w-full group/details rounded-2xl"
  >
    <div class="flex justify-center w-full p-4 overflow-y-auto duration-500 border-2 max-h-96 border-base-content/20 hover:border-primary text-base-content/75 rounded-2xl">
      <template v-if="description !== null">
        <Markdown :source="description" />
      </template>
      <template v-else>
        <span class="italic">No description.</span>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  description: {
    type: String,
    required: true
  }
});

</script>

<style scoped>

</style>
