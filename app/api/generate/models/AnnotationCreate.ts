/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Status } from './Status';
/**
 * DTO to create an annotation object
 */
export type AnnotationCreate = {
    user_email: string;
    annotation_status: Status;
    version: number;
    result: (Record<string, any> | null);
};

