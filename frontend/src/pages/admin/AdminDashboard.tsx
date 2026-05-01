import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { TabType, NotificationSettings } from '../../types/dashboard';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useDashboardActions } from '../../hooks/useDashboardActions';
import { bookService } from '../../services/bookService';
import toast from 'react-hot-toast';

// Components
import DashboardNavigation from '../../components/admin/DashboardNavigation';
import DashboardOverview from '../../components/admin/DashboardOverview';
import AdminBorrowingPage from './AdminBorrowingPage';
import AnnouncementsTab from '../../components/admin/AnnouncementsTab';
import ProfileTab from '../../components/admin/ProfileTab';
import SimpleAddBookModal from '../../components/admin/SimpleAddBookModal';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  // State management
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    overdueAlerts: true,
    weeklyReports: true
  });
  const [showAddBookModal, setShowAddBookModal] = useState(false);

  // Custom hooks
  const {
    overviewData,
    borrowedBooks,
    reservedBooks,
    readingHistory,
    announcements,
    loading,
    error
  } = useDashboardData(activeTab);

  const {
    actionLoading,
    handleSendReminder,
    handleRenewBook,
    handleReturnBook,
    handleCancelReservation,
    handleIssueBook,
    handleCreateAnnouncement,
    handleEditAnnouncement,
    handleDeleteAnnouncement,
    handleToggleAnnouncementStatus
  } = useDashboardActions();

  // Helper functions
  const handleShowAddBookModal = () => setShowAddBookModal(true);
  const handleCloseAddBookModal = () => setShowAddBookModal(false);

  // Handle book submission
  const handleAddBookSubmit = async (bookData: any) => {
    try {
      console.log('📚 Submitting book data:', bookData);

      // Transform data to match backend expectations
      const transformedData = {
        title: bookData.title?.trim(),
        author: bookData.author?.trim(),
        description: bookData.description?.trim() || 'No description provided',
        category: bookData.category,
        code: bookData.code?.trim() || `BK-${Date.now()}`,
        isbn: bookData.isbn?.trim() || undefined,
        publisher: undefined,
        publishedDate: undefined,
        pageCount: undefined,
        language: bookData.language || 'English',
        tags: [],
        coverImage: undefined,
        availability: {
          totalCopies: parseInt(bookData.totalCopies?.toString() || '1'),
          availableCopies: parseInt(bookData.totalCopies?.toString() || '1'),
        },
        location: {
          shelf: bookData.shelfNumber?.trim() || 'A-1',
          section: bookData.section?.trim() || 'General',
          floor: 'Ground Floor',
        },
      };

      console.log('📚 Transformed book data:', transformedData);

      // Use bookService which handles authentication automatically
      const response = await bookService.createBook(transformedData as any);
      
      console.log('📚 Book creation response:', response);

      if (response.success) {
        toast.success('Book added successfully!');
        handleCloseAddBookModal();
      } else {
        toast.error(response.message || 'Failed to add book');
      }
    } catch (error: any) {
      console.error('📚 Error adding book:', error);
      
      if (error.response?.status === 401) {
        toast.error('Authentication failed. Please log in again.');
      } else if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || 'Validation error. Please check all required fields.';
        toast.error(errorMessage);
      } else {
        toast.error('Failed to add book. Please try again.');
      }
    }
  };

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-500 text-xl mb-4">Error</div>
            <p className="text-neutral-600 dark:text-neutral-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary mt-4"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>

        {/* Content */}
        {activeTab === 'overview' && (
          <DashboardOverview
            overviewData={overviewData}
            loading={loading}
            onIssueBook={handleIssueBook}
            onShowAddBookModal={handleShowAddBookModal}
          />
        )}

        {activeTab === 'books' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                Manage Books
              </h2>
              <button
                onClick={handleShowAddBookModal}
                className="btn-primary flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <span>Add New Book</span>
              </button>
            </div>
            <div className="text-center py-12">
              <p className="text-neutral-600 dark:text-neutral-400">
                Books management interface will be implemented here.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                Manage Users
              </h2>
              <button className="btn-primary flex items-center justify-center space-x-2 text-sm sm:text-base">
                <span>Add New User</span>
              </button>
            </div>
            <div className="text-center py-12">
              <p className="text-neutral-600 dark:text-neutral-400">
                User management interface will be implemented here.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'borrowing' && <AdminBorrowingPage />}

        {activeTab === 'announcements' && (
          <AnnouncementsTab
            announcements={announcements}
            loading={loading}
            onCreateAnnouncement={handleCreateAnnouncement}
            onEditAnnouncement={handleEditAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
            onToggleStatus={handleToggleAnnouncementStatus}
          />
        )}

        {activeTab === 'events' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                Events Management
              </h2>
              <button className="btn-primary flex items-center justify-center space-x-2 text-sm sm:text-base">
                <span>Create New Event</span>
              </button>
            </div>
            <div className="text-center py-12">
              <p className="text-neutral-600 dark:text-neutral-400">
                Events management interface will be implemented here.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              System Settings
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Library Settings */}
              <div className="card">
                <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3 sm:mb-4">
                  Library Settings
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Library Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Yeka Sub-City Library"
                      className="input-field text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Default Loan Period (days)
                    </label>
                    <input
                      type="number"
                      defaultValue="14"
                      className="input-field text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>

              {/* User Profile Settings */}
              <div className="card">
                <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3 sm:mb-4">
                  Admin Profile
                </h3>
                <ProfileTab
                  user={user}
                  notifications={notifications}
                  setNotifications={setNotifications}
                />
              </div>
            </div>
          </div>
        )}

      {/* Add Book Modal */}
      {showAddBookModal && (
        <SimpleAddBookModal
          isOpen={showAddBookModal}
          onClose={handleCloseAddBookModal}
          onSubmit={handleAddBookSubmit}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
