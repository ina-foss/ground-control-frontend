/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MediaCreate } from './MediaCreate';
import type { Status } from './Status';
import type { StepDto } from './StepDto';
/**
 * Detailed DTO for project objects, including creation and update timestamps,
 * a list of tasks, and counts of users with annotations and total tasks.
 *
 * Used in `/dashboard` view
 */
export type ProjectDetailDto = {
    title: (string | null);
    description: (string | null);
    status: (Status | null);
    is_published: (boolean | null);
    empty_annotations: (boolean | null);
    allow_skip: (boolean | null);
    control_weights: (number | null);
    pinned_at: (string | null);
    created_by: string;
    id: number;
    created_at: (string | null);
    updated_at: (string | null);
    steps: Array<StepDto>;
    medias: Array<MediaCreate>;
};

