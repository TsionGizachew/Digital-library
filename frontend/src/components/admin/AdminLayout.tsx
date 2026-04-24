import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  BookOpenIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  SpeakerWaveIcon,
  CalendarDaysIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../common/ThemeToggle';
import LanguageToggle from '../common/LanguageToggle';
import NotificationBell from '../common/Notification';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, currentPage = 'dashboard' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/admin/profile');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  // Get user initials for avatar
  const getUserInitials = (name?: string | null): string => {
    if (!name) return 'A';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const sidebarNavigation = [
    { name: t('navigation.dashboard'), href: '/admin', icon: HomeIcon, id: 'dashboard' },
    { name: t('admin.books.title'), href: '/admin/books', icon: BookOpenIcon, id: 'books' },
    { name: t('admin.users.title'), href: '/admin/users', icon: UsersIcon, id: 'users' },
    { name: t('admin.borrowing.title'), href: '/admin/borrowing', icon: ClipboardDocumentListIcon, id: 'borrowing' },
    { name: t('navigation.announcements'), href: '/admin/announcements', icon: SpeakerWaveIcon, id: 'announcements' },
    { name: t('navigation.events'), href: '/admin/events', icon: CalendarDaysIcon, id: 'events' },
    { name: t('navigation.settings'), href: '/admin/settings', icon: Cog6ToothIcon, id: 'settings' },
  ];

  const sidebarVariants = {
    open: {
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
    closed: {
      x: '-100%',
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
  };

  const overlayVariants = {
    open: { opacity: 1, transition: { duration: 0.2 } },
    closed: { opacity: 0, transition: { duration: 0.2 } },
  };

  const SidebarContent: React.FC<{ mobile?: boolean }> = ({ mobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Gradient top bar */}
      <div className="h-1 bg-gradient-to-r from-primary-600 to-primary-400 flex-shrink-0" />

      {/* Logo / Header */}
      <div className={`flex items-center justify-between px-4 py-4 border-b border-neutral-200 dark:border-neutral-700 flex-shrink-0 ${mobile ? '' : 'pt-5'}`}>
        <div className="flex items-center min-w-0">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
            <BookOpenIcon className="w-5 h-5 text-white" />
          </div>
          <div className="ml-3 min-w-0">
            <h1 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
              {t('header.libraryName')}
            </h1>
            <p className="text-xs text-primary-500 dark:text-primary-400 font-medium">Admin Panel</p>
          </div>
        </div>
        {mobile && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
        {sidebarNavigation.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                navigate(item.href);
                if (mobile) setSidebarOpen(false);
              }}
              className={`w-full group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-l-4 border-primary-500 pl-2'
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700/60 border-l-4 border-transparent pl-2'
              }`}
            >
              <item.icon
                className={`mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200 ${
                  isActive
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-600 dark:group-hover:text-neutral-400'
                }`}
              />
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* User info section at bottom */}
      <div className="flex-shrink-0 border-t border-neutral-200 dark:border-neutral-700 p-3">
        {showLogoutConfirm ? (
          <div className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg p-3">
            <div className="flex items-center mb-2">
              <ExclamationTriangleIcon className="w-4 h-4 text-error-600 dark:text-error-400 mr-2 flex-shrink-0" />
              <p className="text-xs font-medium text-error-800 dark:text-error-300">Confirm logout?</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleLogout}
                className="flex-1 text-xs bg-error-600 hover:bg-error-700 text-white font-medium py-1.5 px-2 rounded-md transition-colors"
              >
                Logout
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 text-xs bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300 font-medium py-1.5 px-2 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleProfileClick}
              className="flex items-center gap-2 flex-1 min-w-0 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold shadow-sm">
                {getUserInitials(user?.name)}
              </div>
              <div className="min-w-0 text-left">
                <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {user?.name || 'Admin'}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                  {user?.email || 'admin@library.com'}
                </p>
              </div>
            </button>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="p-2 rounded-lg text-neutral-400 hover:text-error-600 dark:hover:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors flex-shrink-0"
              title="Logout"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Page title icon map
  const pageIcons: Record<string, React.ElementType> = {
    dashboard: HomeIcon,
    books: BookOpenIcon,
    users: UsersIcon,
    borrowing: ClipboardDocumentListIcon,
    announcements: SpeakerWaveIcon,
    events: CalendarDaysIcon,
    settings: Cog6ToothIcon,
    profile: UsersIcon,
  };
  const PageIcon = pageIcons[currentPage] || HomeIcon;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow overflow-y-auto bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 shadow-sm">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 shadow-xl lg:hidden"
          >
            <SidebarContent mobile />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-14 sm:h-16 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 shadow-sm">
          <button
            type="button"
            className="px-3 sm:px-4 border-r border-neutral-200 dark:border-neutral-700 text-neutral-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <div className="flex-1 px-3 sm:px-4 flex justify-between items-center">
            {/* Page title with icon */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="hidden sm:flex items-center justify-center w-7 h-7 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex-shrink-0">
                <PageIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 capitalize truncate">
                  {t(`navigation.${currentPage}`)}
                </h2>
                <p className="hidden sm:block text-xs text-neutral-500 dark:text-neutral-400 truncate">
                  Admin / {t(`navigation.${currentPage}`)}
                </p>
              </div>
            </div>

            <div className="ml-2 sm:ml-4 flex items-center space-x-1 sm:space-x-2">
              <NotificationBell />
              <ThemeToggle />
              <LanguageToggle />

              {/* User avatar button (desktop) */}
              <button
                onClick={handleProfileClick}
                className="hidden sm:flex items-center gap-2 p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                title="View Profile"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-xs font-bold">
                  {getUserInitials(user?.name)}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-4 sm:py-6">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
