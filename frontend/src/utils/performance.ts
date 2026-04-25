// Performance Utilities
export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  imageLoadTime: number;
  animationFrameRate: number;
  memoryUsage: number;
}

export const measurePerformance = (): PerformanceMetrics => {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  
  return {
    loadTime: navigation.loadEventEnd - navigation.loadEventStart,
    renderTime: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
    imageLoadTime: 0, // Will be updated by image loading observers
    animationFrameRate: 60, // Default, will be measured by animation monitor
    memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
  };
};

export const createImageLoadObserver = (
  callback: (loadTime: number, src: string) => void
): IntersectionObserver => {
  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const startTime = performance.now();
        
        const onLoad = () => {
          const loadTime = performance.now() - startTime;
          callback(loadTime, img.src);
          img.removeEventListener('load', onLoad);
        };
        
        img.addEventListener('load', onLoad);
      }
    });
  }, {
    rootMargin: '50px',
    threshold: 0.1,
  });
};

export const createAnimationFrameMonitor = (
  callback: (fps: number) => void
): (() => void) => {
  let frames = 0;
  let lastTime = performance.now();
  let animationId: number;
  
  const monitor = () => {
    frames++;
    const currentTime = performance.now();
    
    if (currentTime >= lastTime + 1000) {
      const fps = Math.round((frames * 1000) / (currentTime - lastTime));
      callback(fps);
      frames = 0;
      lastTime = currentTime;
    }
    
    animationId = requestAnimationFrame(monitor);
  };
  
  animationId = requestAnimationFrame(monitor);
  
  return () => cancelAnimationFrame(animationId);
};

export const preloadImage = (src: string, priority: 'high' | 'low' = 'low'): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    if (priority === 'high') {
      img.loading = 'eager';
    }
    
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

export const preloadImages = async (
  sources: string[],
  priority: 'high' | 'low' = 'low'
): Promise<void> => {
  const promises = sources.map(src => preloadImage(src, priority));
  await Promise.all(promises);
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const supportsWebP = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

export const supportsAVIF = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  
  const avif = new Image();
  avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  
  try {
    return await new Promise<boolean>((resolve) => {
      avif.onload = () => resolve(true);
      avif.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
};

export const getOptimalImageFormat = async (): Promise<'avif' | 'webp' | 'jpeg'> => {
  if (await supportsAVIF()) return 'avif';
  if (supportsWebP()) return 'webp';
  return 'jpeg';
};

export const createLazyLoadObserver = (
  callback: (element: Element) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver => {
  const defaultOptions: IntersectionObserverInit = {
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  };
  
  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback(entry.target);
      }
    });
  }, defaultOptions);
};