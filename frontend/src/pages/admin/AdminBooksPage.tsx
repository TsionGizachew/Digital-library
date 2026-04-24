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
  ChevronUpIcon,
  ChevronDownIcon,
  BookOpenIcon,
  CheckIcon,
  XMarkIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';
import { bookService, Book } from '../../services/bookService';
import AddBookModal from '../../components/admin/AddBookModal';
import EditBookModal from '../../components/admin/EditBooKModal';
import ViewBookModal from '../../components/admin/ViewBookModal';

type SortField = 'title' | 'author' | 'category' | 'status';
type SortOrder = 'asc' | 'desc';

const AdminBooksPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalCopies, setTotalCopies] = useState(0);
  const [totalAvailable, setTotalAvailable] = useState(0);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const { t } = useLanguage();

  const sortBooks = useCallback((booksToSort: Book[]) => {
    return [...booksToSort].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'author':
          aValue = a.author.toLowerCase();
          bValue = b.author.toLowerCase();
          break;
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        case 'status':
          aValue = a.status.toLowerCase();
          bValue = b.status.toLowerCase();
          break;
        default:
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [sortField, sortOrder]);

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const [booksResponse, statsResponse] = await Promise.all([
        bookService.getAdminBooks({ page, limit: 10, search: searchQuery, category: selectedCategory }),
        bookService.getBookStats(),
      ]);

      const responseData = booksResponse.data as any;
      const booksData = responseData.books || responseData.data || responseData;
      const normalizedBooks = (booksData || []).map((book: Book) => ({
        ...book,
        id: book.id || book._id,
      })).filter((book: Book) => book.id);

      setBooks(sortBooks(normalizedBooks));
      setTotalPages(responseData.pagination?.totalPages || 1);
      setTotalBooks(responseData.pagination?.totalItems || 0);

      const stats = statsResponse.data as any;
      setTotalCopies(stats.totalCopies || 0);
      setTotalAvailable(stats.availableCopies || 0);
    } catch (error) {
      console.error('Failed to fetch books:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, selectedCategory, sortBooks]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => { fetchBooks(); }, 300);
    return () => clearTimeout(timeoutId);
  }, [fetchBooks]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategory]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchCategories = async () => {
    try {
      const response = await bookService.getCategories();
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories([]);
    }
  };

  const handleAddBook = async (bookData: any) => {
    try {
      const response = await bookService.createBook(bookData);
      if (response.success) {
        setBooks(prevBooks => [response.data, ...prevBooks]);
        setIsAddModalOpen(false);
        toast.success(t('messages.success.bookAdded'));
      }
    } catch (error) {
      console.error('Failed to add book:', error);
      toast.error('Failed to add book. Please try again.');
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (!bookId || bookId === 'undefined') {
      toast.error('Error: Invalid book ID. Cannot delete book.');
      return;
    }
    try {
      await bookService.deleteBook(bookId);
      setBooks(books?.filter(book => book.id !== bookId) || []);
      toast.success('Book deleted successfully.');
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Failed to delete book:', error);
      toast.error('Failed to delete book. Please try again.');
      setDeleteConfirmId(null);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleViewBook = (book: Book) => {
    setSelectedBook(book);
    setIsViewModalOpen(true);
  };

  const handleEditBook = (book: Book) => {
    if (!book || !book.id) {
      toast.error('Error: Invalid book data. Cannot edit book.');
      return;
    }
    setSelectedBook(book);
    setIsEditModalOpen(true);
  };

  const handleUpdateBook = async (bookData: Partial<Book>) => {
    if (!selectedBook) {
      toast.error('Error: No book selected for update.');
      return;
    }
    if (!selectedBook.id || selectedBook.id === 'undefined') {
      toast.error('Error: Invalid book ID. Cannot update book.');
      return;
    }
    try {
      const response = await bookService.updateBook(selectedBook.id, bookData);
      if (response.success) {
        await fetchBooks();
        setIsEditModalOpen(false);
        setSelectedBook(null);
        toast.success('Book updated successfully.');
      }
    } catch (error) {
      console.error('Failed to update book:', error);
      toast.error('Failed to update book. Please try again.');
    }
  };

  const getStatusColor = (status: Book['status']) => {
    switch (status) {
      case 'available':
        return 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400';
      case 'borrowed':
        return 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-400';
      case 'maintenance':
        return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-400';
      case 'lost':
        return 'bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-400';
      default:
        return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-400';
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const SortButton: React.FC<{ field: SortField; label: string }> = ({ field, label }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
    >
      <span>{label}</span>
      {sortField === field && (
        sortOrder === 'asc'
          ? <ChevronUpIcon className="w-4 h-4" />
          : <ChevronDownIcon className="w-4 h-4" />
      )}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {t('admin.books.title')}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Manage your library's book collection
          </p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="btn-primary flex items-center">
          <PlusIcon className="w-5 h-5 mr-2" />
          {t('admin.books.addBook')}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Books', value: totalBooks, icon: BookOpenIcon, bgColor: 'bg-neutral-50 dark:bg-neutral-700/50', iconColor: 'text-neutral-600 dark:text-neutral-400', valueColor: 'text-neutral-900 dark:text-neutral-100' },
          { label: 'Total Copies', value: totalCopies, icon: ClipboardDocumentListIcon, bgColor: 'bg-primary-50 dark:bg-primary-900/20', iconColor: 'text-primary-600 dark:text-primary-400', valueColor: 'text-primary-700 dark:text-primary-300' },
          { label: 'Available', value: totalAvailable, icon: CheckCircleIcon, bgColor: 'bg-success-50 dark:bg-success-900/20', iconColor: 'text-success-600 dark:text-success-400', valueColor: 'text-success-700 dark:text-success-300' },
          { label: 'Borrowed', value: totalCopies - totalAvailable, icon: ArrowPathIcon, bgColor: 'bg-warning-50 dark:bg-warning-900/20', iconColor: 'text-warning-600 dark:text-warning-400', valueColor: 'text-warning-700 dark:text-warning-300' },
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
                placeholder="Search books, authors, ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Books Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-neutral-600 dark:text-neutral-400">Loading books...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
              <thead className="bg-neutral-50 dark:bg-neutral-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    <SortButton field="title" label="Book" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    <SortButton field="author" label="Author" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    <SortButton field="category" label="Category" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    <SortButton field="status" label="Status" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Availability
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-700">
                <AnimatePresence>
                  {books?.filter(book => book && book.id).map((book, index) => {
                    if (!book.id) return null;
                    const isConfirmingDelete = deleteConfirmId === book.id;

                    return (
                      <motion.tr
                        key={book.id || book._id || index}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className={`hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors duration-200 ${
                          index % 2 === 1 ? 'bg-neutral-50/50 dark:bg-neutral-800/30' : ''
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-8">
                              <div className="h-12 w-8 bg-primary-100 dark:bg-primary-900/30 rounded flex items-center justify-center">
                                <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
                                  {book.title.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                {book.title}
                              </div>
                              <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                ISBN: {book.isbn}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">
                          {book.author}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-full">
                            {book.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(book.status)}`}>
                            {book.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">
                          {book.availability?.availableCopies || 0}/{book.availability?.totalCopies || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {isConfirmingDelete ? (
                            <div className="flex items-center justify-end gap-1">
                              <span className="text-xs text-neutral-600 dark:text-neutral-400 mr-1">Delete?</span>
                              <button
                                onClick={() => handleDeleteBook(book.id)}
                                className="inline-flex items-center p-1 rounded bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-400 hover:bg-error-200 dark:hover:bg-error-900/50 transition-colors"
                                title="Confirm Delete"
                              >
                                <CheckIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="inline-flex items-center p-1 rounded bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
                                title="Cancel"
                              >
                                <XMarkIcon className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleViewBook(book)}
                                className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                                title="View Details"
                              >
                                <EyeIcon className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleEditBook(book)}
                                className="text-neutral-600 dark:text-neutral-400 hover:text-warning-600 dark:hover:text-warning-400 transition-colors duration-200"
                                title="Edit Book"
                              >
                                <PencilIcon className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(book.id)}
                                className="text-neutral-600 dark:text-neutral-400 hover:text-error-600 dark:hover:text-error-400 transition-colors duration-200"
                                title="Delete Book"
                              >
                                <TrashIcon className="w-5 h-5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>

            {books?.length === 0 && !loading && (
              <div className="text-center py-16">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                    <BookOpenIcon className="w-8 h-8 text-neutral-400" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                  No books found
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  {searchQuery || selectedCategory
                    ? 'Try adjusting your search criteria'
                    : 'Start by adding your first book to the library'}
                </p>
                {!searchQuery && !selectedCategory && (
                  <button onClick={() => setIsAddModalOpen(true)} className="btn-primary inline-flex items-center">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add First Book
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {!loading && books.length > 0 && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6 px-6 py-4 border-t border-neutral-200 dark:border-neutral-700">
            <button
              onClick={() => handlePageChange(Math.max(page - 1, 1))}
              disabled={page === 1}
              className="px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {page > 1 && (
              <button
                onClick={() => handlePageChange(page - 1)}
                className="px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-700"
              >
                {page - 1}
              </button>
            )}
            <button className="px-3 py-2 text-sm font-medium bg-primary-600 text-white rounded-md">
              {page}
            </button>
            {page < totalPages && (
              <button
                onClick={() => handlePageChange(page + 1)}
                className="px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-700"
              >
                {page + 1}
              </button>
            )}
            {page + 1 < totalPages && (
              <button
                onClick={() => handlePageChange(page + 2)}
                className="px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-700"
              >
                {page + 2}
              </button>
            )}
            <button
              onClick={() => handlePageChange(Math.min(page + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Add Book Modal */}
      <AddBookModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddBook}
      />

      {/* View Book Modal */}
      {selectedBook && (
        <ViewBookModal
          isOpen={isViewModalOpen}
          onClose={() => { setIsViewModalOpen(false); setSelectedBook(null); }}
          book={selectedBook}
        />
      )}

      {/* Edit Book Modal */}
      {selectedBook && (
        <EditBookModal
          isOpen={isEditModalOpen}
          onClose={() => { setIsEditModalOpen(false); setSelectedBook(null); }}
          book={selectedBook}
          onSubmit={handleUpdateBook}
          categories={['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Ethiopian Literature', 'Children', 'Reference']}
        />
      )}
    </div>
  );
};

export default AdminBooksPage;
