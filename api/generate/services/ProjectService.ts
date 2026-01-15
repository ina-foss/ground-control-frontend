/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProjectBaseDto } from '../models/ProjectBaseDto';
import type { ProjectDetailDto } from '../models/ProjectDetailDto';
import type { ProjectListDto } from '../models/ProjectListDto';
import type { ProjectListDtoSummary } from '../models/ProjectListDtoSummary';
import type { ProjectParametersResponse } from '../models/ProjectParametersResponse';
import type { ProjectWithIdDto } from '../models/ProjectWithIdDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProjectService {
    /**
     * Read Projects
     * Retrieve a list of projects with pagination support.
     * @param skip
     * @param limit
     * @returns ProjectListDto Successful Response
     * @throws ApiError
     */
    public static readProjectsProjectsGet(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Array<ProjectListDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/projects',
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
    /**
     * Read Projects Summary
     * Retrieve a list of projects with pagination support.
     * @param skip
     * @param limit
     * @returns ProjectListDtoSummary Successful Response
     * @throws ApiError
     */
    public static readProjectsSummaryProjectsSummaryGet(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Array<ProjectListDtoSummary>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/projects/summary',
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
    /**
     * Create Project
     * Create a new project.
     * @param requestBody
     * @returns ProjectDetailDto Successful Response
     * @throws ApiError
     */
    public static createProjectProjectPost(
        requestBody: ProjectBaseDto,
    ): CancelablePromise<ProjectDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/project',
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
     * Read Project Basic
     * Get a project without user-based filtering.
     * @param projectId
     * @returns ProjectListDto Successful Response
     * @throws ApiError
     */
    public static readProjectBasicProjectProjectIdBasicGet(
        projectId: number,
    ): CancelablePromise<ProjectListDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/project/{project_id}/basic',
            path: {
                'project_id': projectId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Project
     * Get a project filtered according to the user's role.
     * @param projectId
     * @returns ProjectListDto Successful Response
     * @throws ApiError
     */
    public static readProjectProjectProjectIdGet(
        projectId: number,
    ): CancelablePromise<ProjectListDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/project/{project_id}',
            path: {
                'project_id': projectId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Project
     * Update an existing project by ID.
     * @param projectId
     * @param requestBody
     * @returns ProjectWithIdDto Successful Response
     * @throws ApiError
     */
    public static updateProjectProjectProjectIdPut(
        projectId: number,
        requestBody: ProjectBaseDto,
    ): CancelablePromise<ProjectWithIdDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/project/{project_id}',
            path: {
                'project_id': projectId,
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
     * Delete Project
     * Delete a project by ID.
     * @param projectId
     * @returns ProjectWithIdDto Successful Response
     * @throws ApiError
     */
    public static deleteProjectProjectProjectIdDelete(
        projectId: number,
    ): CancelablePromise<ProjectWithIdDto> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/project/{project_id}',
            path: {
                'project_id': projectId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Project Parameters
     * @param projectId
     * @returns ProjectParametersResponse Successful Response
     * @throws ApiError
     */
    public static readProjectParametersProjectIdParametersGet(
        projectId: number,
    ): CancelablePromise<ProjectParametersResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/{project_id}/parameters',
            path: {
                'project_id': projectId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Finish Project
     * @param projectId
     * @returns ProjectWithIdDto Successful Response
     * @throws ApiError
     */
    public static finishProjectProjectIdFinishPost(
        projectId: number,
    ): CancelablePromise<ProjectWithIdDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/{project_id}/finish',
            path: {
                'project_id': projectId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Progressed Tasks Count For Project
     * @param projectId
     * @returns number Successful Response
     * @throws ApiError
     */
    public static getProgressedTasksCountForProjectProjectIdProgressedTasksCountPost(
        projectId: number,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/{project_id}/progressed_tasks/count',
            path: {
                'project_id': projectId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Archive Project
     * @param projectId
     * @returns ProjectWithIdDto Successful Response
     * @throws ApiError
     */
    public static archiveProjectProjectIdArchivePost(
        projectId: number,
    ): CancelablePromise<ProjectWithIdDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/{project_id}/archive',
            path: {
                'project_id': projectId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Unarchive Project
     * @param projectId
     * @returns ProjectWithIdDto Successful Response
     * @throws ApiError
     */
    public static unarchiveProjectProjectIdUnarchivePost(
        projectId: number,
    ): CancelablePromise<ProjectWithIdDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/{project_id}/unarchive',
            path: {
                'project_id': projectId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                422: `Validation Error`,
            },
        });
    }
}
