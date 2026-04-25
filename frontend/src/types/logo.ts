// Enhanced Logo System Types
export type LogoVariant = 'full' | 'icon' | 'horizontal' | 'stacked' | 'minimal';
export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'auto';
export type LogoTheme = 'light' | 'dark' | 'auto';
export type LogoFormat = 'svg' | 'webp' | 'avif' | 'png' | 'auto';

export interface AdvancedLogoComponentProps {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
  showText?: boolean;
  theme?: LogoTheme;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: (error: Error) => void;
  accessibility?: {
    ariaLabel?: string;
    role?: string;
    describedBy?: string;
  };
  performance?: {
    preload?: boolean;
    format?: LogoFormat;
    quality?: number;
  };
}

export interface ResponsiveImageSet {
  '1x': string;
  '2x': string;
  '3x': string;
  '4x'?: string;
}

export interface MultiFormatLogoAsset {
  svg: {
    url: string;
    inline?: string;
    optimized: boolean;
    features: string[];
  };
  raster: {
    webp: ResponsiveImageSet;
    avif?: ResponsiveImageSet;
    png: ResponsiveImageSet;
    jpeg?: ResponsiveImageSet;
  };
  metadata: {
    colorProfile: string;
    transparency: boolean;
    animated: boolean;
    fileSize: number;
  };
}

export interface LogoVariantAsset {
  light: MultiFormatLogoAsset;
  dark: MultiFormatLogoAsset;
  monochrome: MultiFormatLogoAsset;
  highContrast: MultiFormatLogoAsset;
  dimensions: {
    width: number;
    height: number;
    aspectRatio: string;
    viewBox?: string;
  };
  usageGuidelines: {
    minSize: string;
    maxSize: string;
    clearSpace: string;
    backgrounds: string[];
    contexts: string[];
  };
  performance: {
    fileSize: number;
    loadTime: number;
    compressionRatio: number;
  };
}

export interface LogoBreakpointConfig {
  preferredVariant: LogoVariant;
  maxWidth: string;
  showText: boolean;
  priority: 'high' | 'medium' | 'low';
  loadingStrategy: 'eager' | 'lazy' | 'auto';
}

export interface ResponsiveLogoBreakpoints {
  xs: LogoBreakpointConfig;
  sm: LogoBreakpointConfig;
  md: LogoBreakpointConfig;
  lg: LogoBreakpointConfig;
  xl: LogoBreakpointConfig;
  '2xl': LogoBreakpointConfig;
}

export interface EnhancedLogoAssets {
  variants: {
    full: LogoVariantAsset;
    icon: LogoVariantAsset;
    horizontal: LogoVariantAsset;
    stacked: LogoVariantAsset;
    minimal: LogoVariantAsset;
  };
  responsive: {
    breakpoints: ResponsiveLogoBreakpoints;
    adaptiveRules: Record<string, any>;
  };
  performance: {
    preloadStrategy: string;
    cachePolicy: string;
    compressionSettings: Record<string, any>;
  };
  accessibility: {
    altTexts: Record<string, string>;
    ariaLabels: Record<string, string>;
    semanticRoles: Record<string, string>;
  };
}