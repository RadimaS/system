import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/student/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import RequestForm from './pages/student/RequestForm';
import RequestList from './pages/student/RequestList';
import AdminRequestList from './pages/admin/RequestList';
import RoomManagement from './pages/admin/RoomManagement';
import StudentManagement from './pages/admin/StudentManagement';
import ReportGeneration from './pages/admin/ReportGeneration';
import Layout from './components/layout/Layout';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Student Routes */}
          <Route path="/student" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<StudentDashboard />} />
            <Route path="requests/new" element={<RequestForm />} />
            <Route path="requests" element={<RequestList />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><Layout isAdmin={true} /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="requests" element={<AdminRequestList />} />
            <Route path="rooms" element={<RoomManagement />} />
            <Route path="students" element={<StudentManagement />} />
            <Route path="reports" element={<ReportGeneration />} />
          </Route>
          
          <Route path="*" element={<Login />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;