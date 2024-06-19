<template>
  <div class="bg-gray-50 min-h-screen ">
    <Header />
    <slot />
  </div>
</template>



<script setup>

import { UserService } from "../api/generate/";
import { useService } from "../composables/useService";
import { ProjectService } from '~/api/generate';

const SetupUser = async () => {
  const services = useService();
  const user = await (services.$auth.getUser());

  const response = ref(await UserService.getUserByEmailUserGet(user.profile.email))
  if (response.value == null) {
    UserService.createUserUserPost({
      email: user.profile.email,
      role: user.profile.roles[2]
    }).then((response) => console.log(response))
  }

}
SetupUser()

</script>
