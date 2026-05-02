import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  StarIcon,
  BookOpenIcon,
  MapPinIcon,
  LanguageIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { Book } from '../../services/bookService';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import toast from 'react-hot-toast';

interface BookDetailModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

const BookDetailModal: React.FC<BookDetailModalProps> = ({ book, isOpen, onClose }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isReserving, setIsReserving] = useState(false);

  if (!book) return null;

  const handleReserve = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to reserve books');
      navigate('/login');
      return;
    }

    try {
      setIsReserving(true);
      await bookingService.createBooking(book.id || book._id || '');
      toast.success('Book reserved successfully! Check your dashboard for details.');
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reserve book');
    } finally {
      setIsReserving(false);
    }
  };

  const renderStars = (rating?: { average: number; count: number }) => {
    const avgRating = rating?.average || 0;
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, index) => (
          <StarIcon
            key={index}
            className={`w-5 h-5 ${
              index < Math.floor(avgRating)
                ? 'text-yellow-400 fill-current'
                : 'text-neutral-300 dark:text-neutral-600'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-neutral-600 dark:text-neutral-400">
          {avgRating.toFixed(1)} ({rating?.count || 0} reviews)
        </span>
      </div>
    );
  };

  const isAvailable = book.status === 'available' && (book.availability?.availableCopies || 0) > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  Book Details
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Book Cover */}
                  <div className="md:col-span-1">
                    <div className="aspect-[2/3] rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-700">
                      {book.coverImage ? (
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpenIcon className="w-24 h-24 text-neutral-400" />
                        </div>
                      )}
                    </div>

                    {/* Availability Status */}
                    <div className="mt-4">
                      {isAvailable ? (
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-lg">
                          <CheckCircleIcon className="w-5 h-5" />
                          <span className="font-medium">Available</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg">
                          <XCircleIcon className="w-5 h-5" />
                          <span className="font-medium">Not Available</span>
                        </div>
                      )}
                      <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                        {book.availability?.availableCopies || 0} of {book.availability?.totalCopies || 0} copies available
                      </div>
                    </div>
                  </div>

                  {/* Book Information */}
                  <div className="md:col-span-2">
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                      {book.title}
                    </h1>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-4">
                      by {book.author}
                    </p>

                    {/* Rating */}
                    <div className="mb-6">{renderStars(book.rating)}</div>

                    {/* Description */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                        Description
                      </h3>
                      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        {book.description || 'No description available.'}
                      </p>
                    </div>

                    {/* Book Details Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <h4 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                          Category
                        </h4>
                        <p className="text-neutral-900 dark:text-neutral-100">{book.category}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                          ISBN
                        </h4>
                        <p className="text-neutral-900 dark:text-neutral-100">{book.isbn || 'N/A'}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                          Publisher
                        </h4>
                        <p className="text-neutral-900 dark:text-neutral-100">
                          {book.publisher || 'N/A'}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                          Published Date
                        </h4>
                        <p className="text-neutral-900 dark:text-neutral-100">
                          {book.publishedDate || 'N/A'}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                          <LanguageIcon className="w-4 h-4 inline mr-1" />
                          Language
                        </h4>
                        <p className="text-neutral-900 dark:text-neutral-100">{book.language}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                          <BookOpenIcon className="w-4 h-4 inline mr-1" />
                          Pages
                        </h4>
                        <p className="text-neutral-900 dark:text-neutral-100">
                          {book.pageCount || 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Location */}
                    {book.location && (
                      <div className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg">
                        <h4 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2 flex items-center gap-2">
                          <MapPinIcon className="w-4 h-4" />
                          Location
                        </h4>
                        <p className="text-neutral-900 dark:text-neutral-100">
                          {typeof book.location === 'string'
                            ? book.location
                            : `${book.location.section || ''} - Shelf ${book.location.shelf || ''} ${
                                book.location.floor ? `(Floor ${book.location.floor})` : ''
                              }`}
                        </p>
                      </div>
                    )}

                    {/* Tags */}
                    {book.tags && book.tags.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">
                          Tags
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {book.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Reserve Button */}
                    <div className="flex gap-3">
                      <button
                        onClick={handleReserve}
                        disabled={!isAvailable || isReserving}
                        className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                          isAvailable && !isReserving
                            ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-md hover:shadow-lg'
                            : 'bg-neutral-300 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 cursor-not-allowed'
                        }`}
                      >
                        {isReserving
                          ? 'Reserving...'
                          : isAvailable
                          ? isAuthenticated
                            ? 'Reserve Book'
                            : 'Login to Reserve'
                          : 'Not Available'}
                      </button>
                    </div>

                    {!isAuthenticated && (
                      <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 text-center">
                        Please{' '}
                        <button
                          onClick={() => navigate('/login')}
                          className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                        >
                          login
                        </button>{' '}
                        to reserve this book
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BookDetailModal;
