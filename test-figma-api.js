import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const FIGMA_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FIGMA_API_BASE = 'https://api.figma.com/v1';

async function testFigmaAPI() {
  console.log('Testing Figma API connection...');
  console.log('Token:', FIGMA_TOKEN ? '✅ Set' : '❌ Not set');
  
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
    console.log('   Name:', userResponse.data.name);
    
    // Test 2: Get user's teams (to find files)
    console.log('\n2. Testing: Get user teams...');
    const teamsResponse = await axios.get(`${FIGMA_API_BASE}/teams`, {
      headers: {
        'X-Figma-Token': FIGMA_TOKEN,
      },
    });
    
    console.log('✅ Success! Found', teamsResponse.data.teams?.length || 0, 'teams');
    
    if (teamsResponse.data.teams && teamsResponse.data.teams.length > 0) {
      const firstTeam = teamsResponse.data.teams[0];
      console.log('   First team:', firstTeam.name);
      console.log('   Team ID:', firstTeam.id);
      
      // Test 3: Get projects from the first team
      console.log('\n3. Testing: Get team projects...');
      const projectsResponse = await axios.get(`${FIGMA_API_BASE}/teams/${firstTeam.id}/projects`, {
        headers: {
          'X-Figma-Token': FIGMA_TOKEN,
        },
      });
      
      console.log('✅ Success! Found', projectsResponse.data.projects?.length || 0, 'projects');
      
      if (projectsResponse.data.projects && projectsResponse.data.projects.length > 0) {
        const firstProject = projectsResponse.data.projects[0];
        console.log('   First project:', firstProject.name);
        console.log('   Project ID:', firstProject.id);
        
        // Test 4: Get files from the first project
        console.log('\n4. Testing: Get project files...');
        const filesResponse = await axios.get(`${FIGMA_API_BASE}/projects/${firstProject.id}/files`, {
          headers: {
            'X-Figma-Token': FIGMA_TOKEN,
          },
        });
        
        console.log('✅ Success! Found', filesResponse.data.files?.length || 0, 'files');
        
        if (filesResponse.data.files && filesResponse.data.files.length > 0) {
          const firstFile = filesResponse.data.files[0];
      console.log('   First file:', firstFile.name);
      console.log('   File key:', firstFile.key);
      console.log('   Last modified:', new Date(firstFile.last_modified).toLocaleString());
      
          // Test 5: Get specific file details
          console.log('\n5. Testing: Get file details...');
          const fileResponse = await axios.get(`${FIGMA_API_BASE}/files/${firstFile.key}`, {
            headers: {
              'X-Figma-Token': FIGMA_TOKEN,
            },
          });
          
          console.log('✅ Success! File details retrieved');
          console.log('   Document name:', fileResponse.data.document?.name);
          console.log('   Version:', fileResponse.data.version);
          console.log('   Last modified:', new Date(fileResponse.data.lastModified).toLocaleString());
          
          // Test 6: Get comments
          console.log('\n6. Testing: Get file comments...');
          const commentsResponse = await axios.get(`${FIGMA_API_BASE}/files/${firstFile.key}/comments`, {
            headers: {
              'X-Figma-Token': FIGMA_TOKEN,
            },
          });
          
          console.log('✅ Success! Found', commentsResponse.data.comments?.length || 0, 'comments');
          
        } else {
          console.log('   No files found in this project');
        }
      } else {
        console.log('   No projects found in this team');
      }
    } else {
      console.log('   No teams found or no access to teams');
    }
    
    console.log('\n🎉 All tests passed! Your Figma API connection is working.');
    
  } catch (error) {
    console.error('❌ Error testing Figma API:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

testFigmaAPI();
