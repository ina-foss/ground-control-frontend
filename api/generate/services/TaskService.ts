/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TaskCreateDto } from '../models/TaskCreateDto';
import type { TaskListDto } from '../models/TaskListDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TaskService {
    /**
     * Read Task
     * @param id
     * @returns TaskListDto Successful Response
     * @throws ApiError
     */
    public static readTaskTaskIdGet(
        id: number,
    ): CancelablePromise<TaskListDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/task/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Data Task
     * @param id
     * @param requestBody
     * @returns TaskListDto Successful Response
     * @throws ApiError
     */
    public static updateDataTaskTaskIdPatch(
        id: number,
        requestBody: Record<string, any>,
    ): CancelablePromise<TaskListDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/task/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Task
     * @param requestBody
     * @returns TaskCreateDto Successful Response
     * @throws ApiError
     */
    public static createTaskTaskPost(
        requestBody: TaskCreateDto,
    ): CancelablePromise<TaskCreateDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/task/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
