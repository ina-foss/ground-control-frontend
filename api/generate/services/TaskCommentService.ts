/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TaskCommentCreate } from '../models/TaskCommentCreate';
import type { TaskCommentDto } from '../models/TaskCommentDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TaskCommentService {
    /**
     * Read Taskcomment
     * Retrieve a taskComment by its unique identifier key.
     *
     * Args:
     * taskComment_id (int): The unique identifier of the taskComment.
     *
     * Returns:
     * TaskCommentDto: The requested taskComment's details.
     * Raises:
     * HTTPException: If the taskComment is not found.
     * @param taskCommentId
     * @returns TaskCommentDto Successful Response
     * @throws ApiError
     */
    public static readTaskCommentTaskCommentTaskCommentIdGet(
        taskCommentId: number,
    ): CancelablePromise<TaskCommentDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/taskComment/{taskComment_id}',
            path: {
                'taskComment_id': taskCommentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Taskcomment
     * Update an existing taskComment by its unique identifier.
     *
     * Args:
     * taskComment_id (int): The unique identifier of the taskComment to update.
     * taskComment (TaskCommentDto): The updated taskComment's value.
     *
     * Returns:
     * TaskCommentDto: The updated taskComment's details.
     * Raises:
     * HTTPException: If the taskComment is not found.
     * @param taskCommentId
     * @param requestBody
     * @returns TaskCommentDto Successful Response
     * @throws ApiError
     */
    public static updateTaskCommentTaskCommentTaskCommentIdPatch(
        taskCommentId: number,
        requestBody: TaskCommentDto,
    ): CancelablePromise<TaskCommentDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/taskComment/{taskComment_id}',
            path: {
                'taskComment_id': taskCommentId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Taskcomment
     * @param taskCommentId
     * @returns TaskCommentCreate Successful Response
     * @throws ApiError
     */
    public static deleteTaskCommentTaskCommentTaskCommentIdDelete(
        taskCommentId: number,
    ): CancelablePromise<TaskCommentCreate> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/taskComment/{taskComment_id}',
            path: {
                'taskComment_id': taskCommentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Taskcomment
     * Create a new taskComment.
     *
     * Args:
     * taskComment (TaskCommentCreate): The taskComment data to be created.
     *
     * Returns:
     * TaskCommentCreate: The newly created taskComment's details.
     * @param requestBody
     * @returns TaskCommentCreate Successful Response
     * @throws ApiError
     */
    public static createTaskCommentTaskCommentPost(
        requestBody: TaskCommentCreate,
    ): CancelablePromise<TaskCommentCreate> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/taskComment/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Taskcomments
     * Retrieve a list of taskComments with pagination support.
     * @param skip
     * @param limit
     * @returns TaskCommentDto Successful Response
     * @throws ApiError
     */
    public static readTaskCommentsTaskCommentsGet(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Array<TaskCommentDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/taskComments/',
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
