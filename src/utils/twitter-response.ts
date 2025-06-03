import { HandlerResponse } from '../types/handlers.js';

export function createMissingTwitterApiKeyResponse(toolName: string): HandlerResponse {
    const message = `📋 **${toolName} requires Twitter API credentials**

To use Twitter tools, please:

1. **Create a Twitter Developer Account** at https://developer.twitter.com
2. **Create a new Twitter App** and generate API keys
3. **Add to your .env file:**
   \`\`\`
   X_API_KEY=your_api_key_here
   X_API_SECRET=your_api_secret_here
   X_ACCESS_TOKEN=your_access_token_here
   X_ACCESS_TOKEN_SECRET=your_access_token_secret_here
   \`\`\`
4. **Restart the MCP server**

**Alternative:** Use the enhanced SocialData.tools research tools instead (if available)`;

    return { response: message, tools: [] };
}

export function formatTwitterError(error: Error, context: string): string {
    if (error.message.includes('401') || error.message.includes('403')) {
        return `Twitter API authentication failed: ${error.message}. Please check your Twitter API credentials in the .env file.`;
    }
    
    if (error.message.includes('429')) {
        return `Twitter API rate limit exceeded during ${context}. Please wait and try again later.`;
    }
    
    if (error.message.includes('500') || error.message.includes('502') || error.message.includes('503')) {
        return `Twitter API server error during ${context}. Please try again later.`;
    }
    
    return `Twitter API error during ${context}: ${error.message}`;
}