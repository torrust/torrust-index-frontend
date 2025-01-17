<template>
  <div class="flex flex-col max-w-md gap-2 mx-auto">
    <div class="flex flex-col gap-2">
      <!--     <template v-for="userProfile in userProfiles">
        <div class="flex justify-between p-2 rounded bg-base-100">
          <span class="text-base-content">{{ userProfile.username }} ({{ userProfile.email }})</span>
        </div>
      </template> -->
      <UserTable :user-profiles="userProfiles" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { getUserProfiles, useUserProfiles } from "#imports";

const userProfiles = useUserProfiles();

onBeforeMount(() => {
  getUserProfiles();
});
</script>
