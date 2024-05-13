<template>
  <div
    class="flex flex-col items-center w-full group/details rounded-2xl"
    @click.stop="$router.push(`/torrent/${props.infoHash}/${slug}`)"
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
import { generateSlug } from "~/src/domain/services/slug";

const props = defineProps({
  infoHash: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const slug = computed(() => generateSlug(props.title));

</script>

<style scoped>

</style>
