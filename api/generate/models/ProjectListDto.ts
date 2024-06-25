/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnnotationType } from './AnnotationType';
import type { ProjectStatus } from './ProjectStatus';
import type { TaskListDto } from './TaskListDto';
/**
 * DTO for listing projects, including a list of tasks.
 */
export type ProjectListDto = {
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
    tasks?: Array<TaskListDto>;
};

