/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnnotationType } from './AnnotationType';
import type { ProjectBaseDto } from './ProjectBaseDto';
import type { StepStatus } from './StepStatus';
import type { TaskWithIdDto } from './TaskWithIdDto';
/**
 * DTO representing the step object with its related tasks objects.
 *
 * Used in `/{project_id}` view
 */
export type StepDetailDto = {
    title: string;
    description: (string | null);
    annotation_type: AnnotationType;
    pinned_at: (string | null);
    status: StepStatus;
    project_id: number;
    id: number;
    created_at: (string | null);
    updated_at: (string | null);
    project: ProjectBaseDto;
    tasks: (Array<TaskWithIdDto> | null);
};

