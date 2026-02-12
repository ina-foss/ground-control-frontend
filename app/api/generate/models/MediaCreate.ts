/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MediaType } from './MediaType';
import type { PlayerParameters } from './PlayerParameters';
/**
 * DTO to create a media object
 */
export type MediaCreate = {
    url: string;
    type: MediaType;
    player_parameters?: (Record<string, any> | PlayerParameters | null);
    details?: (Record<string, any> | null);
};

