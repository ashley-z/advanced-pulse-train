# Advanced Pulse GUI - Figma MCP Frontend

A modern React frontend for the Figma MCP (Model Context Protocol) integration, featuring a beautiful and intuitive interface for managing Figma design files.

## 🎨 Features

- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Real-time Connection**: Live status monitoring of MCP server connection
- **File Information**: Comprehensive view of Figma file details and metadata
- **File Viewer**: Interactive tree view of file structure with search functionality
- **Comments Management**: View and manage file comments
- **Asset Export**: Export design assets in multiple formats (PNG, JPG, SVG, PDF)
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Running Figma MCP backend server

### Installation

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Start the Development Server**:
   ```bash
   npm start
   ```

3. **Open in Browser**:
   Navigate to `http://localhost:3000`

## 🏗️ Architecture

### Frontend Structure
```
frontend/
├── public/
│   └── index.html          # Main HTML template
├── src/
│   ├── components/         # React components
│   │   ├── App.js         # Main application component
│   │   ├── ConnectionStatus.js
│   │   ├── FileInfo.js
│   │   ├── FigmaFileViewer.js
│   │   ├── CommentsPanel.js
│   │   └── ExportPanel.js
│   ├── index.js           # React entry point
│   └── index.css          # Global styles with Tailwind
├── package.json
├── tailwind.config.js     # Tailwind CSS configuration
└── postcss.config.js      # PostCSS configuration
```

### Component Overview

- **App.js**: Main application with tab navigation and state management
- **ConnectionStatus.js**: Real-time MCP server connection status
- **FileInfo.js**: Displays comprehensive file information and statistics
- **FigmaFileViewer.js**: Interactive file structure viewer with search
- **CommentsPanel.js**: Comment management and display
- **ExportPanel.js**: Asset export functionality with format options

## 🎯 Key Features

### 1. Connection Management
- Real-time connection status to MCP server
- Automatic retry functionality
- Visual indicators for connection states

### 2. File Information Display
- File metadata (name, version, last modified)
- File statistics (pages, components, styles)
- Thumbnail preview
- Direct link to Figma

### 3. Interactive File Viewer
- Tree view of file structure
- Expandable/collapsible nodes
- Search functionality
- Node details panel
- Visual indicators for different node types

### 4. Comments System
- View all file comments
- Comment statistics
- Add new comments (UI ready)
- Resolved comment indicators

### 5. Export Functionality
- Multiple export formats (PNG, JPG, SVG, PDF)
- Scale options (0.5x, 1x, 2x, 4x)
- Export history tracking
- Export tips and guidance

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradient (#0ea5e9 to #0284c7)
- **Pulse**: Purple gradient (#d946ef to #c026d3)
- **Neutral**: Gray scale for text and backgrounds
- **Status**: Green (success), Red (error), Blue (info)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Responsive**: Scales appropriately across devices

### Components
- **Cards**: Consistent white cards with subtle shadows
- **Buttons**: Primary and secondary button styles
- **Inputs**: Styled form inputs with focus states
- **Icons**: Lucide React icons for consistency

## 🔧 Configuration

### Environment Variables
The frontend connects to the backend API. Ensure your backend is running on the correct port (default: 3001).

### API Endpoints
- `GET /api/health` - Health check
- `GET /api/figma/file` - Get file information
- `GET /api/figma/comments` - Get file comments
- `POST /api/figma/export` - Export assets
- `GET /api/figma/versions` - Get file versions

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Serve Production Build
```bash
npx serve -s build
```

## 🛠️ Development

### Available Scripts
- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Code Style
- ES6+ JavaScript
- Functional React components with hooks
- Tailwind CSS for styling
- Lucide React for icons

## 🔗 Integration

This frontend is designed to work with:
- **Backend**: Express.js API server
- **MCP Server**: Figma MCP integration
- **Figma API**: Direct Figma API calls

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🎯 Future Enhancements

- Real-time collaboration features
- Advanced search and filtering
- Bulk export operations
- Design system integration
- Plugin marketplace
- User authentication
- File version comparison

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.
