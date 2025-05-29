import { TwitterClient } from '../client/twitter.js';
import { HandlerResponse } from '../types/handlers.js';
import { createResponse } from '../utils/response.js';
import { ListV2, UserV2, ApiResponseError } from 'twitter-api-v2';

export interface GetUserListsArgs {
    username: string;
    maxResults?: number;
    pageLimit?: number;
}

export interface CreateListArgs {
    name: string;
    description?: string;
    isPrivate?: boolean;
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
    pageLimit?: number;
    userFields?: string[];
}

export async function handleGetUserLists(
    client: TwitterClient,
    args: GetUserListsArgs
): Promise<HandlerResponse> {
    try {
        const user = await client.getUserByUsername(args.username);
        if (!user.data) {
            throw new Error('User not found');
        }

        const options = {
            'list.fields': ['created_at', 'follower_count', 'member_count', 'private', 'description'],
            expansions: ['owner_id'],
            'user.fields': ['username', 'name', 'verified'],
            max_results: args.maxResults,
            pageLimit: args.pageLimit
        };

        const [ownedLists, memberLists] = await Promise.all([
            client.getOwnedLists(user.data.id, options),
            client.getListMemberships(user.data.id, options)
        ]);

        const ownedListsCount = ownedLists.meta.result_count || 0;
        const memberListsCount = memberLists.meta.result_count || 0;

        let responseText = `Found ${ownedListsCount} owned lists and ${memberListsCount} list memberships.\n\n`;

        if (ownedLists.data && ownedLists.data.length > 0) {
            responseText += 'Owned Lists:\n';
            ownedLists.data.forEach((list) => {
                responseText += formatListInfo(list);
            });
            responseText += '\n';
        }

        if (memberLists.data && memberLists.data.length > 0) {
            responseText += 'Member of Lists:\n';
            memberLists.data.forEach((list) => {
                responseText += formatListInfo(list);
            });
        }

        const totalRetrieved = (ownedLists.meta.total_retrieved || 0) + (memberLists.meta.total_retrieved || 0);
        const totalRequested = args.maxResults ? args.maxResults * 2 : undefined;

        if (totalRequested && totalRetrieved >= totalRequested) {
            responseText += '\nNote: Maximum requested results reached. There might be more lists available.';
        }

        return createResponse(responseText);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to get user lists: ${error.message}`);
        }
        throw new Error('Failed to get user lists: Unknown error occurred');
    }
}

function formatListInfo(list: ListV2): string {
    const name = list.name.length > 50 ? `${list.name.substring(0, 47)}...` : list.name;
    const description = list.description
        ? list.description.length > 100
            ? `${list.description.substring(0, 97)}...`
            : list.description
        : '';

    return `- ${name} (${list.member_count} members${list.private ? ', private' : ''})${
        description ? `: ${description}` : ''
    }\n`;
}

export async function handleCreateList(
    client: TwitterClient,
    args: CreateListArgs
): Promise<HandlerResponse> {
    try {
        const list = await client.createList(args.name, args.description, args.isPrivate);
        if (!list.data) {
            throw new Error('Failed to create list');
        }
        return createResponse(`Successfully created list: ${list.data.name}`);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to create list: ${error.message}`);
        }
        throw new Error('Failed to create list: Unknown error occurred');
    }
}

export async function handleAddUserToList(
    client: TwitterClient,
    args: AddUserToListArgs
): Promise<HandlerResponse> {
    try {
        // First, verify the user exists and get their username for the response message
        const user = await client.getUserById(args.userId);
        if (!user.data) {
            throw new Error(`User with ID ${args.userId} not found`);
        }

        // Then verify the list exists and get its name for the response message
        const list = await client.getList(args.listId);
        if (!list.data) {
            throw new Error(`List with ID ${args.listId} not found`);
        }

        // Now try to add the user to the list
        await client.addListMember(args.listId, args.userId);

        return createResponse(
            `Successfully added user @${user.data.username} to list "${list.data.name}"`
        );
    } catch (error) {
        if (error instanceof ApiResponseError) {
            // Handle specific Twitter API errors
            if (error.rateLimitError && error.rateLimit) {
                const resetMinutes = Math.ceil(error.rateLimit.reset / 60);
                throw new Error(`Rate limit exceeded. Please try again in ${resetMinutes} minutes.`);
            }
            if (error.code === 403) {
                throw new Error('You do not have permission to add members to this list.');
            }
            if (error.code === 404) {
                throw new Error('The specified user or list could not be found.');
            }
            throw new Error(`Twitter API Error: ${error.message}`);
        }
        if (error instanceof Error) {
            throw new Error(`Failed to add user to list: ${error.message}`);
        }
        throw new Error('Failed to add user to list: Unknown error occurred');
    }
}

export async function handleRemoveUserFromList(
    client: TwitterClient,
    args: RemoveUserFromListArgs
): Promise<HandlerResponse> {
    try {
        await client.removeListMember(args.listId, args.userId);
        return createResponse(`Successfully removed user from list ${args.listId}`);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to remove user from list: ${error.message}`);
        }
        throw new Error('Failed to remove user from list: Unknown error occurred');
    }
}

export async function handleGetListMembers(
    client: TwitterClient,
    args: GetListMembersArgs
): Promise<HandlerResponse> {
    try {
        const options = {
            max_results: args.maxResults,
            pageLimit: args.pageLimit,
            'user.fields': args.userFields
        };

        const members = await client.getListMembers(args.listId, options);

        if (!members.data || !Array.isArray(members.data) || members.data.length === 0) {
            return createResponse(`No members found for list ${args.listId}`);
        }

        const memberCount = members.meta?.result_count || members.data.length;
        let responseText = `Found ${memberCount} members in list ${args.listId}:\n\n`;

        members.data.forEach((member) => {
            responseText += `- ${member.name} (@${member.username})\n`;
        });

        if (members.meta?.total_retrieved === args.maxResults) {
            responseText += '\nNote: Maximum requested results reached. There might be more members available.';
        }

        return createResponse(responseText);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to get list members: ${error.message}`);
        }
        throw new Error('Failed to get list members: Unknown error occurred');
    }
} 