/**
 * Utility functions for SocialData.tools response formatting
 */
import { SocialDataHandlerResponse } from '../types/socialdata.js';

export function createSocialDataResponse(
    message: string, 
    tools?: any[]
): SocialDataHandlerResponse {
    return {
        response: message,
        tools: tools || []
    };
}

export function formatSocialDataError(error: Error, context: string): string {
    if (error.message.includes('401') || error.message.includes('403')) {
        return `SocialData API authentication failed: ${error.message}. Please check your SOCIALDATA_API_KEY in the .env file.`;
    }
    
    if (error.message.includes('429')) {
        return `SocialData API rate limit exceeded: ${error.message}. Please wait before making another request.`;
    }
    
    if (error.message.includes('500')) {
        return `SocialData API server error: ${error.message}. Please try again later.`;
    }
    
    return `SocialData ${context} failed: ${error.message}`;
}

export function formatUserList(users: any[], title: string): string {
    if (!users || users.length === 0) {
        return `No users found for ${title}`;
    }
    
    const formatted = users.map(user => ({
        username: user.username || user.screen_name,
        name: user.name || user.display_name,
        followers: user.public_metrics?.followers_count || user.followers_count,
        following: user.public_metrics?.following_count || user.following_count,
        verified: user.verified || false
    }));
    
    return `${title}:\n${JSON.stringify(formatted, null, 2)}`;
}

export function formatTweetList(tweets: any[], title: string): string {
    if (!tweets || tweets.length === 0) {
        return `No tweets found for ${title}`;
    }
    
    const formatted = tweets.map(tweet => ({
        id: tweet.id || tweet.id_str,
        text: tweet.text || tweet.full_text,
        author: tweet.author?.username || tweet.user?.screen_name,
        created_at: tweet.created_at,
        metrics: {
            likes: tweet.public_metrics?.like_count || tweet.favorite_count,
            retweets: tweet.public_metrics?.retweet_count || tweet.retweet_count,
            replies: tweet.public_metrics?.reply_count || tweet.reply_count
        }
    }));
    
    return `${title}:\n${JSON.stringify(formatted, null, 2)}`;
}

export function formatAnalytics(data: any, title: string): string {
    return `${title}:\n${JSON.stringify(data, null, 2)}`;
}