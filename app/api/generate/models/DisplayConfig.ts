/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * DTO for plugin display configuration.
 *
 * Attributes:
 * multiple_values (Optional[bool]): Whether multiple values can be selected.
 * max_items (int): Maximum number of items to display.
 * order (int): The display order of the plugin.
 */
export type DisplayConfig = {
    multiple_values?: (boolean | null);
    max_items?: (number | null);
    order?: (number | null);
    main_plugin?: (boolean | null);
    label?: (string | null);
};

