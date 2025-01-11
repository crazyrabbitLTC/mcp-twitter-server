import { TwitterClient } from '../client/twitter.js';
import { HandlerResponse } from '../types/handlers.js';
import { createResponse } from '../utils/response.js';

export interface MediaTweetHandlerArgs {
    text: string;
    mediaPath: string;
    mediaType: string;
    altText?: string;
}

export async function handlePostTweet(
    client: TwitterClient,
    { text }: { text: string }
): Promise<HandlerResponse> {
    try {
        const tweet = await client.v2.tweet(text);
        return createResponse(`Successfully posted tweet: ${tweet.data.id}`);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to post tweet: ${error.message}`);
        }
        throw new Error('Failed to post tweet: Unknown error occurred');
    }
}

export async function handlePostTweetWithMedia(
    client: TwitterClient,
    { text, mediaPath, mediaType, altText }: MediaTweetHandlerArgs
): Promise<HandlerResponse> {
    try {
        // Upload media
        const mediaId = await client.v1.uploadMedia(mediaPath, { type: mediaType });
        
        // Set alt text if provided
        if (altText) {
            await client.v1.createMediaMetadata(mediaId, { alt_text: { text: altText } });
        }

        // Post tweet with media
        const tweet = await client.v2.tweet(text, { media: { media_ids: [mediaId] } });
        return createResponse(`Successfully posted tweet with media: ${tweet.data.id}`);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to post tweet with media: ${error.message}`);
        }
        throw new Error('Failed to post tweet with media: Unknown error occurred');
    }
}

export async function handleGetTweetById(
    client: TwitterClient,
    { tweetId }: { tweetId: string }
): Promise<HandlerResponse> {
    try {
        const tweet = await client.v2.singleTweet(tweetId, {
            'tweet.fields': 'created_at,public_metrics,text'
        });
        return createResponse(`Tweet details: ${JSON.stringify(tweet.data, null, 2)}`);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to get tweet: ${error.message}`);
        }
        throw new Error('Failed to get tweet: Unknown error occurred');
    }
}

export async function handleReplyToTweet(
    client: TwitterClient,
    { tweetId, text }: { tweetId: string; text: string }
): Promise<HandlerResponse> {
    try {
        const tweet = await client.v2.reply(text, tweetId);
        return createResponse(`Successfully replied to tweet: ${tweet.data.id}`);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to reply to tweet: ${error.message}`);
        }
        throw new Error('Failed to reply to tweet: Unknown error occurred');
    }
}

export async function handleDeleteTweet(
    client: TwitterClient,
    { tweetId }: { tweetId: string }
): Promise<HandlerResponse> {
    try {
        await client.v2.deleteTweet(tweetId);
        return createResponse(`Successfully deleted tweet: ${tweetId}`);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to delete tweet: ${error.message}`);
        }
        throw new Error('Failed to delete tweet: Unknown error occurred');
    }
}

// Add other tweet-related handlers... 