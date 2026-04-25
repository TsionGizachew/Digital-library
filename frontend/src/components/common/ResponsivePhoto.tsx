import React, { useState, useEffect, useRef } from 'react';
import { ResponsivePhotoDisplayProps } from '../../types/photo';
import { useLanguage } from '../../contexts/LanguageContext';

const ResponsivePhoto: React.FC<ResponsivePhotoDisplayProps> = ({
  src,
  alt,
  sizes,
  lazy = true,
  priority = false,
  className = '',
  caption,
  aspectRatio = '4/3',
  objectFit = 'cover',
  placeholder,
  loading,
  error,
  accessibility,
  performance,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const imgRef = useRef<HTMLImageElement>(null);
  const { language } = useLanguage();

  // Get localized alt text
  const getAltText = () => {
    if (typeof alt === 'string') return alt;
    return alt[language] || alt.en;
  };

  // Get localized caption
  const getCaption = () => {
    if (!caption) return null;
    if (typeof caption === 'string') return caption;
    return caption[language] || caption.en;
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: loading?.rootMargin || '50px',
        threshold: loading?.threshold || 0.1,
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [lazy, loading]);

  const handleLoad = () => {
    setIsLoaded(true);
    if (loading?.fadeIn) {
      // Fade in animation handled by CSS
    }
  };

  const handleError = () => {
    setHasError(true);
    if (error?.onError) {
      error.onError(new Error('Failed to load image'));
    }
  };

  // Get image source
  const getImageSrc = () => {
    if (typeof src === 'string') return src;
    // Use optimized webp if available, fallback to jpeg
    return src.optimized?.webp?.['1x'] || src.original;
  };

  // Placeholder component
  const Placeholder = () => {
    if (!placeholder) return null;

    switch (placeholder.type) {
      case 'blur':
        return (
          <div
            className="absolute inset-0 bg-neutral-200 dark:bg-neutral-700"
            style={{ filter: `blur(${placeholder.blur || 10}px)` }}
          />
        );
      case 'color':
        return (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: placeholder.color || '#e5e7eb' }}
          />
        );
      case 'skeleton':
        return (
          <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
        );
      default:
        return null;
    }
  };

  // Error fallback
  if (hasError && error?.fallback) {
    return (
      <div className={`relative ${className}`} style={{ aspectRatio }}>
        <img
          src={error.fallback}
          alt={getAltText()}
          className={`w-full h-full object-${objectFit}`}
        />
      </div>
    );
  }

  return (
    <figure className={className}>
      <div
        ref={imgRef}
        className="relative overflow-hidden rounded-lg"
        style={{ aspectRatio }}
      >
        {!isLoaded && <Placeholder />}
        
        {isInView && (
          <img
            src={getImageSrc()}
            alt={getAltText()}
            className={`w-full h-full object-${objectFit} transition-opacity duration-${
              loading?.duration || 300
            } ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading={priority ? 'eager' : 'lazy'}
            onLoad={handleLoad}
            onError={handleError}
            role={accessibility?.role || 'img'}
            aria-describedby={accessibility?.ariaDescribedBy}
          />
        )}
      </div>
      
      {caption && (
        <figcaption className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 text-center">
          {getCaption()}
        </figcaption>
      )}
    </figure>
  );
};

export default ResponsivePhoto;