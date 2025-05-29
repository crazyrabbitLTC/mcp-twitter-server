import { TwitterClient } from '../twitterClient.js';
import { UserV2 } from 'twitter-api-v2';
import { 
    HandlerResponse, 
    TwitterHandler 
} from '../types/handlers.js';
import { createResponse } from '../utils/response.js';

interface TweetEngagementArgs {
    tweetId: string;
}

interface GetRetweetsArgs extends TweetEngagementArgs {
    maxResults?: number;
    userFields?: string[];
}

interface GetLikedTweetsArgs {
    userId: string;
    maxResults?: number;
    tweetFields?: string[];
}

export const handleLikeTweet: TwitterHandler<TweetEngagementArgs> = async (
    client: TwitterClient,
    { tweetId }: TweetEngagementArgs
): Promise<HandlerResponse> => {
    try {
        const { data: { id: userId } } = await client.v2.me();
        await client.v2.like(userId, tweetId);
        return createResponse(`Successfully liked tweet: ${tweetId}`);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to like tweet: ${error.message}`);
        }
        throw error;
    }
};

export const handleUnlikeTweet: TwitterHandler<TweetEngagementArgs> = async (
    client: TwitterClient,
    { tweetId }: TweetEngagementArgs
): Promise<HandlerResponse> => {
    try {
        const userId = await client.v2.me().then(response => response.data.id);
        await client.v2.unlike(userId, tweetId);
        return createResponse(`Successfully unliked tweet: ${tweetId}`);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to unlike tweet: ${error.message}`);
        }
        throw error;
    }
};

export const handleRetweet: TwitterHandler<TweetEngagementArgs> = async (
    client: TwitterClient,
    { tweetId }: TweetEngagementArgs
): Promise<HandlerResponse> => {
    try {
        const userId = await client.v2.me().then(response => response.data.id);
        await client.v2.retweet(userId, tweetId);
        return createResponse(`Successfully retweeted tweet: ${tweetId}`);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to retweet: ${error.message}`);
        }
        throw error;
    }
};

export const handleUndoRetweet: TwitterHandler<TweetEngagementArgs> = async (
    client: TwitterClient,
    { tweetId }: TweetEngagementArgs
): Promise<HandlerResponse> => {
    try {
        const userId = await client.v2.me().then(response => response.data.id);
        await client.v2.unretweet(userId, tweetId);
        return createResponse(`Successfully undid retweet: ${tweetId}`);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to undo retweet: ${error.message}`);
        }
        throw error;
    }
};

export const handleGetRetweets: TwitterHandler<GetRetweetsArgs> = async (
    client: TwitterClient,
    { tweetId, maxResults = 100, userFields }: GetRetweetsArgs
): Promise<HandlerResponse> => {
    try {
        const retweets = await client.v2.tweetRetweetedBy(tweetId, {
            max_results: maxResults,
            'user.fields': userFields?.join(',') || 'description,profile_image_url,public_metrics,verified'
        });

        if (!retweets.data || !Array.isArray(retweets.data) || retweets.data.length === 0) {
            return createResponse(`No retweets found for tweet: ${tweetId}`);
        }

        const responseData = {
            retweetedBy: retweets.data,
            meta: retweets.meta
        };

        return createResponse(`Users who retweeted: ${JSON.stringify(responseData, null, 2)}`);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to get retweets: ${error.message}`);
        }
        throw error;
    }
};

export const handleGetLikedTweets: TwitterHandler<GetLikedTweetsArgs> = async (
    client: TwitterClient,
    { userId, maxResults = 100, tweetFields }: GetLikedTweetsArgs
): Promise<HandlerResponse> => {
    try {
        const likedTweets = await client.v2.userLikedTweets(userId, {
            max_results: maxResults,
            'tweet.fields': tweetFields?.join(',') || 'created_at,public_metrics,author_id'
        });

        // The paginator returns data nested: { data: [tweets], meta: {...} }
        const tweetData = likedTweets.data?.data;
        const metaData = likedTweets.data?.meta || likedTweets.meta;

        if (!tweetData || !Array.isArray(tweetData) || tweetData.length === 0) {
            return createResponse(`No liked tweets found for user: ${userId}`);
        }

        const responseData = {
            likedTweets: tweetData,
            meta: metaData
        };

        return createResponse(`Liked tweets: ${JSON.stringify(responseData, null, 2)}`);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('400') && error.message.includes('Invalid Request')) {
                throw new Error(`Get liked tweets functionality may require elevated permissions or Pro tier access. Current Basic tier ($200/month) has limited access to user engagement data. Consider upgrading to Pro tier ($5,000/month) at https://developer.x.com/en/portal/products/pro or use alternative methods to track user engagement.`);
            }
            throw new Error(`Failed to get liked tweets: ${error.message}`);
        }
        throw error;
    }
}; 