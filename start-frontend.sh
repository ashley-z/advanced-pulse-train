#!/bin/bash

echo "🚀 Starting Advanced Pulse GUI - Figma MCP Frontend"
echo "=================================================="

# Check if backend is running
echo "📡 Checking backend server..."
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✅ Backend server is running on port 3001"
else
    echo "⚠️  Backend server not found on port 3001"
    echo "   Please start the backend server first:"
    echo "   cd backend && npm start"
    echo ""
    read -p "Press Enter to continue anyway..."
fi

echo ""
echo "🎨 Starting React frontend..."
echo "   Frontend will be available at: http://localhost:3000"
echo "   Backend API: http://localhost:3001"
echo ""

cd frontend
npm start
