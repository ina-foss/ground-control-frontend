/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
 
/**
 * Configuration data (DTO) for plugin integration.
 *
 * This class defines the core connection and behavior parameters needed by
 * a plugin to interact with its data source.
 *
 * Attributes:
 * type (PluginConfigType): Specifies whether the plugin performs a POST-based
 * search (e.g., ElasticSearch) or a GET-based search (e.g., Wikidata).
 * data_source (str): The endpoint or URL used to query data.
 * data_type (DataTypeEnum): The format of the expected data response.
 * Currently, only 'json' is supported.
 * token_url (str, optional): OAuth2 token endpoint URL, if authentication is required.
 * client_id (str, optional): Client ID for OAuth2 authentication.
 * client_secret (str, optional): Client secret for OAuth2 authentication.
 */
export type ConfigData = Record<string, any>;
