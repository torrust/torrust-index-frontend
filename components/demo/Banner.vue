<template>
  <div v-if="isDemoMode" class="demo-banner">
    {{ warning }}<NuxtLink to="/terms">
      Read our terms.</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { type PublicSettings } from "torrust-index-types-lib";

const settings = useSettings();
const isDemoMode = ref(false);
const warning = ref("");

onMounted(() => {
  isDemoMode.value = false;
});

watch(
  () => settings.value,
  (newSettings) => {
    if (newSettings?.website?.demo?.warning) {
      isDemoMode.value = true;
      warning.value = newSettings?.website?.demo?.warning;
    }
  },
  { immediate: true }
);

</script>

<style scoped>
.demo-banner {
  background-color: #f5b14a;
  color: #000;
  width: 100%;
  padding: 10px;
  text-align: center;
  /*position: fixed;*/
  top: 0;
  left: 0;
  z-index: 1000;
}
</style>
