/**
 * Constants for the Water Reminder app
 * Contains all application-wide constant values used throughout the app
 */

/**
 * Storage keys for AsyncStorage
 * @constant {Object}
 */
export const STORAGE_KEYS = {
  SETTINGS: '@water_settings',
  TODAY: '@water_today',
  HISTORY: '@water_history',
  LAST_REMINDER: '@water_last_reminder',
  LAST_CHECK_DATE: '@water_last_check_date',
} as const;

/**
 * Default daily water target in milliliters
 * @constant {number}
 */
export const DAILY_TARGET_DEFAULT = 2000;

/**
 * Minimum and maximum daily water targets in milliliters
 * @constant {Object}
 */
export const DAILY_TARGET_LIMITS = {
  MIN: 1000,
  MAX: 4000,
  STEP: 100, // Must be multiple of 100
} as const;

/**
 * Quick add water amounts in milliliters
 * @constant {number[]}
 */
export const QUICK_ADD_AMOUNTS = [200, 300, 500] as const;

/**
 * Water amount validation limits
 * @constant {Object}
 */
export const AMOUNT_LIMITS = {
  MIN: 50,
  MAX: 1000,
  DAILY_MAX: 5000, // Safety limit per day
} as const;

/**
 * Default reminder interval in minutes
 * @constant {number}
 */
export const REMINDER_INTERVAL_DEFAULT = 60;

/**
 * Available reminder intervals in minutes
 * @constant {number[]}
 */
export const REMINDER_INTERVALS = [30, 60, 90, 120] as const;

/**
 * Custom reminder interval limits
 * @constant {Object}
 */
export const REMINDER_INTERVAL_LIMITS = {
  MIN: 15,
  MAX: 240,
} as const;

/**
 * Default wake hours
 * @constant {Object}
 */
export const WAKE_HOURS_DEFAULT = {
  START: 7, // 7:00 AM
  END: 22, // 10:00 PM
} as const;

/**
 * Wake hour limits
 * @constant {Object}
 */
export const WAKE_HOURS_LIMITS = {
  START_MIN: 0, // 12:00 AM
  START_MAX: 23, // 11:00 PM
  END_MIN: 1, // 1:00 AM
  END_MAX: 24, // 12:00 AM (next day)
} as const;

/**
 * Data retention period in days
 * @constant {number}
 */
export const DATA_RETENTION_DAYS = 30;

/**
 * Streak calculation threshold (percentage of target to count as completed)
 * @constant {number}
 */
export const STREAK_COMPLETION_THRESHOLD = 0.8; // 80%

/**
 * Performance optimization constants
 * @constant {Object}
 */
export const PERFORMANCE = {
  FLATLIST_INITIAL_RENDER: 15,
  FLATLIST_MAX_BATCH: 10,
  FLATLIST_WINDOW_SIZE: 5,
  STORAGE_DEBOUNCE_MS: 500,
} as const;

/**
 * Animation durations in milliseconds
 * @constant {Object}
 */
export const ANIMATION_DURATION = {
  SPLASH: 2000,
  SUCCESS: 1000,
  BUTTON_PRESS: 150,
  SCREEN_TRANSITION: 300,
  PROGRESS_UPDATE: 500,
} as const;

/**
 * Color palette - Using enhanced water theme
 * @constant {Object}
 */
export const COLORS = {
  // Primary colors - Blue water theme
  PRIMARY: '#00CED1', // Dark Turquoise
  PRIMARY_DARK: '#008B8B', // Dark Cyan
  PRIMARY_LIGHT: '#B0E0E6', // Powder Blue

  // Secondary colors - Complementary
  SECONDARY: '#4682B4', // Steel Blue
  SECONDARY_DARK: '#1E90FF', // Dodger Blue
  SECONDARY_LIGHT: '#87CEEB', // Sky Blue

  // Background colors
  BACKGROUND: '#FFFFFF',
  BACKGROUND_CARD: '#F9FAFB',
  BACKGROUND_DISABLED: '#F3F4F6',

  // Text colors
  TEXT_PRIMARY: '#111827',
  TEXT_SECONDARY: '#6B7280',
  TEXT_DISABLED: '#9CA3AF',
  TEXT_WHITE: '#FFFFFF',

  // Status colors
  SUCCESS: '#32CD32', // Lime Green
  WARNING: '#FF8C00', // Dark Orange
  ERROR: '#DC143C', // Crimson
  INFO: '#4169E1', // Royal Blue

  // Water progress colors - Enhanced water theme
  WATER_LOW: '#DC143C', // Poor hydration - Red
  WATER_MEDIUM: '#FF8C00', // Okay hydration - Orange
  WATER_GOOD: '#00CED1', // Good hydration - Turquoise
  WATER_EXCELLENT: '#32CD32', // Excellent hydration - Green

  // Special water colors
  WATER_DROPLET: '#00BFFF', // Deep Sky Blue
  WATER_WAVE: '#87CEEB', // Sky Blue
  WATER_BUBBLE: '#E0FFFF', // Light Cyan

  // Progress colors
  PROGRESS_START: '#E0F2FE', // Start color (light blue)
  PROGRESS_END: '#0284C7', // End color (dark blue)
  PROGRESS_COMPLETE: '#10B981', // Complete color (green)

  // Border colors
  BORDER: '#E5E7EB',
  BORDER_FOCUS: '#00CED1',
  BORDER_LIGHT: '#F3F4F6',
  BORDER_DARK: '#D1D5DB',

  // Shadow colors
  SHADOW: 'rgba(0, 0, 0, 0.1)',
  SHADOW_DARK: 'rgba(0, 0, 0, 0.25)',

  // Additional colors for consistency
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

  // React Native Switch colors (boolean true/false values)
  SWITCH_ENABLED: true,
  SWITCH_DISABLED: false,
} as const;

/**
 * Typography constants - Enhanced with better hierarchy
 * @constant {Object}
 */
export const TYPOGRAPHY = {
  // Font sizes - Enhanced hierarchy
  FONT_SIZE_XS: 10,    // Caption, labels
  FONT_SIZE_SM: 12,    // Small text, captions
  FONT_SIZE_BASE: 14,  // Body text
  FONT_SIZE_MD: 16,    // Standard body
  FONT_SIZE_LG: 18,    // Small headings
  FONT_SIZE_XL: 20,    // Medium headings
  FONT_SIZE_2XL: 24,   // Large headings
  FONT_SIZE_3XL: 30,   // Display text
  FONT_SIZE_4XL: 36,   // Hero display

  // Legacy naming compatibility
  FONT_SIZE_SMALL: 12,
  FONT_SIZE_MEDIUM: 14,
  FONT_SIZE_LARGE: 18,

  // Font weights
  FONT_WEIGHT_NORMAL: '400',
  FONT_WEIGHT_MEDIUM: '500',
  FONT_WEIGHT_SEMI_BOLD: '600',
  FONT_WEIGHT_BOLD: '700',

  // Line heights - Better readability
  LINE_HEIGHT_TIGHT: 1.0,
  LINE_HEIGHT_NORMAL: 1.2,
  LINE_HEIGHT_RELAXED: 1.4,
  LINE_HEIGHT_LOOSE: 1.6,

  // Letter spacing
  LETTER_SPACING_TIGHT: -0.5,
  LETTER_SPACING_NORMAL: 0,
  LETTER_SPACING_WIDE: 0.5,
  LETTER_SPACING_EXTRA_WIDE: 1.0,
} as const;

/**
 * Spacing constants - Enhanced with better scale
 * @constant {Object}
 */
export const SPACING = {
  // Micro spacing
  XXS: 2,
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48,
  XXXL: 64,
  XXXXL: 80,

  // Common spacing combinations
  TIGHT: 8,
  NORMAL: 16,
  LOOSE: 24,
  EXTRA_LOOSE: 32,
} as const;

/**
 * Border radius constants - Enhanced variety
 * @constant {Object}
 */
export const BORDER_RADIUS = {
  XS: 2,     // Subtle corners
  SM: 4,     // Small corners
  MD: 8,     // Standard corners
  LG: 12,    // Large corners
  XL: 16,    // Extra large corners
  XXL: 24,   // Very large corners
  FULL: 9999, // Perfect circles
} as const;

/**
 * Breakpoint constants for responsive design
 * @constant {Object}
 */
export const BREAKPOINTS = {
  SM: 375,  // iPhone SE
  MD: 768,  // iPad Mini
  LG: 1024, // iPad
  XL: 1280, // Large tablets
} as const;

/**
 * Shadow and elevation constants
 * @constant {Object}
 */
export const SHADOWS = {
  NONE: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  SMALL: {
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  MEDIUM: {
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  LARGE: {
    shadowColor: COLORS.SHADOW_DARK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
} as const;

/**
 * Z-index layering constants
 * @constant {Object}
 */
export const Z_INDEX = {
  BACKGROUND: -1,
  BASE: 0,
  OVERLAY: 10,
  DROPDOWN: 20,
  MODAL: 30,
  POPOVER: 40,
  TOOLTIP: 50,
  NOTIFICATION: 100,
} as const;

/**
 * Animation duration constants
 * @constant {Object}
 */
export const ANIMATION_TIMING = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  EXTRA_SLOW: 1000,
} as const;

/**
 * Accessibility constants
 * @constant {Object}
 */
export const ACCESSIBILITY = {
  // Minimum touch target size (44x44 points for iOS)
  MIN_TOUCH_TARGET: 44,

  // High contrast colors
  HIGH_CONTRAST: {
    BACKGROUND: COLORS.TEXT_WHITE,
    TEXT: COLORS.TEXT_PRIMARY,
    PRIMARY: COLORS.PRIMARY_DARK,
    SUCCESS: COLORS.SUCCESS,
    WARNING: COLORS.WARNING,
    ERROR: COLORS.ERROR,
  },

  // Screen reader labels
  LABELS: {
    WATER_AMOUNT: (amount: number) => `${amount} mililiter air`,
    PROGRESS_PERCENTAGE: (percentage: number) => `${percentage} persen target tercapai`,
    ADD_WATER: 'Tambah air',
    REMOVE_ENTRY: 'Hapus entri',
    SETTINGS: 'Pengaturan',
    NOTIFICATIONS: 'Notifikasi',
  },
} as const;

/**
 * Error messages
 * @constant {Object}
 */
export const ERROR_MESSAGES = {
  INVALID_AMOUNT: 'Jumlah air tidak valid. Minimal 50ml, maksimal 1000ml.',
  DAILY_LIMIT_EXCEEDED: 'Batas harian terlampaui. Maksimal 5000ml per hari.',
  STORAGE_ERROR: 'Terjadi kesalahan saat menyimpan data.',
  NOTIFICATION_ERROR: 'Tidak dapat mengatur pengingat.',
  NETWORK_ERROR: 'Tidak ada koneksi internet.',
  GENERIC_ERROR: 'Terjadi kesalahan. Silakan coba lagi.',
} as const;

/**
 * Success messages
 * @constant {Object}
 */
export const SUCCESS_MESSAGES = {
  WATER_ADDED: (amount: number) => `${amount}ml air berhasil ditambahkan!`,
  TARGET_REACHED: 'Target harian tercapai! Kerja bagus! 💪',
  SETTINGS_SAVED: 'Pengaturan berhasil disimpan.',
  DATA_RESET: 'Data berhasil direset.',
} as const;

/**
 * Notification messages
 * @constant {Object}
 */
export const NOTIFICATION_MESSAGES = {
  TITLE: 'Water Reminder',
  BODY: 'Saatnya minum air! 💧',
  TARGET_REACHED_TITLE: 'Target Tercapai!',
  TARGET_REACHED_BODY: 'Hebat! Anda sudah mencapai target harian.',
} as const;