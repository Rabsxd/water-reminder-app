/**
 * Splash Screen Animation component for Water Reminder app
 * Uses Reanimated for smooth water-themed animations
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
  interpolate,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { COLORS, SPACING } from '../../utils/constants';
import { ProgressCircle } from '../home/ProgressCircle';

const { width, height } = Dimensions.get('window');

/**
 * Splash animation component props
 */
interface SplashAnimationProps {
  /** Callback when animation completes */
  onAnimationComplete?: () => void;
  /** Animation duration in milliseconds */
  duration?: number;
  /** Whether to show progress animation */
  showProgress?: boolean;
}

/**
 * Splash Screen Animation component
 * @param {SplashAnimationProps} props - Component props
 * @returns {JSX.Element} Animated splash screen
 *
 * @example
 * <SplashAnimation
 *   onAnimationComplete={() => navigation.replace('Home')}
 *   duration={2000}
 *   showProgress={true}
 * />
 */
export const SplashAnimation: React.FC<SplashAnimationProps> = ({
  onAnimationComplete,
  duration = 2000,
  showProgress = true,
}) => {
  // Animation values
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const progress = useSharedValue(0);
  const waterDropY = useSharedValue(-height);
  const textOpacity = useSharedValue(0);
  const textY = useSharedValue(50);

  const [isAnimating, setIsAnimating] = useState(true);

  // Start animations on mount
  useEffect(() => {
    // Water drop entrance
    waterDropY.value = withSpring(0, {
      damping: 15,
      stiffness: 100,
    });

    // Main container fade in
    opacity.value = withDelay(200, withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.quad),
    }));

    // Scale animation
    scale.value = withDelay(300, withSpring(1, {
      damping: 20,
      stiffness: 100,
    }));

    // Text appearance
    textOpacity.value = withDelay(600, withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.quad),
    }));

    textY.value = withDelay(600, withSpring(0, {
      damping: 15,
      stiffness: 100,
    }));

    // Progress animation
    if (showProgress) {
      progress.value = withDelay(800, withSequence(
        withTiming(0.75, {
          duration: 1200,
          easing: Easing.out(Easing.quad),
        }),
        withTiming(1, {
          duration: 300,
          easing: Easing.in(Easing.quad),
        })
      ));
    }

    // Complete animation
    const totalDuration = duration + 500;
    setTimeout(() => {
      setIsAnimating(false);
      onAnimationComplete?.();
    }, totalDuration);
  }, [duration, showProgress, onAnimationComplete]);

  // Water drop animation style
  const waterDropStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: waterDropY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  // Text animation style
  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [
      { translateY: textY.value },
    ],
  }));

  // Progress animation style
  const progressStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [
      { translateY: textY.value },
    ],
  }));

  if (!isAnimating) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Water Drop Animation */}
      <Animated.View style={[styles.waterDropContainer, waterDropStyle]}>
        <View style={styles.waterDrop}>
          <View style={styles.waterDropInner} />
          <View style={styles.waterRipple}>
            <View style={styles.ripple} />
            <View style={[styles.ripple, styles.rippleDelay1]} />
            <View style={[styles.ripple, styles.rippleDelay2]} />
          </View>
        </View>
      </Animated.View>

      {/* App Title */}
      <Animated.View style={[styles.textContainer, textStyle]}>
        <Animated.Text style={styles.title}>Water Reminder</Animated.Text>
        <Animated.Text style={styles.subtitle}>Stay Hydrated, Stay Healthy</Animated.Text>
      </Animated.View>

      {/* Progress Animation */}
      {showProgress && (
        <Animated.View style={[styles.progressContainer, progressStyle]}>
          <ProgressCircle
            progress={progress.value}
            size={120}
            current={75}
            target={100}
            showPercentage={true}
          />
        </Animated.View>
      )}

      {/* Loading Dots */}
      <Animated.View style={[styles.loadingContainer, textStyle]}>
        <View style={styles.loadingDot} />
        <View style={[styles.loadingDot, styles.loadingDotDelay1]} />
        <View style={[styles.loadingDot, styles.loadingDotDelay2]} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },

  waterDropContainer: {
    marginBottom: SPACING.XL,
  },

  waterDrop: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  waterDropInner: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 50,
    position: 'relative',
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  waterDropInnerAlt: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 50,
    position: 'relative',
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  waterRipple: {
    position: 'absolute',
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },

  ripple: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY_LIGHT,
    opacity: 0,
  },

  rippleDelay1: {
    // Will be animated with delay
  },

  rippleDelay2: {
    // Will be animated with delay
  },

  textContainer: {
    alignItems: 'center',
    marginBottom: SPACING.XL,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },

  progressContainer: {
    marginVertical: SPACING.LG,
  },

  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.LG,
  },

  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.PRIMARY,
    marginHorizontal: 4,
  },

  loadingDotDelay1: {
    // Will be animated with delay
  },

  loadingDotDelay2: {
    // Will be animated with delay
  },
});

/**
 * Simple splash screen component without animations
 * For fallback or reduced motion preference
 */
export const SimpleSplash: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <View style={styles.container}>
      <View style={styles.waterDropContainer}>
        <View style={styles.waterDropInner} />
      </View>
      <View style={styles.textContainer}>
        <Animated.Text style={styles.title}>Water Reminder</Animated.Text>
        <Animated.Text style={styles.subtitle}>Stay Hydrated, Stay Healthy</Animated.Text>
      </View>
    </View>
  );
};

export default SplashAnimation;