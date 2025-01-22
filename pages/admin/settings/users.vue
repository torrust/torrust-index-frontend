<template>
  <div class="flex flex-col max-w-md gap-2 mx-auto">
    <div class="flex flex-col gap-2">
      <UserTable :user-profiles="userProfiles" />
      <Pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total-results="userProfilesTotal" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import { notify } from "notiwind-ts";
import type { UserProfile } from "torrust-index-types-lib";
import { onMounted, ref, watch } from "#imports";
import { useRestApi } from "~/composables/states";

const route = useRoute();
const router = useRouter();
const rest = useRestApi();

const defaultPageSize = 50;
const queryPageSize = isNaN(route.query?.pageSize) ? defaultPageSize : parseInt(route.query?.pageSize as string, 10);
const pageSize: Ref<number> = ref(isNaN(queryPageSize) ? defaultPageSize : queryPageSize);
const userProfiles: Ref<Array<UserProfile>> = ref([]);
const userProfilesTotal = ref(0);
const currentPage: Ref<number> = ref(Number(route.query?.page as string) || 1);

watch(() => route.fullPath, () => {
  currentPage.value = isNaN(route.query.page) ? 1 : parseInt(route.query.page);
  pageSize.value = isNaN(route.query.pageSize) ? defaultPageSize : parseInt(route.query.pageSize);
});

watch(currentPage, () => {
  router.push({
    query: {
      pageSize: pageSize.value,
      page: currentPage.value
    }
  });

  loadUserProfiles();
});

// Resets the current page value to 1 when the page size is changed to display results correctly
watch(pageSize, () => {
  router.push({
    query: {
      pageSize: pageSize.value,
      page: 1
    }
  });

  loadUserProfiles();
});

onActivated(() => {
  pageSize.value = route.query.pageSize as number ?? defaultPageSize;
  currentPage.value = route.query.page as number ?? 1;
});

onMounted(() => {
  loadUserProfiles();
});

function loadUserProfiles () {
  rest.value.user.getUserProfiles(
    {
      pageSize: pageSize.value,
      page: currentPage.value
    }
  )
    .then((v) => {
      userProfilesTotal.value = v.total;
      userProfiles.value = v.results;
    })
    .catch((err) => {
      notify({
        group: "error",
        title: "Error",
        text: `Trying to get the information for the user profiles. ${err.message}.`
      }, 10000);
    });
}
</script>
