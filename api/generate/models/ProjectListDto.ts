/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MediaCreate } from './MediaCreate';
import type { ProjectStatus } from './ProjectStatus';
import type { StepDetailDto } from './StepDetailDto';
/**
 * DTO for listing projects, including a list of tasks.
 *
 * Used in `/{project_id}` view
 */
export type ProjectListDto = {
    title: (string | null);
    description: (string | null);
    status: (ProjectStatus | null);
    is_published: (boolean | null);
    empty_annotations: (boolean | null);
    allow_skip: (boolean | null);
    control_weights: (number | null);
    pinned_at: (string | null);
    created_by: string;
    id: number;
    created_at: (string | null);
    updated_at: (string | null);
    steps: Array<StepDetailDto>;
    medias: Array<MediaCreate>;
};

