/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnnotationWithIdDto } from './AnnotationWithIdDto';
import type { TaskDataType } from './TaskDataType';
import type { TaskStatus } from './TaskStatus';
/**
 * Extends TaskBaseDto with an additional id field.
 */
export type TaskWithIdDto = {
    name: string;
    instruction?: (string | null);
    data_type: TaskDataType;
    status: TaskStatus;
    lead_time: (number | null);
    step_id: number;
    media_id: number;
    id: number;
    annotations: Array<AnnotationWithIdDto>;
};

