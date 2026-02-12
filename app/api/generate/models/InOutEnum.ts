/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Enum representing the two types of relation between Task and Annotation.
 *
 * Attributes
 * ----------
 * IN (str): The annotation is the initial data of the task,
 * which can either come from an algorithm or a previous annotation.
 * OUT (str): The annotation is the result of the task, containing the user's work.
 */
export enum InOutEnum {
    IN = 'in',
    OUT = 'out',
}
