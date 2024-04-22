<template>
  <div id="torrent-description" class="flex flex-col gap-6">
    <div class="flex flex-row items-center justify-between">
      <h2 class="mr-1 text-2xl font-medium text-left text-neutral-content/50">
        Trackers ({{ torrent.trackers.length }})
      </h2>
      <button
        class="flex flex-col items-center justify-center w-10 h-10 duration-200 bg-transparent text-base-content/50 hover:text-base-content rounded-xl"
        @click="collapsed = !collapsed"
      >
        <ChevronDownIcon class="w-6" :class="{ 'rotate-90': collapsed }" />
      </button>
    </div>
    <template v-if="!collapsed">
      <div class="overflow-x-auto">
        <table class="table w-full table-zebra">
          <!-- head -->
          <thead>
            <tr>
              <th />
              <th>tracker</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(tracker, index) in torrent.trackers">
              <tr>
                <th>{{ index + 1 }}</th>
                <td>{{ tracker }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ChevronDownIcon } from "@heroicons/vue/24/solid";
import type { PropType } from "vue";
import type { TorrentResponse } from "torrust-index-types-lib";
import { ref } from "#imports";

const collapsed = ref(false);

const props = defineProps({
  torrent: {
    type: Object as PropType<TorrentResponse>,
    required: true
  }
});
</script>

<style scoped>

</style>
