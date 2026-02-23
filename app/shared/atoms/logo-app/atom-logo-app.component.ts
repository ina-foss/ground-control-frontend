
import { defineComponent, computed } from 'vue';
import pino from 'pino';

/**
 * Enum representing different sizes for the logo.
 *
 * @readonly
 * @enum {string}
 */
enum LogoSize {
  sm = '18px',
  md = '28px',
  lg = '45px'
}

/**
 * Props interface for the AtomLogo component.
 *
 * @interface
 * @property {keyof typeof LogoSize} size - Size for the INA logo.
 * @default 'md'
 * @description Size can be one of 'sm' (18px), 'md' (28px), or 'lg' (45px).
 */
interface AtomLogoProps {
  size?: keyof typeof LogoSize;
}

/**
 * Create a pino logger instance for logging.
 *
 * @const logger - The pino logger instance.
 */
const logger = pino();



export default defineComponent({
  name: 'AtomLogoApp',
  compatConfig: { MODE: 3 },
  props: {
    size: {
      type: String as () => keyof typeof LogoSize,
      default: 'md',
      validator: (value: string) => {
        const isValid = Object.keys(LogoSize).includes(value);
        if (!isValid) {
          logMessage('error', `Invalid size value: ${value}`);
        }
        return isValid;
      },
    },
  },
  setup(props: AtomLogoProps) {
    /**
     * Computed function to determine the logo size based on the provided prop value.
     * If the prop value does not match any key in LogoSize, a default size will be used.
     *
     * @returns {string} - The corresponding size value from the LogoSize enum.
     */
    const sizeHeight = computed(() => {
      try {
        if (LogoSize[props.size]) {
          logger.info(`Setting logo size to: ${LogoSize[props.size]}`);
          return LogoSize[props.size];
        } else {
          throw new Error(`Size '${props.size}' is not a valid size.`);
        }
      } catch (error) {
        logger.error(`Error in setup: ${error.message}`);
        // Handle default behaviour in case of error (fall back to 'md' size)
        return LogoSize.md;
      }
    });

    return {
      sizeHeight,
    };
  },
});
