import React, { useState } from 'react';
import { 
  Folder, 
  File, 
  ChevronRight, 
  ChevronDown, 
  Search,
  Loader2,
  Eye,
  Code
} from 'lucide-react';

const FigmaFileViewer = ({ fileData, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [selectedNode, setSelectedNode] = useState(null);

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      </div>
    );
  }

  if (!fileData) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <File className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No File Data</h3>
          <p className="text-gray-500">Connect to a Figma file to view content</p>
        </div>
      </div>
    );
  }

  const toggleNode = (nodeId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderNode = (node, depth = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isVisible = !searchTerm || 
      node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.type.toLowerCase().includes(searchTerm.toLowerCase());

    if (!isVisible) return null;

    return (
      <div key={node.id} className="select-none">
        <div
          className={`flex items-center space-x-2 py-2 px-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
            selectedNode?.id === node.id ? 'bg-primary-50 border border-primary-200' : ''
          }`}
          style={{ paddingLeft: `${depth * 20 + 12}px` }}
          onClick={() => setSelectedNode(node)}
        >
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
              }}
              className="p-1 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>
          ) : (
            <div className="w-6" />
          )}
          
          <div className="flex items-center space-x-2">
            {node.type === 'DOCUMENT' || node.type === 'PAGE' ? (
              <Folder className="w-4 h-4 text-blue-500" />
            ) : (
              <File className="w-4 h-4 text-gray-500" />
            )}
            <span className="text-sm font-medium text-gray-900">{node.name}</span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {node.type}
            </span>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderNodeDetails = () => {
    if (!selectedNode) {
      return (
        <div className="text-center py-12 text-gray-500">
          <Eye className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Select a node to view details</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {selectedNode.name}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Code className="w-4 h-4" />
            <span>{selectedNode.type}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Node ID
            </label>
            <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
              {selectedNode.id}
            </p>
          </div>
          
          {selectedNode.absoluteBoundingBox && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Width
                </label>
                <p className="text-sm text-gray-900">
                  {Math.round(selectedNode.absoluteBoundingBox.width)}px
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height
                </label>
                <p className="text-sm text-gray-900">
                  {Math.round(selectedNode.absoluteBoundingBox.height)}px
                </p>
              </div>
            </>
          )}
        </div>

        {selectedNode.children && selectedNode.children.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Children ({selectedNode.children.length})
            </label>
            <div className="space-y-1">
              {selectedNode.children.slice(0, 5).map(child => (
                <div key={child.id} className="flex items-center space-x-2 text-sm">
                  <File className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-700">{child.name}</span>
                  <span className="text-gray-500 text-xs">({child.type})</span>
                </div>
              ))}
              {selectedNode.children.length > 5 && (
                <p className="text-xs text-gray-500">
                  +{selectedNode.children.length - 5} more...
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* File Tree */}
      <div className="lg:col-span-2">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">File Structure</h3>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search nodes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 pr-4 py-2 text-sm"
              />
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {fileData.document && renderNode(fileData.document)}
          </div>
        </div>
      </div>

      {/* Node Details */}
      <div className="lg:col-span-1">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Node Details</h3>
          {renderNodeDetails()}
        </div>
      </div>
    </div>
  );
};

export default FigmaFileViewer;
