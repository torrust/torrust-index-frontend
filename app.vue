<template>
  <div class="flex flex-col" style="min-height: 100vh;">
    <Notifications />

    <NavigationBar />

    <div class="flex flex-col w-full px-4 md:px-8 lg:px-24">
      <div class="flex flex-col my-6" style="max-width: 100vw;">
        <NuxtPage />
      </div>
    </div>
    <div class="flex-grow" />
    <footer class="p-4 footer footer-center text-base-content">
      <div>
        <p><a target="_blank" href="https://torrust.com" class="link link-hover"> Powered by Torrust </a> ⚡ <a target="_self" href="/license" class="link link-hover">Copyright © 2024</a> &nbsp; <a target="_self" href="/terms" class="link link-hover">Terms</a></p>
      </div>
    </footer>
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
