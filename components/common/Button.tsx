/**
 * Custom Button component for Water Reminder app
 * Provides consistent button styling with different variants and states
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';

import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../utils/constants';

/**
 * Button component props
 */
export interface ButtonProps {
  /** Button text content */
  children: string;
  /** Button style variant */
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Whether button is disabled */
  disabled?: boolean;
  /** Whether to show loading indicator */
  loading?: boolean;
  /** Custom styles for button container */
  style?: ViewStyle;
  /** Custom text styles */
  textStyle?: TextStyle;
  /** Button press handler */
  onPress: () => void;
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
}

/**
 * Custom Button component with multiple variants and loading states
 * @param {ButtonProps} props - Component props
 * @returns {JSX.Element} Styled button component
 *
 * @example
 * <Button
 *   variant="primary"
 *   size="md"
 *   onPress={handleSubmit}
 *   loading={isSubmitting}
 * >
 *   Submit
 * </Button>
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  onPress,
  accessibilityLabel,
}) => {
  /**
   * Get button container style based on variant and size
   * @returns {ViewStyle} Combined styles for button container
   */
  const getButtonStyle = (): ViewStyle => {
    const variantStyle = styles[variant as keyof typeof styles] as ViewStyle;
    const sizeStyle = styles[`button${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof styles] as ViewStyle;
    const disabledStyle = disabled ? styles.disabled : {};

    return StyleSheet.flatten([variantStyle, sizeStyle, disabledStyle, style]) as ViewStyle;
  };

  /**
   * Get text style based on variant and size
   * @returns {TextStyle} Combined styles for button text
   */
  const getTextStyle = (): TextStyle => {
    const variantTextStyle = styles[`${variant}Text` as keyof typeof styles] as TextStyle;
    const sizeTextStyle = styles[`text${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof styles] as TextStyle;
    const disabledTextStyle = disabled ? styles.disabledText : {};

    return StyleSheet.flatten([variantTextStyle, sizeTextStyle, disabledTextStyle, textStyle]) as TextStyle;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator
          size={size === 'sm' ? 'small' : 'large'}
          color={variant === 'ghost' ? COLORS.PRIMARY : COLORS.TEXT_WHITE}
        />
      ) : (
        <Text style={getTextStyle()}>{children}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Primary variant
  primary: {
    backgroundColor: COLORS.PRIMARY,
    borderWidth: 0,
  },
  primaryText: {
    color: COLORS.TEXT_WHITE,
  },

  // Secondary variant
  secondary: {
    backgroundColor: COLORS.SECONDARY,
    borderWidth: 0,
  },
  secondaryText: {
    color: COLORS.TEXT_WHITE,
  },

  // Success variant
  success: {
    backgroundColor: COLORS.SUCCESS,
    borderWidth: 0,
  },
  successText: {
    color: COLORS.TEXT_WHITE,
  },

  // Danger variant
  danger: {
    backgroundColor: COLORS.ERROR,
    borderWidth: 0,
  },
  dangerText: {
    color: COLORS.TEXT_WHITE,
  },

  // Ghost variant
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
  },
  ghostText: {
    color: COLORS.PRIMARY,
  },

  // Size variants
  buttonSm: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.MD,
    minHeight: 36,
  },
  buttonMd: {
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    borderRadius: BORDER_RADIUS.LG,
    minHeight: 44,
  },
  buttonLg: {
    paddingHorizontal: SPACING.XL,
    paddingVertical: SPACING.LG,
    borderRadius: BORDER_RADIUS.LG,
    minHeight: 52,
  },

  // Text sizes
  textSm: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_MEDIUM,
  },
  textMd: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_MEDIUM,
  },
  textLg: {
    fontSize: TYPOGRAPHY.FONT_SIZE_LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
  },

  // Disabled state
  disabled: {
    backgroundColor: COLORS.BACKGROUND_DISABLED,
    borderColor: COLORS.BORDER,
    opacity: 0.6,
  },
  disabledText: {
    color: COLORS.TEXT_DISABLED,
  },
});