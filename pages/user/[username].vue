<template>
  <ChangePasswordForm :username="user.username" />
</template>

<script setup lang="ts">
import ChangePasswordForm from "~/components/user/ChangePasswordForm.vue";
import { useUser } from "#imports";

const user = useUser();

</script>

<style scoped>

</style>
