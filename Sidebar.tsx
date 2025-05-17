import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  X, 
  Home, 
  FileText, 
  Users, 
  Key, 
  BarChart3, 
  School,
  Plus,
  List
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isAdmin?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, isAdmin = false }) => {
  const { user } = useAuth();
  
  // Close sidebar when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsOpen]);

  // Close sidebar when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      const target = event.target as Node;
      
      if (isOpen && sidebar && !sidebar.contains(target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setIsOpen]);

  // Different navigation items for admin and student
  const studentNavItems = [
    { path: '/student', icon: <Home size={20} />, label: 'Главная' },
    { path: '/student/requests/new', icon: <Plus size={20} />, label: 'Новая заявка' },
    { path: '/student/requests', icon: <List size={20} />, label: 'Мои заявки' },
  ];
  
  const adminNavItems = [
    { path: '/admin', icon: <Home size={20} />, label: 'Главная' },
    { path: '/admin/requests', icon: <FileText size={20} />, label: 'Заявки' },
    { path: '/admin/rooms', icon: <Key size={20} />, label: 'Комнаты' },
    { path: '/admin/students', icon: <Users size={20} />, label: 'Студенты' },
    { path: '/admin/reports', icon: <BarChart3 size={20} />, label: 'Отчеты' },
  ];
  
  const navItems = isAdmin ? adminNavItems : studentNavItems;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-blue-800 text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto md:h-screen ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-blue-700">
          <div className="flex items-center space-x-2">
            <School className="h-8 w-8" />
            <div>
              <h2 className="font-semibold text-lg">Общежитие ЧГУ</h2>
              <p className="text-xs text-blue-300">
                {isAdmin ? 'Админ-панель' : 'Кабинет студента'}
              </p>
            </div>
          </div>
          <button
            className="p-1 rounded-md text-blue-300 hover:text-white hover:bg-blue-700 md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Navigation Items */}
        <nav className="py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-sm ${
                      isActive
                        ? 'bg-blue-700 text-white font-medium'
                        : 'text-blue-100 hover:bg-blue-700/50'
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                  end={item.path === '/student' || item.path === '/admin'}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-700">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="font-medium">
                {user?.fullName?.charAt(0) || user?.email?.charAt(0) || '?'}
              </span>
            </div>
            <div className="ml-3 truncate">
              <p className="text-sm font-medium truncate">{user?.fullName || user?.email}</p>
              <p className="text-xs text-blue-300 truncate">{user?.faculty}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;