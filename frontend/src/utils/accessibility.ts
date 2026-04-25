// Accessibility Utilities
export interface AccessibilityPreferences {
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'xl';
  colorBlindSupport: boolean;
  screenReader: boolean;
}

export const getAccessibilityPreferences = (): AccessibilityPreferences => {
  if (typeof window === 'undefined') {
    return {
      reducedMotion: false,
      highContrast: false,
      fontSize: 'medium',
      colorBlindSupport: false,
      screenReader: false,
    };
  }

  return {
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    highContrast: window.matchMedia('(prefers-contrast: high)').matches,
    fontSize: getFontSizePreference(),
    colorBlindSupport: getColorBlindSupport(),
    screenReader: detectScreenReader(),
  };
};

const getFontSizePreference = (): 'small' | 'medium' | 'large' | 'xl' => {
  const fontSize = window.getComputedStyle(document.documentElement).fontSize;
  const baseFontSize = parseFloat(fontSize);
  
  if (baseFontSize >= 20) return 'xl';
  if (baseFontSize >= 18) return 'large';
  if (baseFontSize <= 14) return 'small';
  return 'medium';
};

const getColorBlindSupport = (): boolean => {
  // Check if user has enabled high contrast or specific color schemes
  return window.matchMedia('(prefers-contrast: high)').matches ||
         window.matchMedia('(prefers-color-scheme: no-preference)').matches;
};

const detectScreenReader = (): boolean => {
  // Basic screen reader detection
  return !!(
    navigator.userAgent.match(/NVDA|JAWS|VoiceOver|TalkBack|Dragon/i) ||
    window.speechSynthesis ||
    document.querySelector('[aria-live]')
  );
};

export const createFocusTrap = (element: HTMLElement): (() => void) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ) as NodeListOf<HTMLElement>;
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };
  
  element.addEventListener('keydown', handleTabKey);
  
  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
};

export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

export const generateAriaLabel = (
  base: string,
  context?: string,
  state?: string
): string => {
  const parts = [base];
  if (context) parts.push(context);
  if (state) parts.push(state);
  return parts.join(', ');
};

export const createSkipLink = (
  targetId: string,
  text: string = 'Skip to main content'
): HTMLAnchorElement => {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.textContent = text;
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-md';
  
  return skipLink;
};

export const ensureMinimumTouchTarget = (element: HTMLElement): void => {
  const rect = element.getBoundingClientRect();
  const minSize = 44; // WCAG minimum touch target size
  
  if (rect.width < minSize || rect.height < minSize) {
    element.style.minWidth = `${minSize}px`;
    element.style.minHeight = `${minSize}px`;
  }
};

export const validateColorContrast = (
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA'
): boolean => {
  const getLuminance = (color: string): number => {
    // Simplified luminance calculation
    const rgb = color.match(/\d+/g);
    if (!rgb) return 0;
    
    const [r, g, b] = rgb.map(c => {
      const val = parseInt(c) / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const contrast = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  
  return level === 'AAA' ? contrast >= 7 : contrast >= 4.5;
};

export const addKeyboardNavigation = (
  elements: HTMLElement[],
  options: {
    circular?: boolean;
    orientation?: 'horizontal' | 'vertical' | 'both';
  } = {}
): (() => void) => {
  const { circular = true, orientation = 'both' } = options;
  
  const handleKeyDown = (e: KeyboardEvent) => {
    const currentIndex = elements.indexOf(e.target as HTMLElement);
    if (currentIndex === -1) return;
    
    let nextIndex = currentIndex;
    
    switch (e.key) {
      case 'ArrowRight':
        if (orientation === 'horizontal' || orientation === 'both') {
          nextIndex = currentIndex + 1;
          if (nextIndex >= elements.length && circular) nextIndex = 0;
          e.preventDefault();
        }
        break;
      case 'ArrowLeft':
        if (orientation === 'horizontal' || orientation === 'both') {
          nextIndex = currentIndex - 1;
          if (nextIndex < 0 && circular) nextIndex = elements.length - 1;
          e.preventDefault();
        }
        break;
      case 'ArrowDown':
        if (orientation === 'vertical' || orientation === 'both') {
          nextIndex = currentIndex + 1;
          if (nextIndex >= elements.length && circular) nextIndex = 0;
          e.preventDefault();
        }
        break;
      case 'ArrowUp':
        if (orientation === 'vertical' || orientation === 'both') {
          nextIndex = currentIndex - 1;
          if (nextIndex < 0 && circular) nextIndex = elements.length - 1;
          e.preventDefault();
        }
        break;
      case 'Home':
        nextIndex = 0;
        e.preventDefault();
        break;
      case 'End':
        nextIndex = elements.length - 1;
        e.preventDefault();
        break;
    }
    
    if (nextIndex !== currentIndex && elements[nextIndex]) {
      elements[nextIndex].focus();
    }
  };
  
  elements.forEach(element => {
    element.addEventListener('keydown', handleKeyDown);
    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }
  });
  
  return () => {
    elements.forEach(element => {
      element.removeEventListener('keydown', handleKeyDown);
    });
  };
};