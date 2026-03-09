/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { ConfigData } from './ConfigData';
import type { DisplayConfig } from './DisplayConfig';
import type { DisplayZone } from './DisplayZone';
import type { JsonValue } from './JsonValue';
import type { TypePlugin } from './TypePlugin';
/**
 * Extends PluginCreate with an additional id field.
 *
 * Attributes:
 * id (int): The unique identifier of the plugin.
 */
export type PluginWithIdDto = {
    name: string;
    type: TypePlugin;
    data_categories: string;
    display_zone: DisplayZone;
    step_id: number;
    available_plugins?: (JsonValue | null);
    config_data: ConfigData;
    display_config?: (DisplayConfig | null);
    enable_search?: (boolean | null);
    data_property?: (string | null);
    children?: (Array<PluginWithIdDto> | null);
    id: number;
};

