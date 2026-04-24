import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  ArrowPathIcon,
  BookOpenIcon,
  UserIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  getBorrowedBooks,
  approveRequest,
  rejectRequest,
  returnBook,
  getUserBorrowingHistory,
  Borrowing,
} from '../../services/AdminBorrwoingService';

const AdminBorrowingPage: React.FC = () => {
  const [borrowingRecords, setBorrowingRecords] = useState<Borrowing[]>([]);
  const [userHistory, setUserHistory] = useState<Borrowing[]>([]);
  const [selectedUser, setSelectedUser] = useState<Borrowing['user'] | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [returnConfirmId, setReturnConfirmId] = useState<string | null>(null);
  const { t } = useLanguage();
  const [token] = useState(localStorage.getItem('token') || '');

  const fetchBorrowingRecords = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getBorrowedBooks(token, searchQuery, selectedStatus);
      setBorrowingRecords(response);
    } catch (error) {
      console.error('Failed to fetch borrowing records:', error);
      setBorrowingRecords([]);
      if (error instanceof Error) {
        toast.error(`Error fetching borrowing records: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedStatus, token]);

  const handleApproveRequest = async (recordId: string) => {
    try {
      await approveRequest(recordId, token);
      fetchBorrowingRecords();
      toast.success('Borrowing request approved successfully');
    } catch (error) {
      console.error('Failed to approve request:', error);
      toast.error(`Failed to approve request: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleRejectRequest = async (recordId: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;
    try {
      await rejectRequest(recordId, reason, token);
      fetchBorrowingRecords();
      toast.success('Borrowing request rejected');
    } catch (error) {
      console.error('Failed to reject request:', error);
      toast.error(`Failed to reject request: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleReturnBook = async (recordId: string) => {
    try {
      await returnBook(recordId, token);
      fetchBorrowingRecords();
      toast.success(t('messages.success.bookReturned'));
      setReturnConfirmId(null);
    } catch (error) {
      console.error('Failed to return book:', error);
      toast.error(`Failed to return book: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setReturnConfirmId(null);
    }
  };

  const getStatusColor = (status: Borrowing['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-400';
      case 'approved':
        return 'bg-info-100 text-info-800 dark:bg-info-900/30 dark:text-info-400';
      case 'borrowed':
        return 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400';
      case 'returned':
        return 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400';
      case 'overdue':
        return 'bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-400';
      default:
        return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-400';
    }
  };

  const getStatusIcon = (status: Borrowing['status']) => {
    switch (status) {
      case 'pending': return ClockIcon;
      case 'approved': return CheckCircleIcon;
      case 'borrowed': return BookOpenIcon;
      case 'returned': return CheckCircleIcon;
      case 'overdue': return ExclamationTriangleIcon;
      default: return ClockIcon;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (record: Borrowing) => {
    if (!record.dueDate || record.status === 'returned') return false;
    return new Date(record.dueDate) < new Date();
  };

  const handleViewHistory = async (userId: string, user: Borrowing['user']) => {
    try {
      const history = await getUserBorrowingHistory(userId, token);
      setUserHistory(history);
      setSelectedUser(user);
      setIsHistoryModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch user history:', error);
      toast.error(`Failed to fetch user history: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  useEffect(() => {
    fetchBorrowingRecords();
  }, [fetchBorrowingRecords]);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {t('admin.borrowing.title')}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Manage book borrowing and returns
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending Requests', value: borrowingRecords?.filter(r => r.status === 'pending').length || 0, icon: ClockIcon, bgColor: 'bg-warning-50 dark:bg-warning-900/20', iconColor: 'text-warning-600 dark:text-warning-400', valueColor: 'text-warning-700 dark:text-warning-300' },
          { label: 'Currently Borrowed', value: borrowingRecords?.filter(r => r.status === 'approved' || r.status === 'borrowed').length || 0, icon: BookOpenIcon, bgColor: 'bg-primary-50 dark:bg-primary-900/20', iconColor: 'text-primary-600 dark:text-primary-400', valueColor: 'text-primary-700 dark:text-primary-300' },
          { label: 'Overdue Books', value: borrowingRecords?.filter(r => isOverdue(r)).length || 0, icon: ExclamationTriangleIcon, bgColor: 'bg-error-50 dark:bg-error-900/20', iconColor: 'text-error-600 dark:text-error-400', valueColor: 'text-error-700 dark:text-error-300' },
          { label: 'Returned Books', value: borrowingRecords?.filter(r => r.status === 'returned').length || 0, icon: CheckCircleIcon, bgColor: 'bg-success-50 dark:bg-success-900/20', iconColor: 'text-success-600 dark:text-success-400', valueColor: 'text-success-700 dark:text-success-300' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-hover"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{stat.label}</p>
                <p className={`text-2xl font-bold mt-1 ${stat.valueColor}`}>{stat.value}</p>
              </div>
              <div className={`p-2.5 rounded-xl flex-shrink-0 ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by user name, book title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input-field"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="borrowed">Borrowed</option>
              <option value="returned">Returned</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div className="sm:w-auto">
            <button
              onClick={() => fetchBorrowingRecords()}
              className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <ArrowPathIcon className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Borrowing Records Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-neutral-600 dark:text-neutral-400">Loading borrowing records...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
              <thead className="bg-neutral-50 dark:bg-neutral-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Book</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Fine</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-700">
                <AnimatePresence>
                  {borrowingRecords?.map((record, index) => {
                    const StatusIcon = getStatusIcon(record.status);
                    const overdue = isOverdue(record);
                    const isConfirmingReturn = returnConfirmId === record.id;

                    return (
                      <motion.tr
                        key={record.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className={`hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors duration-200 ${
                          overdue ? 'bg-error-50 dark:bg-error-900/10' : index % 2 === 1 ? 'bg-neutral-50/50 dark:bg-neutral-800/30' : ''
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                                <UserIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{record.user.name}</div>
                              <div className="text-sm text-neutral-500 dark:text-neutral-400">{record.user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{record.book.title}</div>
                          <div className="text-sm text-neutral-500 dark:text-neutral-400">by {record.book.author}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <StatusIcon className="w-4 h-4 mr-2 text-neutral-400" />
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(record.status)}`}>
                              {overdue ? 'Overdue' : record.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">
                          <div>Request: {formatDate(record.requestDate)}</div>
                          {record.dueDate && (
                            <div className={overdue ? 'text-error-600 dark:text-error-400' : ''}>
                              Due: {formatDate(record.dueDate)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">
                          {record.fineAmount > 0 ? `${record.fineAmount.toFixed(2)}` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            {record.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApproveRequest(record.id)}
                                  className="text-success-600 hover:text-success-700 transition-colors duration-200"
                                  title="Approve Request"
                                >
                                  <CheckCircleIcon className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleRejectRequest(record.id)}
                                  className="text-error-600 hover:text-error-700 transition-colors duration-200"
                                  title="Reject Request"
                                >
                                  <XCircleIcon className="w-5 h-5" />
                                </button>
                              </>
                            )}
                            {(record.status === 'borrowed' || record.status === 'approved' || overdue) && (
                              isConfirmingReturn ? (
                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-neutral-600 dark:text-neutral-400">Return?</span>
                                  <button
                                    onClick={() => handleReturnBook(record.id)}
                                    className="inline-flex items-center p-1 rounded bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400 hover:bg-success-200 transition-colors"
                                    title="Confirm Return"
                                  >
                                    <CheckIcon className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setReturnConfirmId(null)}
                                    className="inline-flex items-center p-1 rounded bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 transition-colors"
                                    title="Cancel"
                                  >
                                    <XMarkIcon className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setReturnConfirmId(record.id)}
                                  className="text-primary-600 hover:text-primary-700 transition-colors duration-200"
                                  title="Mark as Returned"
                                >
                                  <ArrowPathIcon className="w-5 h-5" />
                                </button>
                              )
                            )}
                            <button
                              onClick={() => handleViewHistory(record.userId, record.user)}
                              className="text-info-600 hover:text-info-700 transition-colors duration-200"
                              title="View User History"
                            >
                              <BookOpenIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>

            {borrowingRecords?.length === 0 && !loading && (
              <div className="text-center py-12">
                <FunnelIcon className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                  No borrowing records found
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {searchQuery || selectedStatus
                    ? 'Try adjusting your search criteria'
                    : 'No borrowing activity yet'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* User History Modal */}
      <AnimatePresence>
        {isHistoryModalOpen && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setIsHistoryModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: -20 }}
              className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">
                Borrowing History for {selectedUser.name}
              </h2>
              <div className="max-h-96 overflow-y-auto">
                <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                  <thead className="bg-neutral-50 dark:bg-neutral-700">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase">Book</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase">Dates</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-600">
                    {userHistory.map((record) => (
                      <tr key={record.id}>
                        <td className="px-4 py-2 text-sm text-neutral-900 dark:text-neutral-100">{record.book.title}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(record.status)}`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm text-neutral-900 dark:text-neutral-100">
                          <div>Req: {formatDate(record.requestDate)}</div>
                          {record.dueDate && <div>Due: {formatDate(record.dueDate)}</div>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 text-right">
                <button onClick={() => setIsHistoryModalOpen(false)} className="btn-secondary">
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminBorrowingPage;
