/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Enum representing the different status of a task.
 *
 * Attributes:
 * DRAFT (str): The task is in draft status.
 * PENDING (str): The task is pending and awaiting further actions.
 * IN_PROGRESS (str): Currently being worked on.
 * SKIPPED (str): This task has been ignored.
 * DONE (str): Successfully completed.
 */
export enum TaskStatus {
    DRAFT = 'draft',
    PENDING = 'pending',
    IN_PROGRESS = 'in-progress',
    SKIPPED = 'skipped',
    DONE = 'done',
}
