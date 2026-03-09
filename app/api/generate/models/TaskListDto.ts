/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { AnnotationWithIdDto } from './AnnotationWithIdDto';
import type { MediaDto } from './MediaDto';
import type { Status } from './Status';
import type { StepProjectDto } from './StepProjectDto';
import type { TaskCommentDto } from './TaskCommentDto';
import type { TaskDataType } from './TaskDataType';
/**
 * DTO for listing tasks, extending TaskCreateDto with additional
 * fields relevant for listing tasks.
 */
export type TaskListDto = {
    name: string;
    instruction?: (string | null);
    data_type: TaskDataType;
    status: Status;
    previous_status?: (Status | null);
    lead_time: (number | null);
    step_id: number;
    media_id: number;
    documentation?: (string | null);
    expiration_date?: (string | null);
    redundancy?: number;
    priority?: number;
    id: number;
    created_at: (string | null);
    updated_at: (string | null);
    task_comments?: Array<TaskCommentDto>;
    step: (StepProjectDto | null);
    media: (MediaDto | null);
    annotations: Array<AnnotationWithIdDto>;
};

