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
        
        // Add params to URL (don't include API key in params)
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, String(value));
            }
        });

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
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
        const params: Record<string, any> = {
            query: options.query
        };
        
        // Add optional parameters only if provided
        if (options.startTime) params.start_time = options.startTime;
        if (options.endTime) params.end_time = options.endTime;
        
        const result = await this.makeRequest('/twitter/search', params);
        
        // Transform response to match our expected format
        return {
            data: result.tweets || [],
            meta: {
                result_count: result.tweets?.length || 0,
                next_token: result.next_token
            }
        };
    }

    async getUserProfile(options: UserSearchOptions): Promise<UserProfileResponse> {
        // Use search to get user data as a fallback since direct profile endpoints may have issues
        const searchQuery = `from:${options.username || options.userId}`;
        return this.makeRequest('/twitter/search', {
            query: searchQuery,
            count: 1
        });
    }

    async getUserTweets(options: UserSearchOptions & { maxResults?: number }): Promise<TweetSearchResponse> {
        // Use search with from: operator to get user tweets
        const searchQuery = `from:${options.username || options.userId}`;
        const result = await this.makeRequest('/twitter/search', {
            query: searchQuery
        });
        
        return {
            data: result.tweets || [],
            meta: {
                result_count: result.tweets?.length || 0,
                next_token: result.next_token
            }
        };
    }

    async getFollowers(options: UserSearchOptions & { maxResults?: number }): Promise<any> {
        // This may not be available via search - will need specific endpoint
        // For now, return mock data indicating limitation
        return {
            data: [],
            meta: { result_count: 0 },
            note: 'Followers data requires specific API endpoint access'
        };
    }

    async getFollowing(options: UserSearchOptions & { maxResults?: number }): Promise<any> {
        // This may not be available via search - will need specific endpoint  
        // For now, return mock data indicating limitation
        return {
            data: [],
            meta: { result_count: 0 },
            note: 'Following data requires specific API endpoint access'
        };
    }
}