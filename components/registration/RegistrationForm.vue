<template>
  <div class="px-2 lg:px-0">
    <div class="w-auto max-w-md px-6 py-6 mx-auto text-neutral-content/50 rounded-2xl">
      <h2 class="mb-4 text-2xl font-semibold text-center text-neutral-content">
        Sign up
      </h2>
      <form
        class="space-y-3"
        @submit.prevent="submit"
      >
        <FormInputText v-model="form.username" label="Username" name="username" data-cy="registration-form-username" required />
        <template v-if="settings && settings.email_on_signup !== EmailOnSignup.Ignored">
          <FormInputText
            v-model="form.email"
            :type="settings.email_on_signup === EmailOnSignup.Required || form.email !== '' ? 'email' : 'text'"
            label="Email"
            name="email"
            data-cy="registration-form-email"
            :required="settings.email_on_signup === EmailOnSignup.Required"
          />
        </template>
        <FormInputText
          v-model="form.password"
          :type="revealPasswords ? 'text' : 'password'"
          label="Password"
          name="password"
          data-cy="registration-form-password"
          required
        />
        <FormInputText
          v-model="form.confirm_password"
          :type="revealPasswords ? 'text' : 'password'"
          label="Repeat password"
          name="confirm_password"
          data-cy="registration-form-confirm-password"
          required
        />
        <div class="form-control">
          <label class="cursor-pointer label">
            <span class="label-text">Reveal passwords</span>
            <input type="checkbox" class="toggle" @click="toggleState">
          </label>
        </div>
        <button type="submit" name="submit" data-cy="registration-form-submit" class="w-full btn btn-primary">
          Sign Up
        </button>
      </form>
    </div>
    <div class="relative mt-6">
      <div class="relative flex justify-center text-sm">
        <NuxtLink to="/signin">
          Already have an account? Sign In
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Ref } from "vue";
import { EmailOnSignup, type PublicSettings } from "torrust-index-types-lib";
import { notify } from "notiwind-ts";
import { ref, useRestApi, useSettings } from "#imports";

const revealPasswords: Ref<Boolean> = ref(false);

type Form = {
  username: string,
  email: string,
  password: string,
  confirm_password: string
}

const rest = useRestApi();
const settings: PublicSettings = useSettings();

const form: Ref<Form> = ref({
  username: "",
  email: "",
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
  signup();
}

function signup () {
  rest.value.user.registerUser({
    username: form.value.username,
    email: form.value.email,
    password: form.value.password,
    confirm_password: form.value.confirm_password
  })
    .then(() => {
      navigateTo("/signin", { replace: true });
      notify({
        group: "success",
        title: "Success",
        text: "Your account was registered!"
      }, 4000); // 4s
    })
    .catch((err) => {
      notify({
        group: "error",
        title: "Error",
        text: `Registration failed. ${err.message}.`
      }, 10000);
    });
}
</script>

<style scoped>

</style>
