/**
 * SocialData.tools client factory and configuration
 */
import { SocialDataClient, SocialDataConfig } from './client/socialdata.js';

let socialDataClient: SocialDataClient | null = null;

export function createSocialDataClient(): SocialDataClient {
    if (!socialDataClient) {
        const apiKey = process.env.SOCIALDATA_API_KEY;
        
        if (!apiKey) {
            throw new Error(
                'SOCIALDATA_API_KEY environment variable is required. ' +
                'Get your API key from https://socialdata.tools and add it to your .env file.'
            );
        }

        const config: SocialDataConfig = {
            apiKey,
            baseUrl: process.env.SOCIALDATA_BASE_URL || 'https://api.socialdata.tools'
        };

        socialDataClient = new SocialDataClient(config);
    }

    return socialDataClient;
}

export function getSocialDataClient(): SocialDataClient {
    if (!socialDataClient) {
        return createSocialDataClient();
    }
    return socialDataClient;
}

// Reset client (useful for testing)
export function resetSocialDataClient(): void {
    socialDataClient = null;
}