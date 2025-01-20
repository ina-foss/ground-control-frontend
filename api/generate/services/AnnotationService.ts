/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnnotationDto } from '../models/AnnotationDto';
import type { AnnotationFullCreate } from '../models/AnnotationFullCreate';
import type { InOutEnum } from '../models/InOutEnum';
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
     * AnnotationDTO: The newly created annotation
     * @param requestBody
     * @returns AnnotationDto Successful Response
     * @throws ApiError
     */
    public static createAnnotationAnnotationPost(
        requestBody: AnnotationFullCreate,
    ): CancelablePromise<AnnotationDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/annotation',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Annotations By Id
     * Retrieve a single annotation
     * @param annotationId
     * @returns AnnotationDto Successful Response
     * @throws ApiError
     */
    public static getAnnotationsByIdAnnotationIdGet(
        annotationId: number,
    ): CancelablePromise<AnnotationDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/annotation/{id}',
            query: {
                'annotation_id': annotationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Annotation Result
     * Edit the result of an existing annotation
     * @param annotationId
     * @param requestBody
     * @returns AnnotationDto Successful Response
     * @throws ApiError
     */
    public static updateAnnotationResultAnnotationIdPatch(
        annotationId: number,
        requestBody: Record<string, any>,
    ): CancelablePromise<AnnotationDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/annotation/{id}',
            query: {
                'annotation_id': annotationId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Annotation By Task Id
     * Get a list of annotations that match the task_id attributes
     * @param taskId
     * @param userEmail user_email
     * @param direction Direction of the annotation ('in' or 'out')
     * @returns AnnotationDto Successful Response
     * @throws ApiError
     */
    public static getAnnotationByTaskIdAnnotationsTaskIdGet(
        taskId: number,
        userEmail?: string,
        direction?: InOutEnum,
    ): CancelablePromise<Array<AnnotationDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/annotations/{task_id}',
            path: {
                'task_id': taskId,
            },
            query: {
                'user_email': userEmail,
                'direction': direction,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Finish Annotation
     * finish an annotation
     * @param annotationId
     * @param requestBody
     * @returns AnnotationDto Successful Response
     * @throws ApiError
     */
    public static finishAnnotationAnnotationFinishIdPatch(
        annotationId: number,
        requestBody: Record<string, any>,
    ): CancelablePromise<AnnotationDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/annotation/finish/{id}',
            query: {
                'annotation_id': annotationId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
