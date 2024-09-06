/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnnotationDto } from './AnnotationDto';
import type { StepProjectDto } from './StepProjectDto';
import type { TaskCommentDto } from './TaskCommentDto';
import type { TaskDataType } from './TaskDataType';
import type { TaskStatus } from './TaskStatus';
/**
 * DTO for listing tasks, extending TaskCreateDto with additional
 * fields relevant for listing tasks.
 */
export type TaskListDto = {
    name: string;
    instruction?: (string | null);
    data: (Record<string, any> | null);
    data_type: TaskDataType;
    status: TaskStatus;
    lead_time: (number | null);
    step_id: number;
    media_id: number;
    id: number;
    created_at: (string | null);
    updated_at: (string | null);
    annotations?: Array<AnnotationDto>;
    taskComments?: Array<TaskCommentDto>;
    step: (StepProjectDto | null);
};

