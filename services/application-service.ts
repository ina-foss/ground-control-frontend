import { OpenAPI } from "../api/generate";
import { getApplicationConfiguration } from "../services/dynamic-configuration-service";
import { useAuth } from "../stores/auth";
import { storeToRefs } from "pinia";
import { UserService } from "../api/generate/services/UserService";
import { floor, padStart, padEnd } from "lodash";
import {useTcOffset} from "~/composables/useTcOffset";
import { useI18n } from '#imports'

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

  /**
   * Constructor that bind the right context
   */
  constructor() {
    this.unixToTimestamp = this.unixToTimestamp.bind(this)
    this.timestampToUnix = this.timestampToUnix.bind(this)
    this.extractRGB = this.extractRGB.bind(this)
  }

  private authStore = useAuth();

  public getDefaultHeader() {
    const { access_token } = storeToRefs(this.authStore);
    return { Authorization: `Bearer ${access_token.value}` };
  }

  /**
   * Return the css variable and the associated hex value from a integer
   */
  public computeColor= (seed: number)=>{
    if(seed == null) return {full: 'bg-gray-500', hex:'#BEBEBE' }
    const full = 'bg-extra'+ (seed%9+1)
    const hex = getComputedStyle(document.body).getPropertyValue('--extra-'+(seed%9+1))
    return {  hex: hex, full : full , fullHexTransparent: 'bg-['+hex+'4f]'}

  }

  public computeColorByLabel(labels,label): { full: string; hex: string } {
    if(!label.length || !labels?.length ) return {hex: '#EEEEEEEE', full: 'bg-secondary'}
    let labelIndex=  (labels.map(label => String(label).trim())).indexOf(label.toString())
    if(label.length != 1){
      labelIndex = label.reduce((sum, l) => sum + l.length, 0);
    }
    if(labelIndex == null) return {full: 'bg-gray-500', hex:'#BEBEBE' }
    const full = 'bg-extra'+ (labelIndex%9+1)
    const hex = getComputedStyle(document.body).getPropertyValue('--extra-'+(labelIndex%9+1))
    return {  hex: hex, full : full , fullHexTransparent: 'bg-['+hex+'4f]'}
  }
  public hexToRgba(hex, opacity) {
    let r = 0, g = 0, b = 0;
    // Handle 3 digit hex
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    }
    // Handle 6 digit hex
    else if (hex.length === 7) {
      r = parseInt(hex[1] + hex[2], 16);
      g = parseInt(hex[3] + hex[4], 16);
      b = parseInt(hex[5] + hex[6], 16);
    }
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }


  /**
   * Convert an color code in Hexadecimal in to a RGB one
   * @param hexColor hexColor
   */
  public extractRGB(hexColor) {
    const rgbaColor = this.hexToRgba(hexColor, 0.5);
    const rgba = rgbaColor?.replace(/^rgba?\(|\s+|\)$/g, '').split(',');
    return rgba.slice(0, 3);
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
    if (!tc) return 0
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
    if (node !== null) {

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
