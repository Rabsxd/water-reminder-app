/**
 * Chart View Toggle component for Water Reminder app
 * Allows switching between weekly and monthly chart views
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../utils/constants';

/**
 * Chart View Toggle component props
 */
export interface ChartViewToggleProps {
  /** Current view mode */
  currentView: 'weekly' | 'monthly';
  /** Called when view changes */
  onViewChange: (view: 'weekly' | 'monthly') => void;
  /** Custom style for container */
  style?: any;
}

/**
 * Chart View Toggle component for switching between weekly and monthly views
 * @param {ChartViewToggleProps} props - Component props
 * @returns {JSX.Element} Chart view toggle component
 *
 * @example
 * <ChartViewToggle
 *   currentView="weekly"
 *   onViewChange={(view) => console.log('View changed:', view)}
 * />
 */
export const ChartViewToggle: React.FC<ChartViewToggleProps> = ({
  currentView,
  onViewChange,
  style,
}) => {
  /**
   * Handle view button press
   * @param {'weekly' | 'monthly'} view - Selected view
   */
  const handleViewPress = (view: 'weekly' | 'monthly') => {
    if (view !== currentView) {
      onViewChange(view);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>Chart View</Text>

      <View style={styles.toggleContainer}>
        {/* Weekly view button */}
        <TouchableOpacity
          style={[
            styles.toggleButton,
            currentView === 'weekly' && styles.toggleButtonActive,
            currentView === 'weekly' && styles.toggleButtonLeft,
          ]}
          onPress={() => handleViewPress('weekly')}
          activeOpacity={0.8}
          accessibilityLabel="Show weekly chart"
          accessibilityRole="button"
          accessibilityState={{ selected: currentView === 'weekly' }}
        >
          <Text style={[
            styles.toggleButtonText,
            currentView === 'weekly' && styles.toggleButtonTextActive,
          ]}>
            Weekly
          </Text>
        </TouchableOpacity>

        {/* Monthly view button */}
        <TouchableOpacity
          style={[
            styles.toggleButton,
            currentView === 'monthly' && styles.toggleButtonActive,
            currentView === 'monthly' && styles.toggleButtonRight,
          ]}
          onPress={() => handleViewPress('monthly')}
          activeOpacity={0.8}
          accessibilityLabel="Show monthly chart"
          accessibilityRole="button"
          accessibilityState={{ selected: currentView === 'monthly' }}
        >
          <Text style={[
            styles.toggleButtonText,
            currentView === 'monthly' && styles.toggleButtonTextActive,
          ]}>
            Monthly
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    backgroundColor: COLORS.BACKGROUND_CARD,
    borderRadius: BORDER_RADIUS.LG,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  label: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
    color: COLORS.TEXT_PRIMARY,
  },

  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.BACKGROUND_DISABLED,
    borderRadius: BORDER_RADIUS.MD,
    padding: 2,
  },

  toggleButton: {
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.SM,
    minWidth: 80,
    alignItems: 'center',
  },

  toggleButtonActive: {
    backgroundColor: COLORS.PRIMARY,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  toggleButtonLeft: {
    borderTopLeftRadius: BORDER_RADIUS.SM,
    borderBottomLeftRadius: BORDER_RADIUS.SM,
  },

  toggleButtonRight: {
    borderTopRightRadius: BORDER_RADIUS.SM,
    borderBottomRightRadius: BORDER_RADIUS.SM,
  },

  toggleButtonText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_MEDIUM,
    color: COLORS.TEXT_SECONDARY,
  },

  toggleButtonTextActive: {
    color: COLORS.TEXT_WHITE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
  },
});