import { TwitterClient } from '../twitterClient.js';
import { UserV2, TTweetv2UserField } from 'twitter-api-v2';
import { 
    HandlerResponse, 
    TwitterHandler,
    UserHandlerArgs,
    GetAuthenticatedUserArgs
} from '../types/handlers.js';
import { createResponse } from '../utils/response.js';

interface GetUserInfoArgs extends UserHandlerArgs {
    fields?: TTweetv2UserField[];
}

interface GetUserTimelineArgs extends UserHandlerArgs {
    maxResults?: number;
    tweetFields?: string[];
}

interface GetFollowersArgs extends UserHandlerArgs {
    maxResults?: number;
    userFields?: string[];
}

interface GetFollowingArgs extends UserHandlerArgs {
    maxResults?: number;
    userFields?: string[];
}

export const handleGetUserInfo: TwitterHandler<GetUserInfoArgs> = async (
    client: TwitterClient,
    { username, fields }: GetUserInfoArgs
): Promise<HandlerResponse> => {
    const user = await client.v2.userByUsername(
        username,
        { 
            'user.fields': fields || ['description', 'public_metrics', 'profile_image_url', 'verified'] as TTweetv2UserField[]
        }
    );
    
    if (!user.data) {
        throw new Error(`User not found: ${username}`);
    }

    return createResponse(`User info: ${JSON.stringify(user.data, null, 2)}`);
};

export const handleFollowUser: TwitterHandler<UserHandlerArgs> = async (
    client: TwitterClient,
    { username }: UserHandlerArgs
): Promise<HandlerResponse> => {
    try {
        const userId = await client.v2.me().then(response => response.data.id);
        const targetUser = await client.v2.userByUsername(username);
        
        if (!targetUser.data) {
            throw new Error(`User not found: ${username}`);
        }
        
        await client.v2.follow(userId, targetUser.data.id);
        return createResponse(`Successfully followed user: ${username}`);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to follow user: ${error.message}`);
        }
        throw error;
    }
};

export const handleUnfollowUser: TwitterHandler<UserHandlerArgs> = async (
    client: TwitterClient,
    { username }: UserHandlerArgs
): Promise<HandlerResponse> => {
    try {
        const userId = await client.v2.me().then(response => response.data.id);
        const targetUser = await client.v2.userByUsername(username);
        
        if (!targetUser.data) {
            throw new Error(`User not found: ${username}`);
        }
        
        await client.v2.unfollow(userId, targetUser.data.id);
        return createResponse(`Successfully unfollowed user: ${username}`);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to unfollow user: ${error.message}`);
        }
        throw error;
    }
};

export const handleGetFollowers: TwitterHandler<GetFollowersArgs> = async (
    client: TwitterClient,
    { username, maxResults, userFields }: GetFollowersArgs
): Promise<HandlerResponse> => {
    try {
        const user = await client.v2.userByUsername(username);
        if (!user.data) {
            throw new Error(`User not found: ${username}`);
        }

        const followers = await client.v2.followers(user.data.id, {
            max_results: maxResults,
            'user.fields': userFields?.join(',') || 'description,public_metrics'
        });

        if (!followers.data) {
            return createResponse(`No followers found for user: ${username}`);
        }

        return createResponse(`Followers for ${username}: ${JSON.stringify(followers.data, null, 2)}`);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('403')) {
                throw new Error(`Get followers functionality requires elevated permissions. This endpoint may require Pro tier access ($5,000/month) or special permission approval from X. Current Basic tier ($200/month) has limited access to follower data for privacy reasons. Contact X Developer Support or consider upgrading at https://developer.x.com/en/portal/products/pro`);
            }
            throw new Error(`Failed to get followers: ${error.message}`);
        }
        throw error;
    }
};

export const handleGetFollowing: TwitterHandler<GetFollowingArgs> = async (
    client: TwitterClient,
    { username, maxResults, userFields }: GetFollowingArgs
): Promise<HandlerResponse> => {
    try {
        const user = await client.v2.userByUsername(username);
        if (!user.data) {
            throw new Error(`User not found: ${username}`);
        }

        const following = await client.v2.following(user.data.id, {
            max_results: maxResults,
            'user.fields': userFields?.join(',') || 'description,profile_image_url,public_metrics,verified'
        });

        if (!following.data || following.data.length === 0) {
            return createResponse(`User ${username} is not following anyone`);
        }

        return createResponse(`Users followed by ${username}: ${JSON.stringify(following.data, null, 2)}`);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('403')) {
                throw new Error(`Get following functionality requires elevated permissions. This endpoint may require Pro tier access ($5,000/month) or special permission approval from X. Current Basic tier ($200/month) has limited access to following data for privacy reasons. Contact X Developer Support or consider upgrading at https://developer.x.com/en/portal/products/pro`);
            }
            throw new Error(`Failed to get following: ${error.message}`);
        }
        throw error;
    }
};

/**
 * Get the authenticated user's own profile information
 */
export const handleGetAuthenticatedUser: TwitterHandler<GetAuthenticatedUserArgs> = async (
    client: TwitterClient,
    { userFields }: GetAuthenticatedUserArgs
): Promise<HandlerResponse> => {
    try {
        const me = await client.v2.me({
            'user.fields': (userFields as TTweetv2UserField[]) || ['id', 'username', 'name', 'description', 'public_metrics', 'verified', 'profile_image_url', 'created_at'] as TTweetv2UserField[]
        });

        if (!me.data) {
            throw new Error('Unable to retrieve authenticated user information');
        }

        return createResponse(`Authenticated user info: ${JSON.stringify(me.data, null, 2)}`);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('401')) {
                throw new Error(`Authentication failed. Please check your API credentials and tokens. This endpoint requires valid OAuth 1.0a User Context or OAuth 2.0 Authorization Code with PKCE authentication.`);
            }
            if (error.message.includes('429')) {
                throw new Error(`Rate limit exceeded. Please wait before making another request.`);
            }
            throw new Error(`Failed to get authenticated user: ${error.message}`);
        }
        throw error;
    }
}; 