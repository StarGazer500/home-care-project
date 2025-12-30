import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { ArrowLeft, Mail, Phone, Calendar, Edit2, Save, X, AlertCircle, Loader, Trash2 } from 'lucide-react';

function ContactDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchContact();
  }, [id]);

  const fetchContact = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.clientContacts.getOne(id);
      setContact(data);
      setFormData(data);
    } catch (err) {
      setError(err.message || 'Failed to load contact');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSuccessMessage('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(contact);
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setError('');
      const updated = await api.clientContacts.update(id, {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        service_needed: formData.service_needed,
        message: formData.message,
        status: formData.status
      });
      setContact(updated);
      setFormData(updated);
      setIsEditing(false);
      setSuccessMessage('Contact updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update contact');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-red-500" size={32} />
      </div>
    );
  }

  if (error && !contact) {
    return (
      <div className="space-y-6">
        <Link
          to="/admin/contacts"
          className="inline-flex items-center space-x-2 text-slate-600 hover:text-red-500 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Contacts</span>
        </Link>
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 flex items-start space-x-3">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={24} />
          <div>
            <div className="font-bold text-red-800 mb-1">Error Loading Contact</div>
            <div className="text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/contacts"
          className="inline-flex items-center space-x-2 text-slate-600 hover:text-red-500 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Contacts</span>
        </Link>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="inline-flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg transition-all"
          >
            <Edit2 size={18} />
            <span>Edit Contact</span>
          </button>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 text-green-800">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-start space-x-3">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}

      {/* Contact Details */}
      <div className="bg-white rounded-3xl shadow-sm p-8">
        <form onSubmit={handleSave}>
          <div className="space-y-6">
            {/* Contact Info Header */}
            <div className="border-b-2 border-slate-200 pb-6">
              <h1 className="text-3xl font-bold mb-2" style={{color: '#1e3a5f'}}>
                {isEditing ? 'Edit Contact' : 'Contact Details'}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-slate-600">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} />
                  <span>Submitted: {formatDate(contact.created_at)}</span>
                </div>
                {contact.updated_at !== contact.created_at && (
                  <div className="flex items-center space-x-2">
                    <Edit2 size={16} />
                    <span>Updated: {formatDate(contact.updated_at)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold mb-2" style={{color: '#1e3a5f'}}>
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 bg-white focus:border-red-500 focus:outline-none transition-colors"
                  required
                />
              ) : (
                <div className="text-lg text-slate-700">{contact.full_name}</div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold mb-2" style={{color: '#1e3a5f'}}>
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 bg-white focus:border-red-500 focus:outline-none transition-colors"
                  required
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <Mail size={18} className="text-slate-400" />
                  <a href={`mailto:${contact.email}`} className="text-lg text-red-500 hover:underline">
                    {contact.email}
                  </a>
                </div>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-bold mb-2" style={{color: '#1e3a5f'}}>
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 bg-white focus:border-red-500 focus:outline-none transition-colors"
                />
              ) : contact.phone ? (
                <div className="flex items-center space-x-2">
                  <Phone size={18} className="text-slate-400" />
                  <a href={`tel:${contact.phone}`} className="text-lg text-red-500 hover:underline">
                    {contact.phone}
                  </a>
                </div>
              ) : (
                <div className="text-lg text-slate-400 italic">Not provided</div>
              )}
            </div>

            {/* Service Needed */}
            <div>
              <label className="block text-sm font-bold mb-2" style={{color: '#1e3a5f'}}>
                Service Needed
              </label>
              {isEditing ? (
                <select
                  name="service_needed"
                  value={formData.service_needed || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 bg-white focus:border-red-500 focus:outline-none transition-colors"
                >
                  <option>Home Care Services</option>
                  <option>Home Nursing</option>
                  <option>Home Cleaning</option>
                  <option>Palliative Care</option>
                </select>
              ) : (
                <div className="inline-block px-4 py-2 bg-cyan-50 text-cyan-700 text-lg font-medium rounded-full">
                  {contact.service_needed || 'Not specified'}
                </div>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-bold mb-2" style={{color: '#1e3a5f'}}>
                Contact Status
              </label>
              {isEditing ? (
                <select
                  name="status"
                  value={formData.status || 'pending'}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 bg-white focus:border-red-500 focus:outline-none transition-colors"
                >
                  <option value="pending">Pending</option>
                  <option value="contacted">Contacted</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              ) : (
                <div className="inline-flex items-center">
                  <span className={`px-4 py-2 text-lg font-medium rounded-full ${
                    contact.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    contact.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                    contact.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {contact.status ? contact.status.charAt(0).toUpperCase() + contact.status.slice(1) : 'Pending'}
                  </span>
                </div>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-bold mb-2" style={{color: '#1e3a5f'}}>
                Message
              </label>
              {isEditing ? (
                <textarea
                  name="message"
                  value={formData.message || ''}
                  onChange={handleChange}
                  rows="6"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 bg-white focus:border-red-500 focus:outline-none transition-colors resize-none"
                />
              ) : contact.message ? (
                <div className="text-lg text-slate-700 bg-slate-50 rounded-2xl p-4 whitespace-pre-wrap">
                  {contact.message}
                </div>
              ) : (
                <div className="text-lg text-slate-400 italic">No message provided</div>
              )}
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex space-x-4 pt-6 border-t-2 border-slate-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex-1 inline-flex items-center justify-center space-x-2 px-6 py-3 border-2 border-slate-200 text-slate-600 rounded-full font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  <X size={18} />
                  <span>Cancel</span>
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 inline-flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg transition-all disabled:opacity-50"
                >
                  <Save size={18} />
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactDetailPage;
