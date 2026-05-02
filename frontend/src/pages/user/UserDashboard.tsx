import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpenIcon,
  ClockIcon,
  HeartIcon,
  BellIcon,
  UserCircleIcon,
  CalendarDaysIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  EyeIcon,
  StarIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../../components/common/ThemeToggle';
import LanguageToggle from '../../components/common/LanguageToggle';
import {
  userDashboardService,
  BorrowedBook,
  ReservedBook,
  ReadingHistory,
  Notification,
} from '../../services/userDashboardService';
import { bookService } from '../../services/bookService';
import OverviewTab from '../../components/user/OverviewTab';
import BorrowedBooksTab from '../../components/user/BorrowedBooksTab';
import ReservedBooksTab from '../../components/user/ReservedBooksTab';
import ReadingHistoryTab from '../../components/user/ReadingHistoryTab';
import ProfileTab from '../../components/user/ProfileTab';
import BooksTab from '../../components/user/BooksTab';
import FavoriteBooksTab from '../../components/user/FavoriteBooksTab';
import { Book } from '../../services/bookService';

const UserDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();

  // State management
  const [activeTab, setActiveTab] = useState<'overview' | 'borrowed' | 'reserved' | 'history' | 'profile' | 'books' | 'favorites'>('overview');
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [reservedBooks, setReservedBooks] = useState<ReservedBook[]>([]);
  const [readingHistory, setReadingHistory] = useState<ReadingHistory[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingFavorites, setTogglingFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const { data: borrowed } = await userDashboardService.getBorrowedBooks();
        const { data: reserved } = await userDashboardService.getReservedBooks();
        const { data: history } = await userDashboardService.getReadingHistory();
        const { data: notifications } = await userDashboardService.getNotifications();
        const { data: favoriteBooksDetails } = await userDashboardService.getFavoriteBooks();

        console.log('Dashboard Data:', { borrowed, reserved, history, notifications, favorites: favoriteBooksDetails });
        console.log('Borrowed books data:', borrowed);
        console.log('Reserved books data:', reserved);
        console.log('Reading history data:', history);
        console.log('Favorite books data:', favoriteBooksDetails);

        setBorrowedBooks(borrowed || []);
        setReservedBooks(reserved || []);
        setReadingHistory(history || []);
        setNotifications(notifications || []);
        setFavoriteBooks(favoriteBooksDetails || []);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
    // Removed automatic polling to reduce API calls
    // Data will refresh when user navigates between tabs or manually refreshes
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        staggerChildren: 0.1,
      },
    },
  };

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

  // Helper functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'due_soon':
        return <ClockIcon className="w-5 h-5 text-warning-500" />;
      case 'overdue':
        return <ExclamationCircleIcon className="w-5 h-5 text-error-500" />;
      case 'available':
        return <CheckCircleIcon className="w-5 h-5 text-success-500" />;
      default:
        return <BellIcon className="w-5 h-5 text-primary-500" />;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarIcon
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-neutral-300 dark:text-neutral-600'
        }`}
      />
    ));
  };

  const toggleFavorite = async (bookId: string) => {
    // Prevent multiple simultaneous toggles for the same book
    if (togglingFavorites.has(bookId)) {
      console.log('[UserDashboard] Already toggling favorite for book:', bookId);
      return;
    }

    try {
      console.log('[UserDashboard] ===== TOGGLE FAVORITE START =====');
      console.log('[UserDashboard] Book ID:', bookId);
      console.log('[UserDashboard] Current favorite books:', favoriteBooks.map(b => ({ id: b.id, _id: b._id, title: b.title })));
      
      // Mark this book as being toggled
      setTogglingFavorites(prev => new Set(prev).add(bookId));
      
      // Check if book is currently in favorites (check both id and _id)
      const isFavorite = favoriteBooks.some(book => book.id === bookId || book._id === bookId);
      console.log('[UserDashboard] Is currently favorite?', isFavorite);
      
      if (isFavorite) {
        console.log('[UserDashboard] Optimistically removing from favorites...');
        // Remove from favorites (check both id and _id)
        setFavoriteBooks(prev => prev.filter(book => book.id !== bookId && book._id !== bookId));
      } else {
        console.log('[UserDashboard] Will add to favorites (refetch after API call)');
      }
      
      // Call API
      console.log('[UserDashboard] Calling API: POST /users/books/' + bookId + '/favorite');
      const response = await userDashboardService.toggleFavorite(bookId);
      console.log('[UserDashboard] API Response:', JSON.stringify(response, null, 2));
      
      // Refetch favorite books to ensure consistency
      console.log('[UserDashboard] Refetching favorite books...');
      const { data: favoriteBooksDetails } = await userDashboardService.getFavoriteBooks();
      console.log('[UserDashboard] Refetched favorites count:', favoriteBooksDetails?.length);
      console.log('[UserDashboard] Refetched favorites:', favoriteBooksDetails?.map(b => ({ id: b.id, _id: b._id, title: b.title })));
      setFavoriteBooks(favoriteBooksDetails || []);
      console.log('[UserDashboard] ===== TOGGLE FAVORITE SUCCESS =====');
    } catch (err: any) {
      console.error('[UserDashboard] ===== TOGGLE FAVORITE ERROR =====');
      console.error('[UserDashboard] Error:', err);
      console.error('[UserDashboard] Error message:', err?.message);
      console.error('[UserDashboard] Error response:', err?.response?.data);
      // Revert optimistic update by refetching
      try {
        const { data: favoriteBooksDetails } = await userDashboardService.getFavoriteBooks();
        setFavoriteBooks(favoriteBooksDetails || []);
      } catch (refetchErr) {
        console.error('[UserDashboard] Failed to refetch favorites:', refetchErr);
      }
    } finally {
      // Remove the book from the toggling set
      setTogglingFavorites(prev => {
        const newSet = new Set(prev);
        newSet.delete(bookId);
        return newSet;
      });
      console.log('[UserDashboard] ===== TOGGLE FAVORITE END =====');
    }
  };

  const renewBook = async (bookId: string) => {
    try {
      const response = await userDashboardService.renewBook(bookId);
      if (response.success) {
        // Refresh the borrowed books list to get the updated status
        const { data: borrowed } = await userDashboardService.getBorrowedBooks();
        setBorrowedBooks(borrowed || []);
      } else {
        console.error('Failed to renew book:', response.message);
        // Optionally, show an error message to the user
      }
    } catch (err) {
      console.error('An error occurred while renewing the book', err);
      // Optionally, show an error message to the user
    }
  };

  const cancelReservation = async (reservationId: string) => {
    try {
      const response = await userDashboardService.cancelReservation(reservationId);
      if (response.success) {
        const reserved = await userDashboardService.getReservedBooks();
        setReservedBooks(reserved.data);
      } else {
        console.error('Failed to cancel reservation:', response.message);
      }
    } catch (err) {
      console.error('An error occurred while canceling the reservation', err);
    }
  };

  const rateBook = async (bookingId: string, rating: number) => {
    try {
      console.log('[UserDashboard] Rating book:', { bookingId, rating });
      const response = await userDashboardService.rateBook(bookingId, rating);
      console.log('[UserDashboard] Rate book response:', response);
      if (response.success) {
        const history = await userDashboardService.getReadingHistory();
        setReadingHistory(history.data);
        console.log('[UserDashboard] Reading history updated');
      } else {
        console.error('Failed to rate book:', response.message);
        alert('Failed to rate book: ' + response.message);
      }
    } catch (err: any) {
      console.error('An error occurred while rating the book', err);
      alert('Error rating book: ' + (err.message || 'Unknown error'));
    }
  };

  const [showNotifications, setShowNotifications] = useState(false);

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await userDashboardService.markNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-neutral-950 dark:via-slate-900 dark:to-neutral-900">
      {/* Modern Header with Glass Morphism */}
      <div className="sticky top-0 z-50 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-b border-neutral-200/50 dark:border-neutral-700/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo and User Info */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                  <BookOpenIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success-500 rounded-full border-2 border-white dark:border-neutral-900"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  {t('header.libraryName')}
                </h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Welcome back, <span className="font-medium text-primary-600 dark:text-primary-400">{user?.name}</span>
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Notifications Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200 group"
                >
                  <BellIcon className="w-6 h-6 text-neutral-600 dark:text-neutral-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse shadow-lg">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>
                
                {/* Notifications Dropdown Panel */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden z-50">
                    <div className="p-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
                      <h3 className="font-bold text-lg">Notifications</h3>
                      <p className="text-sm text-primary-100">{notifications.filter(n => !n.read).length} unread</p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <BellIcon className="w-12 h-12 mx-auto text-neutral-300 dark:text-neutral-600 mb-3" />
                          <p className="text-neutral-500 dark:text-neutral-400">No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => markNotificationAsRead(notification.id)}
                            className={`p-4 border-b border-neutral-100 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 cursor-pointer transition-colors ${
                              !notification.read ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 mt-1">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                                  {notification.title}
                                </p>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-2">
                                  {formatDate(notification.date)}
                                </p>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-2"></div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <ThemeToggle />
              <LanguageToggle />
              <Link
                to="/events-announcements"
                className="hidden md:flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg shadow-primary-500/30"
              >
                <CalendarDaysIcon className="w-5 h-5" />
                <span>Events</span>
              </Link>
              <Link
                to="/"
                className="flex items-center space-x-2 px-3 sm:px-4 py-2.5 rounded-xl border-2 border-neutral-200 dark:border-neutral-700 hover:border-primary-500 dark:hover:border-primary-500 text-neutral-700 dark:text-neutral-300 font-medium transition-all duration-200"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <button
                onClick={logout}
                className="px-3 sm:px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg shadow-red-500/30"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Modern Welcome Section with Stats Preview */}
          <motion.div variants={itemVariants} className="mb-8 sm:mb-10">
            <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-neutral-200/50 dark:border-neutral-700/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent mb-2">
                    Welcome back, {user?.name}! 👋
                  </h1>
                  <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400">
                    Manage your library account, track your books, and discover new reads.
                  </p>
                </div>
              </div>
              
              {/* Quick Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white shadow-lg">
                  <BookOpenIcon className="w-8 h-8 mb-2 opacity-80" />
                  <p className="text-2xl font-bold">{borrowedBooks.length}</p>
                  <p className="text-sm opacity-90">Borrowed</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 text-white shadow-lg">
                  <ClockIcon className="w-8 h-8 mb-2 opacity-80" />
                  <p className="text-2xl font-bold">{reservedBooks.length}</p>
                  <p className="text-sm opacity-90">Reserved</p>
                </div>
                <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-4 text-white shadow-lg">
                  <HeartIcon className="w-8 h-8 mb-2 opacity-80" />
                  <p className="text-2xl font-bold">{favoriteBooks.length}</p>
                  <p className="text-sm opacity-90">Favorites</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 text-white shadow-lg">
                  <CheckCircleIcon className="w-8 h-8 mb-2 opacity-80" />
                  <p className="text-2xl font-bold">{readingHistory.length}</p>
                  <p className="text-sm opacity-90">Completed</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Modern Navigation Tabs */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl rounded-2xl p-2 shadow-lg border border-neutral-200/50 dark:border-neutral-700/50">
              <nav className="flex space-x-2 overflow-x-auto scrollbar-hide">
                {[
                  { id: 'overview', label: 'Overview', icon: BookOpenIcon },
                  { id: 'borrowed', label: 'Borrowed', icon: ClockIcon },
                  { id: 'reserved', label: 'Reserved', icon: CalendarDaysIcon },
                  { id: 'history', label: 'History', icon: ArrowPathIcon },
                  { id: 'favorites', label: 'Favorites', icon: HeartIcon },
                  { id: 'books', label: 'Browse', icon: EyeIcon },
                  { id: 'profile', label: 'Profile', icon: UserCircleIcon },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-4 sm:px-6 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700/50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Tab Content */}
          <motion.div variants={itemVariants}>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="spinner w-8 h-8 mr-4"></div>
                <span className="text-neutral-600 dark:text-neutral-400">Loading your dashboard...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 bg-error-50 dark:bg-error-900/20 rounded-lg">
                <ExclamationCircleIcon className="w-12 h-12 text-error-500" />
                <p className="mt-4 text-lg font-semibold text-error-700 dark:text-error-300">
                  Something went wrong
                </p>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">{error}</p>
              </div>
            ) : (
              <div>
                {activeTab === 'overview' && (
                  <OverviewTab
                    borrowedBooks={borrowedBooks}
                    reservedBooks={reservedBooks}
                    readingHistory={readingHistory}
                    notifications={notifications}
                    favoriteBooksCount={favoriteBooks.length}
                  />
                )}
                {activeTab === 'borrowed' && (
                  <BorrowedBooksTab borrowedBooks={borrowedBooks} renewBook={renewBook} />
                )}
                {activeTab === 'reserved' && (
                  <ReservedBooksTab reservedBooks={reservedBooks} cancelReservation={cancelReservation} />
                )}
                {activeTab === 'history' && (
                  <ReadingHistoryTab readingHistory={readingHistory} rateBook={rateBook} />
                )}
                {activeTab === 'profile' && <ProfileTab />}
                {activeTab === 'books' && (
                  <BooksTab
                    favoriteBookIds={favoriteBooks.map(book => book.id || book._id || '')}
                    toggleFavorite={toggleFavorite}
                    togglingFavorites={togglingFavorites}
                  />
                )}
                {activeTab === 'favorites' && (
                  <FavoriteBooksTab
                    favoriteBooks={favoriteBooks}
                    toggleFavorite={toggleFavorite}
                    togglingFavorites={togglingFavorites}
                  />
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserDashboard;
