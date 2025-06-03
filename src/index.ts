import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
    ListToolsRequestSchema, 
    CallToolRequestSchema,
    ListPromptsRequestSchema,
    GetPromptRequestSchema,
    ListResourcesRequestSchema,
    ReadResourceRequestSchema
} from '@modelcontextprotocol/sdk/types.js';
import { TOOLS } from './tools.js';
import { PROMPTS, getPromptContent } from './prompts.js';
import { RESOURCES, handleResource } from './resources.js';
import { createTwitterClient } from './twitterClient.js';
import { config } from 'dotenv';
import {
    handlePostTweet,
    handlePostTweetWithMedia,
    handleGetTweetById,
    handleReplyToTweet,
    handleDeleteTweet,
    handleGetUserTimeline
} from './handlers/tweet.handlers.js';
import {
    handleLikeTweet,
    handleUnlikeTweet,
    handleRetweet,
    handleUndoRetweet,
    handleGetRetweets,
    handleGetLikedTweets
} from './handlers/engagement.handlers.js';
import {
    handleGetUserInfo,
    handleFollowUser,
    handleUnfollowUser,
    handleGetFollowers,
    handleGetFollowing,
    handleGetAuthenticatedUser
} from './handlers/user.handlers.js';
import {
    handleCreateList,
    handleAddUserToList,
    handleRemoveUserFromList,
    handleGetListMembers,
    handleGetUserLists
} from './handlers/list.handlers.js';
import {
    handleSearchTweets,
    handleHashtagAnalytics
} from './handlers/search.handlers.js';
import {
    handleSendDirectMessage,
    handleGetDirectMessages,
    handleGetDirectMessageEvents,
    handleGetConversation,
    handleMarkAsRead,
    handleCreateMediaMessage
} from './handlers/directmessage.handlers.js';
import {
    handleBlockUser,
    handleUnblockUser,
    handleGetBlockedUsers,
    handleMuteUser,
    handleUnmuteUser,
    handleGetMutedUsers
} from './handlers/moderation.handlers.js';
import {
    handleAdvancedTweetSearch,
    handleHistoricalTweetSearch,
    handleTrendingTopicsSearch,
    handleBulkUserProfiles,
    handleUserGrowthAnalytics,
    handleUserInfluenceMetrics,
    handleGetFullThread,
    handleGetConversationTree,
    handleGetThreadMetrics,
    handleFindMutualConnections,
    handleAnalyzeFollowerDemographics,
    handleMapInfluenceNetwork,
    handleGetHashtagTrends,
    handleAnalyzeSentiment,
    handleTrackVirality
} from './handlers/socialdata/index.js';
import { GetUserTimelineArgs } from './types/handlers.js';
import { TTweetv2UserField } from 'twitter-api-v2';

// Load environment variables
config();

const server = new Server({
    name: 'twitter-mcp-server',
    version: '0.0.1',
}, {
    capabilities: {
        tools: {},
        prompts: {},
        resources: {}
    }
});

// Initialize Twitter client (returns null if credentials are missing)
const client = createTwitterClient();

server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: Object.entries(TOOLS).map(([name, tool]) => ({
        name,
        ...tool
    }))
}));

server.setRequestHandler(ListPromptsRequestSchema, async () => ({
    prompts: Object.values(PROMPTS)
}));

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    if (!PROMPTS[name]) {
        throw new Error(`Unknown prompt: ${name}`);
    }
    
    const content = getPromptContent(name, args || {});
    
    return {
        description: PROMPTS[name].description,
        messages: [
            {
                role: 'user',
                content: {
                    type: 'text',
                    text: content
                }
            }
        ]
    };
});

server.setRequestHandler(ListResourcesRequestSchema, async () => ({
    resources: RESOURCES
}));

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;
    return await handleResource(uri, client || undefined);
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
        let response;

        switch (request.params.name) {
            case 'postTweet': {
                const { text } = request.params.arguments as { text: string };
                response = await handlePostTweet(client, { text });
                break;
            }
            case 'postTweetWithMedia': {
                const { text, mediaPath, mediaType, altText } = request.params.arguments as { 
                    text: string;
                    mediaPath: string;
                    mediaType: string;
                    altText?: string;
                };
                response = await handlePostTweetWithMedia(client, { text, mediaPath, mediaType, altText });
                break;
            }
            case 'getTweetById': {
                const { tweetId } = request.params.arguments as { tweetId: string };
                response = await handleGetTweetById(client, { tweetId });
                break;
            }
            case 'replyToTweet': {
                const { tweetId, text } = request.params.arguments as { tweetId: string; text: string };
                response = await handleReplyToTweet(client, { tweetId, text });
                break;
            }
            case 'deleteTweet': {
                const { tweetId } = request.params.arguments as { tweetId: string };
                response = await handleDeleteTweet(client, { tweetId });
                break;
            }
            case 'likeTweet': {
                const { tweetId } = request.params.arguments as { tweetId: string };
                response = await handleLikeTweet(client, { tweetId });
                break;
            }
            case 'unlikeTweet': {
                const { tweetId } = request.params.arguments as { tweetId: string };
                response = await handleUnlikeTweet(client, { tweetId });
                break;
            }
            case 'retweet': {
                const { tweetId } = request.params.arguments as { tweetId: string };
                response = await handleRetweet(client, { tweetId });
                break;
            }
            case 'undoRetweet': {
                const { tweetId } = request.params.arguments as { tweetId: string };
                response = await handleUndoRetweet(client, { tweetId });
                break;
            }
            case 'getRetweets': {
                const { tweetId, maxResults } = request.params.arguments as { tweetId: string; maxResults?: number };
                response = await handleGetRetweets(client, { tweetId, maxResults });
                break;
            }
            case 'getLikedTweets': {
                const { userId, maxResults } = request.params.arguments as { userId: string; maxResults?: number };
                response = await handleGetLikedTweets(client, { userId, maxResults });
                break;
            }
            case 'getUserInfo': {
                const { username } = request.params.arguments as { username: string };
                response = await handleGetUserInfo(client, { username });
                break;
            }
            case 'getAuthenticatedUser': {
                const { userFields } = request.params.arguments as { userFields?: TTweetv2UserField[] };
                response = await handleGetAuthenticatedUser(client, { userFields });
                break;
            }
            case 'getUserTimeline': {
                const { username, maxResults, tweetFields } = request.params.arguments as { 
                    username: string; 
                    maxResults?: number; 
                    tweetFields?: string[] 
                };
                
                if (!client) {
                    response = { response: `📋 **Get User Timeline requires Twitter API credentials**

To use Twitter tools, please:

1. **Create a Twitter Developer Account** at https://developer.twitter.com
2. **Create a new Twitter App** and generate API keys
3. **Add to your .env file:**
   \`\`\`
   X_API_KEY=your_api_key_here
   X_API_SECRET=your_api_secret_here
   X_ACCESS_TOKEN=your_access_token_here
   X_ACCESS_TOKEN_SECRET=your_access_token_secret_here
   \`\`\`
4. **Restart the MCP server**

**Alternative:** Use the enhanced SocialData.tools research tools instead (if available)`, tools: [] };
                    break;
                }
                
                // Convert username to userId
                const userResponse = await client.getUserByUsername(username);
                const userId = userResponse.data.id;
                
                response = await handleGetUserTimeline(client, { 
                    userId, 
                    maxResults, 
                    tweetFields 
                });
                break;
            }
            case 'followUser': {
                const { username } = request.params.arguments as { username: string };
                response = await handleFollowUser(client, { username });
                break;
            }
            case 'unfollowUser': {
                const { username } = request.params.arguments as { username: string };
                response = await handleUnfollowUser(client, { username });
                break;
            }
            case 'getFollowers': {
                const { username, maxResults } = request.params.arguments as { username: string; maxResults?: number };
                response = await handleGetFollowers(client, { username, maxResults });
                break;
            }
            case 'getFollowing': {
                const { username, maxResults } = request.params.arguments as { username: string; maxResults?: number };
                response = await handleGetFollowing(client, { username, maxResults });
                break;
            }
            case 'createList': {
                const { name, description, isPrivate } = request.params.arguments as { 
                    name: string;
                    description?: string;
                    isPrivate?: boolean;
                };
                response = await handleCreateList(client, { name, description, isPrivate });
                break;
            }
            case 'addUserToList': {
                const { listId, userId } = request.params.arguments as { listId: string; userId: string };
                response = await handleAddUserToList(client, { listId, userId });
                break;
            }
            case 'removeUserFromList': {
                const { listId, userId } = request.params.arguments as { listId: string; userId: string };
                response = await handleRemoveUserFromList(client, { listId, userId });
                break;
            }
            case 'getListMembers': {
                const { listId, maxResults, userFields } = request.params.arguments as {
                    listId: string;
                    maxResults?: number;
                    userFields?: string[];
                };
                response = await handleGetListMembers(client, { listId, maxResults, userFields });
                break;
            }
            case 'getUserLists': {
                const { username, maxResults } = request.params.arguments as { username: string; maxResults?: number };
                response = await handleGetUserLists(client, { username, maxResults });
                break;
            }
            case 'searchTweets': {
                const { query, maxResults } = request.params.arguments as { query: string; maxResults?: number };
                response = await handleSearchTweets(client, { query, maxResults });
                break;
            }
            case 'getHashtagAnalytics': {
                const { hashtag, startTime, endTime } = request.params.arguments as {
                    hashtag: string;
                    startTime?: string;
                    endTime?: string;
                };
                response = await handleHashtagAnalytics(client, { hashtag, startTime, endTime });
                break;
            }
            // Direct Message handlers
            case 'sendDirectMessage': {
                const { recipientId, text, mediaId, attachments } = request.params.arguments as {
                    recipientId: string;
                    text: string;
                    mediaId?: string;
                    attachments?: string[];
                };
                response = await handleSendDirectMessage(client, { recipientId, text, mediaId, attachments });
                break;
            }
            case 'getDirectMessages': {
                const { maxResults, paginationToken, dmEventFields } = request.params.arguments as {
                    maxResults?: number;
                    paginationToken?: string;
                    dmEventFields?: string[];
                };
                response = await handleGetDirectMessages(client, { maxResults, paginationToken, dmEventFields });
                break;
            }
            case 'getDirectMessageEvents': {
                const { maxResults, paginationToken, dmEventFields, expansions, userFields } = request.params.arguments as {
                    maxResults?: number;
                    paginationToken?: string;
                    dmEventFields?: string[];
                    expansions?: string[];
                    userFields?: string[];
                };
                response = await handleGetDirectMessageEvents(client, { maxResults, paginationToken, dmEventFields, expansions, userFields });
                break;
            }
            case 'getConversation': {
                const { conversationId, maxResults, paginationToken, dmEventFields } = request.params.arguments as {
                    conversationId: string;
                    maxResults?: number;
                    paginationToken?: string;
                    dmEventFields?: string[];
                };
                response = await handleGetConversation(client, { conversationId, maxResults, paginationToken, dmEventFields });
                break;
            }
            case 'markAsRead': {
                const { messageId, conversationId } = request.params.arguments as {
                    messageId: string;
                    conversationId?: string;
                };
                response = await handleMarkAsRead(client, { messageId, conversationId });
                break;
            }
            case 'createMediaMessage': {
                const { recipientId, text, mediaId, mediaType, altText } = request.params.arguments as {
                    recipientId: string;
                    text: string;
                    mediaId: string;
                    mediaType?: string;
                    altText?: string;
                };
                response = await handleCreateMediaMessage(client, { recipientId, text, mediaId, mediaType, altText });
                break;
            }
            case 'blockUser': {
                const { userId, username } = request.params.arguments as { userId?: string; username?: string };
                response = await handleBlockUser(client, { userId, username });
                break;
            }
            case 'unblockUser': {
                const { userId, username } = request.params.arguments as { userId?: string; username?: string };
                response = await handleUnblockUser(client, { userId, username });
                break;
            }
            case 'getBlockedUsers': {
                const { maxResults, paginationToken, userFields } = request.params.arguments as { 
                    maxResults?: number; 
                    paginationToken?: string; 
                    userFields?: string[] 
                };
                response = await handleGetBlockedUsers(client, { maxResults, paginationToken, userFields });
                break;
            }
            case 'muteUser': {
                const { userId, username } = request.params.arguments as { userId?: string; username?: string };
                response = await handleMuteUser(client, { userId, username });
                break;
            }
            case 'unmuteUser': {
                const { userId, username } = request.params.arguments as { userId?: string; username?: string };
                response = await handleUnmuteUser(client, { userId, username });
                break;
            }
            case 'getMutedUsers': {
                const { maxResults, paginationToken, userFields } = request.params.arguments as { 
                    maxResults?: number; 
                    paginationToken?: string; 
                    userFields?: string[] 
                };
                response = await handleGetMutedUsers(client, { maxResults, paginationToken, userFields });
                break;
            }
            // SocialData.tools handlers
            case 'advancedTweetSearch': {
                const args = request.params.arguments as any;
                response = await handleAdvancedTweetSearch(client, args);
                break;
            }
            case 'historicalTweetSearch': {
                const args = request.params.arguments as any;
                response = await handleHistoricalTweetSearch(client, args);
                break;
            }
            case 'trendingTopicsSearch': {
                const args = request.params.arguments as any;
                response = await handleTrendingTopicsSearch(client, args);
                break;
            }
            case 'bulkUserProfiles': {
                const args = request.params.arguments as any;
                response = await handleBulkUserProfiles(client, args);
                break;
            }
            case 'userGrowthAnalytics': {
                const args = request.params.arguments as any;
                response = await handleUserGrowthAnalytics(client, args);
                break;
            }
            case 'userInfluenceMetrics': {
                const args = request.params.arguments as any;
                response = await handleUserInfluenceMetrics(client, args);
                break;
            }
            // Thread and conversation analysis handlers
            case 'getFullThread': {
                const args = request.params.arguments as any;
                response = await handleGetFullThread(client, args);
                break;
            }
            case 'getConversationTree': {
                const args = request.params.arguments as any;
                response = await handleGetConversationTree(client, args);
                break;
            }
            case 'getThreadMetrics': {
                const args = request.params.arguments as any;
                response = await handleGetThreadMetrics(client, args);
                break;
            }
            // Network analysis handlers
            case 'findMutualConnections': {
                const args = request.params.arguments as any;
                response = await handleFindMutualConnections(client, args);
                break;
            }
            case 'analyzeFollowerDemographics': {
                const args = request.params.arguments as any;
                response = await handleAnalyzeFollowerDemographics(client, args);
                break;
            }
            case 'mapInfluenceNetwork': {
                const args = request.params.arguments as any;
                response = await handleMapInfluenceNetwork(client, args);
                break;
            }
            // Advanced analytics handlers
            case 'getHashtagTrends': {
                const args = request.params.arguments as any;
                response = await handleGetHashtagTrends(client, args);
                break;
            }
            case 'analyzeSentiment': {
                const args = request.params.arguments as any;
                response = await handleAnalyzeSentiment(client, args);
                break;
            }
            case 'trackVirality': {
                const args = request.params.arguments as any;
                response = await handleTrackVirality(client, args);
                break;
            }
            default:
                throw new Error(`Unknown tool: ${request.params.name}`);
        }

                return {
            content: [{ type: 'text', text: response.response }],
            tools: response.tools
            };
        } catch (error) {
            if (error instanceof Error) {
            return {
                content: [{ type: 'text', text: `Error: ${error.message}` }]
            };
        }
        return {
            content: [{ type: 'text', text: 'An unknown error occurred' }]
        };
    }
});

const transport = new StdioServerTransport();
server.connect(transport).catch(console.error); 