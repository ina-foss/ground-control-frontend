/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnnotationCreate } from '../models/AnnotationCreate';
import type { AnnotationDto } from '../models/AnnotationDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AnnotationService {
    /**
     * Create Annotation
     * Create a new annotation.
     *
     * Args:
     * annotation (AnnotationCreate): The annotation data
     *
     * Returns:
     * AnnotationDTO : The newly created annotation
     * @param requestBody
     * @returns AnnotationDto Successful Response
     * @throws ApiError
     */
    public static createAnnotationAnnotationPost(
        requestBody: AnnotationCreate,
    ): CancelablePromise<AnnotationDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/annotation/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Annotation By Task Id
     * Get a list of annotations that match the task_id attributes
     * @param taskId
     * @returns AnnotationDto Successful Response
     * @throws ApiError
     */
    public static getAnnotationByTaskIdAnnotationTaskIdGet(
        taskId: number,
    ): CancelablePromise<AnnotationDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/annotation/{task_id}',
            path: {
                'task_id': taskId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                422: `Validation Error`,
            },
        });
    }
}
