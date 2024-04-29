/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnnotationDto } from './AnnotationDto';
import type { PredictionDto } from './PredictionDto';
export type TaskListDto = {
    id: number;
    created_at: (string | null);
    updated_at: (string | null);
    projectid: number;
    name: (string | null);
    instruction: (string | null);
    annotations?: Array<AnnotationDto>;
    predictions?: Array<PredictionDto>;
};

