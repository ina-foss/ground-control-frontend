import { User } from "oidc-client-ts";
import { useAuth } from "@/stores/auth";
import { initApplicationConfiguration } from "../services/dynamic-configuration-service";
const authFlowRoutes = ["/auth", "/silent-refresh", "/logout"];

export default defineNuxtRouteMiddleware(async (to, from) => {
    initApplicationConfiguration()
    const authStore = useAuth();
    const services = useService();
    const user = (await services.$auth.getUser()) as User;

    if (!user && !authFlowRoutes.includes(to.path)) {
        // use this to automatically force a sign in and redirect
        services.$auth.signInRedirect();
    } else {
        authStore.setUpUserCredentials(user);
    }
});