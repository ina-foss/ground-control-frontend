/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnnotationDto } from './AnnotationDto';
import type { PredictionDto } from './PredictionDto';
import type { ProjectBaseDto } from './ProjectBaseDto';
export type TaskListDto = {
    name?: (string | null);
    instruction?: (string | null);
    project_id: number;
    data?: (Record<string, any> | null);
    id: number;
    project?: (ProjectBaseDto | null);
    created_at: (string | null);
    updated_at: (string | null);
    annotations?: Array<AnnotationDto>;
    predictions?: Array<PredictionDto>;
};

