/**
 * Enum representing different sizes for the logo.
 */
export enum HeaderSize {
  /**
   * Small size (40px)
   */
  sm = "50px",

  /**
   * Medium size (70px)
   */
  md = "70px",

  /**
   * Large size (80px)
   */
  lg = "90px",
}

export enum TextSize {
  /**
   * Small size (40px)
   */
  sm = "text-lg",

  /**
   * Medium size (70px)
   */
  md = "text-2xl",

  /**
   * Large size (80px)
   */
  lg = "text-4xl",
}

export enum ButtonSize {
  /**
   * Small size
   */
  SM = "small",

  /**
   * Large size
   */
  LG = "large",
}

/**
 * Enum representing different type for the props action.
 */
export enum ActionType {
  BUTTON = "button",
  LINK = "link",
  SELECT = "select",
  DROPDOWN = "dropdown",

  /**
   * Representing Avatar (switch dark/light mode, logout) by default
   */
  DEFAULT = "default",
}

/**
 * Enum representing different variant of button for the props action.
 */
export enum ActionVariant {
  TEXT = "text",
  LINK = "link",
  OUTLINED = "outlined",
}

/**
 * Enum representing different theme of button for the props action.
 */
export enum ActionTheme {
  SECONDARY = "secondary",
  SUCCESS = "success",
  INFO = "info",
  WARN = "warn",
  HELP = "help",
  DANGER = "danger",
  CONTRAST = "contrast",
}
