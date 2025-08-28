# Advanced Pulse GUI - Figma MCP Integration

A complete full-stack application that connects Figma design files to the Model Context Protocol (MCP) with a beautiful React frontend interface.

## 🎯 Project Overview

This project provides a modern web interface for interacting with Figma files through MCP, allowing users to:
- View file information and metadata
- Browse file structure interactively
- Manage comments and feedback
- Export design assets
- Monitor real-time connection status

## 🏗️ Architecture

```
Advanced Pulse Train/
├── 📁 MCP Server (Core)
│   ├── figma-mcp-server.js      # Main MCP server
│   ├── client-example.js         # MCP client example
│   ├── test-*.js                # Test scripts
│   └── package.json             # MCP dependencies
│
├── 🎨 Frontend (React)
│   ├── src/components/          # React components
│   ├── public/                  # Static assets
│   ├── package.json             # Frontend dependencies
│   └── README.md               # Frontend documentation
│
├── 🔧 Backend (Express)
│   ├── server.js               # API server
│   └── package.json            # Backend dependencies
│
├── ⚙️ Configuration
│   ├── .env                    # Environment variables
│   ├── .cursorrules           # Cursor IDE rules
│   └── .gitignore             # Git ignore rules
│
└── 📚 Documentation
    ├── README.md              # Main documentation
    ├── FIGMA_TOKEN_SETUP.md   # Token setup guide
    └── PROJECT_OVERVIEW.md    # This file
```

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v16 or higher)
- Figma access token with proper scopes
- Figma file key

### 2. Setup Environment
```bash
# Copy environment template
cp env.example .env

# Edit .env with your credentials
FIGMA_ACCESS_TOKEN=your_token_here
FIGMA_FILE_KEY=your_file_key_here
```

### 3. Install Dependencies
```bash
# Install MCP server dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 4. Start the Application
```bash
# Start backend server (Terminal 1)
cd backend && npm start

# Start frontend (Terminal 2)
./start-frontend.sh
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## 🎨 Frontend Features

### Modern UI/UX
- **Design System**: Consistent color palette and typography
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Interactive Components**: Hover effects, animations, and transitions
- **Real-time Updates**: Live connection status and data updates

### Key Components
1. **ConnectionStatus**: Real-time MCP server connection monitoring
2. **FileInfo**: Comprehensive file metadata and statistics display
3. **FigmaFileViewer**: Interactive tree view with search functionality
4. **CommentsPanel**: Comment management and display
5. **ExportPanel**: Asset export with multiple format options

### Technology Stack
- **React 18**: Modern React with hooks
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **Axios**: HTTP client for API calls

## 🔧 Backend Features

### API Endpoints
- `GET /api/health` - Health check
- `GET /api/figma/file` - Get file information
- `GET /api/figma/comments` - Get file comments
- `POST /api/figma/export` - Export assets
- `GET /api/figma/versions` - Get file versions

### Technology Stack
- **Express.js**: Web framework
- **CORS**: Cross-origin resource sharing
- **Axios**: HTTP client for Figma API
- **dotenv**: Environment variable management

## 🔌 MCP Integration

### MCP Server Features
- **Protocol Compliance**: Full Model Context Protocol implementation
- **Figma API Integration**: Direct access to Figma REST API
- **Tool Support**: File access, node retrieval, image export, comments
- **Resource Management**: File listing and content access

### Available MCP Tools
- `get_figma_file` - Retrieve file information
- `get_figma_node` - Get specific node data
- `export_figma_images` - Export components as images
- `get_figma_comments` - Access file comments

### Available MCP Resources
- `figma://files` - List accessible files
- `figma://file/{fileKey}` - Access specific file content

## 🎯 Use Cases

### Design Teams
- **Asset Management**: Export design components for development
- **Collaboration**: View and manage design feedback
- **Documentation**: Access design specifications and metadata

### Developers
- **Design Integration**: Access design assets programmatically
- **Automation**: Integrate Figma data into development workflows
- **API Access**: Use MCP for standardized Figma access

### Designers
- **File Organization**: Browse and search file structure
- **Version Control**: Track file changes and versions
- **Export Workflow**: Streamlined asset export process

## 🔒 Security

### Best Practices
- Environment variables for sensitive data
- CORS configuration for frontend-backend communication
- Input validation and sanitization
- Error handling without exposing sensitive information

### Token Management
- Figma access tokens stored securely
- Token scope validation
- Automatic token refresh (future enhancement)

## 📱 Responsive Design

### Breakpoints
- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: 320px - 767px

### Features
- Adaptive layouts for all screen sizes
- Touch-friendly interface on mobile
- Optimized navigation for different devices

## 🚀 Deployment

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy build/ folder to your hosting service
```

### Backend Deployment
```bash
cd backend
npm start
# Deploy to your server or cloud platform
```

### Environment Configuration
- Set production environment variables
- Configure CORS for production domains
- Set up proper logging and monitoring

## 🔮 Future Enhancements

### Planned Features
- **Real-time Collaboration**: Live updates and notifications
- **Advanced Search**: Full-text search across file content
- **Bulk Operations**: Multi-select and batch processing
- **Plugin System**: Extensible architecture for custom features
- **User Authentication**: Multi-user support with permissions
- **Analytics Dashboard**: Usage statistics and insights

### Technical Improvements
- **WebSocket Support**: Real-time communication
- **Caching Layer**: Improved performance with Redis
- **Database Integration**: Persistent storage for user data
- **API Rate Limiting**: Better Figma API usage management

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Follow the coding standards in `.cursorrules`
4. Test thoroughly
5. Submit a pull request

### Code Standards
- ES6+ JavaScript
- React functional components with hooks
- Tailwind CSS for styling
- Comprehensive error handling
- JSDoc documentation for complex functions

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

### Troubleshooting
- Check the `FIGMA_TOKEN_SETUP.md` for token configuration
- Verify backend server is running on port 3001
- Check browser console for frontend errors
- Review backend logs for API issues

### Getting Help
- Review the documentation in each component
- Check the README files in each directory
- Test with the provided test scripts
- Verify Figma API access and permissions
