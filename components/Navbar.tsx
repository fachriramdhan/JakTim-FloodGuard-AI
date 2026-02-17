import React, { useEffect, useState } from 'react';
import { Moon, Sun, CloudRain, Map, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
    currentPage: 'dashboard' | 'maps';
    onNavigate: (page: 'dashboard' | 'maps') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check system preference or local storage
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass-card border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <div className="bg-genz-purple p-2 rounded-lg text-white">
               <CloudRain size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white hidden sm:block">
              FloodGuard<span className="text-genz-purple">.AI</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-full p-1 mr-2 border border-gray-200 dark:border-gray-700">
                  <button 
                    onClick={() => onNavigate('dashboard')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                        currentPage === 'dashboard' 
                        ? 'bg-white dark:bg-gray-700 shadow-sm text-genz-purple' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                    }`}
                  >
                      <LayoutDashboard size={16} />
                      <span className="hidden md:inline">Dashboard</span>
                  </button>
                  <button 
                    onClick={() => onNavigate('maps')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                        currentPage === 'maps' 
                        ? 'bg-white dark:bg-gray-700 shadow-sm text-genz-purple' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                    }`}
                  >
                      <Map size={16} />
                      <span className="hidden md:inline">Peta Sebaran</span>
                  </button>
              </div>
              
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none"
                aria-label="Toggle Dark Mode"
              >
                {isDark ? <Sun className="text-yellow-400" size={24} /> : <Moon className="text-gray-600" size={24} />}
              </button>
          </div>
        </div>
      </div>
    </nav>
  );
};