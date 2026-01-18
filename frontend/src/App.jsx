import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AppointmentPage from './pages/AppointmentPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminLayout from './components/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import ContactsPage from './pages/admin/ContactsPage';
import ContactDetailPage from './pages/admin/ContactDetailPage';
import AppointmentsPage from './pages/admin/AppointmentsPage';
import AppointmentDetailPage from './pages/admin/AppointmentDetailPage';
import UsersPage from './pages/admin/UsersPage';
import FeedbacksPage from './pages/admin/FeedbacksPage';
// import AppointmentsMapPage from './pages/admin/AppointmentsMapPage';
import ClientLayout from './components/ClientLayout';
import MyAppointmentsPage from './pages/client/MyAppointmentsPage';

function App() {
  return (
    <Router>
      <LanguageProvider>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/appointments" element={<AppointmentPage />} />

          {/* Protected Client Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requireAdmin={false}>
                <ClientLayout />
              </ProtectedRoute>
            }
          >
            <Route path="appointments" element={<MyAppointmentsPage />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="contacts" element={<ContactsPage />} />
            <Route path="contacts/:id" element={<ContactDetailPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="appointments/:id" element={<AppointmentDetailPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="feedbacks" element={<FeedbacksPage />} />
            {/* <Route path="map" element={<AppointmentsMapPage />} /> */}
          </Route>

          {/* 404 Catch-all Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
