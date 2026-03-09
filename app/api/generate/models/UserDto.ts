/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { AnnotationCreate } from './AnnotationCreate';
import type { ProjectDetailDto } from './ProjectDetailDto';
/**
 * DTO representing a user object, extending UserBaseDto with associated projects.
 */
export type UserDto = {
    email: string;
    role: string;
    projects?: Array<ProjectDetailDto>;
    annotations?: Array<AnnotationCreate>;
    created_at: (string | null);
};

