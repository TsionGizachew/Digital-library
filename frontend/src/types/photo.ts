// Photo Display System Types
export interface ResponsivePhotoDisplayProps {
  src: string | PhotoAssetCollection;
  alt: LocalizedString;
  sizes: AdvancedResponsiveSizes;
  lazy?: boolean;
  priority?: boolean;
  className?: string;
  caption?: LocalizedString;
  aspectRatio?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down';
  placeholder?: PlaceholderConfig;
  loading?: LoadingConfig;
  error?: ErrorConfig;
  accessibility?: PhotoAccessibilityConfig;
  performance?: PhotoPerformanceConfig;
  analytics?: PhotoAnalyticsConfig;
}

export interface LocalizedString {
  en: string;
  am: string;
  om: string;
}

export interface AdvancedResponsiveSizes {
  mobile: ResponsiveSizeConfig;
  tablet: ResponsiveSizeConfig;
  desktop: ResponsiveSizeConfig;
  xl: ResponsiveSizeConfig;
  xxl?: ResponsiveSizeConfig;
  print?: ResponsiveSizeConfig;
}

export interface ResponsiveSizeConfig {
  width: string;
  height?: string;
  quality?: number;
  format?: 'auto' | 'webp' | 'avif' | 'jpeg' | 'png';
  density?: number[];
}

export interface PhotoAssetCollection {
  original: string;
  optimized: {
    webp: ResponsiveImageSet;
    avif?: ResponsiveImageSet;
    jpeg: ResponsiveImageSet;
  };
  placeholder: {
    blurred: string;
    lowQuality: string;
    svg: string;
  };
  metadata: {
    width: number;
    height: number;
    aspectRatio: number;
    colorPalette: string[];
    dominantColor: string;
  };
}

export interface ResponsiveImageSet {
  '1x': string;
  '2x': string;
  '3x': string;
  '4x'?: string;
}

export interface PlaceholderConfig {
  type: 'blur' | 'skeleton' | 'color' | 'svg';
  color?: string;
  blur?: number;
  skeleton?: SkeletonConfig;
}

export interface SkeletonConfig {
  rows: number;
  height: string;
  className?: string;
}

export interface LoadingConfig {
  strategy: 'lazy' | 'eager' | 'auto';
  threshold?: number;
  rootMargin?: string;
  fadeIn?: boolean;
  duration?: number;
}

export interface ErrorConfig {
  fallback: string;
  retry?: boolean;
  maxRetries?: number;
  onError?: (error: Error) => void;
}

export interface PhotoAccessibilityConfig {
  alt: LocalizedString;
  longDescription?: LocalizedString;
  role?: string;
  ariaDescribedBy?: string;
  focusable?: boolean;
}

export interface PhotoPerformanceConfig {
  preload?: boolean;
  priority?: 'high' | 'medium' | 'low';
  format?: 'auto' | 'webp' | 'avif' | 'jpeg';
  quality?: number;
  lazy?: boolean;
}

export interface PhotoAnalyticsConfig {
  trackLoading?: boolean;
  trackError?: boolean;
  trackInteraction?: boolean;
  customEvents?: string[];
}

export interface UsageRights {
  license: string;
  attribution?: string;
  commercial: boolean;
  modification: boolean;
}

export interface EnhancedPhotoAsset {
  id: string;
  filename: string;
  url: string;
  alt: LocalizedString;
  caption?: LocalizedString;
  description?: LocalizedString;
  dimensions: {
    width: number;
    height: number;
    aspectRatio: number;
  };
  formats: {
    webp: ResponsiveImageSet;
    avif?: ResponsiveImageSet;
    jpeg: ResponsiveImageSet;
    png?: ResponsiveImageSet;
  };
  sizes: AdvancedResponsiveSizes;
  metadata: {
    takenDate?: Date;
    location?: string;
    photographer?: string;
    copyright?: string;
    usage: UsageRights;
  };
  optimization: {
    compressed: boolean;
    quality: number;
    fileSize: number;
    loadTime: number;
  };
  accessibility: {
    alt: LocalizedString;
    longDescription?: LocalizedString;
    colorDescription?: LocalizedString;
    contextualInfo?: LocalizedString;
  };
}

export interface PhotoProcessingOptions {
  formats: ('webp' | 'avif' | 'jpeg' | 'png')[];
  qualities: number[];
  sizes: {
    width: number;
    height?: number;
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  }[];
  optimization: {
    progressive: boolean;
    mozjpeg: boolean;
    webpQuality: number;
    avifQuality: number;
  };
}