<template>
  <div class="flex flex-col items-center w-full">
    <h2 class="text-2xl font-semibold text-neutral-content">
      Upload Torrent
    </h2>
    <div class="flex flex-col w-full max-w-xl gap-6">
      <div>
        <label for="title" class="px-2">Title</label>
        <input
          id="title"
          v-model="form.title"
          name="title"
          type="text"
          data-cy="upload-form-title"
          class="mt-1"
        >
      </div>
      <div>
        <label for="description" class="px-2">Description</label>
        <div class="my-2 border tabs tabs-boxed w-fit border-base-content/20">
          <button class="tab" :class="{ 'tab-active': descriptionView === 'edit' }" @click="descriptionView = 'edit'">
            Edit
          </button>
          <button class="tab" :class="{ 'tab-active': descriptionView === 'preview' }" @click="descriptionView = 'preview'">
            Preview
          </button>
        </div>
        <template v-if="descriptionView === 'edit'">
          <textarea
            id="description"
            v-model="form.description"
            name="description"
            data-cy="upload-form-description"
            rows="8"
            class="mt-1"
          />
        </template>
        <template v-else>
          <div class="mt-1 p-6 h-[16rem] border-2 border-base-content/20 rounded-2xl overflow-y-auto">
            <Markdown :source="form.description" />
          </div>
        </template>
      </div>

      <template v-if="categories?.length > 0">
        <div>
          <label for="category" class="px-2">Category</label>
          <select id="category" v-model="form.category" data-cy="upload-form-category" class="mt-1">
            <template v-for="option in categories">
              <option :value="option.name">
                {{ option.name }}
              </option>
            </template>
          </select>
        </div>
      </template>

      <template v-if="tags?.length > 0">
        <div>
          <label for="tags" class="px-2">Tags</label>
          <TorrustSelect
            v-model:selected="form.tags"
            :options="tags.map(entry => ({ name: entry.name, value: entry.tag_id }))"
            :multiple="true"
            search
          />
        </div>
      </template>
      <div>
        <UploadFile sub-title="Only .torrent files allowed. BitTorrent v2 files are NOT supported." accept=".torrent" @on-change="setFile" />
      </div>

      <!-- Checkbox for Terms and Conditions Agreement -->
      <div>
        <label for="agree-to-terms" class="px-2">Agreement</label>
        <div class="mt-1">
          <input v-model="agreeToTerms" name="agree-to-terms" type="checkbox" class="max-w-5" data-cy="upload-form-agree-terms">
          <span class="px-2">I have read the <NuxtLink to="/terms" target="_blank">{{ contentUploadAgreement }}</NuxtLink>.</span>
        </div>
      </div>

      <template v-if="user?.username">
        <TorrustButton
          label="submit"
          data-cy="upload-form-submit"
          :disabled="!formValid() || !agreeToTerms || uploading"
          @click="submitForm"
        />
      </template>

      <template v-else>
        <div class="relative flex justify-center text-sm">
          <NuxtLink to="/signin">
            Please sign in to upload
          </NuxtLink>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
/* __placeholder__ */
import type { Ref } from "vue";
import { notify } from "notiwind-ts";
import type { TorrentTag } from "torrust-index-types-lib";
import {
  getCategories,
  getTags,
  navigateTo,
  onMounted,
  ref, toRaw,
  useRestApi,
  useTags,
  useUser
} from "#imports";
import { useCategories, useSettings } from "~/composables/states";

type FormUploadTorrent = {
  title: string;
  category: string;
  description: string;
  tags: Array<number>;
  torrentFile: any;
}

const settings = useSettings();
const categories = useCategories();
const tags = useTags();
const user = useUser();
const rest = useRestApi();

const agreeToTerms: Ref<boolean> = ref(false);
const uploading: Ref<boolean> = ref(false);
const descriptionView = ref("edit");
const form: Ref<FormUploadTorrent> = ref({
  title: "",
  description: "",
  category: "",
  tags: [],
  torrentFile: ""
});
const contentUploadAgreement = ref("");

onMounted(() => {
  getCategories();
  getTags();
});

watch(
  () => settings.value,
  (newSettings) => {
    if (newSettings?.website?.terms?.upload?.content_upload_agreement) {
      contentUploadAgreement.value = newSettings.website.terms.page.title;
    }
  },
  { immediate: true }
);

function formValid () {
  return form.value.title && form.value.category && form.value.torrentFile;
}

function setTags (e: any) {
  form.value.tags = toRaw(e).map((tag: TorrentTag) => {
    return tag.tag_id;
  });
}

function setFile (file: any) {
  [form.value.torrentFile] = file;
}

function submitForm () {
  uploading.value = true;

  rest.value.torrent.uploadTorrent(
    {
      title: form.value.title,
      description: form.value.description,
      category: form.value.category,
      tags: form.value.tags,
      file: form.value.torrentFile
    }
  )
    .then((new_torrent) => {
      uploading.value = false;

      let text = "Torrent uploaded!";

      if (new_torrent.canonical_info_hash !== new_torrent.info_hash) {
        text += ` Original infohash ${new_torrent.info_hash} has changed because non-standard info dictionary fields were removed. New infohash is ${new_torrent.canonical_info_hash}`;
      }

      notify({
        group: "success",
        title: "Success",
        text
      }, 8000);

      navigateTo(`/torrent/${new_torrent.canonical_info_hash}`, { replace: true });
    })
    .catch((err) => {
      uploading.value = false;

      notify({
        group: "error",
        title: "Error",
        text: `Trying to upload the torrent. ${err.message}.`
      }, 10000);
    });
}

</script>

<style scoped>
label {
  @apply p-2 w-full font-medium text-neutral-content/50;
}

input, select, textarea {
  @apply p-2.5 w-full bg-transparent text-neutral-content placeholder-neutral-content/50 border-2 border-base-content/20 rounded-2xl duration-200 cursor-pointer;
}
</style>
