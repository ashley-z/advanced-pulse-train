import React from 'react';
import { FileText, Calendar, User, Hash, ExternalLink, Loader2 } from 'lucide-react';

const FileInfo = ({ fileData, loading }) => {
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
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No File Data</h3>
          <p className="text-gray-500">Connect to a Figma file to view information</p>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* File Overview */}
      <div className="card">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {fileData.document?.name || 'LED-Revision'}
            </h2>
            <p className="text-gray-600">Figma Design File</p>
          </div>
          <a
            href={`https://www.figma.com/file/${fileData.key}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center space-x-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open in Figma</span>
          </a>
        </div>

        {/* File Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Hash className="w-4 h-4" />
              <span>File Key</span>
            </div>
            <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
              {fileData.key}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Hash className="w-4 h-4" />
              <span>Version</span>
            </div>
            <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
              {fileData.version}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Last Modified</span>
            </div>
            <p className="text-sm text-gray-900">
              {formatDate(fileData.lastModified)}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <User className="w-4 h-4" />
              <span>Owner</span>
            </div>
            <p className="text-sm text-gray-900">
              {fileData.lastModifiedBy?.name || 'Unknown'}
            </p>
          </div>
        </div>
      </div>

      {/* File Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Pages</p>
              <p className="text-2xl font-bold text-gray-900">
                {fileData.document?.children?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Components</p>
              <p className="text-2xl font-bold text-gray-900">
                {fileData.components ? Object.keys(fileData.components).length : 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Styles</p>
              <p className="text-2xl font-bold text-gray-900">
                {fileData.styles ? Object.keys(fileData.styles).length : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnail */}
      {fileData.thumbnailUrl && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">File Preview</h3>
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={fileData.thumbnailUrl}
              alt="File thumbnail"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FileInfo;
