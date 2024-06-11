/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserBaseDto } from './UserBaseDto';
/**
 * DTO representing an annotation object, including association with task and project.
 */
export type AnnotationDto = {
    user_id: number;
    task_id: number;
    project_id: number;
    result: (Record<string, any> | null);
    status: string;
    id: number;
    created_at: (string | null);
    updated_at: (string | null);
    validated_at: (string | null);
    user?: UserBaseDto;
};

