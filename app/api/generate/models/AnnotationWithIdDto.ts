/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { Status } from './Status';
/**
 * DTO base infos + its ID
 */
export type AnnotationWithIdDto = {
    user_email: string;
    annotation_status: Status;
    version: number;
    id: number;
    created_at: (string | null);
    skipped_by: (string | null);
};

