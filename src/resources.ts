import { Resource } from '@modelcontextprotocol/sdk/types.js';
import { TwitterClient } from './client/twitter.js';

export const RESOURCES: Resource[] = [
    {
        uri: 'twitter://api/rate-limits',
        name: 'Twitter API Rate Limits',
        description: 'Current rate limits and usage information for Twitter API endpoints',
        mimeType: 'application/json'
    },
    {
        uri: 'twitter://api/access-level',
        name: 'API Access Level Information',
        description: 'Information about current Twitter API access level and capabilities',
        mimeType: 'text/markdown'
    },
    {
        uri: 'twitter://tools/working-status',
        name: 'Tool Status Report',
        description: 'Current status of all Twitter MCP tools and their functionality',
        mimeType: 'application/json'
    },
    {
        uri: 'twitter://guides/quick-start',
        name: 'Quick Start Guide',
        description: 'Getting started with Twitter MCP server tools and workflows',
        mimeType: 'text/markdown'
    },
    {
        uri: 'twitter://templates/common-workflows',
        name: 'Common Workflow Templates',
        description: 'Pre-built templates for common Twitter automation workflows',
        mimeType: 'application/json'
    },
    {
        uri: 'twitter://user/{username}',
        name: 'User Profile Data',
        description: 'Dynamic user profile information and recent activity',
        mimeType: 'application/json'
    }
];

export async function handleResource(uri: string, client?: TwitterClient): Promise<{ contents: Array<{ type: string; text: string }> }> {
    // Handle twitter:// protocol by extracting the path
    const path = uri.replace('twitter://', '/');
    
    switch (path) {
        case '/api/rate-limits':
            return {
                contents: [{
                    type: 'text',
                    text: JSON.stringify(getRateLimitsInfo(), null, 2)
                }]
            };
            
        case '/api/access-level':
            return {
                contents: [{
                    type: 'text',
                    text: getAccessLevelInfo()
                }]
            };
            
        case '/tools/working-status':
            return {
                contents: [{
                    type: 'text',
                    text: JSON.stringify(getToolStatusReport(), null, 2)
                }]
            };
            
        case '/guides/quick-start':
            return {
                contents: [{
                    type: 'text',
                    text: getQuickStartGuide()
                }]
            };
            
        case '/templates/common-workflows':
            return {
                contents: [{
                    type: 'text',
                    text: JSON.stringify(getCommonWorkflowTemplates(), null, 2)
                }]
            };
            
        default:
            // Handle dynamic user resources
            const userMatch = path.match(/^\/user\/(.+)$/);
            if (userMatch && client) {
                const username = userMatch[1];
                try {
                    const userInfo = await client.v2.userByUsername(username, {
                        'user.fields': ['description', 'public_metrics', 'profile_image_url', 'verified', 'created_at']
                    });
                    
                    return {
                        contents: [{
                            type: 'text',
                            text: JSON.stringify({
                                user: userInfo.data,
                                lastUpdated: new Date().toISOString(),
                                source: 'Twitter API v2'
                            }, null, 2)
                        }]
                    };
                } catch (error) {
                    return {
                        contents: [{
                            type: 'text',
                            text: JSON.stringify({
                                error: `Failed to fetch user data: ${error instanceof Error ? error.message : 'Unknown error'}`,
                                username,
                                timestamp: new Date().toISOString()
                            }, null, 2)
                        }]
                    };
                }
            }
            
            throw new Error(`Unknown resource: ${uri}`);
    }
}

function getRateLimitsInfo() {
    return {
        "access_level": "Basic ($200/month)",
        "monthly_limits": {
            "posts_read": "10,000 per month",
            "posts_write": "15,000 per month",
            "apps_per_project": 2
        },
        "rate_limits": {
            "posts_and_reposts": "300 per 3 hours",
            "likes": "1,000 per 24 hours",
            "follows": "1,000 per 24 hours",
            "direct_messages": "15,000 per 24 hours"
        },
        "endpoints_requiring_upgrade": [
            "searchTweets (requires Pro $5,000/month)",
            "getHashtagAnalytics (requires Pro $5,000/month)",
            "getFollowers (may require Pro or special permissions)",
            "getFollowing (may require Pro or special permissions)",
            "getLikedTweets (may require elevated permissions)"
        ],
        "last_updated": new Date().toISOString()
    };
}

function getAccessLevelInfo(): string {
    return `# Twitter API Access Level Information

## Current Access: Basic Tier ($200/month)

### ✅ Available Features:
- **Basic CRUD Operations**: Post, delete, like, retweet tweets
- **User Management**: Follow/unfollow users, get user info
- **Timeline Access**: Get user timelines and tweet details
- **List Management**: Create and manage Twitter lists
- **Engagement**: Like, retweet, reply to tweets

### ❌ Limited/Unavailable Features:
- **Search Functionality**: Requires Pro tier ($5,000/month)
- **Hashtag Analytics**: Requires Pro tier for search-based analytics
- **Follower Data**: May require special permissions or Pro tier
- **Advanced Analytics**: Limited engagement data access

### 📊 Usage Limits:
- **Monthly Post Reads**: 10,000
- **Monthly Post Writes**: 15,000
- **Apps per Project**: 2
- **Rate Limits**: See rate-limits resource for details

### 🚀 Upgrade Options:
- **Pro Tier**: $5,000/month - Includes search, analytics, 1M posts/month
- **Enterprise**: $42,000+/month - Full access, 50M+ posts/month

### 📞 Support:
- Developer Portal: https://developer.x.com/en/portal
- Documentation: https://developer.x.com/en/docs/x-api
- Community Forum: https://twittercommunity.com/

Last Updated: ${new Date().toISOString()}`;
}

function getToolStatusReport() {
    return {
        "summary": {
            "total_tools": 22,
            "working_tools": 18,
            "limited_tools": 4,
            "success_rate": "82%"
        },
        "working_tools": [
            {
                "name": "getUserInfo",
                "status": "✅ Working",
                "description": "Retrieves user profile information"
            },
            {
                "name": "postTweet",
                "status": "✅ Working",
                "description": "Posts new tweets"
            },
            {
                "name": "getTweetById",
                "status": "✅ Working",
                "description": "Retrieves tweet details by ID"
            },
            {
                "name": "likeTweet",
                "status": "✅ Working",
                "description": "Likes a tweet"
            },
            {
                "name": "unlikeTweet",
                "status": "✅ Working",
                "description": "Unlikes a tweet"
            },
            {
                "name": "retweet",
                "status": "✅ Working",
                "description": "Retweets a tweet"
            },
            {
                "name": "undoRetweet",
                "status": "✅ Working",
                "description": "Undoes a retweet"
            },
            {
                "name": "replyToTweet",
                "status": "✅ Working",
                "description": "Replies to a tweet"
            },
            {
                "name": "deleteTweet",
                "status": "✅ Working",
                "description": "Deletes a tweet"
            },
            {
                "name": "getUserTimeline",
                "status": "✅ Working",
                "description": "Gets user's recent tweets"
            },
            {
                "name": "followUser",
                "status": "✅ Working",
                "description": "Follows a user"
            },
            {
                "name": "unfollowUser",
                "status": "✅ Working",
                "description": "Unfollows a user"
            },
            {
                "name": "createList",
                "status": "✅ Working",
                "description": "Creates a new Twitter list"
            },
            {
                "name": "getUserLists",
                "status": "✅ Working",
                "description": "Gets user's list memberships"
            },
            {
                "name": "getRetweets",
                "status": "✅ Working",
                "description": "Gets users who retweeted a tweet"
            }
        ],
        "limited_tools": [
            {
                "name": "searchTweets",
                "status": "⚠️ Limited",
                "reason": "Requires Pro tier access ($5,000/month)",
                "error_type": "400 - Invalid Request"
            },
            {
                "name": "getHashtagAnalytics",
                "status": "⚠️ Limited",
                "reason": "Requires Pro tier access for search functionality",
                "error_type": "400 - Invalid Request"
            },
            {
                "name": "getFollowers",
                "status": "⚠️ Limited",
                "reason": "Requires elevated permissions or Pro tier",
                "error_type": "403 - Forbidden"
            },
            {
                "name": "getFollowing",
                "status": "⚠️ Limited",
                "reason": "Requires elevated permissions or Pro tier",
                "error_type": "403 - Forbidden"
            },
            {
                "name": "getLikedTweets",
                "status": "⚠️ Limited",
                "reason": "May require elevated permissions",
                "error_type": "400 - Invalid Request"
            }
        ],
        "recommendations": [
            "Consider upgrading to Pro tier for search and analytics functionality",
            "Use working tools for core Twitter automation workflows",
            "Implement alternative data collection methods for limited endpoints",
            "Monitor API usage to stay within monthly limits"
        ],
        "last_updated": new Date().toISOString()
    };
}

function getQuickStartGuide(): string {
    return `# Twitter MCP Server Quick Start Guide

## Overview
This MCP server provides 22 Twitter API tools for automation, analytics, and engagement.

## 🚀 Getting Started

### 1. Basic Tweet Operations
\`\`\`javascript
// Post a tweet
postTweet({ text: "Hello from MCP! 🤖" })

// Get tweet details
getTweetById({ tweetId: "1234567890" })

// Reply to a tweet
replyToTweet({ tweetId: "1234567890", text: "Great post!" })
\`\`\`

### 2. User Management
\`\`\`javascript
// Get user information
getUserInfo({ username: "elonmusk" })

// Follow a user
followUser({ username: "openai" })

// Get user's timeline
getUserTimeline({ userId: "44196397", maxResults: 10 })
\`\`\`

### 3. Engagement Operations
\`\`\`javascript
// Like a tweet
likeTweet({ tweetId: "1234567890" })

// Retweet
retweet({ tweetId: "1234567890" })

// Get retweet users
getRetweets({ tweetId: "1234567890", maxResults: 10 })
\`\`\`

### 4. List Management
\`\`\`javascript
// Create a list
createList({ name: "Tech Leaders", description: "Industry thought leaders" })

// Get user's lists
getUserLists({ username: "jack", maxResults: 10 })
\`\`\`

## ⚠️ Access Limitations

### Working Tools (18/22):
- All basic CRUD operations
- User management and timelines
- Engagement features
- List management

### Limited Tools (4/22):
- \`searchTweets\`: Requires Pro tier ($5,000/month)
- \`getHashtagAnalytics\`: Requires Pro tier
- \`getFollowers\`/\`getFollowing\`: May require special permissions
- \`getLikedTweets\`: May require elevated permissions

## 🎯 Common Workflows

### Content Publishing Workflow:
1. Use \`getUserInfo\` to research target audience
2. Use prompts for content strategy guidance
3. Use \`postTweet\` to publish content
4. Use \`likeTweet\`/\`retweet\` for engagement

### Analytics Workflow:
1. Use \`getUserTimeline\` for content analysis
2. Use \`getRetweets\` for engagement metrics
3. Use \`getUserInfo\` for follower insights

### Community Management:
1. Use \`getUserTimeline\` to monitor mentions
2. Use \`replyToTweet\` for responses
3. Use \`followUser\` for relationship building

## 📚 Additional Resources

- **Prompts**: Use MCP prompts for workflow guidance
- **Resources**: Access dynamic data and documentation
- **Error Handling**: All tools provide clear error messages with upgrade guidance

## 🔧 Troubleshooting

- **400 Errors**: Usually indicate API access level limitations
- **403 Errors**: Indicate permission restrictions
- **Rate Limits**: Monitor usage via rate-limits resource

For detailed tool documentation, use the MCP tools list functionality.

Last Updated: ${new Date().toISOString()}`;
}

function getCommonWorkflowTemplates() {
    return {
        "content_publishing": {
            "name": "Content Publishing Workflow",
            "description": "Complete workflow for researching, creating, and publishing Twitter content",
            "steps": [
                {
                    "step": 1,
                    "action": "research_audience",
                    "tool": "getUserInfo",
                    "parameters": { "username": "{target_username}" },
                    "description": "Research target audience and competitors"
                },
                {
                    "step": 2,
                    "action": "compose_content",
                    "tool": "prompt",
                    "parameters": { "name": "compose-tweet", "topic": "{content_topic}" },
                    "description": "Use composition prompt for content guidance"
                },
                {
                    "step": 3,
                    "action": "publish_tweet",
                    "tool": "postTweet",
                    "parameters": { "text": "{composed_tweet}" },
                    "description": "Publish the composed tweet"
                },
                {
                    "step": 4,
                    "action": "engage_audience",
                    "tool": "likeTweet",
                    "parameters": { "tweetId": "{related_tweet_id}" },
                    "description": "Engage with related content for visibility"
                }
            ]
        },
        "community_management": {
            "name": "Community Management Workflow",
            "description": "Workflow for managing community interactions and responses",
            "steps": [
                {
                    "step": 1,
                    "action": "monitor_mentions",
                    "tool": "getUserTimeline",
                    "parameters": { "userId": "{your_user_id}", "maxResults": 20 },
                    "description": "Monitor recent activity and mentions"
                },
                {
                    "step": 2,
                    "action": "get_guidance",
                    "tool": "prompt",
                    "parameters": { "name": "community-management", "scenario": "customer_service" },
                    "description": "Get response guidance for the scenario"
                },
                {
                    "step": 3,
                    "action": "respond_to_users",
                    "tool": "replyToTweet",
                    "parameters": { "tweetId": "{mention_tweet_id}", "text": "{response_text}" },
                    "description": "Respond to user inquiries or comments"
                },
                {
                    "step": 4,
                    "action": "follow_valuable_users",
                    "tool": "followUser",
                    "parameters": { "username": "{valuable_username}" },
                    "description": "Build relationships with valuable community members"
                }
            ]
        },
        "analytics_collection": {
            "name": "Analytics Collection Workflow",
            "description": "Workflow for collecting and analyzing Twitter performance data",
            "steps": [
                {
                    "step": 1,
                    "action": "get_profile_metrics",
                    "tool": "getUserInfo",
                    "parameters": { "username": "{target_username}" },
                    "description": "Collect basic profile metrics and information"
                },
                {
                    "step": 2,
                    "action": "analyze_content",
                    "tool": "getUserTimeline",
                    "parameters": { "userId": "{user_id}", "maxResults": 50 },
                    "description": "Analyze recent content performance"
                },
                {
                    "step": 3,
                    "action": "check_engagement",
                    "tool": "getRetweets",
                    "parameters": { "tweetId": "{top_tweet_id}", "maxResults": 100 },
                    "description": "Analyze engagement on top performing content"
                },
                {
                    "step": 4,
                    "action": "generate_report",
                    "tool": "prompt",
                    "parameters": { "name": "analytics-report", "username": "{target_username}" },
                    "description": "Generate comprehensive analytics report"
                }
            ]
        },
        "list_management": {
            "name": "List Management Workflow",
            "description": "Workflow for organizing and managing Twitter lists",
            "steps": [
                {
                    "step": 1,
                    "action": "create_industry_list",
                    "tool": "createList",
                    "parameters": { "name": "{industry} Leaders", "description": "Top voices in {industry}" },
                    "description": "Create a new list for organizing contacts"
                },
                {
                    "step": 2,
                    "action": "research_users",
                    "tool": "getUserInfo",
                    "parameters": { "username": "{potential_member}" },
                    "description": "Research potential list members"
                },
                {
                    "step": 3,
                    "action": "add_to_list",
                    "tool": "addUserToList",
                    "parameters": { "listId": "{list_id}", "userId": "{user_id}" },
                    "description": "Add valuable users to the list"
                },
                {
                    "step": 4,
                    "action": "monitor_list",
                    "tool": "getListMembers",
                    "parameters": { "listId": "{list_id}", "maxResults": 100 },
                    "description": "Monitor and manage list membership"
                }
            ]
        }
    };
} 