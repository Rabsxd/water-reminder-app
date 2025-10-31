/**
 * Today Log List component for Water Reminder app
 * Displays today's water intake entries with delete functionality
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
import { useWater } from '../../hooks/useWater';
import type { WaterLogEntry } from '../../utils/types';

/**
 * Today Log List component props
 */
export interface TodayLogListProps {
  /** Custom style for container */
  style?: any;
  /** Maximum number of items to display */
  maxItems?: number;
  /** Whether to show delete buttons */
  showDeleteButtons?: boolean;
  /** Custom delete handler */
  onDeleteItem?: (logId: string) => void;
}

/**
 * Individual log entry component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Log entry component
 */
const LogEntryItem: React.FC<{
  item: WaterLogEntry;
  showDeleteButton?: boolean;
  onDelete?: (logId: string) => void;
}> = ({ item, showDeleteButton = true, onDelete }) => {
  /**
   * Format time for display
   * @returns {string} Formatted time string
   */
  const formatTime = (): string => {
    try {
      const date = new Date(item.timestamp);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch (error) {
      return 'Invalid time';
    }
  };

  /**
   * Handle delete button press
   */
  const handleDelete = () => {
    if (onDelete) {
      onDelete(item.id);
    }
  };

  return (
    <View style={styles.logItem}>
      <View style={styles.logInfo}>
        <Text style={styles.logAmount}>{item.amount}ml</Text>
        <Text style={styles.logTime}>{formatTime()}</Text>
      </View>
      {showDeleteButton && (
        <TouchableOpacity
          style={styles.logDeleteButton}
          onPress={handleDelete}
          accessibilityLabel={`Delete ${item.amount}ml entry`}
          accessibilityRole="button"
        >
          <Text style={styles.logDeleteText}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

/**
 * Today Log List component with swipe-to-delete functionality
 * @param {TodayLogListProps} props - Component props
 * @returns {JSX.Element} Today log list component
 *
 * @example
 * <TodayLogList
 *   maxItems={5}
 *   showDeleteButtons={true}
 *   onDeleteItem={handleDelete}
 * />
 */
export const TodayLogList: React.FC<TodayLogListProps> = React.memo(({
  style,
  maxItems = 10,
  showDeleteButtons = true,
  onDeleteItem,
}) => {
  const { state, removeTodayLog } = useWater();

  /**
   * Get today's logs sorted by timestamp (newest first)
   * @returns {WaterLogEntry[]} Sorted logs array
   */
  const getTodayLogs = (): WaterLogEntry[] => {
    if (!state.today?.logs || state.today.logs.length === 0) {
      return [];
    }

    return [...state.today.logs]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, maxItems);
  };

  /**
   * Handle delete action with confirmation
   * @param {string} logId - ID of log to delete
   */
  const handleDelete = async (logId: string) => {
    try {
      await removeTodayLog(logId);
    } catch (error) {
      console.error('Failed to delete log entry:', error);
    }
  };

  
  /**
   * Render empty state when no logs
   * @returns {JSX.Element} Empty state component
   */
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>No water intake recorded yet</Text>
      <Text style={styles.emptyStateSubtext}>Start tracking by adding water above</Text>
    </View>
  );

  /**
   * Render footer with "more" text if there are more items
   * @returns {JSX.Element|null} Footer component or null
   */
  const renderFooter = () => {
    const totalLogs = state.today?.logs?.length || 0;
    if (totalLogs > maxItems) {
      return (
        <Text style={styles.logMoreText}>
          ... and {totalLogs - maxItems} more
        </Text>
      );
    }
    return null;
  };

  const logs = getTodayLogs();

  return (
    <View style={[styles.container, style]}>
      {logs.length === 0 ? (
        renderEmptyState()
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          nestedScrollEnabled={false}
        >
          {logs.map((item) => (
            <LogEntryItem
              key={item.id}
              item={item}
              showDeleteButton={showDeleteButtons}
              onDelete={onDeleteItem || handleDelete}
            />
          ))}
          {renderFooter()}
        </ScrollView>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  listContainer: {
    flexGrow: 1,
  },

  logItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
    backgroundColor: COLORS.BACKGROUND_CARD,
    marginVertical: 1,
  },

  logInfo: {
    flex: 1,
  },

  logAmount: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_MEDIUM,
    color: COLORS.TEXT_PRIMARY,
  },

  logTime: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },

  logDeleteButton: {
    padding: SPACING.SM,
    borderRadius: BORDER_RADIUS.FULL,
    minWidth: 32,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.ERROR + '20',
  },

  logDeleteText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_LG,
    color: COLORS.ERROR,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    textAlign: 'center',
  },

  logMoreText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: SPACING.SM,
    paddingVertical: SPACING.SM,
  },

  emptyState: {
    alignItems: 'center',
    padding: SPACING.XL,
    backgroundColor: COLORS.BACKGROUND_CARD,
    borderRadius: BORDER_RADIUS.LG,
  },

  emptyStateText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.XS,
    textAlign: 'center',
  },

  emptyStateSubtext: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_DISABLED,
    textAlign: 'center',
  },
});