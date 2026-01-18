import { useState, useEffect } from 'react';
import { Users, Search, Trash2, Eye, Loader, ChevronLeft, ChevronRight, User, Mail, Phone, Calendar, Shield } from 'lucide-react';
import { api } from '../../services/api';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 15;

  useEffect(() => {
    if (!searchQuery) {
      fetchUsers();
    }
  }, [currentPage]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        handleSearch();
      } else {
        fetchUsers();
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const skip = (currentPage - 1) * itemsPerPage;
      const data = await api.users.getAll(skip, itemsPerPage);
      setUsers(data.items || []);
      setTotalCount(data.total || 0);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchUsers();
      return;
    }

    setIsSearching(true);
    try {
      const data = await api.users.searchByName(searchQuery);
      setUsers(data.items || []);
      setTotalCount(data.total || 0);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await api.users.delete(userId);
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert(error.message || 'Failed to delete user');
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getRoleBadge = (role) => {
    const roleColors = {
      admin: 'bg-purple-100 text-purple-800 border-purple-300',
      user: 'bg-blue-100 text-blue-800 border-blue-300',
      client: 'bg-green-100 text-green-800 border-green-300',
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize ${
          roleColors[role] || 'bg-gray-100 text-gray-800 border-gray-300'
        }`}
      >
        {role || 'user'}
      </span>
    );
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-red-500" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#1e3a5f' }}>
            Users
          </h1>
          <p className="text-slate-600 mt-1">
            Manage registered users ({totalCount} total)
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {isSearching ? (
              <Loader className="animate-spin text-slate-400" size={20} />
            ) : (
              <Search className="text-slate-400" size={20} />
            )}
          </div>
          <input
            type="text"
            placeholder="Search by name, username, or email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-red-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">User</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Contact</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Role</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Joined</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <Users className="mx-auto text-slate-300 mb-4" size={48} />
                    <p className="text-slate-500">No users found</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center text-white font-semibold">
                          {(user.full_name || user.username || user.email)?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {user.full_name || 'No name'}
                          </p>
                          <p className="text-sm text-slate-500">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <Mail size={14} />
                          <span>{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center space-x-2 text-sm text-slate-600">
                            <Phone size={14} />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <Calendar size={14} />
                        <span>{formatDate(user.created_at)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete user"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalCount > itemsPerPage && !searchQuery && (
          <div className="px-6 py-4 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-slate-600">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} users
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 border-2 border-slate-200 hover:border-red-500 hover:bg-red-50 disabled:hover:border-slate-200 disabled:hover:bg-transparent"
                >
                  <ChevronLeft size={20} />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.ceil(totalCount / itemsPerPage) }, (_, i) => i + 1)
                    .filter(page => {
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
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UsersPage;
