/**
 * Animated Progress Circle component for Water Reminder app
 * Enhanced version with smooth animations using Reanimated
 */

import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  withDelay,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import Svg, {
  Circle,
  CircleProps,
} from 'react-native-svg';
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
import { COLORS, TYPOGRAPHY, SPACING } from '../../utils/constants';

/**
 * Animated Progress Circle component props
 */
export interface AnimatedProgressCircleProps {
  /** Current progress value (0-1) */
  progress: number;
  /** Circle size in pixels */
  size?: number;
  /** Stroke width of the progress circle */
  strokeWidth?: number;
  /** Background circle color */
  backgroundColor?: string;
  /** Progress circle color */
  progressColor?: string;
  /** Text color for percentage display */
  textColor?: string;
  /** Whether to show percentage text */
  showPercentage?: boolean;
  /** Whether to show target text */
  showTarget?: boolean;
  /** Target value for display */
  target?: number;
  /** Current value for display */
  current?: number;
  /** Whether to animate progress changes */
  animated?: boolean;
  /** Animation duration in milliseconds */
  animationDuration?: number;
  /** Custom style for container */
  style?: any;
  /** Whether to show ripple effect when progress changes */
  showRipple?: boolean;
}

/**
 * Animated Progress Circle component with smooth animations
 * @param {AnimatedProgressCircleProps} props - Component props
 * @returns {JSX.Element} Animated progress circle component
 *
 * @example
 * <AnimatedProgressCircle
 *   progress={0.75}
 *   size={200}
 *   animated={true}
 *   showRipple={true}
 *   showPercentage={true}
 *   current={1500}
 *   target={2000}
 * />
 */
export const AnimatedProgressCircle: React.FC<AnimatedProgressCircleProps> = ({
  progress,
  size = 200,
  strokeWidth = 12,
  backgroundColor = COLORS.BACKGROUND_DISABLED,
  progressColor,
  textColor = COLORS.TEXT_PRIMARY,
  showPercentage = true,
  showTarget = false,
  target,
  current,
  animated = true,
  animationDuration = 800,
  style,
  showRipple = false,
}) => {
  // Animation values
  const animatedProgress = useSharedValue(0);
  const rippleScale = useSharedValue(0);
  const percentageScale = useSharedValue(1);
  const pulseScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);

  // Previous progress value for change detection
  const [prevProgress, setPrevProgress] = React.useState(0);

  /**
   * Calculate circle dimensions
   */
  const radius = useMemo(() => (size - strokeWidth) / 2, [size, strokeWidth]);
  const circumference = useMemo(() => radius * 2 * Math.PI, [radius]);

  /**
   * Get progress color based on percentage
   */
  const getProgressColor = (percentage: number): string => {
    if (percentage >= 100) return COLORS.SUCCESS;
    if (percentage >= 75) return COLORS.WATER_EXCELLENT;
    if (percentage >= 50) return COLORS.WATER_GOOD;
    if (percentage >= 25) return COLORS.WATER_MEDIUM;
    return COLORS.WATER_LOW;
  };

  /**
   * Animate progress change
   */
  const animateProgressChange = React.useCallback((newProgress: number) => {
    if (!animated) {
      animatedProgress.value = newProgress;
      return;
    }

    // Trigger ripple effect if enabled
    if (showRipple && newProgress > prevProgress) {
      rippleScale.value = withSequence(
        withTiming(1.2, { duration: 300, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 200, easing: Easing.in(Easing.quad) })
      );
    }

    // Scale percentage text briefly
    percentageScale.value = withSequence(
      withTiming(1.1, { duration: 150, easing: Easing.out(Easing.quad) }),
      withTiming(1, { duration: 150, easing: Easing.in(Easing.quad) })
    );

    // Show glow effect for milestones
    const percentage = Math.round(newProgress * 100);
    if (percentage === 25 || percentage === 50 || percentage === 75 || percentage === 100) {
      glowOpacity.value = withSequence(
        withTiming(1, { duration: 300 }),
        withTiming(0, { duration: 700, easing: Easing.out(Easing.quad) })
      );
    }

    // Animate progress value
    animatedProgress.value = withSpring(newProgress, {
      damping: 20,
      stiffness: 100,
      mass: 1,
    });

    setPrevProgress(newProgress);
  }, [animated, showRipple, prevProgress]);

  // Handle progress changes
  useEffect(() => {
    const clampedProgress = Math.max(0, Math.min(1, progress));
    animateProgressChange(clampedProgress);
  }, [progress, animateProgressChange]);

  // Animate on mount
  useEffect(() => {
    if (animated) {
      const clampedProgress = Math.max(0, Math.min(1, progress));
      animatedProgress.value = withDelay(300, withSpring(clampedProgress, {
        damping: 25,
        stiffness: 100,
      }));
    }
  }, []);

  // Continuous pulse animation when complete
  useEffect(() => {
    if (progress >= 1) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1,
        true
      );
    }
  }, [progress]);

  // Animated styles
  const containerStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: pulseScale.value },
    ],
  }));

  const rippleStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: rippleScale.value },
    ],
    opacity: interpolate(rippleScale.value, [0, 0.5, 1], [0, 1, 0]),
  }));

  const percentageStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: percentageScale.value },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  // Calculate current values
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const percentage = Math.round(clampedProgress * 100);
  const currentProgressColor = progressColor || getProgressColor(percentage);

  /**
   * Background circle props
   */
  const backgroundCircleProps: CircleProps = {
    cx: size / 2,
    cy: size / 2,
    r: radius,
    stroke: backgroundColor,
    strokeWidth,
    fill: 'transparent',
  };

  /**
   * Progress circle props
   */
  const progressCircleProps: CircleProps = {
    cx: size / 2,
    cy: size / 2,
    r: radius,
    stroke: currentProgressColor,
    strokeWidth,
    fill: 'transparent',
    strokeLinecap: 'round',
    rotation: '-90',
    origin: `${size / 2}, ${size / 2}`,
  };

  return (
    <Animated.View style={[styles.container, containerStyle, style]}>
      {/* Glow effect for milestones */}
      <Animated.View style={[styles.glow, glowStyle]} />

      {/* Ripple effect */}
      {showRipple && (
        <Animated.View style={[styles.ripple, rippleStyle]} />
      )}

      <Svg width={size} height={size} style={styles.svg}>
        {/* Background circle */}
        <Circle {...backgroundCircleProps} />

        {/* Progress circle with animated stroke dash */}
        <AnimatedCircle
          {...progressCircleProps}
          strokeDasharray={circumference}
          strokeDashoffset={animatedProgress as any}
        />
      </Svg>

      {/* Center content */}
      <View style={styles.centerContent}>
        {showPercentage && (
          <Animated.Text style={[styles.percentageText, percentageStyle, { color: textColor }]}>
            {percentage}%
          </Animated.Text>
        )}

        {showTarget && current !== undefined && target !== undefined && (
          <Text style={[styles.targetText, { color: COLORS.TEXT_SECONDARY }]}>
            {current} / {target}ml
          </Text>
        )}
      </View>

      {/* Water drop decoration */}
      {progress >= 1 && (
        <View style={styles.waterDropContainer}>
          <Text style={styles.waterDrop}>💧</Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  svg: {
    transform: [{ rotate: '-90deg' }],
  },

  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },

  percentageText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_3XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    textAlign: 'center',
  },

  targetText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    textAlign: 'center',
    marginTop: SPACING.XS,
  },

  ripple: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
    borderColor: COLORS.SUCCESS,
    backgroundColor: COLORS.SUCCESS + '20',
  },

  glow: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: COLORS.SUCCESS + '30',
    shadowColor: COLORS.SUCCESS,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 15,
  },

  waterDropContainer: {
    position: 'absolute',
    top: -20,
    right: -10,
    transform: [{ rotate: '15deg' }],
  },

  waterDrop: {
    fontSize: 30,
  },
});

/**
 * Mini progress circle for compact displays
 */
export const MiniProgressCircle: React.FC<{
  progress: number;
  size?: number;
  color?: string;
  animated?: boolean;
}> = ({
  progress,
  size = 60,
  color = COLORS.PRIMARY,
  animated = true,
}) => {
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      animatedProgress.value = withSpring(Math.max(0, Math.min(1, progress)), {
        damping: 20,
        stiffness: 100,
      });
    } else {
      animatedProgress.value = progress;
    }
  }, [progress, animated]);

  const radius = (size - 6) / 2;
  const circumference = radius * 2 * Math.PI;

  return (
    <View style={miniStyles.container}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={COLORS.BACKGROUND_DISABLED}
          strokeWidth={6}
          fill="transparent"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={6}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animatedProgress as any}
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={miniStyles.centerContent}>
        <Animated.Text style={[miniStyles.percentage, { color }]}>
          {Math.round(Math.max(0, Math.min(1, progress)) * 100)}%
        </Animated.Text>
      </View>
    </View>
  );
};

const miniStyles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },

  percentage: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default AnimatedProgressCircle;