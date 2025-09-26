import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  RotateCcw, 
  Bell, 
  AlertTriangle, 
  Thermometer, 
  Droplets, 
  Wind, 
  Sun,
  Zap,
  Flame,
  CloudSnow
} from 'lucide-react';

interface AlertThresholds {
  temperature: { min: number; max: number };
  humidity: { min: number; max: number };
  airQuality: { min: number; max: number };
  lightLevel: { min: number; max: number };
  co: { max: number };
  co2: { max: number };
  nh3: { max: number };
  h2s: { max: number };
}

interface NotificationSettings {
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  soundEnabled: boolean;
  criticalOnly: boolean;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (thresholds: AlertThresholds, notifications: NotificationSettings) => void;
  currentThresholds: AlertThresholds;
  currentNotifications: NotificationSettings;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentThresholds,
  currentNotifications
}) => {
  const [thresholds, setThresholds] = useState<AlertThresholds>(currentThresholds);
  const [notifications, setNotifications] = useState<NotificationSettings>(currentNotifications);
  const [activeTab, setActiveTab] = useState<'thresholds' | 'notifications'>('thresholds');

  useEffect(() => {
    setThresholds(currentThresholds);
    setNotifications(currentNotifications);
  }, [currentThresholds, currentNotifications]);

  const handleSave = () => {
    onSave(thresholds, notifications);
    onClose();
  };

  const resetToDefaults = () => {
    const defaultThresholds: AlertThresholds = {
      temperature: { min: 18, max: 26 },
      humidity: { min: 40, max: 70 },
      airQuality: { min: 80, max: 100 },
      lightLevel: { min: 20, max: 80 },
      co: { max: 5 },
      co2: { max: 1000 },
      nh3: { max: 15 },
      h2s: { max: 1 }
    };

    const defaultNotifications: NotificationSettings = {
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: true,
      soundEnabled: true,
      criticalOnly: false
    };

    setThresholds(defaultThresholds);
    setNotifications(defaultNotifications);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center z-50 p-2 sm:p-4 transition-colors duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden transition-colors duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 transition-colors duration-200">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1.5 sm:p-2 bg-blue-600 rounded-lg">
              <Bell className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white transition-colors duration-200">Configuration des Alertes</h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 hidden sm:block transition-colors duration-200">Gestion des seuils et notifications</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-300 transition-colors duration-200" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <button
            onClick={() => setActiveTab('thresholds')}
            className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium transition-colors duration-200 ${
              activeTab === 'thresholds'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Seuils d'Alerte</span>
            <span className="sm:hidden">Seuils</span>
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium transition-colors duration-200 ${
              activeTab === 'notifications'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Bell className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1 sm:mr-2" />
            Notifications
          </button>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-6 max-h-[60vh] sm:max-h-[60vh] overflow-y-auto">
          {activeTab === 'thresholds' && (
            <div className="space-y-8">
              {/* Environmental Sensors */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 transition-colors duration-200">Capteurs Environnementaux</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                  {/* Temperature */}
                  <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 sm:p-4 bg-white dark:bg-gray-700 transition-colors duration-200">
                    <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                      <Thermometer className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                      <h4 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white transition-colors duration-200">Température (°C)</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1 transition-colors duration-200">Minimum</label>
                        <input
                          type="number"
                          value={thresholds.temperature.min}
                          onChange={(e) => setThresholds({
                            ...thresholds,
                            temperature: { ...thresholds.temperature, min: Number(e.target.value) }
                          })}
                          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md text-xs sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1 transition-colors duration-200">Maximum</label>
                        <input
                          type="number"
                          value={thresholds.temperature.max}
                          onChange={(e) => setThresholds({
                            ...thresholds,
                            temperature: { ...thresholds.temperature, max: Number(e.target.value) }
                          })}
                          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md text-xs sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Humidity */}
                  <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-700 transition-colors duration-200">
                    <div className="flex items-center space-x-2 mb-3">
                      <Droplets className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                      <h4 className="font-medium text-gray-900 dark:text-white transition-colors duration-200">Humidité (%)</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1 transition-colors duration-200">Minimum</label>
                        <input
                          type="number"
                          value={thresholds.humidity.min}
                          onChange={(e) => setThresholds({
                            ...thresholds,
                            humidity: { ...thresholds.humidity, min: Number(e.target.value) }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1 transition-colors duration-200">Maximum</label>
                        <input
                          type="number"
                          value={thresholds.humidity.max}
                          onChange={(e) => setThresholds({
                            ...thresholds,
                            humidity: { ...thresholds.humidity, max: Number(e.target.value) }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Air Quality */}
                  <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-700 transition-colors duration-200">
                    <div className="flex items-center space-x-2 mb-3">
                      <Wind className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <h4 className="font-medium text-gray-900 dark:text-white transition-colors duration-200">Qualité de l'air (/100)</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1 transition-colors duration-200">Minimum</label>
                        <input
                          type="number"
                          value={thresholds.airQuality.min}
                          onChange={(e) => setThresholds({
                            ...thresholds,
                            airQuality: { ...thresholds.airQuality, min: Number(e.target.value) }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1 transition-colors duration-200">Maximum</label>
                        <input
                          type="number"
                          value={thresholds.airQuality.max}
                          onChange={(e) => setThresholds({
                            ...thresholds,
                            airQuality: { ...thresholds.airQuality, max: Number(e.target.value) }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Light Level */}
                  <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-700 transition-colors duration-200">
                    <div className="flex items-center space-x-2 mb-3">
                      <Sun className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                      <h4 className="font-medium text-gray-900 dark:text-white transition-colors duration-200">Luminosité (lux)</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1 transition-colors duration-200">Minimum</label>
                        <input
                          type="number"
                          value={thresholds.lightLevel.min}
                          onChange={(e) => setThresholds({
                            ...thresholds,
                            lightLevel: { ...thresholds.lightLevel, min: Number(e.target.value) }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1 transition-colors duration-200">Maximum</label>
                        <input
                          type="number"
                          value={thresholds.lightLevel.max}
                          onChange={(e) => setThresholds({
                            ...thresholds,
                            lightLevel: { ...thresholds.lightLevel, max: Number(e.target.value) }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gas Sensors */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-200">Capteurs de Gaz</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* CO */}
                  <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-700 transition-colors duration-200">
                    <div className="flex items-center space-x-2 mb-3">
                      <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      <h4 className="font-medium text-gray-900 dark:text-white transition-colors duration-200">CO (ppm)</h4>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1 transition-colors duration-200">Seuil Maximum</label>
                      <input
                        type="number"
                        step="0.1"
                        value={thresholds.co.max}
                        onChange={(e) => setThresholds({
                          ...thresholds,
                          co: { max: Number(e.target.value) }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
                      />
                    </div>
                  </div>

                  {/* CO2 */}
                  <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-700 transition-colors duration-200">
                    <div className="flex items-center space-x-2 mb-3">
                      <CloudSnow className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <h4 className="font-medium text-gray-900 dark:text-white transition-colors duration-200">CO₂ (ppm)</h4>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1 transition-colors duration-200">Seuil Maximum</label>
                      <input
                        type="number"
                        value={thresholds.co2.max}
                        onChange={(e) => setThresholds({
                          ...thresholds,
                          co2: { max: Number(e.target.value) }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
                      />
                    </div>
                  </div>

                  {/* NH3 */}
                  <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-700 transition-colors duration-200">
                    <div className="flex items-center space-x-2 mb-3">
                      <Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                      <h4 className="font-medium text-gray-900 dark:text-white transition-colors duration-200">NH₃ (ppm)</h4>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1 transition-colors duration-200">Seuil Maximum</label>
                      <input
                        type="number"
                        step="0.1"
                        value={thresholds.nh3.max}
                        onChange={(e) => setThresholds({
                          ...thresholds,
                          nh3: { max: Number(e.target.value) }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
                      />
                    </div>
                  </div>

                  {/* H2S */}
                  <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-700 transition-colors duration-200">
                    <div className="flex items-center space-x-2 mb-3">
                      <Flame className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <h4 className="font-medium text-gray-900 dark:text-white transition-colors duration-200">H₂S (ppm)</h4>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1 transition-colors duration-200">Seuil Maximum</label>
                      <input
                        type="number"
                        step="0.1"
                        value={thresholds.h2s.max}
                        onChange={(e) => setThresholds({
                          ...thresholds,
                          h2s: { max: Number(e.target.value) }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-200">Types de Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white transition-colors duration-200">Notifications Push</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-200">Notifications dans le navigateur</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.pushEnabled}
                        onChange={(e) => setNotifications({
                          ...notifications,
                          pushEnabled: e.target.checked
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white transition-colors duration-200">Son d'Alerte</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-200">Son lors des alertes critiques</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.soundEnabled}
                        onChange={(e) => setNotifications({
                          ...notifications,
                          soundEnabled: e.target.checked
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white transition-colors duration-200">Alertes Critiques Uniquement</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-200">Ne notifier que les alertes critiques</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.criticalOnly}
                        onChange={(e) => setNotifications({
                          ...notifications,
                          criticalOnly: e.target.checked
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 space-y-3 sm:space-y-0 transition-colors duration-200">
          <button
            onClick={resetToDefaults}
            className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 text-sm"
          >
            <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Réinitialiser</span>
          </button>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 text-sm"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 text-sm"
            >
              <Save className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Sauvegarder</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
