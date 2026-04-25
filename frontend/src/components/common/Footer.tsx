import React from 'react';
import { motion } from 'framer-motion';
import {
  BookOpenIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const { t, language } = useLanguage();

  const footerSections = [
    {
      title: t('footer.about'),
      links: [
        { name: t('footer.about'), href: '/about' },
        { name: t('footer.services'), href: '/services' },
        { name: t('footer.policies'), href: '/policies' },
        { name: t('footer.contact'), href: '/contact' },
      ],
    },
    {
      title: t('footer.services'),
      links: [
        { name: t('footer.services'), href: '/services' },
        { name: t('navigation.events'), href: '/events' },
        { name: t('navigation.announcements'), href: '/announcements' },
        { name: t('navigation.books'), href: '/books' },
      ],
    },
    {
      title: t('footer.policies'),
      links: [
        { name: t('footer.policies'), href: '/policies' },
        { name: t('footer.privacy'), href: '/privacy' },
        { name: t('footer.terms'), href: '/terms' },
        { name: t('footer.contact'), href: '/contact' },
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
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
    <footer className="bg-neutral-900 dark:bg-neutral-950 text-neutral-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          {/* Library Info */}
          <motion.div variants={itemVariants} className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-3 sm:mb-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-brand-500 rounded-xl flex items-center justify-center shadow-glow">
                <BookOpenIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="ml-3">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {t('header.libraryName')}
                </h3>
              </div>
            </div>
            <p className="text-sm text-neutral-400 mb-5 leading-relaxed break-words">
              {language === 'am' ? 'ከ 1995 ዓም ጀምሮ የየካ ክፍለ ከተማ ህዝብን በእውቀም፣ በሀብቶች እና በትምህርታዊ ፕሮግራሞች እናገልግላለን።' : language === 'om' ? 'Bara 1995 jalqabee hawaasa Aanaa Magaalaa Yeekaa beekumsa, qabeenya fi sagantaalee barnootaan tajaajilaa jirra.' : 'Serving the Yeka Sub City community with knowledge, resources, and educational programs since 1995.'}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5">
                <MapPinIcon className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-neutral-400 break-words">{t('footer.address')}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <PhoneIcon className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-neutral-400 break-words">{t('footer.phone')}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <EnvelopeIcon className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-neutral-400 break-all">{t('footer.email')}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <ClockIcon className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-neutral-400 break-words">{language === 'am' ? 'ሰኞ-አርብ: 8ሰዓት-8ሰዓት, ቅዳሜ-እሁድ: 9ሰዓት-6ሰዓት' : language === 'om' ? 'Wiixata-Jimaata: 8:00-20:00, Sanbata-Dilbata: 9:00-18:00' : 'Mon-Fri: 8AM-8PM, Sat-Sun: 9AM-6PM'}</span>
              </div>
            </div>
          </motion.div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <motion.div key={section.title} variants={itemVariants}>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-neutral-400 hover:text-primary-400 transition-colors duration-200 text-sm block break-words"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-10 pt-6 border-t border-neutral-800"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-xs sm:text-sm text-neutral-500 text-center sm:text-left">
              {t('footer.copyright')}
            </div>
            <div className="flex space-x-5">
              <a href="/privacy" className="text-xs sm:text-sm text-neutral-500 hover:text-primary-400 transition-colors duration-200">
                {t('footer.privacy')}
              </a>
              <a href="/terms" className="text-xs sm:text-sm text-neutral-500 hover:text-primary-400 transition-colors duration-200">
                {t('footer.terms')}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
