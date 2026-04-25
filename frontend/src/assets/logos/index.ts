// Logo Assets Index
export const logoAssets = {
  // Placeholder paths - will be updated when actual logo processing is complete
  variants: {
    full: {
      light: {
        svg: '/assets/logos/full-light.svg',
        png: {
          '1x': '/assets/logos/full-light-1x.png',
          '2x': '/assets/logos/full-light-2x.png',
          '3x': '/assets/logos/full-light-3x.png',
        },
        webp: {
          '1x': '/assets/logos/full-light-1x.webp',
          '2x': '/assets/logos/full-light-2x.webp',
          '3x': '/assets/logos/full-light-3x.webp',
        },
      },
      dark: {
        svg: '/assets/logos/full-dark.svg',
        png: {
          '1x': '/assets/logos/full-dark-1x.png',
          '2x': '/assets/logos/full-dark-2x.png',
          '3x': '/assets/logos/full-dark-3x.png',
        },
        webp: {
          '1x': '/assets/logos/full-dark-1x.webp',
          '2x': '/assets/logos/full-dark-2x.webp',
          '3x': '/assets/logos/full-dark-3x.webp',
        },
      },
    },
    icon: {
      light: {
        svg: '/assets/logos/icon-light.svg',
        png: {
          '1x': '/assets/logos/icon-light-1x.png',
          '2x': '/assets/logos/icon-light-2x.png',
          '3x': '/assets/logos/icon-light-3x.png',
        },
        webp: {
          '1x': '/assets/logos/icon-light-1x.webp',
          '2x': '/assets/logos/icon-light-2x.webp',
          '3x': '/assets/logos/icon-light-3x.webp',
        },
      },
      dark: {
        svg: '/assets/logos/icon-dark.svg',
        png: {
          '1x': '/assets/logos/icon-dark-1x.png',
          '2x': '/assets/logos/icon-dark-2x.png',
          '3x': '/assets/logos/icon-dark-3x.png',
        },
        webp: {
          '1x': '/assets/logos/icon-dark-1x.webp',
          '2x': '/assets/logos/icon-dark-2x.webp',
          '3x': '/assets/logos/icon-dark-3x.webp',
        },
      },
    },
    horizontal: {
      light: {
        svg: '/assets/logos/horizontal-light.svg',
        png: {
          '1x': '/assets/logos/horizontal-light-1x.png',
          '2x': '/assets/logos/horizontal-light-2x.png',
          '3x': '/assets/logos/horizontal-light-3x.png',
        },
        webp: {
          '1x': '/assets/logos/horizontal-light-1x.webp',
          '2x': '/assets/logos/horizontal-light-2x.webp',
          '3x': '/assets/logos/horizontal-light-3x.webp',
        },
      },
      dark: {
        svg: '/assets/logos/horizontal-dark.svg',
        png: {
          '1x': '/assets/logos/horizontal-dark-1x.png',
          '2x': '/assets/logos/horizontal-dark-2x.png',
          '3x': '/assets/logos/horizontal-dark-3x.png',
        },
        webp: {
          '1x': '/assets/logos/horizontal-dark-1x.webp',
          '2x': '/assets/logos/horizontal-dark-2x.webp',
          '3x': '/assets/logos/horizontal-dark-3x.webp',
        },
      },
    },
  },
  metadata: {
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    formats: ['svg', 'webp', 'png'],
    variants: ['full', 'icon', 'horizontal', 'stacked', 'minimal'],
    themes: ['light', 'dark', 'monochrome', 'highContrast'],
  },
};

export default logoAssets;