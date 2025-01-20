/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MediaCreate } from '../models/MediaCreate';
import type { MediaDto } from '../models/MediaDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MediaService {
    /**
     * Read Media
     * Retrieve a media by its unique identifier.
     *
     * Args:
     * media_id (int): The unique identifier of the media.
     *
     * Returns:
     * MediaDto: The requested media's details.
     * Raises:
     * HTTPException: If the media is not found.
     * @param mediaId
     * @returns MediaDto Successful Response
     * @throws ApiError
     */
    public static readMediaMediaMediaIdGet(
        mediaId: number,
    ): CancelablePromise<MediaDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/media/{media_id}',
            path: {
                'media_id': mediaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Data Media
     * Update an existing media by its unique identifier.
     *
     * Args:
     * media_id (int): The unique identifier of the media to update.
     * data (MediaDto): The updated media data.
     * s
     * Returns:
     * MediaDto: The updated media's details.
     * Raises:
     * HTTPException: If the media is not found.
     * @param mediaId
     * @param requestBody
     * @returns MediaDto Successful Response
     * @throws ApiError
     */
    public static updateDataMediaMediaMediaIdPatch(
        mediaId: number,
        requestBody: MediaCreate,
    ): CancelablePromise<MediaDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/media/{media_id}',
            path: {
                'media_id': mediaId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Media
     * @param mediaId
     * @returns MediaCreate Successful Response
     * @throws ApiError
     */
    public static deleteMediaMediaMediaIdDelete(
        mediaId: number,
    ): CancelablePromise<MediaCreate> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/media/{media_id}',
            path: {
                'media_id': mediaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Media
     * Create a new media.
     *
     * Args:
     * media (MediaCreate): The media data to be created.
     *
     * Returns:
     * MediaCreate: The newly created media's details.
     * @param requestBody
     * @returns MediaDto Successful Response
     * @throws ApiError
     */
    public static createMediaMediaPost(
        requestBody: MediaCreate,
    ): CancelablePromise<MediaDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/media',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Medias
     * Retrieve a list of medias with pagination support.
     * @param skip
     * @param limit
     * @returns MediaDto Successful Response
     * @throws ApiError
     */
    public static readMediasMediasGet(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Array<MediaDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/medias',
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
