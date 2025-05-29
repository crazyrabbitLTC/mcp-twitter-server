import { Prompt } from '@modelcontextprotocol/sdk/types.js';

export const PROMPTS: Record<string, Prompt> = {
    'compose-tweet': {
        name: 'compose-tweet',
        description: 'Guide for composing effective tweets with hashtags, mentions, and engagement strategies',
        arguments: [
            {
                name: 'topic',
                description: 'The main topic or subject of the tweet',
                required: true
            },
            {
                name: 'tone',
                description: 'The desired tone (professional, casual, humorous, informative)',
                required: false
            },
            {
                name: 'audience',
                description: 'Target audience for the tweet',
                required: false
            }
        ]
    },
    'analytics-report': {
        name: 'analytics-report',
        description: 'Generate comprehensive Twitter analytics and engagement reports',
        arguments: [
            {
                name: 'username',
                description: 'Twitter username to analyze',
                required: true
            },
            {
                name: 'period',
                description: 'Time period for analysis (recent, week, month)',
                required: false
            }
        ]
    },
    'content-strategy': {
        name: 'content-strategy',
        description: 'Develop a Twitter content strategy with scheduling and engagement recommendations',
        arguments: [
            {
                name: 'business_type',
                description: 'Type of business or personal brand',
                required: true
            },
            {
                name: 'goals',
                description: 'Primary goals (growth, engagement, sales, awareness)',
                required: true
            }
        ]
    },
    'community-management': {
        name: 'community-management',
        description: 'Best practices for managing Twitter community interactions and responses',
        arguments: [
            {
                name: 'scenario',
                description: 'Type of interaction (customer service, crisis management, general engagement)',
                required: true
            }
        ]
    },
    'hashtag-research': {
        name: 'hashtag-research',
        description: 'Research and recommend relevant hashtags for better tweet discoverability',
        arguments: [
            {
                name: 'industry',
                description: 'Industry or niche for hashtag research',
                required: true
            },
            {
                name: 'campaign_type',
                description: 'Type of campaign or content',
                required: false
            }
        ]
    },
    'twitter-help': {
        name: 'twitter-help',
        description: 'Get help with Twitter MCP server tools and usage'
    }
};

export const getPromptContent = (promptName: string, args: Record<string, any>): string => {
    switch (promptName) {
        case 'compose-tweet':
            return generateTweetCompositionPrompt(args.topic, args.tone || 'professional', args.audience || 'general');
        
        case 'analytics-report':
            return generateAnalyticsReportPrompt(args.username, args.period || 'recent');
        
        case 'content-strategy':
            return generateContentStrategyPrompt(args.business_type, args.goals);
        
        case 'community-management':
            return generateCommunityManagementPrompt(args.scenario);
        
        case 'hashtag-research':
            return generateHashtagResearchPrompt(args.industry, args.campaign_type || 'general');
        
        case 'twitter-help':
            return 'This Twitter MCP server provides tools for interacting with Twitter API including posting tweets, managing direct messages, user moderation (blocking/muting), and more. Use the tools/list method to see all available tools.';
        
        default:
            throw new Error(`Unknown prompt: ${promptName}`);
    }
};

function generateTweetCompositionPrompt(topic: string, tone: string, audience: string): string {
    return `# Tweet Composition Guide for "${topic}"

## Overview
Craft an engaging tweet about "${topic}" with a ${tone} tone for ${audience} audience.

## Tweet Structure Recommendations:
1. **Hook** (first 1-2 words): Grab attention immediately
2. **Value** (main content): Provide insight, entertainment, or information
3. **Call to Action**: Encourage engagement (reply, retweet, like)

## Best Practices:
- Keep it concise and impactful (under 280 characters)
- Use 1-3 relevant hashtags maximum
- Include mentions when appropriate (@username)
- Consider adding emojis for visual appeal (but don't overdo it)
- Ask questions to encourage replies
- Share personal experiences or insights

## ${tone.charAt(0).toUpperCase() + tone.slice(1)} Tone Guidelines:
${getToneGuidelines(tone)}

## Hashtag Suggestions:
Research trending hashtags related to "${topic}" using the searchTweets or getHashtagAnalytics tools.

## Engagement Tips:
- Tweet when your ${audience} audience is most active
- Respond to replies within 1-2 hours
- Retweet and engage with related content
- Share valuable resources or insights

## Example Structure:
"[Hook] [Main message about ${topic}] [Question/CTA] #RelevantHashtag"

Use the postTweet tool when ready to publish your composed tweet.`;
}

function generateAnalyticsReportPrompt(username: string, period: string): string {
    return `# Twitter Analytics Report for @${username}

## Data Collection Strategy
Use the following tools to gather comprehensive analytics:

### 1. User Profile Analysis
\`\`\`
getUserInfo({ username: "${username}" })
\`\`\`
**Metrics to analyze:**
- Follower count and growth
- Following ratio
- Total tweets posted
- Account verification status

### 2. Content Performance
\`\`\`
getUserTimeline({ userId: "USER_ID", maxResults: 50 })
\`\`\`
**Analyze:**
- Tweet frequency and consistency
- Engagement rates (likes, retweets, replies)
- Most popular content types
- Optimal posting times

### 3. Engagement Analysis
\`\`\`
getLikedTweets({ userId: "USER_ID", maxResults: 100 })
getRetweets({ tweetId: "TWEET_ID" })
\`\`\`

## Key Performance Indicators (KPIs):
1. **Engagement Rate**: (Likes + Retweets + Replies) / Impressions
2. **Growth Rate**: Follower increase over ${period}
3. **Content Mix**: Ratio of original vs. retweets
4. **Response Rate**: Replies to mentions/comments

## Report Sections:
### Executive Summary
- Overall performance highlights
- Key achievements and improvements needed

### Audience Insights
- Follower demographics and engagement patterns
- Best performing content themes

### Content Performance
- Top performing tweets
- Engagement trends over time
- Content type analysis

### Recommendations
- Content strategy improvements
- Optimal posting schedule
- Engagement tactics

**Note**: Some analytics features require Pro tier access. See tool error messages for upgrade information.`;
}

function generateContentStrategyPrompt(businessType: string, goals: string): string {
    return `# Twitter Content Strategy for ${businessType}

## Primary Goals: ${goals}

## Content Pillars (80/20 Rule):
1. **Educational Content (40%)**: Industry insights, tips, tutorials
2. **Entertainment (20%)**: Humorous posts, behind-the-scenes content
3. **Inspirational (20%)**: Success stories, motivational quotes
4. **Promotional (20%)**: Product/service announcements, offers

## Content Types by Goals:

### For Growth:
- Share valuable industry insights
- Engage with influencers and communities
- Use trending hashtags strategically
- Cross-promote on other platforms

### For Engagement:
- Ask questions and create polls
- Share relatable content
- Respond to comments quickly
- Participate in Twitter chats

### For Sales:
- Share customer testimonials
- Showcase product benefits
- Create limited-time offers
- Use clear calls-to-action

### For Awareness:
- Share company values and mission
- Participate in industry conversations
- Create educational content
- Partner with other brands

## Posting Schedule:
- **Frequency**: 1-3 tweets per day for ${businessType}
- **Timing**: Research your audience's active hours using getUserTimeline analytics
- **Consistency**: Maintain regular posting schedule

## Engagement Strategy:
1. **Daily Actions**:
   - Reply to mentions and comments
   - Like and retweet relevant content
   - Share 1 piece of valuable content

2. **Weekly Actions**:
   - Analyze top performing content
   - Engage with industry leaders
   - Share behind-the-scenes content

3. **Monthly Actions**:
   - Review analytics and adjust strategy
   - Plan content calendar
   - Research new hashtags and trends

## Tools to Use:
- \`postTweet\`: Share daily content
- \`getUserInfo\`: Research competitors and influencers
- \`followUser\`: Build industry network
- \`getUserTimeline\`: Analyze successful accounts
- \`createList\`: Organize different audience segments

## Success Metrics:
Track progress using analytics tools and adjust strategy based on performance data.`;
}

function generateCommunityManagementPrompt(scenario: string): string {
    return `# Community Management Guide: ${scenario}

## Response Framework:

### 1. Acknowledge Quickly
- Respond within 1-2 hours during business hours
- Use the replyToTweet tool for public responses
- Show appreciation for engagement

### 2. ${scenario} Best Practices:

${getScenarioGuidelines(scenario)}

### 3. Escalation Process:
- Identify when to move conversation private
- Know when to involve management
- Document recurring issues

### 4. Tone and Voice:
- Maintain brand voice consistently
- Be empathetic and helpful
- Stay professional even with difficult users

### 5. Tools for Community Management:
- \`replyToTweet\`: Respond to customer inquiries
- \`likeTweet\`: Acknowledge positive feedback
- \`getUserInfo\`: Understand user context
- \`followUser\`: Connect with valuable community members

### 6. Proactive Engagement:
- Monitor mentions and hashtags
- Engage with user-generated content
- Share community highlights
- Participate in relevant conversations

### 7. Crisis Communication:
- Respond quickly and transparently
- Take responsibility when appropriate
- Provide regular updates
- Move detailed discussions offline

## Response Templates:
Customize these templates for your brand voice and specific situations.`;
}

function generateHashtagResearchPrompt(industry: string, campaignType: string): string {
    return `# Hashtag Research for ${industry} - ${campaignType}

## Research Strategy:
1. **Industry-Specific Hashtags**
2. **Trending Hashtags**
3. **Community Hashtags**
4. **Branded Hashtags**

## Research Tools:
\`\`\`
searchTweets({ query: "#${industry}", maxResults: 50 })
getHashtagAnalytics({ hashtag: "${industry}" })
\`\`\`

## Hashtag Categories:

### Primary Hashtags (High Volume):
- Main industry terms
- Popular general hashtags
- Trending topics

### Secondary Hashtags (Medium Volume):
- Niche industry terms
- Location-based hashtags
- Event-specific hashtags

### Long-tail Hashtags (Low Volume):
- Specific product/service terms
- Local community hashtags
- Unique campaign hashtags

## Best Practices:
1. **Limit to 1-3 hashtags per tweet**
2. **Mix popular and niche hashtags**
3. **Research hashtag context before using**
4. **Create branded hashtags for campaigns**
5. **Monitor hashtag performance regularly**

## ${industry} Specific Recommendations:
${getIndustryHashtagAdvice(industry)}

## Campaign Optimization:
- Test different hashtag combinations
- Track engagement rates by hashtag
- Monitor trending hashtags daily
- Engage with posts using your hashtags

**Note**: Hashtag analytics require Pro tier access for comprehensive data.`;
}

function getToneGuidelines(tone: string): string {
    switch (tone.toLowerCase()) {
        case 'professional':
            return '- Use formal language and industry terminology\n- Share expertise and insights\n- Maintain authoritative voice\n- Include relevant statistics or data';
        case 'casual':
            return '- Use conversational language\n- Include personal anecdotes\n- Use contractions and informal phrases\n- Be relatable and approachable';
        case 'humorous':
            return '- Use appropriate humor for your audience\n- Include relevant memes or jokes\n- Keep it lighthearted but on-brand\n- Avoid controversial or offensive content';
        case 'informative':
            return '- Focus on providing value and education\n- Use clear, concise language\n- Include facts and actionable tips\n- Structure information logically';
        default:
            return '- Maintain consistency with your brand voice\n- Consider your audience expectations\n- Be authentic and genuine';
    }
}

function getScenarioGuidelines(scenario: string): string {
    switch (scenario.toLowerCase()) {
        case 'customer service':
            return `- Acknowledge the issue promptly
- Ask clarifying questions if needed
- Provide helpful solutions or next steps
- Follow up to ensure resolution
- Thank customers for their feedback`;
        case 'crisis management':
            return `- Respond quickly and transparently
- Take responsibility when appropriate
- Provide factual information only
- Direct to official statements or updates
- Monitor sentiment and adjust messaging`;
        case 'general engagement':
            return `- Show genuine interest in user content
- Ask thoughtful follow-up questions
- Share relevant experiences or insights
- Express appreciation for shares and mentions
- Encourage continued conversation`;
        default:
            return `- Listen actively to user concerns
- Respond with empathy and understanding
- Provide value in every interaction
- Build relationships, not just respond to issues`;
    }
}

function getIndustryHashtagAdvice(industry: string): string {
    // This could be expanded with specific advice for different industries
    return `Research trending hashtags in the ${industry} space using the searchTweets tool. Look for:
- Industry conferences and events
- Thought leaders in ${industry}
- Popular tools and platforms
- Common challenges and solutions
- Seasonal trends and campaigns`;
} 