/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PluginAutocompleteValueDTO } from '../models/PluginAutocompleteValueDTO';
import type { PluginCreate } from '../models/PluginCreate';
import type { PluginWithIdDto } from '../models/PluginWithIdDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PluginService {
    /**
     * Search Plugins
     * Retrieve a list of plugins for a specific step and name.
     *
     * Args:
     * step_id (int): The ID of the step for which plugins are to be retrieved.
     * name (str): The name used for plugin autocomplete search.
     * db (Session): The database session dependency.
     *
     * Returns:
     * list[PluginCreate]: A list of plugins matching the specified criteria.
     *
     * Raises:
     * HTTPException: If no plugins are found for the given parameters.
     * @param pluginId
     * @param query
     * @returns PluginAutocompleteValueDTO Successful Response
     * @throws ApiError
     */
    public static searchPluginsPluginsPluginIdSearchGet(
        pluginId: number,
        query: string,
    ): CancelablePromise<Array<PluginAutocompleteValueDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/plugins/{plugin_id}/search',
            path: {
                'plugin_id': pluginId,
            },
            query: {
                'query': query,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Plugins
     * Retrieve a list of plugins with pagination support.
     * @param stepId
     * @param pluginType
     * @param zone
     * @returns PluginWithIdDto Successful Response
     * @throws ApiError
     */
    public static readPluginsPluginsStepStepIdPluginTypeDisplayZoneGet(
        stepId: any,
        pluginType: any,
        zone: any,
    ): CancelablePromise<Array<PluginWithIdDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/plugins/step/{step_id}/{plugin_type}/display/{zone}',
            path: {
                'step_id': stepId,
                'plugin_type': pluginType,
                'zone': zone,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Plugin
     * Create a new plugin.
     *
     * Args:
     * plugin (PluginCreate): The plugin data to be created.
     *
     * Returns:
     * PluginCreate: The newly created plugin's details.
     * @param requestBody
     * @returns PluginCreate Successful Response
     * @throws ApiError
     */
    public static createPluginPluginPost(
        requestBody: PluginCreate,
    ): CancelablePromise<PluginCreate> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/plugin',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Plugin
     * Delete a plugin by ID.
     * @param pluginId
     * @returns PluginWithIdDto Successful Response
     * @throws ApiError
     */
    public static deletePluginPluginPluginIdDelete(
        pluginId: number,
    ): CancelablePromise<PluginWithIdDto> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/plugin/{plugin_id}',
            path: {
                'plugin_id': pluginId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Plugin
     * Get details of a single plugin by ID.
     * @param pluginId
     * @returns PluginWithIdDto Successful Response
     * @throws ApiError
     */
    public static readPluginPluginPluginIdGet(
        pluginId: number,
    ): CancelablePromise<PluginWithIdDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/plugin/{plugin_id}',
            path: {
                'plugin_id': pluginId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
