const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Figma API configuration
const FIGMA_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;
const FIGMA_API_BASE = 'https://api.figma.com/v1';

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Figma MCP Backend is running' });
});

// Get Figma file information
app.get('/api/figma/file', async (req, res) => {
  try {
    if (!FIGMA_TOKEN || !FIGMA_FILE_KEY) {
      return res.status(400).json({ error: 'Missing Figma configuration' });
    }

    const response = await axios.get(`${FIGMA_API_BASE}/files/${FIGMA_FILE_KEY}`, {
      headers: {
        'X-Figma-Token': FIGMA_TOKEN,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching Figma file:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch Figma file',
      details: error.response?.data || error.message 
    });
  }
});

// Get Figma file comments
app.get('/api/figma/comments', async (req, res) => {
  try {
    if (!FIGMA_TOKEN || !FIGMA_FILE_KEY) {
      return res.status(400).json({ error: 'Missing Figma configuration' });
    }

    const response = await axios.get(`${FIGMA_API_BASE}/files/${FIGMA_FILE_KEY}/comments`, {
      headers: {
        'X-Figma-Token': FIGMA_TOKEN,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching Figma comments:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch Figma comments',
      details: error.response?.data || error.message 
    });
  }
});

// Export Figma images
app.post('/api/figma/export', async (req, res) => {
  try {
    const { nodeIds, format = 'png', scale = '1x' } = req.body;

    if (!FIGMA_TOKEN || !FIGMA_FILE_KEY) {
      return res.status(400).json({ error: 'Missing Figma configuration' });
    }

    if (!nodeIds || !Array.isArray(nodeIds) || nodeIds.length === 0) {
      return res.status(400).json({ error: 'Node IDs are required' });
    }

    const ids = nodeIds.join(',');
    const response = await axios.get(`${FIGMA_API_BASE}/images/${FIGMA_FILE_KEY}`, {
      headers: {
        'X-Figma-Token': FIGMA_TOKEN,
      },
      params: {
        ids,
        format,
        scale,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error exporting Figma images:', error.message);
    res.status(500).json({ 
      error: 'Failed to export Figma images',
      details: error.response?.data || error.message 
    });
  }
});

// Get Figma file versions
app.get('/api/figma/versions', async (req, res) => {
  try {
    if (!FIGMA_TOKEN || !FIGMA_FILE_KEY) {
      return res.status(400).json({ error: 'Missing Figma configuration' });
    }

    const response = await axios.get(`${FIGMA_API_BASE}/files/${FIGMA_FILE_KEY}/versions`, {
      headers: {
        'X-Figma-Token': FIGMA_TOKEN,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching Figma versions:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch Figma versions',
      details: error.response?.data || error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Figma MCP Backend server running on port ${PORT}`);
  console.log(`📁 Connected to Figma file: ${FIGMA_FILE_KEY}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});
