/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserBaseDto } from './UserBaseDto';
export type AnnotationDto = {
    id: number;
    userid: number;
    result: (Record<string, any> | null);
    created_at: (string | null);
    updated_at: (string | null);
    validated_at: (string | null);
    taskid: number;
    projectid: number;
    status: string;
    user: UserBaseDto;
};

