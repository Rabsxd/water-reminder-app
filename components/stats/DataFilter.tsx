/**
 * Data Filter component for Water Reminder app
 * Provides filtering options for historical data
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../utils/constants';

/**
 * Filter options for historical data
 */
export type FilterOption = 'all' | 'week' | 'month' | 'completed' | 'incomplete';

/**
 * Data Filter component props
 */
export interface DataFilterProps {
  /** Current selected filter */
  currentFilter: FilterOption;
  /** Called when filter changes */
  onFilterChange: (filter: FilterOption) => void;
  /** Custom style for container */
  style?: any;
  /** Whether to show scroll horizontally */
  horizontal?: boolean;
}

/**
 * Filter option configuration
 */
const FILTER_OPTIONS: { value: FilterOption; label: string; description: string }[] = [
  { value: 'all', label: 'All', description: 'Show all historical data' },
  { value: 'week', label: 'This Week', description: 'Show last 7 days' },
  { value: 'month', label: 'This Month', description: 'Show current month' },
  { value: 'completed', label: 'Completed', description: 'Show completed days (80%+)' },
  { value: 'incomplete', label: 'Incomplete', description: 'Show incomplete days' },
];

/**
 * Data Filter component for historical data filtering
 * @param {DataFilterProps} props - Component props
 * @returns {JSX.Element} Data filter component
 *
 * @example
 * <DataFilter
 *   currentFilter="all"
 *   onFilterChange={(filter) => console.log('Filter changed:', filter)}
 * />
 */
export const DataFilter: React.FC<DataFilterProps> = ({
  currentFilter,
  onFilterChange,
  style,
  horizontal = true,
}) => {
  /**
   * Handle filter button press
   * @param {FilterOption} filter - Selected filter
   */
  const handleFilterPress = (filter: FilterOption) => {
    if (filter !== currentFilter) {
      onFilterChange(filter);
    }
  };

  const ScrollViewComponent = horizontal ? ScrollView : View;
  const scrollViewProps = horizontal ? {
    horizontal: true,
    showsHorizontalScrollIndicator: false,
    contentContainerStyle: styles.scrollContent,
  } : {};

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>Filter Data</Text>

      <ScrollViewComponent
        style={styles.filterContainer}
        {...scrollViewProps}
      >
        {FILTER_OPTIONS.map((option) => {
          const isActive = currentFilter === option.value;

          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.filterButton,
                isActive && styles.filterButtonActive,
              ]}
              onPress={() => handleFilterPress(option.value)}
              activeOpacity={0.8}
              accessibilityLabel={`Filter by ${option.label}`}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              accessibilityHint={option.description}
            >
              <Text style={[
                styles.filterButtonText,
                isActive && styles.filterButtonTextActive,
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollViewComponent>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BACKGROUND_CARD,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.LG,
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
    marginBottom: SPACING.MD,
  },

  filterContainer: {
    flexDirection: 'row',
  },

  scrollContent: {
    gap: SPACING.SM,
  },

  filterButton: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.MD,
    backgroundColor: COLORS.BACKGROUND_DISABLED,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },

  filterButtonActive: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  filterButtonText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_MEDIUM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },

  filterButtonTextActive: {
    color: COLORS.TEXT_WHITE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
  },
});