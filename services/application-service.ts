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

  public computeColor= (seed )=>{
    let color ='--extra-'+ (seed%10+1)
    let hex = getComputedStyle(document.body).getPropertyValue(color)
    return { color: color, hex: hex }
  }

  public textColorPicker(bgColor) {
    let color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
    let r = parseInt(color.substring(0, 2), 16); // hexToR
    let g = parseInt(color.substring(2, 4), 16); // hexToG
    let b = parseInt(color.substring(4, 6), 16); // hexToB
    return ((r * 0.299) + (g * 0.587) + (b * 0.114)) <= 120 ? 'white' : 'black'
  }

  public async checkUser() {
    const { userEmail, user } = storeToRefs(this.authStore);

    if (!user.value || !user.value.profile) {
      return;
    }

    const role = user.value.profile.roles ? user.value.profile.roles[2] : 'default';

    const response = ref(await UserService.getUserByEmailUserGet(userEmail.value));
    if (response.value == null) {
      UserService.createUserUserPost({
        email: userEmail.value,
        role: role
      }).then((response));
    }
  }

  public setupHeader() {
    const config = getApplicationConfiguration();
    OpenAPI.BASE = config['apiBasePath'];
    OpenAPI.HEADERS = this.getDefaultHeader();
  }

  /**
   * Get user roles from the auth store
   * @returns {string[]} Array of roles
   */
  public getUserRoles(): [] {
    const { user } = storeToRefs(this.authStore);
    return user.value?.profile?.roles ?? [];
  }

  public getUserRolesFromToken(): [] {
      const parseJwt = (token: string) => {
        try {
          return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
          return null;
        }
      };
      console.log(parseJwt(this.getDefaultHeader()['Authorization']));
      return parseJwt(this.getDefaultHeader()['Authorization'])?.realm_access?.roles;
    }

    public hasRole(role: string): boolean {
      const roles: [] = this.getUserRoles();
      const rolesFromToken: [] = this.getUserRolesFromToken();
      return roles?.includes(role) || rolesFromToken?.includes(role);
    }

}
