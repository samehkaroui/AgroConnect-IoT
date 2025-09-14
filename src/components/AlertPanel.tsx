import React from 'react';
import { AlertTriangle, Info, X, Clock } from 'lucide-react';
import { sensorService } from '../services/sensorService';

interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
  building: string;
}

interface AlertPanelProps {
  alerts: Alert[];
}

const AlertPanel: React.FC<AlertPanelProps> = ({ alerts }) => {
  const handleRemoveAlert = async (alertId: string) => {
    await sensorService.removeAlert(alertId);
  };
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getAlertBg = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Alertes et notifications</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            {alerts.length}
          </span>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Info className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>Aucune alerte active</p>
          </div>
        ) : (
          <div className="space-y-1">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 border-l-4 ${getAlertBg(alert.type)} hover:bg-opacity-80 transition-colors cursor-pointer`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {alert.message}
                      </p>
                      <div className="mt-2 flex items-center space-x-4 text-xs text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatTime(alert.timestamp)}</span>
                        </div>
                        <span className="px-2 py-1 bg-white rounded text-gray-700 font-medium">
                          {alert.building}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRemoveAlert(alert.id)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {alerts.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
            Voir toutes les alertes →
          </button>
        </div>
      )}
    </div>
  );
};

export default AlertPanel;