import React, { useState, useEffect } from 'react';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Sun, 
  Activity, 
  TrendingUp,
  Users,
  Settings,
  RefreshCw,
  AlertTriangle,
  Zap,
  Flame,
  CloudSnow
} from 'lucide-react';
import MetricCard from './MetricCard';
import AlertPanel from './AlertPanel';
import ChartWidget from './ChartWidget';
import ControlPanel from './ControlPanel';
import GasTable from './GasTable';
import SettingsModal from './SettingsModal';
import ThemeToggle from './ThemeToggle';
import { sensorService, SensorData, GasData, Alert } from '../services/sensorService';

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

const Dashboard: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData>({
    temperature: 24.5,
    humidity: 65,
    airQuality: 85,
    lightLevel: 45,
    birdCount: 2847,
    activityLevel: 72,
    timestamp: new Date().toISOString()
  });

  const [gasData, setGasData] = useState<GasData>({
    co: 2.5,
    co2: 450,
    nh3: 8.0,
    h2s: 0.5,
    timestamp: new Date().toISOString()
  });
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Settings state
  const [alertThresholds, setAlertThresholds] = useState<AlertThresholds>({
    temperature: { min: 18, max: 26 },
    humidity: { min: 40, max: 70 },
    airQuality: { min: 80, max: 100 },
    lightLevel: { min: 20, max: 80 },
    co: { max: 5 },
    co2: { max: 1000 },
    nh3: { max: 15 },
    h2s: { max: 1 }
  });
  
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true,
    soundEnabled: true,
    criticalOnly: false
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedThresholds = localStorage.getItem('alertThresholds');
    const savedNotifications = localStorage.getItem('notificationSettings');
    
    if (savedThresholds) {
      setAlertThresholds(JSON.parse(savedThresholds));
    }
    
    if (savedNotifications) {
      setNotificationSettings(JSON.parse(savedNotifications));
    }
  }, []);

  // Firebase real-time data subscriptions
  useEffect(() => {
    // Initialize default data
    sensorService.initializeDefaultData();
    
    // Subscribe to sensor data updates
    const unsubscribeSensorData = sensorService.subscribeSensorData((data) => {
      setSensorData(data);
      setLastUpdate(new Date());
    });

    // Subscribe to gas data updates
    const unsubscribeGasData = sensorService.subscribeGasData((data) => {
      setGasData(data);
      setLastUpdate(new Date());
    });

    // Subscribe to alerts
    const unsubscribeAlerts = sensorService.subscribeAlerts((alertsData) => {
      setAlerts(alertsData);
    });

    // Start sensor simulation
    const stopSimulation = sensorService.startSensorSimulation();

    return () => {
      unsubscribeSensorData();
      unsubscribeGasData();
      unsubscribeAlerts();
      stopSimulation();
    };
  }, []);

  const generateChartData = () => {
    const hours = [];
    const now = new Date();
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      hours.push({
        time: time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        temperature: 24.5 + Math.sin(i / 4) * 2 + (Math.random() - 0.5),
        humidity: 65 + Math.cos(i / 6) * 8 + (Math.random() - 0.5) * 3,
        activity: 50 + Math.sin(i / 3) * 25 + (Math.random() - 0.5) * 10
      });
    }
    return hours;
  };

  const chartData = generateChartData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 bg-green-600 rounded-lg">
                <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">AgroConnect IoT</h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 hidden sm:block transition-colors duration-200">Élevage de Volailles Connecté</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 hidden md:block transition-colors duration-200">
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden lg:inline">Dernière mise à jour: </span>
                  <span>{lastUpdate.toLocaleTimeString('fr-FR')}</span>
                </div>
              </div>
              <ThemeToggle />
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                title="Configuration des alertes et notifications"
              >
                <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Métriques principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <MetricCard
            title="Température"
            value={`${sensorData.temperature?.toFixed(1) || '0.0'}°C`}
            icon={<Thermometer className="h-6 w-6" />}
            trend={sensorData.temperature > 24 ? 'up' : 'down'}
            color="blue"
            status={sensorData.temperature >= alertThresholds.temperature.min && sensorData.temperature <= alertThresholds.temperature.max ? 'good' : 'warning'}
          />
          <MetricCard
            title="Humidité"
            value={`${sensorData.humidity?.toFixed(0) || '0'}%`}
            icon={<Droplets className="h-6 w-6" />}
            trend={sensorData.humidity > 65 ? 'up' : 'down'}
            color="teal"
            status={sensorData.humidity >= alertThresholds.humidity.min && sensorData.humidity <= alertThresholds.humidity.max ? 'good' : 'warning'}
          />
          <MetricCard
            title="Qualité de l'air"
            value={`${sensorData.airQuality?.toFixed(0) || '0'}/100`}
            icon={<Wind className="h-6 w-6" />}
            trend="up"
            color="green"
            status={sensorData.airQuality >= alertThresholds.airQuality.min ? 'good' : 'warning'}
          />
          <MetricCard
            title="Luminosité"
            value={`${sensorData.lightLevel?.toFixed(0) || '0'} lux`}
            icon={<Sun className="h-6 w-6" />}
            trend="stable"
            color="yellow"
            status={sensorData.lightLevel >= alertThresholds.lightLevel.min && sensorData.lightLevel <= alertThresholds.lightLevel.max ? 'good' : 'warning'}
          />
        </div>

        {/* Métriques animaux */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <MetricCard
            title="Nombre de volailles"
            value={sensorData.birdCount?.toLocaleString('fr-FR') || '0'}
            icon={<Users className="h-6 w-6" />}
            trend="stable"
            color="indigo"
            status="good"
            subtitle="Comptage automatique par IA"
          />
          <MetricCard
            title="Niveau d'activité"
            value={`${sensorData.activityLevel?.toFixed(0) || '0'}%`}
            icon={<TrendingUp className="h-6 w-6" />}
            trend={sensorData.activityLevel > 70 ? 'up' : 'down'}
            color="purple"
            status={sensorData.activityLevel >= 60 ? 'good' : 'warning'}
            subtitle="Comportement normal"
          />
        </div>

        {/* Métriques des gaz */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 px-1 transition-colors duration-200">Qualité de l'air - Gaz</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <MetricCard
              title="Monoxyde de carbone (CO)"
              value={`${gasData.co?.toFixed(1) || '0.0'} ppm`}
              icon={<AlertTriangle className="h-6 w-6" />}
              trend={gasData.co > 3 ? 'up' : 'down'}
              color="red"
              status={gasData.co <= alertThresholds.co.max ? 'good' : 'warning'}
              subtitle={`Limite: ${alertThresholds.co.max} ppm`}
            />
            <MetricCard
              title="Dioxyde de carbone (CO₂)"
              value={`${gasData.co2?.toFixed(0) || '0'} ppm`}
              icon={<CloudSnow className="h-6 w-6" />}
              trend={gasData.co2 > 500 ? 'up' : 'down'}
              color="blue"
              status={gasData.co2 <= alertThresholds.co2.max ? 'good' : 'warning'}
              subtitle={`Limite: ${alertThresholds.co2.max} ppm`}
            />
            <MetricCard
              title="Ammoniac (NH₃)"
              value={`${gasData.nh3?.toFixed(1) || '0.0'} ppm`}
              icon={<Zap className="h-6 w-6" />}
              trend={gasData.nh3 > 10 ? 'up' : 'down'}
              color="yellow"
              status={gasData.nh3 <= alertThresholds.nh3.max ? 'good' : 'warning'}
              subtitle={`Limite: ${alertThresholds.nh3.max} ppm`}
            />
            <MetricCard
              title="Sulfure d'hydrogène (H₂S)"
              value={`${gasData.h2s?.toFixed(1) || '0.0'} ppm`}
              icon={<Flame className="h-6 w-6" />}
              trend={gasData.h2s > 0.7 ? 'up' : 'down'}
              color="purple"
              status={gasData.h2s <= alertThresholds.h2s.max ? 'good' : 'warning'}
              subtitle={`Limite: ${alertThresholds.h2s.max} ppm`}
            />
          </div>
        </div>

        {/* Tableau détaillé des gaz */}
        <div className="mb-6 sm:mb-8">
          <GasTable 
            gasData={gasData} 
            thresholds={{
              co: alertThresholds.co.max,
              co2: alertThresholds.co2.max,
              nh3: alertThresholds.nh3.max,
              h2s: alertThresholds.h2s.max
            }}
          />
        </div>

        {/* Graphiques et alertes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 mb-6 sm:mb-8">
          <div className="lg:col-span-2">
            <ChartWidget data={chartData} />
          </div>
          <div>
            <AlertPanel alerts={alerts} />
          </div>
        </div>

        {/* Panneau de contrôle */}
        <ControlPanel />
        
        {/* Settings Modal */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onSave={(thresholds, notifications) => {
            setAlertThresholds(thresholds);
            setNotificationSettings(notifications);
            
            // Save to localStorage
            localStorage.setItem('alertThresholds', JSON.stringify(thresholds));
            localStorage.setItem('notificationSettings', JSON.stringify(notifications));
            
            console.log('Settings saved to localStorage:', { thresholds, notifications });
          }}
          currentThresholds={alertThresholds}
          currentNotifications={notificationSettings}
        />
      </div>
    </div>
  );
};

export default Dashboard;