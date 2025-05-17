import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { School } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Вход выполнен успешно');
    } catch (error) {
      toast.error('Ошибка входа. Проверьте данные и попробуйте снова.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left side - Login Form */}
      <div className="w-full lg:w-[40%] xl:w-[35%] bg-white flex flex-col justify-center px-6 sm:px-12">
        <div className="w-full max-w-md mx-auto">
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
            Добро пожаловать
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Электронная почта
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                  'Войти в систему'
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Нет аккаунта?{' '}
              <Link to="/register" className="text-blue-700 hover:text-blue-800 font-medium">
                Зарегистрироваться
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
              Добро пожаловать в систему управления общежитием ЧГУ
            </h2>
            <p className="text-xl text-blue-100">
              Удобное управление проживанием, заявками и коммуникация с администрацией
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;