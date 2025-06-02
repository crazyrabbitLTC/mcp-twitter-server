/**
 * SocialData.tools user research handlers
 * Enhanced user analysis without API restrictions
 */
import { getSocialDataClient } from '../../socialDataClient.js';
import { 
    SocialDataHandler,
    BulkUserProfilesArgs,
    UserGrowthAnalyticsArgs,
    UserInfluenceMetricsArgs
} from '../../types/socialdata.js';
import { 
    createSocialDataResponse, 
    formatSocialDataError, 
    formatUserList,
    formatAnalytics,
    createMissingApiKeyResponse
} from '../../utils/socialdata-response.js';

export const handleBulkUserProfiles: SocialDataHandler<BulkUserProfilesArgs> = async (
    _client: any,
    { usernames = [], userIds = [], includeMetrics = true }: BulkUserProfilesArgs
) => {
    try {
        const socialClient = getSocialDataClient();
        
        if (!socialClient) {
            return createMissingApiKeyResponse('Bulk User Profiles');
        }
        const profiles = [];
        
        // Process usernames
        for (const username of usernames) {
            try {
                const profile = await socialClient.getUserProfile({ 
                    username, 
                    includeMetrics 
                });
                profiles.push(profile.data);
            } catch (error) {
                console.warn(`Failed to get profile for username: ${username}`, error);
            }
        }
        
        // Process user IDs
        for (const userId of userIds) {
            try {
                const profile = await socialClient.getUserProfile({ 
                    userId, 
                    includeMetrics 
                });
                profiles.push(profile.data);
            } catch (error) {
                console.warn(`Failed to get profile for userId: ${userId}`, error);
            }
        }

        if (profiles.length === 0) {
            return createSocialDataResponse('No user profiles retrieved');
        }

        return createSocialDataResponse(
            formatUserList(profiles, `Bulk User Profiles (${profiles.length} users)`)
        );
    } catch (error) {
        throw new Error(formatSocialDataError(error as Error, 'bulk user profiles'));
    }
};

export const handleUserGrowthAnalytics: SocialDataHandler<UserGrowthAnalyticsArgs> = async (
    _client: any,
    { username, timeframe = 'weekly', period = 4 }: UserGrowthAnalyticsArgs
) => {
    try {
        const socialClient = getSocialDataClient();
        
        if (!socialClient) {
            return createMissingApiKeyResponse('User Growth Analytics');
        }
        
        // Get current profile
        const currentProfile = await socialClient.getUserProfile({ username, includeMetrics: true });
        
        // Get recent tweets to analyze growth patterns
        const tweets = await socialClient.getUserTweets({ username, maxResults: 50 });
        
        // Calculate basic growth metrics from available data
        const analytics = {
            user: {
                username: currentProfile.data.username,
                current_followers: currentProfile.data.public_metrics?.followers_count || 0,
                current_following: currentProfile.data.public_metrics?.following_count || 0,
                total_tweets: currentProfile.data.public_metrics?.tweet_count || 0
            },
            timeframe,
            period,
            recent_activity: {
                recent_tweets_count: tweets.data?.length || 0,
                avg_engagement: tweets.data ? 
                    tweets.data.reduce((sum: number, tweet: any) => 
                        sum + (tweet.public_metrics?.like_count || 0) + 
                              (tweet.public_metrics?.retweet_count || 0), 0) / tweets.data.length 
                    : 0
            },
            note: 'Growth analytics based on current snapshot and recent activity patterns'
        };

        return createSocialDataResponse(
            formatAnalytics(analytics, `User Growth Analytics for @${username}`)
        );
    } catch (error) {
        throw new Error(formatSocialDataError(error as Error, 'user growth analytics'));
    }
};

export const handleUserInfluenceMetrics: SocialDataHandler<UserInfluenceMetricsArgs> = async (
    _client: any,
    { username, analyzeEngagement = true, analyzeReach = true }: UserInfluenceMetricsArgs
) => {
    try {
        const socialClient = getSocialDataClient();
        
        if (!socialClient) {
            return createMissingApiKeyResponse('User Influence Metrics');
        }
        
        // Get user profile and recent tweets
        const [profile, tweets] = await Promise.all([
            socialClient.getUserProfile({ username, includeMetrics: true }),
            socialClient.getUserTweets({ username, maxResults: 20 })
        ]);

        const user = profile.data;
        const recentTweets = tweets.data || [];
        
        // Calculate influence metrics
        const metrics: any = {
            user: {
                username: user.username,
                followers: user.public_metrics?.followers_count || 0,
                following: user.public_metrics?.following_count || 0,
                verified: user.verified || false
            }
        };

        if (analyzeEngagement && recentTweets.length > 0) {
            const totalLikes = recentTweets.reduce((sum: number, tweet: any) => 
                sum + (tweet.public_metrics?.like_count || 0), 0);
            const totalRetweets = recentTweets.reduce((sum: number, tweet: any) => 
                sum + (tweet.public_metrics?.retweet_count || 0), 0);
            const totalReplies = recentTweets.reduce((sum: number, tweet: any) => 
                sum + (tweet.public_metrics?.reply_count || 0), 0);

            metrics.engagement = {
                avg_likes_per_tweet: Math.round(totalLikes / recentTweets.length),
                avg_retweets_per_tweet: Math.round(totalRetweets / recentTweets.length),
                avg_replies_per_tweet: Math.round(totalReplies / recentTweets.length),
                engagement_rate: user.public_metrics?.followers_count > 0 ? 
                    Math.round(((totalLikes + totalRetweets + totalReplies) / recentTweets.length / 
                    user.public_metrics.followers_count) * 10000) / 100 : 0
            };
        }

        if (analyzeReach) {
            metrics.reach = {
                follower_base: user.public_metrics?.followers_count || 0,
                potential_reach: user.public_metrics?.followers_count || 0,
                estimated_influence_score: Math.min(100, 
                    Math.log10((user.public_metrics?.followers_count || 1) + 1) * 20)
            };
        }

        return createSocialDataResponse(
            formatAnalytics(metrics, `Influence Metrics for @${username}`)
        );
    } catch (error) {
        throw new Error(formatSocialDataError(error as Error, 'user influence metrics'));
    }
};