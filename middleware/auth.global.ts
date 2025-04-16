import type { User } from "oidc-client-ts";
import { useAuth } from "../stores/auth";
import { useService } from "../composables/useService";


const authFlowRoutes = ["/auth", "/silent-refresh", "/logout"];

export default defineNuxtRouteMiddleware(async (from: any, to:any) => {
  if (process.env.NODE_ENV === 'test') {
    return; // Bypass the entire authentication logic in test mode
  }
  const authStore = useAuth();
  const services = useService();
  const user = (await services.$auth.getUser()) as User;
  if (!user && !authFlowRoutes.includes(to.path)) {
    // use this to automatically force a sign in and redirect
    // pass the initial url as parameter to redirect to it after authentication
    services.$auth.signInRedirect(to.fullPath);
  }
  else {
    authStore.setUpUserCredentials(user);
    services.$application.setupHeader()
    if (!authFlowRoutes.includes(to.path)) {
      services.$application.checkUser()
    }
  }
});
