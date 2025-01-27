import { OpenAPI } from "../api/generate";
import { getApplicationConfiguration } from "../services/dynamic-configuration-service";
import { useAuth } from "../stores/auth";
import { storeToRefs } from "pinia";
import { UserService } from "../api/generate/services/UserService";
import { floor, padStart, padEnd } from "lodash";

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

  /**
   * Return the css variable and the associated hex value from a integer
   */
  public computeColor= (seed: number)=>{
    const full = 'bg-extra'+ (seed%9+1)
    const hex = getComputedStyle(document.body).getPropertyValue('--extra-'+(seed%9+1))
    return {  hex: hex, full : full , fullHexTransparent: 'bg-['+hex+'4f]'}

  }

  /**
   * Return correct text color given the backgound color
   * @param bgColor background color in hexadecimal format ex: '#4f425b'
   */
  public textColorPicker(bgColor: string) : "white" | "black"  {
    const color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
    const r = parseInt(color.substring(0, 2), 16); // hexToR
    const g = parseInt(color.substring(2, 4), 16); // hexToG
    const b = parseInt(color.substring(4, 6), 16); // hexToB
    return ((r * 0.299) + (g * 0.587) + (b * 0.114)) <= 120 ? 'white' : 'black'
  }
  /**
   * Convert time in transcription to be used in video jump
   * @param tc
   * @returns {number}
   */
  public unixToTimestamp(tc: string | number ): number{
    if (typeof tc == 'number') return tc
    if (!tc.includes(':')) return parseFloat(tc)
    const millisecond = tc.split('.')[1]
    const timeArray = tc.split('.')[0].split(':')
    const videoTime = parseInt(timeArray[0]) * 3600 + parseInt(timeArray[1]) * 60 + parseInt(timeArray[2]) + floor(parseFloat('0.'+millisecond),2)
    return videoTime
  }

  /**
   * Convert timestamp into readable time code
   * @param time
   * @returns {string}
   */
  public timestampToUnix(timeArg: number | string): string {
    let time : number
    if ( typeof timeArg == "string" ){
      if (timeArg.includes(':')) return timeArg // If the time is already at Unix format
      else time = parseFloat(timeArg) // If the time is a timestamp as a string
    }
    else time = timeArg // if the time is a float

        const hour: number = floor(time/3600)
        const minute: number = floor((time % 3600 )/60)
        const second: number = floor(time % 60)
        const milli: number = floor(time % 1,2)
  return `${padStart((hour.toString()),2,'0')}:${padStart(minute.toString(),2,'0')}:${padStart(second.toString(),2,'0')}.${padEnd(milli.toString().split('.')[1],3,'0')}`
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
      return parseJwt(this.getDefaultHeader()['Authorization'])?.realm_access?.roles;
    }

    public hasRole(role: string): boolean {
      const roles: [] = this.getUserRoles();
      const rolesFromToken: [] = this.getUserRolesFromToken();
      return roles?.includes(role) || rolesFromToken?.includes(role);
    }

  public formatDate (dateString)  {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {day: '2-digit', month: 'long', year: 'numeric'});
  }

}
