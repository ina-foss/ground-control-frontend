/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TagCreate } from '../models/TagCreate';
import type { TagDto } from '../models/TagDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TagService {
    /**
     * Read Tag
     * Retrieve a tag by its unique identifier key.
     *
     * Args:
     * key (str): The unique identifier of the tag.
     *
     * Returns:
     * TagDto: The requested tag's details.
     * Raises:
     * HTTPException: If the tag is not found.
     * @param tagKey
     * @returns TagDto Successful Response
     * @throws ApiError
     */
    public static readTagTagTagKeyGet(
        tagKey: string,
    ): CancelablePromise<TagDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tag/{tag_key}',
            path: {
                'tag_key': tagKey,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Tag
     * Update an existing tag by its unique identifier.
     *
     * Args:
     * tag_key (str): The unique identifier of the tag to update.
     * tag (TagDto): The updated tag's value.
     *
     * Returns:
     * TagDto: The updated tag's details.
     * Raises:
     * HTTPException: If the tag is not found.
     * @param tagKey
     * @param requestBody
     * @returns TagDto Successful Response
     * @throws ApiError
     */
    public static updateTagTagTagKeyPatch(
        tagKey: string,
        requestBody: TagDto,
    ): CancelablePromise<TagDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/tag/{tag_key}',
            path: {
                'tag_key': tagKey,
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
     * Delete Tag
     * @param tagKey
     * @returns TagCreate Successful Response
     * @throws ApiError
     */
    public static deleteTagTagTagKeyDelete(
        tagKey: string,
    ): CancelablePromise<TagCreate> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/tag/{tag_key}',
            path: {
                'tag_key': tagKey,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Tag
     * Create a new tag.
     *
     * Args:
     * tag (TagCreate): The tag data to be created.
     *
     * Returns:
     * TagCreate: The newly created tag's details.
     * @param requestBody
     * @returns TagCreate Successful Response
     * @throws ApiError
     */
    public static createTagTagPost(
        requestBody: TagCreate,
    ): CancelablePromise<TagCreate> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tag/',
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
     * Read Tags
     * Retrieve a list of tags with pagination support.
     * @param skip
     * @param limit
     * @returns TagDto Successful Response
     * @throws ApiError
     */
    public static readTagsTagsGet(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Array<TagDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tags/',
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
}
