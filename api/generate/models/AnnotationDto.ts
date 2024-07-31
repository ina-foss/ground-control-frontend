/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnnotationStatus } from './AnnotationStatus';
/**
 * DTO representing an annotation object, including association with task and project.
 */
export type AnnotationDto = {
    user_email: string;
    task_id: number;
    annotation_status: AnnotationStatus;
    version: number;
    result: (Record<string, any> | null);
    id: number;
    created_at: (string | null);
    updated_at: (string | null);
    validated_at: (string | null);
};

