import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 ease-in-out"
      title={theme === 'light' ? 'تفعيل الوضع الليلي' : 'تفعيل وضع النهار'}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <div className="relative">
        {theme === 'light' ? (
          <Moon className="h-4 w-4 sm:h-5 sm:w-5 transform transition-transform duration-200 hover:scale-110" />
        ) : (
          <Sun className="h-4 w-4 sm:h-5 sm:w-5 transform transition-transform duration-200 hover:scale-110 text-yellow-500" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
