import React, { useState, useEffect } from 'react';
import { AdvancedLogoComponentProps } from '../../types/logo';
import { useTheme } from '../../contexts/ThemeContext';

const Logo: React.FC<AdvancedLogoComponentProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  showText = true,
  theme = 'auto',
  priority = false,
  loading = 'lazy',
  onLoad,
  onError,
  accessibility,
  performance,
}) => {
  const { theme: contextTheme } = useTheme();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Determine effective theme
  const effectiveTheme = theme === 'auto' ? contextTheme : theme;

  // Size mappings
  const sizeClasses = {
    xs: 'h-6 w-auto',
    sm: 'h-8 w-auto',
    md: 'h-12 w-auto',
    lg: 'h-16 w-auto',
    xl: 'h-20 w-auto',
    auto: 'h-auto w-auto',
  };

  // Logo paths - using existing logo from photo folder
  const logoPath = '/photo/Logo.jpg';
  const logoWithoutTitlePath = '/photo/logo with out title .jpg';

  // Select appropriate logo based on variant
  const getLogoPath = () => {
    if (variant === 'icon' || !showText) {
      return logoWithoutTitlePath;
    }
    return logoPath;
  };

  const handleLoad = () => {
    setImageLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImageError(true);
    if (onError) {
      onError(new Error('Failed to load logo image'));
    }
  };

  // Fallback SVG logo if image fails to load
  const FallbackLogo = () => (
    <svg
      className={sizeClasses[size]}
      viewBox="0 0 200 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={accessibility?.role || 'img'}
      aria-label={accessibility?.ariaLabel || 'Yeka Sub City Library Logo'}
    >
      <rect width="200" height="60" fill={effectiveTheme === 'dark' ? '#1f2937' : '#ef4444'} rx="8" />
      <text
        x="100"
        y="35"
        textAnchor="middle"
        fill="white"
        fontSize="24"
        fontWeight="bold"
        fontFamily="Inter, sans-serif"
      >
        {showText ? 'Yeka Library' : 'YL'}
      </text>
    </svg>
  );

  if (imageError) {
    return (
      <div className={className}>
        <FallbackLogo />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center ${className}`}>
      <img
        src={getLogoPath()}
        alt={accessibility?.ariaLabel || 'Yeka Sub City Library Logo'}
        className={`${sizeClasses[size]} object-contain transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        role={accessibility?.role || 'img'}
        aria-describedby={accessibility?.describedBy}
      />
      {!imageLoaded && (
        <div className={`${sizeClasses[size]} bg-neutral-200 dark:bg-neutral-700 animate-pulse rounded`} />
      )}
    </div>
  );
};

export default Logo;