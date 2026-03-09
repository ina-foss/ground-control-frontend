/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { Status } from './Status';
/**
 * Base DTO for project objects.
 */
export type ProjectBaseDto = {
    title: (string | null);
    description: (string | null);
    status: (Status | null);
    is_published: (boolean | null);
    empty_annotations: (boolean | null);
    allow_skip: (boolean | null);
    control_weights: (number | null);
    pinned_at: (string | null);
    created_by: string;
};

