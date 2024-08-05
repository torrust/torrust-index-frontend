<template>
  <div class="flex flex-col w-full border-base-content/20 rounded-2xl grow">
    <div class="flex flex-col gap-3">
      <a
        v-for="(torrent, index) in torrents"
        :key="index"
        class="flex flex-col text-sm cursor-pointer rounded-2xl bg-base-100"
        @click="toggleOpen(index)"
      >
        <div class="flex flex-row items-center justify-start w-full px-4 pt-4 pb-4 group flex-nowrap rounded-2xl">
          <div class="flex flex-col items-center justify-start overflow-hidden font-semibold flex-nowrap grow">
            <div class="flex flex-row items-center w-full gap-1">
              <span class="overflow-hidden whitespace-nowrap text-ellipsis text-neutral-content">{{ torrent.title }}</span>
              <template v-if="isOpenList[index]">
                <ChevronDownIcon class="w-5 group-hover:animate-bounce text-base-content/50 group-hover:text-base-content" />
              </template>
              <template v-else>
                <ChevronRightIcon class="w-5 group-hover:animate-bounce text-base-content/50 group-hover:text-base-content" />
              </template>
            </div>
            <div class="flex flex-row items-start justify-start w-full mt-1 flex-nowrap">
              <span class="text-xs whitespace-nowrap text-neutral-content/50">{{ fileSizeDecimal(torrent.file_size) }}/{{ fileSizeBinary(torrent.file_size) }}</span>
              <span class="ml-2 text-xs whitespace-nowrap text-neutral-content/50">{{ new Date(torrent.date_uploaded).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }} ({{ timeSince(new Date(torrent.date_uploaded)) }} ago)</span>
              <a class="ml-2 text-xs whitespace-nowrap text-neutral-content/50">u/{{ torrent.uploader }}</a>
            </div>
          </div>
          <div class="flex flex-col items-center justify-center flex-nowrap">
            <div class="flex flex-row font-semibold text-center flex-nowrap rounded-2xl">
              <div class="flex flex-col justify-center w-10 h-10 text-green-500 shrink-0 rounded-2xl">{{ torrent.seeders }}</div>
              <div class="flex flex-col justify-center w-10 h-10 ml-2 text-red-500 shrink-0 rounded-2xl">{{ torrent.leechers }}</div>
              <div class="flex flex-col items-center justify-center w-10 h-10 ml-2 duration-500 cursor-pointer text-base-content/50 hover:text-base-content shrink-0 rounded-2xl" @click.stop="downloadTorrent(torrent.info_hash, torrent.name)">
                <ArrowDownTrayIcon class="w-6" />
              </div>
              <div class="flex flex-col items-center justify-center w-10 h-10 ml-2 duration-500 cursor-pointer text-base-content/50 hover:text-base-content shrink-0 rounded-2xl">
                <a data-cy="torrent-list-magnet-link" class="flex items-center" :href="`magnet:?xt=urn:btih:${torrent.info_hash}`" @click.stop>
                  <LinkIcon class="w-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <template v-if="isOpenList[index]">
          <div class="flex flex-row items-start justify-start w-full px-4 pt-2 pb-4 duration-1000 flex-nowrap">
            <TorrentListTorrentDetails
              :info-hash="torrent.info_hash"
              :title="torrent.title"
              :description="torrent.description"
            />
          </div>
        </template>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowDownTrayIcon, LinkIcon } from "@heroicons/vue/24/outline";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/vue/20/solid";
import { type PropType, watch } from "vue";
import type { TorrentListing } from "torrust-index-types-lib";
import { fileSizeDecimal, fileSizeBinary, timeSince, ref, downloadTorrent } from "#imports";

const props = defineProps({
  torrents: Array as PropType<Array<TorrentListing>>
});

const isOpenList = ref([]);

watch(
  () => props.torrents,
  (torrents) => {
    isOpenList.value = new Array(torrents.length).fill(false);
  },
  { immediate: true } // Run the watcher immediately on component creation
);

function toggleOpen (index: number) {
  isOpenList.value[index] = !isOpenList.value[index];
}
</script>
