<template>
  <div class="flex flex-col w-full overflow-hidden rounded-lg border-base-content/20 rounded-2xl grow">
    <div class="flex flex-col overflow-x-auto whitespace-nowrap">
      <table class="text-center table-auto bg-base-200">
        <thead>
          <tr class="text-sm text-base-content/75">
            <th class="py-2">
              Name
            </th>
            <th>Size</th>
            <th>Date</th>
            <th>Uploader</th>
            <th>Seeders</th>
            <th>Leechers</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(torrent, index) in torrents" :key="index" class="text-sm bg-base-100">
            <td class="pl-6 font-bold text-left">
              <span class="duration-200 cursor-pointer hover:text-amber-500" @click.stop="$router.push(`/torrent/${torrent.info_hash}`)">{{ torrent.title }}</span>
            </td>
            <td class="px-2">
              {{ fileSizeDecimal(torrent.file_size) }}/{{ fileSizeBinary(torrent.file_size) }}
            </td>
            <td>{{ timeSince(new Date(torrent.date_uploaded)) }} ago ({{ new Date(torrent.date_uploaded).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }})</td>
            <td>{{ torrent.uploader }}</td>
            <td class="text-green-500">
              {{ torrent.seeders }}
            </td>
            <td class="text-red-500">
              {{ torrent.leechers }}
            </td>
            <td>
              <div class="flex flex-row items-center justify-center font-semibold flex-nowrap">
                <div class="flex flex-col items-center justify-center w-10 h-10 ml-2 duration-500 cursor-pointer text-base-content/50 hover:text-base-content shrink-0">
                  <a class="flex items-center" @click.stop="$router.push(`/torrent/${torrent.info_hash}`)">
                    <EyeIcon class="w-5" />
                  </a>
                </div>
                <div class="flex flex-col items-center justify-center w-10 h-10 ml-2 duration-500 cursor-pointer text-base-content/50 hover:text-base-content shrink-0" @click.stop="downloadTorrent(torrent.info_hash, torrent.name)">
                  <ArrowDownTrayIcon class="w-5" />
                </div>
                <div class="flex flex-col items-center justify-center w-10 h-10 ml-2 duration-500 cursor-pointer text-base-content/50 hover:text-base-content shrink-0">
                  <a data-cy="torrent-table-magnet-link" class="flex items-center" :href="`magnet:?xt=urn:btih:${torrent.info_hash}`">
                    <LinkIcon class="w-5" />
                  </a>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowDownTrayIcon, LinkIcon, EyeIcon } from "@heroicons/vue/24/outline";
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
  { immediate: true }
);

function toggleOpen (index: number) {
  isOpenList.value[index] = !isOpenList.value[index];
}
</script>
