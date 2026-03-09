/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { MediaCreate } from './MediaCreate';
import type { Status } from './Status';
import type { StepDetailDto } from './StepDetailDto';
import type { TaskWithIdDto } from './TaskWithIdDto';
/**
 * DTO for listing projects, including a list of tasks.
 *
 * Used in `/{project_id}` view
 */
export type ProjectListDto = {
    title: (string | null);
    description: (string | null);
    status: (Status | null);
    is_published: (boolean | null);
    empty_annotations: (boolean | null);
    allow_skip: (boolean | null);
    control_weights: (number | null);
    pinned_at: (string | null);
    created_by: string;
    id: number;
    created_at: (string | null);
    updated_at: (string | null);
    medias: Array<MediaCreate>;
    steps?: (Array<StepDetailDto> | null);
    tasks_to_annotate?: (Array<TaskWithIdDto> | null);
};

