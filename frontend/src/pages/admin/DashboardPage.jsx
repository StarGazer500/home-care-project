import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Users, Mail, TrendingUp, Calendar, ArrowRight, CalendarCheck } from 'lucide-react';

function DashboardPage() {
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalAppointments: 0,
    recentContacts: [],
    recentAppointments: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [contactsData, appointmentsData] = await Promise.all([
        api.clientContacts.getAll(0, 100),
        api.appointments.getAll(0, 100)
      ]);

      const contacts = contactsData.items || [];
      const appointments = appointmentsData.items || [];

      setStats({
        totalContacts: contactsData.total || contacts.length,
        totalAppointments: appointmentsData.total || appointments.length,
        recentContacts: contacts.slice(0, 5),
        recentAppointments: appointments.slice(0, 5)
      });
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2" style={{color: '#1e3a5f'}}>
          Welcome to Admin Dashboard
        </h1>
        <p className="text-slate-600 text-lg">
          Manage your client contacts and administrative tasks
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-3xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
              <Mail size={24} />
            </div>
            <TrendingUp size={20} className="opacity-60" />
          </div>
          <div className="text-3xl font-bold mb-1">{stats.totalContacts}</div>
          <div className="text-cyan-100">Total Contacts</div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-3xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
              <CalendarCheck size={24} />
            </div>
            <Calendar size={20} className="opacity-60" />
          </div>
          <div className="text-3xl font-bold mb-1">{stats.totalAppointments}</div>
          <div className="text-pink-100">Total Appointments</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-amber-500 rounded-3xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
              <Users size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">{stats.recentContacts.length + stats.recentAppointments.length}</div>
          <div className="text-amber-100">Recent Items</div>
        </div>
      </div>

      {/* Recent Contacts & Appointments Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Contacts */}
        <div className="bg-white rounded-3xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{color: '#1e3a5f'}}>Recent Contacts</h2>
            <Link
              to="/admin/contacts"
              className="inline-flex items-center space-x-2 text-red-500 hover:text-red-600 font-medium"
            >
              <span>View All</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading...</div>
          ) : stats.recentContacts.length === 0 ? (
            <div className="text-center py-12">
              <Mail size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500">No contacts yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentContacts.map((contact) => (
                <Link
                  key={contact.id}
                  to={`/admin/contacts/${contact.id}`}
                  className="block p-4 rounded-2xl border-2 border-slate-100 hover:border-cyan-200 hover:bg-cyan-50 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-bold text-lg mb-1" style={{color: '#1e3a5f'}}>
                        {contact.full_name}
                      </div>
                      <div className="text-sm text-slate-600 mb-2">{contact.email}</div>
                      <div className="flex items-center space-x-2">
                        <span className="inline-block px-3 py-1 bg-cyan-50 text-cyan-700 text-xs font-medium rounded-full">
                          {contact.service_needed || 'N/A'}
                        </span>
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                          contact.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          contact.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                          contact.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {contact.status ? contact.status.charAt(0).toUpperCase() + contact.status.slice(1) : 'Pending'}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-slate-500">
                      {formatDate(contact.created_at)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-3xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{color: '#1e3a5f'}}>Recent Appointments</h2>
            <Link
              to="/admin/appointments"
              className="inline-flex items-center space-x-2 text-red-500 hover:text-red-600 font-medium"
            >
              <span>View All</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading...</div>
          ) : stats.recentAppointments.length === 0 ? (
            <div className="text-center py-12">
              <CalendarCheck size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500">No appointments yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentAppointments.map((appointment) => (
                <Link
                  key={appointment.id}
                  to={`/admin/appointments/${appointment.id}`}
                  className="block p-4 rounded-2xl border-2 border-slate-100 hover:border-red-200 hover:bg-red-50 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-bold text-lg mb-1" style={{color: '#1e3a5f'}}>
                        {appointment.full_name}
                      </div>
                      <div className="text-sm text-slate-600 mb-2">
                        {new Date(appointment.appointment_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })} at {appointment.appointment_time.slice(0, 5)}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="inline-block px-3 py-1 bg-pink-50 text-pink-700 text-xs font-medium rounded-full">
                          {appointment.service_type}
                        </span>
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                          appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {appointment.status ? appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1) : 'Pending'}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-slate-500">
                      {formatDate(appointment.created_at)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link
          to="/admin/contacts"
          className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl p-8 hover:shadow-lg transition-all group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <Mail size={32} className="text-cyan-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1" style={{color: '#1e3a5f'}}>
                Manage Contacts
              </h3>
              <p className="text-slate-600 text-sm">View and manage client contacts</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/appointments"
          className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl p-8 hover:shadow-lg transition-all group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <CalendarCheck size={32} className="text-red-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1" style={{color: '#1e3a5f'}}>
                Manage Appointments
              </h3>
              <p className="text-slate-600 text-sm">View and manage appointments</p>
            </div>
          </div>
        </Link>

        <Link
          to="/"
          className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl p-8 hover:shadow-lg transition-all group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <Users size={32} className="text-yellow-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1" style={{color: '#1e3a5f'}}>
                View Website
              </h3>
              <p className="text-slate-600 text-sm">Go to the public homepage</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default DashboardPage;
