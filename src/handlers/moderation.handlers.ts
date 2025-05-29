import { TwitterClient } from '../client/twitter.js';
import { 
    HandlerResponse, 
    TwitterHandler,
    BlockUserArgs,
    UnblockUserArgs,
    GetBlockedUsersArgs,
    MuteUserArgs,
    UnmuteUserArgs,
    GetMutedUsersArgs
} from '../types/handlers.js';
import { createResponse } from '../utils/response.js';

/**
 * Block a user account to prevent them from following you or viewing your tweets
 */
export const handleBlockUser: TwitterHandler<BlockUserArgs> = async (
    client: TwitterClient,
    { userId, username }: BlockUserArgs
): Promise<HandlerResponse> => {
    try {
        if (!userId && !username) {
            throw new Error('Either userId or username must be provided');
        }

        let targetUserId = userId;

        // If username provided, get the user ID first
        if (username && !userId) {
            const userResponse = await client.v2.userByUsername(username);
            if (!userResponse.data) {
                throw new Error(`User with username '${username}' not found`);
            }
            targetUserId = userResponse.data.id;
        }

        // Get authenticated user's ID
        const me = await client.v2.me();
        const myUserId = me.data.id;

        // Block the user
        const result = await client.v2.block(myUserId, targetUserId!);

        return createResponse(`Successfully blocked user ${username || targetUserId}. Response: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('403')) {
                throw new Error(`Failed to block user: Insufficient permissions. Blocking requires OAuth 2.0 authentication with block.write scope.`);
            } else if (error.message.includes('404')) {
                throw new Error(`Failed to block user: User ${username || userId} not found.`);
            } else if (error.message.includes('422')) {
                throw new Error(`Failed to block user: User ${username || userId} may already be blocked or cannot be blocked.`);
            } else if (error.message.includes('429')) {
                throw new Error(`Failed to block user: Rate limit exceeded. Block endpoints allow 50 requests per 15 minutes.`);
            }
            throw new Error(`Failed to block user: ${error.message}`);
        }
        throw error;
    }
};

/**
 * Unblock a previously blocked user account
 */
export const handleUnblockUser: TwitterHandler<UnblockUserArgs> = async (
    client: TwitterClient,
    { userId, username }: UnblockUserArgs
): Promise<HandlerResponse> => {
    try {
        if (!userId && !username) {
            throw new Error('Either userId or username must be provided');
        }

        let targetUserId = userId;

        // If username provided, get the user ID first
        if (username && !userId) {
            const userResponse = await client.v2.userByUsername(username);
            if (!userResponse.data) {
                throw new Error(`User with username '${username}' not found`);
            }
            targetUserId = userResponse.data.id;
        }

        // Get authenticated user's ID
        const me = await client.v2.me();
        const myUserId = me.data.id;

        // Unblock the user
        const result = await client.v2.unblock(myUserId, targetUserId!);

        return createResponse(`Successfully unblocked user ${username || targetUserId}. Response: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('403')) {
                throw new Error(`Failed to unblock user: Insufficient permissions. Unblocking requires OAuth 2.0 authentication with block.write scope.`);
            } else if (error.message.includes('404')) {
                throw new Error(`Failed to unblock user: User ${username || userId} not found or was not previously blocked.`);
            } else if (error.message.includes('429')) {
                throw new Error(`Failed to unblock user: Rate limit exceeded. Block endpoints allow 50 requests per 15 minutes.`);
            }
            throw new Error(`Failed to unblock user: ${error.message}`);
        }
        throw error;
    }
};

/**
 * Retrieve a paginated list of blocked users
 */
export const handleGetBlockedUsers: TwitterHandler<GetBlockedUsersArgs> = async (
    client: TwitterClient,
    { maxResults = 100, paginationToken, userFields }: GetBlockedUsersArgs
): Promise<HandlerResponse> => {
    try {
        // Get authenticated user's ID
        const me = await client.v2.me();
        const myUserId = me.data.id;

        const options: any = {
            max_results: Math.min(maxResults, 1000) // API max is 1000
        };

        if (paginationToken) {
            options.pagination_token = paginationToken;
        }

        if (userFields && userFields.length > 0) {
            options['user.fields'] = userFields.join(',');
        } else {
            // Default user fields for better response
            options['user.fields'] = 'id,name,username,public_metrics,description,verified';
        }

        const blockedUsers = await client.v2.userBlockingUsers(myUserId, options);

        if (!blockedUsers.data || !Array.isArray(blockedUsers.data) || blockedUsers.data.length === 0) {
            return createResponse('No blocked users found.');
        }

        const responseData = {
            blockedUsers: blockedUsers.data,
            meta: blockedUsers.meta
        };

        return createResponse(`Retrieved ${blockedUsers.data.length} blocked users: ${JSON.stringify(responseData, null, 2)}`);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('403')) {
                throw new Error(`Failed to get blocked users: Insufficient permissions. This endpoint requires OAuth 2.0 authentication with block.read scope.`);
            } else if (error.message.includes('429')) {
                throw new Error(`Failed to get blocked users: Rate limit exceeded. Block endpoints allow 50 requests per 15 minutes.`);
            }
            throw new Error(`Failed to get blocked users: ${error.message}`);
        }
        throw error;
    }
};

/**
 * Mute a user account to stop seeing their tweets in your timeline
 */
export const handleMuteUser: TwitterHandler<MuteUserArgs> = async (
    client: TwitterClient,
    { userId, username }: MuteUserArgs
): Promise<HandlerResponse> => {
    try {
        if (!userId && !username) {
            throw new Error('Either userId or username must be provided');
        }

        let targetUserId = userId;

        // If username provided, get the user ID first
        if (username && !userId) {
            const userResponse = await client.v2.userByUsername(username);
            if (!userResponse.data) {
                throw new Error(`User with username '${username}' not found`);
            }
            targetUserId = userResponse.data.id;
        }

        // Get authenticated user's ID
        const me = await client.v2.me();
        const myUserId = me.data.id;

        // Mute the user
        const result = await client.v2.mute(myUserId, targetUserId!);

        return createResponse(`Successfully muted user ${username || targetUserId}. Response: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('403')) {
                throw new Error(`Failed to mute user: Insufficient permissions. Muting requires OAuth 2.0 authentication with mute.write scope.`);
            } else if (error.message.includes('404')) {
                throw new Error(`Failed to mute user: User ${username || userId} not found.`);
            } else if (error.message.includes('422')) {
                throw new Error(`Failed to mute user: User ${username || userId} may already be muted or cannot be muted.`);
            } else if (error.message.includes('429')) {
                throw new Error(`Failed to mute user: Rate limit exceeded. Mute endpoints allow 50 requests per 15 minutes.`);
            }
            throw new Error(`Failed to mute user: ${error.message}`);
        }
        throw error;
    }
};

/**
 * Unmute a previously muted user account
 */
export const handleUnmuteUser: TwitterHandler<UnmuteUserArgs> = async (
    client: TwitterClient,
    { userId, username }: UnmuteUserArgs
): Promise<HandlerResponse> => {
    try {
        if (!userId && !username) {
            throw new Error('Either userId or username must be provided');
        }

        let targetUserId = userId;

        // If username provided, get the user ID first
        if (username && !userId) {
            const userResponse = await client.v2.userByUsername(username);
            if (!userResponse.data) {
                throw new Error(`User with username '${username}' not found`);
            }
            targetUserId = userResponse.data.id;
        }

        // Get authenticated user's ID
        const me = await client.v2.me();
        const myUserId = me.data.id;

        // Unmute the user
        const result = await client.v2.unmute(myUserId, targetUserId!);

        return createResponse(`Successfully unmuted user ${username || targetUserId}. Response: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('403')) {
                throw new Error(`Failed to unmute user: Insufficient permissions. Unmuting requires OAuth 2.0 authentication with mute.write scope.`);
            } else if (error.message.includes('404')) {
                throw new Error(`Failed to unmute user: User ${username || userId} not found or was not previously muted.`);
            } else if (error.message.includes('429')) {
                throw new Error(`Failed to unmute user: Rate limit exceeded. Mute endpoints allow 50 requests per 15 minutes.`);
            }
            throw new Error(`Failed to unmute user: ${error.message}`);
        }
        throw error;
    }
};

/**
 * Retrieve a paginated list of muted users
 */
export const handleGetMutedUsers: TwitterHandler<GetMutedUsersArgs> = async (
    client: TwitterClient,
    { maxResults = 100, paginationToken, userFields }: GetMutedUsersArgs
): Promise<HandlerResponse> => {
    try {
        // Get authenticated user's ID
        const me = await client.v2.me();
        const myUserId = me.data.id;

        const options: any = {
            max_results: Math.min(maxResults, 1000) // API max is 1000
        };

        if (paginationToken) {
            options.pagination_token = paginationToken;
        }

        if (userFields && userFields.length > 0) {
            options['user.fields'] = userFields.join(',');
        } else {
            // Default user fields for better response
            options['user.fields'] = 'id,name,username,public_metrics,description,verified';
        }

        const mutedUsers = await client.v2.userMutingUsers(myUserId, options);

        if (!mutedUsers.data || !Array.isArray(mutedUsers.data) || mutedUsers.data.length === 0) {
            return createResponse('No muted users found.');
        }

        const responseData = {
            mutedUsers: mutedUsers.data,
            meta: mutedUsers.meta
        };

        return createResponse(`Retrieved ${mutedUsers.data.length} muted users: ${JSON.stringify(responseData, null, 2)}`);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('403')) {
                throw new Error(`Failed to get muted users: Insufficient permissions. This endpoint requires OAuth 2.0 authentication with mute.read scope.`);
            } else if (error.message.includes('429')) {
                throw new Error(`Failed to get muted users: Rate limit exceeded. Mute endpoints allow 50 requests per 15 minutes.`);
            }
            throw new Error(`Failed to get muted users: ${error.message}`);
        }
        throw error;
    }
}; 