/**
 * SocialData.tools advanced analytics handlers
 * Sentiment analysis, viral tracking, and trend analysis
 */
import { getSocialDataClient } from '../../socialDataClient.js';
import { SocialDataHandler } from '../../types/socialdata.js';
import { 
    createSocialDataResponse, 
    formatSocialDataError, 
    formatAnalytics
} from '../../utils/socialdata-response.js';

interface HashtagTrendsArgs {
    hashtag: string;
    timeframe: 'hourly' | 'daily' | 'weekly';
    period?: number;
}

interface SentimentAnalysisArgs {
    query: string;
    sampleSize?: number;
    includeKeywords?: boolean;
}

interface ViralityTrackingArgs {
    tweetId: string;
    trackingPeriod?: string;
    analyzeSpread?: boolean;
}

export const handleGetHashtagTrends: SocialDataHandler<HashtagTrendsArgs> = async (
    _client: any,
    { hashtag, timeframe = 'daily', period = 7 }: HashtagTrendsArgs
) => {
    try {
        const socialClient = getSocialDataClient();
        
        // Clean hashtag
        const cleanHashtag = hashtag.replace(/^#/, '');
        const searchQuery = `#${cleanHashtag}`;
        
        // Get recent tweets with the hashtag
        const result = await socialClient.searchTweets({
            query: searchQuery,
            maxResults: 100
        });

        const tweets = result.data || [];
        
        if (tweets.length === 0) {
            return createSocialDataResponse(`No recent data found for hashtag #${cleanHashtag}`);
        }

        // Group tweets by time periods
        const now = new Date();
        const timeGroups = new Map();
        
        tweets.forEach((tweet: any) => {
            const tweetDate = new Date(tweet.tweet_created_at);
            let groupKey: string;
            
            if (timeframe === 'hourly') {
                groupKey = tweetDate.toISOString().substring(0, 13); // YYYY-MM-DDTHH
            } else if (timeframe === 'daily') {
                groupKey = tweetDate.toISOString().substring(0, 10); // YYYY-MM-DD
            } else {
                const weekStart = new Date(tweetDate);
                weekStart.setDate(tweetDate.getDate() - tweetDate.getDay());
                groupKey = weekStart.toISOString().substring(0, 10);
            }
            
            if (!timeGroups.has(groupKey)) {
                timeGroups.set(groupKey, []);
            }
            timeGroups.get(groupKey).push(tweet);
        });

        // Calculate trend metrics
        const trendData = Array.from(timeGroups.entries())
            .map(([period, periodTweets]: [string, any[]]) => {
                const totalEngagement = periodTweets.reduce((sum, tweet) => 
                    sum + (tweet.favorite_count || 0) + (tweet.retweet_count || 0), 0);
                
                return {
                    period,
                    tweet_count: periodTweets.length,
                    total_engagement: totalEngagement,
                    avg_engagement: Math.round(totalEngagement / periodTweets.length),
                    top_tweet: periodTweets.sort((a, b) => 
                        ((b.favorite_count || 0) + (b.retweet_count || 0)) - 
                        ((a.favorite_count || 0) + (a.retweet_count || 0))
                    )[0]
                };
            })
            .sort((a, b) => a.period.localeCompare(b.period));

        const trends = {
            hashtag: `#${cleanHashtag}`,
            timeframe,
            period_analyzed: period,
            total_tweets: tweets.length,
            trend_data: trendData,
            trend_analysis: {
                peak_period: trendData.reduce((max, current) => 
                    current.tweet_count > max.tweet_count ? current : max),
                trending_direction: trendData.length > 1 ? 
                    (trendData[trendData.length - 1].tweet_count > trendData[0].tweet_count ? 'Rising' : 'Declining') : 'Stable',
                engagement_trend: trendData.length > 1 ?
                    (trendData[trendData.length - 1].avg_engagement > trendData[0].avg_engagement ? 'Increasing' : 'Decreasing') : 'Stable'
            },
            content_insights: {
                most_engaging_tweet: {
                    text: tweets.sort((a: any, b: any) => 
                        ((b.favorite_count || 0) + (b.retweet_count || 0)) - 
                        ((a.favorite_count || 0) + (a.retweet_count || 0))
                    )[0]?.text?.substring(0, 200),
                    engagement: ((tweets[0]?.favorite_count || 0) + (tweets[0]?.retweet_count || 0))
                },
                avg_tweet_length: Math.round(tweets.reduce((sum: number, tweet: any) => 
                    sum + (tweet.text?.length || 0), 0) / tweets.length)
            }
        };

        return createSocialDataResponse(
            formatAnalytics(trends, `Hashtag Trends Analysis: #${cleanHashtag}`)
        );
    } catch (error) {
        throw new Error(formatSocialDataError(error as Error, 'hashtag trends analysis'));
    }
};

export const handleAnalyzeSentiment: SocialDataHandler<SentimentAnalysisArgs> = async (
    _client: any,
    { query, sampleSize = 50, includeKeywords = true }: SentimentAnalysisArgs
) => {
    try {
        const socialClient = getSocialDataClient();
        
        const result = await socialClient.searchTweets({
            query,
            maxResults: sampleSize
        });

        const tweets = result.data || [];
        
        if (tweets.length === 0) {
            return createSocialDataResponse(`No tweets found for sentiment analysis: ${query}`);
        }

        // Simple sentiment analysis based on keywords
        const positiveKeywords = ['good', 'great', 'awesome', 'love', 'amazing', 'excellent', 'perfect', 'happy', 'wonderful', '❤️', '😊', '👍', '🎉'];
        const negativeKeywords = ['bad', 'terrible', 'awful', 'hate', 'horrible', 'worst', 'disgusting', 'angry', 'sad', '😡', '😢', '👎', '💔'];
        
        let positive = 0, negative = 0, neutral = 0;
        const sentimentBreakdown = tweets.map((tweet: any) => {
            const text = tweet.text?.toLowerCase() || '';
            const positiveCount = positiveKeywords.filter(word => text.includes(word)).length;
            const negativeCount = negativeKeywords.filter(word => text.includes(word)).length;
            
            let sentiment: string;
            if (positiveCount > negativeCount) {
                sentiment = 'positive';
                positive++;
            } else if (negativeCount > positiveCount) {
                sentiment = 'negative';
                negative++;
            } else {
                sentiment = 'neutral';
                neutral++;
            }
            
            return {
                tweet_id: tweet.id_str,
                text: tweet.text?.substring(0, 150),
                sentiment,
                confidence: Math.max(positiveCount, negativeCount) > 0 ? 'medium' : 'low',
                engagement: (tweet.favorite_count || 0) + (tweet.retweet_count || 0)
            };
        });

        let keywordAnalysis = {};
        if (includeKeywords) {
            const allText = tweets.map((t: any) => t.text).join(' ').toLowerCase();
            const words = allText.match(/\b\w+\b/g) || [];
            const wordFreq = words.reduce((freq: any, word: string) => {
                if (word.length > 3) {
                    freq[word] = (freq[word] || 0) + 1;
                }
                return freq;
            }, {});
            
            keywordAnalysis = {
                top_keywords: Object.entries(wordFreq)
                    .sort(([,a], [,b]) => (b as number) - (a as number))
                    .slice(0, 10)
                    .map(([word, count]) => ({ word, count })),
                positive_indicators: positiveKeywords.filter(word => allText.includes(word)),
                negative_indicators: negativeKeywords.filter(word => allText.includes(word))
            };
        }

        const sentimentAnalysis = {
            query,
            sample_size: tweets.length,
            analysis_date: new Date().toISOString(),
            sentiment_distribution: {
                positive: {
                    count: positive,
                    percentage: Math.round((positive / tweets.length) * 100)
                },
                negative: {
                    count: negative,
                    percentage: Math.round((negative / tweets.length) * 100)
                },
                neutral: {
                    count: neutral,
                    percentage: Math.round((neutral / tweets.length) * 100)
                }
            },
            overall_sentiment: positive > negative ? 'Positive' : negative > positive ? 'Negative' : 'Neutral',
            confidence_level: tweets.length > 30 ? 'High' : tweets.length > 10 ? 'Medium' : 'Low',
            keyword_analysis: keywordAnalysis,
            sample_tweets: {
                most_positive: sentimentBreakdown.filter(t => t.sentiment === 'positive')
                    .sort((a, b) => b.engagement - a.engagement)[0],
                most_negative: sentimentBreakdown.filter(t => t.sentiment === 'negative')
                    .sort((a, b) => b.engagement - a.engagement)[0]
            }
        };

        return createSocialDataResponse(
            formatAnalytics(sentimentAnalysis, `Sentiment Analysis: "${query}"`)
        );
    } catch (error) {
        throw new Error(formatSocialDataError(error as Error, 'sentiment analysis'));
    }
};

export const handleTrackVirality: SocialDataHandler<ViralityTrackingArgs> = async (
    _client: any,
    { tweetId, trackingPeriod = '24h', analyzeSpread = true }: ViralityTrackingArgs
) => {
    try {
        const socialClient = getSocialDataClient();
        
        // Search for retweets and mentions of the tweet
        const viralQuery = `${tweetId} OR url:${tweetId}`;
        const viralResult = await socialClient.searchTweets({
            query: viralQuery,
            maxResults: 100
        });

        // Search for quotes and discussions
        const discussionQuery = `"${tweetId}"`;
        const discussionResult = await socialClient.searchTweets({
            query: discussionQuery,
            maxResults: 50
        });

        const allInteractions = [...(viralResult.data || []), ...(discussionResult.data || [])];
        
        if (allInteractions.length === 0) {
            return createSocialDataResponse(`No viral spread detected for tweet ${tweetId}`);
        }

        // Analyze spread pattern
        const spreadAnalysis: any = {
            tweet_id: tweetId,
            tracking_period: trackingPeriod,
            total_interactions: allInteractions.length,
            spread_metrics: {
                direct_shares: viralResult.data?.length || 0,
                discussions: discussionResult.data?.length || 0,
                unique_users: new Set(allInteractions.map(t => t.user?.screen_name)).size
            }
        };

        if (analyzeSpread) {
            // Group by time to see spread velocity
            const timeGroups = new Map();
            allInteractions.forEach((tweet: any) => {
                const hour = new Date(tweet.tweet_created_at).toISOString().substring(0, 13);
                if (!timeGroups.has(hour)) {
                    timeGroups.set(hour, []);
                }
                timeGroups.get(hour).push(tweet);
            });

            const spreadVelocity = Array.from(timeGroups.entries())
                .map(([hour, tweets]: [string, any[]]) => ({
                    hour,
                    interactions: tweets.length,
                    cumulative: 0 // Will be calculated below
                }))
                .sort((a, b) => a.hour.localeCompare(b.hour));

            // Calculate cumulative spread
            let cumulative = 0;
            spreadVelocity.forEach(period => {
                cumulative += period.interactions;
                period.cumulative = cumulative;
            });

            // Find peak spread hour
            const peakHour = spreadVelocity.reduce((max, current) => 
                current.interactions > max.interactions ? current : max);

            // Analyze influential spreaders
            const userEngagement = new Map();
            allInteractions.forEach((tweet: any) => {
                const user = tweet.user?.screen_name;
                if (user) {
                    const engagement = (tweet.favorite_count || 0) + (tweet.retweet_count || 0);
                    userEngagement.set(user, (userEngagement.get(user) || 0) + engagement);
                }
            });

            const topSpreaders = Array.from(userEngagement.entries())
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10)
                .map(([user, engagement]) => ({ user, engagement }));

            spreadAnalysis.virality_analysis = {
                spread_velocity: spreadVelocity,
                peak_spread_hour: peakHour.hour,
                viral_coefficient: Math.round(allInteractions.length / Math.max(1, timeGroups.size)),
                spread_pattern: spreadVelocity.length > 5 ? 
                    (peakHour.interactions > spreadVelocity[0].interactions * 3 ? 'Exponential' : 'Linear') : 'Limited',
                top_spreaders: topSpreaders,
                reach_estimate: topSpreaders.reduce((sum, spreader) => sum + spreader.engagement, 0),
                viral_score: Math.min(100, Math.round(
                    (allInteractions.length * 0.3) + 
                    (userEngagement.size * 0.4) + 
                    (peakHour.interactions * 0.3)
                ))
            };
        }

        return createSocialDataResponse(
            formatAnalytics(spreadAnalysis, `Virality Tracking for Tweet ${tweetId}`)
        );
    } catch (error) {
        throw new Error(formatSocialDataError(error as Error, 'virality tracking'));
    }
};