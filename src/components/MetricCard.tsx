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
      light: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-600 dark:text-blue-400'
    },
    green: {
      bg: 'bg-green-500',
      light: 'bg-green-50 dark:bg-green-900/20',
      text: 'text-green-600 dark:text-green-400'
    },
    yellow: {
      bg: 'bg-yellow-500',
      light: 'bg-yellow-50 dark:bg-yellow-900/20',
      text: 'text-yellow-600 dark:text-yellow-400'
    },
    red: {
      bg: 'bg-red-500',
      light: 'bg-red-50 dark:bg-red-900/20',
      text: 'text-red-600 dark:text-red-400'
    },
    teal: {
      bg: 'bg-teal-500',
      light: 'bg-teal-50 dark:bg-teal-900/20',
      text: 'text-teal-600 dark:text-teal-400'
    },
    indigo: {
      bg: 'bg-indigo-500',
      light: 'bg-indigo-50 dark:bg-indigo-900/20',
      text: 'text-indigo-600 dark:text-indigo-400'
    },
    purple: {
      bg: 'bg-purple-500',
      light: 'bg-purple-50 dark:bg-purple-900/20',
      text: 'text-purple-600 dark:text-purple-400'
    }
  };

  const statusClasses = {
    good: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10',
    warning: 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10',
    error: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10'
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600 dark:text-gray-400" />;
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
    <div className={`bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-sm border-2 ${statusClasses[status]} p-3 sm:p-6 transition-all duration-200 hover:shadow-md`}>
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
        <h3 className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 leading-tight transition-colors duration-200">{title}</h3>
        <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight transition-colors duration-200">{value}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight transition-colors duration-200">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default MetricCard;