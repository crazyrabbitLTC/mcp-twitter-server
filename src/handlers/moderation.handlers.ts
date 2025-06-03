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
import { createMissingTwitterApiKeyResponse, formatTwitterError } from '../utils/twitter-response.js';

/**
 * Block a user account to prevent them from following you or viewing your tweets
 */
export const handleBlockUser: TwitterHandler<BlockUserArgs> = async (
    client: TwitterClient | null,
    { userId, username }: BlockUserArgs
): Promise<HandlerResponse> => {
    if (!client) {
        return createMissingTwitterApiKeyResponse('blockUser');
    }
    
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
            throw new Error(formatTwitterError(error, 'blocking user'));
        }
        throw error;
    }
};

/**
 * Unblock a previously blocked user account
 */
export const handleUnblockUser: TwitterHandler<UnblockUserArgs> = async (
    client: TwitterClient | null,
    { userId, username }: UnblockUserArgs
): Promise<HandlerResponse> => {
    if (!client) {
        return createMissingTwitterApiKeyResponse('unblockUser');
    }
    
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
            throw new Error(formatTwitterError(error, 'unblocking user'));
        }
        throw error;
    }
};

/**
 * Retrieve a paginated list of blocked users
 */
export const handleGetBlockedUsers: TwitterHandler<GetBlockedUsersArgs> = async (
    client: TwitterClient | null,
    { maxResults = 100, paginationToken, userFields }: GetBlockedUsersArgs
): Promise<HandlerResponse> => {
    if (!client) {
        return createMissingTwitterApiKeyResponse('getBlockedUsers');
    }
    
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

        // The paginator returns data nested: { data: [users], meta: {...} }
        const userData = blockedUsers.data?.data;
        const metaData = blockedUsers.data?.meta || blockedUsers.meta;

        if (!userData || !Array.isArray(userData) || userData.length === 0) {
            return createResponse('No blocked users found.');
        }

        const responseData = {
            blockedUsers: userData,
            meta: metaData
        };

        return createResponse(`Retrieved ${userData.length} blocked users: ${JSON.stringify(responseData, null, 2)}`);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(formatTwitterError(error, 'getting blocked users'));
        }
        throw error;
    }
};

/**
 * Mute a user account to stop seeing their tweets in your timeline
 */
export const handleMuteUser: TwitterHandler<MuteUserArgs> = async (
    client: TwitterClient | null,
    { userId, username }: MuteUserArgs
): Promise<HandlerResponse> => {
    if (!client) {
        return createMissingTwitterApiKeyResponse('muteUser');
    }
    
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
            throw new Error(formatTwitterError(error, 'muting user'));
        }
        throw error;
    }
};

/**
 * Unmute a previously muted user account
 */
export const handleUnmuteUser: TwitterHandler<UnmuteUserArgs> = async (
    client: TwitterClient | null,
    { userId, username }: UnmuteUserArgs
): Promise<HandlerResponse> => {
    if (!client) {
        return createMissingTwitterApiKeyResponse('unmuteUser');
    }
    
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
            throw new Error(formatTwitterError(error, 'unmuting user'));
        }
        throw error;
    }
};

/**
 * Retrieve a paginated list of muted users
 */
export const handleGetMutedUsers: TwitterHandler<GetMutedUsersArgs> = async (
    client: TwitterClient | null,
    { maxResults = 100, paginationToken, userFields }: GetMutedUsersArgs
): Promise<HandlerResponse> => {
    if (!client) {
        return createMissingTwitterApiKeyResponse('getMutedUsers');
    }
    
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

        // The paginator returns data nested: { data: [users], meta: {...} }
        const userData = mutedUsers.data?.data;
        const metaData = mutedUsers.data?.meta || mutedUsers.meta;

        if (!userData || !Array.isArray(userData) || userData.length === 0) {
            return createResponse('No muted users found.');
        }

        const responseData = {
            mutedUsers: userData,
            meta: metaData
        };

        return createResponse(`Retrieved ${userData.length} muted users: ${JSON.stringify(responseData, null, 2)}`);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(formatTwitterError(error, 'getting muted users'));
        }
        throw error;
    }
};