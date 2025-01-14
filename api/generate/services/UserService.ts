/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserBaseDto } from '../models/UserBaseDto';
import type { UserDto } from '../models/UserDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserService {
    /**
     * Read Users
     * Retrieve a list of users with pagination support.
     *
     * Args:
     * skip (int): Number of users to skip.
     * limit (int): Maximum number of users to retrieve.
     *
     * Returns:
     * List[UserDto]: A paginated list of user DTOs.
     * @param skip
     * @param limit
     * @returns UserDto Successful Response
     * @throws ApiError
     */
    public static readUsersUsersGet(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Array<UserDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users',
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
     * Create User
     * Create a new User object in database
     * @param requestBody
     * @returns UserDto Successful Response
     * @throws ApiError
     */
    public static createUserUserPost(
        requestBody: UserBaseDto,
    ): CancelablePromise<UserDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get User By Email
     * @param email
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getUserByEmailUserGet(
        email: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/',
            query: {
                'email': email,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
