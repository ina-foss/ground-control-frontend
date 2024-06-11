/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TaskListDto } from './TaskListDto';
/**
 * DTO for listing projects, including a list of tasks.
 */
export type ProjectListDto = {
    title: (string | null);
    description: (string | null);
    created_by: number;
    id: number;
    tasks?: Array<TaskListDto>;
};

