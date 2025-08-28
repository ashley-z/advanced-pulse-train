# Figma MCP Integration

This project connects Figma files to the Model Context Protocol (MCP), allowing you to interact with Figma design files through MCP-compatible clients.

## Features

- **Figma File Access**: Retrieve file information, nodes, and metadata
- **Image Export**: Export Figma components and frames as images
- **Comments**: Access and read Figma file comments
- **MCP Compliance**: Full Model Context Protocol implementation
- **Resource Management**: List and read Figma files as MCP resources

## Prerequisites

1. **Node.js** (v16 or higher)
2. **Figma Access Token**: Get your personal access token from [Figma Account Settings](https://www.figma.com/developers/api#access-tokens)
3. **Figma File Key**: The file key from your Figma file URL (e.g., `https://www.figma.com/file/XXXXX/...`)

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your Figma credentials:
   ```env
   FIGMA_ACCESS_TOKEN=your_figma_access_token_here
   FIGMA_FILE_KEY=your_figma_file_key_here
   ```

3. **Get Your Figma Access Token**:
   - Go to [Figma Account Settings](https://www.figma.com/developers/api#access-tokens)
   - Click "Generate new token"
   - Copy the token to your `.env` file

4. **Get Your Figma File Key**:
   - Open your Figma file in the browser
   - Copy the file key from the URL: `https://www.figma.com/file/XXXXX/...`
   - The `XXXXX` part is your file key

## Usage

### Running the MCP Server

```bash
node figma-mcp-server.js
```

### Using the Example Client

```bash
node client-example.js
```

### Programmatic Usage

```javascript
const FigmaMCPClient = require('./client-example');

async function example() {
  const client = new FigmaMCPClient();
  
  try {
    await client.connect();
    
    // List available resources
    const resources = await client.listResources();
    
    // Read a specific Figma file
    const fileContent = await client.readResource('figma://file/YOUR_FILE_KEY');
    
    // Get file information
    const fileInfo = await client.getFigmaFile('YOUR_FILE_KEY');
    
    // Get specific node
    const nodeInfo = await client.getFigmaNode('YOUR_FILE_KEY', 'NODE_ID');
    
    // Export images
    const images = await client.exportFigmaImages('YOUR_FILE_KEY', ['NODE_ID'], 'png');
    
    // Get comments
    const comments = await client.getFigmaComments('YOUR_FILE_KEY');
    
  } finally {
    await client.disconnect();
  }
}
```

## Available Tools

### `get_figma_file`
Retrieves information about a Figma file.

**Parameters:**
- `fileKey` (string): The Figma file key

### `get_figma_node`
Gets information about a specific node in a Figma file.

**Parameters:**
- `fileKey` (string): The Figma file key
- `nodeId` (string): The node ID to retrieve

### `export_figma_images`
Exports Figma nodes as images.

**Parameters:**
- `fileKey` (string): The Figma file key
- `nodeIds` (array): Array of node IDs to export
- `format` (string): Export format (png, jpg, svg, pdf)

### `get_figma_comments`
Retrieves comments from a Figma file.

**Parameters:**
- `fileKey` (string): The Figma file key

## Available Resources

### `figma://files`
Lists all accessible Figma files for the authenticated user.

### `figma://file/{fileKey}`
Provides access to a specific Figma file's content and metadata.

## MCP Integration

This server implements the Model Context Protocol and can be used with any MCP-compatible client. The server provides:

- **Tools**: Function calls for Figma API operations
- **Resources**: File-like access to Figma data
- **Stdio Transport**: Communication via standard input/output

## Error Handling

The server includes comprehensive error handling for:
- Invalid Figma tokens
- File access permissions
- Network connectivity issues
- Invalid file keys or node IDs

## Security Notes

- Never commit your `.env` file to version control
- Keep your Figma access token secure
- The token has access to all files you can view in Figma

## Troubleshooting

### Common Issues

1. **"FIGMA_ACCESS_TOKEN is required"**
   - Make sure you've set the token in your `.env` file
   - Verify the token is valid in Figma

2. **"Failed to fetch Figma file"**
   - Check if the file key is correct
   - Ensure you have access to the file
   - Verify your internet connection

3. **"Unknown tool" or "Unknown resource"**
   - Make sure you're using the correct tool/resource names
   - Check the documentation above for available options

### Debug Mode

To enable debug logging, set the `DEBUG` environment variable:

```bash
DEBUG=* node figma-mcp-server.js
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
