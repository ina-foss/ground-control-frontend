/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TaskDetailDto } from '../models/TaskDetailDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TaskService {
    /**
     * Read Task
     * @param id
     * @returns TaskDetailDto Successful Response
     * @throws ApiError
     */
    public static readTaskTaskIdGet(
        id: number,
    ): CancelablePromise<TaskDetailDto> {
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
}
