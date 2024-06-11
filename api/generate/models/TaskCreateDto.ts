/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * DTO for creating new task instances.
 * Includes all fields from TaskBaseDto plus an optional
 * data field for additional task-specific data.
 */
export type TaskCreateDto = {
    name?: (string | null);
    instruction?: (string | null);
    project_id: number;
    data?: (Record<string, any> | null);
};

