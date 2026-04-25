// Enhanced UI System Types
export interface AdvancedUIEnhancementState {
  branding: {
    logo: {
      variant: LogoVariant;
      size: LogoSize;
      showText: boolean;
      theme: 'light' | 'dark' | 'auto';
      loading: boolean;
      error?: string;
    };
    theme: {
      mode: 'light' | 'dark' | 'auto';
      culturalTheme: 'default' | 'ethiopian' | 'modern';
      customizations: ThemeCustomization[];
    };
  };
  layout: {
    viewMode: 'grid' | 'list' | 'masonry';
    density: 'compact' | 'comfortable' | 'spacious';
    sidebar: boolean;
    navigation: 'expanded' | 'collapsed' | 'hidden';
  };
  accessibility: {
    reducedMotion: boolean;
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large' | 'xl';
    colorBlindSupport: boolean;
    screenReader: boolean;
    keyboardNavigation: boolean;
  };
  performance: {
    lazyLoading: boolean;
    imageOptimization: boolean;
    animationLevel: 'none' | 'reduced' | 'full';
    preloadStrategy: 'aggressive' | 'moderate' | 'conservative';
    cacheStrategy: 'memory' | 'disk' | 'hybrid';
  };
  content: {
    language: SupportedLanguage;
    culturalContext: CulturalContext;
    personalization: PersonalizationSettings;
  };
  analytics: {
    performanceMetrics: PerformanceMetrics;
    userInteractions: UserInteraction[];
    errorTracking: ErrorLog[];
  };
}

export type LogoVariant = 'full' | 'icon' | 'horizontal' | 'stacked' | 'minimal';
export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'auto';
export type SupportedLanguage = 'en' | 'am' | 'om';

export interface ThemeCustomization {
  property: string;
  value: string;
  scope: 'global' | 'component' | 'page';
}

export interface CulturalContext {
  region: string;
  traditions: string[];
  preferences: Record<string, any>;
}

export interface PersonalizationSettings {
  preferences: Record<string, any>;
  history: UserAction[];
  favorites: string[];
}

export interface UserAction {
  type: string;
  timestamp: Date;
  data: Record<string, any>;
}

export interface PerformanceMetrics {
  pageLoadTime: number;
  imageLoadTime: number;
  animationFrameRate: number;
  memoryUsage: number;
  cacheHitRate: number;
  errorRate: number;
}

export interface UserInteraction {
  type: 'click' | 'scroll' | 'hover' | 'focus' | 'keyboard';
  element: string;
  timestamp: Date;
  duration?: number;
  context: InteractionContext;
}

export interface InteractionContext {
  page: string;
  component: string;
  user: string;
  session: string;
}

export interface ErrorLog {
  id: string;
  type: 'javascript' | 'network' | 'rendering' | 'accessibility';
  message: string;
  stack?: string;
  timestamp: Date;
  context: ErrorContext;
}

export interface ErrorContext {
  page: string;
  component?: string;
  userAgent: string;
  url: string;
}

export interface ResponsiveBreakpoint {
  name: string;
  minWidth: number;
  maxWidth?: number;
  containerWidth: string;
  columns: number;
  gutters: string;
  margins: string;
}

export interface AdvancedResponsiveConfig {
  breakpoints: {
    xs: ResponsiveBreakpoint;
    sm: ResponsiveBreakpoint;
    md: ResponsiveBreakpoint;
    lg: ResponsiveBreakpoint;
    xl: ResponsiveBreakpoint;
    '2xl': ResponsiveBreakpoint;
  };
  components: {
    header: ResponsiveComponentConfig;
    navigation: ResponsiveComponentConfig;
    content: ResponsiveComponentConfig;
    sidebar: ResponsiveComponentConfig;
    footer: ResponsiveComponentConfig;
  };
  images: {
    sizes: ResponsiveImageSizes;
    quality: ResponsiveQualitySettings;
    formats: ResponsiveFormatPreferences;
  };
  typography: {
    scales: ResponsiveTypographyScales;
    lineHeights: ResponsiveLineHeights;
    spacing: ResponsiveSpacing;
  };
}

export interface ResponsiveComponentConfig {
  layout: ComponentLayout;
  spacing: ComponentSpacing;
  typography: ComponentTypography;
  interactions: ComponentInteractions;
  accessibility: ComponentAccessibility;
}

export interface ComponentLayout {
  display: string;
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  gridTemplate?: string;
}

export interface ComponentSpacing {
  padding: string;
  margin: string;
  gap: string;
}

export interface ComponentTypography {
  fontSize: string;
  lineHeight: string;
  fontWeight: string;
  letterSpacing?: string;
}

export interface ComponentInteractions {
  hover: Record<string, string>;
  focus: Record<string, string>;
  active: Record<string, string>;
}

export interface ComponentAccessibility {
  ariaLabels: Record<string, string>;
  roles: Record<string, string>;
  tabIndex: number;
  focusable: boolean;
}

export interface ResponsiveImageSizes {
  mobile: string;
  tablet: string;
  desktop: string;
  xl: string;
}

export interface ResponsiveQualitySettings {
  mobile: number;
  tablet: number;
  desktop: number;
}

export interface ResponsiveFormatPreferences {
  modern: string[];
  fallback: string[];
}

export interface ResponsiveTypographyScales {
  mobile: TypographyScale;
  tablet: TypographyScale;
  desktop: TypographyScale;
}

export interface TypographyScale {
  xs: string;
  sm: string;
  base: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
  '5xl': string;
  '6xl': string;
}

export interface ResponsiveLineHeights {
  mobile: Record<string, string>;
  tablet: Record<string, string>;
  desktop: Record<string, string>;
}

export interface ResponsiveSpacing {
  mobile: Record<string, string>;
  tablet: Record<string, string>;
  desktop: Record<string, string>;
}