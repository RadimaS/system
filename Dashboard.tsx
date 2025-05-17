import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Home, 
  FileText, 
  CreditCard, 
  BarChart3,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { api } from '../../services/api';

interface DashboardStats {
  totalStudents: number;
  occupiedRooms: number;
  totalRooms: number;
  pendingRequests: number;
  totalRequests: number;
  totalDebt: number;
  occupancyRate: number;
}

interface RequestDistribution {
  category: string;
  count: number;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [requestDistribution, setRequestDistribution] = useState<RequestDistribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const dashboardData = await api.get('/admin/dashboard');
        setStats(dashboardData.stats);
        setRequestDistribution(dashboardData.requestDistribution);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Mock data for demonstration
  const mockStats: DashboardStats = {
    totalStudents: 342,
    occupiedRooms: 152,
    totalRooms: 200,
    pendingRequests: 18,
    totalRequests: 245,
    totalDebt: 56500,
    occupancyRate: 76
  };

  const mockDistribution: RequestDistribution[] = [
    { category: 'Ремонт', count: 45 },
    { category: 'Сантехника', count: 82 },
    { category: 'Электрика', count: 37 },
    { category: 'Мебель', count: 28 },
    { category: 'Переселение', count: 23 },
    { category: 'Бытовые проблемы', count: 19 },
    { category: 'Другое', count: 11 }
  ];

  const displayStats = stats || mockStats;
  const displayDistribution = requestDistribution && requestDistribution.length > 0 ? requestDistribution : mockDistribution;

  const totalRequestCount = displayDistribution.reduce((sum, item) => sum + item.count, 0);
  
  const getPercentage = (count: number) => {
    return ((count / totalRequestCount) * 100).toFixed(1);
  };

  const getColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-indigo-500',
      'bg-purple-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-gray-500'
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Панель администратора</h1>
      
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Students */}
        <div 
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 cursor-pointer"
          onClick={() => navigate('/admin/students')}
        >
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <Users className="h-6 w-6 text-blue-700" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Студенты</h3>
              <p className="text-2xl font-bold text-gray-800">{displayStats.totalStudents}</p>
              <p className="text-xs text-gray-500 mt-1">Проживают в общежитии</p>
            </div>
          </div>
        </div>

        {/* Rooms */}
        <div 
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 cursor-pointer"
          onClick={() => navigate('/admin/rooms')}
        >
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <Home className="h-6 w-6 text-green-700" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Комнаты</h3>
              <p className="text-2xl font-bold text-gray-800">
                {displayStats.occupiedRooms}/{displayStats.totalRooms}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Занято {displayStats.occupancyRate}% мест
              </p>
            </div>
          </div>
        </div>

        {/* Requests */}
        <div 
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 cursor-pointer"
          onClick={() => navigate('/admin/requests')}
        >
          <div className="flex items-center">
            <div className="rounded-full bg-purple-100 p-3 mr-4">
              <FileText className="h-6 w-6 text-purple-700" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Заявки</h3>
              <p className="text-2xl font-bold text-gray-800">
                {displayStats.pendingRequests}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Ожидают рассмотрения
              </p>
            </div>
          </div>
        </div>

        {/* Debt */}
        <div 
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 cursor-pointer"
        >
          <div className="flex items-center">
            <div className="rounded-full bg-red-100 p-3 mr-4">
              <CreditCard className="h-6 w-6 text-red-700" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Задолженность</h3>
              <p className="text-2xl font-bold text-gray-800">
                {displayStats.totalDebt.toLocaleString()} ₽
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Общая сумма задолженности
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Categories Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Распределение заявок по категориям</h2>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {displayDistribution.map((item, index) => (
              <div key={item.category}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{item.category}</span>
                  <span className="text-sm text-gray-500">{item.count} ({getPercentage(item.count)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`${getColor(index)} h-2.5 rounded-full`} 
                    style={{ width: `${getPercentage(item.count)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Access */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Быстрый доступ</h2>
          <div className="grid grid-cols-1 gap-3">
            <button 
              onClick={() => navigate('/admin/requests')}
              className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors duration-200"
            >
              <div className="flex items-center">
                <div className="rounded-full bg-blue-100 p-2 mr-3">
                  <FileText className="h-5 w-5 text-blue-700" />
                </div>
                <span className="font-medium text-gray-800">Просмотреть все заявки</span>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </button>
            
            <button 
              onClick={() => navigate('/admin/students')}
              className="flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-md transition-colors duration-200"
            >
              <div className="flex items-center">
                <div className="rounded-full bg-green-100 p-2 mr-3">
                  <Users className="h-5 w-5 text-green-700" />
                </div>
                <span className="font-medium text-gray-800">Управление студентами</span>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </button>
            
            <button 
              onClick={() => navigate('/admin/rooms')}
              className="flex items-center justify-between p-3 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors duration-200"
            >
              <div className="flex items-center">
                <div className="rounded-full bg-purple-100 p-2 mr-3">
                  <Home className="h-5 w-5 text-purple-700" />
                </div>
                <span className="font-medium text-gray-800">Распределение комнат</span>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </button>
            
            <button 
              onClick={() => navigate('/admin/reports')}
              className="flex items-center justify-between p-3 bg-yellow-50 hover:bg-yellow-100 rounded-md transition-colors duration-200"
            >
              <div className="flex items-center">
                <div className="rounded-full bg-yellow-100 p-2 mr-3">
                  <BarChart3 className="h-5 w-5 text-yellow-700" />
                </div>
                <span className="font-medium text-gray-800">Генерация отчетов</span>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Alerts Section */}
      {displayStats.occupancyRate > 90 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Высокая заполняемость</h3>
              <div className="mt-1 text-sm text-yellow-700">
                <p>Заполняемость комнат составляет {displayStats.occupancyRate}%. Рекомендуется подготовить резервные комнаты.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {displayStats.pendingRequests > 10 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Много необработанных заявок</h3>
              <div className="mt-1 text-sm text-red-700">
                <p>{displayStats.pendingRequests} заявок ожидают рассмотрения. Рекомендуется ускорить обработку.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;