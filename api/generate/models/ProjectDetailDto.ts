/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TaskBaseDto } from './TaskBaseDto';
export type ProjectDetailDto = {
    title: (string | null);
    description: (string | null);
    created_by: number;
    id: number;
    created_at: (string | null);
    updated_at: (string | null);
    tasks?: Array<TaskBaseDto>;
    total_tasks: number;
};

