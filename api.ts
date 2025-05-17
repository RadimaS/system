import toast from 'react-hot-toast';

// Base API URL - would be replaced with your actual API
const BASE_URL = 'http://localhost:3000/api';

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  getToken() {
    return this.token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${BASE_URL}${endpoint}`;
    
    // Set default headers
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token ? { 'Authorization': `Bearer ${this.token}` } : {}),
      ...(options.headers || {})
    };
    
    try {
      // Simulate API delay for demo purposes
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock API responses for demo purposes
      // In a real app, this would be replaced with actual fetch calls
      return this.mockResponse(endpoint, options);
      
      /* Real implementation would be:
      const response = await fetch(url, {
        ...options,
        headers
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.status}`);
      }
      
      // Handle empty responses
      if (response.status === 204) {
        return null;
      }
      
      return await response.json();
      */
    } catch (error) {
      console.error('API request failed:', error);
      // Rethrow the error for the caller to handle
      throw error;
    }
  }

  // Mock API responses for demonstration purposes
  private mockResponse(endpoint: string, options: RequestInit) {
    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body as string) : {};
    
    // Auth endpoints
    if (endpoint === '/auth/login') {
      if (body.email === 'admin@chgu.ru' && body.password === 'admin123') {
        return {
          token: 'mock-admin-token',
          user: {
            id: 'admin-id',
            email: body.email,
            role: 'admin',
            fullName: 'Администратор ЧГУ'
          }
        };
      } else if (body.email.includes('@') && body.password) {
        return {
          token: 'mock-student-token',
          user: {
            id: 'student-id',
            email: body.email,
            role: 'student',
            fullName: 'Студент ЧГУ',
            faculty: 'Факультет информационных технологий',
            course: '3',
            roomId: '303'
          }
        };
      } else {
        throw new Error('Неверные учетные данные');
      }
    }
    
    if (endpoint === '/auth/register') {
      // Simulate registration success
      return { success: true, message: 'Регистрация успешна' };
    }
    
    if (endpoint === '/auth/me') {
      // Check token to determine user type
      if (this.token === 'mock-admin-token') {
        return {
          id: 'admin-id',
          email: 'admin@chgu.ru',
          role: 'admin',
          fullName: 'Администратор ЧГУ'
        };
      } else {
        return {
          id: 'student-id',
          email: 'student@chgu.ru',
          role: 'student',
          fullName: 'Студент ЧГУ',
          faculty: 'Факультет информационных технологий',
          course: '3',
          roomId: '303'
        };
      }
    }
    
    // Request classification with OpenAI
    if (endpoint === '/requests/classify') {
      const text = body.text.toLowerCase();
      let category = 'Другое';
      
      // Simple keyword-based classification (in real app would use OpenAI)
      if (text.includes('кран') || text.includes('вода') || text.includes('течет') || text.includes('туалет') || text.includes('ванн')) {
        category = 'Сантехника';
      } else if (text.includes('свет') || text.includes('лампочк') || text.includes('розетк') || text.includes('электричеств')) {
        category = 'Электрика';
      } else if (text.includes('стол') || text.includes('стул') || text.includes('кровать') || text.includes('шкаф')) {
        category = 'Мебель';
      } else if (text.includes('переселени') || text.includes('перевод') || text.includes('другую комнату') || text.includes('сменить комнату')) {
        category = 'Переселение';
      } else if (text.includes('ремонт') || text.includes('стена') || text.includes('потолок') || text.includes('пол')) {
        category = 'Ремонт';
      } else if (text.includes('шум') || text.includes('мусор') || text.includes('уборк') || text.includes('сосед')) {
        category = 'Бытовые проблемы';
      }
      
      return { category };
    }
    
    // Student request submission
    if (endpoint === '/requests' && method === 'POST') {
      return {
        id: Math.random().toString(36).substring(7),
        ...body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
    
    // These endpoints would return actual data in a real application
    return { success: true };
  }

  async get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiService();