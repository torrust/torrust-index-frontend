<template>
  <div>
    <Markdown :source="pageContent" class="px-40 pt-2 pb-5 prose-h1:text-center max-w-none" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useSettings, useSeoMeta } from "#imports";

const settings = useSettings();

const pageTitle = ref("");
const pageContent = ref("");

watch(
  () => settings.value,
  (newSettings) => {
    if (newSettings?.website?.terms?.page) {
      pageTitle.value = newSettings.website.terms.page.title;
      pageContent.value = newSettings.website.terms.page.content;
    }
  },
  { immediate: true }
);

useSeoMeta({
  title: () => `${pageTitle.value} - Torrent`
});
</script>

<style scoped>

</style>
