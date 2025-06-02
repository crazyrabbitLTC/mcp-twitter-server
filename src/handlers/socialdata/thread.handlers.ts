/**
 * SocialData.tools thread and conversation analysis handlers
 * Advanced thread reconstruction and conversation mapping
 */
import { getSocialDataClient } from '../../socialDataClient.js';
import { 
    SocialDataHandler,
    FullThreadArgs,
    ConversationTreeArgs,
    ThreadMetricsArgs
} from '../../types/socialdata.js';
import { 
    createSocialDataResponse, 
    formatSocialDataError, 
    formatTweetList,
    formatAnalytics
} from '../../utils/socialdata-response.js';

export const handleGetFullThread: SocialDataHandler<FullThreadArgs> = async (
    _client: any,
    { tweetId, includeMetrics = true }: FullThreadArgs
) => {
    try {
        const socialClient = getSocialDataClient();
        
        // Search for the original tweet and related conversation
        const mainTweetQuery = `conversation_id:${tweetId}`;
        const threadResult = await socialClient.searchTweets({
            query: mainTweetQuery,
            maxResults: 100
        });

        if (!threadResult.data || threadResult.data.length === 0) {
            // Fallback: search for replies to the tweet
            const repliesQuery = `to:* in_reply_to_status_id:${tweetId}`;
            const repliesResult = await socialClient.searchTweets({
                query: repliesQuery,
                maxResults: 50
            });
            
            return createSocialDataResponse(
                formatTweetList(repliesResult.data || [], `Thread replies for tweet ${tweetId}`)
            );
        }

        // Sort by creation time to reconstruct thread order
        const sortedThread = threadResult.data.sort((a: any, b: any) => 
            new Date(a.tweet_created_at).getTime() - new Date(b.tweet_created_at).getTime()
        );

        const threadAnalysis = {
            thread_id: tweetId,
            total_tweets: sortedThread.length,
            thread_duration: sortedThread.length > 1 ? {
                start: sortedThread[0]?.tweet_created_at,
                end: sortedThread[sortedThread.length - 1]?.tweet_created_at
            } : null,
            tweets: sortedThread.map((tweet: any) => ({
                id: tweet.id_str,
                text: tweet.text,
                author: tweet.user?.screen_name,
                created_at: tweet.tweet_created_at,
                metrics: includeMetrics ? {
                    likes: tweet.favorite_count || 0,
                    retweets: tweet.retweet_count || 0,
                    replies: tweet.reply_count || 0
                } : undefined
            }))
        };

        return createSocialDataResponse(
            formatAnalytics(threadAnalysis, `Full Thread Analysis for ${tweetId}`)
        );
    } catch (error) {
        throw new Error(formatSocialDataError(error as Error, 'full thread analysis'));
    }
};

export const handleGetConversationTree: SocialDataHandler<ConversationTreeArgs> = async (
    _client: any,
    { tweetId, maxDepth = 3, includeQuotes = true }: ConversationTreeArgs
) => {
    try {
        const socialClient = getSocialDataClient();
        
        // Get direct replies
        const repliesQuery = `to:* ${tweetId}`;
        const repliesResult = await socialClient.searchTweets({
            query: repliesQuery,
            maxResults: 50
        });

        // Get quote tweets if requested
        let quoteTweets: any[] = [];
        if (includeQuotes) {
            const quotesQuery = `url:${tweetId} OR ${tweetId}`;
            const quotesResult = await socialClient.searchTweets({
                query: quotesQuery,
                maxResults: 25
            });
            quoteTweets = quotesResult.data || [];
        }

        const conversationTree = {
            root_tweet_id: tweetId,
            max_depth_analyzed: maxDepth,
            direct_replies: {
                count: repliesResult.data?.length || 0,
                tweets: repliesResult.data?.map((tweet: any) => ({
                    id: tweet.id_str,
                    text: tweet.text?.substring(0, 280),
                    author: tweet.user?.screen_name,
                    created_at: tweet.tweet_created_at,
                    metrics: {
                        likes: tweet.favorite_count || 0,
                        retweets: tweet.retweet_count || 0
                    }
                })) || []
            },
            quote_tweets: {
                count: quoteTweets.length,
                tweets: quoteTweets.map((tweet: any) => ({
                    id: tweet.id_str,
                    text: tweet.text?.substring(0, 280),
                    author: tweet.user?.screen_name,
                    created_at: tweet.tweet_created_at
                }))
            },
            engagement_summary: {
                total_interactions: (repliesResult.data?.length || 0) + quoteTweets.length,
                reply_rate: repliesResult.data?.length || 0,
                quote_rate: quoteTweets.length
            }
        };

        return createSocialDataResponse(
            formatAnalytics(conversationTree, `Conversation Tree for ${tweetId}`)
        );
    } catch (error) {
        throw new Error(formatSocialDataError(error as Error, 'conversation tree analysis'));
    }
};

export const handleGetThreadMetrics: SocialDataHandler<ThreadMetricsArgs> = async (
    _client: any,
    { tweetId, analyzeEngagement = true, timeframe = '24h' }: ThreadMetricsArgs
) => {
    try {
        const socialClient = getSocialDataClient();
        
        // Get thread data
        const threadQuery = `conversation_id:${tweetId}`;
        const threadResult = await socialClient.searchTweets({
            query: threadQuery,
            maxResults: 100
        });

        const tweets = threadResult.data || [];
        
        if (tweets.length === 0) {
            return createSocialDataResponse(`No thread data found for tweet ${tweetId}`);
        }

        let metrics: any = {
            thread_id: tweetId,
            thread_length: tweets.length,
            timeframe_analyzed: timeframe
        };

        if (analyzeEngagement) {
            const totalLikes = tweets.reduce((sum: number, tweet: any) => 
                sum + (tweet.favorite_count || 0), 0);
            const totalRetweets = tweets.reduce((sum: number, tweet: any) => 
                sum + (tweet.retweet_count || 0), 0);
            const totalReplies = tweets.reduce((sum: number, tweet: any) => 
                sum + (tweet.reply_count || 0), 0);

            metrics.engagement_metrics = {
                total_likes: totalLikes,
                total_retweets: totalRetweets,
                total_replies: totalReplies,
                avg_likes_per_tweet: Math.round(totalLikes / tweets.length),
                avg_retweets_per_tweet: Math.round(totalRetweets / tweets.length),
                engagement_distribution: tweets.map((tweet: any, index: number) => ({
                    position: index + 1,
                    likes: tweet.favorite_count || 0,
                    retweets: tweet.retweet_count || 0,
                    engagement_score: (tweet.favorite_count || 0) + (tweet.retweet_count || 0) * 2
                })).sort((a: any, b: any) => b.engagement_score - a.engagement_score)
            };

            // Find the most engaging tweet in thread
            const topTweet = metrics.engagement_metrics.engagement_distribution[0];
            metrics.top_performing_tweet = {
                position: topTweet.position,
                engagement_score: topTweet.engagement_score,
                performance_boost: tweets.length > 1 ? 
                    Math.round((topTweet.engagement_score / (totalLikes + totalRetweets * 2)) * 100) : 100
            };
        }

        return createSocialDataResponse(
            formatAnalytics(metrics, `Thread Performance Metrics for ${tweetId}`)
        );
    } catch (error) {
        throw new Error(formatSocialDataError(error as Error, 'thread metrics analysis'));
    }
};