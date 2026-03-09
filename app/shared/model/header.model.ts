import type { ActionTheme, ActionType, ActionVariant, ButtonSize } from "./enumerations/header-type.model";

export type ActionItem = {
  label: string;
  value: string;
  icon: string;
  action: () => void;
};

export type Action = {
  type: ActionType;
  label?: string;
  value?: string;
  placeholder?: string;
  size?: ButtonSize;
  tooltip?: string;
  icon?: string;
  items?: Array<ActionItem>;
  action?: (event?: any) => void;
  variant?: ActionVariant;
  theme?: ActionTheme;
  class?: string;
  active?: boolean;
};