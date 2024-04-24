<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="prose max-w-none text-justify word-wrap" v-html="sanitizedDescription" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { marked } from "marked";
import { sanitize } from "~/src/domain/services/sanitizer";
import { onMounted, ref, useRestApi, watch } from "#imports";

const props = defineProps({
  source: {
    type: String,
    required: true
  }
});

const sanitizedDescription = ref("");

const options = {
  headerIds: false,
  mangle: false
};

const source = computed(() => props.source);

watch(source, () => {
  sanitizeDescription();
});

onMounted(() => {
  sanitizeDescription();
});

function convert_markdown_to_html (src: string) {
  return marked(src, options);
}

async function sanitizeDescription () {
  const html = convert_markdown_to_html(props.source);
  sanitizedDescription.value = await sanitize(html);
}
</script>

<style scoped>
.word-wrap {
  -ms-word-break: break-all;
  word-break: break-all;

  /* Non standard for webkit */
  word-break: break-word;

  -webkit-hyphens: auto;
  -moz-hyphens: auto;
  -ms-hyphens: auto;
  hyphens: auto;
}
</style>
