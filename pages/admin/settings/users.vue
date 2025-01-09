<template>
  <div class="flex flex-col max-w-md gap-2 mx-auto">
    <div class="flex flex-col gap-2">
      <template v-for="category in categories">
        <div class="flex justify-between p-2 rounded bg-base-100">
          <span class="text-base-content">{{ category.name }} ({{ category.num_torrents }})</span>
          <button :data-cy="getDeleteButtonDataCy(category.name)" class="text-error-content hover:text-error" @click="deleteCategory(category.name)">
            Delete
          </button>
        </div>
      </template>
    </div>
    <div class="flex gap-2">
      <input v-model="newCategory" data-cy="add-category-input" class="w-full input input-bordered" type="text">
      <button data-cy="add-category-button" class="btn btn-primary" :class="{ 'loading': addingCategory }" :disabled="addingCategory || !newCategory" @click="addCategory">
        Add category
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { notify } from "notiwind-ts";
import { getCategories, useCategories, useRestApi } from "#imports";

const categories = useCategories();
const rest = useRestApi().value;

const newCategory = ref("");
const addingCategory = ref(false);

onBeforeMount(() => {
  getCategories();
});

function getDeleteButtonDataCy (name: string) {
  return "delete-category-" + name.toLowerCase().replace(/ /g, "-");
}

function addCategory () {
  if (newCategory.value) {
    addingCategory.value = true;

    rest.category.addCategory(newCategory.value)
      .then(() => {
        getCategories();
      })
      .catch((err) => {
        notify({
          group: "error",
          title: "Error",
          text: `Trying to add the category. ${err.message}.`
        }, 10000);
      })
      .finally(() => {
        addingCategory.value = false;
      });
  }
}

function deleteCategory (category: string) {
  if (confirm(`Are you sure you want to delete ${category}?`)) {
    rest.category.deleteCategory(category)
      .then(() => {
        getCategories();
      })
      .catch((err) => {
        notify({
          group: "error",
          title: "Error",
          text: `Trying to delete the category. ${err.message}.`
        }, 10000);
      });
  }
}
</script>
