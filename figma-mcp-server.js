import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

class FigmaMCPServer {
  constructor() {
    this.figmaToken = process.env.FIGMA_ACCESS_TOKEN;
    this.figmaFileKey = process.env.FIGMA_FILE_KEY;
    this.figmaApiBase = 'https://api.figma.com/v1';
    
    if (!this.figmaToken) {
      throw new Error('FIGMA_ACCESS_TOKEN is required in environment variables');
    }
    
    this.server = new Server(
      {
        name: 'figma-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    this.setupTools();
    this.setupResources();
  }

  setupTools() {
    // Tool to get Figma file information
    this.server.setRequestHandler('tools/call', async (request) => {
      const { name, arguments: args } = request.params;
      
      switch (name) {
        case 'get_figma_file':
          return await this.getFigmaFile(args.fileKey || this.figmaFileKey);
        
        case 'get_figma_node':
          return await this.getFigmaNode(args.fileKey || this.figmaFileKey, args.nodeId);
        
        case 'export_figma_images':
          return await this.exportFigmaImages(args.fileKey || this.figmaFileKey, args.nodeIds, args.format);
        
        case 'get_figma_comments':
          return await this.getFigmaComments(args.fileKey || this.figmaFileKey);
        
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  setupResources() {
    // Resource to list available Figma files
    this.server.setRequestHandler('resources/list', async (request) => {
      return {
        resources: [
          {
            uri: 'figma://files',
            name: 'Figma Files',
            description: 'List of accessible Figma files',
            mimeType: 'application/json',
          },
          {
            uri: `figma://file/${this.figmaFileKey}`,
            name: 'Current Figma File',
            description: 'The currently configured Figma file',
            mimeType: 'application/json',
          },
        ],
      };
    });

    // Resource to read Figma file content
    this.server.setRequestHandler('resources/read', async (request) => {
      const { uri } = request.params;
      
      if (uri === 'figma://files') {
        return await this.listFigmaFiles();
      } else if (uri.startsWith('figma://file/')) {
        const fileKey = uri.replace('figma://file/', '');
        return await this.getFigmaFile(fileKey);
      }
      
      throw new Error(`Unknown resource: ${uri}`);
    });
  }

  async getFigmaFile(fileKey) {
    try {
      const response = await axios.get(`${this.figmaApiBase}/files/${fileKey}`, {
        headers: {
          'X-Figma-Token': this.figmaToken,
        },
      });

      return {
        contents: [
          {
            uri: `figma://file/${fileKey}`,
            mimeType: 'application/json',
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to fetch Figma file: ${error.message}`);
    }
  }

  async getFigmaNode(fileKey, nodeId) {
    try {
      const response = await axios.get(`${this.figmaApiBase}/files/${fileKey}/nodes?ids=${nodeId}`, {
        headers: {
          'X-Figma-Token': this.figmaToken,
        },
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to fetch Figma node: ${error.message}`);
    }
  }

  async exportFigmaImages(fileKey, nodeIds, format = 'png') {
    try {
      const ids = Array.isArray(nodeIds) ? nodeIds.join(',') : nodeIds;
      const response = await axios.get(`${this.figmaApiBase}/images/${fileKey}?ids=${ids}&format=${format}`, {
        headers: {
          'X-Figma-Token': this.figmaToken,
        },
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to export Figma images: ${error.message}`);
    }
  }

  async getFigmaComments(fileKey) {
    try {
      const response = await axios.get(`${this.figmaApiBase}/files/${fileKey}/comments`, {
        headers: {
          'X-Figma-Token': this.figmaToken,
        },
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to fetch Figma comments: ${error.message}`);
    }
  }

  async listFigmaFiles() {
    try {
      const response = await axios.get(`${this.figmaApiBase}/me/files`, {
        headers: {
          'X-Figma-Token': this.figmaToken,
        },
      });

      return {
        contents: [
          {
            uri: 'figma://files',
            mimeType: 'application/json',
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to list Figma files: ${error.message}`);
    }
  }

  async run() {
    try {
      const transport = new StdioServerTransport();
      await this.server.connect(transport);
      console.log('Figma MCP Server is running...');
    } catch (error) {
      console.error('Error starting server:', error);
    }
  }
}

// Run the server if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new FigmaMCPServer();
  server.run().catch(console.error);
}

export default FigmaMCPServer;
