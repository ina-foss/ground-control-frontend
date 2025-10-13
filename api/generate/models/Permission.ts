/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Represents permission actions as an enumeration for various resources and operations in the system.
 *
 * This class is used to structure and manage permissions related to different
 * resources, such as projects, annotations, media, plugins, steps, tags, tasks, users,
 * and task comments. Each permission is represented as a string value that combines
 * specific elements such as the system name, resource type, and corresponding action.
 *
 * :ivar CREATE_PROJECT: Permission string to create a project.
 * :type CREATE_PROJECT: str
 * :ivar READ_PROJECTS: Permission string to read all projects.
 * :type READ_PROJECTS: str
 * :ivar READ_PROJECT: Permission string to read a single project.
 * :type READ_PROJECT: str
 * :ivar DELETE_PROJECT: Permission string to delete a project.
 * :type DELETE_PROJECT: str
 * :ivar CREATE_ANNOTATION: Permission string to create an annotation.
 * :type CREATE_ANNOTATION: str
 * :ivar GET_ANNOTATIONS_BY_ID: Permission string to get annotations by ID.
 * :type GET_ANNOTATIONS_BY_ID: str
 * :ivar UPDATE_ANNOTATION_RESULT: Permission string to update an annotation result.
 * :type UPDATE_ANNOTATION_RESULT: str
 * :ivar FINISH_ANNOTATION: Permission string to finish an annotation.
 * :type FINISH_ANNOTATION: str
 * :ivar READ_MEDIA: Permission string to read media.
 * :type READ_MEDIA: str
 * :ivar CREATE_MEDIA: Permission string to create media.
 * :type CREATE_MEDIA: str
 * :ivar UPDATE_DATA_MEDIA: Permission string to update media data.
 * :type UPDATE_DATA_MEDIA: str
 * :ivar DELETE_MEDIA: Permission string to delete media.
 * :type DELETE_MEDIA: str
 * :ivar READ_MEDIAS: Permission string to read all media.
 * :type READ_MEDIAS: str
 * :ivar SEARCH_PLUGINS: Permission string to search plugins.
 * :type SEARCH_PLUGINS: str
 * :ivar READ_PLUGINS: Permission string to read all plugins.
 * :type READ_PLUGINS: str
 * :ivar CREATE_PLUGIN: Permission string to create a plugin.
 * :type CREATE_PLUGIN: str
 * :ivar DELETE_PLUGIN: Permission string to delete a plugin.
 * :type DELETE_PLUGIN: str
 * :ivar READ_PLUGIN: Permission string to read a single plugin.
 * :type READ_PLUGIN: str
 * :ivar GET_TRANSCRIPTION: Permission string to get a transcription.
 * :type GET_TRANSCRIPTION: str
 * :ivar READ_STEP: Permission string to read a step.
 * :type READ_STEP: str
 * :ivar CREATE_STEP: Permission string to create a step.
 * :type CREATE_STEP: str
 * :ivar UPDATE_DATA_STEP: Permission string to update step data.
 * :type UPDATE_DATA_STEP: str
 * :ivar DELETE_STEP: Permission string to delete a step.
 * :type DELETE_STEP: str
 * :ivar READ_STEPS: Permission string to read all steps.
 * :type READ_STEPS: str
 * :ivar READ_TAG: Permission string to read a tag.
 * :type READ_TAG: str
 * :ivar UPDATE_TAG: Permission string to update a tag.
 * :type UPDATE_TAG: str
 * :ivar DELETE_TAG: Permission string to delete a tag.
 * :type DELETE_TAG: str
 * :ivar READ_TAGS: Permission string to read all tags.
 * :type READ_TAGS: str
 * :ivar READ_TASK_COMMENT: Permission string to read a task comment.
 * :type READ_TASK_COMMENT: str
 * :ivar READ_TASK_COMMENTS_BY_TASK_ID: Permission string to read task comments by task ID.
 * :type READ_TASK_COMMENTS_BY_TASK_ID: str
 * :ivar CREATE_TASK_COMMENT: Permission string to create a task comment.
 * :type CREATE_TASK_COMMENT: str
 * :ivar UPDATE_TASK_COMMENT: Permission string to update a task comment.
 * :type UPDATE_TASK_COMMENT: str
 * :ivar DELETE_TASK_COMMENT: Permission string to delete a task comment.
 * :type DELETE_TASK_COMMENT: str
 * :ivar READ_TASK_COMMENTS: Permission string to read all task comments.
 * :type READ_TASK_COMMENTS: str
 * :ivar READ_TASK: Permission string to read a task.
 * :type READ_TASK: str
 * :ivar CREATE_TASK: Permission string to create a task.
 * :type CREATE_TASK: str
 * :ivar TASK_INJECT: Permission string to inject a task.
 * :type TASK_INJECT: str
 * :ivar UPDATE_DATA_TASK: Permission string to update task data.
 * :type UPDATE_DATA_TASK: str
 * :ivar DELETE_TASK: Permission string to delete a task.
 * :type DELETE_TASK: str
 * :ivar READ_USERS: Permission string to read all users.
 * :type READ_USERS: str
 * :ivar CREATE_USER: Permission string to create a user.
 * :type CREATE_USER: str
 * :ivar GET_USER_BY_EMAIL: Permission string to get a user by email.
 * :type GET_USER_BY_EMAIL: str
 */
export enum Permission {
    GROUND_CONTROL_PROJECT_CREATE = 'ground-control:project:create',
    GROUND_CONTROL_PROJECT_READ_ALL = 'ground-control:project:read_all',
    GROUND_CONTROL_PROJECT_READ = 'ground-control:project:read',
    GROUND_CONTROL_PROJECT_DELETE = 'ground-control:project:delete',
    GROUND_CONTROL_PROJECT_FINISH = 'ground-control:project:finish',
    GROUND_CONTROL_ANNOTATION_CREATE = 'ground-control:annotation:create',
    GROUND_CONTROL_ANNOTATION_GET_ANNOTATIONS_BY_ID = 'ground-control:annotation:get_annotations_by_id',
    GROUND_CONTROL_ANNOTATION_UPDATE_ANNOTATION_RESULT = 'ground-control:annotation:update_annotation_result',
    GROUND_CONTROL_ANNOTATION_FINISH_ANNOTATION = 'ground-control:annotation:finish_annotation',
    GROUND_CONTROL_MEDIA_READ = 'ground-control:media:read',
    GROUND_CONTROL_MEDIA_CREATE = 'ground-control:media:create',
    GROUND_CONTROL_MEDIA_UPDATE = 'ground-control:media:update',
    GROUND_CONTROL_MEDIA_DELETE = 'ground-control:media:delete',
    GROUND_CONTROL_MEDIA_READ_ALL = 'ground-control:media:read_all',
    GROUND_CONTROL_PLUGIN_SEARCH_PLUGINS = 'ground-control:plugin:search_plugins',
    GROUND_CONTROL_PLUGIN_READ_ALL = 'ground-control:plugin:read_all',
    GROUND_CONTROL_PLUGIN_CREATE = 'ground-control:plugin:create',
    GROUND_CONTROL_PLUGIN_DELETE = 'ground-control:plugin:delete',
    GROUND_CONTROL_PLUGIN_READ = 'ground-control:plugin:read',
    GROUND_CONTROL_RESOURCE_GET_TRANSCRIPTION = 'ground-control:resource:get_transcription',
    GROUND_CONTROL_STEP_READ = 'ground-control:step:read',
    GROUND_CONTROL_STEP_CREATE = 'ground-control:step:create',
    GROUND_CONTROL_STEP_UPDATE = 'ground-control:step:update',
    GROUND_CONTROL_STEP_DELETE = 'ground-control:step:delete',
    GROUND_CONTROL_STEP_READ_ALL = 'ground-control:step:read_all',
    GROUND_CONTROL_TAG_READ = 'ground-control:tag:read',
    GROUND_CONTROL_TAG_UPDATE = 'ground-control:tag:update',
    GROUND_CONTROL_TAG_DELETE = 'ground-control:tag:delete',
    GROUND_CONTROL_TAG_READ_ALL = 'ground-control:tag:read_all',
    GROUND_CONTROL_TASK_COMMENT_READ_TASK_COMMENT = 'ground-control:taskComment:read_task_comment',
    GROUND_CONTROL_TASK_COMMENT_READ_TASK_COMMENTS_BY_TASK_ID = 'ground-control:taskComment:read_task_comments_by_task_id',
    GROUND_CONTROL_TASK_COMMENT_CREATE_TASK_COMMENT = 'ground-control:taskComment:create_task_comment',
    GROUND_CONTROL_TASK_COMMENT_UPDATE_TASK_COMMENT = 'ground-control:taskComment:update_task_comment',
    GROUND_CONTROL_TASK_COMMENT_DELETE_TASK_COMMENT = 'ground-control:taskComment:delete_task_comment',
    GROUND_CONTROL_TASK_COMMENT_READ_TASK_COMMENTS = 'ground-control:taskComment:read_task_comments',
    GROUND_CONTROL_TASK_READ = 'ground-control:task:read',
    GROUND_CONTROL_TASK_CREATE = 'ground-control:task:create',
    GROUND_CONTROL_TASK_TASK_INJECT = 'ground-control:task:task_inject',
    GROUND_CONTROL_TASK_UPDATE = 'ground-control:task:update',
    GROUND_CONTROL_TASK_DELETE = 'ground-control:task:delete',
    GROUND_CONTROL_TASK_ACTIVATE = 'ground-control:task:activate',
    GROUND_CONTROL_TASK_UPDATE_EXPIRATION_DATE = 'ground-control:task:update_expiration_date',
    GROUND_CONTROL_USER_READ_ALL = 'ground-control:user:read_all',
    GROUND_CONTROL_USER_CREATE = 'ground-control:user:create',
    GROUND_CONTROL_USER_GET_USER_BY_EMAIL = 'ground-control:user:get_user_by_email',
}
