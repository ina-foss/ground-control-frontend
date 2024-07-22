/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TaskBaseDto } from '../models/TaskBaseDto';
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
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Task
     * Create a new task.
     *
     * Args:
     * task (TaskBaseDto): The task data to be created.
     *
     * Returns:
     * TaskBaseDto: The newly created task's details.
     * @param requestBody
     * @returns TaskBaseDto Successful Response
     * @throws ApiError
     */
    public static createTaskTaskPost(
        requestBody: TaskBaseDto,
    ): CancelablePromise<TaskBaseDto> {
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
