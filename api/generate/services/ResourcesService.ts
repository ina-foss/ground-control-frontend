/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ResourcesService {
    /**
     * Get Transcription
     * @param pluginName
     * @param format
     * @param clientId
     * @param channel
     * @param startDate
     * @param endDate
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getTranscriptionTranscriptionGet(
        pluginName: string = 'transcriptions',
        format: string = 'amalia-mot',
        clientId: string = 'transcriptions',
        channel: string = 'TF1',
        startDate: string = '2022-1-25 20:0:0',
        endDate: string = '2022-1-25 20:30:0',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/transcription',
            query: {
                'plugin_name': pluginName,
                'format': format,
                'client_id': clientId,
                'channel': channel,
                'start_date': startDate,
                'end_date': endDate,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
