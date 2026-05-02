import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, FunnelIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';
import { bookService } from '../../services/bookService';

interface SearchSectionProps {
  onSearch?: (query: string, category: string) => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  const { t } = useLanguage();

  // Fetch real categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await bookService.getCategories();
        setCategories(response.data || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        // Fallback to default categories
        setCategories(['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography']);
      }
    };

    fetchCategories();
  }, []);

  const categoryOptions = [
    { id: 'all', name: t('home.search.categories.all') },
    ...categories.map(cat => ({ id: cat, name: cat }))
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery, selectedCategory);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const stats = [
    { value: '15,420', label: t('home.stats.totalBooks') },
    { value: '156',    label: t('home.stats.newThisMonth') },
    { value: '50+',    label: t('home.stats.categories') },
    { value: '24/7',   label: t('home.stats.digitalAccess') },
  ];

  return (
    <section id="search-section" className="py-16 sm:py-20 bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="text-center"
        >
          {/* Heading */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <SparklesIcon className="w-4 h-4" />
            Discover Your Next Read
          </motion.div>

          <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
            {t('home.search.title')}
          </motion.h2>
          <motion.p variants={itemVariants} className="text-base sm:text-lg text-neutral-500 dark:text-neutral-400 mb-10 max-w-2xl mx-auto">
            Explore our extensive collection of books across various categories and find your next favorite read.
          </motion.p>

          {/* Search Form */}
          <motion.form variants={itemVariants} onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-3 p-2 bg-white dark:bg-neutral-800 rounded-2xl shadow-medium border border-neutral-200 dark:border-neutral-700">
              {/* Search Input */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-transparent border-0 rounded-xl text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 text-sm sm:text-base"
                  placeholder={t('home.search.placeholder')}
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-neutral-50 dark:bg-neutral-700 border-0 rounded-xl px-4 py-3.5 pr-10 text-neutral-700 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 cursor-pointer min-w-[180px] text-sm font-medium"
                >
                  {categoryOptions.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FunnelIcon className="h-4 w-4 text-neutral-400" />
                </div>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-primary-500/25 text-sm sm:text-base whitespace-nowrap"
              >
                {t('common.search')}
              </button>
            </div>
          </motion.form>

          {/* Category Pills */}
          <motion.div variants={itemVariants} className="mt-6 flex flex-wrap justify-center gap-2">
            {categoryOptions.slice(1, 7).map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-primary-500 text-white shadow-md shadow-primary-500/25'
                    : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:border-primary-300 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                {category.name}
              </button>
            ))}
          </motion.div>

          {/* Quick Stats */}
          <motion.div variants={itemVariants} className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white dark:bg-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700 shadow-soft">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{stat.value}</div>
                <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SearchSection;
