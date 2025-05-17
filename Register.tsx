import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { School } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    faculty: '',
    course: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Пароли не совпадают');
    }
    
    setLoading(true);
    
    try {
      await register({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        faculty: formData.faculty,
        course: formData.course,
        phoneNumber: formData.phoneNumber
      });
      
      toast.success('Регистрация успешна');
      navigate('/login');
    } catch (error) {
      toast.error('Ошибка при регистрации');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const faculties = [
    "Биолого-химический факультет",
    "Исторический факультет",
    "Факультет географии и геоэкологии",
    "Факультет государственного управления",
    "Факультет информационных технологий",
    "Факультет математики и компьютерных технологий",
    "Факультет физики и ИКТ",
    "Филологический факультет",
    "Юридический факультет",
    "Медицинский институт",
    "Институт экономики и финансов"
  ];

  return (
    <div className="min-h-screen w-full flex">
      {/* Left side - Registration Form */}
      <div className="w-full lg:w-[40%] xl:w-[35%] bg-white flex flex-col justify-center px-6 sm:px-12">
        <div className="w-full max-w-md mx-auto py-8">
          <div className="flex items-center gap-3 mb-8">
            <School className="h-10 w-10 text-blue-700" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Общежитие ЧГУ
              </h1>
              <p className="text-gray-600">
                Система управления общежитием
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Регистрация
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                ФИО полностью
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Электронная почта
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="faculty" className="block text-sm font-medium text-gray-700 mb-1">
                  Факультет
                </label>
                <select
                  id="faculty"
                  name="faculty"
                  value={formData.faculty}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Выберите факультет</option>
                  {faculties.map((faculty, index) => (
                    <option key={index} value={faculty}>{faculty}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
                  Курс
                </label>
                <select
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Выберите курс</option>
                  <option value="1">1 курс</option>
                  <option value="2">2 курс</option>
                  <option value="3">3 курс</option>
                  <option value="4">4 курс</option>
                  <option value="5">5 курс</option>
                  <option value="6">6 курс</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Номер телефона
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+7 (___) ___-__-__"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Подтверждение пароля
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2.5 px-4 rounded-lg transition duration-200 flex items-center justify-center disabled:opacity-70"
              >
                {loading ? (
                  <span className="animate-pulse">Загрузка...</span>
                ) : (
                  'Зарегистрироваться'
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Уже есть аккаунт?{' '}
              <Link to="/login" className="text-blue-700 hover:text-blue-800 font-medium">
                Войти
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-[60%] xl:w-[65%] bg-blue-50 relative">
        <img 
          src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
          alt="Dormitory rooms"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-900/40 flex items-center justify-center p-12">
          <div className="max-w-2xl text-white">
            <h2 className="text-4xl font-bold mb-4">
              Регистрация в системе управления общежитием ЧГУ
            </h2>
            <p className="text-xl text-blue-100">
              Создайте аккаунт для доступа к удобному управлению проживанием и подаче заявок
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;