/**
 * Progress Circle component for Water Reminder app
 * Animated circular progress indicator with percentage display
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Svg, {
  Circle,
  CircleProps,
} from 'react-native-svg';

import { COLORS, TYPOGRAPHY, SPACING } from '../../utils/constants';

/**
 * Progress Circle component props
 */
export interface ProgressCircleProps {
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
  /** Custom style for container */
  style?: any;
}

/**
 * Animated progress circle component with percentage display
 * @param {ProgressCircleProps} props - Component props
 * @returns {JSX.Element} Progress circle component
 *
 * @example
 * <ProgressCircle
 *   progress={0.75}
 *   size={200}
 *   showPercentage={true}
 *   showTarget={true}
 *   current={1500}
 *   target={2000}
 * />
 */
export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  progress,
  size = 200,
  strokeWidth = 12,
  backgroundColor = COLORS.BACKGROUND_DISABLED,
  progressColor = COLORS.PRIMARY,
  textColor = COLORS.TEXT_PRIMARY,
  showPercentage = true,
  showTarget = false,
  target,
  current,
  style,
}) => {
  /**
   * Calculate circle dimensions
   */
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress * circumference);

  /**
   * Ensure progress is within bounds (0-1)
   */
  const clampedProgress = Math.max(0, Math.min(1, progress));

  /**
   * Calculate percentage for display
   */
  const percentage = Math.round(clampedProgress * 100);

  /**
   * Determine progress color based on percentage
   */
  const getProgressColor = (): string => {
    if (percentage >= 100) return COLORS.SUCCESS;
    if (percentage >= 75) return COLORS.WATER_EXCELLENT;
    if (percentage >= 50) return COLORS.WATER_GOOD;
    if (percentage >= 25) return COLORS.WATER_MEDIUM;
    return COLORS.WATER_LOW;
  };

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
    stroke: progressColor || getProgressColor(),
    strokeWidth,
    fill: 'transparent',
    strokeDasharray,
    strokeDashoffset,
    strokeLinecap: 'round',
    rotation: '-90',
    origin: `${size / 2}, ${size / 2}`,
  };

  return (
    <View style={[styles.container, style]}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background circle */}
        <Circle {...backgroundCircleProps} />

        {/* Progress circle */}
        <Circle {...progressCircleProps} />
      </Svg>

      {/* Center content */}
      <View style={styles.centerContent}>
        {showPercentage && (
          <Text style={[styles.percentageText, { color: textColor }]}>
            {percentage}%
          </Text>
        )}

        {showTarget && current !== undefined && target !== undefined && (
          <Text style={[styles.targetText, { color: COLORS.TEXT_SECONDARY }]}>
            of {target}ml
          </Text>
        )}
      </View>
    </View>
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
});