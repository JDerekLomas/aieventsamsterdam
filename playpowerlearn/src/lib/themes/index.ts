// PlayPowerLearn Age-Band Theme System
// Configurable visual styles for K-2, 3-5, 6-8, 9-12

import type { AgeBand } from '@/types/items';

// ============================================
// THEME TYPES
// ============================================

export interface ThemeConfig {
  name: string;
  ageBand: AgeBand;
  description: string;

  // Typography
  typography: {
    fontFamily: {
      display: string;
      body: string;
      mono: string;
    };
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    };
    fontWeight: {
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
    letterSpacing: {
      tight: string;
      normal: string;
      wide: string;
    };
  };

  // Colors
  colors: {
    primary: ColorScale;
    secondary: ColorScale;
    accent: ColorScale;
    success: ColorScale;
    warning: ColorScale;
    error: ColorScale;
    neutral: ColorScale;
    background: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    text: {
      primary: string;
      secondary: string;
      muted: string;
      inverse: string;
    };
  };

  // Spacing & Sizing
  spacing: {
    touchTarget: string;
    touchGap: string;
    containerPadding: string;
    cardPadding: string;
    inputPadding: string;
  };

  // Border Radius
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };

  // Shadows
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    glow: string;
  };

  // Animation
  animation: {
    duration: {
      fast: string;
      normal: string;
      slow: string;
    };
    easing: {
      default: string;
      bounce: string;
      smooth: string;
    };
    celebrationIntensity: 'high' | 'medium' | 'low' | 'none';
  };

  // Components
  components: {
    button: ButtonTheme;
    input: InputTheme;
    card: CardTheme;
    option: OptionTheme;
    feedback: FeedbackTheme;
    progress: ProgressTheme;
  };

  // Audio & Accessibility
  audio: {
    enabled: boolean;
    voiceoverDefault: boolean;
    soundEffects: boolean;
  };

  // Gamification visibility
  gamification: {
    showXP: boolean;
    showStreak: boolean;
    showBadges: boolean;
    showLeaderboard: boolean;
    celebrationLevel: 'full' | 'moderate' | 'subtle' | 'none';
  };

  // Layout
  layout: {
    maxWidth: string;
    density: 'comfortable' | 'standard' | 'compact';
  };

  // Optional accent theme (e.g., desi)
  accent?: {
    name: string;
    patterns: string[];
    motifs: string[];
    colorOverrides?: Partial<ThemeConfig['colors']>;
  };
}

export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface ButtonTheme {
  height: string;
  minWidth: string;
  fontSize: string;
  fontWeight: number;
  borderRadius: string;
  padding: string;
  iconSize: string;
}

export interface InputTheme {
  height: string;
  fontSize: string;
  borderRadius: string;
  borderWidth: string;
  padding: string;
}

export interface CardTheme {
  borderRadius: string;
  padding: string;
  shadow: string;
  borderWidth: string;
}

export interface OptionTheme {
  minHeight: string;
  padding: string;
  borderRadius: string;
  borderWidth: string;
  gap: string;
  selectedScale: number;
}

export interface FeedbackTheme {
  correctColor: string;
  incorrectColor: string;
  correctIcon: string;
  incorrectIcon: string;
  animationDuration: string;
  showConfetti: boolean;
}

export interface ProgressTheme {
  height: string;
  borderRadius: string;
  showPercentage: boolean;
  animated: boolean;
}

// ============================================
// COLOR PALETTES
// ============================================

const colors = {
  // Playful palette for younger learners
  playful: {
    primary: {
      50: '#fef3e2',
      100: '#fde4b9',
      200: '#fcd38c',
      300: '#fbc25f',
      400: '#fab43d',
      500: '#f9a825', // Sunny yellow
      600: '#f59200',
      700: '#ef7900',
      800: '#e86100',
      900: '#dc3c00',
    },
    secondary: {
      50: '#e8f5e9',
      100: '#c8e6c9',
      200: '#a5d6a7',
      300: '#81c784',
      400: '#66bb6a',
      500: '#4caf50', // Friendly green
      600: '#43a047',
      700: '#388e3c',
      800: '#2e7d32',
      900: '#1b5e20',
    },
    accent: {
      50: '#e3f2fd',
      100: '#bbdefb',
      200: '#90caf9',
      300: '#64b5f6',
      400: '#42a5f5',
      500: '#2196f3', // Sky blue
      600: '#1e88e5',
      700: '#1976d2',
      800: '#1565c0',
      900: '#0d47a1',
    },
  },

  // Balanced palette for elementary
  balanced: {
    primary: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316', // Saffron
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
    },
    secondary: {
      50: '#ecfeff',
      100: '#cffafe',
      200: '#a5f3fc',
      300: '#67e8f9',
      400: '#22d3ee',
      500: '#06b6d4', // Peacock
      600: '#0891b2',
      700: '#0e7490',
      800: '#155e75',
      900: '#164e63',
    },
    accent: {
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fbcfe8',
      300: '#f9a8d4',
      400: '#f472b6',
      500: '#ec4899', // Lotus
      600: '#db2777',
      700: '#be185d',
      800: '#9d174d',
      900: '#831843',
    },
  },

  // Clean palette for middle school
  clean: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6', // Blue
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    secondary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e', // Green
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    accent: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7', // Purple
      600: '#9333ea',
      700: '#7e22ce',
      800: '#6b21a8',
      900: '#581c87',
    },
  },

  // Professional palette for high school
  professional: {
    primary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b', // Slate
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    secondary: {
      50: '#f0fdfa',
      100: '#ccfbf1',
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#14b8a6', // Teal
      600: '#0d9488',
      700: '#0f766e',
      800: '#115e59',
      900: '#134e4a',
    },
    accent: {
      50: '#fff1f2',
      100: '#ffe4e6',
      200: '#fecdd3',
      300: '#fda4af',
      400: '#fb7185',
      500: '#f43f5e', // Rose
      600: '#e11d48',
      700: '#be123c',
      800: '#9f1239',
      900: '#881337',
    },
  },

  // Shared colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  neutral: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
  },
};

// ============================================
// THEME DEFINITIONS
// ============================================

export const themes: Record<AgeBand, ThemeConfig> = {
  'k-2': {
    name: 'Early Learners',
    ageBand: 'k-2',
    description: 'Playful, large touch targets, audio-first, high celebration',

    typography: {
      fontFamily: {
        display: "'Nunito', 'Comic Neue', sans-serif",
        body: "'Nunito', sans-serif",
        mono: "'Fira Code', monospace",
      },
      fontSize: {
        xs: '16px',
        sm: '18px',
        base: '22px',
        lg: '26px',
        xl: '32px',
        '2xl': '40px',
        '3xl': '48px',
        '4xl': '60px',
      },
      fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      lineHeight: {
        tight: 1.2,
        normal: 1.6,
        relaxed: 1.8,
      },
      letterSpacing: {
        tight: '0',
        normal: '0.02em',
        wide: '0.05em',
      },
    },

    colors: {
      primary: colors.playful.primary,
      secondary: colors.playful.secondary,
      accent: colors.playful.accent,
      success: colors.success,
      warning: colors.warning,
      error: colors.error,
      neutral: colors.neutral,
      background: {
        primary: '#fffbf5',
        secondary: '#fff8e7',
        tertiary: '#fff3d6',
      },
      text: {
        primary: '#1a1a2e',
        secondary: '#4a4a68',
        muted: '#8888a0',
        inverse: '#ffffff',
      },
    },

    spacing: {
      touchTarget: '64px',
      touchGap: '20px',
      containerPadding: '24px',
      cardPadding: '24px',
      inputPadding: '16px',
    },

    borderRadius: {
      none: '0',
      sm: '12px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      full: '9999px',
    },

    shadows: {
      sm: '0 2px 8px rgba(0, 0, 0, 0.08)',
      md: '0 4px 16px rgba(0, 0, 0, 0.1)',
      lg: '0 8px 32px rgba(0, 0, 0, 0.12)',
      xl: '0 16px 48px rgba(0, 0, 0, 0.15)',
      glow: '0 0 20px rgba(249, 168, 37, 0.4)',
    },

    animation: {
      duration: {
        fast: '200ms',
        normal: '400ms',
        slow: '800ms',
      },
      easing: {
        default: 'cubic-bezier(0.4, 0, 0.2, 1)',
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
      celebrationIntensity: 'high',
    },

    components: {
      button: {
        height: '64px',
        minWidth: '120px',
        fontSize: '22px',
        fontWeight: 700,
        borderRadius: '20px',
        padding: '16px 32px',
        iconSize: '28px',
      },
      input: {
        height: '64px',
        fontSize: '22px',
        borderRadius: '16px',
        borderWidth: '3px',
        padding: '16px 20px',
      },
      card: {
        borderRadius: '24px',
        padding: '24px',
        shadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        borderWidth: '0',
      },
      option: {
        minHeight: '72px',
        padding: '20px 24px',
        borderRadius: '20px',
        borderWidth: '4px',
        gap: '20px',
        selectedScale: 1.02,
      },
      feedback: {
        correctColor: '#22c55e',
        incorrectColor: '#ef4444',
        correctIcon: '🎉',
        incorrectIcon: '💪',
        animationDuration: '600ms',
        showConfetti: true,
      },
      progress: {
        height: '16px',
        borderRadius: '9999px',
        showPercentage: false,
        animated: true,
      },
    },

    audio: {
      enabled: true,
      voiceoverDefault: true,
      soundEffects: true,
    },

    gamification: {
      showXP: true,
      showStreak: true,
      showBadges: true,
      showLeaderboard: false,
      celebrationLevel: 'full',
    },

    layout: {
      maxWidth: '800px',
      density: 'comfortable',
    },
  },

  '3-5': {
    name: 'Elementary',
    ageBand: '3-5',
    description: 'Balanced, gamified, Indian-inspired accents',

    typography: {
      fontFamily: {
        display: "'Poppins', sans-serif",
        body: "'Inter', sans-serif",
        mono: "'Fira Code', monospace",
      },
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '22px',
        '2xl': '28px',
        '3xl': '36px',
        '4xl': '48px',
      },
      fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
      },
      letterSpacing: {
        tight: '-0.01em',
        normal: '0',
        wide: '0.02em',
      },
    },

    colors: {
      primary: colors.balanced.primary,
      secondary: colors.balanced.secondary,
      accent: colors.balanced.accent,
      success: colors.success,
      warning: colors.warning,
      error: colors.error,
      neutral: colors.neutral,
      background: {
        primary: '#ffffff',
        secondary: '#fafafa',
        tertiary: '#f4f4f5',
      },
      text: {
        primary: '#18181b',
        secondary: '#3f3f46',
        muted: '#71717a',
        inverse: '#ffffff',
      },
    },

    spacing: {
      touchTarget: '48px',
      touchGap: '12px',
      containerPadding: '20px',
      cardPadding: '20px',
      inputPadding: '12px',
    },

    borderRadius: {
      none: '0',
      sm: '6px',
      md: '10px',
      lg: '14px',
      xl: '20px',
      full: '9999px',
    },

    shadows: {
      sm: '0 1px 4px rgba(0, 0, 0, 0.06)',
      md: '0 4px 12px rgba(0, 0, 0, 0.08)',
      lg: '0 8px 24px rgba(0, 0, 0, 0.1)',
      xl: '0 12px 40px rgba(0, 0, 0, 0.12)',
      glow: '0 0 16px rgba(249, 115, 22, 0.3)',
    },

    animation: {
      duration: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
      },
      easing: {
        default: 'cubic-bezier(0.4, 0, 0.2, 1)',
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
      celebrationIntensity: 'medium',
    },

    components: {
      button: {
        height: '48px',
        minWidth: '100px',
        fontSize: '16px',
        fontWeight: 600,
        borderRadius: '12px',
        padding: '12px 24px',
        iconSize: '20px',
      },
      input: {
        height: '48px',
        fontSize: '16px',
        borderRadius: '10px',
        borderWidth: '2px',
        padding: '12px 16px',
      },
      card: {
        borderRadius: '16px',
        padding: '20px',
        shadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        borderWidth: '0',
      },
      option: {
        minHeight: '56px',
        padding: '16px 20px',
        borderRadius: '14px',
        borderWidth: '2px',
        gap: '12px',
        selectedScale: 1.01,
      },
      feedback: {
        correctColor: '#22c55e',
        incorrectColor: '#ef4444',
        correctIcon: '✓',
        incorrectIcon: '✗',
        animationDuration: '400ms',
        showConfetti: true,
      },
      progress: {
        height: '12px',
        borderRadius: '9999px',
        showPercentage: true,
        animated: true,
      },
    },

    audio: {
      enabled: true,
      voiceoverDefault: false,
      soundEffects: true,
    },

    gamification: {
      showXP: true,
      showStreak: true,
      showBadges: true,
      showLeaderboard: true,
      celebrationLevel: 'full',
    },

    layout: {
      maxWidth: '900px',
      density: 'standard',
    },

    accent: {
      name: 'Desi',
      patterns: ['rangoli', 'paisley', 'mandala'],
      motifs: ['lotus', 'peacock', 'diya'],
    },
  },

  '6-8': {
    name: 'Middle School',
    ageBand: '6-8',
    description: 'Clean, efficient, moderate gamification',

    typography: {
      fontFamily: {
        display: "'Inter', sans-serif",
        body: "'Inter', sans-serif",
        mono: "'JetBrains Mono', monospace",
      },
      fontSize: {
        xs: '12px',
        sm: '13px',
        base: '15px',
        lg: '17px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '36px',
      },
      fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.625,
      },
      letterSpacing: {
        tight: '-0.02em',
        normal: '0',
        wide: '0.01em',
      },
    },

    colors: {
      primary: colors.clean.primary,
      secondary: colors.clean.secondary,
      accent: colors.clean.accent,
      success: colors.success,
      warning: colors.warning,
      error: colors.error,
      neutral: colors.neutral,
      background: {
        primary: '#ffffff',
        secondary: '#f8fafc',
        tertiary: '#f1f5f9',
      },
      text: {
        primary: '#0f172a',
        secondary: '#334155',
        muted: '#64748b',
        inverse: '#ffffff',
      },
    },

    spacing: {
      touchTarget: '44px',
      touchGap: '10px',
      containerPadding: '16px',
      cardPadding: '16px',
      inputPadding: '10px',
    },

    borderRadius: {
      none: '0',
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
      full: '9999px',
    },

    shadows: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
      md: '0 2px 8px rgba(0, 0, 0, 0.06)',
      lg: '0 4px 16px rgba(0, 0, 0, 0.08)',
      xl: '0 8px 32px rgba(0, 0, 0, 0.1)',
      glow: '0 0 12px rgba(59, 130, 246, 0.25)',
    },

    animation: {
      duration: {
        fast: '100ms',
        normal: '200ms',
        slow: '300ms',
      },
      easing: {
        default: 'cubic-bezier(0.4, 0, 0.2, 1)',
        bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
      celebrationIntensity: 'low',
    },

    components: {
      button: {
        height: '40px',
        minWidth: '80px',
        fontSize: '14px',
        fontWeight: 500,
        borderRadius: '8px',
        padding: '10px 16px',
        iconSize: '18px',
      },
      input: {
        height: '40px',
        fontSize: '15px',
        borderRadius: '8px',
        borderWidth: '1px',
        padding: '10px 12px',
      },
      card: {
        borderRadius: '12px',
        padding: '16px',
        shadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        borderWidth: '1px',
      },
      option: {
        minHeight: '48px',
        padding: '12px 16px',
        borderRadius: '10px',
        borderWidth: '2px',
        gap: '10px',
        selectedScale: 1,
      },
      feedback: {
        correctColor: '#22c55e',
        incorrectColor: '#ef4444',
        correctIcon: '✓',
        incorrectIcon: '✗',
        animationDuration: '250ms',
        showConfetti: false,
      },
      progress: {
        height: '8px',
        borderRadius: '9999px',
        showPercentage: true,
        animated: true,
      },
    },

    audio: {
      enabled: false,
      voiceoverDefault: false,
      soundEffects: false,
    },

    gamification: {
      showXP: true,
      showStreak: true,
      showBadges: true,
      showLeaderboard: true,
      celebrationLevel: 'moderate',
    },

    layout: {
      maxWidth: '1000px',
      density: 'standard',
    },
  },

  '9-12': {
    name: 'High School',
    ageBand: '9-12',
    description: 'Professional, efficient, subtle gamification',

    typography: {
      fontFamily: {
        display: "'Inter', sans-serif",
        body: "'Inter', sans-serif",
        mono: "'JetBrains Mono', monospace",
      },
      fontSize: {
        xs: '11px',
        sm: '12px',
        base: '14px',
        lg: '16px',
        xl: '18px',
        '2xl': '22px',
        '3xl': '28px',
        '4xl': '34px',
      },
      fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      lineHeight: {
        tight: 1.2,
        normal: 1.45,
        relaxed: 1.6,
      },
      letterSpacing: {
        tight: '-0.02em',
        normal: '0',
        wide: '0.01em',
      },
    },

    colors: {
      primary: colors.professional.primary,
      secondary: colors.professional.secondary,
      accent: colors.professional.accent,
      success: colors.success,
      warning: colors.warning,
      error: colors.error,
      neutral: colors.neutral,
      background: {
        primary: '#ffffff',
        secondary: '#fafafa',
        tertiary: '#f4f4f5',
      },
      text: {
        primary: '#09090b',
        secondary: '#27272a',
        muted: '#52525b',
        inverse: '#ffffff',
      },
    },

    spacing: {
      touchTarget: '36px',
      touchGap: '8px',
      containerPadding: '16px',
      cardPadding: '16px',
      inputPadding: '8px',
    },

    borderRadius: {
      none: '0',
      sm: '4px',
      md: '6px',
      lg: '8px',
      xl: '12px',
      full: '9999px',
    },

    shadows: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.04)',
      md: '0 2px 4px rgba(0, 0, 0, 0.05)',
      lg: '0 4px 8px rgba(0, 0, 0, 0.06)',
      xl: '0 8px 16px rgba(0, 0, 0, 0.08)',
      glow: '0 0 8px rgba(20, 184, 166, 0.2)',
    },

    animation: {
      duration: {
        fast: '75ms',
        normal: '150ms',
        slow: '250ms',
      },
      easing: {
        default: 'cubic-bezier(0.4, 0, 0.2, 1)',
        bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
      celebrationIntensity: 'none',
    },

    components: {
      button: {
        height: '36px',
        minWidth: '72px',
        fontSize: '13px',
        fontWeight: 500,
        borderRadius: '6px',
        padding: '8px 14px',
        iconSize: '16px',
      },
      input: {
        height: '36px',
        fontSize: '14px',
        borderRadius: '6px',
        borderWidth: '1px',
        padding: '8px 10px',
      },
      card: {
        borderRadius: '8px',
        padding: '16px',
        shadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
        borderWidth: '1px',
      },
      option: {
        minHeight: '40px',
        padding: '10px 14px',
        borderRadius: '8px',
        borderWidth: '1px',
        gap: '8px',
        selectedScale: 1,
      },
      feedback: {
        correctColor: '#22c55e',
        incorrectColor: '#ef4444',
        correctIcon: '✓',
        incorrectIcon: '✗',
        animationDuration: '150ms',
        showConfetti: false,
      },
      progress: {
        height: '6px',
        borderRadius: '9999px',
        showPercentage: true,
        animated: false,
      },
    },

    audio: {
      enabled: false,
      voiceoverDefault: false,
      soundEffects: false,
    },

    gamification: {
      showXP: false,
      showStreak: false,
      showBadges: true,
      showLeaderboard: false,
      celebrationLevel: 'none',
    },

    layout: {
      maxWidth: '1100px',
      density: 'compact',
    },
  },
};

// ============================================
// THEME UTILITIES
// ============================================

export function getTheme(ageBand: AgeBand): ThemeConfig {
  return themes[ageBand];
}

export function getThemeForGrade(grade: string): ThemeConfig {
  const gradeNum = grade === 'K' ? 0 : parseInt(grade, 10);

  if (gradeNum <= 2) return themes['k-2'];
  if (gradeNum <= 5) return themes['3-5'];
  if (gradeNum <= 8) return themes['6-8'];
  return themes['9-12'];
}

export function mergeThemeWithAccent(
  baseTheme: ThemeConfig,
  accentOverrides?: Partial<ThemeConfig>
): ThemeConfig {
  if (!accentOverrides) return baseTheme;

  return {
    ...baseTheme,
    ...accentOverrides,
    colors: {
      ...baseTheme.colors,
      ...(accentOverrides.colors || {}),
    },
    components: {
      ...baseTheme.components,
      ...(accentOverrides.components || {}),
    },
  };
}

// CSS Custom Properties generator
export function generateCSSVariables(theme: ThemeConfig): Record<string, string> {
  const vars: Record<string, string> = {};

  // Typography
  vars['--font-display'] = theme.typography.fontFamily.display;
  vars['--font-body'] = theme.typography.fontFamily.body;
  vars['--font-mono'] = theme.typography.fontFamily.mono;

  Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
    vars[`--text-${key}`] = value;
  });

  // Colors
  Object.entries(theme.colors.primary).forEach(([key, value]) => {
    vars[`--color-primary-${key}`] = value;
  });
  Object.entries(theme.colors.secondary).forEach(([key, value]) => {
    vars[`--color-secondary-${key}`] = value;
  });
  Object.entries(theme.colors.accent).forEach(([key, value]) => {
    vars[`--color-accent-${key}`] = value;
  });

  vars['--bg-primary'] = theme.colors.background.primary;
  vars['--bg-secondary'] = theme.colors.background.secondary;
  vars['--bg-tertiary'] = theme.colors.background.tertiary;
  vars['--text-primary'] = theme.colors.text.primary;
  vars['--text-secondary'] = theme.colors.text.secondary;
  vars['--text-muted'] = theme.colors.text.muted;

  // Spacing
  vars['--touch-target'] = theme.spacing.touchTarget;
  vars['--touch-gap'] = theme.spacing.touchGap;

  // Border radius
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    vars[`--radius-${key}`] = value;
  });

  // Animation
  vars['--duration-fast'] = theme.animation.duration.fast;
  vars['--duration-normal'] = theme.animation.duration.normal;
  vars['--duration-slow'] = theme.animation.duration.slow;
  vars['--easing-default'] = theme.animation.easing.default;
  vars['--easing-bounce'] = theme.animation.easing.bounce;

  return vars;
}
