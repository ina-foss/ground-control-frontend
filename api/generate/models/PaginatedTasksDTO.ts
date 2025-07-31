/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TaskListDto } from './TaskListDto';
/**
 * DTO for handling paginated task request results.
 * Contains a list of task requests and the total number of records available.
 */
export type PaginatedTasksDTO = {
    task_requests: Array<TaskListDto>;
    total_records: number;
};

