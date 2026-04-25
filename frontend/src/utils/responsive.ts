// Responsive Utilities
export const breakpoints = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  '3xl': 1920,
} as const;

export type Breakpoint = keyof typeof breakpoints;

export const getBreakpoint = (width: number): Breakpoint => {
  if (width >= breakpoints['3xl']) return '3xl';
  if (width >= breakpoints['2xl']) return '2xl';
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  return 'xs';
};

export const useBreakpoint = (): Breakpoint => {
  if (typeof window === 'undefined') return 'lg'; // SSR fallback
  return getBreakpoint(window.innerWidth);
};

export const generateResponsiveSizes = (
  mobile: string,
  tablet: string,
  desktop: string,
  xl?: string
): string => {
  const sizes = [
    `(max-width: ${breakpoints.sm - 1}px) ${mobile}`,
    `(max-width: ${breakpoints.lg - 1}px) ${tablet}`,
    xl 
      ? `(max-width: ${breakpoints['2xl'] - 1}px) ${desktop}`
      : desktop,
  ];
  
  if (xl) {
    sizes.push(xl);
  }
  
  return sizes.join(', ');
};

export const getOptimalImageSize = (
  containerWidth: number,
  devicePixelRatio: number = 1
): string => {
  const actualWidth = containerWidth * devicePixelRatio;
  
  // Round up to nearest common size
  if (actualWidth <= 320) return '320w';
  if (actualWidth <= 640) return '640w';
  if (actualWidth <= 768) return '768w';
  if (actualWidth <= 1024) return '1024w';
  if (actualWidth <= 1280) return '1280w';
  if (actualWidth <= 1536) return '1536w';
  return '1920w';
};

export const createResponsiveImageSrcSet = (
  basePath: string,
  format: 'webp' | 'avif' | 'jpeg' | 'png' = 'webp'
): string => {
  const sizes = [320, 640, 768, 1024, 1280, 1536, 1920];
  return sizes
    .map(size => `${basePath}-${size}w.${format} ${size}w`)
    .join(', ');
};

export const getResponsiveClassName = (
  base: string,
  responsive: Partial<Record<Breakpoint, string>>
): string => {
  const classes = [base];
  
  Object.entries(responsive).forEach(([breakpoint, value]) => {
    if (breakpoint === 'xs') {
      classes.push(value);
    } else {
      classes.push(`${breakpoint}:${value}`);
    }
  });
  
  return classes.filter(Boolean).join(' ');
};

export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < breakpoints.md;
};

export const isTablet = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpoints.md && window.innerWidth < breakpoints.lg;
};

export const isDesktop = (): boolean => {
  if (typeof window === 'undefined') return true;
  return window.innerWidth >= breakpoints.lg;
};