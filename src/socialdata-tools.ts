import { z } from 'zod';

export const SOCIALDATA_TOOLS = {
    // Advanced Search Tools
    advancedTweetSearch: {
        description: 'Advanced tweet search with operators and filters, bypassing API tier restrictions',
        inputSchema: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'Search query with advanced operators (e.g., "AI OR ML -crypto lang:en")'
                },
                maxResults: {
                    type: 'number',
                    description: 'Maximum number of results to return (default: 10, max: 100)',
                    minimum: 1,
                    maximum: 100
                },
                startTime: {
                    type: 'string',
                    description: 'Start time for search in ISO 8601 format (e.g., "2024-01-01T00:00:00Z")'
                },
                endTime: {
                    type: 'string',
                    description: 'End time for search in ISO 8601 format'
                },
                includeRetweets: {
                    type: 'boolean',
                    description: 'Whether to include retweets in results (default: true)'
                },
                language: {
                    type: 'string',
                    description: 'Language code to filter tweets (e.g., "en", "es", "fr")'
                }
            },
            required: ['query']
        }
    },
    
    historicalTweetSearch: {
        description: 'Search historical tweets beyond standard API limitations',
        inputSchema: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'Search query string'
                },
                dateRange: {
                    type: 'object',
                    properties: {
                        start: {
                            type: 'string',
                            description: 'Start date in ISO 8601 format'
                        },
                        end: {
                            type: 'string',
                            description: 'End date in ISO 8601 format'
                        }
                    },
                    required: ['start', 'end'],
                    description: 'Date range for historical search'
                },
                maxResults: {
                    type: 'number',
                    description: 'Maximum number of results (default: 50, max: 200)',
                    minimum: 1,
                    maximum: 200
                }
            },
            required: ['query', 'dateRange']
        }
    },

    trendingTopicsSearch: {
        description: 'Get trending topics and popular content for analysis',
        inputSchema: {
            type: 'object',
            properties: {
                location: {
                    type: 'string',
                    description: 'Location for trending topics (default: "worldwide")'
                },
                timeframe: {
                    type: 'string',
                    enum: ['hourly', 'daily', 'weekly'],
                    description: 'Timeframe for trending analysis (default: "hourly")'
                },
                count: {
                    type: 'number',
                    description: 'Number of trending topics to return (default: 10, max: 50)',
                    minimum: 1,
                    maximum: 50
                }
            },
            required: []
        }
    },

    // Enhanced User Research Tools
    bulkUserProfiles: {
        description: 'Get multiple user profiles in a single request for comparative analysis',
        inputSchema: {
            type: 'object',
            properties: {
                usernames: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Array of usernames to analyze (e.g., ["elonmusk", "sundarpichai"])',
                    maxItems: 20
                },
                userIds: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Array of user IDs to analyze',
                    maxItems: 20
                },
                includeMetrics: {
                    type: 'boolean',
                    description: 'Include detailed metrics and analytics (default: true)'
                }
            },
            required: []
        }
    },

    userGrowthAnalytics: {
        description: 'Analyze user growth patterns and engagement trends over time',
        inputSchema: {
            type: 'object',
            properties: {
                username: {
                    type: 'string',
                    description: 'Username to analyze growth patterns for'
                },
                timeframe: {
                    type: 'string',
                    enum: ['daily', 'weekly', 'monthly'],
                    description: 'Analysis timeframe (default: "weekly")'
                },
                period: {
                    type: 'number',
                    description: 'Number of periods to analyze (default: 4)',
                    minimum: 1,
                    maximum: 12
                }
            },
            required: ['username']
        }
    },

    userInfluenceMetrics: {
        description: 'Calculate user influence scores and engagement metrics',
        inputSchema: {
            type: 'object',
            properties: {
                username: {
                    type: 'string',
                    description: 'Username to analyze influence metrics for'
                },
                analyzeEngagement: {
                    type: 'boolean',
                    description: 'Include engagement analysis (default: true)'
                },
                analyzeReach: {
                    type: 'boolean',
                    description: 'Include reach and influence scoring (default: true)'
                }
            },
            required: ['username']
        }
    }
};