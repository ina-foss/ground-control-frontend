import type { User } from "oidc-client-ts";
import { useAuth } from "../stores/auth";
import { getApplicationConfiguration, initApplicationConfiguration } from "../services/dynamic-configuration-service";
import { useService } from "../composables/useService";
import { UserService } from "../api/generate/services/UserService"
import { OpenAPI } from "../api/generate";

const authFlowRoutes = ["/auth", "/silent-refresh", "/logout"];

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuth();
  let services = useService();
  const user = (await services.$auth.getUser()) as User;
  if (!user && !authFlowRoutes.includes(to.path)) {
    // use this to automatically force a sign in and redirect
    services.$auth.signInRedirect();
  }
  else {
    authStore.setUpUserCredentials(user);
    services.$application.setupHeader()
    if (!authFlowRoutes.includes(to.path)) {
      services.$application.checkUser()
    }
  }
});
