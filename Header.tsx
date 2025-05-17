import React from 'react';
import { Menu, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onMenuButtonClick: () => void;
  isAdmin?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuButtonClick, isAdmin = false }) => {
  const { user, logout } = useAuth();
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <button
            type="button"
            className="text-gray-600 hover:text-gray-900 focus:outline-none md:hidden"
            onClick={onMenuButtonClick}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="ml-4 md:ml-0">
            <h1 className="text-lg md:text-xl font-semibold text-gray-900">
              {isAdmin ? 'Панель администратора' : 'Личный кабинет студента'}
            </h1>
            <p className="text-sm text-gray-500">
              {user?.fullName || user?.email}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:text-gray-700 focus:outline-none relative">
            <Bell className="h-6 w-6" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <button 
            onClick={logout}
            className="text-gray-500 hover:text-gray-700 focus:outline-none flex items-center"
          >
            <LogOut className="h-5 w-5 mr-1" />
            <span className="hidden sm:inline">Выйти</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;