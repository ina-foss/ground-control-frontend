/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { InOutEnum } from './InOutEnum';
/**
 * Schema for creating an AnnotationTask, representing the relationship
 * between an annotation and a task.
 *
 * Attributes:
 * -----------
 * annotation_id (int): Identifier of the annotation object.
 * task_id (int): Identifier of the task object.
 * direction (InOutEnum): Describes whether the annotation is input or output.
 */
export type AnnotationTaskCreate = {
    annotation_id: number;
    task_id: number;
    direction: InOutEnum;
};

