/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnnotationDto } from '../models/AnnotationDto';
import type { AnnotationFullCreate } from '../models/AnnotationFullCreate';
import type { InOutEnum } from '../models/InOutEnum';
import type { Status } from '../models/Status';
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
                401: `Unauthorized`,
                403: `Forbidden`,
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
    public static getAnnotationsByIdAnnotationAnnotationIdGet(
        annotationId: number,
    ): CancelablePromise<AnnotationDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/annotation/{annotation_id}',
            path: {
                'annotation_id': annotationId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
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
    public static updateAnnotationResultAnnotationAnnotationIdPatch(
        annotationId: number,
        requestBody: Record<string, any>,
    ): CancelablePromise<AnnotationDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/annotation/{annotation_id}',
            path: {
                'annotation_id': annotationId,
            },
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
     * - Admins can retrieve annotations for **any user**.
     * - Regular users can only retrieve **their own** annotations.
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
                401: `Unauthorized`,
                403: `Forbidden`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Skip Annotation
     * skip an annotation
     * @param annotationId
     * @returns AnnotationDto Successful Response
     * @throws ApiError
     */
    public static skipAnnotationAnnotationSkipAnnotationIdPatch(
        annotationId: number,
    ): CancelablePromise<AnnotationDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/annotation/skip/{annotation_id}',
            path: {
                'annotation_id': annotationId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
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
    public static finishAnnotationAnnotationFinishAnnotationIdPatch(
        annotationId: number,
        requestBody: Record<string, any>,
    ): CancelablePromise<AnnotationDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/annotation/finish/{annotation_id}',
            path: {
                'annotation_id': annotationId,
            },
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
     * Get All Annotations
     * Get a list of annotations that match the search params
     * @param userEmail user_email
     * @param status annotation_status
     * @param projectId project id
     * @param stepId step id
     * @param startCreatedAt start create date
     * @param endCreatedAt end create date
     * @param startUpdatedAt start update date
     * @param endUpdatedAt end update date
     * @param startValidatedAt start validation date
     * @param endValidatedAt end validation date
     * @param skip
     * @param limit
     * @returns AnnotationDto Successful Response
     * @throws ApiError
     */
    public static getAllAnnotationsAnnotationsGet(
        userEmail?: string,
        status?: Status,
        projectId?: number,
        stepId?: number,
        startCreatedAt?: string,
        endCreatedAt?: string,
        startUpdatedAt?: string,
        endUpdatedAt?: string,
        startValidatedAt?: string,
        endValidatedAt?: string,
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Array<AnnotationDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/annotations',
            query: {
                'user_email': userEmail,
                'status': status,
                'project_id': projectId,
                'step_id': stepId,
                'start_created_at': startCreatedAt,
                'end_created_at': endCreatedAt,
                'start_updated_at': startUpdatedAt,
                'end_updated_at': endUpdatedAt,
                'start_validated_at': startValidatedAt,
                'end_validated_at': endValidatedAt,
                'skip': skip,
                'limit': limit,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                422: `Validation Error`,
            },
        });
    }
}
