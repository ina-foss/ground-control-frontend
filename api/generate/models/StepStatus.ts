/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Enum representing the different status of a step.
 *
 * Attributes:
 * DRAFT (str): The step is in draft status.
 * PENDING (str): The step is pending and awaiting further actions.
 * IN_PROGRESS (str): Currently being worked on.
 * SKIPPED (str): This step has been ignored.
 * DONE (str): Successfully completed.
 */
export enum StepStatus {
    DRAFT = 'draft',
    PENDING = 'pending',
    IN_PROGRESS = 'in-progress',
    SKIPPED = 'skipped',
    DONE = 'done',
}
