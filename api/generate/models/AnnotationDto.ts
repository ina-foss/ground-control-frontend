/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserBaseDto } from './UserBaseDto';
export type AnnotationDto = {
    id: number;
    user_id: number;
    result: (Record<string, any> | null);
    created_at: (string | null);
    updated_at: (string | null);
    validated_at: (string | null);
    task_id: number;
    project_id: number;
    status: string;
    user: UserBaseDto;
};

