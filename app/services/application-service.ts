import { client } from '~/api/generate/client.gen'
import { getApplicationConfiguration } from "./dynamic-configuration-service";
import { useAuth } from "../stores/auth";
import { storeToRefs } from "pinia";
import { floor, padStart, padEnd } from "lodash";
import {useTcOffset} from "../composables/useTcOffset";
import { useI18n } from '#imports'
import { User } from '~/api/generate';

/**
 * Services used throught the application
 *
 * Args:
 *  authStore (Store) : Instance of the pinia store which handles users.
 *
 * Mehthods
 *  - checkUser() -> void
 *  - setupHeader() -> void
 */
export default class ApplicationService {

  /**
   * Constructor that bind the right context
   */
  constructor() {
    this.unixToTimestamp = this.unixToTimestamp.bind(this)
    this.timestampToUnix = this.timestampToUnix.bind(this)
    this.extractRGB = this.extractRGB.bind(this)
  }

  private authStore = useAuth();

  public setupHeader() {
    const { access_token } = storeToRefs(this.authStore);

    try{
      const config = getApplicationConfiguration()
      if (!config['apiBasePath']) {
        throw new Error('API base path is not defined')
      }

      client.setConfig({
        auth : () => access_token.value,
        baseURL: config['apiBasePath'] as string
      })

      // client.interceptors.request.use(request=>{
      //   request.headers.set("Authorization",`Bearer ${access_token.value}`)
      //   return request
      // })

    } catch(e){
      console.error('Failed to setup application service headers: ', e)
    }

    return { Authorization: `Bearer ${access_token?.value}` };
  }


  /**
   * Convert an color code in Hexadecimal in to a RGB one
   * @param hexColor hexColor
   */
  public extractRGB(hexColor) {
    const rgbaColor = hexToRgba(hexColor, 0.5);
    const rgba = rgbaColor?.replace(/(?:^rgba?\()|\s+|(?:\)$)/g, '').split(',');
    return rgba.slice(0, 3);
  }

  /**
   * Convert time in transcription to be used in video jump
   * @param tc
   * @returns {number}
   */
  public unixToTimestamp(tc: string | number ): number{
    if (!tc) return 0
    if (typeof tc == 'number') return tc
    if (!tc.includes(':')) return parseFloat(tc)
    const millisecond = tc.split('.')[1]
    const timeArray = tc.split('.')[0].split(':')
    const videoTime = parseInt(timeArray[0]) * 3600 + parseInt(timeArray[1]) * 60 + parseInt(timeArray[2]) + floor(parseFloat('0.'+millisecond),4)
    return videoTime
  }

  /**
   * Convert timestamp into readable time code
   * @param time
   * @returns {string}
   */
  public timestampToUnix(timeArg: number | string): string {
    const  {getTcOffset} = useTcOffset();
    let time : number
    if ( typeof timeArg == "string" ){
      if (timeArg.includes(':')) time = this.unixToTimestamp(timeArg) // If the time is already at Unix format
      else time = parseFloat(timeArg) // If the time is a timestamp as a string
    }
    else time = timeArg // if the time is a float

    time = time + getTcOffset()
    const optionalTime : Array<number> = []
    const hour: number = floor(time/3600)
    const minute: number = floor((time % 3600 )/60)
    const second: number = floor(time % 60)
    optionalTime.push(hour)
    optionalTime.push(minute)
    optionalTime.push(second)
    const milli: number = floor(time % 1,2)
    return `${optionalTime.map((el)=> padStart(el.toString(),2,'0')).filter((el,index)=> el != '00' || index != 0 ).join(':')}.${padEnd(milli.toString().split('.')[1],3,'0')}`
  }

  public async checkUser() {
    const { userEmail, user } = storeToRefs(this.authStore);

    if (!user.value || !user.value.profile) {
      return;
    }

    const role = user.value.profile.roles ? user.value.profile.roles[2] : 'default';

    const response = ref(await User.getUserByEmailUserGet({query: {email: userEmail.value}}));
    if (response.value == null) {
      await User.createUserUserPost({
        body: {
          email: userEmail.value,
          role: role
        }
      }).then((response));
    }
  }

  /**
   * Get user roles from the auth store
   * @returns {string[]} Array of roles
   */
  public getUserRoles(): [] {
    const { user } = storeToRefs(this.authStore);
    return user?.value?.profile?.roles ?? [];
  }

  public getUserRolesFromToken(): [] {
      const parseJwt = (token: string) => {
        try {
          return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
          return null;
        }
      };
      const { access_token } = storeToRefs(this.authStore);
      return parseJwt(access_token.value)?.realm_access?.roles;
    }

    public hasRole(role: string): boolean {
      const roles: [] = this.getUserRoles();
      const rolesFromToken: [] = this.getUserRolesFromToken();
      return roles?.includes(role) || rolesFromToken?.includes(role);
    }

  public formatDate (dateString)  {
    const { locale } = useI18n()
     return new Date(dateString).toLocaleDateString(
      locale.value === 'en' ? 'en-US' : 'fr-FR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }
    )
  }

  public extractTextFromSpan(node: Element | Node |null): string {
    if (node !== null && node instanceof Node) {

      const clone = node.cloneNode(true) as Element;

      if (clone && typeof (clone as Element).querySelectorAll === 'function') {
        (clone as Element).querySelectorAll("tag, bg1").forEach(el => el.remove());
      }
      // TreeWalker : récupère uniquement les textes
      const walker = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT);
      let text = "";
      let current: Node | null;

      while ((current = walker.nextNode())) {
        const t = current.nodeValue?.trim();
        if (t) text += t;
      }

      return text.trim();
    }
  }
}
