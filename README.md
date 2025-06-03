
![ChatGPT Image May 30, 2025, 03_20_40 PM](https://github.com/user-attachments/assets/a9e3116e-414a-40cf-aad1-635ea5a82c7a)
# X (Twitter) MCP Server

A comprehensive Model Context Protocol server implementation for X (Twitter) API integration with professional workflow automation, enhanced error handling, and real-time documentation.

## 🚀 Features

- **53 Total Tools** - 33 Twitter API + 20 enhanced SocialData.tools research capabilities
- **Advanced Analytics** - Thread analysis, network mapping, sentiment analysis, viral tracking
- **Bypasses API Restrictions** - Enhanced research tools work without Pro tier requirements
- **Professional Error Handling** - Clear upgrade guidance and graceful API key handling
- **5 Workflow Prompts** - Pre-built automation templates
- **6 Dynamic Resources** - Real-time API documentation and status
- **Full MCP Compliance** - Tools, prompts, and resources support

## 📋 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- X (Twitter) API credentials (Basic tier minimum - $200/month)

### Local Installation

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd twitter-server
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

   **Required Environment Variables:**
   ```env
   # Twitter API credentials (Required)
   X_API_KEY=your_api_key_here
   X_API_SECRET=your_api_secret_here  
   X_ACCESS_TOKEN=your_access_token_here
   X_ACCESS_TOKEN_SECRET=your_access_token_secret_here

   # SocialData.tools API key (Optional - enables enhanced research tools)
   SOCIALDATA_API_KEY=your_socialdata_api_key_here
   SOCIALDATA_BASE_URL=https://api.socialdata.tools  # Optional, uses default if not set
   ```

3. **Build and Run**
   ```bash
   npm run build
   npm start
   ```

4. **Test the Server**
   ```bash
   # Test with JSON-RPC calls
   source .env && echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | node dist/index.js

   # Test specific tool
   source .env && echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "getUserInfo", "arguments": {"username": "elonmusk"}}}' | node dist/index.js
   ```

## 🔑 X (Twitter) API Setup

### Required Credentials

Add these to your `.env` file:

```env
X_API_KEY=your_api_key_here
X_API_SECRET=your_api_secret_here  
X_ACCESS_TOKEN=your_access_token_here
X_ACCESS_TOKEN_SECRET=your_access_token_secret_here
```

### API Access Levels

| Tier | Cost | Working Tools | Limited Tools |
|------|------|---------------|---------------|
| **Basic** | $200/month | 18/22 tools | searchTweets, getHashtagAnalytics |
| **Pro** | $5,000/month | All 22 tools | None |

## 🛠️ Available Tools (53 Total)

### 🐦 Twitter API Tools (33 tools)

#### ✅ Tweet Operations (All Working)
- `postTweet` - Post new tweets
- `getTweetById` - Retrieve specific tweets  
- `replyToTweet` - Reply to tweets
- `deleteTweet` - Delete your tweets

#### ✅ Engagement (All Working)
- `likeTweet` / `unlikeTweet` - Like/unlike tweets
- `retweet` / `undoRetweet` - Retweet/undo retweets
- `getRetweets` - Get retweet users

#### ✅ User Management (Most Working)
- `getUserInfo` - Get user profiles ✅
- `getUserTimeline` - Get user tweets ✅
- `followUser` / `unfollowUser` - Follow/unfollow users ✅
- `getFollowers` - Get followers ⚠️ (403 - requires special permissions)
- `getFollowing` - Get following ⚠️ (403 - requires special permissions)

#### ✅ List Management (All Working)
- `createList` - Create X (Twitter) lists
- `getUserLists` - Get user's lists
- `addUserToList` / `removeUserFromList` - Manage list members
- `getListMembers` - Get list members

#### ⚠️ Search & Analytics (Limited)
- `searchTweets` - Search tweets (requires Pro tier - $5,000/month)
- `getHashtagAnalytics` - Hashtag analytics (requires Pro tier)
- `getLikedTweets` - Get liked tweets (API access issue)

### 🔍 SocialData.tools Enhanced Research (20 tools)

*Note: These tools gracefully handle missing API keys with helpful setup instructions*

#### 🔎 Advanced Search (6 tools)
- `advancedTweetSearch` - Complex queries with operators, bypasses API tier restrictions
- `historicalTweetSearch` - Access historical tweets beyond standard API limits
- `trendingTopicsSearch` - Real-time trend analysis and popular content discovery
- `bulkUserProfiles` - Multi-user profile analysis in single requests
- `userGrowthAnalytics` - User growth pattern analysis over time
- `userInfluenceMetrics` - Engagement scoring and influence calculations

#### 🧵 Thread & Conversation Analysis (3 tools)
- `getFullThread` - Reconstruct complete Twitter threads with engagement metrics
- `getConversationTree` - Map conversation structure including replies and quotes
- `getThreadMetrics` - Thread performance analysis and engagement distribution

#### 🌐 Network Analysis (3 tools)
- `findMutualConnections` - Discover mutual connections via interactions
- `analyzeFollowerDemographics` - Follower patterns and demographic analysis
- `mapInfluenceNetwork` - Influence mapping and connection strength analysis

#### 📈 Advanced Analytics (3 tools)
- `getHashtagTrends` - Hashtag performance tracking over time with trend analysis
- `analyzeSentiment` - Sentiment analysis with keyword frequency tracking
- `trackVirality` - Viral spread patterns and engagement velocity analysis

#### 📱 Direct Messages & Moderation (5 tools)
- Various DM and user moderation tools

## 🔑 API Keys Setup

### Twitter API (Required)
Get these from [Twitter Developer Portal](https://developer.twitter.com/):

```env
X_API_KEY=your_api_key_here
X_API_SECRET=your_api_secret_here  
X_ACCESS_TOKEN=your_access_token_here
X_ACCESS_TOKEN_SECRET=your_access_token_secret_here
```

### SocialData.tools API (Optional)
Enables 20 enhanced research tools that bypass Twitter API limitations:

1. **Sign up** at [SocialData.tools](https://socialdata.tools)
2. **Get your API key** from the dashboard
3. **Add to .env file:**
   ```env
   SOCIALDATA_API_KEY=your_socialdata_api_key_here
   ```

**Without SocialData API key:** Enhanced research tools will show helpful setup instructions instead of errors.

## 🧪 Testing SocialData.tools Integration

### Test Enhanced Research Tools
```bash
# Test advanced tweet search (bypasses Twitter API Pro tier requirement)
source .env && echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "advancedTweetSearch", "arguments": {"query": "AI OR machine learning", "maxResults": 5}}}' | node dist/index.js

# Test sentiment analysis
source .env && echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "analyzeSentiment", "arguments": {"query": "ChatGPT", "sampleSize": 20}}}' | node dist/index.js

# Test user influence metrics
source .env && echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "userInfluenceMetrics", "arguments": {"username": "openai"}}}' | node dist/index.js

# Test thread analysis
source .env && echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "getFullThread", "arguments": {"tweetId": "1234567890123456789"}}}' | node dist/index.js
```

### Test Without API Key
```bash
# These will show helpful setup instructions instead of errors
SOCIALDATA_API_KEY="" echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "advancedTweetSearch", "arguments": {"query": "test"}}}' | node dist/index.js
```

## 🆚 When to Use Which Tools

### Twitter API vs SocialData.tools Comparison

| Use Case | Twitter API Tool | SocialData.tools Alternative | Advantage |
|----------|------------------|-------------------------------|-----------|
| **Basic Search** | `searchTweets` ⚠️ (Pro tier $5k/month) | `advancedTweetSearch` ✅ | Bypasses API restrictions |
| **User Analysis** | `getUserInfo` ✅ | `userInfluenceMetrics` ✅ | Enhanced analytics |
| **Historical Data** | Limited by API tier | `historicalTweetSearch` ✅ | Access older tweets |
| **Sentiment Analysis** | Not available | `analyzeSentiment` ✅ | Built-in sentiment scoring |
| **Thread Analysis** | Manual reconstruction | `getFullThread` ✅ | Automated thread mapping |
| **Network Mapping** | Not available | `mapInfluenceNetwork` ✅ | Connection analysis |
| **Hashtag Trends** | `getHashtagAnalytics` ⚠️ (Pro tier) | `getHashtagTrends` ✅ | No tier restrictions |

### Recommended Workflow
1. **Start with Twitter API tools** for posting, engagement, and basic operations
2. **Use SocialData.tools** for research, analytics, and advanced insights
3. **Combine both** for comprehensive Twitter automation and analysis

## 🎯 MCP Workflow Prompts

Our server includes 5 professional workflow templates:

### 1. Tweet Composition (`compose-tweet`)
Interactive guidance for creating engaging tweets with hashtags, mentions, and media.

### 2. Analytics Reporting (`analytics-report`) 
Comprehensive X (Twitter) analytics workflow for business insights.

### 3. Content Strategy (`content-strategy`)
Strategic content planning and audience engagement workflows.

### 4. Community Management (`community-management`)
Customer service and community engagement best practices.

### 5. Hashtag Research (`hashtag-research`)
Industry-specific hashtag research and trend analysis.

## 📊 Dynamic Resources

Real-time information accessible via MCP:

- **API Rate Limits** - Live usage monitoring
- **Access Level Status** - Current tier capabilities  
- **Tool Status Report** - Working vs limited tools
- **Quick Start Guide** - Getting started documentation
- **Workflow Templates** - Pre-built automation examples
- **User Profile Data** - Dynamic user information (live API calls)

## 🧪 Testing

### Manual Testing
```bash
# Test working tools
source .env && echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "postTweet", "arguments": {"text": "Hello from MCP!"}}}' | node dist/index.js

# Test user info
source .env && echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "getUserInfo", "arguments": {"username": "elonmusk"}}}' | node dist/index.js

# Test limited tools (will show upgrade guidance)
source .env && echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "searchTweets", "arguments": {"query": "MCP"}}}' | node dist/index.js
```

### Test Results Summary
- **18 Tools Working** on Basic tier
- **4 Tools Limited** by API tier/permissions
- **Professional error messages** with upgrade guidance
- **All core functionality** operational

## 🔧 Integration Examples

### MCP Client (Cursor/Claude)
```json
{
  "mcpServers": {
    "x-twitter": {
      "command": "node",
      "args": ["/path/to/twitter-server/dist/index.js"],
      "env": {
        "X_API_KEY": "your_api_key",
        "X_API_SECRET": "your_api_secret", 
        "X_ACCESS_TOKEN": "your_access_token",
        "X_ACCESS_TOKEN_SECRET": "your_access_token_secret"
      }
    }
  }
}
```

### Direct JSON-RPC
```bash
# Always source environment first
source .env

# List all tools
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | node dist/index.js

# Call specific tool
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "toolName", "arguments": {"param": "value"}}}' | node dist/index.js
```

## 📝 API Documentation

### Tweet Operations

**postTweet**
```json
{
  "text": "Your tweet content (up to 280 characters)"
}
```

**getTweetById** 
```json
{
  "tweetId": "1234567890123456789",
  "tweetFields": ["created_at", "public_metrics", "author_id"]
}
```

**replyToTweet**
```json
{
  "tweetId": "1234567890123456789", 
  "text": "Your reply content"
}
```

### User Operations

**getUserInfo**
```json
{
  "username": "elonmusk",
  "fields": ["description", "public_metrics", "profile_image_url"]
}
```

**followUser**
```json
{
  "username": "target_username"
}
```

### Engagement

**likeTweet**
```json
{
  "tweetId": "1234567890123456789"
}
```

**retweet**
```json
{
  "tweetId": "1234567890123456789"
}
```

## 🚨 Error Handling

### Professional Error Messages

Our enhanced error handling provides:

- **Clear API tier explanations** for limited tools
- **Upgrade pricing information** ($5,000/month Pro tier)
- **Direct upgrade links** to Twitter Developer Portal
- **Alternative solution suggestions**

Example error response:
```json
{
  "error": "This endpoint requires X (Twitter) API Pro tier access ($5,000/month). Visit https://developer.twitter.com/en/docs/twitter-api/getting-started/about-twitter-api#v2-access-leve to upgrade your access level."
}
```

## 📁 Project Structure

```
twitter-server/
├── src/
│   ├── handlers/          # API endpoint handlers
│   ├── prompts.ts        # MCP workflow prompts  
│   ├── resources.ts      # Dynamic MCP resources
│   └── index.ts          # Main MCP server
├── dist/                 # Compiled JavaScript
├── scripts/              # Documentation & PRD
└── package.json
```

## 🔄 Development

### Build & Run
```bash
npm run build    # Compile TypeScript
npm start        # Start production server
npm run dev      # Development mode with watch
```

### Adding New Tools

1. **Add handler function** in appropriate `src/handlers/` file
2. **Register tool** in `src/index.ts` 
3. **Add documentation** to this README
4. **Test with JSON-RPC** calls

### Contributing

1. Follow existing code patterns
2. Add proper error handling with professional messages
3. Test with both working and failing scenarios
4. Update documentation

## 📋 Known Limitations

### API Tier Restrictions
- **searchTweets**: Requires Pro tier ($5,000/month)
- **getHashtagAnalytics**: Requires Pro tier
- **getFollowers/getFollowing**: Requires special permissions (403 errors)
- **getLikedTweets**: Parameter validation issues

### Recommendations
- **Current Setup**: Excellent for basic X (Twitter) automation
- **For Advanced Analytics**: Consider Pro tier upgrade
- **For Followers/Following**: Request elevated permissions

## 🆘 Troubleshooting

### Common Issues

**Error: "fetch is not defined"**
```bash
# Ensure Node.js 18+ 
node --version
```

**403 Permission Errors**
- Check API credentials are correct
- Verify account has required permissions  
- Some endpoints need special approval

**400 Bad Request Errors**
- Review parameter formats
- Check our enhanced error messages for guidance
- Verify API tier supports the endpoint

### Getting Help

1. **Check error messages** - Our enhanced error handling provides clear guidance
2. **Review API documentation** - X (Twitter) Developer Portal
3. **Test with working tools first** - Verify basic setup
4. **Check environment variables** - Ensure all credentials are set

---

## 📊 Current Status

- **53 Total Tools**: 33 Twitter API + 20 SocialData.tools enhanced research
- **Advanced Analytics**: Thread analysis, network mapping, sentiment analysis, viral tracking
- **Graceful API Key Handling**: Enhanced tools show helpful setup instructions when API key missing
- **Bypasses API Restrictions**: Research tools work without Twitter Pro tier requirements
- **Professional Error Handling**: Clear upgrade guidance and user-friendly messages
- **Full MCP Compliance**: Tools, prompts, resources
- **Production Ready**: Enhanced reliability, comprehensive analytics, and excellent UX

Built with ❤️ using the Model Context Protocol and SocialData.tools integration
