/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Status } from './Status';
/**
 * Extends ProjectBaseDto with an additional id field.
 */
export type ProjectWithIdDto = {
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
};

