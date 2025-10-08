/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProjectBaseDto } from '../models/ProjectBaseDto';
import type { ProjectDetailDto } from '../models/ProjectDetailDto';
import type { ProjectListDto } from '../models/ProjectListDto';
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
     * @returns ProjectDetailDto Successful Response
     * @throws ApiError
     */
    public static readProjectsProjectsGet(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Array<ProjectDetailDto>> {
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
     * Read Project
     * Get details of a single project by ID with prioritized tasks per step.
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
}
