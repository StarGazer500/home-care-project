import { useState, useEffect } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { Calendar, Clock, User, Mail, Phone, FileText, CheckCircle, MapPin, AlertCircle, X } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import MapLocationPicker from '../components/MapLocationPicker';
import LanguageSelector from '../components/LanguageSelector';

function AppointmentPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { t } = useLanguage();

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

  const getServiceTypes = () => [
    { value: 'Home Care', label: t('appointments.homeCare') },
    { value: 'Medical Consultation', label: t('appointments.medicalConsultation') },
    { value: 'Physical Therapy', label: t('appointments.physicalTherapy') },
    { value: 'Nursing Care', label: t('appointments.nursingCare') },
    { value: 'Personal Care', label: t('appointments.personalCare') },
    { value: 'Companionship', label: t('appointments.companionship') },
    { value: 'Personal Assistant', label: t('appointments.personalAssistant') },
    { value: 'Other', label: t('appointments.other') },
  ];

  const serviceTypes = getServiceTypes();

  // Generate time slots from 8 AM to 8 PM in 30-minute intervals
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const period = hour >= 12 ? 'PM' : 'AM';
        const time12 = `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
        slots.push({ value: time24, label: time12 });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

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
          <p className="mt-4 text-slate-600">{t('appointments.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4">
        <LanguageSelector variant="compact" />
      </div>
      <div className="max-w-3xl mx-auto">

         
         <div className="flex items-center justify-center space-x-3 mb-6">
          <Link to="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
            <div className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden bg-white shadow-lg border-2 border-slate-200">
              <img
                src="/logo.jpeg"
                alt="Bridge Hoito Oy Logo"
                className="w-full h-full object-cover scale-110"
              />
            </div>
            </Link>
          </div>
          
    
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#1e3a5f' }}>
            {t('appointments.title')}
          </h1>
          <p className="text-slate-600 text-lg">
            {t('appointments.subtitle')}
          </p>
        </div>

        {/* Login prompt for unauthenticated users */}
        {!user && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6 flex items-start space-x-3">
            <AlertCircle className="text-blue-500 flex-shrink-0 mt-0.5" size={24} />
            <div className="flex-1">
              <h3 className="font-bold text-blue-900 mb-2">{t('appointments.loginRequired')}</h3>
              <p className="text-sm text-blue-800 mb-4">
                {t('appointments.loginRequiredDesc')}
              </p>
              <button
                onClick={() => navigate('/login', { state: { from: '/appointments', message: t('appointments.loginRequiredDesc') } })}
                className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors font-semibold text-sm"
              >
                {t('appointments.goToLogin')}
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
                  {t('appointments.fullName')} *
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
                  {t('appointments.email')} *
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
                  {t('appointments.phone')} *
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
                  {t('appointments.serviceType')} *
                </label>
                <select
                  id="service_type"
                  name="service_type"
                  value={formData.service_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 bg-white focus:border-red-500 focus:outline-none transition-colors"
                  required
                >
                  <option value="">{t('appointments.selectService')}</option>
                  {serviceTypes.map((service) => (
                    <option key={service.value} value={service.value}>
                      {service.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="appointment_date" className="block text-sm font-bold mb-2" style={{ color: '#1e3a5f' }}>
                  {t('appointments.preferredDate')} *
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
                  {t('appointments.preferredTime')} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Clock className="text-slate-400" size={20} />
                  </div>
                  <select
                    id="appointment_time"
                    name="appointment_time"
                    value={formData.appointment_time}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-slate-200 bg-white focus:border-red-500 focus:outline-none transition-colors appearance-none cursor-pointer"
                    required
                  >
                    <option value="">{t('appointments.selectTime')}</option>
                    {timeSlots.map((slot) => (
                      <option key={slot.value} value={slot.value}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {t('appointments.availableTimes')}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: '#1e3a5f' }}>
                {t('appointments.serviceLocation')} *
              </label>
              <p className="text-xs text-slate-500 mb-3">
                {t('appointments.clickMapLocation')}
              </p>
              <MapLocationPicker
                location={formData.location}
                onChange={(location) => setFormData(prev => ({ ...prev, location }))}
                height="350px"
              />
            </div>

            <div>
              <label htmlFor="location_address" className="block text-sm font-bold mb-2" style={{ color: '#1e3a5f' }}>
                {t('appointments.addressOptional')}
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
                  placeholder={t('appointments.addressPlaceholder')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-bold mb-2" style={{ color: '#1e3a5f' }}>
                {t('appointments.additionalNotes')}
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
                  placeholder={t('appointments.notesPlaceholder')}
                ></textarea>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-500 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t('appointments.booking') : t('appointments.bookNew')}
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
                {t('appointments.appointmentBooked')}
              </h2>

              <p className="text-slate-600 text-lg mb-6">
                {t('appointments.appointmentSuccess')}
              </p>

              <div className="bg-slate-50 rounded-2xl p-4 mb-6">
                <p className="text-sm text-slate-700">
                  <strong>{t('appointments.whatsNext')}</strong>
                </p>
                <ul className="text-sm text-slate-600 mt-2 space-y-1 text-left">
                  <li>• {t('appointments.confirmationEmail')}</li>
                  <li>• {t('appointments.teamReview')}</li>
                  <li>• {t('appointments.contactWithin')}</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-300 transition-colors"
                >
                  {t('appointments.bookAnother')}
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
                  {user ? t('appointments.viewMyAppointments') : t('appointments.goToHome')}
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
