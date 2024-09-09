/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TaskDataType } from './TaskDataType';
import type { TaskStatus } from './TaskStatus';
/**
 * Base DTO for task objects.
 */
export type TaskBaseDto = {
    name: string;
    instruction?: (string | null);
    data: (Record<string, any> | null);
    data_type: TaskDataType;
    status: TaskStatus;
    lead_time: (number | null);
    step_id: number;
    media_id: number;
};

