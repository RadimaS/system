import React, { useState, useEffect } from 'react';
import { 
  Home, 
  User, 
  Plus, 
  Search, 
  CheckCircle, 
  XCircle,
  Filter,
  ChevronDown
} from 'lucide-react';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

interface Room {
  id: string;
  number: string;
  building: string;
  floor: number;
  capacity: number;
  occupied: number;
  status: 'available' | 'full' | 'maintenance';
  students: {
    id: string;
    fullName: string;
    faculty: string;
  }[];
}

const RoomManagement: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [buildingFilter, setBuildingFilter] = useState<string>('all');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await api.get('/admin/rooms');
        setRooms(data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        toast.error('Не удалось загрузить комнаты');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // For demo purposes, use mock data if the API is not yet implemented
  const mockRooms: Room[] = [
    {
      id: '1',
      number: '101',
      building: 'Корпус 1',
      floor: 1,
      capacity: 3,
      occupied: 3,
      status: 'full',
      students: [
        { id: 's1', fullName: 'Ахмедов Ислам', faculty: 'Факультет информационных технологий' },
        { id: 's2', fullName: 'Магомедов Хасан', faculty: 'Юридический факультет' },
        { id: 's3', fullName: 'Вахаев Адам', faculty: 'Исторический факультет' }
      ]
    },
    {
      id: '2',
      number: '202',
      building: 'Корпус 1',
      floor: 2,
      capacity: 2,
      occupied: 1,
      status: 'available',
      students: [
        { id: 's4', fullName: 'Алиев Рамзан', faculty: 'Биолого-химический факультет' }
      ]
    },
    {
      id: '3',
      number: '303',
      building: 'Корпус 2',
      floor: 3,
      capacity: 3,
      occupied: 2,
      status: 'available',
      students: [
        { id: 's5', fullName: 'Хачукаев Муса', faculty: 'Факультет математики и компьютерных технологий' },
        { id: 's6', fullName: 'Сайдуллаев Амир', faculty: 'Факультет информационных технологий' }
      ]
    },
    {
      id: '4',
      number: '404',
      building: 'Корпус 2',
      floor: 4,
      capacity: 2,
      occupied: 0,
      status: 'maintenance',
      students: []
    },
    {
      id: '5',
      number: '505',
      building: 'Корпус 3',
      floor: 5,
      capacity: 2,
      occupied: 2,
      status: 'full',
      students: [
        { id: 's7', fullName: 'Дудаев Тимур', faculty: 'Филологический факультет' },
        { id: 's8', fullName: 'Гакаев Руслан', faculty: 'Факультет физики и ИКТ' }
      ]
    }
  ];

  const displayRooms = rooms.length > 0 ? rooms : mockRooms;
  
  // Get unique buildings for filter
  const buildings = ['all', ...new Set(displayRooms.map(r => r.building))];
  
  const filteredRooms = displayRooms.filter(room => {
    const matchesSearch = 
      room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.students.some(s => s.fullName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
    const matchesBuilding = buildingFilter === 'all' || room.building === buildingFilter;
    
    return matchesSearch && matchesStatus && matchesBuilding;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-green-700 bg-green-100';
      case 'full':
        return 'text-blue-700 bg-blue-100';
      case 'maintenance':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Доступна';
      case 'full':
        return 'Заполнена';
      case 'maintenance':
        return 'Ремонт';
      default:
        return 'Неизвестный статус';
    }
  };

  const openRoomModal = (room: Room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
  };

  const handleChangeRoomStatus = async (roomId: string, newStatus: string) => {
    try {
      // In a real app, this would call the API to update the status
      toast.success(`Статус комнаты обновлен на "${getStatusText(newStatus)}"`);
      
      // Update the UI optimistically
      setRooms(prev => 
        prev.map(room => 
          room.id === roomId 
            ? { ...room, status: newStatus as any } 
            : room
        )
      );
      
      closeModal();
    } catch (error) {
      console.error('Error updating room status:', error);
      toast.error('Не удалось обновить статус комнаты');
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">Управление комнатами</h1>
        <button
          className="inline-flex items-center px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium rounded-md shadow-sm transition-colors duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Добавить комнату
        </button>
      </div>
      
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
                placeholder="Поиск по номеру или студенту..."
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
                    onClick={() => setStatusFilter('available')}
                    className={`block px-4 py-2 text-sm w-full text-left ${
                      statusFilter === 'available' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    }`}
                  >
                    Доступна
                  </button>
                  <button
                    onClick={() => setStatusFilter('full')}
                    className={`block px-4 py-2 text-sm w-full text-left ${
                      statusFilter === 'full' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    }`}
                  >
                    Заполнена
                  </button>
                  <button
                    onClick={() => setStatusFilter('maintenance')}
                    className={`block px-4 py-2 text-sm w-full text-left ${
                      statusFilter === 'maintenance' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    }`}
                  >
                    Ремонт
                  </button>
                </div>
              </div>
            </div>
            
            <div className="relative inline-block text-left">
              <div>
                <button
                  type="button"
                  className="inline-flex justify-between items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  id="building-menu"
                  aria-expanded="true"
                  aria-haspopup="true"
                >
                  <Filter className="mr-2 h-4 w-4 text-gray-400" />
                  {buildingFilter === 'all' ? 'Все корпуса' : buildingFilter}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </button>
              </div>
              
              <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-10 hidden">
                <div className="py-1" role="none">
                  {buildings.map((building) => (
                    <button
                      key={building}
                      onClick={() => setBuildingFilter(building)}
                      className={`block px-4 py-2 text-sm w-full text-left ${
                        buildingFilter === building ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      }`}
                    >
                      {building === 'all' ? 'Все корпуса' : building}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Rooms Grid */}
      {filteredRooms.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-gray-500">Нет комнат, соответствующих выбранным фильтрам.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              onClick={() => openRoomModal(room)}
              className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 cursor-pointer"
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center">
                      <Home className="h-5 w-5 text-blue-700 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        Комната {room.number}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500">{room.building}, {room.floor} этаж</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(room.status)}`}>
                    {getStatusText(room.status)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-700">
                      {room.occupied}/{room.capacity} мест занято
                    </span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Проживающие:</h4>
                  {room.students.length > 0 ? (
                    <ul className="space-y-1">
                      {room.students.map((student) => (
                        <li key={student.id} className="text-sm text-gray-700">
                          {student.fullName}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Нет проживающих</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Room Detail Modal */}
      {isModalOpen && selectedRoom && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            
            <div className="relative bg-white rounded-lg max-w-2xl w-full mx-auto shadow-xl z-10">
              <div className="bg-white p-6 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Комната {selectedRoom.number}
                    </h2>
                    <p className="text-gray-500">{selectedRoom.building}, {selectedRoom.floor} этаж</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(selectedRoom.status)}`}>
                    {getStatusText(selectedRoom.status)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Информация о комнате</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-gray-600">Номер:</span>
                        <span className="font-medium text-gray-800">{selectedRoom.number}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Корпус:</span>
                        <span className="font-medium text-gray-800">{selectedRoom.building}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Этаж:</span>
                        <span className="font-medium text-gray-800">{selectedRoom.floor}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Вместимость:</span>
                        <span className="font-medium text-gray-800">{selectedRoom.capacity} мест</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Занято:</span>
                        <span className="font-medium text-gray-800">{selectedRoom.occupied} мест</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Свободно:</span>
                        <span className="font-medium text-gray-800">{selectedRoom.capacity - selectedRoom.occupied} мест</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Проживающие студенты</h3>
                    {selectedRoom.students.length > 0 ? (
                      <div className="space-y-3">
                        {selectedRoom.students.map((student) => (
                          <div key={student.id} className="bg-gray-50 p-3 rounded-md">
                            <p className="font-medium text-gray-800">{student.fullName}</p>
                            <p className="text-sm text-gray-600">{student.faculty}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">В этой комнате пока никто не проживает</p>
                    )}
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Действия</h3>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => handleChangeRoomStatus(selectedRoom.id, 'available')}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Доступна
                    </button>
                    
                    <button 
                      onClick={() => handleChangeRoomStatus(selectedRoom.id, 'maintenance')}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      На ремонт
                    </button>
                    
                    <button
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <User className="h-4 w-4 mr-1" />
                      Заселить студента
                    </button>
                  </div>
                </div>
                
                <div className="mt-5 flex justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Закрыть
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

export default RoomManagement;