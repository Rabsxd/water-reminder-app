/**
 * Card component for Water Reminder app
 * Provides consistent card styling with optional shadows and borders
 */

import React from 'react';
import {
  View,
  ViewStyle,
  StyleSheet,
} from 'react-native';

import { COLORS, SPACING, BORDER_RADIUS } from '../../utils/constants';

/**
 * Card component props
 */
export interface CardProps {
  /** Card content */
  children: React.ReactNode;
  /** Card variant style */
  variant?: 'default' | 'elevated' | 'outlined' | 'flat';
  /** Card padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Custom container styles */
  style?: ViewStyle;
  /** Whether card is pressable */
  pressable?: boolean;
  /** Card press handler */
  onPress?: () => void;
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
}

/**
 * Card component with multiple variants and optional press functionality
 * @param {CardProps} props - Component props
 * @returns {JSX.Element} Styled card component
 *
 * @example
 * <Card variant="elevated" padding="md">
 *   <Text>Card content</Text>
 * </Card>
 *
 * <Card variant="outlined" pressable onPress={handlePress}>
 *   <Text>Pressable card</Text>
 * </Card>
 */
export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  style,
  pressable = false,
  onPress,
  accessibilityLabel,
}) => {
  /**
   * Get card container style based on variant and padding
   * @returns {ViewStyle} Combined styles for card container
   */
  const getCardStyle = (): ViewStyle => {
    const variantStyle = styles[variant as keyof typeof styles] as ViewStyle;
    const paddingStyle = styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}` as keyof typeof styles] as ViewStyle;

    return StyleSheet.flatten([styles.card, variantStyle, paddingStyle, style]) as ViewStyle;
  };

  /**
   * Get card content wrapper style
   * @returns {ViewStyle} Styles for card content wrapper
   */
  const getContentStyle = (): ViewStyle => {
    return styles.content;
  };

  const CardComponent = (
    <View style={getCardStyle()}>
      <View style={getContentStyle()}>
        {children}
      </View>
    </View>
  );

  if (pressable && onPress) {
    return (
      <View
        style={getCardStyle()}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        onTouchEnd={onPress}
      >
        <View style={getContentStyle()}>
          {children}
        </View>
      </View>
    );
  }

  return CardComponent;
};

const styles = StyleSheet.create({
  // Base card styles
  card: {
    borderRadius: BORDER_RADIUS.LG,
    backgroundColor: COLORS.BACKGROUND_CARD,
  },

  // Content wrapper
  content: {
    flex: 1,
  },

  // Variant styles
  default: {
    backgroundColor: COLORS.BACKGROUND_CARD,
    shadowColor: COLORS.SHADOW,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  elevated: {
    backgroundColor: COLORS.BACKGROUND_CARD,
    shadowColor: COLORS.SHADOW_DARK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },

  outlined: {
    backgroundColor: COLORS.BACKGROUND_CARD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    shadowColor: COLORS.SHADOW,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  flat: {
    backgroundColor: COLORS.BACKGROUND_CARD,
    borderWidth: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },

  // Padding variants
  paddingNone: {
    padding: 0,
  },

  paddingSm: {
    padding: SPACING.SM,
  },

  paddingMd: {
    padding: SPACING.MD,
  },

  paddingLg: {
    padding: SPACING.LG,
  },

  paddingXl: {
    padding: SPACING.XL,
  },
});