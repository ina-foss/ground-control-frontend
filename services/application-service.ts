import { OpenAPI } from "../api/generate";
import { getApplicationConfiguration, initApplicationConfiguration } from "../services/dynamic-configuration-service";
import { useAuth } from "../stores/auth"
import { storeToRefs } from "pinia"
import { UserService } from "../api/generate/services/UserService"


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
  constructor() { }

  private authStore = useAuth()

  public getDefaultHeader() {
    const { access_token } = storeToRefs(this.authStore)
    return { Authorization: `Bearer ${access_token.value}` };
  }

  public async checkUser() {
    const { userEmail, user } = storeToRefs(this.authStore)

    const response = ref(await UserService.getUserByEmailUserGet(userEmail.value))
    if (response.value == null) {
      UserService.createUserUserPost({
        email: userEmail.value,
        role: user.value.profile.roles[2],
      })
        .then((response) => console.log(response))
    }

  }
  /**
    * Setup global OpenAPI header to include current access token
    */
  public setupHeader() {
    const config = getApplicationConfiguration();
    // Configuring from env vars
    OpenAPI.BASE = config['apiBasePath'];
    OpenAPI.HEADERS = this.getDefaultHeader() // Add the access token to the header of every OpenAPI calls
    inject('OpenAPI', OpenAPI);
  }
}
