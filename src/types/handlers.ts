import { TwitterClient } from '../client/twitter.js';
import { TTweetv2Expansion, TTweetv2UserField } from 'twitter-api-v2';

export interface HandlerResponse {
    response: string;
    tools?: Record<string, any>;
}

export interface MediaTweetHandlerArgs {
    text: string;
    mediaPath: string;
    mediaType: string;
    altText?: string;
}

export interface TweetHandlerArgs {
    text: string;
}

export interface TweetEngagementArgs {
    tweetId: string;
}

export interface UserHandlerArgs {
    username: string;
}

export interface GetUserInfoArgs {
    username: string;
}

export interface GetUserTimelineArgs {
    userId: string;
    maxResults?: number;
    tweetFields?: string[];
    expansions?: TTweetv2Expansion[];
    userFields?: TTweetv2UserField[];
}

export interface AddUserToListArgs {
    listId: string;
    userId: string;
}

export interface RemoveUserFromListArgs {
    listId: string;
    userId: string;
}

export interface GetListMembersArgs {
    listId: string;
    maxResults?: number;
    userFields?: string[];
}

export interface GetUserListsArgs {
    username: string;
    maxResults?: number;
}

export interface SearchTweetsArgs {
    query: string;
    maxResults?: number;
}

export interface HashtagAnalyticsArgs {
    hashtag: string;
    startTime?: string;
    endTime?: string;
}

// Direct Message related interfaces
export interface SendDirectMessageArgs {
    recipientId: string;
    text: string;
    mediaId?: string;
    attachments?: string[];
}

export interface GetDirectMessagesArgs {
    maxResults?: number;
    paginationToken?: string;
    dmEventFields?: string[];
}

export interface GetDirectMessageEventsArgs {
    maxResults?: number;
    paginationToken?: string;
    dmEventFields?: string[];
    expansions?: string[];
    userFields?: string[];
}

export interface GetConversationArgs {
    conversationId: string;
    maxResults?: number;
    paginationToken?: string;
    dmEventFields?: string[];
}

export interface MarkAsReadArgs {
    messageId: string;
    conversationId?: string;
}

export interface CreateMediaMessageArgs {
    recipientId: string;
    text: string;
    mediaId: string;
    mediaType?: string;
    altText?: string;
}

export type TwitterHandler<T> = (client: TwitterClient, args: T) => Promise<HandlerResponse>; 