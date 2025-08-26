/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConfigData } from './ConfigData';
import type { DisplayConfig } from './DisplayConfig';
import type { DisplayZone } from './DisplayZone';
import type { TypePlugin } from './TypePlugin';
/**
 * DTO to create a plugin object.
 *
 * Attributes:
 * name (str): The name of the plugin.
 * type (TypePlugin): The type of the plugin (from `TypePlugin` enum).
 * data_categories (str): Categories for the plugin's data.
 * display_zone (DisplayZone): The display zone for the plugin.
 * step_id (int): The ID of the step associated with the plugin.
 * config_data (ConfigData): Configuration data for the plugin.
 * display_config (Optional[DisplayConfig]): Optional display configuration.
 * enable_search (Optional[bool]): Enable search feature for embedded plugins.
 * data_property (Optional[str]): Data property reference for embedded plugins.
 * children_plugins (Optional[List[PluginCreate]]): List of embedded child plugins.
 */
export type PluginCreate_Output = {
    name: string;
    type: TypePlugin;
    data_categories: string;
    display_zone: DisplayZone;
    step_id: number;
    config_data: ConfigData;
    display_config?: (DisplayConfig | null);
    enable_search?: (boolean | null);
    data_property?: (string | null);
    children?: (Array<PluginCreate_Output> | null);
};

