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
  RefreshCw
} from 'lucide-react';
import MetricCard from './MetricCard';
import AlertPanel from './AlertPanel';
import ChartWidget from './ChartWidget';
import ControlPanel from './ControlPanel';
import { sensorService, SensorData, Alert } from '../services/sensorService';

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

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Firebase real-time data subscriptions
  useEffect(() => {
    // Initialize default data
    sensorService.initializeDefaultData();
    
    // Subscribe to sensor data updates
    const unsubscribeSensorData = sensorService.subscribeSensorData((data) => {
      setSensorData(data);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AgroConnect IoT</h1>
                <p className="text-sm text-gray-600">Élevage de Volailles Connecté</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-4 w-4" />
                  <span>Dernière mise à jour: {lastUpdate.toLocaleTimeString('fr-FR')}</span>
                </div>
              </div>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Température"
            value={`${sensorData.temperature?.toFixed(1) || '0.0'}°C`}
            icon={<Thermometer className="h-6 w-6" />}
            trend={sensorData.temperature > 24 ? 'up' : 'down'}
            color="blue"
            status={sensorData.temperature >= 18 && sensorData.temperature <= 26 ? 'good' : 'warning'}
          />
          <MetricCard
            title="Humidité"
            value={`${sensorData.humidity?.toFixed(0) || '0'}%`}
            icon={<Droplets className="h-6 w-6" />}
            trend={sensorData.humidity > 65 ? 'up' : 'down'}
            color="teal"
            status={sensorData.humidity <= 70 ? 'good' : 'warning'}
          />
          <MetricCard
            title="Qualité de l'air"
            value={`${sensorData.airQuality?.toFixed(0) || '0'}/100`}
            icon={<Wind className="h-6 w-6" />}
            trend="up"
            color="green"
            status={sensorData.airQuality >= 80 ? 'good' : 'warning'}
          />
          <MetricCard
            title="Luminosité"
            value={`${sensorData.lightLevel?.toFixed(0) || '0'} lux`}
            icon={<Sun className="h-6 w-6" />}
            trend="stable"
            color="yellow"
            status="good"
          />
        </div>

        {/* Métriques animaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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

        {/* Graphiques et alertes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <ChartWidget data={chartData} />
          </div>
          <div>
            <AlertPanel alerts={alerts} />
          </div>
        </div>

        {/* Panneau de contrôle */}
        <ControlPanel />
      </div>
    </div>
  );
};

export default Dashboard;