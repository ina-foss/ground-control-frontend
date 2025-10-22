/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnnotationStatus } from './AnnotationStatus';
/**
 * DTO to create an annotation object
 */
export type AnnotationCreate = {
    user_email: string;
    annotation_status: AnnotationStatus;
    version: number;
    result: (Record<string, any> | null);
};

