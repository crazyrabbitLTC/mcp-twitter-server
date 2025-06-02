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
    },

    // Thread and Conversation Analysis Tools
    getFullThread: {
        description: 'Reconstruct complete Twitter thread with all tweets and replies',
        inputSchema: {
            type: 'object',
            properties: {
                tweetId: {
                    type: 'string',
                    description: 'The ID of the tweet to analyze thread for'
                },
                includeMetrics: {
                    type: 'boolean',
                    description: 'Include engagement metrics for each tweet (default: true)'
                }
            },
            required: ['tweetId']
        }
    },

    getConversationTree: {
        description: 'Map complete conversation structure including replies and quotes',
        inputSchema: {
            type: 'object',
            properties: {
                tweetId: {
                    type: 'string',
                    description: 'The root tweet ID to map conversation for'
                },
                maxDepth: {
                    type: 'number',
                    description: 'Maximum conversation depth to analyze (default: 3)',
                    minimum: 1,
                    maximum: 5
                },
                includeQuotes: {
                    type: 'boolean',
                    description: 'Include quote tweets in analysis (default: true)'
                }
            },
            required: ['tweetId']
        }
    },

    getThreadMetrics: {
        description: 'Analyze thread performance and engagement distribution',
        inputSchema: {
            type: 'object',
            properties: {
                tweetId: {
                    type: 'string',
                    description: 'The thread root tweet ID'
                },
                analyzeEngagement: {
                    type: 'boolean',
                    description: 'Include detailed engagement analysis (default: true)'
                },
                timeframe: {
                    type: 'string',
                    description: 'Analysis timeframe (default: "24h")'
                }
            },
            required: ['tweetId']
        }
    },

    // Network Analysis Tools
    findMutualConnections: {
        description: 'Find mutual connections and interactions between two users',
        inputSchema: {
            type: 'object',
            properties: {
                user1: {
                    type: 'string',
                    description: 'First username (without @)'
                },
                user2: {
                    type: 'string',
                    description: 'Second username (without @)'
                },
                maxResults: {
                    type: 'number',
                    description: 'Maximum results to return (default: 20)',
                    minimum: 5,
                    maximum: 50
                }
            },
            required: ['user1', 'user2']
        }
    },

    analyzeFollowerDemographics: {
        description: 'Analyze follower demographics and engagement patterns',
        inputSchema: {
            type: 'object',
            properties: {
                username: {
                    type: 'string',
                    description: 'Username to analyze followers for'
                },
                sampleSize: {
                    type: 'number',
                    description: 'Sample size for analysis (default: 50)',
                    minimum: 10,
                    maximum: 100
                },
                analyzeDemographics: {
                    type: 'boolean',
                    description: 'Include demographic breakdown (default: true)'
                }
            },
            required: ['username']
        }
    },

    mapInfluenceNetwork: {
        description: 'Map user influence network and connection patterns',
        inputSchema: {
            type: 'object',
            properties: {
                centerUser: {
                    type: 'string',
                    description: 'Central user to map network around'
                },
                depth: {
                    type: 'number',
                    description: 'Network depth to analyze (default: 2)',
                    minimum: 1,
                    maximum: 3
                },
                connectionTypes: {
                    type: 'array',
                    items: {
                        type: 'string',
                        enum: ['followers', 'following', 'mutual']
                    },
                    description: 'Types of connections to analyze'
                }
            },
            required: ['centerUser']
        }
    },

    // Advanced Analytics Tools
    getHashtagTrends: {
        description: 'Analyze hashtag trends and performance over time',
        inputSchema: {
            type: 'object',
            properties: {
                hashtag: {
                    type: 'string',
                    description: 'Hashtag to analyze (with or without #)'
                },
                timeframe: {
                    type: 'string',
                    enum: ['hourly', 'daily', 'weekly'],
                    description: 'Analysis timeframe (default: "daily")'
                },
                period: {
                    type: 'number',
                    description: 'Number of periods to analyze (default: 7)',
                    minimum: 1,
                    maximum: 30
                }
            },
            required: ['hashtag']
        }
    },

    analyzeSentiment: {
        description: 'Perform sentiment analysis on tweets matching a query',
        inputSchema: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'Search query for sentiment analysis'
                },
                sampleSize: {
                    type: 'number',
                    description: 'Number of tweets to analyze (default: 50)',
                    minimum: 10,
                    maximum: 200
                },
                includeKeywords: {
                    type: 'boolean',
                    description: 'Include keyword frequency analysis (default: true)'
                }
            },
            required: ['query']
        }
    },

    trackVirality: {
        description: 'Track viral spread patterns and engagement velocity',
        inputSchema: {
            type: 'object',
            properties: {
                tweetId: {
                    type: 'string',
                    description: 'Tweet ID to track virality for'
                },
                trackingPeriod: {
                    type: 'string',
                    description: 'Period to track (default: "24h")'
                },
                analyzeSpread: {
                    type: 'boolean',
                    description: 'Include detailed spread analysis (default: true)'
                }
            },
            required: ['tweetId']
        }
    }
};