/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * DTO representing a prediction object, including  association with a task and project.
 */
export type PredictionDto = {
    id: number;
    model_name: (string | null);
    model_version: (string | null);
    result: (Record<string, any> | null);
    score: (number | null);
    created_at: (string | null);
    updated_at: (string | null);
    task_id: number;
    project_id: number;
};

