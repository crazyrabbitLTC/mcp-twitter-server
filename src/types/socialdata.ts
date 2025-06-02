/**
 * Type definitions for SocialData.tools integration
 */

export interface SocialDataHandler<T = any> {
    (client: any, args: T): Promise<SocialDataHandlerResponse>;
}

export interface SocialDataHandlerResponse {
    response: string;
    tools?: any[];
}

// Search-related types
export interface AdvancedSearchArgs {
    query: string;
    maxResults?: number;
    startTime?: string;
    endTime?: string;
    includeRetweets?: boolean;
    language?: string;
}

export interface HistoricalSearchArgs {
    query: string;
    dateRange: {
        start: string;
        end: string;
    };
    maxResults?: number;
}

export interface TrendingTopicsArgs {
    location?: string;
    timeframe?: 'hourly' | 'daily' | 'weekly';
    count?: number;
}

// User research types
export interface BulkUserProfilesArgs {
    usernames?: string[];
    userIds?: string[];
    includeMetrics?: boolean;
}

export interface UserGrowthAnalyticsArgs {
    username: string;
    timeframe: 'daily' | 'weekly' | 'monthly';
    period?: number; // number of days/weeks/months
}

export interface UserInfluenceMetricsArgs {
    username: string;
    analyzeEngagement?: boolean;
    analyzeReach?: boolean;
}

// Thread and conversation types
export interface FullThreadArgs {
    tweetId: string;
    includeMetrics?: boolean;
}

export interface ConversationTreeArgs {
    tweetId: string;
    maxDepth?: number;
    includeQuotes?: boolean;
}

export interface ThreadMetricsArgs {
    tweetId: string;
    analyzeEngagement?: boolean;
    timeframe?: string;
}

// Network analysis types
export interface CommonFollowersArgs {
    user1: string;
    user2: string;
    maxResults?: number;
}

export interface FollowerAnalyticsArgs {
    username: string;
    sampleSize?: number;
    analyzeDemographics?: boolean;
}

export interface NetworkMappingArgs {
    centerUser: string;
    depth?: number;
    connectionTypes?: ('followers' | 'following' | 'mutual')[];
}

// Advanced analytics types
export interface HashtagTrendsArgs {
    hashtag: string;
    timeframe?: 'hourly' | 'daily' | 'weekly';
    period?: number;
}

export interface SentimentAnalysisArgs {
    query: string;
    sampleSize?: number;
    includeKeywords?: boolean;
}

export interface ViralityTrackingArgs {
    tweetId: string;
    trackingPeriod?: string;
    analyzeSpread?: boolean;
}