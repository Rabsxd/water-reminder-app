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
 * Color palette
 * @constant {Object}
 */
export const COLORS = {
  // Primary colors
  PRIMARY: '#4A90E2',
  PRIMARY_DARK: '#357ABD',
  PRIMARY_LIGHT: '#E6F4FE',

  // Secondary colors
  SECONDARY: '#50C878',
  SECONDARY_DARK: '#3FA560',
  SECONDARY_LIGHT: '#E8F8F0',

  // Background colors
  BACKGROUND: '#FFFFFF',
  BACKGROUND_CARD: '#F8F9FA',
  BACKGROUND_DISABLED: '#E9ECEF',

  // Text colors
  TEXT_PRIMARY: '#2C3E50',
  TEXT_SECONDARY: '#7F8C8D',
  TEXT_DISABLED: '#BDC3C7',
  TEXT_WHITE: '#FFFFFF',

  // Status colors
  SUCCESS: '#50C878',
  WARNING: '#F39C12',
  ERROR: '#E74C3C',
  INFO: '#4A90E2',

  // Water progress colors
  WATER_LOW: '#E74C3C',
  WATER_MEDIUM: '#F39C12',
  WATER_GOOD: '#50C878',
  WATER_EXCELLENT: '#27AE60',

  // Border colors
  BORDER: '#E1E4E8',
  BORDER_FOCUS: '#4A90E2',

  // Shadow colors
  SHADOW: 'rgba(0, 0, 0, 0.1)',
  SHADOW_DARK: 'rgba(0, 0, 0, 0.15)',

  // React Native Switch colors (boolean true/false values)
  SWITCH_ENABLED: true,
  SWITCH_DISABLED: false,
} as const;

/**
 * Typography constants
 * @constant {Object}
 */
export const TYPOGRAPHY = {
  // Font sizes
  FONT_SIZE_XS: 12,
  FONT_SIZE_SM: 14,
  FONT_SIZE_BASE: 16,
  FONT_SIZE_LG: 18,
  FONT_SIZE_XL: 20,
  FONT_SIZE_2XL: 24,
  FONT_SIZE_3XL: 30,
  FONT_SIZE_4XL: 36,

  // Font weights
  FONT_WEIGHT_NORMAL: '400',
  FONT_WEIGHT_MEDIUM: '500',
  FONT_WEIGHT_SEMI_BOLD: '600',
  FONT_WEIGHT_BOLD: '700',

  // Line heights
  LINE_HEIGHT_TIGHT: 1.2,
  LINE_HEIGHT_NORMAL: 1.4,
  LINE_HEIGHT_RELAXED: 1.6,
} as const;

/**
 * Spacing constants
 * @constant {Object}
 */
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48,
  XXXL: 64,
} as const;

/**
 * Border radius constants
 * @constant {Object}
 */
export const BORDER_RADIUS = {
  SM: 4,
  MD: 8,
  LG: 12,
  XL: 16,
  FULL: 9999,
} as const;

/**
 * Breakpoint constants for responsive design
 * @constant {Object}
 */
export const BREAKPOINTS = {
  SM: 375,
  MD: 768,
  LG: 1024,
  XL: 1280,
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