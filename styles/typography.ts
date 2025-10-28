/**
 * Typography definitions for Water Reminder app
 * Provides consistent font styling and text hierarchy
 */

import { Platform } from 'react-native';
import { COLORS } from './colors';

/**
 * Font family definitions
 */
export const FONT_FAMILY = {
  // Primary font family
  PRIMARY: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),

  // Secondary font family
  SECONDARY: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: 'sans-serif',
  }),

  // Monospace font for numbers
  MONOSPACE: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  }),
} as const;

/**
 * Font sizes with consistent scaling
 */
export const FONT_SIZE = {
  // Display sizes
  DISPLAY_LARGE: 32,
  DISPLAY_MEDIUM: 28,
  DISPLAY_SMALL: 24,

  // Heading sizes
  HEADING_LARGE: 22,
  HEADING_MEDIUM: 20,
  HEADING_SMALL: 18,

  // Body text sizes
  BODY_LARGE: 16,
  BODY_MEDIUM: 14,
  BODY_SMALL: 12,

  // Label sizes
  LABEL_LARGE: 14,
  LABEL_MEDIUM: 12,
  LABEL_SMALL: 10,

  // Caption and note sizes
  CAPTION: 10,
  NOTE: 8,

  // Button text sizes
  BUTTON_LARGE: 16,
  BUTTON_MEDIUM: 14,
  BUTTON_SMALL: 12,

  // Special sizes
  OVERLINE: 10,
  SUBTITLE: 12,
  TITLE: 18,
} as const;

/**
 * Font weight definitions
 */
export const FONT_WEIGHT = {
  THIN: '100',
  EXTRA_LIGHT: '200',
  LIGHT: '300',
  REGULAR: '400',
  MEDIUM: '500',
  SEMI_BOLD: '600',
  BOLD: '700',
  EXTRA_BOLD: '800',
  BLACK: '900',

  // Platform-specific weights
  NORMAL: Platform.select({
    ios: '400',
    android: 'normal',
    default: 'normal',
  }),

  BOLD_PLATFORM: Platform.select({
    ios: '700',
    android: 'bold',
    default: 'bold',
  }),
} as const;

/**
 * Line height definitions for readability
 */
export const LINE_HEIGHT = {
  TIGHT: 1.0,
  NORMAL: 1.2,
  RELAXED: 1.4,
  LOOSE: 1.6,
  EXTRA_LOOSE: 1.8,

  // Specific line heights for font sizes
  DISPLAY: 1.2,
  HEADING: 1.3,
  BODY: 1.5,
  CAPTION: 1.4,
} as const;

/**
 * Letter spacing for text readability
 */
export const LETTER_SPACING = {
  TIGHT: -0.5,
  NORMAL: 0,
  WIDE: 0.5,
  EXTRA_WIDE: 1.0,

  // Platform-specific letter spacing
  PLATFORM: Platform.select({
    ios: 0,
    android: 0.25,
    default: 0,
  }),
} as const;

/**
 * Text transform options
 */
export const TEXT_TRANSFORM = {
  NONE: 'none',
  UPPERCASE: 'uppercase',
  LOWERCASE: 'lowercase',
  CAPITALIZE: 'capitalize',
} as const;

/**
 * Text decoration options
 */
export const TEXT_DECORATION = {
  NONE: 'none',
  UNDERLINE: 'underline',
  LINE_THROUGH: 'line-through',
} as const;

/**
 * Text alignment options
 */
export const TEXT_ALIGN = {
  AUTO: 'auto',
  LEFT: 'left',
  RIGHT: 'right',
  CENTER: 'center',
  JUSTIFY: 'justify',
} as const;

/**
 * Pre-defined typography styles
 */
export const TYPOGRAPHY = {
  // Display styles
  DISPLAY_LARGE: {
    fontFamily: FONT_FAMILY.PRIMARY,
    fontSize: FONT_SIZE.DISPLAY_LARGE,
    fontWeight: FONT_WEIGHT.BOLD,
    lineHeight: LINE_HEIGHT.DISPLAY * FONT_SIZE.DISPLAY_LARGE,
    letterSpacing: LETTER_SPACING.TIGHT,
    color: COLORS.TEXT_PRIMARY,
  },

  DISPLAY_MEDIUM: {
    fontFamily: FONT_FAMILY.PRIMARY,
    fontSize: FONT_SIZE.DISPLAY_MEDIUM,
    fontWeight: FONT_WEIGHT.BOLD,
    lineHeight: LINE_HEIGHT.DISPLAY * FONT_SIZE.DISPLAY_MEDIUM,
    letterSpacing: LETTER_SPACING.TIGHT,
    color: COLORS.TEXT_PRIMARY,
  },

  DISPLAY_SMALL: {
    fontFamily: FONT_FAMILY.PRIMARY,
    fontSize: FONT_SIZE.DISPLAY_SMALL,
    fontWeight: FONT_WEIGHT.SEMI_BOLD,
    lineHeight: LINE_HEIGHT.DISPLAY * FONT_SIZE.DISPLAY_SMALL,
    letterSpacing: LETTER_SPACING.NORMAL,
    color: COLORS.TEXT_PRIMARY,
  },

  // Heading styles
  HEADING_LARGE: {
    fontFamily: FONT_FAMILY.PRIMARY,
    fontSize: FONT_SIZE.HEADING_LARGE,
    fontWeight: FONT_WEIGHT.SEMI_BOLD,
    lineHeight: LINE_HEIGHT.HEADING * FONT_SIZE.HEADING_LARGE,
    letterSpacing: LETTER_SPACING.NORMAL,
    color: COLORS.TEXT_PRIMARY,
  },

  HEADING_MEDIUM: {
    fontFamily: FONT_FAMILY.PRIMARY,
    fontSize: FONT_SIZE.HEADING_MEDIUM,
    fontWeight: FONT_WEIGHT.SEMI_BOLD,
    lineHeight: LINE_HEIGHT.HEADING * FONT_SIZE.HEADING_MEDIUM,
    letterSpacing: LETTER_SPACING.NORMAL,
    color: COLORS.TEXT_PRIMARY,
  },

  HEADING_SMALL: {
    fontFamily: FONT_FAMILY.PRIMARY,
    fontSize: FONT_SIZE.HEADING_SMALL,
    fontWeight: FONT_WEIGHT.MEDIUM,
    lineHeight: LINE_HEIGHT.HEADING * FONT_SIZE.HEADING_SMALL,
    letterSpacing: LETTER_SPACING.NORMAL,
    color: COLORS.TEXT_PRIMARY,
  },

  // Body text styles
  BODY_LARGE: {
    fontFamily: FONT_FAMILY.SECONDARY,
    fontSize: FONT_SIZE.BODY_LARGE,
    fontWeight: FONT_WEIGHT.REGULAR,
    lineHeight: LINE_HEIGHT.BODY * FONT_SIZE.BODY_LARGE,
    letterSpacing: LETTER_SPACING.NORMAL,
    color: COLORS.TEXT_PRIMARY,
  },

  BODY_MEDIUM: {
    fontFamily: FONT_FAMILY.SECONDARY,
    fontSize: FONT_SIZE.BODY_MEDIUM,
    fontWeight: FONT_WEIGHT.REGULAR,
    lineHeight: LINE_HEIGHT.BODY * FONT_SIZE.BODY_MEDIUM,
    letterSpacing: LETTER_SPACING.NORMAL,
    color: COLORS.TEXT_PRIMARY,
  },

  BODY_SMALL: {
    fontFamily: FONT_FAMILY.SECONDARY,
    fontSize: FONT_SIZE.BODY_SMALL,
    fontWeight: FONT_WEIGHT.REGULAR,
    lineHeight: LINE_HEIGHT.BODY * FONT_SIZE.BODY_SMALL,
    letterSpacing: LETTER_SPACING.NORMAL,
    color: COLORS.TEXT_SECONDARY,
  },

  // Label styles
  LABEL_LARGE: {
    fontFamily: FONT_FAMILY.PRIMARY,
    fontSize: FONT_SIZE.LABEL_LARGE,
    fontWeight: FONT_WEIGHT.MEDIUM,
    lineHeight: LINE_HEIGHT.NORMAL * FONT_SIZE.LABEL_LARGE,
    letterSpacing: LETTER_SPACING.WIDE,
    textTransform: TEXT_TRANSFORM.UPPERCASE,
    color: COLORS.TEXT_SECONDARY,
  },

  LABEL_MEDIUM: {
    fontFamily: FONT_FAMILY.PRIMARY,
    fontSize: FONT_SIZE.LABEL_MEDIUM,
    fontWeight: FONT_WEIGHT.MEDIUM,
    lineHeight: LINE_HEIGHT.NORMAL * FONT_SIZE.LABEL_MEDIUM,
    letterSpacing: LETTER_SPACING.WIDE,
    textTransform: TEXT_TRANSFORM.UPPERCASE,
    color: COLORS.TEXT_SECONDARY,
  },

  LABEL_SMALL: {
    fontFamily: FONT_FAMILY.PRIMARY,
    fontSize: FONT_SIZE.LABEL_SMALL,
    fontWeight: FONT_WEIGHT.MEDIUM,
    lineHeight: LINE_HEIGHT.NORMAL * FONT_SIZE.LABEL_SMALL,
    letterSpacing: LETTER_SPACING.EXTRA_WIDE,
    textTransform: TEXT_TRANSFORM.UPPERCASE,
    color: COLORS.TEXT_DISABLED,
  },

  // Caption styles
  CAPTION: {
    fontFamily: FONT_FAMILY.SECONDARY,
    fontSize: FONT_SIZE.CAPTION,
    fontWeight: FONT_WEIGHT.REGULAR,
    lineHeight: LINE_HEIGHT.CAPTION * FONT_SIZE.CAPTION,
    letterSpacing: LETTER_SPACING.NORMAL,
    color: COLORS.TEXT_SECONDARY,
  },

  // Button text styles
  BUTTON_LARGE: {
    fontFamily: FONT_FAMILY.PRIMARY,
    fontSize: FONT_SIZE.BUTTON_LARGE,
    fontWeight: FONT_WEIGHT.SEMI_BOLD,
    lineHeight: LINE_HEIGHT.NORMAL * FONT_SIZE.BUTTON_LARGE,
    letterSpacing: LETTER_SPACING.WIDE,
    textTransform: TEXT_TRANSFORM.UPPERCASE,
  },

  BUTTON_MEDIUM: {
    fontFamily: FONT_FAMILY.PRIMARY,
    fontSize: FONT_SIZE.BUTTON_MEDIUM,
    fontWeight: FONT_WEIGHT.SEMI_BOLD,
    lineHeight: LINE_HEIGHT.NORMAL * FONT_SIZE.BUTTON_MEDIUM,
    letterSpacing: LETTER_SPACING.WIDE,
    textTransform: TEXT_TRANSFORM.UPPERCASE,
  },

  BUTTON_SMALL: {
    fontFamily: FONT_FAMILY.PRIMARY,
    fontSize: FONT_SIZE.BUTTON_SMALL,
    fontWeight: FONT_WEIGHT.MEDIUM,
    lineHeight: LINE_HEIGHT.NORMAL * FONT_SIZE.BUTTON_SMALL,
    letterSpacing: LETTER_SPACING.EXTRA_WIDE,
    textTransform: TEXT_TRANSFORM.UPPERCASE,
  },

  // Number display styles (for stats and progress)
  NUMBER_LARGE: {
    fontFamily: FONT_FAMILY.MONOSPACE,
    fontSize: FONT_SIZE.DISPLAY_MEDIUM,
    fontWeight: FONT_WEIGHT.BOLD,
    lineHeight: LINE_HEIGHT.NORMAL * FONT_SIZE.DISPLAY_MEDIUM,
    letterSpacing: LETTER_SPACING.NORMAL,
    color: COLORS.PRIMARY,
  },

  NUMBER_MEDIUM: {
    fontFamily: FONT_FAMILY.MONOSPACE,
    fontSize: FONT_SIZE.HEADING_LARGE,
    fontWeight: FONT_WEIGHT.BOLD,
    lineHeight: LINE_HEIGHT.NORMAL * FONT_SIZE.HEADING_LARGE,
    letterSpacing: LETTER_SPACING.NORMAL,
    color: COLORS.PRIMARY,
  },

  NUMBER_SMALL: {
    fontFamily: FONT_FAMILY.MONOSPACE,
    fontSize: FONT_SIZE.BODY_LARGE,
    fontWeight: FONT_WEIGHT.SEMI_BOLD,
    lineHeight: LINE_HEIGHT.NORMAL * FONT_SIZE.BODY_LARGE,
    letterSpacing: LETTER_SPACING.NORMAL,
    color: COLORS.TEXT_PRIMARY,
  },

  // Specialized styles for water reminder app
  WATER_AMOUNT: {
    fontFamily: FONT_FAMILY.MONOSPACE,
    fontSize: FONT_SIZE.DISPLAY_LARGE,
    fontWeight: FONT_WEIGHT.BOLD,
    lineHeight: LINE_HEIGHT.NORMAL * FONT_SIZE.DISPLAY_LARGE,
    letterSpacing: LETTER_SPACING.NORMAL,
    color: COLORS.PRIMARY,
  },

  PERCENTAGE: {
    fontFamily: FONT_FAMILY.MONOSPACE,
    fontSize: FONT_SIZE.HEADING_MEDIUM,
    fontWeight: FONT_WEIGHT.BOLD,
    lineHeight: LINE_HEIGHT.NORMAL * FONT_SIZE.HEADING_MEDIUM,
    letterSpacing: LETTER_SPACING.NORMAL,
    color: COLORS.SUCCESS,
  },

  TIME_STAMP: {
    fontFamily: FONT_FAMILY.SECONDARY,
    fontSize: FONT_SIZE.CAPTION,
    fontWeight: FONT_WEIGHT.REGULAR,
    lineHeight: LINE_HEIGHT.NORMAL * FONT_SIZE.CAPTION,
    letterSpacing: LETTER_SPACING.NORMAL,
    color: COLORS.TEXT_SECONDARY,
  },
} as const;

/**
 * Typography utility functions
 */
export const TypographyUtils = {
  /**
   * Create custom typography style
   * @param {Object} options - Typography options
   * @returns {Object} Typography style object
   */
  createStyle: (options: {
    fontSize?: number;
    fontWeight?: string;
    fontFamily?: string;
    lineHeight?: number;
    letterSpacing?: number;
    color?: string;
    textTransform?: string;
    textAlign?: string;
  }) => {
    const {
      fontSize = FONT_SIZE.BODY_MEDIUM,
      fontWeight = FONT_WEIGHT.REGULAR,
      fontFamily = FONT_FAMILY.SECONDARY,
      lineHeight = LINE_HEIGHT.NORMAL,
      letterSpacing = LETTER_SPACING.NORMAL,
      color = COLORS.TEXT_PRIMARY,
      textTransform = TEXT_TRANSFORM.NONE,
      textAlign = TEXT_ALIGN.LEFT,
    } = options;

    return {
      fontFamily,
      fontSize,
      fontWeight,
      lineHeight: lineHeight * fontSize,
      letterSpacing,
      color,
      textTransform,
      textAlign,
    };
  },

  /**
   * Get responsive font size based on screen dimensions
   * @param {number} baseSize - Base font size
   * @param {number} screenWidth - Screen width
   * @returns {number} Responsive font size
   */
  getResponsiveSize: (baseSize: number, screenWidth: number): number => {
    // Scale font size based on screen width
    const scaleFactor = Math.min(Math.max(screenWidth / 375, 0.8), 1.2);
    return Math.round(baseSize * scaleFactor);
  },

  /**
   * Apply accessibility typography adjustments
   * @param {Object} style - Base style
   * @param {boolean} largeText - Whether large text is enabled
   * @returns {Object} Accessibility-adjusted style
   */
  applyAccessibility: (style: any, largeText: boolean = false): any => {
    if (largeText) {
      return {
        ...style,
        fontSize: style.fontSize * 1.2,
        lineHeight: style.lineHeight * 1.2,
        letterSpacing: style.letterSpacing * 1.1,
      };
    }
    return style;
  },
};

/**
 * Type definitions
 */
export type TypographyStyle = typeof TYPOGRAPHY;
export type FontSizeName = keyof typeof FONT_SIZE;
export type FontWeightName = keyof typeof FONT_WEIGHT;
export type TypographyStyleName = keyof typeof TYPOGRAPHY;

/**
 * Default export
 */
export default TYPOGRAPHY;