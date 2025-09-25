import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'stable';
  color: 'blue' | 'green' | 'yellow' | 'red' | 'teal' | 'indigo' | 'purple';
  status: 'good' | 'warning' | 'error';
  subtitle?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  color, 
  status, 
  subtitle 
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-500',
      light: 'bg-blue-50',
      text: 'text-blue-600'
    },
    green: {
      bg: 'bg-green-500',
      light: 'bg-green-50',
      text: 'text-green-600'
    },
    yellow: {
      bg: 'bg-yellow-500',
      light: 'bg-yellow-50',
      text: 'text-yellow-600'
    },
    red: {
      bg: 'bg-red-500',
      light: 'bg-red-50',
      text: 'text-red-600'
    },
    teal: {
      bg: 'bg-teal-500',
      light: 'bg-teal-50',
      text: 'text-teal-600'
    },
    indigo: {
      bg: 'bg-indigo-500',
      light: 'bg-indigo-50',
      text: 'text-indigo-600'
    },
    purple: {
      bg: 'bg-purple-500',
      light: 'bg-purple-50',
      text: 'text-purple-600'
    }
  };

  const statusClasses = {
    good: 'border-green-200 bg-green-50',
    warning: 'border-yellow-200 bg-yellow-50',
    error: 'border-red-200 bg-red-50'
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusDot = () => {
    const dotColors = {
      good: 'bg-green-500',
      warning: 'bg-yellow-500',
      error: 'bg-red-500'
    };
    
    return (
      <div className={`w-3 h-3 rounded-full ${dotColors[status]} animate-pulse`}></div>
    );
  };

  return (
    <div className={`bg-white rounded-lg sm:rounded-xl shadow-sm border-2 ${statusClasses[status]} p-3 sm:p-6 transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-center justify-between mb-2 sm:mb-4">
        <div className={`p-2 sm:p-3 ${colorClasses[color].light} rounded-lg`}>
          <div className={colorClasses[color].text}>
            <div className="w-4 h-4 sm:w-6 sm:h-6">
              {icon}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4">
            {getTrendIcon()}
          </div>
          {getStatusDot()}
        </div>
      </div>
      
      <div className="space-y-0.5 sm:space-y-1">
        <h3 className="text-xs sm:text-sm font-medium text-gray-600 leading-tight">{title}</h3>
        <p className="text-lg sm:text-2xl font-bold text-gray-900 leading-tight">{value}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 leading-tight">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default MetricCard;