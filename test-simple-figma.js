import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const FIGMA_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;
const FIGMA_API_BASE = 'https://api.figma.com/v1';

async function testSimpleFigma() {
  console.log('Testing Figma API with new token...');
  console.log('Token:', FIGMA_TOKEN ? '✅ Set' : '❌ Not set');
  console.log('File Key:', FIGMA_FILE_KEY !== 'your_figma_file_key_here' ? '✅ Set' : '❌ Not set');
  
  if (!FIGMA_TOKEN) {
    console.error('No Figma token found in environment variables');
    return;
  }

  try {
    // Test 1: Get user information
    console.log('\n1. Testing: Get user information...');
    const userResponse = await axios.get(`${FIGMA_API_BASE}/me`, {
      headers: {
        'X-Figma-Token': FIGMA_TOKEN,
      },
    });
    
    console.log('✅ Success! User info retrieved');
    console.log('   User ID:', userResponse.data.id);
    console.log('   Email:', userResponse.data.email);
    
    // Test 2: If we have a file key, test file access
    if (FIGMA_FILE_KEY && FIGMA_FILE_KEY !== 'your_figma_file_key_here') {
      console.log('\n2. Testing: Get file details...');
      const fileResponse = await axios.get(`${FIGMA_API_BASE}/files/${FIGMA_FILE_KEY}`, {
        headers: {
          'X-Figma-Token': FIGMA_TOKEN,
        },
      });
      
      console.log('✅ Success! File details retrieved');
      console.log('   Document name:', fileResponse.data.document?.name);
      console.log('   Version:', fileResponse.data.version);
      console.log('   Last modified:', new Date(fileResponse.data.lastModified).toLocaleString());
      
      // Test 3: Get file comments
      console.log('\n3. Testing: Get file comments...');
      const commentsResponse = await axios.get(`${FIGMA_API_BASE}/files/${FIGMA_FILE_KEY}/comments`, {
        headers: {
          'X-Figma-Token': FIGMA_TOKEN,
        },
      });
      
      console.log('✅ Success! Found', commentsResponse.data.comments?.length || 0, 'comments');
      
      console.log('\n🎉 All tests passed! Your Figma MCP integration is ready.');
      console.log('\n📝 Next steps:');
      console.log('1. Your token is working correctly');
      console.log('2. You can now use the MCP server with your Figma files');
      console.log('3. Run: node client-example.js to test the MCP integration');
      
    } else {
      console.log('\n⚠️  No file key configured');
      console.log('To test file access, add your Figma file key to the .env file:');
      console.log('FIGMA_FILE_KEY=your_actual_file_key_here');
      console.log('\nYou can get the file key from your Figma file URL:');
      console.log('https://www.figma.com/file/XXXXX/... (the XXXXX part is your file key)');
    }
    
  } catch (error) {
    console.error('❌ Error testing Figma API:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

testSimpleFigma();
