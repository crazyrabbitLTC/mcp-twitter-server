/**
 * SocialData.tools search handlers
 * Advanced search capabilities without API tier restrictions
 */
import { getSocialDataClient } from '../../socialDataClient.js';
import { 
    SocialDataHandler,
    AdvancedSearchArgs,
    HistoricalSearchArgs,
    TrendingTopicsArgs
} from '../../types/socialdata.js';
import { 
    createSocialDataResponse, 
    formatSocialDataError, 
    formatTweetList,
    createMissingApiKeyResponse
} from '../../utils/socialdata-response.js';

export const handleAdvancedTweetSearch: SocialDataHandler<AdvancedSearchArgs> = async (
    _client: any,
    { query, maxResults = 10, startTime, endTime, includeRetweets = true, language }: AdvancedSearchArgs
) => {
    try {
        const socialClient = getSocialDataClient();
        
        if (!socialClient) {
            return createMissingApiKeyResponse('Advanced Tweet Search');
        }
        
        // Build advanced query with operators
        let searchQuery = query;
        if (!includeRetweets) {
            searchQuery += ' -is:retweet';
        }
        if (language) {
            searchQuery += ` lang:${language}`;
        }
        
        const result = await socialClient.searchTweets({
            query: searchQuery,
            maxResults,
            startTime,
            endTime
        });

        if (!result.data || result.data.length === 0) {
            return createSocialDataResponse(`No tweets found for advanced search: ${query}`);
        }

        return createSocialDataResponse(
            formatTweetList(result.data, `Advanced Search Results for "${query}" (${result.data.length} tweets)`)
        );
    } catch (error) {
        throw new Error(formatSocialDataError(error as Error, 'advanced tweet search'));
    }
};

export const handleHistoricalTweetSearch: SocialDataHandler<HistoricalSearchArgs> = async (
    _client: any,
    { query, dateRange, maxResults = 50 }: HistoricalSearchArgs
) => {
    try {
        const socialClient = getSocialDataClient();
        
        if (!socialClient) {
            return createMissingApiKeyResponse('Historical Tweet Search');
        }
        
        const result = await socialClient.searchTweets({
            query,
            maxResults,
            startTime: dateRange.start,
            endTime: dateRange.end
        });

        if (!result.data || result.data.length === 0) {
            return createSocialDataResponse(
                `No historical tweets found for "${query}" between ${dateRange.start} and ${dateRange.end}`
            );
        }

        return createSocialDataResponse(
            formatTweetList(
                result.data, 
                `Historical Search Results for "${query}" (${dateRange.start} to ${dateRange.end})`
            )
        );
    } catch (error) {
        throw new Error(formatSocialDataError(error as Error, 'historical tweet search'));
    }
};

export const handleTrendingTopicsSearch: SocialDataHandler<TrendingTopicsArgs> = async (
    _client: any,
    { location = 'worldwide', timeframe = 'hourly', count = 10 }: TrendingTopicsArgs
) => {
    try {
        const socialClient = getSocialDataClient();
        
        if (!socialClient) {
            return createMissingApiKeyResponse('Trending Topics Search');
        }
        
        // For trending topics, we'll search for popular recent content
        const query = `filter:popular -filter:replies`;
        const now = new Date();
        const timeOffset = timeframe === 'hourly' ? 1 : timeframe === 'daily' ? 24 : 168; // hours
        const startTime = new Date(now.getTime() - timeOffset * 60 * 60 * 1000).toISOString();
        
        const result = await socialClient.searchTweets({
            query,
            maxResults: count,
            startTime,
            endTime: now.toISOString()
        });

        if (!result.data || result.data.length === 0) {
            return createSocialDataResponse(`No trending topics found for ${location} (${timeframe})`);
        }

        return createSocialDataResponse(
            formatTweetList(result.data, `Trending Topics - ${location} (${timeframe})`)
        );
    } catch (error) {
        throw new Error(formatSocialDataError(error as Error, 'trending topics search'));
    }
};