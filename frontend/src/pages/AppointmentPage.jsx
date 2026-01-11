import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Mail, Phone, FileText, CheckCircle, MapPin, AlertCircle, X } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import MapLocationPicker from '../components/MapLocationPicker';

function AppointmentPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    appointment_date: '',
    appointment_time: '',
    service_type: '',
    notes: '',
    location: null,
    location_address: '',
  });

  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Pre-fill form data if user is logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [user]);

  const serviceTypes = [
    'Home Care',
    'Medical Consultation',
    'Physical Therapy',
    'Nursing Care',
    'Personal Care',
    'Companionship',
    'Other',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: '', message: '' });

    try {
      await api.appointments.create(formData);
      // Show success modal instead of inline message
      setShowSuccessModal(true);
      setFormData({
        full_name: user?.full_name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        appointment_date: '',
        appointment_time: '',
        service_type: '',
        notes: '',
        location: null,
        location_address: '',
      });
    } catch (error) {
      setFormStatus({
        type: 'error',
        message: error.message || 'Failed to book appointment. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#1e3a5f' }}>
            Book an Appointment
          </h1>
          <p className="text-slate-600 text-lg">
            Schedule your home care service at your convenience
          </p>
        </div>

        {/* Login prompt for unauthenticated users */}
        {!user && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6 flex items-start space-x-3">
            <AlertCircle className="text-blue-500 flex-shrink-0 mt-0.5" size={24} />
            <div className="flex-1">
              <h3 className="font-bold text-blue-900 mb-2">Login Required</h3>
              <p className="text-sm text-blue-800 mb-4">
                Please log in to book an appointment. This allows us to track your appointments and provide better service.
              </p>
              <button
                onClick={() => navigate('/login', { state: { from: '/appointments', message: 'Please log in to book an appointment' } })}
                className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors font-semibold text-sm"
              >
                Go to Login
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 relative">
          {formStatus.message && (
            <div
              className={`mb-6 p-4 rounded-2xl flex items-start space-x-3 ${
                formStatus.type === 'success'
                  ? 'bg-green-50 border-2 border-green-200'
                  : 'bg-red-50 border-2 border-red-200'
              }`}
            >
              {formStatus.type === 'success' && (
                <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
              )}
              <p
                className={`text-sm ${
                  formStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {formStatus.message}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!user && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-3xl z-10 cursor-not-allowed"></div>
            )}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="full_name" className="block text-sm font-bold mb-2" style={{ color: '#1e3a5f' }}>
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="text-slate-400" size={20} />
                  </div>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-slate-200 bg-white focus:border-red-500 focus:outline-none transition-colors"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold mb-2" style={{ color: '#1e3a5f' }}>
                  Email *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="text-slate-400" size={20} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-slate-200 bg-white focus:border-red-500 focus:outline-none transition-colors"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-bold mb-2" style={{ color: '#1e3a5f' }}>
                  Phone *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="text-slate-400" size={20} />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-slate-200 bg-white focus:border-red-500 focus:outline-none transition-colors"
                    placeholder="+358 12 345 6789"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="service_type" className="block text-sm font-bold mb-2" style={{ color: '#1e3a5f' }}>
                  Service Type *
                </label>
                <select
                  id="service_type"
                  name="service_type"
                  value={formData.service_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 bg-white focus:border-red-500 focus:outline-none transition-colors"
                  required
                >
                  <option value="">Select a service</option>
                  {serviceTypes.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="appointment_date" className="block text-sm font-bold mb-2" style={{ color: '#1e3a5f' }}>
                  Preferred Date *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar className="text-slate-400" size={20} />
                  </div>
                  <input
                    type="date"
                    id="appointment_date"
                    name="appointment_date"
                    value={formData.appointment_date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-slate-200 bg-white focus:border-red-500 focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="appointment_time" className="block text-sm font-bold mb-2" style={{ color: '#1e3a5f' }}>
                  Preferred Time *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Clock className="text-slate-400" size={20} />
                  </div>
                  <input
                    type="time"
                    id="appointment_time"
                    name="appointment_time"
                    value={formData.appointment_time}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-slate-200 bg-white focus:border-red-500 focus:outline-none transition-colors"
                    required
                    step="300"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Use 24-hour format (e.g., 14:30 for 2:30 PM)
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: '#1e3a5f' }}>
                Service Location *
              </label>
              <p className="text-xs text-slate-500 mb-3">
                Click on the map to select where you need the service
              </p>
              <MapLocationPicker
                location={formData.location}
                onChange={(location) => setFormData(prev => ({ ...prev, location }))}
                height="350px"
              />
            </div>

            <div>
              <label htmlFor="location_address" className="block text-sm font-bold mb-2" style={{ color: '#1e3a5f' }}>
                Address (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin className="text-slate-400" size={20} />
                </div>
                <input
                  type="text"
                  id="location_address"
                  name="location_address"
                  value={formData.location_address}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-slate-200 bg-white focus:border-red-500 focus:outline-none transition-colors"
                  placeholder="Street address, building, unit number, etc."
                />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-bold mb-2" style={{ color: '#1e3a5f' }}>
                Additional Notes
              </label>
              <div className="relative">
                <div className="absolute top-3 left-0 pl-4 pointer-events-none">
                  <FileText className="text-slate-400" size={20} />
                </div>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="4"
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-slate-200 bg-white focus:border-red-500 focus:outline-none transition-colors resize-none"
                  placeholder="Any special requirements or additional information..."
                ></textarea>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-500 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Booking...' : 'Book Appointment'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-fadeInScale" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={24} className="text-slate-600" />
            </button>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-green-500" size={48} />
              </div>

              <h2 className="text-3xl font-bold mb-4" style={{ color: '#1e3a5f' }}>
                Appointment Booked!
              </h2>

              <p className="text-slate-600 text-lg mb-6">
                Your appointment has been successfully scheduled. We will contact you soon to confirm the details.
              </p>

              <div className="bg-slate-50 rounded-2xl p-4 mb-6">
                <p className="text-sm text-slate-700">
                  <strong>What's next?</strong>
                </p>
                <ul className="text-sm text-slate-600 mt-2 space-y-1 text-left">
                  <li>• You'll receive a confirmation email shortly</li>
                  <li>• Our team will review your request</li>
                  <li>• We'll contact you within 24 hours</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-300 transition-colors"
                >
                  Book Another
                </button>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    setTimeout(() => {
                      navigate(user ? '/dashboard/appointments' : '/');
                    }, 100);
                  }}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
                >
                  {user ? 'View My Appointments' : 'Go to Home'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppointmentPage;
