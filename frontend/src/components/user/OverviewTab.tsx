import React from 'react';
import { motion } from 'framer-motion';
import {
  BookOpenIcon,
  ClockIcon,
  HeartIcon,
  BellIcon,
  CalendarDaysIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { BorrowedBook, ReservedBook, ReadingHistory, Notification } from '../../services/userDashboardService';

interface OverviewTabProps {
  borrowedBooks: BorrowedBook[];
  reservedBooks: ReservedBook[];
  readingHistory: ReadingHistory[];
  notifications: Notification[];
  favoriteBooksCount: number;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  borrowedBooks,
  reservedBooks,
  readingHistory,
  notifications,
  favoriteBooksCount,
}) => {
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
      case 'borrowed':
        return 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400';
      case 'overdue':
        return 'bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-400';
      case 'renewed':
        return 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-400';
      default:
        return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-400';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'due_soon':
        return <ClockIcon className="w-5 h-5 text-white" />;
      case 'overdue':
        return <ExclamationCircleIcon className="w-5 h-5 text-white" />;
      case 'available':
        return <CheckCircleIcon className="w-5 h-5 text-white" />;
      default:
        return <BellIcon className="w-5 h-5 text-white" />;
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      className="space-y-6"
    >
      {/* Current Books Section */}
      <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-neutral-200/50 dark:border-neutral-700/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center">
            <BookOpenIcon className="w-7 h-7 mr-3 text-primary-500" />
            Current Books
          </h3>
          <span className="px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-semibold">
            {borrowedBooks.length} Active
          </span>
        </div>
        
        <div className="space-y-4">
          {borrowedBooks.slice(0, 5).map((book) => (
            <div key={book.id} className="flex items-center space-x-4 p-4 bg-white dark:bg-neutral-800 rounded-2xl hover:shadow-lg transition-all duration-200 border border-neutral-100 dark:border-neutral-700">
              {book.coverImage ? (
                <img src={book.coverImage} alt={book.title} className="w-16 h-20 object-cover rounded-lg shadow-md" />
              ) : (
                <div className="w-16 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-2xl font-bold text-white">
                    {book.title.charAt(0)}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-neutral-900 dark:text-neutral-100 truncate">
                  {book.title}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  by {book.author}
                </p>
                <div className="flex items-center mt-2 space-x-2">
                  <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(book.status)}`}>
                    {book.status === 'overdue' ? (
                      <>
                        <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                        Overdue
                      </>
                    ) : (
                      <>
                        <ClockIcon className="w-4 h-4 mr-1" />
                        Due {book.dueDate ? formatDate(book.dueDate) : ''}
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {borrowedBooks.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 mb-4">
                <BookOpenIcon className="w-8 h-8 text-blue-500" />
              </div>
              <p className="text-neutral-500 dark:text-neutral-400">
                No books currently borrowed
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-neutral-200/50 dark:border-neutral-700/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center">
            <BellIcon className="w-7 h-7 mr-3 text-primary-500" />
            Recent Notifications
          </h3>
          {notifications.filter(n => !n.read).length > 0 && (
            <span className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm font-semibold">
              {notifications.filter(n => !n.read).length} New
            </span>
          )}
        </div>
        
        <div className="space-y-4">
          {notifications.slice(0, 5).map((notification) => (
            <div key={notification.id} className={`flex items-start space-x-4 p-4 rounded-2xl transition-all duration-200 border ${
              !notification.read 
                ? 'bg-primary-50 dark:bg-primary-900/10 border-primary-200 dark:border-primary-800' 
                : 'bg-white dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700'
            }`}>
              <div className="flex-shrink-0 mt-1">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                  {getNotificationIcon(notification.type)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  {notification.title}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  {notification.message}
                </p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-2 flex items-center">
                  <ClockIcon className="w-3 h-3 mr-1" />
                  {formatDate(notification.date)}
                </p>
              </div>
              {!notification.read && (
                <div className="w-3 h-3 bg-primary-500 rounded-full flex-shrink-0 mt-2 animate-pulse"></div>
              )}
            </div>
          ))}
          {notifications.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 mb-4">
                <CheckCircleIcon className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-neutral-500 dark:text-neutral-400">
                No new notifications
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-200 cursor-pointer transform hover:-translate-y-1">
          <CalendarDaysIcon className="w-10 h-10 mb-3 opacity-90" />
          <h4 className="text-lg font-bold mb-1">Reserved Books</h4>
          <p className="text-sm opacity-90 mb-3">You have {reservedBooks.length} books reserved</p>
          <div className="text-2xl font-bold">{reservedBooks.length}</div>
        </div>
        
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-200 cursor-pointer transform hover:-translate-y-1">
          <HeartIcon className="w-10 h-10 mb-3 opacity-90" />
          <h4 className="text-lg font-bold mb-1">Favorite Books</h4>
          <p className="text-sm opacity-90 mb-3">Books you love</p>
          <div className="text-2xl font-bold">{favoriteBooksCount}</div>
        </div>
      </div>
    </motion.div>
  );
};

export default OverviewTab;
