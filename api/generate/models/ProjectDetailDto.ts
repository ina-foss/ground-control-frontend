/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnnotationType } from './AnnotationType';
import type { ProjectStatus } from './ProjectStatus';
import type { TaskBaseDto } from './TaskBaseDto';
/**
 * Detailed DTO for project objects, including creation and update timestamps,
 * a list of tasks, and counts of users with annotations and total tasks.
 */
export type ProjectDetailDto = {
    title: (string | null);
    description: (string | null);
    status: (ProjectStatus | null);
    annotation_type: (AnnotationType | null);
    is_published: (boolean | null);
    empty_annotations: (boolean | null);
    allow_skip: (boolean | null);
    control_weights: (number | null);
    pinned_at: (string | null);
    created_by: string;
    id: number;
    created_at: (string | null);
    updated_at: (string | null);
    tasks?: Array<TaskBaseDto>;
    total_users_with_annotations: number;
    total_tasks: number;
};

