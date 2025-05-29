import { z } from 'zod';

export const TOOLS = {
    postTweet: {
        description: 'Post a tweet to Twitter',
        inputSchema: {
            type: 'object',
            properties: {
                text: { type: 'string', description: 'The text of the tweet' },
            },
            required: ['text'],
        },
    },
    postTweetWithMedia: {
        description: 'Post a tweet with media attachment to Twitter',
        inputSchema: {
            type: 'object',
            properties: {
                text: { type: 'string', description: 'The text of the tweet' },
                mediaPath: { type: 'string', description: 'Local file path to the media to upload' },
                mediaType: { 
                    type: 'string', 
                    enum: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'],
                    description: 'MIME type of the media file'
                },
                altText: { 
                    type: 'string', 
                    description: 'Alternative text for the media (accessibility)'
                }
            },
            required: ['text', 'mediaPath', 'mediaType'],
        },
    },
    likeTweet: {
        description: 'Like a tweet by its ID',
        inputSchema: {
            type: 'object',
            properties: {
                tweetId: { type: 'string', description: 'The ID of the tweet to like' }
            },
            required: ['tweetId'],
        },
    },
    unlikeTweet: {
        description: 'Unlike a previously liked tweet',
        inputSchema: {
            type: 'object',
            properties: {
                tweetId: { type: 'string', description: 'The ID of the tweet to unlike' }
            },
            required: ['tweetId'],
        },
    },
    getLikedTweets: {
        description: 'Get a list of tweets liked by a user',
        inputSchema: {
            type: 'object',
            properties: {
                userId: { type: 'string', description: 'The ID of the user whose likes to fetch' },
                maxResults: { 
                    type: 'number', 
                    description: 'The maximum number of results to return (default: 100, max: 100)',
                    minimum: 1,
                    maximum: 100
                },
                tweetFields: { 
                    type: 'array', 
                    items: { 
                        type: 'string',
                        enum: ['created_at', 'author_id', 'conversation_id', 'public_metrics', 'entities', 'context_annotations']
                    },
                    description: 'Additional tweet fields to include in the response'
                },
            },
            required: ['userId'],
        },
    },
    searchTweets: {
        description: 'Search for tweets using a query string',
        inputSchema: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'The search query'
                },
                maxResults: {
                    type: 'number',
                    description: 'Maximum number of results to return'
                },
                tweetFields: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Fields to include in the tweet objects'
                }
            },
            required: ['query']
        }
    },
    replyToTweet: {
        description: 'Reply to a tweet',
        inputSchema: {
            type: 'object',
            properties: {
                tweetId: {
                    type: 'string',
                    description: 'The ID of the tweet to reply to'
                },
                text: {
                    type: 'string',
                    description: 'The text of the reply'
                }
            },
            required: ['tweetId', 'text']
        }
    },
    getUserTimeline: {
        description: 'Get tweets from a specific user\'s timeline',
        inputSchema: {
            type: 'object',
            properties: {
                username: { 
                    type: 'string', 
                    description: 'The username of the user whose timeline to fetch' 
                },
                maxResults: { 
                    type: 'number', 
                    description: 'Maximum number of tweets to return (default: 10, max: 100)' 
                },
                tweetFields: { 
                    type: 'array', 
                    items: { type: 'string' },
                    description: 'Additional tweet fields to include' 
                }
            },
            required: ['username']
        }
    },
    getTweetById: {
        description: 'Get a tweet by its ID',
        inputSchema: {
            type: 'object',
            properties: {
                tweetId: {
                    type: 'string',
                    description: 'The ID of the tweet'
                },
                tweetFields: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Fields to include in the tweet object'
                }
            },
            required: ['tweetId']
        }
    },
    getUserInfo: {
        description: 'Get information about a Twitter user',
        inputSchema: {
            type: 'object',
            properties: {
                username: { type: 'string', description: 'The username of the user' },
            },
            required: ['username'],
        },
    },
    getAuthenticatedUser: {
        description: 'Get the authenticated user\'s own profile information without needing to specify username or ID',
        inputSchema: {
            type: 'object',
            properties: {
                userFields: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Additional user fields to include (e.g., ["id", "username", "name", "description", "public_metrics", "verified", "profile_image_url", "created_at"])'
                }
            },
            required: []
        }
    },
    getTweetsByIds: {
        description: 'Get multiple tweets by their IDs',
        inputSchema: {
            type: 'object',
            properties: {
                tweetIds: { 
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Array of tweet IDs to fetch',
                    maxItems: 100
                },
                tweetFields: { 
                    type: 'array', 
                    items: { 
                        type: 'string',
                        enum: ['created_at', 'author_id', 'conversation_id', 'public_metrics', 'entities', 'context_annotations']
                    },
                    description: 'Additional tweet fields to include in the response'
                },
            },
            required: ['tweetIds'],
        },
    },
    retweet: {
        description: 'Retweet a tweet by its ID',
        inputSchema: {
            type: 'object',
            properties: {
                tweetId: { type: 'string', description: 'The ID of the tweet to retweet' }
            },
            required: ['tweetId'],
        },
    },
    undoRetweet: {
        description: 'Undo a retweet by its ID',
        inputSchema: {
            type: 'object',
            properties: {
                tweetId: { type: 'string', description: 'The ID of the tweet to un-retweet' }
            },
            required: ['tweetId'],
        },
    },
    getRetweets: {
        description: 'Get a list of retweets of a tweet',
        inputSchema: {
            type: 'object',
            properties: {
                tweetId: { type: 'string', description: 'The ID of the tweet to get retweets for' },
                maxResults: { 
                    type: 'number', 
                    description: 'The maximum number of results to return (default: 100, max: 100)',
                    minimum: 1,
                    maximum: 100
                },
                userFields: { 
                    type: 'array', 
                    items: { 
                        type: 'string',
                        enum: ['description', 'profile_image_url', 'public_metrics', 'verified']
                    },
                    description: 'Additional user fields to include in the response'
                },
            },
            required: ['tweetId'],
        },
    },
    followUser: {
        description: 'Follow a user by their username',
        inputSchema: {
            type: 'object',
            properties: {
                username: { type: 'string', description: 'The username of the user to follow' }
            },
            required: ['username'],
        },
    },
    unfollowUser: {
        description: 'Unfollow a user by their username',
        inputSchema: {
            type: 'object',
            properties: {
                username: { type: 'string', description: 'The username of the user to unfollow' }
            },
            required: ['username'],
        },
    },
    getFollowers: {
        description: 'Get followers of a user',
        inputSchema: {
            type: 'object',
            properties: {
                username: {
                    type: 'string',
                    description: 'The username of the account'
                },
                maxResults: {
                    type: 'number',
                    description: 'Maximum number of followers to return'
                },
                userFields: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Fields to include in the user objects'
                }
            },
            required: ['username']
        }
    },
    getFollowing: {
        description: 'Get a list of users that a user is following',
        inputSchema: {
            type: 'object',
            properties: {
                username: { type: 'string', description: 'The username of the user whose following list to fetch' },
                maxResults: { 
                    type: 'number', 
                    description: 'The maximum number of results to return (default: 100, max: 1000)',
                    minimum: 1,
                    maximum: 1000
                },
                userFields: { 
                    type: 'array', 
                    items: { 
                        type: 'string',
                        enum: ['description', 'profile_image_url', 'public_metrics', 'verified', 'location', 'url']
                    },
                    description: 'Additional user fields to include in the response'
                },
            },
            required: ['username'],
        },
    },
    createList: {
        description: 'Create a new Twitter list',
        inputSchema: {
            type: 'object',
            properties: {
                name: { type: 'string', description: 'The name of the list' },
                description: { type: 'string', description: 'A description of the list' },
                private: { type: 'boolean', description: 'Whether the list should be private' }
            },
            required: ['name'],
        },
    },
    addUserToList: {
        description: 'Add a user to a Twitter list',
        inputSchema: {
            type: 'object',
            properties: {
                listId: { type: 'string', description: 'The ID of the list' },
                username: { type: 'string', description: 'The username of the user to add' }
            },
            required: ['listId', 'username'],
        },
    },
    removeUserFromList: {
        description: 'Remove a user from a Twitter list',
        inputSchema: {
            type: 'object',
            properties: {
                listId: { type: 'string', description: 'The ID of the list' },
                username: { type: 'string', description: 'The username of the user to remove' }
            },
            required: ['listId', 'username'],
        },
    },
    getListMembers: {
        description: 'Get members of a Twitter list',
        inputSchema: {
            type: 'object',
            properties: {
                listId: { type: 'string', description: 'The ID of the list' },
                maxResults: { 
                    type: 'number', 
                    description: 'The maximum number of results to return (default: 100, max: 100)',
                    minimum: 1,
                    maximum: 100
                },
                userFields: { 
                    type: 'array', 
                    items: { 
                        type: 'string',
                        enum: ['description', 'profile_image_url', 'public_metrics', 'verified', 'location', 'url']
                    },
                    description: 'Additional user fields to include in the response'
                },
            },
            required: ['listId'],
        },
    },
    getUserLists: {
        description: 'Get lists owned by a user',
        inputSchema: {
            type: 'object',
            properties: {
                username: { type: 'string', description: 'The username of the user whose lists to fetch' },
                maxResults: { 
                    type: 'number', 
                    description: 'The maximum number of results to return (default: 100, max: 100)',
                    minimum: 1,
                    maximum: 100
                },
                listFields: { 
                    type: 'array', 
                    items: { 
                        type: 'string',
                        enum: ['created_at', 'follower_count', 'member_count', 'private', 'description']
                    },
                    description: 'Additional list fields to include in the response'
                },
            },
            required: ['username'],
        },
    },
    getHashtagAnalytics: {
        description: 'Get analytics for a specific hashtag',
        inputSchema: {
            type: 'object',
            properties: {
                hashtag: {
                    type: 'string',
                    description: 'The hashtag to analyze (with or without #)'
                },
                startTime: {
                    type: 'string',
                    description: 'Start time for the analysis (ISO 8601)'
                },
                endTime: {
                    type: 'string',
                    description: 'End time for the analysis (ISO 8601)'
                }
            },
            required: ['hashtag']
        }
    },
    deleteTweet: {
        description: 'Delete a tweet by its ID',
        inputSchema: {
            type: 'object',
            properties: {
                tweetId: {
                    type: 'string',
                    description: 'The ID of the tweet to delete'
                }
            },
            required: ['tweetId']
        }
    },
    // Direct Message Tools
    sendDirectMessage: {
        description: 'Send a direct message to a specified user',
        inputSchema: {
            type: 'object',
            properties: {
                recipientId: { 
                    type: 'string', 
                    description: 'The ID of the user to send the message to' 
                },
                text: { 
                    type: 'string', 
                    description: 'The text content of the direct message' 
                },
                mediaId: { 
                    type: 'string', 
                    description: 'Optional media ID for attaching media to the message' 
                },
                attachments: { 
                    type: 'array', 
                    items: { type: 'string' },
                    description: 'Optional array of media IDs to attach to the message' 
                }
            },
            required: ['recipientId', 'text']
        }
    },
    getDirectMessages: {
        description: 'Retrieve direct message conversations',
        inputSchema: {
            type: 'object',
            properties: {
                maxResults: { 
                    type: 'number', 
                    description: 'Maximum number of results to return (default: 100, max: 100)',
                    minimum: 1,
                    maximum: 100
                },
                paginationToken: { 
                    type: 'string', 
                    description: 'Pagination token for retrieving next page of results' 
                },
                dmEventFields: { 
                    type: 'array', 
                    items: { 
                        type: 'string',
                        enum: ['id', 'text', 'created_at', 'sender_id', 'dm_conversation_id', 'referenced_tweet', 'attachments']
                    },
                    description: 'Fields to include in the DM event objects' 
                }
            },
            required: []
        }
    },
    getDirectMessageEvents: {
        description: 'Get specific direct message events with detailed information',
        inputSchema: {
            type: 'object',
            properties: {
                maxResults: { 
                    type: 'number', 
                    description: 'Maximum number of results to return (default: 100, max: 100)',
                    minimum: 1,
                    maximum: 100
                },
                paginationToken: { 
                    type: 'string', 
                    description: 'Pagination token for retrieving next page of results' 
                },
                dmEventFields: { 
                    type: 'array', 
                    items: { 
                        type: 'string',
                        enum: ['id', 'text', 'created_at', 'sender_id', 'dm_conversation_id', 'referenced_tweet', 'attachments']
                    },
                    description: 'Fields to include in the DM event objects' 
                },
                expansions: { 
                    type: 'array', 
                    items: { 
                        type: 'string',
                        enum: ['sender_id', 'referenced_tweet.id', 'attachments.media_keys']
                    },
                    description: 'Additional fields to expand in the response' 
                },
                userFields: { 
                    type: 'array', 
                    items: { 
                        type: 'string',
                        enum: ['username', 'name', 'profile_image_url', 'verified']
                    },
                    description: 'User fields to include when expanding sender information' 
                }
            },
            required: []
        }
    },
    getConversation: {
        description: 'Get full conversation history for a specific conversation',
        inputSchema: {
            type: 'object',
            properties: {
                conversationId: { 
                    type: 'string', 
                    description: 'The ID of the conversation to retrieve' 
                },
                maxResults: { 
                    type: 'number', 
                    description: 'Maximum number of messages to return (default: 100, max: 100)',
                    minimum: 1,
                    maximum: 100
                },
                paginationToken: { 
                    type: 'string', 
                    description: 'Pagination token for retrieving next page of results' 
                },
                dmEventFields: { 
                    type: 'array', 
                    items: { 
                        type: 'string',
                        enum: ['id', 'text', 'created_at', 'sender_id', 'dm_conversation_id', 'referenced_tweet', 'attachments']
                    },
                    description: 'Fields to include in the DM event objects' 
                }
            },
            required: ['conversationId']
        }
    },
    markAsRead: {
        description: 'Mark direct messages as read (Note: May require special API access)',
        inputSchema: {
            type: 'object',
            properties: {
                messageId: { 
                    type: 'string', 
                    description: 'The ID of the message to mark as read' 
                },
                conversationId: { 
                    type: 'string', 
                    description: 'Optional conversation ID for context' 
                }
            },
            required: ['messageId']
        }
    },
    createMediaMessage: {
        description: 'Send a direct message with media attachments',
        inputSchema: {
            type: 'object',
            properties: {
                recipientId: { 
                    type: 'string', 
                    description: 'The ID of the user to send the message to' 
                },
                text: { 
                    type: 'string', 
                    description: 'The text content of the direct message' 
                },
                mediaId: { 
                    type: 'string', 
                    description: 'The media ID of the uploaded media to attach' 
                },
                mediaType: { 
                    type: 'string', 
                    enum: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'],
                    description: 'MIME type of the media file' 
                },
                altText: { 
                    type: 'string', 
                    description: 'Alternative text for the media (accessibility)' 
                }
            },
            required: ['recipientId', 'text', 'mediaId']
        }
    },
    // User Moderation Tools
    blockUser: {
        description: 'Block a user account to prevent them from following you or viewing your tweets',
        inputSchema: {
            type: 'object',
            properties: {
                userId: { 
                    type: 'string', 
                    description: 'The ID of the user to block' 
                },
                username: { 
                    type: 'string', 
                    description: 'The username of the user to block (alternative to userId)' 
                }
            },
            required: []
        }
    },
    unblockUser: {
        description: 'Unblock a previously blocked user account',
        inputSchema: {
            type: 'object',
            properties: {
                userId: { 
                    type: 'string', 
                    description: 'The ID of the user to unblock' 
                },
                username: { 
                    type: 'string', 
                    description: 'The username of the user to unblock (alternative to userId)' 
                }
            },
            required: []
        }
    },
    getBlockedUsers: {
        description: 'Retrieve a paginated list of users you have blocked',
        inputSchema: {
            type: 'object',
            properties: {
                maxResults: { 
                    type: 'number', 
                    description: 'Maximum number of blocked users to return (default: 100, max: 1000)',
                    minimum: 1,
                    maximum: 1000
                },
                paginationToken: { 
                    type: 'string', 
                    description: 'Pagination token for retrieving next page of results' 
                },
                userFields: { 
                    type: 'array', 
                    items: { 
                        type: 'string',
                        enum: ['id', 'name', 'username', 'description', 'profile_image_url', 'public_metrics', 'verified', 'location', 'url']
                    },
                    description: 'User fields to include in the response' 
                }
            },
            required: []
        }
    },
    muteUser: {
        description: 'Mute a user account to stop seeing their tweets in your timeline',
        inputSchema: {
            type: 'object',
            properties: {
                userId: { 
                    type: 'string', 
                    description: 'The ID of the user to mute' 
                },
                username: { 
                    type: 'string', 
                    description: 'The username of the user to mute (alternative to userId)' 
                }
            },
            required: []
        }
    },
    unmuteUser: {
        description: 'Unmute a previously muted user account',
        inputSchema: {
            type: 'object',
            properties: {
                userId: { 
                    type: 'string', 
                    description: 'The ID of the user to unmute' 
                },
                username: { 
                    type: 'string', 
                    description: 'The username of the user to unmute (alternative to userId)' 
                }
            },
            required: []
        }
    },
    getMutedUsers: {
        description: 'Retrieve a paginated list of users you have muted',
        inputSchema: {
            type: 'object',
            properties: {
                maxResults: { 
                    type: 'number', 
                    description: 'Maximum number of muted users to return (default: 100, max: 1000)',
                    minimum: 1,
                    maximum: 1000
                },
                paginationToken: { 
                    type: 'string', 
                    description: 'Pagination token for retrieving next page of results' 
                },
                userFields: { 
                    type: 'array', 
                    items: { 
                        type: 'string',
                        enum: ['id', 'name', 'username', 'description', 'profile_image_url', 'public_metrics', 'verified', 'location', 'url']
                    },
                    description: 'User fields to include in the response' 
                }
            },
            required: []
        }
    }
}; 