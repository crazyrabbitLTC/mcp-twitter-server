```markdown
# Twitter MCP Server
[![smithery badge](https://smithery.ai/badge/mcp-twitter-server)](https://smithery.ai/server/mcp-twitter-server)

A Model Context Protocol (MCP) server that allows Large Language Models (LLMs) to interact with Twitter (X). This server provides tools for posting tweets, searching tweets, and replying to tweets.

## Features

-   **Post Tweets:** Allows LLMs to post new tweets to your Twitter account.
-   **Search Tweets:** Allows LLMs to search for tweets based on keywords.
-   **Reply to Tweets:** Allows LLMs to reply to existing tweets, which can be used to make threads.

## Prerequisites

Before you begin, ensure you have met the following requirements:

*   **Node.js** (version 18 or higher) installed. You can download it from [nodejs.org](https://nodejs.org/).
*   **npm** (comes with Node.js)
*   A **Twitter Developer Account** and API keys (see [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)). You will need API Key, API Secret Key, Access Token, Access Token Secret.
*   **Claude for Desktop** installed. You can download it from [claude.ai/download](https://claude.ai/download).

## Installation

### Installing via Smithery

To install Twitter for Claude Desktop automatically via [Smithery](https://smithery.ai/server/mcp-twitter-server):

```bash
npx -y @smithery/cli install mcp-twitter-server --client claude
```

### Manual Installation
1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    *   Create a `.env` file in the root of the repository.
    *   Add your Twitter API keys and access tokens.

        ```env
        # Twitter API Credentials
        X_API_KEY=your_api_key
        X_API_SECRET=your_api_secret
        X_ACCESS_TOKEN=your_access_token
        X_ACCESS_TOKEN_SECRET=your_access_token_secret
        ```

    *   Replace `your_api_key`, `your_api_secret`, `your_access_token`, and `your_access_token_secret` with your actual Twitter API credentials.

4.  **Build the server:**

    ```bash
    npm run build
    ```

## Running the Server

To start the server:

```bash
node dist/index.js
```

The server will start and listen for MCP connections, logging to the console.

## Using with Claude Desktop

To connect this Twitter MCP server to Claude Desktop:

1.  **Open Claude Desktop Settings:**
    *   Open the Claude Desktop application.
    *   Click the Claude menu from the top of your screen.
    *   Select "Settings...".
2.  **Open Developer Settings:**
    *   Select the "Developer" tab in the left panel.
    *   Click "Edit Config." This should open a `claude_desktop_config.json` file in your text editor. If this file doesn't exist, it will be created for you.
3.  **Add the Server Configuration:**
    *   Add the following configuration inside the `mcpServers` object in `claude_desktop_config.json`. If you don't have this object, create it. Make sure that this file is in valid JSON format.
      *   **Important:** Update the `"args"` path to match the location of your `dist/index.js` file and add your actual twitter keys in the `env` section.

    ```json
    {
      "mcpServers": {
        "twitter": {
          "command": "node",
          "args": [
            "/ABSOLUTE/PATH/TO/YOUR/PROJECT/dist/index.js"
          ],
          "env": {
              "X_API_KEY": "YOUR_TWITTER_API_KEY",
              "X_API_SECRET": "YOUR_TWITTER_API_SECRET",
              "X_ACCESS_TOKEN": "YOUR_TWITTER_ACCESS_TOKEN",
              "X_ACCESS_TOKEN_SECRET": "YOUR_TWITTER_ACCESS_TOKEN_SECRET"

          }
        }
      }
    }
    ```
    -   Replace `/ABSOLUTE/PATH/TO/YOUR/PROJECT` with the correct absolute path to the directory containing your `dist/index.js` file.
    -   Replace `YOUR_TWITTER_API_KEY`, `YOUR_TWITTER_API_SECRET`, `YOUR_TWITTER_ACCESS_TOKEN`, and `YOUR_TWITTER_ACCESS_TOKEN_SECRET` with your actual Twitter API credentials in the `env` section.
    -   **macOS path example:** `/Users/yourusername/path/to/your/project/dist/index.js`
    -   **Windows path example:** `C:\\Users\\yourusername\\path\\to\\your\\project\\dist\\index.js`
4.  **Save and Restart:**
    *   Save the `claude_desktop_config.json` file.
    *   Restart Claude Desktop.

After restarting, the Twitter MCP server should be connected. You can verify this by:

1.  Looking for the hammer <img src="https://mintlify.s3.us-west-1.amazonaws.com/mcp/images/claude-desktop-mcp-hammer-icon.svg" style="display: inline; margin: 0; height: 1.3em;" /> icon in the input bar
2.  Clicking the icon to see that the `postTweet`, `searchTweets`, and `replyToTweet` tools are available.

## Using the tools in Claude

Once the server is set up and connected, you can use the available tools by prompting Claude. For example:

*   **Post a tweet:**

    ```text
    Post a tweet saying "Hello, world!"
    ```

*   **Search for tweets:**

    ```text
    Search for tweets about "artificial intelligence".
    ```

*   **Reply to a tweet:**
    *   First search for a tweet using the `searchTweets` tool:
    ```text
        Search for tweets about "test"
    ```
        *   Copy the tweet `id` from the search results.
    *  Then reply to the tweet:
    ```text
       Reply to tweet with id <PASTE_TWEET_ID_HERE> saying "This is a reply."
    ```
    * Replace `<PASTE_TWEET_ID_HERE>` with the tweet id you got from the search results.

Claude will interpret the prompts, identify the appropriate tools, and execute them through the server.

**Important Notes:**
*   When Claude is executing these tools, it will ask you for permission before actually performing actions (posting a tweet etc)
*  If you are getting errors, you can view the logs by checking `~/Library/Logs/Claude` on MacOS and `%APPDATA%\Claude\logs` on Windows.

## Development

To run the server outside of Claude, you can:

1.  **Set up environment variables:** Make sure you have setup your `.env` file with your twitter keys
2.  **Build the server:** `npm run build`
3.  **Run the server directly:** `node dist/index.js`

## Contributing

Contributions are welcome! Please feel free to submit pull requests or create issues to suggest improvements.

## License

This project is licensed under the MIT License.
```
