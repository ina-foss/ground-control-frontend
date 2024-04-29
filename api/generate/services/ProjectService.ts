/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProjectBaseDto } from '../models/ProjectBaseDto';
import type { ProjectDetailDto } from '../models/ProjectDetailDto';
import type { ProjectListDto } from '../models/ProjectListDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProjectService {
    /**
     * Read Projects
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
            url: '/projects/',
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Project
     * @param requestBody
     * @returns ProjectDetailDto Successful Response
     * @throws ApiError
     */
    public static createProjectProjectPost(
        requestBody: ProjectBaseDto,
    ): CancelablePromise<ProjectDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/project/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Project
     * @param projectid
     * @returns ProjectListDto Successful Response
     * @throws ApiError
     */
    public static readProjectProjectProjectidGet(
        projectid: number,
    ): CancelablePromise<ProjectListDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/project/{projectid}',
            path: {
                'projectid': projectid,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Project
     * @param projectid
     * @param requestBody
     * @returns ProjectDetailDto Successful Response
     * @throws ApiError
     */
    public static updateProjectProjectProjectidPut(
        projectid: number,
        requestBody: ProjectBaseDto,
    ): CancelablePromise<ProjectDetailDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/project/{projectid}',
            path: {
                'projectid': projectid,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Project
     * @param projectid
     * @returns ProjectDetailDto Successful Response
     * @throws ApiError
     */
    public static deleteProjectProjectProjectidDelete(
        projectid: number,
    ): CancelablePromise<ProjectDetailDto> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/project/{projectid}',
            path: {
                'projectid': projectid,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
