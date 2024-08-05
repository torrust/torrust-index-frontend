<template>
  <div id="torrent-files" class="flex flex-col gap-6">
    <div class="flex flex-row items-center justify-between">
      <h2 class="mr-1 text-2xl font-medium text-left text-neutral-content/50">
        Files ({{ files().length }})
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
              <th>file</th>
              <th>size</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(file, index) in files()">
              <tr>
                <th>{{ index + 1 }}</th>
                <td>{{ file.name }}</td>
                <td>{{ fileSizeDecimal(file.size) }}/{{ fileSizeBinary(file.size) }}</td>
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
import { ref, fileSizeDecimal, fileSizeBinary } from "#imports";

const collapsed = ref(false);

const props = defineProps({
  torrent: {
    type: Object as PropType<TorrentResponse>,
    required: true
  }
});

function files () {
  const files = [];

  if (props.torrent.files) {
    for (const file of props.torrent.files) {
      let filename = "";
      for (const [i, path] of file.path.entries()) {
        filename += path;
        if (i !== file.path.length - 1) {
          filename += "/";
        }
      }
      files.push({
        name: filename,
        size: file.length
      });
    }
  }

  return files;
}
</script>

<style scoped>

</style>
