/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProjectDetailDto } from './ProjectDetailDto';
export type UserDto = {
    id: number;
    email: string;
    role: string;
    created_at: (string | null);
    projects?: Array<ProjectDetailDto>;
};

