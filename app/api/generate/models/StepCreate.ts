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
    /**
     * Number of annotations per task
     */
    redundancy?: number;
    /**
     * Must be between 0 and 100
     */
    completeness_rate?: number;
    /**
     * Allow empty annotations
     */
    allow_empty_annotation?: boolean;
    /**
     * Must be at least 1
     */
    max_tasks_per_person?: number;
};

