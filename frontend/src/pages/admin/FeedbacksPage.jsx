import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Search, Trash2, Mail, Calendar, AlertCircle, Loader, ChevronLeft, ChevronRight, Star, MessageSquare, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

function FeedbacksPage() {
  const { t } = useLanguage();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [publishFilter, setPublishFilter] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingPublish, setTogglingPublish] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const itemsPerPage = 15;

  useEffect(() => {
    if (!searchTerm.trim()) {
      fetchFeedbacks();
    }
  }, [currentPage, publishFilter]);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      setError('');
      const skip = (currentPage - 1) * itemsPerPage;
      const data = await api.feedbacks.getAll(skip, itemsPerPage);
      setFeedbacks(data.items || []);
      setTotalCount(data.total || 0);
    } catch (err) {
      setError(err.message || 'Failed to load feedbacks');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchFeedbacks();
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await api.feedbacks.searchByName(searchTerm);
      setFeedbacks(data);
    } catch (err) {
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeleting(true);
      await api.feedbacks.delete(id);
      setFeedbacks(feedbacks.filter(f => f.id !== id));
      setDeleteConfirm(null);
      setTotalCount(prev => prev - 1);
    } catch (err) {
      setError(err.message || 'Failed to delete feedback');
    } finally {
      setDeleting(false);
    }
  };

  const handleTogglePublish = async (feedbackId) => {
    try {
      setTogglingPublish(feedbackId);
      const updated = await api.feedbacks.togglePublish(feedbackId);
      setFeedbacks(feedbacks.map(feedback =>
        feedback.id === feedbackId
          ? { ...feedback, is_published: updated.is_published }
          : feedback
      ));
    } catch (err) {
      setError(err.message || 'Failed to toggle publish status');
    } finally {
      setTogglingPublish(null);
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

  const filteredFeedbacks = feedbacks.filter(feedback => {
    if (publishFilter === 'all') return true;
    if (publishFilter === 'published') return feedback.is_published;
    if (publishFilter === 'unpublished') return !feedback.is_published;
    return true;
  });

  if (loading && feedbacks.length === 0) {
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
          <h1 className="text-3xl font-bold" style={{color: '#1e3a5f'}}>Customer Feedbacks</h1>
          <p className="text-slate-600 mt-1">Manage and publish customer reviews</p>
        </div>
        <div className="text-sm text-slate-600">
          Total: <span className="font-bold text-lg" style={{color: '#1e3a5f'}}>{totalCount}</span>
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
                fetchFeedbacks();
              }}
              className="px-6 py-2 border-2 border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      {!searchTerm && (
        <div className="bg-white rounded-2xl shadow-sm p-2">
          <div className="flex flex-wrap gap-2">
            {['all', 'published', 'unpublished'].map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setPublishFilter(filter);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  publishFilter === filter
                    ? 'bg-red-500 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-start space-x-3">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}

      {/* Feedbacks List */}
      {filteredFeedbacks.length === 0 && !loading ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <div className="text-slate-400 mb-4">
            <MessageSquare size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-slate-600 mb-2">No feedbacks found</h3>
          <p className="text-slate-500">
            {searchTerm ? 'Try a different search term' : 'Customer feedbacks will appear here'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b-2 border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{color: '#1e3a5f'}}>
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{color: '#1e3a5f'}}>
                    Rating
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{color: '#1e3a5f'}}>
                    Service
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{color: '#1e3a5f'}}>
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{color: '#1e3a5f'}}>
                    Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider" style={{color: '#1e3a5f'}}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredFeedbacks.map((feedback) => (
                  <tr key={feedback.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium" style={{color: '#1e3a5f'}}>{feedback.full_name}</div>
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <Mail size={14} />
                        <span>{feedback.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={`${
                              i < feedback.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-slate-600">({feedback.rating})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 bg-cyan-50 text-cyan-700 text-xs font-medium rounded-full">
                        {feedback.service_type || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                        feedback.is_published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {feedback.is_published ? (
                          <>
                            <Eye size={12} className="mr-1" />
                            Published
                          </>
                        ) : (
                          <>
                            <EyeOff size={12} className="mr-1" />
                            Hidden
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <Calendar size={14} />
                        <span>{formatDate(feedback.created_at)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setSelectedFeedback(feedback)}
                          className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <MessageSquare size={18} />
                        </button>
                        <button
                          onClick={() => handleTogglePublish(feedback.id)}
                          disabled={togglingPublish === feedback.id}
                          className={`p-2 rounded-lg transition-colors ${
                            feedback.is_published
                              ? 'text-yellow-600 hover:bg-yellow-50'
                              : 'text-green-600 hover:bg-green-50'
                          } ${togglingPublish === feedback.id ? 'opacity-50 cursor-wait' : ''}`}
                          title={feedback.is_published ? 'Unpublish' : 'Publish'}
                        >
                          {feedback.is_published ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(feedback.id)}
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

          {/* Pagination Controls */}
          {!searchTerm && totalCount > itemsPerPage && (
            <div className="px-6 py-4 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-slate-600">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} feedbacks
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
      )}

      {/* View Feedback Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold" style={{color: '#1e3a5f'}}>
                  {selectedFeedback.full_name}
                </h3>
                <p className="text-slate-600">{selectedFeedback.email}</p>
              </div>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={`${
                      i < selectedFeedback.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-cyan-50 text-cyan-700 text-sm font-medium rounded-full">
                {selectedFeedback.service_type || 'General'}
              </span>
              <span className={`inline-block ml-2 px-3 py-1 text-sm font-medium rounded-full ${
                selectedFeedback.is_published
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {selectedFeedback.is_published ? 'Published' : 'Hidden'}
              </span>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 mb-6">
              <p className="text-slate-700 italic">"{selectedFeedback.message}"</p>
            </div>

            <div className="text-sm text-slate-500 mb-6">
              Submitted on {formatDate(selectedFeedback.created_at)}
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setSelectedFeedback(null)}
                className="flex-1 px-6 py-3 border-2 border-slate-200 text-slate-600 rounded-full font-medium hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleTogglePublish(selectedFeedback.id);
                  setSelectedFeedback(null);
                }}
                className={`flex-1 px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all ${
                  selectedFeedback.is_published
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                }`}
              >
                {selectedFeedback.is_published ? 'Unpublish' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold mb-4" style={{color: '#1e3a5f'}}>
              Delete Feedback?
            </h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete this feedback? This action cannot be undone.
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

export default FeedbacksPage;
