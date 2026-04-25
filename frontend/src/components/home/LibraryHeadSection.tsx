import React from 'react';
import { motion } from 'framer-motion';
import { LibraryHeadSectionProps } from '../../types/libraryHead';
import { useLanguage } from '../../contexts/LanguageContext';
import ResponsivePhoto from '../common/ResponsivePhoto';
import libraryHeadContent from '../../data/libraryHeadContent';
import { BookOpenIcon, HeartIcon, SparklesIcon } from '@heroicons/react/24/outline';

const LibraryHeadSection: React.FC<LibraryHeadSectionProps> = ({
  className = '',
  variant = 'hero',
  layout = 'horizontal',
  showPhoto = true,
  photoPosition = 'left',
  language: propLanguage,
  animationLevel = 'full',
  culturalTheme = 'ethiopian',
}) => {
  const { language: contextLanguage } = useLanguage();
  const effectiveLanguage = propLanguage || contextLanguage;

  const { profile, content } = libraryHeadContent;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  // Get cultural theme colors
  const getCulturalColors = () => {
    if (culturalTheme === 'ethiopian') {
      return {
        primary: 'from-cultural-ethiopian-green-500 to-cultural-ethiopian-yellow-500',
        accent: 'text-cultural-ethiopian-red-500',
        bg: 'bg-gradient-to-br from-cultural-ethiopian-green-50 to-cultural-ethiopian-yellow-50 dark:from-cultural-earth-900 dark:to-cultural-heritage-900',
      };
    }
    return {
      primary: 'from-primary-500 to-primary-600',
      accent: 'text-primary-600',
      bg: 'bg-neutral-50 dark:bg-neutral-800',
    };
  };

  const colors = getCulturalColors();

  // Photo configuration
  const photoSizes = {
    mobile: { width: '100%', quality: 80 },
    tablet: { width: '50%', quality: 85 },
    desktop: { width: '40%', quality: 90 },
    xl: { width: '35%', quality: 95 },
  };

  const MotionDiv = animationLevel !== 'none' ? motion.div : 'div';

  return (
    <section className={`${colors.bg} py-12 md:py-20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MotionDiv
          variants={animationLevel === 'full' ? containerVariants : undefined}
          initial={animationLevel !== 'none' ? 'hidden' : undefined}
          whileInView={animationLevel !== 'none' ? 'visible' : undefined}
          viewport={{ once: true, margin: '-100px' }}
          className={`grid ${
            layout === 'horizontal'
              ? 'grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center'
              : 'grid-cols-1 gap-8'
          }`}
        >
          {/* Photo Section */}
          {showPhoto && photoPosition === 'left' && (
            <MotionDiv
              variants={animationLevel === 'full' ? itemVariants : undefined}
              className="relative"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-cultural-ethiopian-green-400 to-cultural-ethiopian-yellow-400 rounded-2xl opacity-20 blur-2xl" />
                <ResponsivePhoto
                  src="/photo/photo_2026-04-24_15-57-45.jpg"
                  alt={profile.personal.name}
                  sizes={photoSizes}
                  aspectRatio="3/4"
                  className="relative z-10"
                  placeholder={{ type: 'blur', blur: 10 }}
                  loading={{ strategy: 'lazy', fadeIn: true, duration: 500 }}
                />
              </div>
            </MotionDiv>
          )}

          {/* Content Section */}
          <div className="space-y-6">
            {/* Name and Title */}
            <MotionDiv variants={animationLevel === 'full' ? itemVariants : undefined}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                {profile.personal.name[effectiveLanguage]}
              </h2>
              <p className={`text-lg md:text-xl ${colors.accent} font-medium`}>
                {profile.personal.title[effectiveLanguage]}
              </p>
            </MotionDiv>

            {/* Vision Statement */}
            <MotionDiv variants={animationLevel === 'full' ? itemVariants : undefined}>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {profile.personal.vision[effectiveLanguage].text}
                </p>
              </div>
            </MotionDiv>

            {/* Reading Culture Message */}
            <MotionDiv variants={animationLevel === 'full' ? itemVariants : undefined}>
              <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg border-l-4 border-cultural-ethiopian-green-500">
                <div className="flex items-start space-x-3">
                  <BookOpenIcon className="w-6 h-6 text-cultural-ethiopian-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                      {effectiveLanguage === 'en' && 'Promoting Reading Culture'}
                      {effectiveLanguage === 'am' && 'የንባብ ባህልን ማስፋፋት'}
                      {effectiveLanguage === 'om' && 'Aadaa Dubbisaa Guddisuu'}
                    </h3>
                    <p className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed">
                      {content.inspiration.readingCultureMessage[effectiveLanguage].text}
                    </p>
                  </div>
                </div>
              </div>
            </MotionDiv>

            {/* Motivational Quotes */}
            <MotionDiv variants={animationLevel === 'full' ? itemVariants : undefined}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.inspiration.motivationalQuotes.slice(0, 2).map((quote, index) => (
                  <div
                    key={quote.id}
                    className="bg-gradient-to-br from-cultural-ethiopian-yellow-50 to-cultural-ethiopian-green-50 dark:from-neutral-800 dark:to-neutral-700 rounded-lg p-4 border border-cultural-ethiopian-yellow-200 dark:border-neutral-600"
                  >
                    <SparklesIcon className="w-5 h-5 text-cultural-ethiopian-yellow-600 dark:text-cultural-ethiopian-yellow-400 mb-2" />
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 italic">
                      "{quote.text[effectiveLanguage]}"
                    </p>
                  </div>
                ))}
              </div>
            </MotionDiv>

            {/* Library Mission */}
            <MotionDiv variants={animationLevel === 'full' ? itemVariants : undefined}>
              <div className="bg-gradient-to-r from-cultural-ethiopian-green-500 to-cultural-ethiopian-yellow-500 rounded-xl p-6 text-white shadow-xl">
                <div className="flex items-start space-x-3">
                  <HeartIcon className="w-6 h-6 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {effectiveLanguage === 'en' && 'Our Mission'}
                      {effectiveLanguage === 'am' && 'የእኛ ተልዕኮ'}
                      {effectiveLanguage === 'om' && 'Ergama Keenya'}
                    </h3>
                    <p className="text-white/90 text-sm leading-relaxed">
                      {content.inspiration.libraryMission[effectiveLanguage].text}
                    </p>
                  </div>
                </div>
              </div>
            </MotionDiv>
          </div>

          {/* Photo Section - Right */}
          {showPhoto && photoPosition === 'right' && (
            <MotionDiv
              variants={animationLevel === 'full' ? itemVariants : undefined}
              className="relative lg:order-last"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-cultural-ethiopian-green-400 to-cultural-ethiopian-yellow-400 rounded-2xl opacity-20 blur-2xl" />
                <ResponsivePhoto
                  src="/photo/photo_2026-04-24_15-57-45.jpg"
                  alt={profile.personal.name}
                  sizes={photoSizes}
                  aspectRatio="3/4"
                  className="relative z-10"
                  placeholder={{ type: 'blur', blur: 10 }}
                  loading={{ strategy: 'lazy', fadeIn: true, duration: 500 }}
                />
              </div>
            </MotionDiv>
          )}
        </MotionDiv>
      </div>
    </section>
  );
};

export default LibraryHeadSection;