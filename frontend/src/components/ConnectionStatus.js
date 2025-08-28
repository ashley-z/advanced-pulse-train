import React from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

const ConnectionStatus = ({ status, onRetry }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          text: 'Connected',
          borderColor: 'border-green-200'
        };
      case 'connecting':
        return {
          icon: RefreshCw,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          text: 'Connecting...',
          borderColor: 'border-blue-200'
        };
      case 'error':
        return {
          icon: AlertCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          text: 'Connection Error',
          borderColor: 'border-red-200'
        };
      default:
        return {
          icon: WifiOff,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          text: 'Disconnected',
          borderColor: 'border-gray-200'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${config.bgColor} ${config.borderColor}`}>
      <Icon className={`w-4 h-4 ${config.color} ${status === 'connecting' ? 'animate-spin' : ''}`} />
      <span className={`text-sm font-medium ${config.color}`}>
        {config.text}
      </span>
      {status === 'error' && (
        <button
          onClick={onRetry}
          className="ml-2 p-1 rounded hover:bg-red-100 transition-colors"
          title="Retry connection"
        >
          <RefreshCw className="w-3 h-3 text-red-600" />
        </button>
      )}
    </div>
  );
};

export default ConnectionStatus;
