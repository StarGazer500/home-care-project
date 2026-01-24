import { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Loader, Plus, User, Mail, Phone, FileText, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import MapLocationPicker from '../../components/MapLocationPicker';
import { useLanguage } from '../../contexts/LanguageContext'

function MyAppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10; // Adjust based on screen size
  const [bookingForm, setBookingForm] = useState({
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

  const { t } = useLanguage();

  useEffect(() => {
    fetchAppointments();
  }, [currentPage]);

  useEffect(() => {
    if (user) {
      setBookingForm((prev) => ({
        ...prev,
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [user]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const skip = (currentPage - 1) * itemsPerPage;
      const data = await api.appointments.getMyAppointments(skip, itemsPerPage);
      setAppointments(data.items || []);
      setTotalCount(data.total || 0);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.appointments.create(bookingForm);
      setShowBookingModal(false);
      setBookingForm({
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
      setCurrentPage(1);
      fetchAppointments();
    } catch (error) {
      console.error('Failed to book appointment:', error);
      alert(error.message || 'Failed to book appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getFilteredAppointments = () => {
    if (filter === 'all') return appointments;
    return appointments.filter((appointment) => appointment.status === filter);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'cancelled':
        return <XCircle className="text-red-500" size={20} />;
      case 'completed':
        return <CheckCircle className="text-blue-500" size={20} />;
      default:
        return <AlertCircle className="text-yellow-500" size={20} />;
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      confirmed: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
      completed: 'bg-blue-100 text-blue-800 border-blue-300',
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center space-x-1 ${
          statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-300'
        }`}
      >
        {getStatusIcon(status)}
        {t(`appointments.${status}`)}
        {/* <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span> */}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getServiceName = (serviceName)=>{
    if (serviceName==='Home Care'){
      return 'homeCare'

    }else if (serviceName==='Medical Consultation'){
       return 'medicalConsultation'
      
    }else if (serviceName==='Physical Therapy'){
      return 'physicalTherapy'
      
    }else if (serviceName==='Nursing Care'){
      return 'nursingCare'
      
    }else if (serviceName==='Personal Care'){
      return 'personalCare'
      
    }else if (serviceName==='Companionship'){
      return 'companionship'
      
    }else if (serviceName==='Personal Assistant'){
      return 'personalAssistant'
      
    }



    else if (serviceName==='Other'){
       return 'other'
    }
  }

  // useEffect(()=>{
  //   console.log(getServiceName())
  // })

  const formatTime = (timeString) => {
    return timeString.slice(0, 5);
  };

  const filteredAppointments = getFilteredAppointments();
  const upcomingCount = appointments.filter((a) => a.status === 'confirmed').length;
  const pendingCount = appointments.filter((a) => a.status === 'pending').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-red-500" size={48} />
      </div>
    );
  }

  const serviceTypes = [
    'Home Care',
    'Medical Consultation',
    'Physical Therapy',
    'Nursing Care',
    'Personal Care',
    'Companionship',
    'Personal Assistant',
    'Other',
    
  ];

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#1e3a5f' }}>
            {t('appointments.myAppointments')}
            {/* My Appointments */}
          </h1>
          <p className="text-slate-600 mt-1">
            {t('appointments.trackManage')}
            {/* Track and manage your healthcare appointments */}
          </p>
        </div>
        <button
          onClick={() => setShowBookingModal(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
        >
          <Plus size={20} />
           {t('appointments.bookNew')}
          {/* <span>Book Appointment</span> */}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">{t('appointments.pending')}</p>
              <p className="text-3xl font-bold text-slate-900">{pendingCount}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertCircle className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">{t('appointments.confirmed')}</p>
              <p className="text-3xl font-bold text-slate-900">{upcomingCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-slate-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">{t('admin.totalAppointments')}</p>
              <p className="text-3xl font-bold text-slate-900">{appointments.length}</p>
            </div>
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
              <Calendar className="text-slate-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl shadow-sm p-2">
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'confirmed', 'cancelled', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                filter === status
                  ? 'bg-red-500 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t(`appointments.${status}`)}
              {/* {status.charAt(0).toUpperCase() + status.slice(1)} */}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <Calendar className="mx-auto text-slate-300 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-slate-700 mb-2">
            {/* No appointments found */}
            {t('appointments.noAppointments')}
          </h3>
          <p className="text-slate-500 mb-6">
            {filter === 'all'
              ? "You haven't booked any appointments yet"
              : `No ${filter} appointments`}
          </p>
          <a
            href="/appointments"
            className="inline-block px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
          >
            {t('appointments.bookNew')}
            {/* Book an Appointment */}
          </a>
        </div>
      ) : (
        <>
          <div className="grid gap-6">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          {/* {appointment.service_type} */}
                          {t(`appointments.${getServiceName(appointment.service_type)}`)}
                        </h3>
                        <p className="text-sm text-slate-600">
                          Appointment ID: #{appointment.id}
                        </p>
                      </div>
                      {getStatusBadge(appointment.status)}
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <Calendar className="text-red-500" size={20} />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Date</p>
                          <p className="text-sm font-medium text-slate-900">
                            {formatDate(appointment.appointment_date)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Clock className="text-blue-500" size={20} />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Time</p>
                          <p className="text-sm font-medium text-slate-900">
                            {formatTime(appointment.appointment_time)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="pt-3 border-t border-slate-200">
                        <p className="text-xs text-slate-500 mb-1">Notes:</p>
                        <p className="text-sm text-slate-700">{appointment.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalCount > itemsPerPage && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-slate-600">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} appointments
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 border-2 border-slate-200 hover:border-red-500 hover:bg-red-50 disabled:hover:border-slate-200 disabled:hover:bg-transparent"
                  >
                    <ChevronLeft size={20} />
                    <span className="hidden sm:inline">{t('appointments.previous')}</span>
                  </button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.ceil(totalCount / itemsPerPage) }, (_, i) => i + 1)
                      .filter(page => {
                        // Show first page, last page, current page, and 2 pages around current
                        const totalPages = Math.ceil(totalCount / itemsPerPage);
                        return page === 1 ||
                               page === totalPages ||
                               (page >= currentPage - 1 && page <= currentPage + 1);
                      })
                      .map((page, index, array) => (
                        <div key={page} className="flex items-center">
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span className="px-2 text-slate-400">...</span>
                          )}
                          <button
                            onClick={() => handlePageChange(page)}
                            className={`w-10 h-10 rounded-xl font-medium transition-colors ${
                              currentPage === page
                                ? 'bg-red-500 text-white'
                                : 'text-slate-600 hover:bg-slate-100 border-2 border-transparent hover:border-slate-200'
                            }`}
                          >
                            {page}
                          </button>
                        </div>
                      ))
                    }
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= Math.ceil(totalCount / itemsPerPage)}
                    className="px-4 py-2 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 border-2 border-slate-200 hover:border-red-500 hover:bg-red-50 disabled:hover:border-slate-200 disabled:hover:bg-transparent"
                  >
                    <span className="hidden sm:inline">{t('appointments.next')}</span>
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 rounded-t-3xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold" style={{ color: '#1e3a5f' }}>
                  Book New Appointment
                </h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <XCircle size={24} className="text-slate-600" />
                </button>
              </div>
            </div>

            <form onSubmit={handleBookingSubmit} className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#1e3a5f' }}>
                    Full Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="text-slate-400" size={20} />
                    </div>
                    <input
                      type="text"
                      name="full_name"
                      value={bookingForm.full_name}
                      onChange={handleBookingChange}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-red-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#1e3a5f' }}>
                    Email *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="text-slate-400" size={20} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={bookingForm.email}
                      onChange={handleBookingChange}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-red-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#1e3a5f' }}>
                    Phone *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="text-slate-400" size={20} />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={bookingForm.phone}
                      onChange={handleBookingChange}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-red-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#1e3a5f' }}>
                    Service Type *
                  </label>
                  <select
                    name="service_type"
                    value={bookingForm.service_type}
                    onChange={handleBookingChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-red-500 focus:outline-none"
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
                  <label className="block text-sm font-bold mb-2" style={{ color: '#1e3a5f' }}>
                    Preferred Date *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Calendar className="text-slate-400" size={20} />
                    </div>
                    <input
                      type="date"
                      name="appointment_date"
                      value={bookingForm.appointment_date}
                      onChange={handleBookingChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-red-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#1e3a5f' }}>
                    Preferred Time *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Clock className="text-slate-400" size={20} />
                    </div>
                    <select
                      name="appointment_time"
                      value={bookingForm.appointment_time}
                      onChange={handleBookingChange}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-red-500 focus:outline-none appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Select a time</option>
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
                    Available times: 8:00 AM - 8:00 PM
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#1e3a5f' }}>
                  Service Location *
                </label>
                <p className="text-xs text-slate-500 mb-3">
                  Click on the map to select the appointment location
                </p>
                <MapLocationPicker
                  location={bookingForm.location}
                  onChange={(location) => setBookingForm(prev => ({ ...prev, location }))}
                  height="350px"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#1e3a5f' }}>
                  Address (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className="text-slate-400" size={20} />
                  </div>
                  <input
                    type="text"
                    name="location_address"
                    value={bookingForm.location_address}
                    onChange={handleBookingChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-red-500 focus:outline-none"
                    placeholder="Street address, building, unit number, etc."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#1e3a5f' }}>
                  Additional Notes
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-0 pl-4 pointer-events-none">
                    <FileText className="text-slate-400" size={20} />
                  </div>
                  <textarea
                    name="notes"
                    value={bookingForm.notes}
                    onChange={handleBookingChange}
                    rows="4"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-red-500 focus:outline-none resize-none"
                    placeholder="Any special requirements or additional information..."
                  ></textarea>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Booking...' : 'Book Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyAppointmentsPage;
