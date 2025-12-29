import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Mail, Phone, FileText, Save, X, MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { api } from '../../services/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function AppointmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    appointment_date: '',
    appointment_time: '',
    service_type: '',
    notes: '',
    status: '',
  });

  const serviceTypes = [
    'Home Care',
    'Medical Consultation',
    'Physical Therapy',
    'Nursing Care',
    'Personal Care',
    'Companionship',
    'Other',
  ];

  const statusOptions = ['pending', 'confirmed', 'cancelled', 'completed'];

  useEffect(() => {
    fetchAppointment();
  }, [id]);

  const fetchAppointment = async () => {
    try {
      const data = await api.appointments.getById(id);
      setAppointment(data);
      setFormData({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        appointment_date: data.appointment_date,
        appointment_time: data.appointment_time,
        service_type: data.service_type,
        notes: data.notes || '',
        status: data.status,
      });
    } catch (error) {
      console.error('Failed to fetch appointment:', error);
      alert('Failed to load appointment details');
      navigate('/admin/appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.appointments.update(id, formData);
      await fetchAppointment();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update appointment:', error);
      alert('Failed to update appointment');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: appointment.full_name,
      email: appointment.email,
      phone: appointment.phone,
      appointment_date: appointment.appointment_date,
      appointment_time: appointment.appointment_time,
      service_type: appointment.service_type,
      notes: appointment.notes || '',
      status: appointment.status,
    });
    setIsEditing(false);
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
        className={`px-3 py-1 rounded-full text-sm font-semibold border ${
          statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-300'
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
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

  const formatTime = (timeString) => {
    return timeString.slice(0, 5);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Loading appointment details...</div>
      </div>
    );
  }

  if (!appointment) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/appointments')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#1e3a5f' }}>
              Appointment Details
            </h1>
            <p className="text-slate-600 mt-1">ID: {appointment.id}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
            >
              Edit Appointment
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-300 transition-colors flex items-center space-x-2"
              >
                <X size={20} />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                <Save size={20} />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2 text-slate-700">
                Full Name
              </label>
              {isEditing ? (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="text-slate-400" size={20} />
                  </div>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-red-500 focus:outline-none"
                  />
                </div>
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                  <User className="text-slate-400" size={20} />
                  <span className="text-slate-900">{appointment.full_name}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-slate-700">
                Email
              </label>
              {isEditing ? (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="text-slate-400" size={20} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-red-500 focus:outline-none"
                  />
                </div>
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                  <Mail className="text-slate-400" size={20} />
                  <span className="text-slate-900">{appointment.email}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-slate-700">
                Phone
              </label>
              {isEditing ? (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="text-slate-400" size={20} />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-red-500 focus:outline-none"
                  />
                </div>
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                  <Phone className="text-slate-400" size={20} />
                  <span className="text-slate-900">{appointment.phone}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-slate-700">
                Service Type
              </label>
              {isEditing ? (
                <select
                  name="service_type"
                  value={formData.service_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-red-500 focus:outline-none"
                >
                  {serviceTypes.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-900">{appointment.service_type}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-slate-700">
                Appointment Date
              </label>
              {isEditing ? (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar className="text-slate-400" size={20} />
                  </div>
                  <input
                    type="date"
                    name="appointment_date"
                    value={formData.appointment_date}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-red-500 focus:outline-none"
                  />
                </div>
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                  <Calendar className="text-slate-400" size={20} />
                  <span className="text-slate-900">{formatDate(appointment.appointment_date)}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-slate-700">
                Appointment Time
              </label>
              {isEditing ? (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Clock className="text-slate-400" size={20} />
                  </div>
                  <input
                    type="time"
                    name="appointment_time"
                    value={formData.appointment_time}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-red-500 focus:outline-none"
                  />
                </div>
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                  <Clock className="text-slate-400" size={20} />
                  <span className="text-slate-900">{formatTime(appointment.appointment_time)}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-slate-700">
              Status
            </label>
            {isEditing ? (
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-red-500 focus:outline-none"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            ) : (
              <div>{getStatusBadge(appointment.status)}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-slate-700">
              Additional Notes
            </label>
            {isEditing ? (
              <div className="relative">
                <div className="absolute top-3 left-0 pl-4 pointer-events-none">
                  <FileText className="text-slate-400" size={20} />
                </div>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="4"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-red-500 focus:outline-none resize-none"
                  placeholder="Any special requirements or additional information..."
                ></textarea>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl min-h-24">
                <p className="text-slate-900 whitespace-pre-wrap">
                  {appointment.notes || 'No additional notes'}
                </p>
              </div>
            )}
          </div>

          {/* Location Map */}
          {appointment.location && (
            <div>
              <label className="block text-sm font-bold mb-2 text-slate-700 flex items-center space-x-2">
                <MapPin className="text-red-500" size={20} />
                <span>Appointment Location</span>
              </label>
              <div className="rounded-xl overflow-hidden border-2 border-slate-200" style={{ height: '400px' }}>
                <MapContainer
                  center={[appointment.location.latitude, appointment.location.longitude]}
                  zoom={15}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    attribution='&copy; Google Maps'
                    url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
                    maxZoom={20}
                  />
                  <Marker position={[appointment.location.latitude, appointment.location.longitude]}>
                    <Popup>
                      <div className="p-2">
                        <div className="font-bold text-slate-900 mb-2">{appointment.service_type}</div>
                        <div className="text-sm text-slate-700">{appointment.full_name}</div>
                        {appointment.location_address && (
                          <div className="text-xs text-slate-600 mt-2">{appointment.location_address}</div>
                        )}
                        <div className="text-xs text-slate-500 mt-2">
                          {appointment.location.latitude.toFixed(6)}°, {appointment.location.longitude.toFixed(6)}°
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
              {appointment.location_address && (
                <div className="mt-2 p-3 bg-slate-50 rounded-xl flex items-start space-x-2">
                  <MapPin className="text-slate-400 flex-shrink-0 mt-0.5" size={16} />
                  <span className="text-sm text-slate-700">{appointment.location_address}</span>
                </div>
              )}
              <div className="mt-2 text-xs text-slate-500">
                Coordinates: {appointment.location.latitude.toFixed(6)}°, {appointment.location.longitude.toFixed(6)}°
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-slate-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600">Created At:</span>
                <p className="text-slate-900 font-medium">
                  {new Date(appointment.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-slate-600">Last Updated:</span>
                <p className="text-slate-900 font-medium">
                  {new Date(appointment.updated_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppointmentDetailPage;
