import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import { Lock, Mail, User, Phone, AlertCircle } from 'lucide-react';
import LanguageSelector from '../components/LanguageSelector';

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await api.auth.register(formData);
      // Auto login after successful registration
      await login(formData.username, formData.password);
      navigate('/dashboard/appointments');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Language Selector */}
      <div className="absolute top-4 right-4">
        <LanguageSelector variant="compact" />
      </div>

      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden mx-auto mb-4 bg-white shadow-lg border-2 border-slate-200">
              <img
                src="/logo.jpeg"
                alt="Bridge Hoito Oy Logo"
                className="w-full h-full object-cover scale-110"
              />
            </div>
            <h2 className="text-3xl font-bold" style={{color: '#1e3a5f'}}>
              {t('auth.createAccount')}
            </h2>
            <p className="text-slate-600 mt-2">
              {t('auth.registerSubtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-start space-x-3">
                <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                <div className="text-sm text-red-800">{error}</div>
              </div>
            )}

            <div>
              <label htmlFor="full_name" className="block text-sm font-bold mb-2" style={{color: '#1e3a5f'}}>
                {t('auth.fullName')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="text-slate-400" size={20} />
                </div>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-slate-200 bg-white focus:border-red-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-bold mb-2" style={{color: '#1e3a5f'}}>
                {t('auth.username')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="text-slate-400" size={20} />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-slate-200 bg-white focus:border-red-500 focus:outline-none transition-colors"
                  required
                  minLength={3}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-bold mb-2" style={{color: '#1e3a5f'}}>
                {t('auth.email')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="text-slate-400" size={20} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-slate-200 bg-white focus:border-red-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-bold mb-2" style={{color: '#1e3a5f'}}>
                {t('auth.phone')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="text-slate-400" size={20} />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-slate-200 bg-white focus:border-red-500 focus:outline-none transition-colors"
                  placeholder="+358 12 345 6789"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold mb-2" style={{color: '#1e3a5f'}}>
                {t('auth.password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="text-slate-400" size={20} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-slate-200 bg-white focus:border-red-500 focus:outline-none transition-colors"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t('common.loading') : t('auth.createAccount')}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            {t('auth.haveAccount')}{' '}
            <Link to="/login" className="text-red-500 font-semibold hover:text-red-600">
              {t('auth.signIn')}
            </Link>
          </div>

          <Link
            to="/"
            className="block mt-6 text-center text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            ← {t('nav.home')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
