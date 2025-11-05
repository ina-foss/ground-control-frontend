import { defineComponent, computed } from 'vue';
import pino from 'pino';

/**
 * Enum representing different sizes for the logo.
 */
export enum LogoSize {
  /**
   * Small size (40px)
   */
  sm = '40px',
  /**
   * Medium size (50px)
   */
  md = '50px',
  /**
   * Large size (80px)
   */
  lg = '80px',
}

/**
 * Props interface for the AtomLogo component.
 */
interface AtomLogoProps {
  /**
   * Size for the logo.
   *
   * @default 'MEDIUM'
   * @remarks Can be 'SMALL' (40px), 'MEDIUM' (50px), or 'LARGE' (80px).
   */
  size?: keyof typeof LogoSize;
}

// Create a logger instance
const logger = pino({
  level: 'info',
  prettyPrint: { colorize: true, translateTime: true }
});

export default defineComponent({
  name: 'AtomLogoINA',
  compatConfig: { MODE: 3 },
  props: {
    size: {
      type: String as () => keyof typeof LogoSize,
      default: 'MEDIUM',
      validator(value: string): boolean {
        const isValid = Object.keys(LogoSize).includes(value);
        if (!isValid) {
          logger.warn(`Invalid size prop value: ${value}`);
        }
        return isValid;
      },
    },
  },
  setup(props: AtomLogoProps) {
    try {
      logger.info(`Setting up AtomLogoINA component with size: ${props.size}`);
      const sizeHeight = computed(() => LogoSize[props.size || 'MEDIUM']);
      logger.info(`Computed sizeHeight: ${sizeHeight.value}`);

      return {
        sizeHeight,
      };
    } catch (error) {
      logger.error(`Error in setup function: ${error.message}`);
      throw new Error(`Failed to setup AtomLogoINA component: ${error.message}`);
    }
  },
});
