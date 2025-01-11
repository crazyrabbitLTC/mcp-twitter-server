import { TwitterClient } from '../twitterClient.js';
import { HandlerResponse, TwitterHandler } from '../types/handlers.js';
import { createResponse } from '../utils/response.js';
import { TweetV2, TwitterApiReadOnly, UserV2, TweetSearchRecentV2Paginator } from 'twitter-api-v2';

interface SearchTweetsArgs {
    query: string;
    maxResults?: number;
    tweetFields?: string[];
}

interface HashtagAnalyticsArgs {
    hashtag: string;
    startTime?: string;
    endTime?: string;
}

interface TweetWithAuthor extends TweetV2 {
    author?: UserV2;
}

export const handleSearchTweets: TwitterHandler<SearchTweetsArgs> = async (
    client: TwitterClient,
    { query, maxResults = 10, tweetFields }: SearchTweetsArgs
): Promise<HandlerResponse> => {
    try {
        const searchResult = await client.v2.search(query, {
            max_results: maxResults,
            'tweet.fields': tweetFields?.join(',') || 'created_at,public_metrics',
            expansions: ['author_id'],
            'user.fields': ['username']
        });

        if (!searchResult.data || searchResult.data.length === 0) {
            return createResponse(`No tweets found for query: ${query}`);
        }

        const formattedTweets = searchResult.data.map((tweet: TweetV2): TweetWithAuthor => ({
            ...tweet,
            author: searchResult.includes?.users?.find(u => u.id === tweet.author_id)
        }));

        return createResponse(`Search results: ${JSON.stringify(formattedTweets, null, 2)}`);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to search tweets: ${error.message}`);
        }
        throw error;
    }
};

export const handleHashtagAnalytics: TwitterHandler<HashtagAnalyticsArgs> = async (
    client: TwitterClient,
    { hashtag, startTime, endTime }: HashtagAnalyticsArgs
): Promise<HandlerResponse> => {
    try {
        const query = `#${hashtag.replace(/^#/, '')}`;
        const searchResult = await client.v2.search(query, {
            max_results: 100,
            'tweet.fields': 'public_metrics,created_at',
            start_time: startTime,
            end_time: endTime
        });

        const tweets = searchResult.tweets;
        if (!tweets || tweets.length === 0) {
            return createResponse(`No tweets found for hashtag: ${hashtag}`);
        }

        const analytics = {
            totalTweets: tweets.length,
            totalLikes: tweets.reduce((sum: number, tweet: TweetV2) => 
                sum + (tweet.public_metrics?.like_count || 0), 0),
            totalRetweets: tweets.reduce((sum: number, tweet: TweetV2) => 
                sum + (tweet.public_metrics?.retweet_count || 0), 0),
            totalReplies: tweets.reduce((sum: number, tweet: TweetV2) => 
                sum + (tweet.public_metrics?.reply_count || 0), 0)
        };

        return createResponse(`Hashtag Analytics for ${hashtag}:\n${JSON.stringify(analytics, null, 2)}`);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to get hashtag analytics: ${error.message}`);
        }
        throw error;
    }
}; 