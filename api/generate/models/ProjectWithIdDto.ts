/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnnotationType } from './AnnotationType';
import type { ProjectStatus } from './ProjectStatus';
/**
 * Extends ProjectBaseDto with an additional id field.
 */
export type ProjectWithIdDto = {
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
};

