/**
 * Global style definitions for Water Reminder app
 * Provides consistent styling across all components
 */

import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from './colors';
import { TYPOGRAPHY } from './typography';

/**
 * Screen dimensions for responsive design
 */
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Spacing scale for consistent margins and padding
 */
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48,
  XXXL: 64,

  // Responsive spacing
  RESPONSIVE: {
    SM: SCREEN_WIDTH < 375 ? 12 : 16,
    MD: SCREEN_WIDTH < 375 ? 16 : 24,
    LG: SCREEN_WIDTH < 375 ? 20 : 32,
  },
} as const;

/**
 * Border radius values for consistent corner styling
 */
export const BORDER_RADIUS = {
  XS: 2,
  SM: 4,
  SMALL: 4, // Alias for compatibility
  MD: 8,
  LG: 12,
  XL: 16,
  XXL: 24,
  FULL: 9999, // For circles
} as const;

/**
 * Shadow definitions for depth and elevation
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
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },

  EXTRA_LARGE: {
    shadowColor: COLORS.SHADOW_DARK,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
} as const;

/**
 * Border width values
 */
export const BORDER_WIDTH = {
  NONE: 0,
  THIN: 1,
  MEDIUM: 2,
  THICK: 3,
  EXTRA_THICK: 4,
} as const;

/**
 * Opacity values for consistent transparency
 */
export const OPACITY = {
  TRANSPARENT: 0,
  SEMI_TRANSPARENT: 0.1,
  LIGHT: 0.3,
  MEDIUM: 0.5,
  HEAVY: 0.7,
  OPAQUE: 1,
} as const;

/**
 * Z-index values for layering
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
 * Global container styles
 */
export const CONTAINERS = {
  // Main app container
  APP: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },

  // Screen container
  SCREEN: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },

  // Safe area container
  SAFE_AREA: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    paddingTop: 20, // Adjust for status bar
  },

  // Content container
  CONTENT: {
    flex: 1,
    paddingHorizontal: SPACING.MD,
  },

  // Card container
  CARD: {
    backgroundColor: COLORS.BACKGROUND_CARD,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.MD,
    ...SHADOWS.SMALL,
  },

  // Modal container
  MODAL: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_MODAL,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.LG,
  },

  // Scroll container
  SCROLL: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },

  // Form container
  FORM: {
    gap: SPACING.MD,
  },

  // List container
  LIST: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
} as const;

/**
 * Flexbox utilities
 */
export const FLEX = {
  // Direction
  ROW: {
    flexDirection: 'row',
  },

  COLUMN: {
    flexDirection: 'column',
  },

  ROW_REVERSE: {
    flexDirection: 'row-reverse',
  },

  COLUMN_REVERSE: {
    flexDirection: 'column-reverse',
  },

  // Alignment
  ALIGN_START: {
    alignItems: 'flex-start',
  },

  ALIGN_CENTER: {
    alignItems: 'center',
  },

  ALIGN_END: {
    alignItems: 'flex-end',
  },

  ALIGN_STRETCH: {
    alignItems: 'stretch',
  },

  // Justification
  JUSTIFY_START: {
    justifyContent: 'flex-start',
  },

  JUSTIFY_CENTER: {
    justifyContent: 'center',
  },

  JUSTIFY_END: {
    justifyContent: 'flex-end',
  },

  JUSTIFY_BETWEEN: {
    justifyContent: 'space-between',
  },

  JUSTIFY_AROUND: {
    justifyContent: 'space-around',
  },

  JUSTIFY_EVENLY: {
    justifyContent: 'space-evenly',
  },

  // Wrap
  WRAP: {
    flexWrap: 'wrap',
  },

  NOWRAP: {
    flexWrap: 'nowrap',
  },

  // Common combinations
  CENTER: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  ROW_CENTER: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  ROW_BETWEEN: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  COLUMN_CENTER: {
    flexDirection: 'column',
    alignItems: 'center',
  },
} as const;

/**
 * Position utilities
 */
export const POSITION = {
  RELATIVE: {
    position: 'relative',
  },

  ABSOLUTE: {
    position: 'absolute',
  },

  FIXED: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },

  // Absolute positioning shortcuts
  TOP_LEFT: {
    position: 'absolute',
    top: 0,
    left: 0,
  },

  TOP_RIGHT: {
    position: 'absolute',
    top: 0,
    right: 0,
  },

  BOTTOM_LEFT: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },

  BOTTOM_RIGHT: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },

  // Center absolute
  ABSOLUTE_CENTER: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -SCREEN_WIDTH / 2 }, { translateY: -20 }],
  },
} as const;

/**
 * Common component styles
 */
export const COMPONENTS = {
  // Button styles
  BUTTON_PRIMARY: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: BORDER_RADIUS.MD,
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.LG,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.SMALL,
  },

  BUTTON_SECONDARY: {
    backgroundColor: 'transparent',
    borderRadius: BORDER_RADIUS.MD,
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.LG,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: BORDER_WIDTH.THIN,
    borderColor: COLORS.PRIMARY,
  },

  BUTTON_GHOST: {
    backgroundColor: 'transparent',
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.MD,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Input styles
  INPUT: {
    backgroundColor: COLORS.BACKGROUND_CARD,
    borderRadius: BORDER_RADIUS.MD,
    borderWidth: BORDER_WIDTH.THIN,
    borderColor: COLORS.BORDER,
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.MD,
    fontSize: TYPOGRAPHY.BODY_MEDIUM.fontSize,
    color: COLORS.TEXT_PRIMARY,
    ...SHADOWS.SMALL,
  },

  INPUT_FOCUSED: {
    borderColor: COLORS.PRIMARY,
    ...SHADOWS.MEDIUM,
  },

  INPUT_ERROR: {
    borderColor: COLORS.ERROR,
  },

  // Card variations
  CARD_ELEVATED: {
    backgroundColor: COLORS.BACKGROUND_CARD,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.LG,
    ...SHADOWS.MEDIUM,
  },

  CARD_OUTLINED: {
    backgroundColor: COLORS.BACKGROUND_CARD,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.LG,
    borderWidth: BORDER_WIDTH.THIN,
    borderColor: COLORS.BORDER,
  },

  CARD_FLAT: {
    backgroundColor: COLORS.BACKGROUND_CARD,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.LG,
  },

  // Status indicators
  STATUS_SUCCESS: {
    backgroundColor: COLORS.SUCCESS_LIGHT,
    color: COLORS.SUCCESS_DARK,
    padding: SPACING.XS,
    borderRadius: BORDER_RADIUS.SMALL,
  },

  STATUS_WARNING: {
    backgroundColor: COLORS.WARNING_LIGHT,
    color: COLORS.WARNING_DARK,
    padding: SPACING.XS,
    borderRadius: BORDER_RADIUS.SMALL,
  },

  STATUS_ERROR: {
    backgroundColor: COLORS.ERROR_LIGHT,
    color: COLORS.ERROR_DARK,
    padding: SPACING.XS,
    borderRadius: BORDER_RADIUS.SMALL,
  },

  // Progress bar
  PROGRESS_BAR: {
    height: 8,
    backgroundColor: COLORS.BACKGROUND_DISABLED,
    borderRadius: BORDER_RADIUS.FULL,
    overflow: 'hidden',
  },

  PROGRESS_FILL: {
    height: '100%',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: BORDER_RADIUS.FULL,
  },

  // Divider
  DIVIDER: {
    height: 1,
    backgroundColor: COLORS.BORDER,
    marginVertical: SPACING.SM,
  },

  // Badge
  BADGE: {
    backgroundColor: COLORS.PRIMARY,
    color: COLORS.TEXT_WHITE,
    fontSize: TYPOGRAPHY.CAPTION.fontSize,
    fontWeight: TYPOGRAPHY.CAPTION.fontWeight,
    paddingVertical: SPACING.XS,
    paddingHorizontal: SPACING.SM,
    borderRadius: BORDER_RADIUS.FULL,
    minWidth: 20,
    textAlign: 'center',
  },
} as const;

/**
 * Responsive utilities
 */
export const RESPONSIVE = {
  // Breakpoints
  BREAKPOINTS: {
    SM: 375, // iPhone SE
    MD: 414, // iPhone Pro
    LG: 768, // iPad Mini
    XL: 1024, // iPad
  },

  // Container max widths
  CONTAINER_MAX_WIDTH: {
    SM: SCREEN_WIDTH - 32,
    MD: Math.min(SCREEN_WIDTH - 48, 414),
    LG: Math.min(SCREEN_WIDTH - 64, 768),
    XL: Math.min(SCREEN_WIDTH - 80, 1024),
  },

  // Responsive padding
  getPadding: (screenWidth: number) => {
    if (screenWidth < RESPONSIVE.BREAKPOINTS.SM) return SPACING.SM;
    if (screenWidth < RESPONSIVE.BREAKPOINTS.MD) return SPACING.MD;
    return SPACING.LG;
  },

  // Responsive font size
  getFontSize: (baseSize: number, screenWidth: number) => {
    const scale = Math.min(Math.max(screenWidth / 375, 0.8), 1.2);
    return Math.round(baseSize * scale);
  },
} as const;

/**
 * Accessibility utilities
 */
export const ACCESSIBILITY = {
  // Minimum touch target size (44x44 points for iOS)
  MIN_TOUCH_TARGET: 44,

  // Focus styles
  FOCUS_VISIBLE: {
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    borderRadius: BORDER_RADIUS.SMALL,
  },

  // High contrast colors
  HIGH_CONTRAST: {
    BACKGROUND: COLORS.TEXT_WHITE,
    TEXT: COLORS.TEXT_PRIMARY,
    PRIMARY: COLORS.PRIMARY_DARK,
    SUCCESS: COLORS.SUCCESS,
    WARNING: COLORS.WARNING,
    ERROR: COLORS.ERROR,
  },

  // Reduced motion
  REDUCED_MOTION: {
    animationDuration: '0.01ms',
    animationIterationCount: '1',
    transitionDuration: '0.01ms',
  },
} as const;

/**
 * Animation durations
 */
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  EXTRA_SLOW: 1000,

  // Spring animations
  SPRING_BOUNCY: {
    tension: 100,
    friction: 8,
  },

  SPRING_GENTLE: {
    tension: 40,
    friction: 8,
  },

  SPRING_SNAPPY: {
    tension: 300,
    friction: 30,
  },
} as const;

/**
 * Create global stylesheet
 */
export const GlobalStyles = StyleSheet.create({
  // Container styles
  container: CONTAINERS.APP,
  screen: CONTAINERS.SCREEN,
  content: CONTAINERS.CONTENT,
  card: COMPONENTS.CARD_ELEVATED,

  // Text styles
  text: TYPOGRAPHY.BODY_MEDIUM,
  heading: TYPOGRAPHY.HEADING_MEDIUM,
  subheading: TYPOGRAPHY.HEADING_SMALL,
  caption: TYPOGRAPHY.CAPTION,

  // Layout utilities
  row: FLEX.ROW,
  column: FLEX.COLUMN,
  center: FLEX.CENTER,
  spaceBetween: FLEX.ROW_BETWEEN,

  // Spacing utilities
  paddingXS: { padding: SPACING.XS },
  paddingSM: { padding: SPACING.SM },
  paddingMD: { padding: SPACING.MD },
  paddingLG: { padding: SPACING.LG },
  paddingXL: { padding: SPACING.XL },

  marginXS: { margin: SPACING.XS },
  marginSM: { margin: SPACING.SM },
  marginMD: { margin: SPACING.MD },
  marginLG: { margin: SPACING.LG },
  marginXL: { margin: SPACING.XL },

  // Common components
  button: COMPONENTS.BUTTON_PRIMARY,
  input: COMPONENTS.INPUT,
  progressBar: COMPONENTS.PROGRESS_BAR,
  divider: COMPONENTS.DIVIDER,
});

/**
 * Style utility functions
 */
export const StyleUtils = {
  /**
   * Merge styles with precedence
   * @param {Array} styles - Array of style objects
   * @returns {Object} Merged style object
   */
  merge: (...styles: any[]) => Object.assign({}, ...styles),

  /**
   * Get responsive style based on screen size
   * @param {Object} baseStyle - Base style object
   * @param {Object} responsiveStyles - Responsive style variations
   * @returns {Object} Responsive style object
   */
  responsive: (baseStyle: any, responsiveStyles: any = {}) => {
    const width = SCREEN_WIDTH;
    let style = baseStyle;

    if (width < 375 && responsiveStyles.small) {
      style = { ...style, ...responsiveStyles.small };
    } else if (width >= 375 && width < 768 && responsiveStyles.medium) {
      style = { ...style, ...responsiveStyles.medium };
    } else if (width >= 768 && responsiveStyles.large) {
      style = { ...style, ...responsiveStyles.large };
    }

    return style;
  },

  /**
   * Add shadow to style
   * @param {Object} style - Base style
   * @param {string} shadowLevel - Shadow level (small, medium, large)
   * @returns {Object} Style with shadow
   */
  withShadow: (style: any, shadowLevel: 'small' | 'medium' | 'large' = 'medium') => {
    return {
      ...style,
      ...SHADOWS[shadowLevel.toUpperCase() as keyof typeof SHADOWS],
    };
  },
};

/**
 * Export default styles
 */
export default GlobalStyles;