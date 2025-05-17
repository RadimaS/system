import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Loader } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

const RequestForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    room: '',
    isUrgent: false
  });
  const [classifiedCategory, setClassifiedCategory] = useState<string | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: checked }));
  };

  const classifyRequest = async () => {
    if (!form.description) {
      toast.error('Введите описание проблемы для классификации');
      return;
    }

    setIsClassifying(true);
    try {
      const result = await api.post('/requests/classify', { text: form.description });
      setClassifiedCategory(result.category);
      toast.success(`Категория: ${result.category}`);
    } catch (error) {
      console.error('Error classifying request:', error);
      toast.error('Не удалось классифицировать заявку');
    } finally {
      setIsClassifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title || !form.description) {
      toast.error('Заполните все обязательные поля');
      return;
    }
    
    setLoading(true);
    
    try {
      await api.post('/requests', {
        ...form,
        category: classifiedCategory,
        status: 'pending'
      });
      
      toast.success('Заявка успешно создана');
      navigate('/student/requests');
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('Ошибка при создании заявки');
    } finally {
      setLoading(false);
    }
  };

  // For demo purposes, use these sample categories
  const categories = [
    'Ремонт',
    'Сантехника',
    'Электрика',
    'Мебель',
    'Переселение',
    'Бытовые проблемы',
    'Другое'
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-blue-700 p-4 sm:p-6">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-white mr-3" />
            <h1 className="text-xl font-bold text-white">Создание новой заявки</h1>
          </div>
          <p className="text-blue-100 mt-1">
            Опишите вашу проблему, и мы постараемся решить её как можно скорее
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Тема заявки*
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Кратко опишите проблему"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Описание проблемы*
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Подробно опишите вашу проблему или запрос..."
              required
            ></textarea>
            
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={classifyRequest}
                disabled={isClassifying}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isClassifying ? (
                  <>
                    <Loader className="animate-spin h-4 w-4 mr-2" />
                    Классификация...
                  </>
                ) : (
                  'Определить категорию'
                )}
              </button>
            </div>
            
            {classifiedCategory && (
              <div className="mt-2 flex items-center">
                <span className="text-sm text-gray-500 mr-2">Определенная категория:</span>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {classifiedCategory}
                </span>
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="room" className="block text-sm font-medium text-gray-700 mb-1">
              Номер комнаты (если отличается от вашей)
            </label>
            <input
              type="text"
              id="room"
              name="room"
              value={form.room}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Например: 301"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isUrgent"
              name="isUrgent"
              checked={form.isUrgent}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isUrgent" className="ml-2 block text-sm text-gray-700">
              Отметить как срочную заявку
            </label>
          </div>
          
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/student/requests')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 flex items-center"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin h-4 w-4 mr-2" />
                  Отправка...
                </>
              ) : (
                'Отправить заявку'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestForm;