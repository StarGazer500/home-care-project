// import { useState, useEffect } from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import { Calendar, Clock, User, Phone, Mail, MapPin, Loader } from 'lucide-react';
// import { api } from '../../services/api';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';

// // Fix for default marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
//   iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
// });

// // Custom marker icons based on appointment status
// const createStatusIcon = (status) => {
//   const colors = {
//     pending: '#f59e0b',    // amber
//     confirmed: '#10b981',  // green
//     cancelled: '#ef4444',  // red
//     completed: '#6b7280',  // gray
//   };

//   const color = colors[status] || colors.pending;

//   return L.divIcon({
//     html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
//     className: 'custom-marker',
//     iconSize: [30, 30],
//     iconAnchor: [15, 30],
//     popupAnchor: [0, -30],
//   });
// };

// function AppointmentsMapPage() {
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState('all');
//   const [center] = useState([5.6037, -0.1870]); // Accra, Ghana

//   useEffect(() => {
//     fetchAppointments();
//   }, []);

//   const fetchAppointments = async () => {
//     try {
//       // Fetch all appointments with automatic pagination
//       const data = await api.appointments.getAllComplete();
//       setAppointments(data.items || []);
//     } catch (error) {
//       console.error('Failed to fetch appointments:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getFilteredAppointments = () => {
//     const withLocation = appointments.filter(apt => apt.location);
//     if (filter === 'all') return withLocation;
//     return withLocation.filter(apt => apt.status === filter);
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//     });
//   };

//   const formatTime = (timeString) => {
//     return timeString.slice(0, 5);
//   };

//   const getStatusBadge = (status) => {
//     const styles = {
//       pending: 'bg-amber-100 text-amber-800 border-amber-200',
//       confirmed: 'bg-green-100 text-green-800 border-green-200',
//       cancelled: 'bg-red-100 text-red-800 border-red-200',
//       completed: 'bg-gray-100 text-gray-800 border-gray-200',
//     };

//     return (
//       <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${styles[status] || styles.pending}`}>
//         {status.charAt(0).toUpperCase() + status.slice(1)}
//       </span>
//     );
//   };

//   const filteredAppointments = getFilteredAppointments();
//   const appointmentsWithoutLocation = appointments.filter(apt => !apt.location).length;

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <Loader className="animate-spin text-red-500" size={48} />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-navy-900" style={{ color: '#1e3a5f' }}>
//             Appointments Map
//           </h1>
//           <p className="text-slate-600 mt-1">
//             View all appointment locations on the map
//           </p>
//         </div>

//         {/* Filter */}
//         <div className="flex items-center space-x-3">
//           <label className="text-sm font-semibold text-slate-700">Filter:</label>
//           <select
//             value={filter}
//             onChange={(e) => setFilter(e.target.value)}
//             className="px-4 py-2 rounded-xl border-2 border-slate-200 focus:border-red-500 focus:outline-none bg-white"
//           >
//             <option value="all">All Status</option>
//             <option value="pending">Pending</option>
//             <option value="confirmed">Confirmed</option>
//             <option value="cancelled">Cancelled</option>
//             <option value="completed">Completed</option>
//           </select>
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="grid md:grid-cols-4 gap-4">
//         <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
//           <div className="text-2xl font-bold text-slate-900">{appointments.length}</div>
//           <div className="text-sm text-slate-600">Total Appointments</div>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
//           <div className="text-2xl font-bold text-slate-900">{filteredAppointments.length}</div>
//           <div className="text-sm text-slate-600">With Location</div>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-amber-500">
//           <div className="text-2xl font-bold text-slate-900">{appointmentsWithoutLocation}</div>
//           <div className="text-sm text-slate-600">Without Location</div>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-500">
//           <div className="text-2xl font-bold text-slate-900">
//             {appointments.filter(apt => apt.status === 'pending').length}
//           </div>
//           <div className="text-sm text-slate-600">Pending</div>
//         </div>
//       </div>

//       {/* Legend */}
//       <div className="bg-white rounded-xl shadow-sm p-4">
//         <h3 className="text-sm font-bold text-slate-700 mb-3">Map Legend:</h3>
//         <div className="flex flex-wrap gap-4">
//           <div className="flex items-center space-x-2">
//             <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow"></div>
//             <span className="text-sm text-slate-600">Pending</span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow"></div>
//             <span className="text-sm text-slate-600">Confirmed</span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow"></div>
//             <span className="text-sm text-slate-600">Cancelled</span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <div className="w-4 h-4 rounded-full bg-gray-500 border-2 border-white shadow"></div>
//             <span className="text-sm text-slate-600">Completed</span>
//           </div>
//         </div>
//       </div>

//       {/* Map */}
//       <div className="bg-white rounded-xl shadow-sm p-6">
//         {filteredAppointments.length === 0 ? (
//           <div className="text-center py-12">
//             <MapPin className="mx-auto text-slate-300 mb-4" size={64} />
//             <h3 className="text-xl font-semibold text-slate-700 mb-2">
//               No appointments with location
//             </h3>
//             <p className="text-slate-500">
//               {filter === 'all'
//                 ? 'No appointments have location data yet'
//                 : `No ${filter} appointments with location`}
//             </p>
//           </div>
//         ) : (
//           <div style={{ height: '600px', borderRadius: '12px', overflow: 'hidden' }}>
//             <MapContainer
//               center={center}
//               zoom={12}
//               style={{ height: '100%', width: '100%' }}
//             >
//               {/* Google Satellite Hybrid - Shows satellite imagery with labels */}
//               <TileLayer
//                 attribution='&copy; Google Maps'
//                 url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
//                 maxZoom={20}
//               />
//               {filteredAppointments.map((appointment) => (
//                 <Marker
//                   key={appointment.id}
//                   position={[appointment.location.latitude, appointment.location.longitude]}
//                   icon={createStatusIcon(appointment.status)}
//                 >
//                   <Popup maxWidth={300}>
//                     <div className="p-2">
//                       <div className="flex items-center justify-between mb-3">
//                         <h3 className="font-bold text-slate-900 text-lg">
//                           {appointment.service_type}
//                         </h3>
//                         {getStatusBadge(appointment.status)}
//                       </div>

//                       <div className="space-y-2 text-sm">
//                         <div className="flex items-start space-x-2">
//                           <User className="text-slate-500 flex-shrink-0 mt-0.5" size={16} />
//                           <span className="text-slate-700">{appointment.full_name}</span>
//                         </div>

//                         <div className="flex items-start space-x-2">
//                           <Mail className="text-slate-500 flex-shrink-0 mt-0.5" size={16} />
//                           <span className="text-slate-700">{appointment.email}</span>
//                         </div>

//                         <div className="flex items-start space-x-2">
//                           <Phone className="text-slate-500 flex-shrink-0 mt-0.5" size={16} />
//                           <span className="text-slate-700">{appointment.phone}</span>
//                         </div>

//                         <div className="flex items-start space-x-2">
//                           <Calendar className="text-slate-500 flex-shrink-0 mt-0.5" size={16} />
//                           <span className="text-slate-700">{formatDate(appointment.appointment_date)}</span>
//                         </div>

//                         <div className="flex items-start space-x-2">
//                           <Clock className="text-slate-500 flex-shrink-0 mt-0.5" size={16} />
//                           <span className="text-slate-700">{formatTime(appointment.appointment_time)}</span>
//                         </div>

//                         {appointment.location_address && (
//                           <div className="flex items-start space-x-2">
//                             <MapPin className="text-slate-500 flex-shrink-0 mt-0.5" size={16} />
//                             <span className="text-slate-700 text-xs">{appointment.location_address}</span>
//                           </div>
//                         )}

//                         {appointment.notes && (
//                           <div className="mt-3 pt-3 border-t border-slate-200">
//                             <p className="text-xs text-slate-500 mb-1">Notes:</p>
//                             <p className="text-xs text-slate-700">{appointment.notes}</p>
//                           </div>
//                         )}
//                       </div>

//                       <a
//                         href={`/admin/appointments/${appointment.id}`}
//                         className="block mt-4 text-center px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
//                       >
//                         View Details
//                       </a>
//                     </div>
//                   </Popup>
//                 </Marker>
//               ))}
//             </MapContainer>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default AppointmentsMapPage;
