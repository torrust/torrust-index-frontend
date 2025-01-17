<template>
  <div class="flex flex-col w-full overflow-hidden rounded-lg border-base-content/20 rounded-2xl grow">
    <div class="flex flex-col overflow-x-auto whitespace-nowrap">
      <table class="text-center table-auto bg-base-200 ">
        <thead>
          <tr class="text-sm text-base-content/75">
            <th class="py-2 pl-6">
              Username
            </th>
            <th class="py-2 pl-6">
              Email
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="userProfile in userProfiles" class="text-sm bg-base-100">
            <td class="py-2 pl-6 ">
              {{ userProfile.username }}
            </td>
            <td class="py-2 pl-6 ">
              {{ userProfile.email }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<!-- <template>
  <div class="flex flex-col max-w-md gap-2 mx-auto">
    <div class="flex flex-col gap-2">
      <template v-for="userProfile in userProfiles">
        <div class="flex justify-between p-2 rounded bg-base-100">
          <span class="text-base-content">{{ userProfile.username }} ({{ userProfile.email }})</span>
        </div>
      </template>
    </div>
  </div>
</template> -->

<script setup lang="ts">
import type { TorrentListing, UserProfile } from "torrust-index-types-lib";

/* import { ArrowDownTrayIcon, LinkIcon, EyeIcon } from "@heroicons/vue/24/outline";
import { type PropType, watch } from "vue";
import type { TorrentListing } from "torrust-index-types-lib";
import { fileSizeDecimal, fileSizeBinary, timeSince, ref, downloadTorrent } from "#imports";

const isOpenList = ref([]);

watch(
  () => props.torrents,
  (torrents) => {
    isOpenList.value = new Array(torrents.length).fill(false);
  },
  { immediate: true }
);

function toggleOpen (index: number) {
  isOpenList.value[index] = !isOpenList.value[index];
} */

const props = defineProps({
  userProfiles: Array as PropType<Array<UserProfile>>
});
</script>
