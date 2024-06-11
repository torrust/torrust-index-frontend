<template>
  <div class="flex flex-col gap-6">
    <div class="flex w-full">
      <div class="flex flex-wrap justify-between w-full gap-2">
        <div class="flex flex-wrap gap-2">
          <TorrustSelect
            v-model:selected="categoryFilters"
            :options="categories.map(entry => ({ name: entry.name, value: entry.name }))"
            :label="'Category'"
            :multiple="true"
            search
          />
          <TorrustSelect v-model:selected="tagFilters"
            :options="tags.map(entry => ({ name: entry.name, value: entry.name }))"
            :label="'Tags'"
            :multiple="true"
            search
          />
        </div>
        <div>
          <TorrustSelect v-model:selected="selectedSorting" class="ml-auto" :options="sortingOptions" label="Sort by" />
        </div>
      </div>
    </div>
    <div class="flex">
      <div class="my-2 border tabs tabs-boxed w-fit border-base-content/20">
        <button class="tab" :class="{ 'tab-active': layout === 'default' }" @click="layout = 'default'">
          Default
        </button>
        <button
          data-cy="torrents-table-layout-selector"
          class="tab"
          :class="{ 'tab-active': layout === 'table' }"
          @click="layout = 'table'"
        >
          Table
        </button>
      </div>
    </div>
    <div class="flex flex-col">
      <div class="flex flex-row items-start flex-nowrap">
        <div class="w-full">
          <template v-if="torrents.length > 0">
            <template v-if="layout === 'default'">
              <TorrentList :torrents="torrents" />
            </template>
            <template v-else-if="layout === 'table'">
              <TorrentTable :torrents="torrents" />
            </template>
            <Pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :total-results="torrentsTotal"
            />
          </template>
          <template v-else>
            <span data-cy="no-results-element" class="text-neutral-content flex items-center justify-center">
              <img src="/spinner.gif" class="w-20 h-20" alt="Loading Spinner">
            </span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRuntimeConfig, useRoute, useRouter } from "nuxt/app";
import type { TorrentListing } from "torrust-index-types-lib";
import type { Ref } from "vue";
import { notify } from "notiwind-ts";
import { computed, onMounted, ref, useTags, watch } from "#imports";
import { useCategories, useRestApi } from "~/composables/states";
import type { TorrustSelectOption } from "~/components/TorrustSelect.vue";

// TODO: provide sorting options from backend.
const sortingOptions: Array<TorrustSelectOption> = [
  { name: "Uploaded (Newest first)", value: "UploadedDesc" },
  { name: "Uploaded (Oldest first)", value: "UploadedAsc" },
  { name: "Seeders (High to low)", value: "SeedersDesc" },
  { name: "Leechers (High to low)", value: "LeechersDesc" }
];

const route = useRoute();
const router = useRouter();
const categories = useCategories();
const tags = useTags();
const rest = useRestApi();

const defaultPageSize = 50;
const queryPageSize = parseInt(route.query?.pageSize as string, 10);
const pageSize: Ref<number> = ref(isNaN(queryPageSize) ? defaultPageSize : queryPageSize);
const queryCategoryFilters = route.query?.categoryFilters as string[] || [];
const categoryFilters: Ref<string[]> = ref(Array.isArray(queryCategoryFilters) ? queryCategoryFilters : [queryCategoryFilters]);
const queryTagFilters = route.query?.tagFilters as string[] || [];
const tagFilters: Ref<string[]> = ref(Array.isArray(queryTagFilters) ? queryTagFilters : [queryTagFilters]);
const torrents: Ref<Array<TorrentListing>> = ref([]);
const torrentsTotal = ref(0);
const searchQuery: Ref<string> = ref(null);
const currentPage: Ref<number> = ref(Number(route.query?.page as string) || 1);
const itemsSorting: Ref<string> = ref(route.query?.sorting as string || sortingOptions[0].value);
const layout = ref(route.query?.layout as string || "default");

const selectedSorting = computed({
  get () {
    return [itemsSorting.value];
  },
  set (value) {
    itemsSorting.value = value[0];
    currentPage.value = 1;
  }
});

watch(() => route.fullPath, () => {
  searchQuery.value = route.query.search as string;
});

watch([searchQuery, itemsSorting, pageSize, currentPage, layout, categoryFilters, tagFilters], () => {
  router.push({
    query: {
      search: searchQuery.value,
      sorting: itemsSorting.value,
      pageSize: pageSize.value,
      page: currentPage.value,
      layout: layout.value,
      categoryFilters: categoryFilters.value,
      tagFilters: tagFilters.value
    }
  });

  loadTorrents();
});

onActivated(() => {
  searchQuery.value = route.query.search as string ?? null;
});

onMounted(() => {
  loadTorrents();
});

function loadTorrents () {
  rest.value.torrent.getTorrents(
    {
      pageSize: pageSize.value,
      page: currentPage.value,
      sorting: itemsSorting.value,
      categories: categoryFilters.value,
      tags: tagFilters.value,
      searchQuery: searchQuery.value
    }
  )
    .then((v) => {
      torrentsTotal.value = v.total;
      torrents.value = v.results;
    })
    .catch((err) => {
      notify({
        group: "error",
        title: "Error",
        text: `Trying to get the information for the torrents. ${err.message}.`
      }, 10000);
    });
}
</script>

<style scoped></style>
