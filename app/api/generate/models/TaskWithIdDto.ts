/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { AnnotationWithIdDto } from './AnnotationWithIdDto';
import type { Status } from './Status';
import type { TaskDataType } from './TaskDataType';
/**
 * Extends TaskBaseDto with an additional id field.
 */
export type TaskWithIdDto = {
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
    annotations?: Array<AnnotationWithIdDto>;
};

