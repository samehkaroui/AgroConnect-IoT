import React, { useState } from 'react';
import { TrendingUp, Calendar, Clock } from 'lucide-react';

interface ChartData {
  time: string;
  temperature: number;
  humidity: number;
  activity: number;
}

interface ChartWidgetProps {
  data: ChartData[];
}

type TimePeriod = 'day' | 'week' | 'month';

const ChartWidget: React.FC<ChartWidgetProps> = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('day');

  // Generate data based on selected period
  const generateDataForPeriod = (period: TimePeriod) => {
    const now = new Date();
    const dataPoints = [];
    
    switch (period) {
      case 'day':
        // 24 hours data (hourly)
        for (let i = 23; i >= 0; i--) {
          const time = new Date(now.getTime() - i * 60 * 60 * 1000);
          dataPoints.push({
            time: time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            temperature: 24.5 + Math.sin(i / 4) * 2 + (Math.random() - 0.5),
            humidity: 65 + Math.cos(i / 6) * 8 + (Math.random() - 0.5) * 3,
            activity: 50 + Math.sin(i / 3) * 25 + (Math.random() - 0.5) * 10
          });
        }
        break;
      case 'week':
        // 7 days data (daily)
        for (let i = 6; i >= 0; i--) {
          const time = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
          dataPoints.push({
            time: time.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }),
            temperature: 24.5 + Math.sin(i / 2) * 3 + (Math.random() - 0.5) * 2,
            humidity: 65 + Math.cos(i / 3) * 10 + (Math.random() - 0.5) * 5,
            activity: 60 + Math.sin(i / 2) * 20 + (Math.random() - 0.5) * 15
          });
        }
        break;
      case 'month':
        // 30 days data (daily)
        for (let i = 29; i >= 0; i--) {
          const time = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
          dataPoints.push({
            time: time.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
            temperature: 24.5 + Math.sin(i / 7) * 4 + (Math.random() - 0.5) * 3,
            humidity: 65 + Math.cos(i / 5) * 12 + (Math.random() - 0.5) * 8,
            activity: 55 + Math.sin(i / 4) * 30 + (Math.random() - 0.5) * 20
          });
        }
        break;
    }
    return dataPoints;
  };

  const currentData = generateDataForPeriod(selectedPeriod);
  
  // Add padding to min/max values for better visualization
  const maxTemp = Math.max(...currentData.map(d => d.temperature)) + 1;
  const minTemp = Math.min(...currentData.map(d => d.temperature)) - 1;
  const maxHumidity = Math.max(...currentData.map(d => d.humidity)) + 5;
  const minHumidity = Math.min(...currentData.map(d => d.humidity)) - 5;
  const maxActivity = Math.max(...currentData.map(d => d.activity)) + 10;

  const normalizeValue = (value: number, min: number, max: number) => {
    return ((value - min) / (max - min)) * 70 + 5; // Use 70% of height with 5% padding for better visibility
  };

  const getPath = (values: number[], min: number, max: number) => {
    const points = values.map((value, index) => {
      const x = (index / (values.length - 1)) * 98 + 1; // Use 98% of width with minimal padding for full display
      const y = 80 - normalizeValue(value, min, max);
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  const temperaturePath = getPath(currentData.map(d => d.temperature), minTemp, maxTemp);
  const humidityPath = getPath(currentData.map(d => d.humidity), minHumidity, maxHumidity);
  const activityPath = getPath(currentData.map(d => d.activity), 0, maxActivity);

  const getPeriodDescription = (period: TimePeriod) => {
    switch (period) {
      case 'day': return 'Données des dernières 24 heures';
      case 'week': return 'Données des 7 derniers jours';
      case 'month': return 'Données des 30 derniers jours';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 transition-colors duration-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-200">Évolution des paramètres</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-200">{getPeriodDescription(selectedPeriod)}</p>
          </div>
          <div className="flex items-center space-x-2">
            {/* Sélecteur de période */}
            <div className="flex bg-gray-100 dark:bg-gray-600 rounded-lg p-1 transition-colors duration-200">
              <button
                onClick={() => setSelectedPeriod('day')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                  selectedPeriod === 'day'
                    ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Clock className="h-4 w-4 inline mr-1" />
                Jour
              </button>
              <button
                onClick={() => setSelectedPeriod('week')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                  selectedPeriod === 'week'
                    ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Calendar className="h-4 w-4 inline mr-1" />
                Semaine
              </button>
              <button
                onClick={() => setSelectedPeriod('month')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                  selectedPeriod === 'month'
                    ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <TrendingUp className="h-4 w-4 inline mr-1" />
                Mois
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        {/* Légende moderne minimaliste */}
        <div className="flex items-center justify-center space-x-8 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">Température</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
              {minTemp.toFixed(1)}-{maxTemp.toFixed(1)}°C
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-teal-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">Humidité</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
              {minHumidity.toFixed(0)}-{maxHumidity.toFixed(0)}%
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-purple-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">Activité</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
              0-{maxActivity.toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Graphique moderne minimaliste - Pleine largeur et visibilité optimale */}
        <div className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-1 transition-colors duration-200">
          <svg 
            viewBox="0 0 100 80" 
            className="w-full h-[500px] bg-gradient-to-b from-white dark:from-gray-800 to-gray-50/20 dark:to-gray-700/20 rounded-md transition-colors duration-200"
          >
            {/* Grille ultra-fine pour meilleure visibilité */}
            <defs>
              <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
                <path d="M 5 0 L 0 0 0 5" fill="none" stroke="#f9fafb" strokeWidth="0.3" className="dark:stroke-gray-700"/>
              </pattern>
              <pattern id="majorGrid" width="20" height="16" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 16" fill="none" stroke="#f3f4f6" strokeWidth="0.5" className="dark:stroke-gray-600"/>
              </pattern>
              {/* Gradients optimisés pour lignes fines et claires */}
              <linearGradient id="tempGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="1"/>
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.9"/>
              </linearGradient>
              <linearGradient id="humidityGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#059669" stopOpacity="1"/>
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.9"/>
              </linearGradient>
              <linearGradient id="activityGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7C3AED" stopOpacity="1"/>
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.9"/>
              </linearGradient>
            </defs>
            
            {/* Grilles ultra-subtiles */}
            <rect width="100" height="80" fill="url(#grid)" />
            <rect width="100" height="80" fill="url(#majorGrid)" />
            
            {/* Lignes de données ultra-fines et claires */}
            <path
              d={temperaturePath}
              fill="none"
              stroke="url(#tempGradient)"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-95"
              style={{ filter: 'drop-shadow(0 0 1px rgba(37, 99, 235, 0.3))' }}
            />
            <path
              d={humidityPath}
              fill="none"
              stroke="url(#humidityGradient)"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-95"
              style={{ filter: 'drop-shadow(0 0 1px rgba(5, 150, 105, 0.3))' }}
            />
            <path
              d={activityPath}
              fill="none"
              stroke="url(#activityGradient)"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-95"
              style={{ filter: 'drop-shadow(0 0 1px rgba(124, 58, 237, 0.3))' }}
            />
            
            {/* Points de données ultra-fins et précis */}
            {currentData.map((_, index) => {
              const x = (index / (currentData.length - 1)) * 98 + 1;
              // Afficher plus de points pour une meilleure visibilité
              if (index % 2 !== 0) return null;
              
              return (
                <g key={index}>
                  {/* Points température - ultra-fins et clairs */}
                  <circle
                    cx={x}
                    cy={80 - normalizeValue(currentData[index].temperature, minTemp, maxTemp)}
                    r="1"
                    fill="#2563EB"
                    stroke="#ffffff"
                    strokeWidth="0.5"
                    className="hover:r-2 transition-all cursor-pointer opacity-90 hover:opacity-100"
                    style={{ filter: 'drop-shadow(0 0 2px rgba(37, 99, 235, 0.4))' }}
                  >
                    <title>{`Température: ${currentData[index].temperature.toFixed(1)}°C à ${currentData[index].time}`}</title>
                  </circle>
                  
                  {/* Points humidité */}
                  <circle
                    cx={x}
                    cy={80 - normalizeValue(currentData[index].humidity, minHumidity, maxHumidity)}
                    r="1"
                    fill="#059669"
                    stroke="#ffffff"
                    strokeWidth="0.5"
                    className="hover:r-2 transition-all cursor-pointer opacity-90 hover:opacity-100"
                    style={{ filter: 'drop-shadow(0 0 2px rgba(5, 150, 105, 0.4))' }}
                  >
                    <title>{`Humidité: ${currentData[index].humidity.toFixed(0)}% à ${currentData[index].time}`}</title>
                  </circle>
                  
                  {/* Points activité */}
                  <circle
                    cx={x}
                    cy={80 - normalizeValue(currentData[index].activity, 0, maxActivity)}
                    r="1"
                    fill="#7C3AED"
                    stroke="#ffffff"
                    strokeWidth="0.5"
                    className="hover:r-2 transition-all cursor-pointer opacity-90 hover:opacity-100"
                    style={{ filter: 'drop-shadow(0 0 2px rgba(124, 58, 237, 0.4))' }}
                  >
                    <title>{`Activité: ${currentData[index].activity.toFixed(0)}% à ${currentData[index].time}`}</title>
                  </circle>
                </g>
              );
            })}
          </svg>
          
          {/* Labels d'heures améliorés */}
          <div className="flex justify-between mt-2 px-1">
            <div className="text-center">
              <div className="text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded transition-colors duration-200">
                {currentData[0]?.time}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded transition-colors duration-200">
                {currentData[Math.floor(currentData.length / 2)]?.time}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded transition-colors duration-200">
                {currentData[currentData.length - 1]?.time}
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques rapides améliorées */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div className="text-center bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800 transition-colors duration-200">
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2 transition-colors duration-200">Température moyenne</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 transition-colors duration-200">
              {(currentData.reduce((sum, d) => sum + d.temperature, 0) / currentData.length).toFixed(1)}°C
            </p>
            <div className="flex justify-between text-xs text-blue-600 dark:text-blue-400 mt-2 transition-colors duration-200">
              <span>Min: {Math.min(...currentData.map(d => d.temperature)).toFixed(1)}°C</span>
              <span>Max: {Math.max(...currentData.map(d => d.temperature)).toFixed(1)}°C</span>
            </div>
          </div>
          <div className="text-center bg-teal-50 dark:bg-teal-900/20 p-4 rounded-xl border border-teal-200 dark:border-teal-800 transition-colors duration-200">
            <p className="text-sm font-semibold text-teal-700 dark:text-teal-300 mb-2 transition-colors duration-200">Humidité moyenne</p>
            <p className="text-2xl font-bold text-teal-600 dark:text-teal-400 transition-colors duration-200">
              {(currentData.reduce((sum, d) => sum + d.humidity, 0) / currentData.length).toFixed(0)}%
            </p>
            <div className="flex justify-between text-xs text-teal-600 dark:text-teal-400 mt-2 transition-colors duration-200">
              <span>Min: {Math.min(...currentData.map(d => d.humidity)).toFixed(0)}%</span>
              <span>Max: {Math.max(...currentData.map(d => d.humidity)).toFixed(0)}%</span>
            </div>
          </div>
          <div className="text-center bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800 transition-colors duration-200">
            <p className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2 transition-colors duration-200">Activité moyenne</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 transition-colors duration-200">
              {(currentData.reduce((sum, d) => sum + d.activity, 0) / currentData.length).toFixed(0)}%
            </p>
            <div className="flex justify-between text-xs text-purple-600 dark:text-purple-400 mt-2 transition-colors duration-200">
              <span>Min: {Math.min(...currentData.map(d => d.activity)).toFixed(0)}%</span>
              <span>Max: {Math.max(...currentData.map(d => d.activity)).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartWidget;