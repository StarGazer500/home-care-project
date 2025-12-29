import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="text-9xl font-bold text-red-500 mb-4">404</div>
          <h1 className="text-4xl font-bold mb-4" style={{color: '#1e3a5f'}}>
            Page Not Found
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full hover:shadow-xl transition-all font-semibold"
          >
            <Home size={20} />
            <span>Go to Homepage</span>
          </Link>

          <div className="text-sm text-slate-500">
            <p className="mb-2">Looking for admin pages?</p>
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 text-red-500 hover:text-red-600 font-medium"
            >
              <ArrowLeft size={16} />
              <span>Go to Admin Login</span>
            </Link>
          </div>
        </div>

        <div className="mt-12 p-6 bg-white rounded-2xl shadow-sm">
          <h3 className="font-bold mb-3" style={{color: '#1e3a5f'}}>Common Links</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>
              <Link to="/" className="hover:text-red-500">Homepage</Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-red-500">Admin Login</Link>
            </li>
            <li>
              <Link to="/admin" className="hover:text-red-500">Admin Dashboard</Link> (requires login)
            </li>
            <li>
              <Link to="/admin/contacts" className="hover:text-red-500">Admin Contacts</Link> (requires login)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
