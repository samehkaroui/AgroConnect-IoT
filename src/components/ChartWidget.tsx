import React from 'react';
import { TrendingUp } from 'lucide-react';

interface ChartData {
  time: string;
  temperature: number;
  humidity: number;
  activity: number;
}

interface ChartWidgetProps {
  data: ChartData[];
}

const ChartWidget: React.FC<ChartWidgetProps> = ({ data }) => {
  const maxTemp = Math.max(...data.map(d => d.temperature));
  const minTemp = Math.min(...data.map(d => d.temperature));
  const maxHumidity = Math.max(...data.map(d => d.humidity));
  const minHumidity = Math.min(...data.map(d => d.humidity));
  const maxActivity = Math.max(...data.map(d => d.activity));

  const normalizeValue = (value: number, min: number, max: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  const getPath = (values: number[], min: number, max: number) => {
    const points = values.map((value, index) => {
      const x = (index / (values.length - 1)) * 100;
      const y = 100 - normalizeValue(value, min, max);
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  const temperaturePath = getPath(data.map(d => d.temperature), minTemp, maxTemp);
  const humidityPath = getPath(data.map(d => d.humidity), minHumidity, maxHumidity);
  const activityPath = getPath(data.map(d => d.activity), 0, maxActivity);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Évolution des paramètres</h3>
          <TrendingUp className="h-5 w-5 text-gray-600" />
        </div>
        <p className="text-sm text-gray-600 mt-1">Données des dernières 24 heures</p>
      </div>
      
      <div className="p-6">
        {/* Légende */}
        <div className="flex items-center justify-center space-x-8 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">Température (°C)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">Humidité (%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">Activité (%)</span>
          </div>
        </div>

        {/* Graphique */}
        <div className="relative">
          <svg 
            viewBox="0 0 100 60" 
            className="w-full h-64 border border-gray-100 rounded-lg bg-gradient-to-b from-gray-50 to-white"
          >
            {/* Grille */}
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f3f4f6" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="60" fill="url(#grid)" />
            
            {/* Lignes de données */}
            <path
              d={temperaturePath}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              className="drop-shadow-sm"
            />
            <path
              d={humidityPath}
              fill="none"
              stroke="#14B8A6"
              strokeWidth="2"
              className="drop-shadow-sm"
            />
            <path
              d={activityPath}
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="2"
              className="drop-shadow-sm"
            />
            
            {/* Points de données */}
            {data.map((_, index) => {
              const x = (index / (data.length - 1)) * 100;
              return (
                <g key={index}>
                  <circle
                    cx={x}
                    cy={100 - normalizeValue(data[index].temperature, minTemp, maxTemp)}
                    r="2"
                    fill="#3B82F6"
                    className="hover:r-3 transition-all cursor-pointer"
                  />
                  <circle
                    cx={x}
                    cy={100 - normalizeValue(data[index].humidity, minHumidity, maxHumidity)}
                    r="2"
                    fill="#14B8A6"
                    className="hover:r-3 transition-all cursor-pointer"
                  />
                  <circle
                    cx={x}
                    cy={100 - normalizeValue(data[index].activity, 0, maxActivity)}
                    r="2"
                    fill="#8B5CF6"
                    className="hover:r-3 transition-all cursor-pointer"
                  />
                </g>
              );
            })}
          </svg>
          
          {/* Labels d'heures */}
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>{data[0]?.time}</span>
            <span>{data[Math.floor(data.length / 2)]?.time}</span>
            <span>{data[data.length - 1]?.time}</span>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Température moyenne</p>
            <p className="text-lg font-bold text-blue-600">
              {(data.reduce((sum, d) => sum + d.temperature, 0) / data.length).toFixed(1)}°C
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Humidité moyenne</p>
            <p className="text-lg font-bold text-teal-600">
              {(data.reduce((sum, d) => sum + d.humidity, 0) / data.length).toFixed(0)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Activité moyenne</p>
            <p className="text-lg font-bold text-purple-600">
              {(data.reduce((sum, d) => sum + d.activity, 0) / data.length).toFixed(0)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartWidget;