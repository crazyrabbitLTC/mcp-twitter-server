import { TwitterClient } from '../twitterClient.js';
import { objectOutputType } from '@modelcontextprotocol/sdk/types.js';

export interface HandlerResponse {
    content: Array<{
        type: string;
        text: string;
    }>;
    tools?: objectOutputType<any, any, any>[];
}

export interface TwitterHandler<T> {
    (client: TwitterClient, ...args: any[]): Promise<HandlerResponse>;
}

export interface TweetHandlerArgs {
    text: string;
}

export interface MediaTweetHandlerArgs extends TweetHandlerArgs {
    mediaPath: string;
    mediaType: string;
    altText?: string;
}

export interface UserHandlerArgs {
    username: string;
}

export interface ListHandlerArgs {
    listId: string;
}

export interface ListCreateArgs {
    name: string;
    description: string;
    isPrivate: boolean;
} 