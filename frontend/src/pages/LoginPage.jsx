import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Lock, Mail, AlertCircle, Info } from 'lucide-react';
import LanguageSelector from '../components/LanguageSelector';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect message and path from navigation state
  const redirectMessage = location.state?.message;
  const redirectFrom = location.state?.from;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const userData = await login(username, password);

      // Redirect to where user came from, or default location based on role
      if (redirectFrom) {
        navigate(redirectFrom);
      } else if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard/appointments');
      }
    } catch (err) {
      setError(err.message || 'Invalid username or password');
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
        {/* Logo and Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden bg-white shadow-lg border-2 border-slate-200">
              <img
                src="/logo.jpeg"
                alt="Bridge Hoito Oy Logo"
                className="w-full h-full object-cover scale-110"
              />
            </div>
          </div>
          <h2 className="font-display text-3xl font-bold text-navy-900 mb-2" style={{color: '#1e3a5f'}}>
            {t('auth.welcomeBack')}
          </h2>
          <p className="text-slate-600">
            {t('auth.loginSubtitle')}
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Show redirect message if coming from another page */}
            {redirectMessage && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 flex items-start space-x-3">
                <Info className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
                <div className="text-sm text-blue-800">{redirectMessage}</div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-start space-x-3">
                <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                <div className="text-sm text-red-800">{error}</div>
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-bold mb-2" style={{color: '#1e3a5f'}}>
                {t('auth.email')} / {t('auth.username')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="text-slate-400" size={20} />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-slate-200 bg-white focus:border-red-500 focus:outline-none transition-colors"
                  required
                  autoComplete="username"
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
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-slate-200 bg-white focus:border-red-500 focus:outline-none transition-colors"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full hover:shadow-xl transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t('common.loading') : t('auth.signIn')}
            </button>
          </form>
        </div>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-sm text-slate-600">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="text-red-500 font-semibold hover:text-red-600">
              {t('auth.signUp')}
            </Link>
          </p>
        </div>

        {/* Back to Home Link */}
        <div className="text-center">
          <Link
            to="/"
            className="text-sm text-slate-600 hover:text-red-500 transition-colors font-medium"
          >
            ← {t('nav.home')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
