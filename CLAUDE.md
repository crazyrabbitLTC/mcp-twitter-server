# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Build**: `npm run build` - Compiles TypeScript to `dist/` directory
- **Start**: `npm start` - Runs the compiled server from `dist/index.js`
- **Development**: `npm run dev` - Runs TypeScript compiler in watch mode for live rebuilding
- **Install**: `npm install` - Installs dependencies

## Architecture Overview

This is a Model Context Protocol (MCP) server that provides Twitter API integration for LLM applications. The architecture follows a handler-based pattern:

### Core Components

- **Entry Point**: `src/index.ts` - Main server setup with MCP SDK, registers all tool handlers
- **Tool Definitions**: `src/tools.ts` - Centralized tool schemas with Zod validation
- **Twitter Client**: `src/client/twitter.ts` - Wrapper around twitter-api-v2 library
- **Handler Pattern**: `src/handlers/` - Organized by functionality (tweet, user, engagement, list, search)

### Handler Organization

- `tweet.handlers.ts` - Post, get, reply, delete tweets, user timeline
- `user.handlers.ts` - User info, follow/unfollow, followers/following
- `engagement.handlers.ts` - Like, unlike, retweet, retweets
- `list.handlers.ts` - Create lists, add/remove members, get members
- `search.handlers.ts` - Search tweets, hashtag analytics

### Key Patterns

1. **Handler Functions**: Each tool has a dedicated handler function that takes `(client, args)` and returns `{ response: string, tools?: any[] }`
2. **Error Handling**: Standardized error responses across all handlers
3. **Type Safety**: TypeScript interfaces in `src/types/handlers.ts` for handler arguments
4. **MCP Integration**: Server uses stdio transport and follows MCP tool calling patterns

### Environment Setup

Required Twitter API credentials in `.env`:
- `X_API_KEY`
- `X_API_SECRET` 
- `X_ACCESS_TOKEN`
- `X_ACCESS_TOKEN_SECRET`

### Known Issues

Several tools have parameter validation issues causing 400 errors:
- `getUserTimeline` - Invalid request parameters
- `searchTweets` - Query parameter formatting issues  
- `getLikedTweets` - Parameter validation problems

When fixing these, check the Twitter API v2 documentation for correct parameter formatting and ensure handler argument types match the tool schemas in `tools.ts`.