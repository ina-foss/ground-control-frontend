/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TaskListDto } from './TaskListDto';
export type ProjectListDto = {
    title: (string | null);
    description: (string | null);
    created_by: number;
    tasks?: Array<TaskListDto>;
};

