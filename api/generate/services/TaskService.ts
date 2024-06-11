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
     * Retrieve a task by its unique identifier.
     *
     * Args:
     * task_id (int): The unique identifier of the task.
     *
     * Returns:
     * TaskListDto: The requested task's details.
     * Raises:
     * HTTPException: If the task is not found.
     * @param taskId
     * @returns TaskListDto Successful Response
     * @throws ApiError
     */
    public static readTaskTaskTaskIdGet(
        taskId: number,
    ): CancelablePromise<TaskListDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/task/{task_id}',
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
    /**
     * Update Data Task
     * Update an existing task by its unique identifier.
     *
     * Args:
     * task_id (int): The unique identifier of the task to update.
     * data (Dict[str, Any]): The updated task data.
     *
     * Returns:
     * TaskListDto: The updated task's details.
     * Raises:
     * HTTPException: If the task is not found.
     * @param taskId
     * @param requestBody
     * @returns TaskListDto Successful Response
     * @throws ApiError
     */
    public static updateDataTaskTaskTaskIdPatch(
        taskId: number,
        requestBody: Record<string, any>,
    ): CancelablePromise<TaskListDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/task/{task_id}',
            path: {
                'task_id': taskId,
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
     * Create Task
     * Create a new task.
     *
     * Args:
     * task (TaskCreateDto): The task data to be created.
     *
     * Returns:
     * TaskCreateDto: The newly created task's details.
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
                401: `Unauthorized`,
                403: `Forbidden`,
                422: `Validation Error`,
            },
        });
    }
}
