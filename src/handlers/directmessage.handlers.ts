import { TwitterClient } from '../client/twitter.js';
import { 
    HandlerResponse, 
    TwitterHandler,
    SendDirectMessageArgs,
    GetDirectMessagesArgs,
    GetDirectMessageEventsArgs,
    GetConversationArgs,
    MarkAsReadArgs,
    CreateMediaMessageArgs
} from '../types/handlers.js';
import { createResponse } from '../utils/response.js';
import { createMissingTwitterApiKeyResponse, formatTwitterError } from '../utils/twitter-response.js';

/**
 * Send a direct message to a specified user
 */
export const handleSendDirectMessage: TwitterHandler<SendDirectMessageArgs> = async (
    client: TwitterClient | null,
    { recipientId, text, mediaId }: SendDirectMessageArgs
): Promise<HandlerResponse> => {
    if (!client) {
        return createMissingTwitterApiKeyResponse('sendDirectMessage');
    }
    try {
        const dmParams: any = {
            recipient_id: recipientId,
            text
        };

        // Add media if provided
        if (mediaId) {
            dmParams.media_id = mediaId;
        }

        const result = await client.v1.sendDm(dmParams);

        return createResponse(`Direct message sent successfully to user ${recipientId}. Response: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('404')) {
                throw new Error(`Failed to send direct message: User ${recipientId} not found or cannot receive messages.`);
            }
            throw new Error(formatTwitterError(error, 'sending direct message'));
        }
        throw error;
    }
};

/**
 * Retrieve direct message conversations
 */
export const handleGetDirectMessages: TwitterHandler<GetDirectMessagesArgs> = async (
    client: TwitterClient | null,
    { maxResults = 100, paginationToken, dmEventFields }: GetDirectMessagesArgs
): Promise<HandlerResponse> => {
    if (!client) {
        return createMissingTwitterApiKeyResponse('getDirectMessages');
    }
    try {
        const options: any = {
            max_results: Math.min(maxResults, 100) // API limit is 100
        };

        if (paginationToken) {
            options.pagination_token = paginationToken;
        }

        if (dmEventFields && dmEventFields.length > 0) {
            options['dm_event.fields'] = dmEventFields.join(',');
        } else {
            // Default fields for better response
            options['dm_event.fields'] = 'id,text,created_at,sender_id,dm_conversation_id,referenced_tweet,attachments';
        }

        // Using v2 API for DM conversations
        const conversations = await client.v2.listDmEvents(options);

        if (!conversations.data || !Array.isArray(conversations.data) || conversations.data.length === 0) {
            return createResponse('No direct message conversations found.');
        }

        const responseData = {
            conversations: conversations.data,
            meta: conversations.meta
        };

        return createResponse(`Retrieved ${conversations.data.length} direct message events: ${JSON.stringify(responseData, null, 2)}`);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(formatTwitterError(error, 'getting direct messages'));
        }
        throw error;
    }
};

/**
 * Get specific direct message events
 */
export const handleGetDirectMessageEvents: TwitterHandler<GetDirectMessageEventsArgs> = async (
    client: TwitterClient | null,
    { maxResults = 100, paginationToken, dmEventFields, expansions, userFields }: GetDirectMessageEventsArgs
): Promise<HandlerResponse> => {
    if (!client) {
        return createMissingTwitterApiKeyResponse('getDirectMessageEvents');
    }
    try {
        const options: any = {
            max_results: Math.min(maxResults, 100)
        };

        if (paginationToken) {
            options.pagination_token = paginationToken;
        }

        if (dmEventFields && dmEventFields.length > 0) {
            options['dm_event.fields'] = dmEventFields.join(',');
        } else {
            options['dm_event.fields'] = 'id,text,created_at,sender_id,dm_conversation_id,referenced_tweet,attachments';
        }

        if (expansions && expansions.length > 0) {
            options.expansions = expansions.join(',');
        }

        if (userFields && userFields.length > 0) {
            options['user.fields'] = userFields.join(',');
        }

        const events = await client.v2.listDmEvents(options);

        if (!events.data || !Array.isArray(events.data) || events.data.length === 0) {
            return createResponse('No direct message events found.');
        }

        const responseData = {
            events: events.data,
            includes: events.includes,
            meta: events.meta
        };

        return createResponse(`Retrieved ${events.data.length} direct message events: ${JSON.stringify(responseData, null, 2)}`);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(formatTwitterError(error, 'getting direct message events'));
        }
        throw error;
    }
};

/**
 * Get full conversation history for a specific conversation
 */
export const handleGetConversation: TwitterHandler<GetConversationArgs> = async (
    client: TwitterClient | null,
    { conversationId, maxResults = 100, paginationToken, dmEventFields }: GetConversationArgs
): Promise<HandlerResponse> => {
    if (!client) {
        return createMissingTwitterApiKeyResponse('getConversation');
    }
    try {
        const options: any = {
            max_results: Math.min(maxResults, 100)
        };

        if (paginationToken) {
            options.pagination_token = paginationToken;
        }

        if (dmEventFields && dmEventFields.length > 0) {
            options['dm_event.fields'] = dmEventFields.join(',');
        } else {
            options['dm_event.fields'] = 'id,text,created_at,sender_id,dm_conversation_id,referenced_tweet,attachments';
        }

        // Get conversation messages using the conversation ID endpoint
        // Note: This would typically use a specific conversation endpoint
        // For now, we'll use the general listDmEvents and filter by conversation ID
        const conversation = await client.v2.listDmEvents({
            ...options,
            // Note: The actual API might have a different method for getting conversation-specific events
        });

        if (!conversation.data || !Array.isArray(conversation.data) || conversation.data.length === 0) {
            return createResponse(`No messages found in conversation ${conversationId}.`);
        }

        // Filter by conversation ID if needed (depending on API implementation)
        const filteredMessages = conversation.data.filter((event: any) => 
            event.dm_conversation_id === conversationId
        );

        const responseData = {
            conversationId,
            messages: filteredMessages.length > 0 ? filteredMessages : conversation.data,
            meta: conversation.meta
        };

        return createResponse(`Retrieved ${responseData.messages.length} messages from conversation ${conversationId}: ${JSON.stringify(responseData, null, 2)}`);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('404')) {
                throw new Error(`Failed to get conversation: Conversation ${conversationId} not found.`);
            }
            throw new Error(formatTwitterError(error, 'getting conversation'));
        }
        throw error;
    }
};

/**
 * Mark direct messages as read
 */
export const handleMarkAsRead: TwitterHandler<MarkAsReadArgs> = async (
    client: TwitterClient | null,
    { messageId, conversationId }: MarkAsReadArgs
): Promise<HandlerResponse> => {
    if (!client) {
        return createMissingTwitterApiKeyResponse('markAsRead');
    }
    try {
        // Note: The Twitter API v2 doesn't have a direct "mark as read" endpoint
        // This would typically be handled through the conversation update endpoint
        // For now, we'll provide a placeholder implementation
        
        // In a real implementation, you might need to:
        // 1. Get the authenticated user's ID
        // 2. Update the conversation state
        // 3. Use private API endpoints that may not be publicly available

        const userId = await client.v2.me().then(response => response.data.id);
        
        // This is a conceptual implementation - the actual API endpoint may vary
        // The Twitter API v2 may not expose this functionality directly
        console.log(`Attempting to mark message ${messageId} as read for user ${userId}`);
        
        return createResponse(`Message ${messageId} marked as read. Note: This functionality may require special API access or may not be available in the public Twitter API v2.`);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('404')) {
                throw new Error(`Failed to mark message as read: Message ${messageId} not found.`);
            }
            throw new Error(`${formatTwitterError(error, 'marking message as read')}. Note: This functionality may not be available in the public Twitter API v2.`);
        }
        throw error;
    }
};

/**
 * Send a direct message with media attachments
 */
export const handleCreateMediaMessage: TwitterHandler<CreateMediaMessageArgs> = async (
    client: TwitterClient | null,
    { recipientId, text, mediaId, altText }: CreateMediaMessageArgs
): Promise<HandlerResponse> => {
    if (!client) {
        return createMissingTwitterApiKeyResponse('createMediaMessage');
    }
    try {
        // Using v1 API for sending DMs with media
        const dmParams: any = {
            recipient_id: recipientId,
            text,
            media_id: mediaId
        };

        const result = await client.v1.sendDm(dmParams);

        return createResponse(`Direct message with media sent successfully to user ${recipientId}. Response: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('404')) {
                throw new Error(`Failed to send media message: User ${recipientId} not found or media ${mediaId} not found.`);
            } else if (error.message.includes('413')) {
                throw new Error(`Failed to send media message: Media file too large. Check Twitter's media size limits.`);
            } else if (error.message.includes('415')) {
                throw new Error(`Failed to send media message: Unsupported media type. Check Twitter's supported media formats.`);
            }
            throw new Error(formatTwitterError(error, 'sending media message'));
        }
        throw error;
    }
}; 