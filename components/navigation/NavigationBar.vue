<template>
  <div class="flex flex-col px-4 md:pb-0 md:px-8 lg:px-24 bg-base-200">
    <div class="gap-2 p-0 navbar">
      <button class="flex md:hidden btn btn-square btn-ghost" @click="mobileCollapsed = !mobileCollapsed">
        <Bars3Icon class="w-8" />
      </button>
      <NuxtLink to="/" class="flex flex-row text-xl normal-case btn btn-ghost">
        <span>{{ settings?.website_name || "Torrust" }}</span>
      </NuxtLink>
      <div class="hidden form-control md:flex">
        <input
          v-model="searchQuery"
          name="search"
          type="text"
          class="border-2 input input-bordered rounded-2xl placeholder-neutral-content"
          :placeholder="`Search torrents`"
          @keyup.enter="submitSearch"
          @focusin="typingInSearch = true"
          @focusout="typingInSearch = false"
        >
      </div>
      <div class="flex-none gap-2 ml-auto">
        <template v-if="user">
          <NuxtLink id="upload-button" to="/upload" class="hidden md:flex btn bg-base-100 rounded-2xl">
            Upload Torrent
          </NuxtLink>
          <div data-cy="user-menu" class="dropdown dropdown-end z-[1]">
            <div tabindex="0" class="btn btn-ghost btn-circle avatar">
              <div class="w-10 rounded-full">
                <UserCircleIcon />
              </div>
            </div>
            <ul tabindex="0" class="p-2 mt-3 shadow menu dropdown-content bg-base-100 rounded-box w-52">
              <li v-if="user.admin" data-cy="admin-settings-link"><NuxtLink to="/admin/settings/backend">
                Admin Settings
              </NuxtLink></li>
              <li data-cy="change-password-link"><NuxtLink :to="{ name: 'user-username', params: { username: user.username } }">
                Change password
              </NuxtLink></li>
              <li><a data-cy="help" href="https://torrust.github.io/torrust-index-gui-user-guide/" target="_blank">Help</a></li>
              <li><a data-cy="logout-link" @click="logoutUser()">Logout {{ user.username }}</a></li>
            </ul>
          </div>
        </template>
        <template v-else>
          <NuxtLink to="/signin">
            Sign In
          </NuxtLink>
          <NuxtLink to="/signup">
            Sign Up
          </NuxtLink>
        </template>
        <ThemeToggle />
      </div>
    </div>
    <template v-if="!mobileCollapsed">
      <div class="items-center justify-between w-full py-4 md:hidden">
        <div class="flex flex-row gap-2">
          <div class="w-full form-control">
            <input
              v-model="searchQuery"
              name="search"
              type="text"
              class="border-2 input input-bordered"
              :placeholder="`Search ${settings?.website_name ?? 'Torrust'}`"
              @keyup.enter="submitSearch"
              @focusin="typingInSearch = true"
              @focusout="typingInSearch = false"
            >
          </div>
          <button class="btn btn-square btn-ghost" @click="submitSearch">
            <MagnifyingGlassIcon class="w-6" />
          </button>
        </div>
        <ul id="mobile-menu" class="flex flex-col gap-2 p-4 mt-4 font-medium rounded-lg bg-base-content/10">
          <li>
            <NuxtLink to="/" class="block py-2 pl-3 pr-4 text-white rounded-lg">
              Home
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/torrents" class="block py-2 pl-3 pr-4 text-white rounded-lg">
              Torrents
            </NuxtLink>
          </li>
        </ul>
        <template v-if="user">
          <NuxtLink to="/upload" class="w-full mt-4 btn btn-secondary">
            Upload Torrent
          </NuxtLink>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { UserCircleIcon, Bars3Icon, MagnifyingGlassIcon } from "@heroicons/vue/24/solid";
import { type Ref } from "vue";
import { type PublicSettings } from "torrust-index-types-lib";
import { ref, useSettings, useUser, logoutUser } from "#imports";

const settings: PublicSettings = useSettings().value;
const user = useUser();

const mobileCollapsed = ref(true);
const searchQuery: Ref<string> = ref("");
const typingInSearch = ref(false);

function submitSearch () {
  navigateTo({
    path: "/torrents",
    query: {
      search: searchQuery.value ?? null
    }
  });
}

</script>

<style scoped>
#mobile-menu a.router-link-exact-active {
  @apply bg-primary;
}

[data-theme="light"] #upload-button {
  background-color: #ffffff;
}
</style>
