import { acceptHMRUpdate, defineStore } from "pinia";
import type { User } from "oidc-client-ts";
import { computed } from "vue";
import { useService } from "../composables/useService";

export const useAuth = defineStore("auth", () => {
  const authUser = ref<User | null>(null);

  const access_token = computed(() => authUser.value?.access_token ?? "");

  const userEmail = computed(()  => authUser.value?.profile?.email ?? "");

  const isLoggedIn = computed(() => !!authUser.value);

  const tenantId = computed(
    () => (authUser.value?.profile?.Tenant as string) ?? ""
  );

  const setUpUserCredentials = (user: User) => {
    authUser.value = user;
  };

  const clearUserSession = () => {
    authUser.value = null;
  };

  return {
    access_token,
    userEmail,
    isLoggedIn,
    tenantId,
    setUpUserCredentials,
    clearUserSession,
    user: authUser,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuth, import.meta.hot));
}
