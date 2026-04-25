// Library Head Content System Types
export type SupportedLanguage = 'en' | 'am' | 'om';
export type CulturalTheme = 'default' | 'ethiopian' | 'modern';

export interface LocalizedString {
  en: string;
  am: string;
  om: string;
}

export interface RichTextContent {
  text: string;
  formatting: TextFormatting[];
  media?: MediaReference[];
  links?: LinkReference[];
  citations?: Citation[];
  metadata: {
    wordCount: number;
    readingTime: number;
    complexity: 'simple' | 'moderate' | 'complex';
  };
}

export interface LocalizedRichContent {
  en: RichTextContent;
  am: RichTextContent;
  om: RichTextContent;
}

export interface TextFormatting {
  type: 'bold' | 'italic' | 'underline' | 'highlight' | 'quote';
  start: number;
  end: number;
  style?: Record<string, string>;
}

export interface MediaReference {
  type: 'image' | 'video' | 'audio';
  url: string;
  alt?: string;
  caption?: LocalizedString;
  position: number;
}

export interface LinkReference {
  url: string;
  text: string;
  position: number;
  external: boolean;
}

export interface Citation {
  source: string;
  author?: string;
  date?: string;
  url?: string;
  position: number;
}

export interface LibraryHeadSectionProps {
  className?: string;
  variant?: 'hero' | 'featured' | 'compact' | 'sidebar';
  layout?: 'horizontal' | 'vertical' | 'grid' | 'masonry';
  showPhoto?: boolean;
  photoPosition?: 'left' | 'right' | 'top' | 'background';
  language: SupportedLanguage;
  animationLevel?: 'none' | 'reduced' | 'full';
  accessibility?: AccessibilityConfig;
  performance?: PerformanceConfig;
  culturalTheme?: CulturalTheme;
}

export interface AccessibilityConfig {
  reducedMotion: boolean;
  highContrast: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  ariaLabels: Record<string, string>;
}

export interface PerformanceConfig {
  lazyLoading: boolean;
  imageOptimization: boolean;
  preloadStrategy: 'aggressive' | 'moderate' | 'conservative';
  cacheStrategy: 'memory' | 'disk' | 'hybrid';
}

export interface ProfessionalPosition {
  title: LocalizedString;
  organization: LocalizedString;
  startDate: Date;
  endDate?: Date;
  description: LocalizedString;
  achievements: LocalizedString[];
}

export interface Achievement {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  date: Date;
  category: 'professional' | 'community' | 'academic' | 'recognition';
  impact?: LocalizedString;
  media?: MediaReference[];
}

export interface EducationRecord {
  degree: LocalizedString;
  institution: LocalizedString;
  year: number;
  field: LocalizedString;
  honors?: LocalizedString;
}

export interface Certification {
  name: LocalizedString;
  issuer: LocalizedString;
  date: Date;
  expiryDate?: Date;
  credentialId?: string;
}

export interface Publication {
  title: LocalizedString;
  type: 'book' | 'article' | 'paper' | 'report';
  publisher?: LocalizedString;
  date: Date;
  url?: string;
  description?: LocalizedString;
}

export interface BookReference {
  title: LocalizedString;
  author: LocalizedString;
  isbn?: string;
  category: string;
  recommendation?: LocalizedString;
}

export interface ReadingHabits {
  booksPerMonth: number;
  favoriteGenres: LocalizedString[];
  readingTime: string;
  preferredLanguages: SupportedLanguage[];
}

export interface MotivationalQuote {
  id: string;
  text: LocalizedString;
  context?: LocalizedString;
  category: 'reading' | 'education' | 'community' | 'inspiration';
  featured: boolean;
  dateAdded: Date;
}

export interface SuccessStory {
  id: string;
  title: LocalizedString;
  story: LocalizedRichContent;
  participant: string;
  outcome: LocalizedString;
  date: Date;
  category: string;
}

export interface Testimonial {
  id: string;
  text: LocalizedString;
  author: string;
  role?: LocalizedString;
  date: Date;
  rating?: number;
}

export interface ImpactMetric {
  id: string;
  name: LocalizedString;
  value: number;
  unit: string;
  description: LocalizedString;
  trend: 'up' | 'down' | 'stable';
  period: string;
}

export interface Program {
  id: string;
  name: LocalizedString;
  description: LocalizedRichContent;
  status: 'active' | 'planned' | 'completed';
  startDate: Date;
  endDate?: Date;
  participants?: number;
  outcomes?: LocalizedString[];
}

export interface Project {
  id: string;
  name: LocalizedString;
  description: LocalizedRichContent;
  timeline: string;
  budget?: number;
  expectedOutcomes: LocalizedString[];
  status: 'planning' | 'approved' | 'in-progress' | 'completed';
}

export interface Partnership {
  id: string;
  organization: LocalizedString;
  type: 'government' | 'ngo' | 'private' | 'international';
  description: LocalizedString;
  startDate: Date;
  status: 'active' | 'inactive' | 'pending';
  outcomes?: LocalizedString[];
}

export interface LibraryHeadContent {
  profile: {
    personal: {
      name: LocalizedString;
      title: LocalizedString;
      bio: LocalizedRichContent;
      vision: LocalizedRichContent;
      philosophy: LocalizedRichContent;
    };
    professional: {
      experience: {
        years: number;
        positions: ProfessionalPosition[];
        achievements: Achievement[];
        education: EducationRecord[];
      };
      expertise: {
        areas: LocalizedString[];
        certifications: Certification[];
        publications: Publication[];
      };
    };
    interests: {
      hobbies: LocalizedString[];
      favoriteBooks: BookReference[];
      readingHabits: ReadingHabits;
    };
  };
  content: {
    inspiration: {
      readingCultureMessage: LocalizedRichContent;
      motivationalQuotes: MotivationalQuote[];
      libraryMission: LocalizedRichContent;
      communityImpact: LocalizedRichContent;
      futureVision: LocalizedRichContent;
    };
    stories: {
      successStories: SuccessStory[];
      communityTestimonials: Testimonial[];
      impactMetrics: ImpactMetric[];
    };
    initiatives: {
      currentPrograms: Program[];
      futureProjects: Project[];
      partnerships: Partnership[];
    };
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    version: string;
    language: SupportedLanguage;
    approvedBy: string;
    reviewDate: Date;
    culturalReview: 'pending' | 'approved' | 'needs-revision';
    accessibilityReview: 'pending' | 'approved' | 'needs-revision';
  };
}