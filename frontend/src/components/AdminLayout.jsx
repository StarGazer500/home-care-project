import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Home, Users, Calendar, LogOut, Menu, X, UserCog } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

function AdminLayout() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/admin', label: t('nav.dashboard'), icon: Home },
    { path: '/admin/contacts', label: t('nav.contacts'), icon: Users },
    { path: '/admin/appointments', label: t('nav.appointments'), icon: Calendar },
    { path: '/admin/users', label: t('nav.users'), icon: UserCog },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <Link to="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-white shadow border border-slate-200">
                  <img
                    src="/logo.jpeg"
                    alt="Bridge Hoito Oy Logo"
                    className="w-full h-full object-cover scale-110"
                  />
                </div>
                <div>
                  <h1 className="font-display text-lg font-bold" style={{color: '#1e3a5f'}}>
                    Bridge Hoito Admin
                  </h1>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-red-50 text-red-600'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* User Info, Language and Logout */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <LanguageSelector variant="compact" />
              </div>
              <div className="hidden md:block text-right">
                <div className="text-sm font-medium" style={{color: '#1e3a5f'}}>
                  {user?.name || user?.email}
                </div>
                <div className="text-xs text-slate-500 capitalize">
                  {user?.role || 'Admin'}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut size={18} />
                <span className="hidden md:inline">{t('nav.logout')}</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-red-50 text-red-600'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </Link>
              ))}
              <div className="pt-2 border-t border-slate-200 mt-2">
                <div className="px-4 py-2 text-sm">
                  <div className="font-medium" style={{color: '#1e3a5f'}}>
                    {user?.name || user?.email}
                  </div>
                  <div className="text-xs text-slate-500 capitalize">
                    {user?.role || 'Admin'}
                  </div>
                </div>
                <div className="px-4 py-2">
                  <LanguageSelector variant="compact" />
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
