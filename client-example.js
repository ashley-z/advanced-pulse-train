import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

class FigmaMCPClient {
  constructor() {
    this.client = null;
    this.serverProcess = null;
  }

  async connect() {
    // Start the Figma MCP server
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const serverPath = path.join(__dirname, 'figma-mcp-server.js');
    console.log('Starting server at:', serverPath);
    this.serverProcess = spawn('node', [serverPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    // Create transport for the client
    const transport = new StdioClientTransport(
      this.serverProcess.stdin,
      this.serverProcess.stdout
    );

    // Create and connect the client
    this.client = new Client({
      name: 'figma-mcp-client',
      version: '1.0.0',
    });

    await this.client.connect(transport);
    console.log('Connected to Figma MCP Server');
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
    }
    if (this.serverProcess) {
      this.serverProcess.kill();
    }
  }

  async listResources() {
    const response = await this.client.listResources();
    console.log('Available resources:', response.resources);
    return response.resources;
  }

  async readResource(uri) {
    const response = await this.client.readResource({ uri });
    console.log(`Resource ${uri}:`, response.contents);
    return response.contents;
  }

  async callTool(name, args = {}) {
    const response = await this.client.callTool({
      name,
      arguments: args,
    });
    console.log(`Tool ${name} result:`, response.content);
    return response.content;
  }

  async getFigmaFile(fileKey) {
    return await this.callTool('get_figma_file', { fileKey });
  }

  async getFigmaNode(fileKey, nodeId) {
    return await this.callTool('get_figma_node', { fileKey, nodeId });
  }

  async exportFigmaImages(fileKey, nodeIds, format = 'png') {
    return await this.callTool('export_figma_images', { fileKey, nodeIds, format });
  }

  async getFigmaComments(fileKey) {
    return await this.callTool('get_figma_comments', { fileKey });
  }
}

// Example usage
async function main() {
  const client = new FigmaMCPClient();
  
  try {
    await client.connect();

    // List available resources
    console.log('\n=== Listing Resources ===');
    await client.listResources();

    // Read Figma files list
    console.log('\n=== Reading Figma Files ===');
    await client.readResource('figma://files');

    // If you have a specific file key, you can read it
    if (process.env.FIGMA_FILE_KEY) {
      console.log('\n=== Reading Specific Figma File ===');
      await client.readResource(`figma://file/${process.env.FIGMA_FILE_KEY}`);
    }

    // Example tool calls
    console.log('\n=== Tool Examples ===');
    
    // Get file information
    if (process.env.FIGMA_FILE_KEY) {
      await client.getFigmaFile(process.env.FIGMA_FILE_KEY);
    }

    // Get comments
    if (process.env.FIGMA_FILE_KEY) {
      await client.getFigmaComments(process.env.FIGMA_FILE_KEY);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.disconnect();
  }
}

// Run the example if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  import('dotenv').then(dotenv => dotenv.config());
  main().catch(console.error);
}

export default FigmaMCPClient;
