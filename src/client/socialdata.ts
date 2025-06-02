/**
 * SocialData.tools API Client
 * Provides access to enhanced Twitter data without official API tier restrictions
 */

export interface SocialDataConfig {
    apiKey: string;
    baseUrl?: string;
}

export interface SearchOptions {
    query: string;
    maxResults?: number;
    startTime?: string;
    endTime?: string;
}

export interface UserSearchOptions {
    username?: string;
    userId?: string;
    includeMetrics?: boolean;
}

export interface TweetSearchResponse {
    data: any[];
    meta?: {
        result_count: number;
        next_token?: string;
    };
}

export interface UserProfileResponse {
    data: any;
    metrics?: any;
}

export class SocialDataClient {
    private apiKey: string;
    private baseUrl: string;

    constructor(config: SocialDataConfig) {
        this.apiKey = config.apiKey;
        this.baseUrl = config.baseUrl || 'https://api.socialdata.tools';
    }

    private async makeRequest(endpoint: string, params: Record<string, any> = {}): Promise<any> {
        const url = new URL(`${this.baseUrl}${endpoint}`);
        
        // Add API key to params
        const requestParams = { ...params, api_key: this.apiKey };
        
        // Add params to URL
        Object.entries(requestParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, String(value));
            }
        });

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Twitter-MCP-Server/1.0'
            }
        });

        if (!response.ok) {
            throw new Error(`SocialData API error: ${response.status} ${response.statusText}`);
        }

        return response.json();
    }

    async searchTweets(options: SearchOptions): Promise<TweetSearchResponse> {
        return this.makeRequest('/twitter/search', {
            query: options.query,
            count: options.maxResults || 10,
            start_time: options.startTime,
            end_time: options.endTime
        });
    }

    async getUserProfile(options: UserSearchOptions): Promise<UserProfileResponse> {
        const endpoint = options.username ? '/twitter/user/profile' : '/twitter/user/profile_by_id';
        const param = options.username ? { username: options.username } : { user_id: options.userId };
        
        return this.makeRequest(endpoint, {
            ...param,
            include_metrics: options.includeMetrics || true
        });
    }

    async getUserTweets(options: UserSearchOptions & { maxResults?: number }): Promise<TweetSearchResponse> {
        const endpoint = '/twitter/user/tweets';
        const param = options.username ? { username: options.username } : { user_id: options.userId };
        
        return this.makeRequest(endpoint, {
            ...param,
            count: options.maxResults || 10
        });
    }

    async getFollowers(options: UserSearchOptions & { maxResults?: number }): Promise<any> {
        const endpoint = '/twitter/user/followers';
        const param = options.username ? { username: options.username } : { user_id: options.userId };
        
        return this.makeRequest(endpoint, {
            ...param,
            count: options.maxResults || 100
        });
    }

    async getFollowing(options: UserSearchOptions & { maxResults?: number }): Promise<any> {
        const endpoint = '/twitter/user/following';
        const param = options.username ? { username: options.username } : { user_id: options.userId };
        
        return this.makeRequest(endpoint, {
            ...param,
            count: options.maxResults || 100
        });
    }
}