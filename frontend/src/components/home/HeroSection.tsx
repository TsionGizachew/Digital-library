import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon, BookOpenIcon, UsersIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';
import { getHomePageStats, HomePageStats } from '../../services/homeService';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [stats, setStats] = useState<HomePageStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getHomePageStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching home page stats:', error);
      }
    };
    fetchStats();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
    },
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-brand-900 dark:from-neutral-950 dark:via-primary-950 dark:to-neutral-900">
      {/* Subtle dot pattern overlay */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />
      {/* Glow blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
              <span className="text-xs sm:text-sm font-medium text-white/90">Yeka Sub City Public Library</span>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
                <span className="block">{t('home.hero.title').split(' ').slice(0, 3).join(' ')}</span>
                <span className="block mt-1 bg-gradient-to-r from-accent-300 to-brand-300 bg-clip-text text-transparent">
                  {t('home.hero.title').split(' ').slice(3).join(' ')}
                </span>
              </h1>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="mt-5 text-base sm:text-lg text-white/70 leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              {t('home.hero.subtitle')}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            >
              <button
                className="inline-flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-400 active:bg-accent-600 text-white font-semibold px-7 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-accent-500/30 hover:shadow-xl group"
                onClick={() => {
                  const el = document.getElementById('search-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {t('home.hero.cta')}
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <button
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold px-7 py-3 rounded-xl transition-all duration-200 backdrop-blur-sm"
                onClick={() => navigate('/login')}
              >
                {t('home.hero.membershipCta')}
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="mt-12 grid grid-cols-3 gap-4 text-center lg:text-left"
            >
              {[
                { value: stats ? `${(stats.totalBooks / 1000).toFixed(1)}K+` : '—', label: t('home.stats.booksAvailable') },
                { value: stats ? `${(stats.totalMembers / 1000).toFixed(1)}K+` : '—', label: t('home.stats.activeMembers') },
                { value: stats ? `${stats.totalCategories}+` : '—', label: t('home.stats.categories') },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-accent-300">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-white/60 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Content — Illustration */}
          <div className="relative mt-8 lg:mt-0">
            <motion.div variants={itemVariants} className="relative z-10">
              <div className="relative w-full max-w-sm sm:max-w-md mx-auto">
                {/* Glow ring */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/30 to-brand-500/30 rounded-3xl blur-2xl" />

                {/* Floating chips */}
                <motion.div variants={floatingVariants} animate="animate"
                  className="absolute -top-4 -right-4 bg-white dark:bg-neutral-800 rounded-2xl shadow-large px-3 py-2 flex items-center gap-2 z-20">
                  <div className="w-8 h-8 bg-accent-100 dark:bg-accent-900/40 rounded-lg flex items-center justify-center">
                    <BookOpenIcon className="w-4 h-4 text-accent-600 dark:text-accent-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100">15K+ Books</div>
                    <div className="text-[10px] text-neutral-500">Available now</div>
                  </div>
                </motion.div>

                <motion.div variants={floatingVariants} animate="animate" style={{ animationDelay: '1s' }}
                  className="absolute -bottom-4 -left-4 bg-white dark:bg-neutral-800 rounded-2xl shadow-large px-3 py-2 flex items-center gap-2 z-20">
                  <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900/40 rounded-lg flex items-center justify-center">
                    <UsersIcon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100">5K+ Members</div>
                    <div className="text-[10px] text-neutral-500">Active readers</div>
                  </div>
                </motion.div>

                <motion.div variants={floatingVariants} animate="animate" style={{ animationDelay: '2s' }}
                  className="absolute top-1/2 -left-8 bg-white dark:bg-neutral-800 rounded-2xl shadow-large px-3 py-2 flex items-center gap-2 z-20">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/40 rounded-lg flex items-center justify-center">
                    <GlobeAltIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100">3 Languages</div>
                    <div className="text-[10px] text-neutral-500">EN · AM · OM</div>
                  </div>
                </motion.div>

                {/* Central card */}
                <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8">
                  <div className="aspect-square bg-gradient-to-br from-primary-800/60 to-brand-800/60 rounded-2xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-accent-400 to-brand-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow-accent">
                        <BookOpenIcon className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-2.5 bg-white/20 rounded-full w-3/4 mx-auto" />
                        <div className="h-2.5 bg-white/15 rounded-full w-1/2 mx-auto" />
                        <div className="h-2.5 bg-white/10 rounded-full w-2/3 mx-auto" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-12 text-white dark:text-neutral-900" preserveAspectRatio="none" viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor" />
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor" />
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
