import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { AdminAnnouncementService, Announcement } from '../../services/AdminAnnouncementService';
import { useAuth } from '../../contexts/AuthContext';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  FunnelIcon,
  SpeakerWaveIcon,
  ExclamationCircleIcon,
  CheckIcon,
  XMarkIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';
import AddAnnouncementModal from '../../components/admin/AddAnnouncementModal';
import ViewAnnouncementModal from '../../components/admin/ViewAnnouncementModal';
import EditAnnouncementModal from '../../components/admin/EditAnnouncementModal';

const AdminAnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const { t } = useLanguage();
  const { user } = useAuth();

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      const params: { [key: string]: string } = { limit: '50' };
      if (searchQuery) params.search = searchQuery;
      if (selectedStatus) params.status = selectedStatus;
      if (selectedType) params.type = selectedType;

      const announcementsData = await AdminAnnouncementService.getAnnouncements(params);
      if (announcementsData.success) {
        setAnnouncements(announcementsData.data);
      } else {
        setAnnouncements([]);
      }
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
      setAnnouncements([]);
      toast.error(`Error fetching announcements: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedStatus, selectedType]);

  const handleAddAnnouncement = async (
    announcementData: Omit<Announcement, 'id' | 'status' | 'publishDate' | 'createdAt' | 'updatedAt' | 'authorId' | 'authorName' | 'image'> & { image?: File }
  ) => {
    if (!user) {
      toast.error('You must be logged in to create an announcement.');
      return;
    }
    try {
      const fullAnnouncementData = {
        ...announcementData,
        authorId: user.id,
        authorName: user.name,
      };
      const newAnnouncementResponse = await AdminAnnouncementService.addAnnouncement(
        fullAnnouncementData as Omit<Announcement, 'id' | 'status' | 'publishDate' | 'image'> & { image?: File }
      );
      if (newAnnouncementResponse.success) {
        setAnnouncements(prev => [newAnnouncementResponse.data, ...prev]);
        setIsAddModalOpen(false);
        toast.success('Announcement created successfully');
      } else {
        toast.error(`Failed to create announcement: ${newAnnouncementResponse.message}`);
      }
    } catch (error) {
      console.error('Failed to create announcement:', error);
      toast.error(`Failed to create announcement: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleViewAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setIsViewModalOpen(true);
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setIsEditModalOpen(true);
  };

  const handleUpdateAnnouncement = async (id: string, data: Omit<Partial<Announcement>, 'image'> & { image?: File }) => {
    try {
      const response = await AdminAnnouncementService.updateAnnouncement(id, data);
      if (response.success) {
        setAnnouncements(prev =>
          prev.map(a => (a.id === id ? response.data : a))
        );
        setIsEditModalOpen(false);
        setSelectedAnnouncement(null);
        toast.success('Announcement updated successfully');
      } else {
        toast.error(`Failed to update announcement: ${response.message}`);
      }
    } catch (error) {
      console.error('Failed to update announcement:', error);
      toast.error(`Failed to update announcement: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeleteAnnouncement = async (announcementId: string) => {
    try {
      await AdminAnnouncementService.deleteAnnouncement(announcementId);
      setAnnouncements(prev => prev.filter(a => a.id !== announcementId));
      toast.success('Announcement deleted successfully');
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Failed to delete announcement:', error);
      toast.error(`Failed to delete announcement: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setDeleteConfirmId(null);
    }
  };

  const handleToggleStatus = async (announcementId: string, currentStatus: string) => {
    try {
      const updatedAnnouncement = await AdminAnnouncementService.toggleAnnouncementStatus(announcementId, currentStatus);
      setAnnouncements(prev =>
        prev.map(a => (a.id === announcementId ? { ...a, status: updatedAnnouncement.status } : a))
      );
      toast.success(`Announcement ${updatedAnnouncement.status === 'published' ? 'published' : 'unpublished'} successfully`);
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error(`Failed to update status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getTypeColor = (type: Announcement['type']) => {
    switch (type) {
      case 'info': return 'bg-info-100 text-info-800 dark:bg-info-900/30 dark:text-info-400';
      case 'warning': return 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-400';
      case 'success': return 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400';
      case 'error': return 'bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-400';
      default: return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-400';
    }
  };

  const getStatusColor = (status: Announcement['status']) => {
    switch (status) {
      case 'published': return 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400';
      case 'draft': return 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-400';
      case 'archived': return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-400';
      default: return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-400';
    }
  };

  const getPriorityIcon = (priority: Announcement['priority']) => {
    switch (priority) {
      case 'urgent': return ExclamationCircleIcon;
      case 'high': return ExclamationCircleIcon;
      default: return SpeakerWaveIcon;
    }
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => { fetchAnnouncements(); }, 300);
    return () => clearTimeout(timeoutId);
  }, [fetchAnnouncements]);

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
            {t('navigation.announcements')}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Manage library announcements and notifications
          </p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="btn-primary flex items-center">
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Announcement
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: announcements?.length || 0, icon: SpeakerWaveIcon, bgColor: 'bg-neutral-50 dark:bg-neutral-700/50', iconColor: 'text-neutral-600 dark:text-neutral-400', valueColor: 'text-neutral-900 dark:text-neutral-100' },
          { label: 'Published', value: announcements?.filter(a => a.status === 'published').length || 0, icon: CheckCircleIcon, bgColor: 'bg-success-50 dark:bg-success-900/20', iconColor: 'text-success-600 dark:text-success-400', valueColor: 'text-success-700 dark:text-success-300' },
          { label: 'Drafts', value: announcements?.filter(a => a.status === 'draft').length || 0, icon: PencilIcon, bgColor: 'bg-warning-50 dark:bg-warning-900/20', iconColor: 'text-warning-600 dark:text-warning-400', valueColor: 'text-warning-700 dark:text-warning-300' },
          { label: 'Urgent', value: announcements?.filter(a => a.priority === 'urgent').length || 0, icon: ExclamationCircleIcon, bgColor: 'bg-error-50 dark:bg-error-900/20', iconColor: 'text-error-600 dark:text-error-400', valueColor: 'text-error-700 dark:text-error-300' },
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
                placeholder="Search announcements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="sm:w-40">
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="input-field">
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="sm:w-40">
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="input-field">
              <option value="">All Types</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="success">Success</option>
              <option value="error">Error</option>
            </select>
          </div>
        </div>
      </div>

      {/* Announcements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="p-8 text-center col-span-full">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-neutral-600 dark:text-neutral-400">Loading announcements...</p>
          </div>
        ) : (
          <AnimatePresence>
            {announcements?.map((announcement) => {
              const PriorityIcon = getPriorityIcon(announcement.priority);
              const isConfirmingDelete = deleteConfirmId === announcement.id;
              return (
                <motion.div
                  key={announcement.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="card flex flex-col justify-between"
                >
                  <div>
                    {announcement.image && (
                      <img
                        src={announcement.image}
                        alt={announcement.title}
                        className="w-full h-40 object-cover rounded-t-lg mb-4 -mx-6 -mt-6 w-[calc(100%+3rem)]"
                        style={{ width: 'calc(100% + 3rem)', marginLeft: '-1.5rem', marginTop: '-1.5rem', borderRadius: '0.75rem 0.75rem 0 0' }}
                      />
                    )}
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 leading-snug">
                          {announcement.title}
                        </h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize flex-shrink-0 ${getStatusColor(announcement.status)}`}>
                          {announcement.status}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
                        {truncateContent(announcement.content, 120)}
                      </p>
                      <div className="flex items-center mt-3">
                        <PriorityIcon
                          className={`w-4 h-4 mr-2 flex-shrink-0 ${
                            announcement.priority === 'urgent' ? 'text-error-500'
                            : announcement.priority === 'high' ? 'text-warning-500'
                            : 'text-neutral-400'
                          }`}
                        />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300 capitalize">
                          {announcement.priority}
                        </span>
                        <span className={`ml-auto inline-flex px-2 py-0.5 text-xs font-medium rounded-full capitalize ${getTypeColor(announcement.type)}`}>
                          {announcement.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate mr-2">
                      by {announcement.authorName}
                    </div>
                    {isConfirmingDelete ? (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">Delete?</span>
                        <button
                          onClick={() => handleDeleteAnnouncement(announcement.id)}
                          className="inline-flex items-center p-1 rounded bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-400 hover:bg-error-200 transition-colors"
                          title="Confirm Delete"
                        >
                          <CheckIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="inline-flex items-center p-1 rounded bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 transition-colors"
                          title="Cancel"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <button
                          onClick={() => handleViewAnnouncement(announcement)}
                          className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          title="View Details"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEditAnnouncement(announcement)}
                          className="text-neutral-600 dark:text-neutral-400 hover:text-warning-600 dark:hover:text-warning-400 transition-colors"
                          title="Edit Announcement"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(announcement.id)}
                          className="text-neutral-600 dark:text-neutral-400 hover:text-error-600 dark:hover:text-error-400 transition-colors"
                          title="Delete Announcement"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {announcements?.length === 0 && !loading && (
        <div className="text-center py-12">
          <FunnelIcon className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
            No announcements found
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            {searchQuery || selectedStatus || selectedType
              ? 'Try adjusting your search criteria'
              : 'Start by creating your first announcement'}
          </p>
        </div>
      )}

      {/* Modals */}
      <AddAnnouncementModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddAnnouncement={handleAddAnnouncement}
      />
      <ViewAnnouncementModal
        isOpen={isViewModalOpen}
        onClose={() => { setIsViewModalOpen(false); setSelectedAnnouncement(null); }}
        announcement={selectedAnnouncement}
      />
      <EditAnnouncementModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setSelectedAnnouncement(null); }}
        onUpdateAnnouncement={handleUpdateAnnouncement}
        announcement={selectedAnnouncement}
      />
    </div>
  );
};

export default AdminAnnouncementsPage;
