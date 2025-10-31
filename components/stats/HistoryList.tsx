/**
 * History List component for Water Reminder app
 * Displays historical water intake data with optimized FlatList
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
import { useWaterStats } from '../../hooks/useWater';
import type { HistoryEntry } from '../../utils/types';

/**
 * History List component props
 */
export interface HistoryListProps {
  /** Custom style for container */
  style?: any;
  /** Maximum number of items to display */
  maxItems?: number;
  /** Whether to show delete buttons */
  showDeleteButtons?: boolean;
  /** Custom delete handler */
  onDeleteItem?: (date: string) => void;
  /** Date filter options */
  dateFilter?: 'all' | 'week' | 'month';
}

/**
 * Individual history entry component
 * @param {Object} props - Component props
 * @returns {JSX.Element} History entry component
 */
const HistoryEntryItem: React.FC<{
  item: HistoryEntry;
  showDeleteButton?: boolean;
  onDelete?: (date: string) => void;
}> = ({ item, showDeleteButton = false, onDelete }) => {
  /**
   * Format date for display
   * @returns {string} Formatted date string
   */
  const formatDate = (): string => {
    try {
      const date = new Date(item.date);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        return 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      } else {
        return date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        });
      }
    } catch (error) {
      return 'Invalid date';
    }
  };

  /**
   * Calculate percentage for progress bar
   * @returns {number} Completion percentage
   */
  const getPercentage = (): number => {
    return Math.round((item.totalIntake / item.target) * 100);
  };

  /**
   * Get progress bar color based on completion
   * @returns {string} Progress bar color
   */
  const getProgressColor = (): string => {
    const percentage = getPercentage();
    if (percentage >= 100) return COLORS.SUCCESS;
    if (percentage >= 80) return COLORS.WATER_EXCELLENT;
    if (percentage >= 50) return COLORS.WATER_GOOD;
    if (percentage >= 25) return COLORS.WATER_MEDIUM;
    return COLORS.WATER_LOW;
  };

  /**
   * Handle delete button press
   */
  const handleDelete = () => {
    if (onDelete) {
      onDelete(item.date);
    }
  };

  const percentage = getPercentage();
  const progressColor = getProgressColor();

  return (
    <View style={styles.historyItem}>
      <View style={styles.historyInfo}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{formatDate()}</Text>
          <Text style={styles.fullDateText}>{item.date}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.intakeRow}>
            <Text style={styles.intakeText}>{item.totalIntake}ml</Text>
            <Text style={styles.targetText}>/ {item.target}ml</Text>
          </View>
          <Text style={[styles.percentageText, { color: progressColor }]}>
            {percentage}%
          </Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: progressColor,
              },
            ]}
          />
        </View>

        {/* Achievement badge */}
        {item.completed && (
          <View style={styles.achievementBadge}>
            <Text style={styles.achievementText}>✓ Goal</Text>
          </View>
        )}
      </View>

      {showDeleteButton && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          accessibilityLabel={`Delete entry for ${item.date}`}
          accessibilityRole="button"
        >
          <Text style={styles.deleteText}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

/**
 * History List component with optimized FlatList
 * @param {HistoryListProps} props - Component props
 * @returns {JSX.Element} History list component
 *
 * @example
 * <HistoryList
 *   maxItems={20}
 *   dateFilter="week"
 *   showDeleteButtons={true}
 * />
 */
export const HistoryList: React.FC<HistoryListProps> = ({
  style,
  maxItems = 50,
  showDeleteButtons = false,
  onDeleteItem,
  dateFilter = 'all',
}) => {
  const { history } = useWaterStats();

  /**
   * Filter history data based on date filter
   * @returns {HistoryEntry[]} Filtered history data
   */
  const getFilteredHistory = (): HistoryEntry[] => {
    if (!history || history.length === 0) {
      return [];
    }

    const today = new Date();
    let cutoffDate = new Date();

    switch (dateFilter) {
      case 'week':
        cutoffDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(today.getMonth() - 1);
        break;
      default:
        cutoffDate = new Date(0); // Beginning of time
    }

    return history
      .filter(item => new Date(item.date) >= cutoffDate)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, maxItems);
  };

  
  /**
   * Handle delete action with confirmation
   * @param {string} date - Date of entry to delete
   */
  const handleDelete = async (date: string) => {
    if (onDeleteItem) {
      onDeleteItem(date);
    }
  };

  
  /**
   * Render empty state when no history
   * @returns {JSX.Element} Empty state component
   */
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>No history available</Text>
      <Text style={styles.emptyStateSubtext}>
        {dateFilter === 'all'
          ? 'Start tracking water to see your history'
          : `No entries in the last ${dateFilter}`
        }
      </Text>
    </View>
  );

  /**
   * Render list header with filter info
   * @returns {JSX.Element} List header
   */
  const renderHeader = () => {
    const filteredData = getFilteredHistory();
    if (filteredData.length === 0) return null;

    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          {dateFilter === 'all' && 'All Time History'}
          {dateFilter === 'week' && 'Last 7 Days'}
          {dateFilter === 'month' && 'Last 30 Days'}
        </Text>
        <Text style={styles.headerSubtext}>
          {filteredData.length} {filteredData.length === 1 ? 'day' : 'days'}
        </Text>
      </View>
    );
  };

  const filteredData = getFilteredHistory();

  return (
    <View style={[styles.container, style]}>
      {renderHeader()}

      {filteredData.length === 0 ? (
        renderEmptyState()
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.list}
          nestedScrollEnabled={false}
        >
          {filteredData.map((item) => (
            <HistoryEntryItem
              key={item.date}
              item={item}
              showDeleteButton={showDeleteButtons}
              onDelete={handleDelete}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

// Constants for optimization
const ITEM_HEIGHT = 100;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_CARD,
    borderRadius: BORDER_RADIUS.LG,
    overflow: 'hidden',
  },

  list: {
    flex: 1,
  },

  headerContainer: {
    padding: SPACING.LG,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
    backgroundColor: COLORS.BACKGROUND_CARD,
  },

  headerText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },

  headerSubtext: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
  },

  historyItem: {
    flexDirection: 'row',
    padding: SPACING.LG,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
    backgroundColor: COLORS.BACKGROUND,
    minHeight: ITEM_HEIGHT,
  },

  historyInfo: {
    flex: 1,
  },

  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },

  dateText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
    color: COLORS.TEXT_PRIMARY,
  },

  fullDateText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },

  intakeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },

  intakeText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    color: COLORS.PRIMARY,
  },

  targetText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
    marginLeft: SPACING.XS,
  },

  percentageText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
  },

  progressBarContainer: {
    height: 6,
    backgroundColor: COLORS.BACKGROUND_DISABLED,
    borderRadius: BORDER_RADIUS.FULL,
    overflow: 'hidden',
    marginBottom: SPACING.SM,
  },

  progressBar: {
    height: '100%',
    borderRadius: BORDER_RADIUS.FULL,
    minWidth: 4, // Minimum visible width
  },

  achievementBadge: {
    position: 'absolute',
    top: SPACING.LG,
    right: SPACING.LG,
    backgroundColor: COLORS.SUCCESS,
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XS,
    borderRadius: BORDER_RADIUS.FULL,
  },

  achievementText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_XS,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    color: COLORS.TEXT_WHITE,
  },

  deleteButton: {
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.FULL,
    marginLeft: SPACING.SM,
    backgroundColor: COLORS.ERROR + '20',
    alignSelf: 'center',
  },

  deleteText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_XL,
    color: COLORS.ERROR,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
  },

  emptyState: {
    alignItems: 'center',
    padding: SPACING.XXL,
  },

  emptyStateText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.SM,
    textAlign: 'center',
  },

  emptyStateSubtext: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_DISABLED,
    textAlign: 'center',
  },
});