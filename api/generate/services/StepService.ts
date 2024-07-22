/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StepCreate } from '../models/StepCreate';
import type { StepDto } from '../models/StepDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StepService {
    /**
     * Read Step
     * Retrieve a step by its unique identifier.
     *
     * Args:
     * step_id (int): The unique identifier of the step.
     *
     * Returns:
     * StepDto: The requested step's details.
     * Raises:
     * HTTPException: If the step is not found.
     * @param stepId
     * @returns StepDto Successful Response
     * @throws ApiError
     */
    public static readStepStepStepIdGet(
        stepId: number,
    ): CancelablePromise<StepDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/step/{step_id}',
            path: {
                'step_id': stepId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Data Step
     * Update an existing step by its unique identifier.
     *
     * Args:
     * step_id (int): The unique identifier of the step to update.
     * step (StepCreate): The updated step's value.
     *
     * Returns:
     * StepDto: The updated step's details.
     * Raises:
     * HTTPException: If the step is not found.
     * @param stepId
     * @param requestBody
     * @returns StepDto Successful Response
     * @throws ApiError
     */
    public static updateDataStepStepStepIdPatch(
        stepId: number,
        requestBody: StepCreate,
    ): CancelablePromise<StepDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/step/{step_id}',
            path: {
                'step_id': stepId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Step
     * @param stepId
     * @returns StepCreate Successful Response
     * @throws ApiError
     */
    public static deleteStepStepStepIdDelete(
        stepId: number,
    ): CancelablePromise<StepCreate> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/step/{step_id}',
            path: {
                'step_id': stepId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Step
     * Create a new step.
     *
     * Args:
     * step (StepCreate): The step data to be created.
     *
     * Returns:
     * StepCreate: The newly created step's details.
     * @param requestBody
     * @returns StepCreate Successful Response
     * @throws ApiError
     */
    public static createStepStepPost(
        requestBody: StepCreate,
    ): CancelablePromise<StepCreate> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/step/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Step
     * Retrieve a list of steps with pagination support.
     * @param skip
     * @param limit
     * @returns StepDto Successful Response
     * @throws ApiError
     */
    public static readStepStepsGet(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Array<StepDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/steps/',
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
