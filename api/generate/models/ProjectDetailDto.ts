/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TaskBaseDto } from './TaskBaseDto';
/**
 * Detailed DTO for project objects, including creation and update timestamps,
 * a list of tasks, and counts of users with annotations and total tasks.
 */
export type ProjectDetailDto = {
    title: (string | null);
    description: (string | null);
    created_by: number;
    id: number;
    created_at: (string | null);
    updated_at: (string | null);
    tasks?: Array<TaskBaseDto>;
    total_users_with_annotations: number;
    total_tasks: number;
};

