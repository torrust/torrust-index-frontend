<template>
  <div class="group dropdown" :class="dropdownAlignment">
    <div
      tabindex="0"
      class="items-center duration-200 select select-bordered group-hover:border-amber-500"
      :class="{ 'h-[3.5rem]': !!label }"
    >
      <div class="flex flex-col mr-1 text-left capitalize flex-nowrap">
        <span v-if="label" class="text-xs text-primary">{{ label }}</span>
        <div class="flex flex-row text-sm flex-nowrap">
          <span v-if="props.selected.length === 0">None</span>
          <span v-else-if="props.selected.length > 1">Multiple</span>
          <span v-else>{{ getOptionNameByValue(props.selected[0]) }}</span>
        </div>
      </div>
    </div>
    <div
      ref="dropdownContent"
      tabindex="0"
      class="flex flex-col gap-2 p-2 mt-3 border rounded-lg shadow dropdown-content border-base-content/20 bg-base-100 z-[1]"
    >
      <template v-if="props.search">
        <div class="">
          <input
            v-model="searchText"
            class="text-sm border-2 input placeholder-base-content input-bordered rounded-2xl"
            placeholder="Search"
            name="search"
          >
        </div>
      </template>
      <template v-if="filteredOptions().length > 0">
        <ul class="menu">
          <li
            v-for="(option) in filteredOptions()"
            :key="option.value"
            class="text-sm text-base-content"
            @click="toggleOption(option)"
          >
            <div class="flex flex-row w-full rounded-lg">
              <div class="font-bold text-neutral-content">
                {{ option.name }}
              </div>
              <div v-if="props.multiple" class="flex flex-col items-center ml-auto">
                <span v-if="isSelectedOption(option)" class="relative inline-flex">
                  <input type="checkbox" class="w-6 h-6 border-2 rounded-md appearance-none bg-primary border-primary">
                  <CheckIcon
                    class="absolute w-5 text-neutral-content"
                    style="top: 50%;left: 50%;transform: translate(-50%, -50%);"
                  />
                </span>
                <input
                  v-else
                  type="checkbox"
                  class="w-6 h-6 duration-200 border-2 rounded-md appearance-none border-base-content/20"
                >
              </div>
            </div>
          </li>
        </ul>
      </template>
      <template v-else>
        <div class="px-6 py-3">
          <span class="text-neutral-content/50">No results..</span>
        </div>
      </template>
      <template v-if="props.selected.length > 1">
        <button class="w-full p-2 text-sm rounded-lg bg-primary/10 text-primary" @click="emit('update:selected', [])">
          Clear all
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, type PropType, onBeforeUnmount, computed } from "vue";
import { CheckIcon, ChevronDownIcon } from "@heroicons/vue/20/solid";
import { onMounted } from "../.nuxt/imports";

export interface TorrustSelectOption {
  name: string;
  value: string;
}

const props = defineProps({
  options: {
    type: Array as PropType<Array<TorrustSelectOption>>,
    required: true
  },
  label: {
    type: String,
    default: ""
  },
  search: {
    type: Boolean,
    default: false
  },
  selected: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  multiple: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["update:selected"]);

const searchText = ref("");
const dropdownContent = ref(null);

function isSelectedOption (option: TorrustSelectOption) {
  return props.selected.includes(option.value);
}

function getOptionNameByValue (value: string): string {
  let name: string;

  props.options.forEach((option) => {
    if (option.value === value) {
      name = option.name;
    }
  });

  return name;
}

function toggleOption (option: TorrustSelectOption) {
  let value: string[] = [];

  if (props.multiple) {
    if (isSelectedOption(option)) {
      value = props.selected.filter(item => item !== option.value);
    } else {
      value = props.selected.concat([option.value]);
    }
  } else {
    value = [option.value];
  }

  emit("update:selected", value);
}

function filteredOptions () {
  let filteredOptions = Array.from(props.options);

  if (searchText.value !== "") {
    filteredOptions = filteredOptions.filter(option => option.name.toLowerCase().includes(searchText.value.toLowerCase()));
  }

  return filteredOptions;
}

const dropdownAlignment = computed(() => {
  const dropdownElement = dropdownContent.value;

  if (dropdownElement) {
    const dropdownRect = dropdownElement.getBoundingClientRect();
    const dropdownLeft = dropdownRect.left;
    const dropdownRight = dropdownRect.right;
    const viewportWidth = window.innerWidth;

    // Check if the dropdown is off-screen at the left
    if (dropdownLeft < 0) {
      return ["dropdown-start"];
    }
    // Check if the dropdown is off-screen at the right
    else if (dropdownRight > viewportWidth) {
      return ["dropdown-end"];
    }
    // Reset the dropdown position if it's within the viewport
    else {
      return ["dropdown-start"];
    }
  } else {
    return ["dropdown-start"];
  }
});

</script>

<style scoped></style>
