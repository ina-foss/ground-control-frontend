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
     * Read Task Comment
     * Retrieve a taskComment by its unique identifier key.
     *
     * Args:
     * task_comment_id (int): The unique identifier of the taskComment.
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
            url: '/task_comment/{task_comment_id}',
            path: {
                'task_comment_id': taskCommentId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Task Comments By Task Id
     * Retrieve a list of taskComments filtered on their `task_id` value.
     * @param taskCommentTaskId
     * @returns TaskCommentDto Successful Response
     * @throws ApiError
     */
    public static readTaskCommentsByTaskIdTaskCommentsTaskCommentTaskIdGet(
        taskCommentTaskId: number,
    ): CancelablePromise<Array<TaskCommentDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/taskComments/{task_comment_task_id}',
            path: {
                'task_comment_task_id': taskCommentTaskId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Task Comment
     * Create a new taskComment.
     *
     * Args:
     * task_comment (TaskCommentCreate): The taskComment data to be created.
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
                401: `Unauthorized`,
                403: `Forbidden`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Task Comment
     * Update an existing taskComment by its unique identifier.
     *
     * Args:
     * task_comment_id (int): The unique identifier of the taskComment to update.
     * task_comment (TaskCommentDto): The updated taskComment's value.
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
            query: {
                'task_comment_id': taskCommentId,
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
     * Delete Task Comment
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
            query: {
                'task_comment_id': taskCommentId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Task Comments
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
                401: `Unauthorized`,
                403: `Forbidden`,
                422: `Validation Error`,
            },
        });
    }
}
