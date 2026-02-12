/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HealthCheck } from '../models/HealthCheck';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ManagementService {
    /**
     * Perform a Health Check
     * ## Perform a Health Check
     * Endpoint to perform a healthcheck on. This endpoint can primarily be used Docker
     * to ensure a robust container orchestration and management is in place. Other
     * services which rely on proper functioning of the API service will not deploy if this
     * endpoint returns any other HTTP status code except 200 (OK).
     * Returns:
     * HealthCheck: Returns a JSON response with the health status
     * @returns HealthCheck Return HTTP Status Code 200 (OK)
     * @throws ApiError
     */
    public static getHealthManagementHealthGet(): CancelablePromise<HealthCheck> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/management/health',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * Metrics
     * ## Fetch OpenTelemetry Metrics
     * The `/management/metrics` endpoint exposes telemetry metrics that can be consumed
     * by Prometheus or other monitoring systems for observability purposes.
     *
     * Logs errors in case of unexpected issues while generating metrics.
     *
     * Returns:
     * PlainTextResponse: The Prometheus-compliant telemetry metrics in plain text format.
     * @returns any Prometheus metrics in plain text format.
     * @throws ApiError
     */
    public static getHealthMetricsManagementMetricsGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/management/metrics',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
}
