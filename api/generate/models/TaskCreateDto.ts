/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TaskDataType } from './TaskDataType';
import type { TaskStatus } from './TaskStatus';
/**
 * DTO for creating new task instances.
 * Includes all fields from TaskBaseDto plus an optional
 * data field for additional task-specific data.
 */
export type TaskCreateDto = {
    name: string;
    instruction?: (string | null);
    project_id: number;
    data?: (Record<string, any> | null);
    data_type: TaskDataType;
    status: TaskStatus;
    lead_time: (number | null);
    step_id: number;
    media_id: number;
};

