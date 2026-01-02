
import React from 'react';
import { ViewState } from '../types';
import { Home, Scale, Sparkles, User } from 'lucide-react';

interface NavigationProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { id: 'list', label: '车型', icon: <Home size={24} /> },
    { id: 'compare', label: '对比', icon: <Scale size={24} /> },
    { id: 'ai', label: '智选', icon: <Sparkles size={24} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 pb-safe px-4 z-50">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id as ViewState)}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
            currentView === item.id ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          {item.icon}
          <span className="text-xs mt-1 font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
