import type { User } from "oidc-client-ts";
import { useAuth } from "../stores/auth";
import { useService } from "../composables/useService";


const authFlowRoutes = ["/auth", "/silent-refresh", "/logout"];

export default defineNuxtRouteMiddleware(async (to:any) => {
  if (process.env.NODE_ENV === 'test') {
    return; // Bypass the entire authentication logic in test mode
  }
  const authStore = useAuth();
  const services = useService();
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
