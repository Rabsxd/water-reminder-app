/**
 * Quick Add Buttons component for Water Reminder app
 * Provides quick add buttons for common water amounts with state management
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../utils/constants';
import { useWater } from '../../hooks/useWater';

/**
 * Quick Add Button component props
 */
interface QuickAddButtonProps {
  /** Amount in milliliters */
  amount: number;
  /** Whether button is disabled */
  disabled?: boolean;
  /** Button press handler */
  onPress: (amount: number) => void;
  /** Whether target is reached (affects button styling) */
  targetReached?: boolean;
}

/**
 * Individual quick add button
 * @param {QuickAddButtonProps} props - Component props
 * @returns {JSX.Element} Quick add button component
 */
const QuickAddButton: React.FC<QuickAddButtonProps> = ({
  amount,
  disabled = false,
  onPress,
  targetReached = false,
}) => {
  /**
   * Handle button press
   */
  const handlePress = () => {
    if (!disabled) {
      onPress(amount);
    }
  };

  /**
   * Get button style based on state
   */
  const getButtonStyle = () => {
    if (disabled) {
      return styles.buttonDisabled;
    }

    if (targetReached) {
      return styles.buttonSuccess;
    }

    return styles.button;
  };

  /**
   * Get text style based on state
   */
  const getTextStyle = () => {
    if (disabled) {
      return styles.buttonTextDisabled;
    }

    if (targetReached) {
      return styles.buttonTextSuccess;
    }

    return styles.buttonText;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}
      accessibilityLabel={`Add ${amount} milliliters of water`}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <Text style={getTextStyle()}>
        +{amount}ml
      </Text>
    </TouchableOpacity>
  );
};

/**
 * Quick Add Buttons component props
 */
export interface QuickAddButtonsProps {
  /** Custom style for container */
  style?: any;
  /** Optional custom amounts array */
  amounts?: number[];
  /** Whether to show labels under buttons */
  showLabels?: boolean;
}

/**
 * Quick add buttons container with predefined amounts
 * @param {QuickAddButtonsProps} props - Component props
 * @returns {JSX.Element} Quick add buttons component
 *
 * @example
 * <QuickAddButtons
 *   amounts={[200, 300, 500]}
 *   showLabels={true}
 * />
 */
export const QuickAddButtons: React.FC<QuickAddButtonsProps> = ({
  style,
  amounts,
  showLabels = false,
}) => {
  const { addQuickAmount, quickAddOptions, isTargetReached } = useWater();

  /**
   * Get amounts to display (use custom amounts if provided, otherwise use quickAddOptions)
   */
  const displayAmounts = React.useMemo(() => {
    if (amounts) {
      return amounts.map(amount => ({
        amount,
        disabled: false,
      }));
    }
    return quickAddOptions || [];
  }, [amounts, quickAddOptions]);

  /**
   * Handle quick add button press
   */
  const handleQuickAdd = async (amount: number) => {
    await addQuickAmount(amount);
  };

  if (!displayAmounts || displayAmounts.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.buttonsContainer}>
        {displayAmounts.map((option) => (
          <QuickAddButton
            key={option.amount}
            amount={option.amount}
            disabled={option.disabled}
            onPress={handleQuickAdd}
            targetReached={isTargetReached}
          />
        ))}
      </View>

      {showLabels && (
        <View style={styles.labelsContainer}>
          {displayAmounts.map((option) => (
            <View key={option.amount} style={styles.labelItem}>
              <Text style={styles.labelText}>
                {option.amount}ml
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },

  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    gap: SPACING.SM,
  },

  // Button styles
  button: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    borderRadius: BORDER_RADIUS.LG,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },

  buttonDisabled: {
    backgroundColor: COLORS.BACKGROUND_DISABLED,
  },

  buttonSuccess: {
    backgroundColor: COLORS.SUCCESS,
  },

  // Text styles
  buttonText: {
    color: COLORS.TEXT_WHITE,
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_MEDIUM,
  },

  buttonTextDisabled: {
    color: COLORS.TEXT_DISABLED,
  },

  buttonTextSuccess: {
    color: COLORS.TEXT_WHITE,
  },

  // Labels container
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: SPACING.SM,
  },

  labelItem: {
    alignItems: 'center',
    flex: 1,
  },

  labelText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
});