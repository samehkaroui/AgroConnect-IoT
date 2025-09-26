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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'inactive':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600';
      case 'auto':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600';
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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 transition-colors duration-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-200">Contrôle des équipements</h3>
          <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300 transition-colors duration-200" />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-200">Gestion automatique et manuelle</p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {equipment.filter(item => 
            ['heating-main', 'lighting-led', 'ventilation-zone-a', 'watering-system'].includes(item.id)
          ).map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-600 rounded-lg transition-colors duration-200">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white transition-colors duration-200">{item.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border transition-colors duration-200 ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                        <span className="capitalize">{item.status === 'auto' ? 'Automatique' : item.status === 'active' ? 'Actif' : 'Inactif'}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Barre de puissance */}
              <div className="mb-4">
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 transition-colors duration-200">
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
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    item.status === 'active'
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50'
                      : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'
                  }`}
                >
                  {item.status === 'active' ? 'Arrêter' : 'Démarrer'}
                </button>
                <button
                  onClick={() => setAutoMode(item.id)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    item.status === 'auto'
                      ? 'bg-blue-600 dark:bg-blue-500 text-white'
                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                  }`}
                >
                  Auto
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ControlPanel;