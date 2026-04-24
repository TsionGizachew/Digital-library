import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  FunnelIcon,
  CalendarDaysIcon,
  MapPinIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { AdminEventService, Event } from '../../services/AdminEventService';
import AddEventModal from '../../components/admin/AddEventModal';
import EditEventModal from '../../components/admin/EditEventModal';
import ViewEventModal from '../../components/admin/ViewEventModal';

const AdminEventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const { t } = useLanguage();
  const { user } = useAuth();

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await AdminEventService.getAllEvents();
      if (response.success) {
        setEvents(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch events');
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setEvents([]);
      toast.error(`Error fetching events: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddEvent = async (eventData: Omit<Event, 'id' | 'status' | 'image' | 'authorId' | 'authorName'> & { image?: File }) => {
    if (!user) {
      toast.error('You must be logged in to create an event.');
      return;
    }
    try {
      const newEventData = { ...eventData, authorId: user.id, authorName: user.name };
      const response = await AdminEventService.createEvent(newEventData);
      if (response.success) {
        setEvents(prevEvents => [response.data, ...prevEvents]);
        setIsAddModalOpen(false);
        toast.success('Event created successfully');
      } else {
        throw new Error(response.message || 'Failed to create event');
      }
    } catch (error) {
      console.error('Failed to create event:', error);
      toast.error(`Failed to create event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleUpdateEvent = async (eventData: Event & { imageFile?: File }) => {
    try {
      const { id, image, ...rest } = eventData;
      const dataToUpdate: Partial<Omit<Event, 'id' | 'image'>> & { image?: File } = rest;
      if (eventData.imageFile) {
        dataToUpdate.image = eventData.imageFile;
      }
      const response = await AdminEventService.updateEvent(id, dataToUpdate);
      if (response.success) {
        setEvents(events.map(event => (event.id === id ? response.data : event)));
        setIsEditModalOpen(false);
        toast.success('Event updated successfully');
      } else {
        throw new Error(response.message || 'Failed to update event');
      }
    } catch (error) {
      console.error('Failed to update event:', error);
      toast.error(`Failed to update event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const response = await AdminEventService.deleteEvent(eventId);
      if (response.success) {
        setEvents(events.filter(event => event.id !== eventId));
        toast.success('Event deleted successfully');
        setDeleteConfirmId(null);
      } else {
        throw new Error(response.message || 'Failed to delete event');
      }
    } catch (error) {
      console.error('Failed to delete event:', error);
      toast.error(`Failed to delete event: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setDeleteConfirmId(null);
    }
  };

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'upcoming':
        return 'bg-info-100 text-info-800 dark:bg-info-900/30 dark:text-info-400';
      case 'past':
        return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-400';
      case 'cancelled':
        return 'bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-400';
      default:
        return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-400';
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const truncateDescription = (description: string, maxLength: number = 100) => {
    return description.length > maxLength ? description.substring(0, maxLength) + '...' : description;
  };

  // Filter events by search and status
  const filteredEvents = events.filter(event => {
    const matchesSearch = !searchQuery ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || event.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => { fetchEvents(); }, 300);
    return () => clearTimeout(timeoutId);
  }, [fetchEvents]);

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
            {t('navigation.events')}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Manage library events and activities
          </p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="btn-primary flex items-center">
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Event
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Events', value: events?.length || 0, icon: CalendarDaysIcon, bgColor: 'bg-neutral-50 dark:bg-neutral-700/50', iconColor: 'text-neutral-600 dark:text-neutral-400', valueColor: 'text-neutral-900 dark:text-neutral-100' },
          { label: 'Upcoming', value: events?.filter(e => e.status === 'upcoming').length || 0, icon: ClockIcon, bgColor: 'bg-blue-50 dark:bg-blue-900/20', iconColor: 'text-blue-600 dark:text-blue-400', valueColor: 'text-blue-700 dark:text-blue-300' },
          { label: 'Past', value: events?.filter(e => e.status === 'past').length || 0, icon: CheckCircleIcon, bgColor: 'bg-neutral-50 dark:bg-neutral-700/50', iconColor: 'text-neutral-500 dark:text-neutral-400', valueColor: 'text-neutral-600 dark:text-neutral-400' },
          { label: 'Cancelled', value: events?.filter(e => e.status === 'cancelled').length || 0, icon: XCircleIcon, bgColor: 'bg-error-50 dark:bg-error-900/20', iconColor: 'text-error-600 dark:text-error-400', valueColor: 'text-error-700 dark:text-error-300' },
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
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="sm:w-40">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input-field"
            >
              <option value="">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="p-8 text-center col-span-full">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-neutral-600 dark:text-neutral-400">Loading events...</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredEvents.map((event) => {
              const isConfirmingDelete = deleteConfirmId === event.id;
              return (
                <motion.div
                  key={event.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="card flex flex-col justify-between overflow-hidden p-0"
                >
                  {/* Image with gradient overlay */}
                  {event.image && (
                    <div className="relative">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-44 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      <div className="absolute bottom-3 left-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-4 flex-1">
                    {!event.image && (
                      <div className="flex justify-between items-start mb-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                      </div>
                    )}
                    <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-1 leading-snug">
                      {event.title}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 leading-relaxed">
                      {truncateDescription(event.description, 120)}
                    </p>
                    <div className="space-y-1.5">
                      <div className="flex items-center text-sm text-neutral-700 dark:text-neutral-300">
                        <CalendarDaysIcon className="w-4 h-4 mr-2 text-neutral-400 flex-shrink-0" />
                        <span>{formatDateTime(event.date)}</span>
                      </div>
                      <div className="flex items-center text-sm text-neutral-700 dark:text-neutral-300">
                        <MapPinIcon className="w-4 h-4 mr-2 text-neutral-400 flex-shrink-0" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-3 border-t border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate mr-2">
                      by {event.organizer}
                    </div>
                    {isConfirmingDelete ? (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">Delete?</span>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
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
                          onClick={() => { setSelectedEvent(event); setIsViewModalOpen(true); }}
                          className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          title="View Details"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => { setSelectedEvent(event); setIsEditModalOpen(true); }}
                          className="text-neutral-600 dark:text-neutral-400 hover:text-warning-600 dark:hover:text-warning-400 transition-colors"
                          title="Edit Event"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(event.id)}
                          className="text-neutral-600 dark:text-neutral-400 hover:text-error-600 dark:hover:text-error-400 transition-colors"
                          title="Delete Event"
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

      {filteredEvents.length === 0 && !loading && (
        <div className="text-center py-12">
          <FunnelIcon className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
            No events found
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            {searchQuery || selectedStatus
              ? 'Try adjusting your search criteria'
              : 'Start by creating your first event'}
          </p>
        </div>
      )}

      <AddEventModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddEvent={handleAddEvent}
      />
      {selectedEvent && (
        <>
          <EditEventModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onUpdateEvent={handleUpdateEvent}
            event={selectedEvent}
          />
          <ViewEventModal
            isOpen={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
            event={selectedEvent}
          />
        </>
      )}
    </div>
  );
};

export default AdminEventsPage;
