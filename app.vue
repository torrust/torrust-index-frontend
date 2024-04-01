<template>
  <div>
    <Notifications />

    <NavigationBar />

    <div class="flex flex-col w-full px-4 bg-base-300 md:px-8 lg:px-24">
      <div class="flex flex-col my-6" style="max-width: 100vw;">
        <NuxtPage />
      </div>

      <footer class="p-4 footer footer-center bg-base-300 text-base-content">
        <div>
          <p><a target="_blank" href="https://torrust.com" class="link link-hover"> Powered by Torrust </a> ⚡ <a target="_self" href="/license" class="link link-hover">Copyright © 2024</a></p>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCategories, getSettings, getTags, getUser, onBeforeMount, onMounted } from "#imports";
import Notifications from "~/components/Notifications.vue";

onBeforeMount(() => {
  getUser();
  getSettings();
  getTags();
  getCategories();
});

onMounted(() => {
  document.querySelector("html").classList.add("bg-base-300");
});
</script>
