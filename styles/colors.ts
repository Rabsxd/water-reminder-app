/**
 * Color palette definitions for Water Reminder app
 * Provides consistent color scheme with accessibility support
 */

/**
 * Main color palette
 */
export const COLORS = {
  // Primary colors - Blue water theme
  PRIMARY: '#00CED1', // Dark Turquoise
  PRIMARY_LIGHT: '#B0E0E6', // Powder Blue
  PRIMARY_DARK: '#008B8B', // Dark Cyan

  // Secondary colors - Complementary
  SECONDARY: '#4682B4', // Steel Blue
  SECONDARY_LIGHT: '#87CEEB', // Sky Blue
  SECONDARY_DARK: '#1E90FF', // Dodger Blue

  // Success colors - Green for achievements
  SUCCESS: '#32CD32', // Lime Green
  SUCCESS_LIGHT: '#90EE90', // Light Green
  SUCCESS_DARK: '#228B22', // Forest Green

  // Warning colors - Orange for alerts
  WARNING: '#FF8C00', // Dark Orange
  WARNING_LIGHT: '#FFD700', // Gold
  WARNING_DARK: '#FF6347', // Tomato

  // Error colors - Red for errors
  ERROR: '#DC143C', // Crimson
  ERROR_LIGHT: '#FF6B6B', // Light Red
  ERROR_DARK: '#8B0000', // Dark Red

  // Info colors - Blue for information
  INFO: '#4169E1', // Royal Blue
  INFO_LIGHT: '#87CEFA', // Light Sky Blue
  INFO_DARK: '#191970', // Midnight Blue

  // Neutral colors - Grayscale
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GRAY_50: '#F9FAFB',
  GRAY_100: '#F3F4F6',
  GRAY_200: '#E5E7EB',
  GRAY_300: '#D1D5DB',
  GRAY_400: '#9CA3AF',
  GRAY_500: '#6B7280',
  GRAY_600: '#4B5563',
  GRAY_700: '#374151',
  GRAY_800: '#1F2937',
  GRAY_900: '#111827',

  // Background colors
  BACKGROUND: '#FFFFFF',
  BACKGROUND_CARD: '#F9FAFB',
  BACKGROUND_MODAL: 'rgba(0, 0, 0, 0.5)',
  BACKGROUND_DISABLED: '#F3F4F6',

  // Text colors
  TEXT_PRIMARY: '#111827',
  TEXT_SECONDARY: '#6B7280',
  TEXT_DISABLED: '#9CA3AF',
  TEXT_WHITE: '#FFFFFF',
  TEXT_INVERSE: '#FFFFFF',

  // Border colors
  BORDER: '#E5E7EB',
  BORDER_LIGHT: '#F3F4F6',
  BORDER_DARK: '#D1D5DB',

  // Shadow colors
  SHADOW: 'rgba(0, 0, 0, 0.1)',
  SHADOW_DARK: 'rgba(0, 0, 0, 0.25)',

  // Special colors for water theme
  WATER_DROPLET: '#00BFFF', // Deep Sky Blue
  WATER_WAVE: '#87CEEB', // Sky Blue
  WATER_BUBBLE: '#E0FFFF', // Light Cyan

  // Progress colors
  PROGRESS_START: '#E0F2FE', // Start color (light blue)
  PROGRESS_END: '#0284C7', // End color (dark blue)
  PROGRESS_COMPLETE: '#10B981', // Complete color (green)

  // Theme variants
  LIGHT: {
    BACKGROUND: '#FFFFFF',
    SURFACE: '#F9FAFB',
    TEXT_PRIMARY: '#111827',
    TEXT_SECONDARY: '#6B7280',
    BORDER: '#E5E7EB',
  },

  DARK: {
    BACKGROUND: '#111827',
    SURFACE: '#1F2937',
    TEXT_PRIMARY: '#F9FAFB',
    TEXT_SECONDARY: '#D1D5DB',
    BORDER: '#374151',
  },
} as const;

/**
 * Color utility functions
 */
export const ColorUtils = {
  /**
   * Get color with opacity
   * @param {string} color - Hex color code
   * @param {number} opacity - Opacity value (0-1)
   * @returns {string} Color with opacity
   */
  withOpacity: (color: string, opacity: number): string => {
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      if (hex.length === 6) {
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }
    }
    return color;
  },

  /**
   * Get contrasting text color for background
   * @param {string} backgroundColor - Background color
   * @returns {string} Contrasting text color
   */
  getContrastText: (backgroundColor: string): string => {
    // Simple contrast calculation
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 128 ? COLORS.TEXT_PRIMARY : COLORS.TEXT_WHITE;
  },

  /**
   * Generate color palette for progress
   * @param {number} progress - Progress value (0-1)
   * @returns {string} Color based on progress
   */
  getProgressColor: (progress: number): string => {
    if (progress < 0.3) return COLORS.WARNING;
    if (progress < 0.7) return COLORS.PRIMARY;
    return COLORS.SUCCESS;
  },

  /**
   * Get status color based on value
   * @param {number} value - Current value
   * @param {number} target - Target value
   * @returns {string} Status color
   */
  getStatusColor: (value: number, target: number): string => {
    const percentage = value / target;
    if (percentage >= 1) return COLORS.SUCCESS;
    if (percentage >= 0.7) return COLORS.PRIMARY;
    if (percentage >= 0.4) return COLORS.WARNING;
    return COLORS.ERROR;
  },
};

/**
 * Color gradients for visual elements
 */
export const GRADIENTS = {
  // Primary gradient
  PRIMARY: ['#00CED1', '#4682B4'],

  // Success gradient
  SUCCESS: ['#32CD32', '#228B22'],

  // Warning gradient
  WARNING: ['#FF8C00', '#FFD700'],

  // Error gradient
  ERROR: ['#DC143C', '#FF6B6B'],

  // Water theme gradient
  WATER: ['#00BFFF', '#87CEEB', '#E0FFFF'],

  // Progress gradient
  PROGRESS: ['#E0F2FE', '#0284C7'],

  // Card gradient
  CARD: ['#FFFFFF', '#F9FAFB'],

  // Background gradient
  BACKGROUND: ['#F0F9FF', '#E0F2FE'],
} as const;

/**
 * Semantic color mapping for different states
 */
export const SEMANTIC_COLORS = {
  // Water intake levels
  HYDRATION_EXCELLENT: COLORS.SUCCESS,
  HYDRATION_GOOD: COLORS.PRIMARY,
  HYDRATION_OKAY: COLORS.WARNING,
  HYDRATION_POOR: COLORS.ERROR,

  // Achievement levels
  ACHIEVEMENT_BRONZE: '#CD7F32',
  ACHIEVEMENT_SILVER: '#C0C0C0',
  ACHIEVEMENT_GOLD: '#FFD700',
  ACHIEVEMENT_PLATINUM: '#E5E4E2',

  // Time-based colors
  MORNING: '#FFD700',
  AFTERNOON: '#87CEEB',
  EVENING: '#FF6347',
  NIGHT: '#191970',

  // Weather-inspired colors
  SUNNY: '#FFD700',
  CLOUDY: '#708090',
  RAINY: '#4682B4',
  STORMY: '#2F4F4F',
} as const;

/**
 * Type definitions for color system
 */
export type ColorPalette = typeof COLORS;
export type ColorName = keyof typeof COLORS;
export type GradientName = keyof typeof GRADIENTS;
export type SemanticColorName = keyof typeof SEMANTIC_COLORS;

/**
 * Default export
 */
export default COLORS;