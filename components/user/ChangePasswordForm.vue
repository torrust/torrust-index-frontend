<template>
  <div class="px-2 lg:px-0">
    <div class="w-auto max-w-md px-6 py-6 mx-auto text-neutral-content/50 rounded-2xl">
      <h2 class="mb-4 text-2xl font-semibold text-center text-neutral-content">
        Change Password
      </h2>
      <form
        class="space-y-3"
        @submit.prevent="submit"
      >
        <FormInputText
          v-model="form.current_password"
          :type="revealPasswords ? 'text' : 'password'"
          label="Current password"
          name="current_password"
          data-cy="change-password-form-current-password"
          required
        />
        <FormInputText
          v-model="form.password"
          :type="revealPasswords ? 'text' : 'password'"
          label="New password"
          name="password"
          data-cy="change-password-form-password"
          required
        />
        <FormInputText
          v-model="form.confirm_password"
          :type="revealPasswords ? 'text' : 'password'"
          label="Confirm new password"
          name="confirm_password"
          data-cy="change-password-form-confirm-password"
          required
        />
        <div class="form-control">
          <label class="cursor-pointer label">
            <span class="label-text">Reveal passwords</span>
            <input type="checkbox" class="toggle" @click="toggleState">
          </label>
        </div>
        <button type="submit" name="submit" data-cy="change-password-form-submit" class="w-full btn btn-primary">
          Update
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Ref } from "vue";
import { notify } from "notiwind-ts";
import { ref, useRestApi, useSettings } from "#imports";

const props = defineProps({
  username: {
    type: String,
    required: true
  }
});

const revealPasswords: Ref<Boolean> = ref(false);

type Form = {
  current_password: string,
  password: string,
  confirm_password: string
}

const rest = useRestApi();
const settings = useSettings();

const form: Ref<Form> = ref({
  current_password: "",
  password: "",
  confirm_password: ""
});

function toggleState () {
  if (revealPasswords.value) {
    revealPasswords.value = false;
  } else {
    revealPasswords.value = true;
  }
}

function submit () {
  changePassword(props.username);
}

function changePassword (username: string) {
  rest.value.user.changePassword({
    current_password: form.value.current_password,
    password: form.value.password,
    confirm_password: form.value.confirm_password
  }, username)
    .then(() => {
      navigateTo("/torrents", { replace: true });
      notify({
        group: "success",
        title: "Success",
        text: "Your password was changed!"
      }, 4000); // 4s
    })
    .catch((err) => {
      notify({
        group: "error",
        title: "Error",
        text: `Password change failed. ${err.message}.`
      }, 10000);
    });
}
</script>

<style scoped>

</style>
