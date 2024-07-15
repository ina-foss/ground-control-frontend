/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnnotationType } from './AnnotationType';
import type { StepStatus } from './StepStatus';
/**
 * DTO representing a step object, including association with task and project.
 */
export type StepDto = {
    title: string;
    description: (string | null);
    annotation_type: AnnotationType;
    pinned_at: (string | null);
    status: StepStatus;
    project_id: number;
    id: number;
    created_at: (string | null);
    updated_at: (string | null);
};

