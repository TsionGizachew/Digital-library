import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MegaphoneIcon } from '@heroicons/react/24/outline';
import Header from '../components/home/Header';
import Footer from '../components/common/Footer';
import { announcementService, Announcement } from '../services/announcementService';

const AnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      try {
        const response = await announcementService.getAllAnnouncements();
        console.log('Announcements page response:', response);
        const published = Array.isArray(response.data)
          ? response.data.filter(a => a.status === 'published')
          : [];
        console.log('Published announcements count:', published.length);
        setAnnouncements(published);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': 
        return 'bg-error-500 text-white shadow-lg shadow-error-500/30';
      case 'high': 
        return 'bg-warning-500 text-white shadow-lg shadow-warning-500/30';
      case 'medium': 
        return 'bg-primary-500 text-white shadow-lg shadow-primary-500/30';
      default: 
        return 'bg-neutral-400 text-white shadow-lg shadow-neutral-400/30';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8" role="main" aria-label="Library announcements">
        {/* Enhanced Page Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
            <div className="h-1 w-8 sm:w-12 bg-gradient-to-r from-cultural-ethiopian-green-500 to-cultural-ethiopian-yellow-500 rounded-full" aria-hidden="true"></div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cultural-ethiopian-green-600 to-cultural-ethiopian-yellow-600 bg-clip-text text-transparent">
              Library Announcements
            </h1>
          </div>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
            Stay updated with the latest library news, updates, and important information from our community.
          </p>
        </div>

        {/* Loading State - Mobile Optimized */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" role="status" aria-label="Loading announcements">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="card animate-pulse" aria-hidden="true">
                <div className="h-40 sm:h-48 bg-neutral-200 dark:bg-neutral-700 rounded-lg mb-3 sm:mb-4"></div>
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4"></div>
              </div>
            ))}
            <span className="sr-only">Loading announcements...</span>
          </div>
        )}

        {!loading && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            role="list"
            aria-label={`${announcements.length} announcements found`}
          >
            {announcements.map((announcement) => (
              <motion.div
                key={announcement.id}
                variants={itemVariants}
                className="card-hover group cursor-pointer flex flex-col h-full touch-manipulation"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                role="listitem"
                tabIndex={0}
                aria-label={`${announcement.title}, Priority: ${announcement.priority}, Published: ${new Date(announcement.publishDate).toLocaleDateString()}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    // Handle announcement selection
                  }
                }}
              >
                {/* Enhanced Announcement Image/Placeholder */}
                {announcement.image ? (
                  <div className="relative h-40 sm:h-48 mb-3 sm:mb-4 rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-shadow duration-300">
                    <img src={announcement.image} alt={`${announcement.title} announcement image`} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="relative h-40 sm:h-48 bg-gradient-to-br from-cultural-ethiopian-green-100 via-cultural-ethiopian-yellow-50 to-cultural-ethiopian-green-100 dark:from-cultural-earth-900 dark:to-cultural-heritage-900 rounded-lg mb-3 sm:mb-4 overflow-hidden shadow-md group-hover:shadow-xl transition-shadow duration-300" aria-hidden="true">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="bg-gradient-to-br from-cultural-ethiopian-green-500 to-cultural-ethiopian-yellow-500 rounded-full p-3 sm:p-4 mx-auto mb-2 shadow-lg">
                          <MegaphoneIcon className="w-8 h-8 sm:w-12 sm:h-12 text-white" aria-hidden="true" />
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400">Announcement</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Enhanced Priority Badge and Icon */}
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <span className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-bold rounded-full capitalize ${getPriorityColor(announcement.priority)}`} role="status" aria-label={`Priority: ${announcement.priority}`}>
                    {announcement.priority}
                  </span>
                  <div className="bg-gradient-to-br from-cultural-ethiopian-green-500 to-cultural-ethiopian-yellow-500 rounded-full p-1.5 sm:p-2 shadow-md" aria-hidden="true">
                    <MegaphoneIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                </div>
                
                {/* Enhanced Title */}
                <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2 group-hover:text-cultural-ethiopian-green-600 dark:group-hover:text-cultural-ethiopian-green-400 transition-colors duration-200 line-clamp-2 break-words">
                  {announcement.title}
                </h3>
                
                {/* Enhanced Content */}
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-3 sm:mb-4 line-clamp-3 sm:line-clamp-4 leading-relaxed break-words flex-grow">
                  {announcement.content}
                </p>
                
                {/* Enhanced Footer with Date and Author */}
                <div className="flex items-center justify-between gap-2 text-xs text-neutral-500 dark:text-neutral-400 mt-auto pt-3 border-t border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center gap-1.5 bg-neutral-50 dark:bg-neutral-800 rounded-lg px-2 py-1">
                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cultural-ethiopian-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium">{new Date(announcement.publishDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-gradient-to-r from-cultural-ethiopian-green-50 to-cultural-ethiopian-yellow-50 dark:from-neutral-800 dark:to-neutral-700 rounded-lg px-2 py-1">
                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cultural-ethiopian-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-medium truncate max-w-[100px]">{announcement.authorName}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && announcements.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <div className="bg-gradient-to-br from-cultural-ethiopian-green-500 to-cultural-ethiopian-yellow-500 rounded-full p-4 sm:p-5 mx-auto mb-3 sm:mb-4 w-fit shadow-xl">
              <MegaphoneIcon className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
              No announcements found
            </h3>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 px-4">
              No announcements are currently published. Check back soon for updates!
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AnnouncementsPage;
