# Figma Access Token Setup Guide

## Current Issue
Your current Figma access token doesn't have the required scopes. The error message indicates it needs the `current_user:read` scope, and for full functionality, it should also include file access scopes.

## Required Scopes
For the MCP integration to work properly, your Figma access token needs these scopes:

- `current_user:read` - Read user information
- `file_content:read` - Read file content and structure
- `file_metadata:read` - Read file metadata
- `file_versions:read` - Read file version history
- `library_assets:read` - Read library assets
- `library_content:read` - Read library content
- `projects:read` - Read project information

## How to Get a Token with Proper Scopes

### Option 1: Personal Access Token (Recommended)
1. Go to [Figma Account Settings](https://www.figma.com/settings)
2. Scroll down to "Personal access tokens"
3. Click "Generate new token"
4. **Important**: Make sure to select all the required scopes listed above
5. Copy the new token and update your `.env` file

### Option 2: OAuth App (For Production)
If you're building a production application, you should create an OAuth app:

1. Go to [Figma Developers](https://www.figma.com/developers)
2. Click "Create a new app"
3. Configure the app with the required scopes
4. Use OAuth flow to get user tokens

## Update Your Configuration

Once you have a new token with proper scopes:

1. Update your `.env` file:
   ```env
   FIGMA_ACCESS_TOKEN=your_new_token_with_proper_scopes
   FIGMA_FILE_KEY=your_figma_file_key_here
   ```

2. Test the connection:
   ```bash
   node test-figma-api.js
   ```

## Testing Your Token

After updating the token, run the test script to verify it works:

```bash
node test-figma-api.js
```

You should see output like:
```
Testing Figma API connection...
Token: ✅ Set

1. Testing: Get user information...
✅ Success! User info retrieved
   User ID: [your-user-id]
   Email: [your-email]
   Name: [your-name]

2. Testing: Get user files...
✅ Success! Found X files
   First file: [file-name]
   File key: [file-key]
   Last modified: [date]
```

## Security Notes

- Never commit your `.env` file to version control
- Keep your access token secure
- Tokens can be revoked and regenerated if needed
- Consider using environment variables in production

## Troubleshooting

If you still get permission errors after updating the token:

1. Make sure you selected all required scopes when creating the token
2. Wait a few minutes for the token to propagate
3. Check if you have access to the Figma files you're trying to access
4. Verify the token is correctly copied to the `.env` file
