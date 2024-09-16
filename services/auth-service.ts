import type { User} from "oidc-client-ts";
import { UserManager, WebStorageStateStore } from "oidc-client-ts";
import { getApplicationConfiguration } from "./dynamic-configuration-service";

export default class AuthService {
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
        } catch (error) {
            console.error(error);
        }
    }

    public signInRedirect() {
      console.log('redirecting');

        return this.userManager.signinRedirect();
    }

    public signInCallback() {
        return this.userManager.signinCallback();
    }

    public renewToken(): Promise<void> {
        return this.userManager.signinSilent();
    }

    public logout(): Promise<void> {
        return this.userManager.signoutRedirect();
    }

    public getUser(): Promise<User | null> {
        return this.userManager.getUser();
    }
}
