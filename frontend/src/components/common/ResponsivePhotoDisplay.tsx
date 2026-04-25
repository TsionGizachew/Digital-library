import React, { useState, useEffect, useRef } from 'react';
import { ResponsivePhotoDisplayProps } from '../../types/photo';
import { useLanguage } from '../../contexts/LanguageContext';

const ResponsivePhotoDisplay: React.FC<ResponsivePhotoDisplayProps> = ({
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
  const { language } = useLanguage();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Get image source
  const imageSrc = typeof src === 'string' ? src : src.original;

  // Get alt text based on language
  const altText = typeof alt === 'string' ? alt : alt[language];
  const captionText = caption ? (typeof caption === 'string' ? caption : caption[language]) : undefined;

  // Setup intersection observer for lazy loading
  useEffect(() => {
    if (!lazy || !imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            if (observerRef.current && imgRef.current) {
              observerRef.current.unobserve(imgRef.current);
            }
          }
        });
      },
      {
        rootMargin: loading?.rootMargin || '50px',
        threshold: loading?.threshold || 0.1,
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [lazy, loading]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    if (error?.onError) {
      error.onError(new Error('Failed to load image'));
    }
  };

  // Placeholder component
  const Placeholder = () => {
    if (!placeholder) return null;

    switch (placeholder.type) {
      case 'blur':
        return (
          <div
            className="absolute inset-0 bg-neutral-200 dark:bg-neutral-700 animate-pulse"
            style={{ filter: `blur(${placeholder.blur || 10}px)` }}
          />
        );
      case 'skeleton':
        return (
          <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-700 animate-pulse">
            <div className="flex items-center justify-center h-full">
              <svg
                className="w-12 h-12 text-neutral-400 dark:text-neutral-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        );
      case 'color':
        return (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: placeholder.color || '#e5e7eb' }}
          />
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
          alt={altText}
          className={`w-full h-full object-${objectFit}`}
        />
      </div>
    );
  }

  return (
    <figure className={`relative ${className}`}>
      <div className="relative" style={{ aspectRatio }}>
        {/* Placeholder */}
        {!isLoaded && <Placeholder />}

        {/* Main Image */}
        <img
          ref={imgRef}
          src={isInView ? imageSrc : undefined}
          alt={altText}
          className={`w-full h-full object-${objectFit} transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={handleLoad}
          onError={handleError}
          role={accessibility?.role || 'img'}
          aria-describedby={accessibility?.ariaDescribedBy}
        />
      </div>

      {/* Caption */}
      {captionText && (
        <figcaption className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 text-center">
          {captionText}
        </figcaption>
      )}
    </figure>
  );
};

export default ResponsivePhotoDisplay;