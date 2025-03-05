/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * Root
     * Root endpoint that returns a simple message.
     *
     * Returns:
     * dict: A dictionary with a greeting message.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static rootTestGet(): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/test',
        });
    }
    /**
     * Info
     * Health check endpoint that returns the status of the service.
     *
     * Returns:
     * dict: A dictionary indicating the service status.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static infoManagementHealthGet(): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/management/health',
        });
    }
    /**
     * Check Admin
     * @returns any Successful Response
     * @throws ApiError
     */
    public static checkAdminAdminGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin',
        });
    }
}
