<template>
  <div class="flex flex-col gap-10">
    <div class="">
      <h2 class="text-2xl font-semibold capitalize text-neutral-content">
        admin settings
      </h2>
    </div>
    <div class="flex flex-col w-full gap-10">
      <div class="relative flex flex-row w-full h-auto overflow-x-auto">
        <div v-for="(option) in tabs" class="relative z-10">
          <NuxtLink
            :to="`/admin/settings/${option}`"
            class="inline-block px-6 py-2 font-medium text-center capitalize duration-200 border-b-2 border-transparent text-neutral-content/50 hover:text-neutral-content dark:hover:border-white/10"
          >
            {{ option }}
          </NuxtLink>
        </div>

        <div class="absolute bottom-0 z-0 min-w-full border-b-2 border-base-content/20" />
      </div>

      <template v-if="settings">
        <NuxtPage :settings="settings" class="w-full" />
      </template>
      <template v-else>
        <div class="flex flex-col gap-2">
          Please login to manage admin settings.
        </div>
      </template>

    </div>
  </div>
</template>

<script setup lang="ts">
import { type Ref } from "vue";
import { type Settings } from "torrust-index-types-lib";
import { notify } from "notiwind-ts";
import { onMounted, ref, useRestApi } from "#imports";

const tabs = [
  "backend",
  "categories",
  "tags",
  "users"
];

const rest = useRestApi();
const settings: Ref<Settings> = ref(null);

onMounted(() => {
  getAdminSettings();
});

function getAdminSettings () {
  rest.value.settings.getSettings()
    .then((v) => {
      settings.value = v;
    })
    .catch((err) => {
      notify({
        group: "error",
        title: "Error",
        text: `Trying to get the backend settings. ${err.message}.`
      }, 10000);
    });
}

</script>

<style scoped>
.router-link-exact-active {
  @apply text-neutral-content border-primary;
}
</style>
