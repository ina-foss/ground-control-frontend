import _ from 'lodash'
import { TypePlugin, type PluginAutocompleteValueDTO, type PluginWithIdDto } from '~/api/generate';

/**
* @brief Best color order to avoid consecutive similar color
* @see
* '~/assets/css/theme.css' to see color values
*/
export const DEFAULT_COLOR_CYLCLING = [3, 9, 8, 4, 1, 2, 7, 6, 10, 5 ]

/**
 * @brief Convert hexadecimal color in RGBA
 * @param hex The color in hexadecimal format
 * @param opacity The opacity you want the RGBA color to have
 * @example
 * ```ts
 * hexToRgba("#d1a324",1) // will return 'rgba(209,163,36,1)'
 * ```
 */
export function hexToRgba(hex: string, opacity: number) {
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
  * @brief Return the css variable and the associated hex value from a integer
  */
export function computeColor(seed: number | null | undefined){
  if(seed == null || seed == undefined) return {full: 'bg-gray-500', hex:'#BEBEBE' }
  seed = DEFAULT_COLOR_CYLCLING[seed % DEFAULT_COLOR_CYLCLING.length]
  const full = 'bg-extra'+ (seed)
  const hex = getComputedStyle(document.body).getPropertyValue('--extra-'+(seed))
  return {  hex: hex, full : full , fullHexTransparent: 'bg-['+hex+'4f]'}
}

/**
 * @brief Return an array of RGB values given the string in parameter
 **/
export function parseRgba(color) {
  if (!color) return null;

  const str = color.trim();

  // Check prefix
  const isRgba = str.startsWith("rgba(");
  const isRgb = !isRgba && str.startsWith("rgb(");
  if (!isRgba && !isRgb) return null;

  // Check closing paren
  if (!str.endsWith(")")) return null;

  // Extract inner content: "255, 128, 0, 0.5"
  const inner = str.slice(isRgba ? 5 : 4, -1);

  const parts = inner.split(",");
  const expectedParts = isRgba ? 4 : 3;
  if (parts.length !== expectedParts) return null;

  const [rStr, gStr, bStr, aStr] = parts;

  const r = parseInt(rStr.trim(), 10);
  const g = parseInt(gStr.trim(), 10);
  const b = parseInt(bStr.trim(), 10);

  if (
    isNaN(r) || isNaN(g) || isNaN(b) ||
    r < 0 || r > 255 ||
    g < 0 || g > 255 ||
    b < 0 || b > 255
  ) return null;

  if (isRgba) {
    const a = parseFloat(aStr.trim());
    if (isNaN(a) || a < 0 || a > 1) return null;
    return [r, g, b, a];
  }

  return [r, g, b];
}


/**
 * @brief Return the hex code and tailwind expression of the color depending on the position of `label` in `labels`
 * @param labels list of labels
 * @param label label that must be included in `labels`
 */
 export function computeColorByLabel(
   labels: (string| undefined | null)[] ,
   label: (string | undefined | null)[],
 ): {
   /** tailwind class of the color */
   full: string;
   /** hex code of the color */
   hex: string;
   /** tailwind class with opacity of the color */
   fullHexTransparent?: string;
 } {
   if ( !label || !label.length || !labels )
     return { hex: 'w', full: 'bg-secondary' };
   let labelIndex : number | undefined = labels
     .map((label) => String(label).trim())
     .indexOf(label.toString());
   if (label.length != 1) {
     labelIndex = label.reduce((sum:number, l ) => sum + (l?.length ? l.length : 0), 0);
   }
   if (labelIndex == null) return { full: 'bg-gray-500', hex: '#BEBEBE' };
   labelIndex = DEFAULT_COLOR_CYLCLING[labelIndex % DEFAULT_COLOR_CYLCLING.length];
   const full = 'bg-extra' + labelIndex;
   const hex = getComputedStyle(document.body).getPropertyValue(
     '--extra-' + labelIndex,
   );
   return { hex: hex, full: full, fullHexTransparent: 'bg-[' + hex + '4f]' };
 }

/**
  * @brief Return correct text color given the backgound color
  * @param bgColor background color in hexadecimal format ex: '#4f425b'
  */
export function textColorPicker(bgColor: string) : "white" | "black"  {
  const color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
  const r = parseInt(color.substring(0, 2), 16); // hexToR
  const g = parseInt(color.substring(2, 4), 16); // hexToG
  const b = parseInt(color.substring(4, 6), 16); // hexToB
  return ((r * 0.299) + (g * 0.587) + (b * 0.114)) <= 120 ? 'white' : 'black'
}

/**
 * @brief Return the color for a `pluginValue` regarding previous values in `occurenceArray`
 * @param pluginValue The value you a want a color for
 * @param occurenceArray The previous value whose already have been colored
 * @param opacity Opacity of the returned color, by default `0.25`
*/
export function getRelativePluginColor(
  pluginValue: PluginAutocompleteValueDTO[],
  occurenceArray: PluginAutocompleteValueDTO[],
  opacity: number = 0.25,
) {
  const index = _.findIndex(occurenceArray, (value) =>
    _.isEqual(value, pluginValue[0]),
  );
  if(index < 0) return `rgba(170,170,170,${opacity})`
  const newCyclingIndex = DEFAULT_COLOR_CYLCLING[index % DEFAULT_COLOR_CYLCLING.length]
  const hex = getComputedStyle(document.body).getPropertyValue(
    '--extra-' + (newCyclingIndex),
  );
  return hexToRgba(hex, opacity);
}

/**
  * @brief Return the color for a `pluginValue` based on its position on the entire `pluginOptionsList`
  * @param pluginValue The value you want a color for
  * @param pluginOptionsList The list of all the available values
  * @param plugin The plugin object which hold the configuration
  * @param opacity Opacity of the returned color, by default `0.25`
  **/
export function getAbsolutePluginColor(
  pluginValue: PluginAutocompleteValueDTO[],
  pluginOptionsList: {data: PluginAutocompleteValueDTO[], id:number} | undefined,
  plugin: PluginWithIdDto | undefined,
  opacity: number = 0.25,
){
 if(plugin && pluginValue && pluginValue.length && pluginOptionsList){
    if(plugin.type == TypePlugin.LISTITEMS  || ( plugin.type == TypePlugin.AUTOCOMPLETE && plugin.config_data.type == 'get plugin' ) ) {
      return hexToRgba(computeColorByLabel(pluginOptionsList?.data.map(option=>option.label),pluginValue.map(value=>value.label)).hex,opacity)
    }
    else if(plugin.type == TypePlugin.AUTOCOMPLETE && plugin.config_data.type == 'post plugin'){
      const seed = pluginValue?.map(value=>value.label?.split('').reduce((acc,value)=>acc+=value.charCodeAt(0),0)).reduce((acc,value)=>acc+=value,0)
      return hexToRgba(computeColor(seed).hex,opacity)
    }
  }
  else return `rgba(170,170,170,${opacity})`
}

export function getColorWithOpacity(opacity: number) {
  return `rgba(183, 177, 255, ${opacity})`
}
