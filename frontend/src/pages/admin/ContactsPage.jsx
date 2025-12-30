import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Search, Eye, Trash2, Mail, Phone, Calendar, AlertCircle, Loader } from 'lucide-react';

function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.clientContacts.getAll(0, 100);
      setContacts(data.items || []);
    } catch (err) {
      setError(err.message || 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchContacts();
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await api.clientContacts.searchByName(searchTerm);
      setContacts(data);
    } catch (err) {
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeleting(true);
      await api.clientContacts.delete(id);
      setContacts(contacts.filter(c => c.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      setError(err.message || 'Failed to delete contact');
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusChange = async (contactId, newStatus) => {
    try {
      setUpdatingStatus(contactId);
      await api.clientContacts.update(contactId, { status: newStatus });

      // Update local state
      setContacts(contacts.map(contact =>
        contact.id === contactId
          ? { ...contact, status: newStatus }
          : contact
      ));
    } catch (err) {
      setError(err.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && contacts.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-red-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{color: '#1e3a5f'}}>Contact Submissions</h1>
          <p className="text-slate-600 mt-1">Manage client contact requests</p>
        </div>
        <div className="text-sm text-slate-600">
          Total: <span className="font-bold text-lg" style={{color: '#1e3a5f'}}>{contacts.length}</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search by name..."
              className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            Search
          </button>
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                fetchContacts();
              }}
              className="px-6 py-2 border-2 border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-start space-x-3">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}

      {/* Contacts List */}
      {contacts.length === 0 && !loading ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <div className="text-slate-400 mb-4">
            <Mail size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-slate-600 mb-2">No contacts found</h3>
          <p className="text-slate-500">
            {searchTerm ? 'Try a different search term' : 'Contact submissions will appear here'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b-2 border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{color: '#1e3a5f'}}>
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{color: '#1e3a5f'}}>
                    Contact Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{color: '#1e3a5f'}}>
                    Service
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{color: '#1e3a5f'}}>
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{color: '#1e3a5f'}}>
                    Submitted
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider" style={{color: '#1e3a5f'}}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium" style={{color: '#1e3a5f'}}>{contact.full_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <Mail size={14} />
                          <a href={`mailto:${contact.email}`} className="hover:text-red-500">
                            {contact.email}
                          </a>
                        </div>
                        {contact.phone && (
                          <div className="flex items-center space-x-2 text-sm text-slate-600">
                            <Phone size={14} />
                            <a href={`tel:${contact.phone}`} className="hover:text-red-500">
                              {contact.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 bg-cyan-50 text-cyan-700 text-xs font-medium rounded-full">
                        {contact.service_needed || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={contact.status || 'pending'}
                        onChange={(e) => handleStatusChange(contact.id, e.target.value)}
                        disabled={updatingStatus === contact.id}
                        className={`px-3 py-1 text-xs font-medium rounded-full border-0 focus:ring-2 focus:ring-offset-1 transition-all ${
                          contact.status === 'pending' ? 'bg-yellow-100 text-yellow-800 focus:ring-yellow-300' :
                          contact.status === 'contacted' ? 'bg-blue-100 text-blue-800 focus:ring-blue-300' :
                          contact.status === 'cancelled' ? 'bg-red-100 text-red-800 focus:ring-red-300' :
                          'bg-gray-100 text-gray-800 focus:ring-gray-300'
                        } ${updatingStatus === contact.id ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <Calendar size={14} />
                        <span>{formatDate(contact.created_at)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/admin/contacts/${contact.id}`}
                          className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(contact.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold mb-4" style={{color: '#1e3a5f'}}>
              Delete Contact?
            </h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete this contact? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="flex-1 px-6 py-3 border-2 border-slate-200 text-slate-600 rounded-full font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg transition-all disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContactsPage;
