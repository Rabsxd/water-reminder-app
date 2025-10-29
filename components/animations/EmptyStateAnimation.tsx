/**
 * Empty State Animation component for Water Reminder app
 * Provides engaging animations for empty states and onboarding
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withRepeat,
  withTiming,
  withSequence,
  interpolate,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { COLORS, SPACING } from '../../utils/constants';

const { width, height } = Dimensions.get('window');

/**
 * Empty state animation component props
 */
interface EmptyStateAnimationProps {
  /** Type of empty state */
  type: 'no-data' | 'first-use' | 'no-history' | 'no-logs';
  /** Custom message to display */
  message?: string;
  /** Custom subtext */
  subtext?: string;
  /** Whether to show animation */
  animated?: boolean;
  /** Callback on action button press */
  onActionPress?: () => void;
  /** Action button text */
  actionText?: string;
}

/**
 * Empty State Animation component
 * @param {EmptyStateAnimationProps} props - Component props
 * @returns {JSX.Element} Empty state with animations
 *
 * @example
 * <EmptyStateAnimation
 *   type="no-logs"
 *   message="Belum ada catatan air hari ini"
 *   subtext="Mulai dengan menambah 250ml air"
 *   animated={true}
 * />
 */
export const EmptyStateAnimation: React.FC<EmptyStateAnimationProps> = ({
  type,
  message,
  subtext,
  animated = true,
  onActionPress,
  actionText,
}) => {
  // Animation values
  const waterY = useSharedValue(0);
  const waveY = useSharedValue(0);
  const dropletX = useSharedValue(0);
  const dropletY = useSharedValue(0);
  const containerOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  const [isVisible, setIsVisible] = useState(false);

  // Get configuration based on type
  const getConfig = () => {
    switch (type) {
      case 'no-data':
        return {
          icon: '💧',
          defaultMessage: 'Tidak Ada Data',
          defaultSubtext: 'Mulai tracking hidrasi Anda hari ini',
          actionText: 'Tambah Air',
          showAnimation: true,
        };
      case 'first-use':
        return {
          icon: '👋',
          defaultMessage: 'Selamat Datang!',
          defaultSubtext: 'Mulai perjalanan hidrasi yang sehat',
          actionText: 'Mulai Sekarang',
          showAnimation: true,
        };
      case 'no-history':
        return {
          icon: '📊',
          defaultMessage: 'Belum Ada Riwayat',
          defaultSubtext: 'Riwayat minum air Anda akan muncul di sini',
          actionText: undefined,
          showAnimation: true,
        };
      case 'no-logs':
        return {
          icon: '📝',
          defaultMessage: 'Belum Ada Catatan Hari Ini',
          defaultSubtext: 'Tambahkan air untuk memulai tracking',
          actionText: 'Tambah Air',
          showAnimation: true,
        };
      default:
        return {
          icon: '💧',
          defaultMessage: 'Data Kosong',
          defaultSubtext: 'Mulai dengan menambahkan air',
          actionText: 'Tambah Air',
          showAnimation: true,
        };
    }
  };

  const config = getConfig();

  // Start animations
  useEffect(() => {
    if (animated && !isVisible) {
      setIsVisible(true);

      // Container fade in
      containerOpacity.value = withTiming(1, {
        duration: 600,
        easing: Easing.out(Easing.quad),
      });

      // Water wave animation
      if (config.showAnimation) {
        waterY.value = withRepeat(
          withSpring(-10, {
            damping: 5,
            stiffness: 50,
          }),
          -1,
          true
        );

        waveY.value = withRepeat(
          withTiming(5, {
            duration: 2000,
            easing: Easing.inOut(Easing.quad),
          }),
          -1,
          true
        );

        // Floating droplets
        dropletY.value = withRepeat(
          withSequence(
            withTiming(-20, { duration: 1500, easing: Easing.out(Easing.quad) }),
            withTiming(20, { duration: 1500, easing: Easing.in(Easing.quad) })
          ),
          -1,
          true
        );

        dropletX.value = withRepeat(
          withSequence(
            withTiming(-10, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
            withTiming(10, { duration: 2000, easing: Easing.inOut(Easing.quad) })
          ),
          -1,
          true
        );
      }

      // Text fade in
      textOpacity.value = withDelay(300, withTiming(1, {
        duration: 500,
        easing: Easing.out(Easing.quad),
      }));

      // Button animation
      if (onActionPress) {
        buttonScale.value = withDelay(600, withSpring(1, {
          damping: 15,
          stiffness: 100,
        }));

        // Pulse animation for button
        pulseScale.value = withRepeat(
          withSequence(
            withTiming(1.05, { duration: 1000 }),
            withTiming(1, { duration: 1000 })
          ),
          -1,
          true
        );
      }
    }
  }, [animated, isVisible]);

  // Animation styles
  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const waterStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: waterY.value },
    ],
  }));

  const waveStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: waveY.value },
    ],
  }));

  const dropletStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: dropletX.value },
      { translateY: dropletY.value },
    ],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: buttonScale.value * pulseScale.value },
    ],
  }));

  const actualMessage = message || config.defaultMessage;
  const actualSubtext = subtext || config.defaultSubtext;
  const actualActionText = actionText || config.actionText;

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* Animated Water Illustration */}
      {config.showAnimation && (
        <View style={styles.illustrationContainer}>
          {/* Main water container */}
          <Animated.View style={[styles.waterContainer, waterStyle]}>
            <View style={styles.waterLevel}>
              <Animated.View style={[styles.wave, waveStyle]} />
              <Animated.View style={[styles.wave, waveStyle, styles.waveDelay]} />
            </View>
          </Animated.View>

          {/* Glass effect */}
          <View style={styles.glass} />

          {/* Floating droplets */}
          <Animated.View style={[styles.droplet1, dropletStyle]}>
            <View style={styles.droplet} />
          </Animated.View>
          <Animated.View style={[styles.droplet2, dropletStyle]}>
            <View style={styles.droplet} />
          </Animated.View>

          {/* Main icon */}
          <View style={styles.iconContainer}>
            <Animated.Text style={styles.mainIcon}>{config.icon}</Animated.Text>
          </View>
        </View>
      )}

      {/* Text content */}
      <Animated.View style={[styles.textContainer, textStyle]}>
        <Animated.Text style={styles.message}>{actualMessage}</Animated.Text>
        <Animated.Text style={styles.subtext}>{actualSubtext}</Animated.Text>
      </Animated.View>

      {/* Action button */}
      {onActionPress && actualActionText && (
        <Animated.View style={[styles.buttonContainer, buttonStyle]}>
          <Animated.View style={styles.actionButton}>
            <Animated.Text style={styles.buttonText}>{actualActionText}</Animated.Text>
          </Animated.View>
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.XL,
  },

  illustrationContainer: {
    width: 200,
    height: 200,
    marginBottom: SPACING.XL,
    position: 'relative',
  },

  waterContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    overflow: 'hidden',
    borderRadius: 20,
  },

  waterLevel: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY + '40',
    position: 'relative',
  },

  wave: {
    position: 'absolute',
    top: -10,
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: COLORS.PRIMARY + '60',
    borderRadius: 10,
  },

  waveDelay: {
    top: -5,
  },

  glass: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: COLORS.BORDER,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },

  droplet1: {
    position: 'absolute',
    top: 30,
    left: 20,
  },

  droplet2: {
    position: 'absolute',
    top: 50,
    right: 30,
  },

  droplet: {
    width: 12,
    height: 12,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 6,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  iconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -40 }, { translateY: -40 }],
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND_CARD,
    borderRadius: 40,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },

  mainIcon: {
    fontSize: 40,
  },

  textContainer: {
    alignItems: 'center',
    marginBottom: SPACING.XL,
  },

  message: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: SPACING.SM,
  },

  subtext: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 24,
  },

  buttonContainer: {
    marginTop: SPACING.MD,
  },

  actionButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.XL,
    paddingVertical: SPACING.MD,
    borderRadius: 25,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },

  buttonText: {
    color: COLORS.TEXT_WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

/**
 * Simple empty state component without animations
 * For fallback or reduced motion preference
 */
export const SimpleEmptyState: React.FC<{
  type: 'no-data' | 'first-use' | 'no-history' | 'no-logs';
  message?: string;
  subtext?: string;
}> = ({ type, message, subtext }) => {
  const getConfig = () => {
    switch (type) {
      case 'no-data':
        return { icon: '💧', defaultMessage: 'Tidak Ada Data' };
      case 'first-use':
        return { icon: '👋', defaultMessage: 'Selamat Datang!' };
      case 'no-history':
        return { icon: '📊', defaultMessage: 'Belum Ada Riwayat' };
      case 'no-logs':
        return { icon: '📝', defaultMessage: 'Belum Ada Catatan Hari Ini' };
      default:
        return { icon: '💧', defaultMessage: 'Data Kosong' };
    }
  };

  const config = getConfig();

  return (
    <View style={simpleStyles.container}>
      <View style={simpleStyles.iconContainer}>
        <Text style={simpleStyles.icon}>{config.icon}</Text>
      </View>
      <Text style={simpleStyles.message}>
        {message || config.defaultMessage}
      </Text>
      <Text style={simpleStyles.subtext}>
        {subtext || 'Mulai dengan menambahkan air'}
      </Text>
    </View>
  );
};

const simpleStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.XL,
  },

  iconContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND_CARD,
    borderRadius: 40,
    marginBottom: SPACING.LG,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },

  icon: {
    fontSize: 40,
  },

  message: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: SPACING.SM,
  },

  subtext: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default EmptyStateAnimation;