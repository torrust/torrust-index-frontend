<template>
  <div v-if="isDemoMode" id="banner" class="demo-banner">
    <div id="termsWarning"> {{ warning }}<NuxtLink to="/terms">
      Read our terms.</NuxtLink></div>
    <div id="closeButton"> <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="feather feather-x cursor-pointer"
      @click="closeBanner()"
    ><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg></div>
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

function closeBanner () {
  document.getElementById("banner").style.display = "none";
}

</script>

<style scoped>
.demo-banner {
  background-color: #f5b14a;
  color: #000;
  padding: 10px;
  text-align: center;
  width: 100%;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

#closeButton {
padding-inline: 10px;
}

.feather:hover {
  stroke: rgb(255, 255, 255);
  stroke-opacity: 75%;
}
</style>
