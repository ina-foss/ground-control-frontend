/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConfigData } from './ConfigData';
import type { DisplayZone } from './DisplayZone';
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
    config_data: ConfigData;
    id: number;
};

