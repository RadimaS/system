import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter, 
  AlertTriangle,
  ChevronDown,
  CheckCheck
} from 'lucide-react';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

interface Request {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'processing' | 'resolved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  isUrgent: boolean;
  adminComment?: string;
  student: {
    id: string;
    fullName: string;
    room: string;
  };
}

const AdminRequestList: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentRequest, setCurrentRequest] = useState<Request | null>(null);
  const [commentText, setCommentText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await api.get('/admin/requests');
        setRequests(data);
      } catch (error) {
        console.error('Error fetching requests:', error);
        toast.error('Не удалось загрузить заявки');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // For demo purposes, use mock data if the API is not yet implemented
  const mockRequests: Request[] = [
    {
      id: '1',
      title: 'Не работает кран в ванной',
      description: 'Вода не течет из крана в ванной комнате. Проблема возникла вчера вечером.',
      category: 'Сантехника',
      status: 'pending',
      createdAt: '2023-09-10T14:23:54Z',
      updatedAt: '2023-09-10T14:23:54Z',
      isUrgent: true,
      student: {
        id: 's1',
        fullName: 'Ахмедов Ислам',
        room: '303'
      }
    },
    {
      id: '2',
      title: 'Замена лампочки',
      description: 'Перегорела лампочка в основном освещении комнаты.',
      category: 'Электрика',
      status: 'processing',
      createdAt: '2023-09-05T09:15:22Z',
      updatedAt: '2023-09-06T11:30:00Z',
      isUrgent: false,
      student: {
        id: 's2',
        fullName: 'Магомедов Хасан',
        room: '212'
      }
    },
    {
      id: '3',
      title: 'Запрос на переселение',
      description: 'Прошу рассмотреть возможность переселения в комнату на первом этаже по состоянию здоровья.',
      category: 'Переселение',
      status: 'resolved',
      createdAt: '2023-08-20T10:45:12Z',
      updatedAt: '2023-08-25T13:20:45Z',
      isUrgent: false,
      adminComment: 'Переселение одобрено. Пожалуйста, подойдите к коменданту для получения нового ключа.',
      student: {
        id: 's3',
        fullName: 'Вахаев Адам',
        room: '115'
      }
    },
    {
      id: '4',
      title: 'Шумные соседи',
      description: 'Соседи в комнате 304 регулярно шумят после 23:00, мешая отдыхать. Просьба принять меры.',
      category: 'Бытовые проблемы',
      status: 'pending',
      createdAt: '2023-09-09T20:10:32Z',
      updatedAt: '2023-09-09T20:10:32Z',
      isUrgent: false,
      student: {
        id: 's4',
        fullName: 'Алиев Рамзан',
        room: '302'
      }
    },
    {
      id: '5',
      title: 'Сломанный стул',
      description: 'В комнате сломался стул, нужна замена или ремонт.',
      category: 'Мебель',
      status: 'rejected',
      createdAt: '2023-09-01T11:34:21Z',
      updatedAt: '2023-09-03T09:15:40Z',
      isUrgent: false,
      adminComment: 'Отклонено. По результатам проверки установлено, что повреждение вызвано неаккуратным использованием. Пожалуйста, приобретите замену самостоятельно.',
      student: {
        id: 's5',
        fullName: 'Хачукаев Муса',
        room: '405'
      }
    }
  ];

  const displayRequests = requests.length > 0 ? requests : mockRequests;
  
  // Get unique categories for filter
  const categories = ['all', ...new Set(displayRequests.map(r => r.category))];
  
  const filteredRequests = displayRequests.filter(request => {
    const matchesSearch = 
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.student.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || request.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Ожидает рассмотрения';
      case 'processing':
        return 'В обработке';
      case 'resolved':
        return 'Решено';
      case 'rejected':
        return 'Отклонено';
      default:
        return 'Неизвестный статус';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleStatusChange = async (requestId: string, newStatus: string) => {
    try {
      // In a real app, this would call the API to update the status
      toast.success(`Статус заявки обновлен на "${getStatusText(newStatus)}"`);
      
      // Update the UI optimistically
      setRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status: newStatus as any, updatedAt: new Date().toISOString() } 
            : req
        )
      );
    } catch (error) {
      console.error('Error updating request status:', error);
      toast.error('Не удалось обновить статус заявки');
    }
  };

  const openModal = (request: Request) => {
    setCurrentRequest(request);
    setCommentText(request.adminComment || '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentRequest(null);
    setCommentText('');
  };

  const saveComment = async () => {
    if (!currentRequest) return;
    
    try {
      // In a real app, this would call the API to save the comment
      toast.success('Комментарий сохранен');
      
      // Update the UI optimistically
      setRequests(prev => 
        prev.map(req => 
          req.id === currentRequest.id 
            ? { ...req, adminComment: commentText, updatedAt: new Date().toISOString() } 
            : req
        )
      );
      
      closeModal();
    } catch (error) {
      console.error('Error saving comment:', error);
      toast.error('Не удалось сохранить комментарий');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Управление заявками</h1>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Поиск по заявкам..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative inline-block text-left">
              <div>
                <button
                  type="button"
                  className="inline-flex justify-between items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  id="status-menu"
                  aria-expanded="true"
                  aria-haspopup="true"
                >
                  <Filter className="mr-2 h-4 w-4 text-gray-400" />
                  {statusFilter === 'all' ? 'Все статусы' : getStatusText(statusFilter)}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </button>
              </div>
              
              <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-10 hidden">
                <div className="py-1" role="none">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`block px-4 py-2 text-sm w-full text-left ${
                      statusFilter === 'all' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    }`}
                  >
                    Все статусы
                  </button>
                  <button
                    onClick={() => setStatusFilter('pending')}
                    className={`block px-4 py-2 text-sm w-full text-left ${
                      statusFilter === 'pending' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    }`}
                  >
                    Ожидает рассмотрения
                  </button>
                  <button
                    onClick={() => setStatusFilter('processing')}
                    className={`block px-4 py-2 text-sm w-full text-left ${
                      statusFilter === 'processing' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    }`}
                  >
                    В обработке
                  </button>
                  <button
                    onClick={() => setStatusFilter('resolved')}
                    className={`block px-4 py-2 text-sm w-full text-left ${
                      statusFilter === 'resolved' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    }`}
                  >
                    Решено
                  </button>
                  <button
                    onClick={() => setStatusFilter('rejected')}
                    className={`block px-4 py-2 text-sm w-full text-left ${
                      statusFilter === 'rejected' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    }`}
                  >
                    Отклонено
                  </button>
                </div>
              </div>
            </div>
            
            <div className="relative inline-block text-left">
              <div>
                <button
                  type="button"
                  className="inline-flex justify-between items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  id="category-menu"
                  aria-expanded="true"
                  aria-haspopup="true"
                >
                  <Filter className="mr-2 h-4 w-4 text-gray-400" />
                  {categoryFilter === 'all' ? 'Все категории' : categoryFilter}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </button>
              </div>
              
              <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-10 hidden">
                <div className="py-1" role="none">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setCategoryFilter(category)}
                      className={`block px-4 py-2 text-sm w-full text-left ${
                        categoryFilter === category ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      }`}
                    >
                      {category === 'all' ? 'Все категории' : category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-gray-500">Нет заявок, соответствующих выбранным фильтрам.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                  <div className="mb-4 lg:mb-0">
                    <div className="flex items-center">
                      <h3 className="text-lg font-semibold text-gray-900 mr-2">{request.title}</h3>
                      {request.isUrgent && (
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          Срочно
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {request.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        Создано: {formatDate(request.createdAt)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-md mr-2">
                      {getStatusIcon(request.status)}
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {getStatusText(request.status)}
                      </span>
                    </div>
                    
                    <div className="relative inline-block text-left">
                      <button
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Изменить
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </button>
                      
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-10 hidden">
                        <div className="py-1" role="none">
                          <button
                            onClick={() => handleStatusChange(request.id, 'processing')}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            <Clock className="mr-2 h-4 w-4 text-blue-500" />
                            В обработку
                          </button>
                          <button
                            onClick={() => handleStatusChange(request.id, 'resolved')}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            <CheckCheck className="mr-2 h-4 w-4 text-green-500" />
                            Отметить как решенную
                          </button>
                          <button
                            onClick={() => handleStatusChange(request.id, 'rejected')}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            <XCircle className="mr-2 h-4 w-4 text-red-500" />
                            Отклонить заявку
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Описание</h4>
                    <p className="text-gray-800">{request.description}</p>
                    
                    {request.adminComment && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Комментарий администратора</h4>
                        <p className="text-gray-800">{request.adminComment}</p>
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <button
                        onClick={() => openModal(request)}
                        className="text-blue-700 hover:text-blue-800 text-sm font-medium"
                      >
                        {request.adminComment ? 'Редактировать комментарий' : 'Добавить комментарий'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Информация о студенте</h4>
                    <p className="font-medium text-gray-800">{request.student.fullName}</p>
                    <p className="text-sm text-gray-600">Комната: {request.student.room}</p>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">История заявки</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full bg-gray-300 mr-2"></div>
                          <p className="text-xs text-gray-600">
                            {formatDate(request.createdAt)} - Создана
                          </p>
                        </div>
                        {request.createdAt !== request.updatedAt && (
                          <div className="flex items-center">
                            <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                            <p className="text-xs text-gray-600">
                              {formatDate(request.updatedAt)} - Обновлена
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Comment Modal */}
      {isModalOpen && currentRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            
            <div className="relative bg-white rounded-lg max-w-lg w-full mx-auto shadow-xl z-10">
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Комментарий к заявке
                </h3>
                
                <div>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Введите комментарий к заявке..."
                  ></textarea>
                </div>
                
                <div className="mt-5 flex justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Отмена
                  </button>
                  <button
                    type="button"
                    onClick={saveComment}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Сохранить
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRequestList;