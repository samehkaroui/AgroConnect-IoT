import React, { useState, useEffect } from 'react';
import { 
  Fan, 
  Zap, 
  Sun, 
  Droplets, 
  Power, 
  Settings,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { sensorService, Equipment } from '../services/sensorService';

interface EquipmentWithIcon extends Equipment {
  icon: React.ReactNode;
}

const ControlPanel: React.FC = () => {
  const [equipment, setEquipment] = useState<EquipmentWithIcon[]>([]);

  // Firebase real-time equipment subscriptions
  useEffect(() => {
    const unsubscribeEquipment = sensorService.subscribeEquipment((equipmentData) => {
      const equipmentWithIcons = equipmentData.map(item => ({
        ...item,
        icon: getEquipmentIcon(item.type)
      }));
      setEquipment(equipmentWithIcons);
    });

    return () => {
      unsubscribeEquipment();
    };
  }, []);

  const getEquipmentIcon = (type: string) => {
    switch (type) {
      case 'ventilation':
        return <Fan className="h-5 w-5" />;
      case 'heating':
        return <Zap className="h-5 w-5" />;
      case 'lighting':
        return <Sun className="h-5 w-5" />;
      case 'watering':
        return <Droplets className="h-5 w-5" />;
      default:
        return <Power className="h-5 w-5" />;
    }
  };

  const toggleEquipment = async (id: string) => {
    const currentItem = equipment.find(item => item.id === id);
    if (currentItem) {
      await sensorService.toggleEquipment(id, currentItem.status);
    }
  };

  const setAutoMode = async (id: string) => {
    await sensorService.setAutoMode(id);
  };

  const handleDayMode = async () => {
    await sensorService.setDayMode();
  };

  const handleNightMode = async () => {
    await sensorService.setNightMode();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'auto':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="h-3 w-3" />;
      case 'inactive':
        return <Pause className="h-3 w-3" />;
      case 'auto':
        return <RotateCcw className="h-3 w-3" />;
      default:
        return <Power className="h-3 w-3" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Contrôle des équipements</h3>
          <Settings className="h-5 w-5 text-gray-600" />
        </div>
        <p className="text-sm text-gray-600 mt-1">Gestion automatique et manuelle</p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {equipment.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                        <span className="capitalize">{item.status === 'auto' ? 'Automatique' : item.status === 'active' ? 'Actif' : 'Inactif'}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Barre de puissance */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Puissance</span>
                  <span className="text-sm font-bold text-gray-900">{item.power}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${item.power}%` }}
                  ></div>
                </div>
              </div>

              {/* Contrôles */}
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleEquipment(item.id)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    item.status === 'active'
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {item.status === 'active' ? 'Arrêter' : 'Démarrer'}
                </button>
                <button
                  onClick={() => setAutoMode(item.id)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    item.status === 'auto'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  Auto
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Actions globales */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex space-x-4">
              <button 
                onClick={handleDayMode}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Mode Jour
              </button>
              <button 
                onClick={handleNightMode}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Mode Nuit
              </button>
            </div>
            <div className="flex space-x-2">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Planifier
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Historique
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;