/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnnotationType } from './AnnotationType';
import type { StepStatus } from './StepStatus';
/**
 * DTO to create a step object
 */
export type StepCreate = {
    title: string;
    description: (string | null);
    annotation_type: AnnotationType;
    pinned_at: (string | null);
    status: StepStatus;
    project_id: number;
};

