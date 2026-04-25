import React from 'react';
import Header from '../components/home/Header';
import HeroSection from '../components/home/HeroSection';
import LibraryHeadSection from '../components/home/LibraryHeadSection';
import SearchSection from '../components/home/SearchSection';
import FeaturedBooks from '../components/home/FeaturedBooks';
import FeaturedEvents from '../components/home/FeaturedEvents';
import FeaturedAnnouncements from '../components/home/FeaturedAnnouncements';
import Footer from '../components/common/Footer';
import { useLanguage } from '../contexts/LanguageContext';

const HomePage: React.FC = () => {
  const { language } = useLanguage();
  
  const handleSearch = (query: string, category?: string) => {
    console.log('Search:', query, 'Category:', category);
    // Implement search functionality
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <Header onSearch={handleSearch} />
      <main>
        <HeroSection />
        <LibraryHeadSection
          language={language as 'en' | 'am' | 'om'}
          variant="hero"
          layout="horizontal"
          showPhoto={true}
          photoPosition="left"
          culturalTheme="ethiopian"
          animationLevel="full"
        />
        <SearchSection onSearch={handleSearch} />
        <FeaturedBooks />
        <FeaturedEvents />
        <FeaturedAnnouncements />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
