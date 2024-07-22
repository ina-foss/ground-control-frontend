/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TaskBaseDto } from './TaskBaseDto';
/**
 * DTO representing a media object, including association with task and project.
 */
export type MediaDto = {
    url: string;
    id: number;
    tasks: (Array<TaskBaseDto> | null);
};

