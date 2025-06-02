/**
 * SocialData.tools network analysis handlers
 * User connection mapping and influence network analysis
 */
import { getSocialDataClient } from '../../socialDataClient.js';
import { 
    SocialDataHandler,
    CommonFollowersArgs,
    FollowerAnalyticsArgs,
    NetworkMappingArgs
} from '../../types/socialdata.js';
import { 
    createSocialDataResponse, 
    formatSocialDataError, 
    formatUserList,
    formatAnalytics,
    createMissingApiKeyResponse
} from '../../utils/socialdata-response.js';

export const handleFindMutualConnections: SocialDataHandler<CommonFollowersArgs> = async (
    _client: any,
    { user1, user2, maxResults = 20 }: CommonFollowersArgs
) => {
    try {
        const socialClient = getSocialDataClient();
        
        if (!socialClient) {
            return createMissingApiKeyResponse('Mutual Connections Analysis');
        }
        
        // Get interactions between the users by searching for mentions
        const mutualMentionsQuery = `(from:${user1} @${user2}) OR (from:${user2} @${user1})`;
        const mentionsResult = await socialClient.searchTweets({
            query: mutualMentionsQuery,
            maxResults: 50
        });

        // Get users who mention both
        const bothMentionedQuery = `@${user1} @${user2}`;
        const bothMentionedResult = await socialClient.searchTweets({
            query: bothMentionedQuery,
            maxResults: maxResults
        });

        // Extract unique users from interactions
        const interactingUsers = new Set();
        [...(mentionsResult.data || []), ...(bothMentionedResult.data || [])].forEach((tweet: any) => {
            if (tweet.user?.screen_name && 
                tweet.user.screen_name !== user1 && 
                tweet.user.screen_name !== user2) {
                interactingUsers.add(tweet.user.screen_name);
            }
        });

        const mutualConnections = {
            user1,
            user2,
            direct_interactions: {
                count: mentionsResult.data?.length || 0,
                recent_mentions: mentionsResult.data?.slice(0, 5).map((tweet: any) => ({
                    from: tweet.user?.screen_name,
                    text: tweet.text?.substring(0, 140),
                    date: tweet.tweet_created_at
                })) || []
            },
            mutual_interactions: {
                users_mentioning_both: Array.from(interactingUsers).slice(0, maxResults),
                count: interactingUsers.size,
                sample_tweets: bothMentionedResult.data?.slice(0, 3).map((tweet: any) => ({
                    author: tweet.user?.screen_name,
                    text: tweet.text?.substring(0, 140),
                    date: tweet.tweet_created_at
                })) || []
            },
            connection_strength: {
                direct_mentions: mentionsResult.data?.length || 0,
                mutual_mention_network: interactingUsers.size,
                estimated_relationship: interactingUsers.size > 5 ? 'Strong' : 
                                       interactingUsers.size > 1 ? 'Moderate' : 'Weak'
            }
        };

        return createSocialDataResponse(
            formatAnalytics(mutualConnections, `Mutual Connections: @${user1} ↔ @${user2}`)
        );
    } catch (error) {
        throw new Error(formatSocialDataError(error as Error, 'mutual connections analysis'));
    }
};

export const handleAnalyzeFollowerDemographics: SocialDataHandler<FollowerAnalyticsArgs> = async (
    _client: any,
    { username, sampleSize = 50, analyzeDemographics = true }: FollowerAnalyticsArgs
) => {
    try {
        const socialClient = getSocialDataClient();
        
        if (!socialClient) {
            return createMissingApiKeyResponse('Follower Demographics Analysis');
        }
        
        // Get recent interactions to sample follower activity
        const mentionsQuery = `@${username}`;
        const mentionsResult = await socialClient.searchTweets({
            query: mentionsQuery,
            maxResults: sampleSize
        });

        // Get retweets of user's content
        const retweetsQuery = `from:${username}`;
        const userTweetsResult = await socialClient.searchTweets({
            query: retweetsQuery,
            maxResults: 25
        });

        const interactingUsers = new Map();
        
        // Analyze users who mention this account
        mentionsResult.data?.forEach((tweet: any) => {
            const user = tweet.user;
            if (user && user.screen_name !== username) {
                interactingUsers.set(user.screen_name, {
                    screen_name: user.screen_name,
                    name: user.name,
                    followers_count: user.followers_count,
                    verified: user.verified,
                    interaction_type: 'mention'
                });
            }
        });

        const sampleUsers = Array.from(interactingUsers.values());
        
        let analytics: any = {
            target_user: username,
            sample_size: sampleUsers.length,
            analysis_date: new Date().toISOString()
        };

        if (analyzeDemographics && sampleUsers.length > 0) {
            const verifiedCount = sampleUsers.filter(u => u.verified).length;
            const followerCounts = sampleUsers.map(u => u.followers_count || 0);
            const avgFollowers = followerCounts.reduce((a, b) => a + b, 0) / followerCounts.length;
            
            analytics.demographics = {
                verified_percentage: Math.round((verifiedCount / sampleUsers.length) * 100),
                average_follower_count: Math.round(avgFollowers),
                follower_distribution: {
                    micro_influencers: followerCounts.filter(c => c >= 1000 && c < 100000).length,
                    regular_users: followerCounts.filter(c => c < 1000).length,
                    large_accounts: followerCounts.filter(c => c >= 100000).length
                },
                engagement_quality: sampleUsers.length > 20 ? 'High' : 
                                   sampleUsers.length > 10 ? 'Medium' : 'Low'
            };

            analytics.top_interacting_users = sampleUsers
                .sort((a, b) => (b.followers_count || 0) - (a.followers_count || 0))
                .slice(0, 10)
                .map(u => ({
                    username: u.screen_name,
                    name: u.name,
                    followers: u.followers_count,
                    verified: u.verified
                }));
        }

        return createSocialDataResponse(
            formatAnalytics(analytics, `Follower Demographics Analysis for @${username}`)
        );
    } catch (error) {
        throw new Error(formatSocialDataError(error as Error, 'follower analytics'));
    }
};

export const handleMapInfluenceNetwork: SocialDataHandler<NetworkMappingArgs> = async (
    _client: any,
    { centerUser, depth = 2, connectionTypes = ['followers', 'following', 'mutual'] }: NetworkMappingArgs
) => {
    try {
        const socialClient = getSocialDataClient();
        
        if (!socialClient) {
            return createMissingApiKeyResponse('Influence Network Mapping');
        }
        
        // Get users who frequently interact with the center user
        const mentionsQuery = `@${centerUser}`;
        const mentionsResult = await socialClient.searchTweets({
            query: mentionsQuery,
            maxResults: 100
        });

        // Get users the center user mentions
        const centerMentionsQuery = `from:${centerUser} @`;
        const centerMentionsResult = await socialClient.searchTweets({
            query: centerMentionsQuery,
            maxResults: 50
        });

        // Build network map
        const networkNodes = new Map();
        
        // Add center user
        networkNodes.set(centerUser, {
            username: centerUser,
            type: 'center',
            connections: [],
            influence_score: 100
        });

        // Process mentions TO the center user (incoming connections)
        const incomingConnections = new Map();
        mentionsResult.data?.forEach((tweet: any) => {
            const user = tweet.user;
            if (user && user.screen_name !== centerUser) {
                const existing = incomingConnections.get(user.screen_name) || 0;
                incomingConnections.set(user.screen_name, existing + 1);
                
                if (!networkNodes.has(user.screen_name)) {
                    networkNodes.set(user.screen_name, {
                        username: user.screen_name,
                        name: user.name,
                        type: 'incoming',
                        mention_frequency: existing + 1,
                        followers_count: user.followers_count,
                        verified: user.verified,
                        influence_score: Math.min(90, (user.followers_count || 0) / 1000)
                    });
                }
            }
        });

        // Process mentions FROM the center user (outgoing connections)
        const outgoingConnections = new Set();
        centerMentionsResult.data?.forEach((tweet: any) => {
            const mentions = tweet.text?.match(/@(\w+)/g) || [];
            mentions.forEach((mention: string) => {
                const username = mention.substring(1);
                if (username !== centerUser) {
                    outgoingConnections.add(username);
                    
                    if (!networkNodes.has(username)) {
                        networkNodes.set(username, {
                            username,
                            type: 'outgoing',
                            influence_score: 50
                        });
                    }
                }
            });
        });

        // Calculate network metrics
        const networkMap = {
            center_user: centerUser,
            network_depth: depth,
            total_nodes: networkNodes.size,
            connection_types: connectionTypes,
            network_metrics: {
                incoming_connections: incomingConnections.size,
                outgoing_connections: outgoingConnections.size,
                total_unique_connections: new Set([...incomingConnections.keys(), ...outgoingConnections]).size,
                network_density: Math.round((incomingConnections.size + outgoingConnections.size) / 2),
                influence_centrality: Math.min(100, (incomingConnections.size * 2) + outgoingConnections.size)
            },
            top_connected_users: Array.from(networkNodes.values())
                .filter(node => node.type !== 'center')
                .sort((a, b) => (b.influence_score || 0) - (a.influence_score || 0))
                .slice(0, 15)
                .map(node => ({
                    username: node.username,
                    name: node.name,
                    connection_type: node.type,
                    influence_score: Math.round(node.influence_score || 0),
                    followers: node.followers_count,
                    verified: node.verified
                })),
            network_insights: {
                most_active_mentioner: Array.from(incomingConnections.entries())
                    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None',
                network_reach_estimate: Math.round(
                    Array.from(networkNodes.values())
                        .reduce((sum, node) => sum + (node.followers_count || 0), 0) / 1000
                ) + 'K',
                connection_strength: incomingConnections.size > 20 ? 'Strong' : 
                                   incomingConnections.size > 5 ? 'Moderate' : 'Developing'
            }
        };

        return createSocialDataResponse(
            formatAnalytics(networkMap, `Influence Network Map for @${centerUser}`)
        );
    } catch (error) {
        throw new Error(formatSocialDataError(error as Error, 'influence network mapping'));
    }
};