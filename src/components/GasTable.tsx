import React from 'react';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { GasData } from '../services/sensorService';

interface GasTableProps {
  gasData: GasData;
  thresholds?: {
    co: number;
    co2: number;
    nh3: number;
    h2s: number;
  };
}

const GasTable: React.FC<GasTableProps> = ({ gasData, thresholds }) => {
  // Default thresholds if not provided
  const defaultThresholds = {
    co: 5,
    co2: 1000,
    nh3: 15,
    h2s: 1
  };
  
  const currentThresholds = thresholds || defaultThresholds;
  const gasInfo = [
    {
      name: 'Monoxyde de carbone',
      symbol: 'CO',
      value: gasData.co,
      unit: 'ppm',
      limit: currentThresholds.co,
      description: 'Gaz toxique incolore et inodore',
      danger: 'Très dangereux à haute concentration'
    },
    {
      name: 'Dioxyde de carbone',
      symbol: 'CO₂',
      value: gasData.co2,
      unit: 'ppm',
      limit: currentThresholds.co2,
      description: 'Indicateur de ventilation',
      danger: 'Peut causer somnolence'
    },
    {
      name: 'Ammoniac',
      symbol: 'NH₃',
      value: gasData.nh3,
      unit: 'ppm',
      limit: currentThresholds.nh3,
      description: 'Produit par décomposition organique',
      danger: 'Irritant pour les voies respiratoires'
    },
    {
      name: 'Sulfure d\'hydrogène',
      symbol: 'H₂S',
      value: gasData.h2s,
      unit: 'ppm',
      limit: currentThresholds.h2s,
      description: 'Gaz à odeur d\'œuf pourri',
      danger: 'Très toxique même à faible dose'
    }
  ];

  const getStatusColor = (value: number, limit: number) => {
    const percentage = (value / limit) * 100;
    if (percentage <= 50) return 'text-green-600 bg-green-50';
    if (percentage <= 80) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getStatusIcon = (value: number, limit: number) => {
    const percentage = (value / limit) * 100;
    if (percentage <= 50) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (percentage <= 80) return <Clock className="h-4 w-4 text-yellow-600" />;
    return <AlertTriangle className="h-4 w-4 text-red-600" />;
  };

  const getStatusText = (value: number, limit: number) => {
    const percentage = (value / limit) * 100;
    if (percentage <= 50) return 'Normal';
    if (percentage <= 80) return 'Attention';
    return 'Critique';
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Surveillance des Gaz</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Monitoring en temps réel de la qualité de l'air</p>
          </div>
          <div className="text-xs text-gray-500">
            Dernière mise à jour: {formatTimestamp(gasData.timestamp)}
          </div>
        </div>
      </div>
      
      {/* Mobile View */}
      <div className="block sm:hidden">
        {gasInfo.map((gas, index) => {
          const percentage = (gas.value / gas.limit) * 100;
          return (
            <div key={index} className="p-4 border-b border-gray-200 last:border-b-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">{gas.symbol}</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{gas.name}</div>
                    <div className="text-xs text-gray-500">{gas.description}</div>
                  </div>
                </div>
                <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(gas.value, gas.limit)}`}>
                  {getStatusIcon(gas.value, gas.limit)}
                  <span>{getStatusText(gas.value, gas.limit)}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-xs text-gray-500">Valeur</div>
                  <div className="font-bold text-gray-900">{gas.value.toFixed(1)} {gas.unit}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Limite</div>
                  <div className="text-gray-900">{gas.limit} {gas.unit}</div>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Pourcentage</span>
                  <span>{percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      percentage <= 50 ? 'bg-green-500' :
                      percentage <= 80 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">{gas.danger}</div>
            </div>
          );
        })}
      </div>
      
      {/* Desktop View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gaz
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valeur Actuelle
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Limite Sécurité
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pourcentage
              </th>
              <th className="hidden lg:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {gasInfo.map((gas, index) => {
              const percentage = (gas.value / gas.limit) * 100;
              return (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-xs sm:text-sm font-bold text-blue-600">{gas.symbol}</span>
                        </div>
                      </div>
                      <div className="ml-3 sm:ml-4">
                        <div className="text-xs sm:text-sm font-medium text-gray-900">{gas.name}</div>
                        <div className="text-xs text-gray-500 sm:hidden">{gas.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-xs sm:text-sm font-bold text-gray-900">
                      {gas.value.toFixed(1)} {gas.unit}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-xs sm:text-sm text-gray-900">
                      {gas.limit} {gas.unit}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center space-x-1 sm:space-x-2 px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(gas.value, gas.limit)}`}>
                      {getStatusIcon(gas.value, gas.limit)}
                      <span className="hidden sm:inline">{getStatusText(gas.value, gas.limit)}</span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-12 sm:w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            percentage <= 50 ? 'bg-green-500' :
                            percentage <= 80 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs sm:text-sm text-gray-600">{percentage.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="hidden lg:table-cell px-3 sm:px-6 py-4">
                    <div className="text-sm text-gray-900">{gas.description}</div>
                    <div className="text-xs text-gray-500 mt-1">{gas.danger}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Légende */}
      <div className="px-3 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 text-xs text-gray-600">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-3 w-3 text-green-600" />
              <span>Normal (≤ 50%)</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3 text-yellow-600" />
              <span>Attention (51-80%)</span>
            </div>
            <div className="flex items-center space-x-1">
              <AlertTriangle className="h-3 w-3 text-red-600" />
              <span>Critique (&gt;80%)</span>
            </div>
          </div>
          <div className="text-gray-500 text-center sm:text-right">
            Mise à jour automatique toutes les 5 secondes
          </div>
        </div>
      </div>
    </div>
  );
};

export default GasTable;
