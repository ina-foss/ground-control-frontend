/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { Status } from './Status';
import type { TaskDataType } from './TaskDataType';
/**
 * Base DTO for task objects.
 */
export type TaskBaseDto = {
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
};

