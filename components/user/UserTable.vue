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

<script setup lang="ts">
import type { TorrentListing, UserProfile } from "torrust-index-types-lib";

const props = defineProps({
  userProfiles: Array as PropType<Array<UserProfile>>
});
</script>
