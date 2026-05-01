import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ReadingHistory } from '../../services/userDashboardService';
import { ArrowPathIcon, ClockIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface ReadingHistoryTabProps {
  readingHistory: ReadingHistory[];
  rateBook: (historyId: string, rating: number) => Promise<void>;
}

const ReadingHistoryTab: React.FC<ReadingHistoryTabProps> = ({ readingHistory, rateBook }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [hoveredRating, setHoveredRating] = useState<{ [key: string]: number | null }>({});

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

  const handleRatingClick = (historyId: string, rating: number) => {
    const confirmed = window.confirm(`Are you sure you want to give ${rating} star${rating > 1 ? 's' : ''}?`);
    if (confirmed) {
      rateBook(historyId, rating);
    }
  };

  const renderStars = (rating: number | undefined, historyId: string) => {
    const currentHover = hoveredRating[historyId];
    const hasRating = rating && rating > 0;
    
    return (
      <div 
        className="flex gap-1"
        onMouseLeave={() => !hasRating && setHoveredRating({ ...hoveredRating, [historyId]: null })}
      >
        {Array.from({ length: 5 }, (_, index) => {
          const starNumber = index + 1;
          const isFilled = currentHover ? starNumber <= currentHover : rating && starNumber <= rating;
          
          return isFilled ? (
            <StarSolidIcon
              key={index}
              className={`w-5 h-5 text-yellow-400 transition-colors ${
                hasRating ? 'cursor-not-allowed opacity-100' : 'cursor-pointer hover:text-yellow-500'
              }`}
              onMouseEnter={() => !hasRating && setHoveredRating({ ...hoveredRating, [historyId]: starNumber })}
              onClick={() => !hasRating && handleRatingClick(historyId, starNumber)}
            />
          ) : (
            <StarOutlineIcon
              key={index}
              className={`w-5 h-5 transition-colors ${
                hasRating 
                  ? 'text-neutral-300 dark:text-neutral-600 cursor-not-allowed' 
                  : 'text-neutral-300 dark:text-neutral-600 cursor-pointer hover:text-yellow-400'
              }`}
              onMouseEnter={() => !hasRating && setHoveredRating({ ...hoveredRating, [historyId]: starNumber })}
              onClick={() => !hasRating && handleRatingClick(historyId, starNumber)}
            />
          );
        })}
      </div>
    );
  };

  // Pagination logic
  const totalPages = Math.ceil(readingHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBooks = readingHistory.slice(startIndex, endIndex);

  return (
    <motion.div variants={itemVariants}>
      <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-neutral-200/50 dark:border-neutral-700/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center">
            <ArrowPathIcon className="w-7 h-7 mr-3 text-primary-500" />
            Reading History
          </h3>
          <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold">
            {readingHistory.length} Books
          </span>
        </div>
        
        {readingHistory.length > 0 ? (
          <>
            <div className="space-y-4">
              {currentBooks.map((book) => (
                <div key={book.id} className="bg-white dark:bg-neutral-800 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-200 border border-neutral-100 dark:border-neutral-700">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-4 flex-1">
                      {book.coverImage ? (
                        <img src={book.coverImage} alt={book.title} className="w-16 h-20 object-cover rounded-lg shadow-md" />
                      ) : (
                        <div className="w-16 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center shadow-md">
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
                        <div className="flex items-center mt-2 space-x-3">
                          <div className="flex items-center text-xs text-neutral-600 dark:text-neutral-400">
                            <ClockIcon className="w-4 h-4 mr-1" />
                            <span>{formatDate(book.borrowedDate)} - {formatDate(book.returnedDate)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:items-end space-y-2">
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        {book.rating && book.rating > 0 ? 'Your Rating:' : 'Rate this book:'}
                      </div>
                      {renderStars(book.rating, book.id)}
                      {book.rating && book.rating > 0 && (
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          Already rated
                        </span>
                      )}
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
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 mb-4">
              <ArrowPathIcon className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              No reading history
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400">
              You haven't completed reading any books yet. Start your reading journey today!
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ReadingHistoryTab;
