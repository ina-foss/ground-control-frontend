/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_task_inject_step__step_id__post } from '../models/Body_task_inject_step__step_id__post';
import type { Status } from '../models/Status';
import type { TaskBaseDto } from '../models/TaskBaseDto';
import type { TaskListDto } from '../models/TaskListDto';
import type { TaskWithIdDto } from '../models/TaskWithIdDto';
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
     * Delete Task
     * Delete a task by ID.
     *
     * Args:
     * task_id (int): The unique identifier of the task to delete
     *
     * Returns:
     * TaskWithIdDto: The deleted task
     * @param taskId
     * @returns TaskWithIdDto Successful Response
     * @throws ApiError
     */
    public static deleteTaskTaskTaskIdDelete(
        taskId: number,
    ): CancelablePromise<TaskWithIdDto> {
        return __request(OpenAPI, {
            method: 'DELETE',
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
     * Create Task
     * Create a new task.
     *
     * Args:
     * task (TaskBaseDto): The task data to be created.
     *
     * Returns:
     * TaskBaseDto: The newly created task's details.
     * @param requestBody
     * @returns TaskWithIdDto Successful Response
     * @throws ApiError
     */
    public static createTaskTaskPost(
        requestBody: TaskBaseDto,
    ): CancelablePromise<TaskWithIdDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/task',
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
     * Task Inject
     * Create a media, a task, and an annotation in one atomic transaction.
     *
     * Parameters overwritten:
     * - `task.media_id`
     * - `annotation.association.task_id`
     * - `annotation.association.annotation_id`
     * - `activate`: optional flag to activate the task (default: False)
     * @param stepId
     * @param requestBody
     * @param activate Whether to activate the task
     * @returns TaskWithIdDto Successful Response
     * @throws ApiError
     */
    public static taskInjectStepStepIdPost(
        stepId: number,
        requestBody: Body_task_inject_step__step_id__post,
        activate: boolean = false,
    ): CancelablePromise<TaskWithIdDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/step/{step_id}',
            path: {
                'step_id': stepId,
            },
            query: {
                'activate': activate,
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
     * Update Task Status
     * @param taskId
     * @param status
     * @returns TaskListDto Successful Response
     * @throws ApiError
     */
    public static updateTaskStatusTaskTaskIdStatusPost(
        taskId: number,
        status: Status,
    ): CancelablePromise<TaskListDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/task/{task_id}/status',
            path: {
                'task_id': taskId,
            },
            query: {
                'status': status,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Tasks Status
     * update tasks status list of tasks.
     * @param status
     * @param requestBody
     * @returns number Successful Response
     * @throws ApiError
     */
    public static updateTasksStatusTasksStatusPost(
        status: TaskStatus,
        requestBody: Array<number>,
    ): CancelablePromise<Array<number>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tasks/status',
            query: {
                'status': status,
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
}
