import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarDaysIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Header from '../components/home/Header';
import Footer from '../components/common/Footer';
import { eventService, Event } from '../services/eventService';

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await eventService.getAllEvents();
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':  return 'bg-primary-500 text-white shadow-md';
      case 'ongoing':   return 'bg-brand-500 text-white shadow-md';
      case 'completed': return 'bg-neutral-500 text-white shadow-md';
      case 'cancelled': return 'bg-error-500 text-white shadow-md';
      default:          return 'bg-neutral-400 text-white shadow-md';
    }
  };



  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
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

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8" role="main" aria-label="Library events">
        {/* Enhanced Page Header - Mobile Optimized */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
            <div className="h-1 w-8 sm:w-10 bg-gradient-to-r from-primary-500 to-brand-500 rounded-full" aria-hidden="true"></div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-neutral-100">
              Library Events
            </h1>
          </div>
          <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 max-w-2xl leading-relaxed">
            Join our community events, workshops, and programs. Connect, learn, and grow together with fellow book lovers and knowledge seekers.
          </p>
        </div>

        {/* Loading State - Mobile Optimized */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" role="status" aria-label="Loading events">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="card animate-pulse" aria-hidden="true">
                <div className="h-40 sm:h-48 bg-neutral-200 dark:bg-neutral-700 rounded-lg mb-3 sm:mb-4"></div>
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4"></div>
              </div>
            ))}
            <span className="sr-only">Loading events...</span>
          </div>
        )}

        {!loading && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            role="list"
            aria-label={`${events.length} events found`}
          >
            {events.map((event) => (
              <motion.div
                key={event.id}
                variants={itemVariants}
                className="card-hover group cursor-pointer touch-manipulation"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                role="listitem"
                tabIndex={0}
                aria-label={`${event.title}, ${event.status}, ${formatDate(event.date)}, ${event.location}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    // Handle event selection
                  }
                }}
              >
                {/* Enhanced Event Image/Placeholder - Mobile Optimized */}
                <div className="relative h-40 sm:h-48 bg-gradient-to-br from-primary-50 to-brand-50 dark:from-primary-950 dark:to-brand-950 rounded-lg mb-3 sm:mb-4 overflow-hidden shadow-md group-hover:shadow-xl transition-shadow duration-300" aria-hidden="true">
                  {event.image ? (
                    <img src={event.image} alt={`${event.title} event image`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="bg-gradient-to-br from-primary-500 to-brand-500 rounded-full p-3 sm:p-4 mx-auto mb-2 shadow-lg">
                          <CalendarDaysIcon className="w-8 h-8 sm:w-12 sm:h-12 text-white" aria-hidden="true" />
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400">Event Image</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Enhanced Status Badge - Mobile Optimized */}
                  <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                    <span className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-bold rounded-full capitalize shadow-lg ${getStatusColor(event.status)}`} role="status" aria-label={`Event status: ${event.status}`}>
                      {event.status}
                    </span>
                  </div>
                </div>

                {/* Enhanced Event Info - Mobile Optimized */}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200 line-clamp-2">
                    {event.title}
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3 leading-relaxed">
                    {event.description}
                  </p>

                  {/* Enhanced Event Details - Mobile Optimized */}
                  <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                    <div className="flex items-center text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800 rounded-lg p-1.5 sm:p-2">
                      <CalendarDaysIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0 text-primary-500" />
                      <span className="font-medium truncate">{formatDate(event.date)}</span>
                    </div>
                    
                    <div className="flex items-center text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800 rounded-lg p-1.5 sm:p-2">
                      <MapPinIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0 text-brand-500" />
                      <span className="font-medium truncate">{event.location}</span>
                    </div>
                  </div>

                  {/* Enhanced Organizer - Mobile Optimized */}
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 bg-primary-50 dark:bg-primary-950 rounded-lg p-1.5 sm:p-2">
                    <span className="font-semibold">Organized by:</span> <span className="truncate inline-block max-w-[calc(100%-90px)] align-bottom">{event.organizer}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && events.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <CalendarDaysIcon className="w-12 h-12 sm:w-16 sm:h-16 text-neutral-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
              No events found
            </h3>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 px-4">
              No events are currently scheduled.
            </p>
          </div>
        )}


      </main>
      <Footer />
    </div>
  );
};

export default EventsPage;
