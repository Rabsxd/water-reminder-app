/**
 * Success Animation component for Water Reminder app
 * Provides animated feedback for achievements and goal completion
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

const { width, height } = Dimensions.get('window');

/**
 * Success animation component props
 */
interface SuccessAnimationProps {
  /** Whether to show the animation */
  visible: boolean;
  /** Type of success animation */
  type?: 'goal' | 'streak' | 'achievement';
  /** Callback when animation completes */
  onAnimationComplete?: () => void;
  /** Custom message to display */
  message?: string;
  /** Animation duration in milliseconds */
  duration?: number;
}

/**
 * Success Animation component
 * @param {SuccessAnimationProps} props - Component props
 * @returns {JSX.Element} Success animation overlay
 *
 * @example
 * <SuccessAnimation
 *   visible={showSuccess}
 *   type="goal"
 *   message="Target harian tercapai!"
 *   onAnimationComplete={() => setShowSuccess(false)}
 * />
 */
export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  visible,
  type = 'goal',
  onAnimationComplete,
  message,
  duration = 2500,
}) => {
  // Animation values
  const overlayOpacity = useSharedValue(0);
  const scale = useSharedValue(0);
  const rotation = useSharedValue(0);
  const sparkleOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textY = useSharedValue(50);
  const checkmarkProgress = useSharedValue(0);
  const confettiY = useSharedValue(-height);

  const [isAnimating, setIsAnimating] = useState(false);

  // Get animation config based on type
  const getAnimationConfig = () => {
    switch (type) {
      case 'goal':
        return {
          icon: '🎯',
          color: COLORS.SUCCESS,
          defaultMessage: 'Target Harian Tercapai!',
          sparkles: true,
        };
      case 'streak':
        return {
          icon: '🔥',
          color: COLORS.WARNING,
          defaultMessage: 'Streak Bertambah!',
          sparkles: true,
        };
      case 'achievement':
        return {
          icon: '🏆',
          color: COLORS.PRIMARY,
          defaultMessage: 'Pencapaian Luar Biasa!',
          sparkles: true,
        };
      default:
        return {
          icon: '✅',
          color: COLORS.SUCCESS,
          defaultMessage: 'Berhasil!',
          sparkles: false,
        };
    }
  };

  const config = getAnimationConfig();

  // Start animation when visible
  useEffect(() => {
    if (visible) {
      setIsAnimating(true);

      // Overlay fade in
      overlayOpacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.quad),
      });

      // Main icon entrance
      scale.value = withDelay(300, withSpring(1, {
        damping: 15,
        stiffness: 100,
      }));

      rotation.value = withDelay(300, withSequence(
        withTiming(360, {
          duration: 800,
          easing: Easing.out(Easing.quad),
        }),
        withTiming(0, {
          duration: 200,
          easing: Easing.in(Easing.quad),
        })
      ));

      // Sparkles effect
      if (config.sparkles) {
        sparkleOpacity.value = withDelay(500, withSequence(
          withTiming(1, {
            duration: 200,
          }),
          withTiming(0, {
            duration: 800,
            easing: Easing.out(Easing.quad),
          })
        ));
      }

      // Checkmark animation for goal completion
      if (type === 'goal') {
        checkmarkProgress.value = withDelay(600, withTiming(1, {
          duration: 600,
          easing: Easing.out(Easing.quad),
        }));
      }

      // Text appearance
      textOpacity.value = withDelay(800, withTiming(1, {
        duration: 500,
        easing: Easing.out(Easing.quad),
      }));

      textY.value = withDelay(800, withSpring(0, {
        damping: 15,
        stiffness: 100,
      }));

      // Confetti effect
      if (config.sparkles) {
        confettiY.value = withDelay(1000, withSpring(height + 100, {
          damping: 20,
          stiffness: 80,
        }));
      }

      // Complete animation
      setTimeout(() => {
        overlayOpacity.value = withTiming(0, {
          duration: 300,
          easing: Easing.in(Easing.quad),
        }, () => {
          runOnJS(() => {
            setIsAnimating(false);
            onAnimationComplete?.();
          })();
        });
      }, duration);
    }
  }, [visible, duration, onAnimationComplete]);

  // Don't render if not animating
  if (!isAnimating) {
    return null;
  }

  // Overlay animation style
  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  // Main icon animation style
  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  // Sparkle animation style
  const sparkleStyle = useAnimatedStyle(() => ({
    opacity: sparkleOpacity.value,
  }));

  // Text animation style
  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [
      { translateY: textY.value },
    ],
  }));

  // Confetti animation style
  const confettiStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: confettiY.value },
    ],
  }));

  // Checkmark animation style
  const checkmarkStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: checkmarkProgress.value },
    ],
    opacity: checkmarkProgress.value,
  }));

  return (
    <Animated.View style={[styles.overlay, overlayStyle]}>
      {/* Confetti Animation */}
      {config.sparkles && (
        <Animated.View style={[styles.confettiContainer, confettiStyle]}>
          {[...Array(6)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.confettiPiece,
                {
                  backgroundColor: [
                    COLORS.SUCCESS,
                    COLORS.PRIMARY,
                    COLORS.WARNING,
                    COLORS.INFO,
                    COLORS.SECONDARY,
                  ][index % 5],
                  left: `${15 + index * 15}%`,
                  transform: [
                    { rotate: `${index * 60}deg` },
                  ],
                },
              ]}
            />
          ))}
        </Animated.View>
      )}

      {/* Main Success Icon */}
      <Animated.View style={[styles.iconContainer, iconStyle]}>
        <View style={[styles.iconCircle, { backgroundColor: config.color }]}>
          {type === 'goal' ? (
            <Animated.View style={checkmarkStyle}>
              <View style={styles.checkmark}>
                <View style={styles.checkmarkStem} />
                <View style={styles.checkmarkKick} />
              </View>
            </Animated.View>
          ) : (
            <Animated.Text style={styles.emojiIcon}>{config.icon}</Animated.Text>
          )}
        </View>

        {/* Sparkle Effects */}
        {config.sparkles && (
          <Animated.View style={[styles.sparklesContainer, sparkleStyle]}>
            {[...Array(8)].map((_, index) => (
              <View
                key={index}
                style={[
                  styles.sparkle,
                  {
                    top: Math.sin((index * Math.PI) / 4) * 60 + 60,
                    left: Math.cos((index * Math.PI) / 4) * 60 + 60,
                  },
                ]}
              />
            ))}
          </Animated.View>
        )}
      </Animated.View>

      {/* Success Message */}
      <Animated.View style={[styles.textContainer, textStyle]}>
        <Animated.Text style={styles.successText}>
          {message || config.defaultMessage}
        </Animated.Text>
        <Animated.Text style={styles.subText}>
          Kerja bagus! Pertahankan hidrasi Anda 💪
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },

  iconContainer: {
    position: 'relative',
    marginBottom: SPACING.LG,
  },

  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.SHADOW_DARK,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },

  emojiIcon: {
    fontSize: 60,
  },

  checkmark: {
    width: 60,
    height: 30,
    position: 'relative',
  },

  checkmarkStem: {
    position: 'absolute',
    width: 4,
    height: 30,
    backgroundColor: COLORS.TEXT_WHITE,
    left: 0,
    top: 0,
    borderRadius: 2,
  },

  checkmarkKick: {
    position: 'absolute',
    width: 30,
    height: 4,
    backgroundColor: COLORS.TEXT_WHITE,
    left: 2,
    bottom: 2,
    borderRadius: 2,
    transform: [{ rotate: '-45deg' }],
    transformOrigin: 'left center',
  },

  sparklesContainer: {
    position: 'absolute',
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },

  sparkle: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: COLORS.WARNING,
    borderRadius: 2,
  },

  textContainer: {
    alignItems: 'center',
    paddingHorizontal: SPACING.LG,
  },

  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.TEXT_WHITE,
    textAlign: 'center',
    marginBottom: SPACING.SM,
  },

  subText: {
    fontSize: 16,
    color: COLORS.TEXT_WHITE,
    textAlign: 'center',
    opacity: 0.9,
  },

  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
  },

  confettiPiece: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 2,
  },
});

/**
 * Quick success feedback component for small interactions
 */
export const QuickSuccess: React.FC<{
  visible: boolean;
  onComplete?: () => void;
}> = ({ visible, onComplete }) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, {
        damping: 20,
        stiffness: 100,
      });

      opacity.value = withSequence(
        withTiming(1, { duration: 200 }),
        withTiming(0, { duration: 200 }, (finished) => {
          if (finished && onComplete) {
            runOnJS(onComplete)();
          }
        })
      );
    }
  }, [visible, onComplete]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, style]}>
      <View style={styles.iconContainer}>
        <Animated.Text style={styles.successText}>✓</Animated.Text>
      </View>
    </Animated.View>
  );
};

const quickSuccessStyles = StyleSheet.create({
  quickSuccess: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }],
  },

  quickSuccessIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.SUCCESS,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  quickSuccessText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.TEXT_WHITE,
  },
});

export default SuccessAnimation;