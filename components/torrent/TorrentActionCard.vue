<template>
  <div class="flex flex-col w-full basis-full">
    <template v-if="torrent">
      <div class="flex flex-col gap-3 md:px-6">

        <span class="text-lg font-bold capitalize truncate">{{ torrent.title }}</span>

        <template v-if="torrent.tags?.length">
          <div class="flex flex-wrap space-x-2">
            <template v-for="tag in torrent.tags">
              <NuxtLink :to="`/torrents?tagFilters=${tag.name}`" class="px-2 py-1 text-xs font-semibold capitalize rounded-lg cursor-pointer bg-base-content/25 hover:bg-base-content/50">
                {{ tag.name }}
              </NuxtLink>
            </template>
          </div>
        </template>

        <div />

        <div class="flex flex-col gap-3 p-6 stats bg-base-100 rounded-2xl">
          <div class="flex flex-col items-center justify-between w-full">
            <div class="w-full h-2 overflow-hidden bg-transparent rounded-full">
              <template v-if="seedersPercentage() === 0 && leechersPercentage() === 0">
                <div class="float-left h-full bg-green-500" :style="{ width: '50%' }" />
                <div class="float-right h-full bg-red-500" :style="{ width: '50%' }" />
              </template>
              <template v-else>
                <div class="float-left h-full bg-green-500" :style="{ width: seedersPercentage() }" />
                <div class="float-right h-full bg-red-500" :style="{ width: leechersPercentage() }" />
              </template>
            </div>
            <div class="flex flex-row justify-between w-full px-6 mt-2">
              <div class="flex flex-col items-center mr-4">
                <span class="text-2xl font-bold text-green-500 stat-value">{{ torrent.seeders }}</span>
                <span class="text-sm capitalize stat-title">seeders</span>
              </div>
              <div class="flex flex-col items-center">
                <span class="text-2xl font-bold text-red-500 stat-value">{{ torrent.leechers }}</span>
                <span class="text-sm capitalize stat-title">leechers</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col p-6 stats bg-base-100 rounded-2xl">
          <div class="flex flex-col text-sm text-base-content/60">
            <div class="flex flex-row">
              <div class="flex flex-row w-1/2 py-2">
                <HashtagIcon class="w-4 mr-2" />
                <span>Canonical Info Hash</span>
              </div>
              <div class="flex flex-row w-1/2 py-1">
                <div class="relative flex items-center max-w-full overflow-x-auto border rounded-lg border-base-content/10">
                  <span data-cy="torrent-action-info-hash" class="px-2">{{ torrent.info_hash }}</span>
                </div>
              </div>
            </div>
            <div v-if="torrent.category !== null" class="flex flex-row py-2 pt-0">
              <div class="flex flex-row w-1/2">
                <TagIcon class="w-4 mr-2" />
                <span>Category</span>
              </div>
              <div class="flex flex-row w-1/2">
                <NuxtLink :to="`/torrents?categoryFilters=${torrent.category.name}`" class="capitalize link-primary">
                  {{ torrent.category.name }}
                </NuxtLink>
              </div>
            </div>
            <div class="flex flex-row py-2">
              <div class="flex flex-row w-1/2">
                <CalendarIcon class="w-4 mr-2" />
                <span>Upload Date</span>
              </div>
              <div class="flex flex-row w-1/2">
                <span>{{ new Date(torrent.upload_date).toLocaleDateString() }}</span>
              </div>
            </div>
            <div class="flex flex-row py-2">
              <div class="flex flex-row w-1/2">
                <CircleStackIcon class="w-4 mr-2" />
                <span>File Size</span>
              </div>
              <div class="flex flex-row w-1/2">
                <span>{{ fileSizeDecimal(torrent.file_size) }}</span>/
                <span>{{ fileSizeBinary(torrent.file_size) }}</span>
              </div>
            </div>
            <div class="flex flex-row py-2 pb-0">
              <div class="flex flex-row w-1/2">
                <UserCircleIcon class="w-4 mr-2" />
                <span>Uploader</span>
              </div>
              <div class="flex flex-row w-1/2">
                <span>{{ torrent.uploader }}</span>
              </div>
            </div>
          </div>
        </div>

        <div />

        <div class="flex flex-row gap-3">
          <template v-if="showDownloadButtons()">
            <button class="btn btn-primary grow" data-cy="torrent-action-download" @click="downloadTorrent(torrent.info_hash, torrent.name)">
              download {{ isTrackerPrivate()? 'private' : '' }} torrent
            </button>
            <button class="w-12 p-0 btn btn-primary">
              <a data-cy="torrent-action-magnet-link" class="flex items-center" :href="torrent.magnet_link">
                <LinkIcon class="w-6" />
              </a>
            </button>
          </template>
          <template v-else>
            <NuxtLink to="/signin">
              Private tracker. Sign in to download torrent or magnet link.
            </NuxtLink>
          </template>
        </div>

        <div />

        <template v-if="hasEditRights()">
          <button
            class="btn btn-secondary"
            @click="editTorrent"
          >
            edit torrent
          </button>
          <button
            class="btn btn-error"
            @click="deleteTorrent"
          >
            delete torrent
          </button>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { LinkIcon, CalendarIcon, CircleStackIcon, UserCircleIcon, HashtagIcon, TagIcon } from "@heroicons/vue/24/solid";
import type { PropType } from "vue";
import type { TorrentResponse } from "torrust-index-types-lib";
import { notify } from "notiwind-ts";
import {
  fileSizeDecimal,
  fileSizeBinary,
  downloadTorrent,
  useRestApi,
  isUserLoggedIn,
  isTrackerPublic, navigateTo
} from "#imports";
import { canEditThisTorrent } from "~/composables/helpers";

const rest = useRestApi();

const emit = defineEmits([
  "updated",
  "deleted"
]);

const props = defineProps({
  torrent: {
    type: Object as PropType<TorrentResponse>,
    required: true
  }
});

function hasEditRights (): boolean {
  return canEditThisTorrent(props.torrent);
}

function showDownloadButtons (): boolean {
  return isUserLoggedIn() || isTrackerPublic();
}

function seedersPercentage () {
  const total = props.torrent.seeders + props.torrent.leechers;
  return props.torrent.seeders > 0 ? `${(props.torrent.seeders / total) * 100}%` : 0;
}

function leechersPercentage () {
  const total = props.torrent.seeders + props.torrent.leechers;
  return props.torrent.leechers > 0 ? `${(props.torrent.leechers / total) * 100}%` : 0;
}

function editTorrent () {
  navigateTo(`/torrent/edit/${props.torrent.info_hash}`, { replace: true });
}

function deleteTorrent () {
  rest.value.torrent.deleteTorrent(props.torrent.info_hash)
    .then(() => {
      emit("deleted");
    })
    .catch((err) => {
      notify({
        group: "error",
        title: "Error",
        text: `Trying to delete the torrent. ${err.message}.`
      }, 10000);
    });
}

function navigateToSignIn () {
  navigateTo("/signin", { replace: true });
}
</script>
