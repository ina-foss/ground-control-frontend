/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MediaType } from './MediaType';
import type { PlayerParameters } from './PlayerParameters';
import type { TaskBaseDto } from './TaskBaseDto';
/**
 * DTO representing a media object, including association with task and project.
 */
export type MediaDto = {
    url: string;
    type: MediaType;
    id: number;
    tasks: (Array<TaskBaseDto> | null);
    player_parameters?: (Record<string, any> | PlayerParameters | null);
    details?: (Record<string, any> | null);
};

