import { OpenAPI } from "../api/generate";
import { getApplicationConfiguration } from "../services/dynamic-configuration-service";
import { useAuth } from "../stores/auth";
import { storeToRefs } from "pinia";
import { UserService } from "../api/generate/services/UserService";

/**
 * Services used throught the application
 *
 * Args:
 *  authStore (Store) : Instance of the pinia store which handles users.
 *
 * Mehthods
 *  - getDefaultHeader() -> void
 *  - checkUser() -> void
 *  - setupHeader() -> void
 */
export default class ApplicationService {

  private authStore = useAuth();

  public getDefaultHeader() {
    const { access_token } = storeToRefs(this.authStore);
    return { Authorization: `Bearer ${access_token.value}` };
  }

  public async checkUser() {
    const { userEmail, user } = storeToRefs(this.authStore);

    if (!user.value || !user.value.profile) {
      console.error("User profile is not available.");
      return;
    }

    let accounts = JSON.parse(JSON.stringify(user.value.profile));
    console.log(accounts);

    let role = user.value.profile.roles ? user.value.profile.roles[2] : 'default';

    const response = ref(await UserService.getUserByEmailUserGet(userEmail.value));
    if (response.value == null) {
      UserService.createUserUserPost({
        email: userEmail.value,
        role: role
      }).then((response) => console.log(response));
    }
  }

  public setupHeader() {
    const config = getApplicationConfiguration();
    OpenAPI.BASE = config['apiBasePath'];
    OpenAPI.HEADERS = this.getDefaultHeader();
    inject('OpenAPI', OpenAPI);
  }

  /**
   * Get user roles from the auth store
   * @returns {string[]} Array of roles
   */
  public getUserRoles(): [] {
    const { user } = storeToRefs(this.authStore);
    return user.value?.profile?.roles ?? [];
  }

  public hasRole(role: string): boolean {
    const roles: [] = this.getUserRoles();
    return roles.includes(role);
  }
}
