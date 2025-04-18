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
  const isAuthRoute = authFlowRoutes.includes(to.path);

  if ((!user || user.expired) && !isAuthRoute) {
    /* eslint-disable no-console */
    console.log("🔒 Utilisateur manquant ou expiré → redirection vers login");
    return services.$auth.signInRedirect(to.fullPath);
  }

  if (user && !user.expired) {
    /* eslint-disable no-console */
    console.log("✅ Utilisateur authentifié, mise à jour du store");
    authStore.setUpUserCredentials(user);
    services.$application.setupHeader();
  }
});
