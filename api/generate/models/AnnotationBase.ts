/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnnotationStatus } from './AnnotationStatus';
/**
 * DTO containing all basic informations about Task except result
 */
export type AnnotationBase = {
    user_email: string;
    task_id: number;
    annotation_status: AnnotationStatus;
    version: number;
};

