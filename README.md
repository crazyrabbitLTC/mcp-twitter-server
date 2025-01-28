# Twitter MCP Server

[![smithery badge](https://smithery.ai/badge/mcp-twitter-server)](https://smithery.ai/server/mcp-twitter-server)

A Model Context Protocol server implementation for Twitter API integration.

### Installing via Smithery

To install Twitter MCP Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/mcp-twitter-server):

```bash
npx -y @smithery/cli install mcp-twitter-server --client claude
```

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in your Twitter API credentials
4. Build the project: `npm run build`
5. Start the server: `npm start`

## Environment Variables

Required Twitter API credentials in `.env`:

```env
X_API_KEY=your_api_key
X_API_SECRET=your_api_secret
X_ACCESS_TOKEN=your_access_token
X_ACCESS_TOKEN_SECRET=your_access_token_secret
```

## Available Tools

### Tweet Operations

- `postTweet`: Post a new tweet
  ```json
  {
    "text": "Your tweet text here"
  }
  ```

- `postTweetWithMedia`: Post a tweet with media attachment
  ```json
  {
    "text": "Your tweet text",
    "mediaPath": "path/to/media/file",
    "mediaType": "image/jpeg|image/png|image/gif|video/mp4",
    "altText": "Optional alt text for accessibility"
  }
  ```

- `getTweetById`: Get a specific tweet by ID
  ```json
  {
    "tweetId": "tweet_id",
    "tweetFields": ["created_at", "public_metrics"]
  }
  ```

- `replyToTweet`: Reply to an existing tweet
  ```json
  {
    "tweetId": "tweet_id",
    "text": "Your reply text"
  }
  ```

- `deleteTweet`: Delete a tweet
  ```json
  {
    "tweetId": "tweet_id"
  }
  ```

### Search & Analytics

- `searchTweets`: Search for tweets
  ```json
  {
    "query": "search query",
    "maxResults": 10,
    "tweetFields": ["created_at", "public_metrics"]
  }
  ```

- `getHashtagAnalytics`: Get analytics for a hashtag
  ```json
  {
    "hashtag": "hashtag",
    "startTime": "ISO-8601 date",
    "endTime": "ISO-8601 date"
  }
  ```

### User Operations

- `getUserInfo`: Get user information
  ```json
  {
    "username": "twitter_username",
    "fields": ["description", "public_metrics"]
  }
  ```

- `getUserTimeline`: Get user's tweets
  ```json
  {
    "username": "twitter_username",
    "maxResults": 10,
    "tweetFields": ["created_at", "public_metrics"]
  }
  ```

- `getFollowers`: Get user's followers
  ```json
  {
    "username": "twitter_username",
    "maxResults": 100,
    "userFields": ["description", "public_metrics"]
  }
  ```

- `getFollowing`: Get accounts a user follows
  ```json
  {
    "username": "twitter_username",
    "maxResults": 100,
    "userFields": ["description", "public_metrics"]
  }
  ```

### Engagement

- `likeTweet`: Like a tweet
  ```json
  {
    "tweetId": "tweet_id"
  }
  ```

- `unlikeTweet`: Unlike a tweet
  ```json
  {
    "tweetId": "tweet_id"
  }
  ```

- `retweet`: Retweet a tweet
  ```json
  {
    "tweetId": "tweet_id"
  }
  ```

- `undoRetweet`: Undo a retweet
  ```json
  {
    "tweetId": "tweet_id"
  }
  ```

- `getRetweets`: Get users who retweeted a tweet
  ```json
  {
    "tweetId": "tweet_id",
    "maxResults": 100,
    "userFields": ["description", "public_metrics"]
  }
  ```

- `getLikedTweets`: Get tweets liked by a user
  ```json
  {
    "userId": "user_id",
    "maxResults": 100,
    "tweetFields": ["created_at", "public_metrics"]
  }
  ```

### List Management

- `createList`: Create a new list
  ```json
  {
    "name": "List name",
    "description": "List description",
    "isPrivate": false
  }
  ```

- `addUserToList`: Add a user to a list
  ```json
  {
    "listId": "list_id",
    "username": "twitter_username"
  }
  ```

- `removeUserFromList`: Remove a user from a list
  ```json
  {
    "listId": "list_id",
    "username": "twitter_username"
  }
  ```

- `getListMembers`: Get members of a list
  ```json
  {
    "listId": "list_id",
    "maxResults": 100,
    "userFields": ["description", "public_metrics"]
  }
  ```

## Error Handling

All tools return standardized error responses:
- Missing parameters: `Missing required parameter: parameter_name`
- API errors: Error message from Twitter API
- Not found errors: Appropriate "not found" message for the resource

## Response Format

All successful responses follow this format:
```json
{
  "content": [
    {
      "type": "text",
      "text": "Operation result message"
    }
  ]
}
```

## Development

- Build: `npm run build`
- Start: `npm start`
- Watch mode: `npm run dev`
```
Here's a comprehensive status report of all Twitter tools:

## Working Tools (✓)

1. postTweet
```
Status: Working perfectly
Response: Returns tweet ID
Latest test: Success
```

2. getTweetById
```
Status: Working perfectly
Response: Returns complete tweet data
Latest test: Success
```

3. likeTweet & unlikeTweet
```
Status: Working perfectly
Response: Confirmation of action
Latest test: Success
```

4. retweet & undoRetweet
```
Status: Working perfectly
Response: Confirmation of action
Latest test: Success
```

5. replyToTweet
```
Status: Working perfectly
Response: Returns reply tweet ID
Latest test: Success
```

6. getUserInfo
```
Status: Working perfectly
Response: Complete user profile data
Latest test: Success
```

7. followUser & unfollowUser
```
Status: Working perfectly
Response: Confirmation of action
Latest test: Success
```

8. createList
```
Status: Working perfectly
Response: Confirmation of list creation
Latest test: Success
```

9. getUserLists
```
Status: Working perfectly
Response: Returns both owned and member lists
Latest test: Success
```

## Tools with Issues (⚠️)

1. getUserTimeline
```
Status: Error 400
Error: Invalid Request parameters
Fix needed: Parameter validation
```

2. searchTweets
```
Status: Error 400
Error: Invalid Request parameters
Fix needed: Query parameter formatting
```

3. getLikedTweets
```
Status: Error 400
Error: Invalid Request parameters
Fix needed: Parameter validation
```

## Missing Tools (❌)
- getHomeTimeline (not found in available tools)
- getFollowers (not available)
- getFollowing (not available)
- getHashtagAnalytics (not available)

## Priority Fixes Needed

1. Parameter Validation:
```typescript
// Implement for getUserTimeline, searchTweets, getLikedTweets
interface TwitterParamValidator {
  validateTimelineParams(params: any): boolean;
  validateSearchParams(params: any): boolean;
  validateLikedTweetsParams(params: any): boolean;
}
```

2. Error Handling:
```typescript
// Enhance error handling for 400 errors
interface TwitterErrorHandler {
  handle400Error(endpoint: string, params: any): void;
  logErrorDetails(error: any): void;
  suggestParameterFixes(params: any): string[];
}
```
