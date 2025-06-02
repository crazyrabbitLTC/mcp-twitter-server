/**
 * SocialData.tools client factory and configuration
 */
import { SocialDataClient, SocialDataConfig } from './client/socialdata.js';

let socialDataClient: SocialDataClient | null = null;

export function createSocialDataClient(): SocialDataClient | null {
    if (!socialDataClient) {
        const apiKey = process.env.SOCIALDATA_API_KEY;
        
        if (!apiKey) {
            return null;
        }

        const config: SocialDataConfig = {
            apiKey,
            baseUrl: process.env.SOCIALDATA_BASE_URL || 'https://api.socialdata.tools'
        };

        socialDataClient = new SocialDataClient(config);
    }

    return socialDataClient;
}

export function getSocialDataClient(): SocialDataClient | null {
    if (!socialDataClient) {
        return createSocialDataClient();
    }
    return socialDataClient;
}

// Reset client (useful for testing)
export function resetSocialDataClient(): void {
    socialDataClient = null;
}