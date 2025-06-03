import { TwitterApi } from 'twitter-api-v2';
import { TwitterClient } from './client/twitter.js';

export { TwitterClient } from './client/twitter.js';

export function createTwitterClient(): TwitterClient | null {
    const appKey = process.env.X_API_KEY;
    const appSecret = process.env.X_API_SECRET;
    const accessToken = process.env.X_ACCESS_TOKEN;
    const accessSecret = process.env.X_ACCESS_TOKEN_SECRET;

    // Check if all required credentials are provided
    if (!appKey || !appSecret || !accessToken || !accessSecret) {
        return null;
    }

    try {
        const client = new TwitterClient({
            appKey,
            appSecret,
            accessToken,
            accessSecret,
        });
        return client;
    } catch (error) {
        console.error('Failed to initialize Twitter client:', error);
        return null;
    }
} 