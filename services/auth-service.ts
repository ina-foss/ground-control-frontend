import type { User} from "oidc-client-ts";
import { UserManager, WebStorageStateStore } from "oidc-client-ts";
import { getApplicationConfiguration } from "./dynamic-configuration-service";
import { useAuth } from "../stores/auth";
import { useService } from "../composables/useService"

export default class AuthService {
    authStore = useAuth();
    private userManager!: UserManager;

    constructor() {
        this.initializedOidc();
    }

    private initializedOidc() {
        try {
            const config = getApplicationConfiguration()
            const settings = {
                authority: `${config['authorityUrl']}`,
                client_id: config['clientId'],
                redirect_uri: `${window.location.origin}/auth`,
                silent_redirect_uri: `${window.location.origin}/silent-refresh`,
                post_logout_redirect_uri: `${window.location.origin}`,
                response_type: "code",
                userStore: new WebStorageStateStore(),
                loadUserInfo: true,
            };
            this.userManager = new UserManager(settings);
            const authStore = useAuth();
          this.userManager.events.addAccessTokenExpiring(() => {
            /* eslint-disable no-console */
            console.log("⏳ Token va expirer, tentative de renouvellement...");
            this.renewToken(); // essaie silent renew automatiquement
          });

          // Détecte que le token a expiré (fail du silent renew)
          this.userManager.events.addAccessTokenExpired(() => {
             
            console.warn("⛔ Token expiré et non renouvelé !");
          });

          // Quand un nouveau token est chargé (ex: après renew)
          this.userManager.events.addUserLoaded((user) => {
            /* eslint-disable no-console */
            console.info(
              "✅ Token renouvelé / utilisateur chargé :",
              user?.profile?.name || "(anonyme)",
            );
            authStore.setUpUserCredentials(user);
            if (import.meta.client) {
              const { $application } = useService();
              $application.setupHeader();
            }
          });

          this.userManager.events.addUserUnloaded(() => {
            /* eslint-disable no-console */
            console.info("🚪 Utilisateur déconnecté");
            authStore.clearUserSession();
          });

          this.userManager.events.addSilentRenewError((err) => {
             
            console.error("❌ Erreur pendant silent renew :", err);
          });

        } catch (error) {
            console.error(error);
        }
    }

    public signInRedirect(location: string) {
      if (window.location.search.search('state=') === -1) {
        return this.userManager.signinRedirect({url_state: location});
      }
    }

    public signInCallback() {
        return this.userManager.signinCallback();
    }

    public renewToken(): Promise<User|null> {
        return this.userManager.signinSilent();
    }

    public logout(): Promise<void> {
        return this.userManager.signoutRedirect();
    }

    public getUser(): Promise<User | null> {
        return this.userManager.getUser();
    }
}
