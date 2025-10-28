/**
 * Header component for Water Reminder app
 * Provides consistent header styling with title, subtitle, and optional actions
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import { COLORS, TYPOGRAPHY, SPACING } from '../../utils/constants';

/**
 * Header component props
 */
export interface HeaderProps {
  /** Main header title */
  title: string;
  /** Optional subtitle text */
  subtitle?: string;
  /** Header size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Header alignment */
  align?: 'left' | 'center' | 'right';
  /** Custom container styles */
  style?: ViewStyle;
  /** Optional header actions (buttons, icons, etc.) */
  actions?: React.ReactNode;
  /** Whether to show bottom border */
  showBorder?: boolean;
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
}

/**
 * Header component with title, subtitle, and optional actions
 * @param {HeaderProps} props - Component props
 * @returns {JSX.Element} Styled header component
 *
 * @example
 * <Header
 *   title="Water Reminder"
 *   subtitle="Track your daily hydration"
 *   size="lg"
 *   align="center"
 * />
 *
 * <Header
 *   title="Settings"
 *   size="md"
 *   align="left"
 *   actions={<Button onPress={handleBack}>Back</Button>}
 *   showBorder
 * />
 */
export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  size = 'lg',
  align = 'left',
  style,
  actions,
  showBorder = false,
  accessibilityLabel,
}) => {
  /**
   * Get header container style based on alignment and border
   * @returns {ViewStyle} Combined styles for header container
   */
  const getHeaderStyle = (): ViewStyle => {
    const alignStyle = styles[`align${align.charAt(0).toUpperCase() + align.slice(1)}` as keyof typeof styles] as ViewStyle;
    const borderStyle = showBorder ? styles.withBorder : {};

    return StyleSheet.flatten([styles.header, alignStyle, borderStyle, style]) as ViewStyle;
  };

  /**
   * Get text container style based on alignment
   * @returns {ViewStyle} Styles for text container
   */
  const getTextContainerStyle = (): ViewStyle => {
    const alignStyle = styles[`textAlign${align.charAt(0).toUpperCase() + align.slice(1)}` as keyof typeof styles] as ViewStyle;

    return StyleSheet.flatten([styles.textContainer, alignStyle]) as ViewStyle;
  };

  /**
   * Get title style based on size
   * @returns {Object} Styles for title text
   */
  const getTitleStyle = () => {
    return styles[`title${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof styles];
  };

  /**
   * Get subtitle style based on size
   * @returns {Object} Styles for subtitle text
   */
  const getSubtitleStyle = () => {
    return styles[`subtitle${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof styles];
  };

  return (
    <View
      style={getHeaderStyle()}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="header"
    >
      <View style={getTextContainerStyle()}>
        <Text style={getTitleStyle()}>{title}</Text>
        {subtitle && (
          <Text style={getSubtitleStyle()}>{subtitle}</Text>
        )}
      </View>
      {actions && (
        <View style={styles.actionsContainer}>
          {actions}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Base header styles
  header: {
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    backgroundColor: COLORS.BACKGROUND,
  },

  // Alignment styles
  alignLeft: {
    alignItems: 'flex-start',
  },
  alignCenter: {
    alignItems: 'center',
  },
  alignRight: {
    alignItems: 'flex-end',
  },

  // Text container styles
  textContainer: {
    flex: 1,
  },
  textAlignLeft: {
    alignItems: 'flex-start',
  },
  textAlignCenter: {
    alignItems: 'center',
  },
  textAlignRight: {
    alignItems: 'flex-end',
  },

  // Actions container
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.SM,
  },

  // Title size variants
  titleSm: {
    fontSize: TYPOGRAPHY.FONT_SIZE_LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  titleMd: {
    fontSize: TYPOGRAPHY.FONT_SIZE_XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  titleLg: {
    fontSize: TYPOGRAPHY.FONT_SIZE_2XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  titleXl: {
    fontSize: TYPOGRAPHY.FONT_SIZE_3XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },

  // Subtitle size variants
  subtitleSm: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
  },
  subtitleMd: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    color: COLORS.TEXT_SECONDARY,
  },
  subtitleLg: {
    fontSize: TYPOGRAPHY.FONT_SIZE_LG,
    color: COLORS.TEXT_SECONDARY,
  },
  subtitleXl: {
    fontSize: TYPOGRAPHY.FONT_SIZE_XL,
    color: COLORS.TEXT_SECONDARY,
  },

  // Border styles
  withBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
});