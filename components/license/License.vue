<template>
    <div>
    <Markdown :source="file" class="prose-h1:text-center pt-2 pb-10 pb-5 px-40 max-w-none" />
    </div>
</template>
<script setup lang="ts">

const props = defineProps({
  licenseFilePath: {
    type: String,
    required: true
  }
})

const file = await fetchTextFile(props.licenseFilePath);

</script>
  
<style scoped>
</style>