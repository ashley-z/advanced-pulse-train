import React, { useState } from 'react';
import { 
  Download, 
  Image, 
  FileText, 
  Settings, 
  CheckCircle,
  Loader2,
  ExternalLink
} from 'lucide-react';

const ExportPanel = ({ fileData, loading }) => {
  const [selectedFormat, setSelectedFormat] = useState('png');
  const [selectedScale, setSelectedScale] = useState('1x');
  const [isExporting, setIsExporting] = useState(false);
  const [exportHistory, setExportHistory] = useState([]);

  const formats = [
    { value: 'png', label: 'PNG', icon: Image },
    { value: 'jpg', label: 'JPG', icon: Image },
    { value: 'svg', label: 'SVG', icon: FileText },
    { value: 'pdf', label: 'PDF', icon: FileText },
  ];

  const scales = [
    { value: '0.5x', label: '0.5x' },
    { value: '1x', label: '1x' },
    { value: '2x', label: '2x' },
    { value: '4x', label: '4x' },
  ];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // TODO: Implement actual export functionality
      console.log('Exporting with format:', selectedFormat, 'scale:', selectedScale);
      
      // Simulate export
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const exportItem = {
        id: Date.now(),
        format: selectedFormat,
        scale: selectedScale,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };
      
      setExportHistory(prev => [exportItem, ...prev]);
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

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
          <Download className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No File Data</h3>
          <p className="text-gray-500">Connect to a Figma file to export assets</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Export Settings */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <Download className="w-6 h-6 text-primary-500" />
          <h3 className="text-lg font-semibold text-gray-900">Export Assets</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Export Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              {formats.map((format) => {
                const Icon = format.icon;
                return (
                  <button
                    key={format.value}
                    onClick={() => setSelectedFormat(format.value)}
                    className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                      selectedFormat === format.value
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{format.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scale Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Scale
            </label>
            <div className="grid grid-cols-2 gap-3">
              {scales.map((scale) => (
                <button
                  key={scale.value}
                  onClick={() => setSelectedScale(scale.value)}
                  className={`p-3 rounded-lg border transition-colors ${
                    selectedScale === scale.value
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <span className="text-sm font-medium">{scale.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Export Button */}
        <div className="mt-6">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
            <span>
              {isExporting ? 'Exporting...' : `Export as ${selectedFormat.toUpperCase()}`}
            </span>
          </button>
        </div>
      </div>

      {/* Export History */}
      <div className="card">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Export History</h4>
        
        {exportHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Download className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No exports yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {exportHistory.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.format.toUpperCase()} Export
                    </p>
                    <p className="text-xs text-gray-500">
                      Scale: {item.scale} • {new Date(item.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Download
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Export Tips */}
      <div className="card">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Export Tips</h4>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <p>PNG and JPG formats are best for web and print use</p>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <p>SVG format is ideal for scalable graphics and icons</p>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <p>Use 2x or 4x scale for high-resolution displays</p>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <p>PDF format is perfect for documentation and presentations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportPanel;
