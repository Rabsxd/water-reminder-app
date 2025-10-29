/**
 * Animated Button component for Water Reminder app
 * Provides micro-interactions and smooth animations for buttons
 */

import React, { useEffect, useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  interpolate,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../utils/constants';

/**
 * Animated button component props
 */
interface AnimatedButtonProps {
  /** Button title */
  title: string;
  /** Button press handler */
  onPress: () => void | Promise<void>;
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  /** Button size */
  size?: 'small' | 'medium' | 'large';
  /** Whether button is disabled */
  disabled?: boolean;
  /** Whether button is loading */
  loading?: boolean;
  /** Custom container style */
  style?: ViewStyle;
  /** Custom text style */
  textStyle?: TextStyle;
  /** Whether to show ripple effect */
  showRipple?: boolean;
  /** Icon to display */
  icon?: string;
  /** Icon position */
  iconPosition?: 'left' | 'right';
  /** Haptic feedback type */
  haptic?: 'light' | 'medium' | 'heavy' | 'none';
  /** Animation duration */
  animationDuration?: number;
}

/**
 * Animated Button component with micro-interactions
 * @param {AnimatedButtonProps} props - Component props
 * @returns {JSX.Element} Animated button component
 *
 * @example
 * <AnimatedButton
 *   title="Add Water"
 *   onPress={() => addWater(250)}
 *   variant="primary"
 *   size="medium"
 *   showRipple={true}
 *   haptic="light"
 * />
 */
export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  showRipple = true,
  icon,
  iconPosition = 'left',
  haptic = 'light',
  animationDuration = 150,
}) => {
  // Animation values
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const rippleScale = useSharedValue(0);
  const rippleOpacity = useSharedValue(0);
  const pressScale = useSharedValue(1);
  const loadingRotate = useSharedValue(0);

  const [isPressed, setIsPressed] = useState(false);

  /**
   * Get button styling based on variant
   */
  const getButtonStyle = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: disabled ? COLORS.BACKGROUND_DISABLED : COLORS.PRIMARY,
          shadowColor: disabled ? 'transparent' : COLORS.SHADOW,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: disabled ? 0 : 0.2,
          shadowRadius: 4,
          elevation: disabled ? 0 : 4,
        };
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: disabled ? COLORS.BACKGROUND_DISABLED : COLORS.PRIMARY,
        };
      case 'ghost':
        return {
          backgroundColor: disabled ? COLORS.BACKGROUND_DISABLED : COLORS.PRIMARY + '20',
        };
      case 'danger':
        return {
          backgroundColor: disabled ? COLORS.BACKGROUND_DISABLED : COLORS.ERROR,
          shadowColor: disabled ? 'transparent' : COLORS.SHADOW,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: disabled ? 0 : 0.2,
          shadowRadius: 4,
          elevation: disabled ? 0 : 4,
        };
      case 'success':
        return {
          backgroundColor: disabled ? COLORS.BACKGROUND_DISABLED : COLORS.SUCCESS,
          shadowColor: disabled ? 'transparent' : COLORS.SHADOW,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: disabled ? 0 : 0.2,
          shadowRadius: 4,
          elevation: disabled ? 0 : 4,
        };
      default:
        return {
          backgroundColor: COLORS.PRIMARY,
        };
    }
  };

  /**
   * Get text color based on variant
   */
  const getTextColor = (): string => {
    switch (variant) {
      case 'primary':
      case 'danger':
      case 'success':
        return COLORS.TEXT_WHITE;
      case 'secondary':
        return disabled ? COLORS.TEXT_DISABLED : COLORS.PRIMARY;
      case 'ghost':
        return disabled ? COLORS.TEXT_DISABLED : COLORS.PRIMARY;
      default:
        return COLORS.TEXT_WHITE;
    }
  };

  /**
   * Get button dimensions based on size
   */
  const getDimensions = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: SPACING.XS,
          paddingHorizontal: SPACING.MD,
          minHeight: 36,
        };
      case 'medium':
        return {
          paddingVertical: SPACING.SM,
          paddingHorizontal: SPACING.LG,
          minHeight: 44,
        };
      case 'large':
        return {
          paddingVertical: SPACING.MD,
          paddingHorizontal: SPACING.XL,
          minHeight: 52,
        };
      default:
        return {
          paddingVertical: SPACING.SM,
          paddingHorizontal: SPACING.LG,
          minHeight: 44,
        };
    }
  };

  /**
   * Get font size based on size
   */
  const getFontSize = () => {
    switch (size) {
      case 'small': return TYPOGRAPHY.FONT_SIZE_SM;
      case 'medium': return TYPOGRAPHY.FONT_SIZE_BASE;
      case 'large': return TYPOGRAPHY.FONT_SIZE_LG;
      default: return TYPOGRAPHY.FONT_SIZE_BASE;
    }
  };

  /**
   * Handle press animation
   */
  const handlePressIn = () => {
    if (!disabled && !loading) {
      setIsPressed(true);
      pressScale.value = withSpring(0.95, {
        damping: 15,
        stiffness: 200,
        mass: 1,
      });

      // Trigger ripple effect
      if (showRipple) {
        rippleScale.value = withTiming(0, { duration: 0 });
        rippleScale.value = withTiming(1, {
          duration: animationDuration * 2,
          easing: Easing.out(Easing.quad),
        });
        rippleOpacity.value = withSequence(
          withTiming(0.6, { duration: 50 }),
          withTiming(0, { duration: animationDuration * 1.5, easing: Easing.out(Easing.quad) })
        );
      }
    }
  };

  /**
   * Handle press release
   */
  const handlePressOut = () => {
    if (!disabled && !loading) {
      setIsPressed(false);
      pressScale.value = withSpring(1, {
        damping: 15,
        stiffness: 200,
        mass: 1,
      });
    }
  };

  /**
   * Handle button press
   */
  const handlePress = async () => {
    if (!disabled && !loading) {
      // Success animation
      scale.value = withSequence(
        withSpring(1.1, { damping: 10, stiffness: 300 }),
        withSpring(1, { damping: 15, stiffness: 200 })
      );

      // Trigger haptic feedback
      if (haptic !== 'none') {
        // This would need to be implemented with expo-haptics
        console.log(`Haptic feedback: ${haptic}`);
      }

      // Execute press handler
      await onPress();
    }
  };

  
  // Start loading animation
  useEffect(() => {
    if (loading) {
      loadingRotate.value = withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      }, (finished) => {
        if (!finished) {
          loadingRotate.value = 0;
        }
      });
    } else {
      loadingRotate.value = withTiming(0, { duration: 100 });
    }
  }, [loading]);

  // Animated styles
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: pressScale.value },
    ],
    opacity: disabled || loading ? 0.6 : opacity.value,
  }));

  const rippleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rippleScale.value }],
    opacity: rippleOpacity.value,
  }));

  const loadingStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${loadingRotate.value}deg` }],
  }));

  const textStyleAnimated = useAnimatedStyle(() => ({
    opacity: loading ? 0 : 1,
  }));

  return (
    <Animated.View style={[styles.container, buttonStyle]}>
      {/* Ripple effect */}
      {showRipple && (
        <Animated.View style={[styles.ripple, rippleStyle]} />
      )}

      {/* Button */}
      <Animated.View
        style={[styles.button, getButtonStyle(), getDimensions(), style]}
        onTouchStart={handlePressIn}
        onTouchEnd={handlePressOut}
      >
        <Animated.View style={styles.content}>
          {/* Icon */}
          {icon && iconPosition === 'left' && !loading && (
            <Animated.Text style={[styles.icon, styles.iconLeft, { color: getTextColor() }]}>
              {icon}
            </Animated.Text>
          )}

          {/* Text */}
          <Animated.Text
            style={[
              styles.text,
              textStyleAnimated,
              {
                color: getTextColor(),
                fontSize: getFontSize(),
                fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
              },
              textStyle,
            ]}
          >
            {title}
          </Animated.Text>

          {/* Loading indicator */}
          {loading && (
            <Animated.View style={[styles.loading, loadingStyle]}>
              <ActivityIndicator
                size={size === 'small' ? 'small' : 'small'}
                color={getTextColor()}
              />
            </Animated.View>
          )}

          {/* Right icon */}
          {icon && iconPosition === 'right' && !loading && (
            <Animated.Text style={[styles.icon, styles.iconRight, { color: getTextColor() }]}>
              {icon}
            </Animated.Text>
          )}
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: BORDER_RADIUS.MD,
    overflow: 'hidden',
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.MD,
    position: 'relative',
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.XS,
  },

  text: {
    textAlign: 'center',
  },

  icon: {
    fontSize: 18,
  },

  iconLeft: {
    marginRight: SPACING.XS,
  },

  iconRight: {
    marginLeft: SPACING.XS,
  },

  loading: {
    marginLeft: SPACING.XS,
  },

  ripple: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: BORDER_RADIUS.MD,
  },
});

/**
 * Floating Action Button (FAB) with animations
 */
export const AnimatedFAB: React.FC<{
  icon: string;
  onPress: () => void;
  color?: string;
  backgroundColor?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}> = ({
  icon,
  onPress,
  color = COLORS.TEXT_WHITE,
  backgroundColor = COLORS.PRIMARY,
  position = 'bottom-right',
}) => {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(0.9, { damping: 15, stiffness: 300 }),
      withSpring(1, { damping: 15, stiffness: 200 })
    );
    rotate.value = withSequence(
      withTiming(45, { duration: 200 }),
      withTiming(0, { duration: 200 })
    );
    onPress();
  };

  const fabStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  const getPositionStyle = () => {
    switch (position) {
      case 'bottom-right':
        return { position: 'absolute' as const, bottom: 20, right: 20 };
      case 'bottom-left':
        return { position: 'absolute' as const, bottom: 20, left: 20 };
      case 'top-right':
        return { position: 'absolute' as const, top: 20, right: 20 };
      case 'top-left':
        return { position: 'absolute' as const, top: 20, left: 20 };
      default:
        return { position: 'absolute' as const, bottom: 20, right: 20 };
    }
  };

  return (
    <Animated.View style={[fabStyles.container, getPositionStyle(), fabStyle]}>
      <TouchableOpacity
        style={[fabStyles.button, { backgroundColor }]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Text style={[fabStyles.icon, { color }]}>{icon}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const fabStyles = StyleSheet.create({
  container: {
    shadowColor: COLORS.SHADOW_DARK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },

  icon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default AnimatedButton;