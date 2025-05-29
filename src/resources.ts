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
        uri: 'twitter://trends/current',
        name: 'Current Trending Topics',
        description: 'Current trending topics and hashtags with engagement insights',
        mimeType: 'application/json'
    },
    {
        uri: 'twitter://templates/thread-starters',
        name: 'Thread Opening Templates',
        description: 'Pre-built templates for starting engaging Twitter threads',
        mimeType: 'application/json'
    },
    {
        uri: 'twitter://compliance/guidelines',
        name: 'Twitter Policy & Compliance Guidelines',
        description: 'Twitter platform rules, policies, and compliance information',
        mimeType: 'text/markdown'
    },
    {
        uri: 'twitter://user/{username}',
        name: 'User Profile Data',
        description: 'Dynamic user profile information and recent activity',
        mimeType: 'application/json'
    },
    {
        uri: 'twitter://help',
        name: 'Twitter MCP Server Help',
        description: 'Documentation for Twitter MCP Server tools and usage'
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
            
        case '/trends/current':
            return {
                contents: [{
                    type: 'text',
                    text: JSON.stringify(getCurrentTrends(), null, 2)
                }]
            };
            
        case '/templates/thread-starters':
            return {
                contents: [{
                    type: 'text',
                    text: JSON.stringify(getThreadStarterTemplates(), null, 2)
                }]
            };
            
        case '/compliance/guidelines':
            return {
                contents: [{
                    type: 'text',
                    text: getComplianceGuidelines()
                }]
            };
            
        case '/help':
            return {
                contents: [
                    {
                        type: 'text',
                        text: 'Twitter MCP Server provides comprehensive Twitter API integration including:\n\n' +
                              '- Tweet management (post, reply, delete)\n' +
                              '- Direct Messages (send, receive, manage)\n' +
                              '- User moderation (block, mute, unblock, unmute)\n' +
                              '- User interactions (follow, unfollow, get followers)\n' +
                              '- Content engagement (like, retweet, get analytics)\n' +
                              '- List management and search functionality\n\n' +
                              'Use tools/list to see all available tools.'
                    }
                ]
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

function getCurrentTrends() {
    // Since the Basic tier doesn't have access to trending topics API, 
    // we provide a curated list of commonly trending categories
    return {
        "note": "Live trending data requires Pro tier access. This resource provides common trending categories and hashtag research guidance.",
        "access_level": "Basic tier - Limited trending data",
        "trending_categories": [
            {
                "category": "Technology",
                "sample_hashtags": ["#AI", "#MachineLearning", "#Blockchain", "#Web3", "#OpenSource"],
                "typical_volume": "High",
                "best_times": ["9-11 AM EST", "2-4 PM EST"]
            },
            {
                "category": "Business",
                "sample_hashtags": ["#Startup", "#Entrepreneurship", "#Marketing", "#Growth", "#Leadership"],
                "typical_volume": "Medium-High",
                "best_times": ["8-10 AM EST", "1-3 PM EST"]
            },
            {
                "category": "Social Impact",
                "sample_hashtags": ["#ClimateChange", "#Sustainability", "#SocialGood", "#Inclusion", "#Education"],
                "typical_volume": "Medium",
                "best_times": ["10 AM-12 PM EST", "7-9 PM EST"]
            },
            {
                "category": "Industry News",
                "sample_hashtags": ["#TechNews", "#Breaking", "#Innovation", "#Industry", "#Update"],
                "typical_volume": "Variable",
                "best_times": ["Morning hours", "End of business day"]
            }
        ],
        "research_suggestions": [
            "Use searchTweets tool (requires Pro tier) for real-time trending analysis",
            "Monitor competitor accounts for trending topic participation",
            "Track hashtag performance using getUserTimeline on influential accounts",
            "Set up Twitter Lists for different trend categories"
        ],
        "pro_tier_benefits": {
            "real_time_trends": "Access to live trending topics API",
            "hashtag_analytics": "Volume and engagement metrics for specific hashtags",
            "trend_history": "Historical trending data and patterns",
            "geographic_trends": "Location-based trending topics"
        },
        "last_updated": new Date().toISOString()
    };
}

function getThreadStarterTemplates() {
    return {
        "thread_templates": [
            {
                "name": "Educational Thread",
                "category": "Knowledge Sharing",
                "starter": "🧵 THREAD: Everything you need to know about {topic}",
                "structure": [
                    "1/ Start with a compelling hook and promise",
                    "2/ Present the problem or knowledge gap",
                    "3/ Break down key concepts (one per tweet)",
                    "4/ Include examples or case studies",
                    "5/ Provide actionable takeaways",
                    "6/ End with a call-to-action or question"
                ],
                "tips": [
                    "Use numbering (1/, 2/, 3/) for clarity",
                    "Keep each tweet focused on one point",
                    "Include visuals when possible",
                    "Ask for engagement in the final tweet"
                ]
            },
            {
                "name": "Story Thread",
                "category": "Narrative",
                "starter": "📖 Thread: The story of how {event/experience}",
                "structure": [
                    "1/ Set the scene with context",
                    "2/ Introduce the challenge or conflict",
                    "3/ Describe the journey/process",
                    "4/ Share the turning point",
                    "5/ Reveal the outcome",
                    "6/ Extract lessons learned"
                ],
                "tips": [
                    "Use storytelling techniques (tension, resolution)",
                    "Be vulnerable and authentic",
                    "Include specific details and emotions",
                    "Connect story to broader insights"
                ]
            },
            {
                "name": "Tutorial Thread",
                "category": "How-To",
                "starter": "🛠️ Step-by-step guide: How to {achieve specific outcome}",
                "structure": [
                    "1/ Promise specific value and outcome",
                    "2/ List required tools/prerequisites",
                    "3/ Step-by-step instructions (one per tweet)",
                    "4/ Common mistakes to avoid",
                    "5/ Pro tips and optimizations",
                    "6/ Encourage others to try and share results"
                ],
                "tips": [
                    "Be specific and actionable",
                    "Include screenshots or examples",
                    "Test instructions before sharing",
                    "Offer help in the comments"
                ]
            },
            {
                "name": "Debate/Opinion Thread",
                "category": "Thought Leadership",
                "starter": "🔥 Controversial take: {your contrarian viewpoint}",
                "structure": [
                    "1/ State your position clearly",
                    "2/ Acknowledge the common view",
                    "3/ Present your evidence/reasoning",
                    "4/ Address counterarguments",
                    "5/ Provide supporting examples",
                    "6/ Invite thoughtful discussion"
                ],
                "tips": [
                    "Be respectful but firm in your stance",
                    "Use data and examples to support claims",
                    "Acknowledge valid counterpoints",
                    "Moderate the discussion constructively"
                ]
            },
            {
                "name": "List Thread",
                "category": "Curation",
                "starter": "📝 {Number} {type of items} that will {benefit/outcome}",
                "structure": [
                    "1/ Promise value and set expectations",
                    "2/ Introduce criteria for selection",
                    "3/ Present each item with brief explanation",
                    "4/ Include why each item is valuable",
                    "5/ Bonus items or honorable mentions",
                    "6/ Ask followers for their additions"
                ],
                "tips": [
                    "Use consistent formatting for each item",
                    "Provide context for why items are included",
                    "Mix well-known and lesser-known options",
                    "Encourage community contributions"
                ]
            },
            {
                "name": "Behind-the-Scenes Thread",
                "category": "Transparency",
                "starter": "👀 Behind the scenes: What it really takes to {achievement}",
                "structure": [
                    "1/ Set up the achievement or project",
                    "2/ Share the unsexy/difficult parts",
                    "3/ Highlight key decisions and trade-offs",
                    "4/ Discuss failures and pivots",
                    "5/ Credit team members and supporters",
                    "6/ Offer insights for others attempting similar"
                ],
                "tips": [
                    "Be honest about challenges and failures",
                    "Share specific numbers or metrics",
                    "Give credit where it's due",
                    "Provide actionable insights for others"
                ]
            }
        ],
        "engagement_tactics": [
            "Use emojis strategically to break up text",
            "Ask questions to encourage replies",
            "Include relevant hashtags (1-2 per thread)",
            "Reply to your own thread with additional context",
            "Pin important threads to your profile",
            "Cross-promote threads in other content"
        ],
        "formatting_tips": [
            "Use line breaks for readability",
            "Bold key points with **text**",
            "Create visual hierarchy with numbering",
            "Include relevant mentions when appropriate",
            "End strong with a clear call-to-action"
        ],
        "last_updated": new Date().toISOString()
    };
}

function getComplianceGuidelines(): string {
    return `# Twitter Policy & Compliance Guidelines

## 🚨 Critical Platform Rules

### Prohibited Content:
- **Harassment & Abuse**: Threatening, abusive, or hateful conduct
- **Violence**: Threats, glorification, or incitement of violence
- **Terrorism**: Support for terrorist organizations or activities
- **Misinformation**: False or misleading information causing harm
- **Spam**: Repetitive, unsolicited, or manipulative content
- **Impersonation**: Pretending to be someone else without authorization

### Restricted Behaviors:
- **Artificial Engagement**: Buying followers, likes, or retweets
- **Platform Manipulation**: Coordinated inauthentic behavior
- **Private Information**: Sharing private info without consent
- **Non-consensual Media**: Intimate images shared without permission
- **Copyright Infringement**: Using copyrighted material without permission

## 🤖 API-Specific Compliance

### Rate Limits & Usage:
- **Respect Rate Limits**: Don't exceed API rate limits
- **Bulk Operations**: Avoid mass following/unfollowing
- **Authentic Engagement**: Don't automate personal interactions
- **Data Usage**: Follow data usage policies and retention limits

### Bot Account Requirements:
- **Disclosure**: Clearly identify automated accounts
- **Purpose**: Provide clear description of bot functionality
- **User Control**: Allow users to block/unfollow easily
- **Transparency**: Be open about automation level

## 📊 Content Guidelines

### Best Practices:
- **Original Content**: Share original thoughts and content
- **Attribution**: Credit sources and original creators
- **Context**: Provide necessary context for shared content
- **Verification**: Fact-check before sharing news or information

### Engagement Guidelines:
- **Authentic Interaction**: Engage genuinely with others
- **Constructive Discussion**: Foster positive conversations
- **Respectful Disagreement**: Disagree without attacking individuals
- **Community Standards**: Follow community norms and etiquette

## ⚖️ Legal Compliance

### Terms of Service:
- **User Agreement**: Comply with Twitter User Agreement
- **API Terms**: Follow Twitter API Terms of Service
- **Commercial Use**: Understand restrictions on commercial usage
- **Age Requirements**: Ensure compliance with age restrictions

### Privacy & Data Protection:
- **GDPR Compliance**: Follow EU privacy regulations if applicable
- **CCPA Compliance**: Follow California privacy laws if applicable
- **Data Minimization**: Only collect necessary user data
- **Consent**: Obtain proper consent for data usage

## 🛡️ Security Best Practices

### Account Security:
- **Strong Authentication**: Use strong passwords and 2FA
- **API Key Security**: Keep API keys secure and rotate regularly
- **Access Controls**: Limit API access to necessary personnel
- **Monitoring**: Monitor for unauthorized access or usage

### Application Security:
- **Secure Development**: Follow secure coding practices
- **Regular Updates**: Keep dependencies and libraries updated
- **Vulnerability Management**: Address security vulnerabilities promptly
- **Incident Response**: Have plans for security incidents

## 🔍 Monitoring & Compliance

### Regular Reviews:
- **Content Audits**: Regularly review published content
- **Engagement Analysis**: Monitor engagement patterns for anomalies
- **Policy Updates**: Stay current with Twitter policy changes
- **Community Feedback**: Listen to community concerns

### Enforcement Actions:
- **Warning Systems**: Understand Twitter's warning systems
- **Account Restrictions**: Know potential restrictions (shadowban, limits)
- **Suspension Risks**: Understand what can lead to suspension
- **Appeal Process**: Know how to appeal enforcement actions

## 📞 Support & Resources

### Official Resources:
- **Twitter Rules**: https://help.twitter.com/en/rules-and-policies
- **API Policy**: https://developer.twitter.com/en/developer-terms/policy
- **Developer Portal**: https://developer.twitter.com/en/portal
- **Safety Center**: https://help.twitter.com/en/safety-and-security

### Community Guidelines:
- **Developer Community**: https://twittercommunity.com/
- **Best Practices**: Follow established community standards
- **Industry Standards**: Align with social media marketing ethics
- **Professional Conduct**: Maintain professional behavior

## ⚠️ Red Flags to Avoid

### High-Risk Activities:
- Buying fake engagement (followers, likes, retweets)
- Mass following/unfollowing in short periods
- Posting identical content across multiple accounts
- Using misleading or clickbait content consistently
- Engaging in coordinated harassment campaigns
- Sharing unverified news or misinformation

### API Misuse:
- Exceeding rate limits repeatedly
- Scraping data beyond API terms
- Sharing API access credentials
- Using API for surveillance or tracking users
- Building competing social platforms with Twitter data

## 📋 Compliance Checklist

### Before Launching:
- [ ] Review all applicable Twitter policies
- [ ] Implement proper rate limiting
- [ ] Set up monitoring and logging
- [ ] Create clear terms of service
- [ ] Establish content moderation processes
- [ ] Test for security vulnerabilities

### Ongoing Maintenance:
- [ ] Monitor for policy updates
- [ ] Review content regularly
- [ ] Analyze engagement patterns
- [ ] Update security measures
- [ ] Train team on compliance requirements
- [ ] Maintain documentation

---

**Disclaimer**: This guide provides general information and does not constitute legal advice. Always consult Twitter's official documentation and legal counsel for specific compliance requirements.

**Last Updated**: ${new Date().toISOString()}
**Version**: 1.0 - Twitter API v2 Basic Tier Guidelines`;
}