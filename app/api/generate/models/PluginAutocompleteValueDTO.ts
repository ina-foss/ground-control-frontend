/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
 
/**
 * Data Transfer Object representing a plugin autocomplete value.
 *
 * Attributes:
 * id (Optional[str | int]): Internal identifier.
 * ext_id (Optional[str]): External identifier.
 * label (Optional[str]): Display label.
 * tag_label (Optional[str]): Alternative label used for tagging.
 * link (Optional[str]): External URL associated with the value.
 * image (Optional[str]): URL of the image displayed next to the option.
 * description (Optional[str]): Additional descriptive information.
 * categories (Optional[str]): Stringified JSON array of categories.
 * group (Optional[str]): Group name for visual grouping in UI.
 * editable (Optional[str]): Indicates if the value is editable.
 * copyable (Optional[str]): Indicates if the value is copyable.
 * tooltip (Optional[str]): Tooltip text displayed in UI.
 */
export type PluginAutocompleteValueDTO = {
    id?: (string | number | null);
    ext_id?: (string | null);
    label?: (string | null);
    tag_label?: (string | null);
    link?: (string | null);
    image?: (string | null);
    description?: (string | null);
    categories?: (string | null);
    group?: (string | null);
    editable?: (string | null);
    copyable?: (string | null);
    tooltip?: (string | null);
};

