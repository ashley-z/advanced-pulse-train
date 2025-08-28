import FigmaMCPClient from './client-example.js';

async function testMCPIntegration() {
  console.log('🧪 Testing Figma MCP Integration...\n');
  
  const client = new FigmaMCPClient();
  
  try {
    console.log('1. Connecting to Figma MCP Server...');
    await client.connect();
    console.log('✅ Connected successfully!\n');
    
    console.log('2. Listing available MCP resources...');
    const resources = await client.listResources();
    console.log('✅ Resources found:', resources.length);
    resources.forEach(resource => {
      console.log(`   - ${resource.name}: ${resource.uri}`);
    });
    console.log();
    
    console.log('3. Reading Figma files list...');
    const filesContent = await client.readResource('figma://files');
    console.log('✅ Files list retrieved successfully!\n');
    
    console.log('4. Reading specific Figma file...');
    const fileContent = await client.readResource('figma://file/pZc6IrNDFUhKkxjV6dgbK9');
    console.log('✅ File content retrieved successfully!\n');
    
    console.log('5. Testing MCP tools...');
    console.log('   - Getting file information...');
    const fileInfo = await client.getFigmaFile('pZc6IrNDFUhKkxjV6dgbK9');
    console.log('   ✅ File info retrieved');
    
    console.log('   - Getting file comments...');
    const comments = await client.getFigmaComments('pZc6IrNDFUhKkxjV6dgbK9');
    console.log('   ✅ Comments retrieved');
    
    console.log('\n🎉 MCP Integration Test Complete!');
    console.log('\n📋 Summary:');
    console.log('✅ Figma API connection: Working');
    console.log('✅ MCP Server: Running');
    console.log('✅ MCP Client: Connected');
    console.log('✅ File access: Successful');
    console.log('✅ Tool calls: Working');
    console.log('✅ Resource access: Working');
    
    console.log('\n🚀 Your Figma MCP integration is ready for use!');
    console.log('You can now:');
    console.log('- Access Figma files through MCP-compatible clients');
    console.log('- Export design assets programmatically');
    console.log('- Read file metadata and comments');
    console.log('- Integrate Figma data into AI workflows');
    
  } catch (error) {
    console.error('❌ Error during MCP integration test:', error.message);
  } finally {
    console.log('\n🔌 Disconnecting...');
    await client.disconnect();
    console.log('✅ Disconnected successfully');
  }
}

testMCPIntegration();
