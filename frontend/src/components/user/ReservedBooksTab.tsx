import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ReservedBook } from '../../services/userDashboardService';
import { CalendarDaysIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

interface ReservedBooksTabProps {
  reservedBooks: ReservedBook[];
  cancelReservation: (reservationId: string) => Promise<void>;
}

const ReservedBooksTab: React.FC<ReservedBooksTabProps> = ({ reservedBooks, cancelReservation }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400';
      case 'pending':
        return 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-400';
      case 'rejected':
        return 'bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-400';
      default:
        return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-400';
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(reservedBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBooks = reservedBooks.slice(startIndex, endIndex);

  return (
    <motion.div variants={itemVariants}>
      <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-neutral-200/50 dark:border-neutral-700/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center">
            <CalendarDaysIcon className="w-7 h-7 mr-3 text-primary-500" />
            Reserved Books
          </h3>
          <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-semibold">
            {reservedBooks.length} Books
          </span>
        </div>
        
        {reservedBooks.length > 0 ? (
          <>
            <div className="space-y-4">
              {currentBooks.map((book) => (
                <div key={book.id} className="bg-white dark:bg-neutral-800 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-200 border border-neutral-100 dark:border-neutral-700">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-4 flex-1">
                      {book.coverImage ? (
                        <img src={book.coverImage} alt={book.title} className="w-16 h-20 object-cover rounded-lg shadow-md" />
                      ) : (
                        <div className="w-16 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                          <span className="text-2xl font-bold text-white">
                            {book.title ? book.title.charAt(0) : ''}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100 truncate">
                          {book.title}
                        </h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          by {book.author}
                        </p>
                        <div className="flex items-center mt-2 space-x-2">
                          <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(book.status)}`}>
                            {book.status}
                          </span>
                          <span className="text-xs text-neutral-600 dark:text-neutral-400">
                            {book.borrowPeriodDays} days period
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:items-end space-y-2">
                      <div className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        Reserved: <span className="font-semibold text-neutral-900 dark:text-neutral-100 ml-1">{formatDate(book.reservedDate)}</span>
                      </div>
                      <button
                        onClick={() => cancelReservation(book.id)}
                        className="flex items-center space-x-2 px-4 py-2 rounded-xl font-medium text-sm bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg shadow-red-500/30"
                      >
                        <XCircleIcon className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30'
                        : 'text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 mb-4">
              <CalendarDaysIcon className="w-10 h-10 text-purple-500" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              No reserved books
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400">
              You haven't reserved any books yet. Browse our library to reserve books!
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ReservedBooksTab;
