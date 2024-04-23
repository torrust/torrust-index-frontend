<template>
  <div id="torrent-creation-date" class="flex flex-col gap-6">
    <div class="flex flex-row items-center justify-between">
      <h2 class="mr-1 text-2xl font-medium text-left text-neutral-content/50">
        Creation Date
      </h2>
      <button
        class="flex flex-col items-center justify-center w-10 h-10 duration-200 bg-transparent text-base-content/50 hover:text-base-content rounded-xl"
        @click="collapsed = !collapsed"
      >
        <ChevronDownIcon class="w-6" :class="{ 'rotate-90': collapsed }" />
      </button>
    </div>
    <template v-if="!collapsed">
      <div class="flex flex-col w-full h-full p-6 grow bg-base-100 rounded-2xl">
        <template v-if="torrent.creation_date">
          {{ formattedDateFromTimestamp }}
        </template>
        <template v-else>
          <span class="italic text-neutral-content">No creation date provided.</span>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ChevronDownIcon } from "@heroicons/vue/24/solid";
import type { TorrentResponse } from "torrust-index-types-lib";
import type { PropType } from "vue";
import { ref } from "#imports";
import { formatTimestamp } from "~/src/helpers/DateConverter";

const collapsed = ref(false);

const props = defineProps({
  torrent: {
    type: Object as PropType<TorrentResponse>,
    required: true
  }
});

const formattedDateFromTimestamp = formatTimestamp(props.torrent.creation_date);

</script>

<style scoped>

</style>
