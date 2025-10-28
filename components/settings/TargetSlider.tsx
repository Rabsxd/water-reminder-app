/**
 * Target Slider component for Water Reminder app
 * Allows users to adjust their daily water target with visual feedback
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../utils/constants';
import { useWater } from '../../hooks/useWater';
import { DAILY_TARGET_LIMITS } from '../../utils/constants';

/**
 * Target Slider component props
 */
export interface TargetSliderProps {
  /** Custom style for container */
  style?: any;
  /** Whether to show detailed info */
  showDetails?: boolean;
  /** Custom value change handler */
  onValueChange?: (value: number) => void;
  /** Custom value change commit handler */
  onValueChangeCommit?: (value: number) => void;
}

/**
 * Target Slider component for daily water goal adjustment
 * @param {TargetSliderProps} props - Component props
 * @returns {JSX.Element} Target slider component
 *
 * @example
 * <TargetSlider
 *   showDetails={true}
 *   onValueChange={handleTargetChange}
 * />
 */
export const TargetSlider: React.FC<TargetSliderProps> = ({
  style,
  showDetails = false,
  onValueChange,
  onValueChangeCommit,
}) => {
  const { state, updateDailyTarget } = useWater();
  const [currentValue, setCurrentValue] = React.useState(state.settings.dailyTarget);

  // Update local value when state changes
  React.useEffect(() => {
    setCurrentValue(state.settings.dailyTarget);
  }, [state.settings.dailyTarget]);

  /**
   * Handle slider value change
   * @param {number} value - New slider value
   */
  const handleValueChange = (value: number) => {
    // Round to nearest 100
    const roundedValue = Math.round(value / 100) * 100;
    setCurrentValue(roundedValue);

    if (onValueChange) {
      onValueChange(roundedValue);
    }
  };

  /**
   * Handle slider value change commit (when user releases slider)
   * @param {number} value - Final slider value
   */
  const handleValueChangeCommit = async (value: number) => {
    // Round to nearest 100
    const roundedValue = Math.round(value / 100) * 100;

    try {
      await updateDailyTarget(roundedValue);

      if (onValueChangeCommit) {
        onValueChangeCommit(roundedValue);
      }
    } catch (error) {
      console.error('Failed to update daily target:', error);
      // Reset to original value on error
      setCurrentValue(state.settings.dailyTarget);
    }
  };

  /**
   * Get target level description based on value
   * @param {number} target - Target value in ml
   * @returns {Object} Target level info
   */
  const getTargetLevel = (target: number) => {
    if (target <= 1500) {
      return {
        level: 'Beginner',
        description: 'Great starting point',
        color: COLORS.PRIMARY,
        emoji: '💧',
      };
    } else if (target <= 2000) {
      return {
        level: 'Standard',
        description: 'Recommended daily amount',
        color: COLORS.SUCCESS,
        emoji: '✅',
      };
    } else if (target <= 2500) {
      return {
        level: 'Active',
        description: 'For active individuals',
        color: COLORS.WARNING,
        emoji: '🏃',
      };
    } else {
      return {
        level: 'Athlete',
        description: 'For high activity levels',
        color: '#8B5CF6',
        emoji: '🏆',
      };
    }
  };

  /**
   * Calculate how many glasses this represents
   * @param {number} target - Target in ml
   * @returns {number} Number of glasses (250ml each)
   */
  const getGlassCount = (target: number): number => {
    return Math.round(target / 250);
  };

  const level = getTargetLevel(currentValue);
  const glassCount = getGlassCount(currentValue);
  const currentIntake = state.today.intake;
  const progressPercentage = Math.round((currentIntake / currentValue) * 100);

  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Daily Target</Text>
        <Text style={styles.currentValue}>{currentValue}ml</Text>
      </View>

      {/* Level indicator */}
      <View style={[styles.levelContainer, { backgroundColor: level.color + '20' }]}>
        <Text style={styles.levelEmoji}>{level.emoji}</Text>
        <View style={styles.levelInfo}>
          <Text style={[styles.levelText, { color: level.color }]}>
            {level.level}
          </Text>
          <Text style={styles.levelDescription}>{level.description}</Text>
        </View>
      </View>

      {/* Custom Slider */}
      <View style={styles.sliderContainer}>
        {/* Progress track */}
        <View style={styles.track}>
          <View
            style={[
              styles.trackFill,
              {
                width: `${((currentValue - DAILY_TARGET_LIMITS.MIN) / (DAILY_TARGET_LIMITS.MAX - DAILY_TARGET_LIMITS.MIN)) * 100}%`,
                backgroundColor: level.color,
              },
            ]}
          />
        </View>

        {/* Slider thumb */}
        <TouchableOpacity
          style={[
            styles.thumb,
            {
              left: `${((currentValue - DAILY_TARGET_LIMITS.MIN) / (DAILY_TARGET_LIMITS.MAX - DAILY_TARGET_LIMITS.MIN)) * 100}%`,
            },
          ]}
          onPress={() => handleValueChangeCommit(currentValue)}
          activeOpacity={0.8}
        />

        {/* Min/Max labels */}
        <View style={styles.labelsContainer}>
          <Text style={styles.labelText}>{DAILY_TARGET_LIMITS.MIN}ml</Text>
          <Text style={styles.labelText}>{DAILY_TARGET_LIMITS.MAX}ml</Text>
        </View>

        {/* Increment/Decrement buttons */}
        <View style={styles.adjustButtonsContainer}>
          <TouchableOpacity
            style={[styles.adjustButton, styles.adjustButtonMinus]}
            onPress={() => handleValueChange(Math.max(DAILY_TARGET_LIMITS.MIN, currentValue - DAILY_TARGET_LIMITS.STEP))}
            disabled={currentValue <= DAILY_TARGET_LIMITS.MIN}
          >
            <Text style={styles.adjustButtonText}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.adjustButton, styles.adjustButtonPlus]}
            onPress={() => handleValueChange(Math.min(DAILY_TARGET_LIMITS.MAX, currentValue + DAILY_TARGET_LIMITS.STEP))}
            disabled={currentValue >= DAILY_TARGET_LIMITS.MAX}
          >
            <Text style={styles.adjustButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Detailed info */}
      {showDetails && (
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Glass Count:</Text>
            <Text style={styles.detailValue}>{glassCount} glasses (250ml each)</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Current Progress:</Text>
            <Text style={styles.detailValue}>{currentIntake}ml ({progressPercentage}%)</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Remaining:</Text>
            <Text style={styles.detailValue}>
              {Math.max(0, currentValue - currentIntake)}ml
            </Text>
          </View>
        </View>
      )}

      {/* Progress indicator */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressLabel}>{`Today's Progress`}</Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(progressPercentage, 100)}%`,
                backgroundColor: progressPercentage >= 100 ? COLORS.SUCCESS : level.color,
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {currentIntake} / {currentValue}ml ({progressPercentage}%)
        </Text>
      </View>

      {/* Tips */}
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>💡 Hydration Tips</Text>
        <Text style={styles.tipsText}>
          {currentValue <= 1500 && 'Start with 8 glasses of water throughout the day.'}
          {currentValue > 1500 && currentValue <= 2000 && 'Perfect! This is the recommended amount for most adults.'}
          {currentValue > 2000 && currentValue <= 2500 && 'Great choice! Extra hydration helps with physical activity.'}
          {currentValue > 2500 && 'Excellent! Remember to spread your intake throughout the day.'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BACKGROUND_CARD,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.LG,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.LG,
  },

  title: {
    fontSize: TYPOGRAPHY.FONT_SIZE_LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
    color: COLORS.TEXT_PRIMARY,
  },

  currentValue: {
    fontSize: TYPOGRAPHY.FONT_SIZE_XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    color: COLORS.PRIMARY,
  },

  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    marginBottom: SPACING.LG,
  },

  levelEmoji: {
    fontSize: 24,
    marginRight: SPACING.MD,
  },

  levelInfo: {
    flex: 1,
  },

  levelText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
    marginBottom: 2,
  },

  levelDescription: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
  },

  sliderContainer: {
    marginBottom: SPACING.LG,
  },

  thumb: {
    width: 24,
    height: 24,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: BORDER_RADIUS.FULL,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  track: {
    height: 6,
    backgroundColor: COLORS.BACKGROUND_DISABLED,
    borderRadius: BORDER_RADIUS.FULL,
    position: 'relative',
  },

  trackFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.FULL,
    minWidth: 4,
  },

  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.SM,
  },

  labelText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
  },

  detailsContainer: {
    backgroundColor: COLORS.BACKGROUND,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    marginBottom: SPACING.LG,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.XS,
  },

  detailLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
  },

  detailValue: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_MEDIUM,
    color: COLORS.TEXT_PRIMARY,
  },

  progressContainer: {
    marginBottom: SPACING.LG,
  },

  progressLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.SM,
  },

  progressBar: {
    height: 8,
    backgroundColor: COLORS.BACKGROUND_DISABLED,
    borderRadius: BORDER_RADIUS.FULL,
    overflow: 'hidden',
    marginBottom: SPACING.SM,
  },

  progressFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.FULL,
  },

  progressText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },

  tipsContainer: {
    backgroundColor: COLORS.PRIMARY_LIGHT,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
  },

  tipsTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
    color: COLORS.PRIMARY,
    marginBottom: SPACING.XS,
  },

  tipsText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT_NORMAL * TYPOGRAPHY.FONT_SIZE_SM,
  },

  adjustButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.MD,
  },

  adjustButton: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.FULL,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  adjustButtonMinus: {
    backgroundColor: COLORS.ERROR,
  },

  adjustButtonPlus: {
    backgroundColor: COLORS.SUCCESS,
  },

  adjustButtonText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    color: COLORS.TEXT_WHITE,
  },
});