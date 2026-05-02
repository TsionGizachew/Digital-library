import React from 'react';
import { Book } from '../../services/bookService';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

interface FavoriteBooksTabProps {
  favoriteBooks: Book[];
  toggleFavorite: (bookId: string) => void;
  togglingFavorites?: Set<string>;
}

const FavoriteBooksTab: React.FC<FavoriteBooksTabProps> = ({
  favoriteBooks,
  toggleFavorite,
  togglingFavorites = new Set(),
}) => {

  return (
    <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-neutral-200/50 dark:border-neutral-700/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Favorite Books
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            {favoriteBooks.length} {favoriteBooks.length === 1 ? 'book' : 'books'} in your collection
          </p>
        </div>
      </div>
      
      {favoriteBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteBooks.map((book) => (
            <div key={book.id} className="group relative bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              {/* Remove from Favorites Button - Always show filled heart since we're in favorites tab */}
              <button
                onClick={() => toggleFavorite(book.id)}
                disabled={togglingFavorites.has(book.id)}
                className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm text-red-500 hover:text-red-600 hover:scale-110 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                title="Remove from favorites"
              >
                {togglingFavorites.has(book.id) ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
                ) : (
                  <FaHeart className="w-5 h-5" />
                )}
              </button>
              
              {/* Book Cover */}
              {book.coverImage ? (
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ) : (
                <div className="h-64 bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800 flex items-center justify-center">
                  <FaHeart className="text-6xl text-neutral-400 dark:text-neutral-600" />
                </div>
              )}
              
              {/* Book Info */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {book.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                  by {book.author}
                </p>
                {book.category && (
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">
                    {book.category}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-pink-100 to-red-100 dark:from-pink-900/30 dark:to-red-900/30 mb-4">
            <FaHeart className="w-10 h-10 text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            No favorite books yet
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
            Start building your collection by adding books to your favorites. Browse our library and click the heart icon on any book you love!
          </p>
        </div>
      )}
    </div>
  );
};

export default FavoriteBooksTab;
