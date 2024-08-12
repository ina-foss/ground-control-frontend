/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Enum representing the two types of relation between Task and Annotation
 *
 * Attributes
 * ----------
 * IN (str): The annotation is the initial data of task, can either come from an algorithm or an annotation form previous step.
 * OUT (str): The annotation is the result of the task, contains the user work.
 */
export enum InOutEnum {
    IN = 'in',
    OUT = 'out',
}
