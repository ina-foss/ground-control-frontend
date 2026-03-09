/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { Status } from './Status';
export type ProjectListDtoSummary = {
    id: number;
    created_by: string;
    title: string;
    description: (string | null);
    steps_count: number;
    status: (Status | null);
    created_at?: (string | null);
    tasks_id_to_annotate?: (Array<number> | null);
};

