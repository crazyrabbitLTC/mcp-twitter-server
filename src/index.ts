import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { getTwitterClient } from './twitterClient.js';
import { TOOLS } from './tools.js';
import {
    handlePostTweet,
    handlePostTweetWithMedia,
    handleGetTweetById,
    handleReplyToTweet,
    handleDeleteTweet
} from './handlers/tweet.handlers.js';
import {
    handleGetUserInfo,
    handleGetUserTimeline,
    handleFollowUser,
    handleUnfollowUser,
    handleGetFollowers,
    handleGetFollowing
} from './handlers/user.handlers.js';
import {
    handleLikeTweet,
    handleUnlikeTweet,
    handleRetweet,
    handleUndoRetweet,
    handleGetRetweets,
    handleGetLikedTweets
} from './handlers/engagement.handlers.js';
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
    TweetHandlerArgs,
    MediaTweetHandlerArgs,
    UserHandlerArgs,
    ListHandlerArgs,
    ListCreateArgs,
    GetUserInfoArgs,
    GetUserTimelineArgs,
    TweetEngagementArgs,
    ListMemberArgs,
    GetListMembersArgs,
    GetUserListsArgs
} from './types/handlers.js';
import { TTweetv2UserField } from 'twitter-api-v2';

const server = new Server({
    name: 'twitter-mcp-server',
    version: '0.0.1',
}, {
    capabilities: {
        tools: TOOLS
    }
});

server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: Object.entries(TOOLS).map(([name, tool]) => ({
        name,
        ...tool
    }))
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const client = getTwitterClient();
    const args = request.params.arguments || {};

    switch (request.params.name) {
        case 'postTweet': {
            const text = args.text as string;
            if (!text) throw new Error('Missing required parameter: text');
            return handlePostTweet(client, { text });
        }
        
        case 'postTweetWithMedia': {
            const text = args.text as string;
            const mediaPath = args.mediaPath as string;
            const mediaType = args.mediaType as string;
            const altText = args.altText as string | undefined;
            
            if (!text) throw new Error('Missing required parameter: text');
            if (!mediaPath) throw new Error('Missing required parameter: mediaPath');
            if (!mediaType) throw new Error('Missing required parameter: mediaType');
            
            return handlePostTweetWithMedia(client, { text, mediaPath, mediaType, altText });
        }
        
        case 'getUserInfo': {
            const username = args.username as string;
            const fields = args.fields as TTweetv2UserField[] | undefined;
            
            if (!username) throw new Error('Missing required parameter: username');
            return handleGetUserInfo(client, { username, fields });
        }
        
        case 'getUserTimeline': {
            const username = args.username as string;
            const maxResults = args.maxResults as number | undefined;
            const tweetFields = args.tweetFields as string[] | undefined;
            
            if (!username) throw new Error('Missing required parameter: username');
            return handleGetUserTimeline(client, { username, maxResults, tweetFields });
        }
        
        case 'followUser': {
            const username = args.username as string;
            if (!username) throw new Error('Missing required parameter: username');
            return handleFollowUser(client, { username });
        }
        
        case 'unfollowUser': {
            const username = args.username as string;
            if (!username) throw new Error('Missing required parameter: username');
            return handleUnfollowUser(client, { username });
        }
        
        case 'likeTweet': {
            const tweetId = args.tweetId as string;
            if (!tweetId) throw new Error('Missing required parameter: tweetId');
            return handleLikeTweet(client, { tweetId });
        }
        
        case 'unlikeTweet': {
            const tweetId = args.tweetId as string;
            if (!tweetId) throw new Error('Missing required parameter: tweetId');
            return handleUnlikeTweet(client, { tweetId });
        }
        
        case 'retweet': {
            const tweetId = args.tweetId as string;
            if (!tweetId) throw new Error('Missing required parameter: tweetId');
            return handleRetweet(client, { tweetId });
        }
        
        case 'undoRetweet': {
            const tweetId = args.tweetId as string;
            if (!tweetId) throw new Error('Missing required parameter: tweetId');
            return handleUndoRetweet(client, { tweetId });
        }
        
        case 'createList': {
            const name = args.name as string;
            const description = args.description as string | undefined;
            const isPrivate = args.private as boolean | undefined;
            
            if (!name) throw new Error('Missing required parameter: name');
            
            return handleCreateList(client, { 
                name, 
                description, 
                private: isPrivate 
            });
        }
        
        case 'addUserToList': {
            const listId = args.listId as string;
            const username = args.username as string;
            
            if (!listId) throw new Error('Missing required parameter: listId');
            if (!username) throw new Error('Missing required parameter: username');
            
            return handleAddUserToList(client, { listId, username });
        }
        
        case 'removeUserFromList': {
            const listId = args.listId as string;
            const username = args.username as string;
            
            if (!listId) throw new Error('Missing required parameter: listId');
            if (!username) throw new Error('Missing required parameter: username');
            
            return handleRemoveUserFromList(client, { listId, username });
        }
        
        case 'getListMembers': {
            const listId = args.listId as string;
            const maxResults = args.maxResults as number | undefined;
            const userFields = args.userFields as string[] | undefined;
            
            if (!listId) throw new Error('Missing required parameter: listId');
            return handleGetListMembers(client, { listId, maxResults, userFields });
        }
        
        case 'searchTweets': {
            const query = args.query as string;
            const maxResults = args.maxResults as number | undefined;
            const tweetFields = args.tweetFields as string[] | undefined;
            
            if (!query) throw new Error('Missing required parameter: query');
            return handleSearchTweets(client, { query, maxResults, tweetFields });
        }

        case 'getHashtagAnalytics': {
            const hashtag = args.hashtag as string;
            const startTime = args.startTime as string | undefined;
            const endTime = args.endTime as string | undefined;
            
            if (!hashtag) throw new Error('Missing required parameter: hashtag');
            return handleHashtagAnalytics(client, { hashtag, startTime, endTime });
        }

        case 'getTweetById': {
            const tweetId = args.tweetId as string;
            const tweetFields = args.tweetFields as string[] | undefined;
            
            if (!tweetId) throw new Error('Missing required parameter: tweetId');
            return handleGetTweetById(client, { tweetId, tweetFields });
        }

        case 'getFollowers': {
            const username = args.username as string;
            const maxResults = args.maxResults as number | undefined;
            const userFields = args.userFields as string[] | undefined;
            
            if (!username) throw new Error('Missing required parameter: username');
            return handleGetFollowers(client, { username, maxResults, userFields });
        }

        case 'replyToTweet': {
            const tweetId = args.tweetId as string;
            const text = args.text as string;
            
            if (!tweetId) throw new Error('Missing required parameter: tweetId');
            if (!text) throw new Error('Missing required parameter: text');
            return handleReplyToTweet(client, { tweetId, text });
        }
        
        case 'getRetweets': {
            const tweetId = args.tweetId as string;
            const maxResults = args.maxResults as number | undefined;
            const userFields = args.userFields as string[] | undefined;
            
            if (!tweetId) throw new Error('Missing required parameter: tweetId');
            return handleGetRetweets(client, { tweetId, maxResults, userFields });
        }
        
        case 'getLikedTweets': {
            const userId = args.userId as string;
            const maxResults = args.maxResults as number | undefined;
            const tweetFields = args.tweetFields as string[] | undefined;
            
            if (!userId) throw new Error('Missing required parameter: userId');
            return handleGetLikedTweets(client, { userId, maxResults, tweetFields });
        }

        case 'getFollowing': {
            const username = args.username as string;
            const maxResults = args.maxResults as number | undefined;
            const userFields = args.userFields as string[] | undefined;
            
            if (!username) throw new Error('Missing required parameter: username');
            return handleGetFollowing(client, { username, maxResults, userFields });
        }

        case 'deleteTweet': {
            const tweetId = args.tweetId as string;
            if (!tweetId) throw new Error('Missing required parameter: tweetId');
            return handleDeleteTweet(client, { tweetId });
        }

        case 'getUserLists': {
            const { username, maxResults } = args as unknown as GetUserListsArgs;
            return handleGetUserLists(client, { username, maxResults });
        }
        
        default:
            throw new Error(`Tool not found: ${request.params.name}`);
    }
});

const transport = new StdioServerTransport();
server.connect(transport).catch(console.error); 