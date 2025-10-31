/**
 * Swipeable History Item component for Water Reminder app
 * Provides swipe gestures for history list items with edit and delete actions
 */

import React, { useState } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BORDER_RADIUS, COLORS, SPACING, TYPOGRAPHY } from '../../utils/constants';
import { formatDate } from '../../utils/dateUtils';

// Helper function for interpolation - using deprecated API for compatibility
const interpolate = (value: Animated.Value, config: any) => {
  return value.interpolate(config);
};

/**
 * Swipeable history item props
 */
interface SwipeableHistoryItemProps {
  /** History item data */
  item: {
    date: string;
    totalIntake: number;
    target: number;
    percentage: number;
    logs?: {
      id: string;
      timestamp: string;
      amount: number;
    }[];
  };
  /** Edit action handler */
  onEdit?: (item: any) => void;
  /** Delete action handler */
  onDelete?: (date: string) => void;
  /** Item height */
  height?: number;
  /** Action button width */
  actionWidth?: number;
  /** Whether to show edit button */
  showEditButton?: boolean;
  /** Custom style */
  style?: any;
}

/**
 * Swipeable History Item component
 * @param {SwipeableHistoryItemProps} props - Component props
 * @returns {JSX.Element} Swipeable history list item
 *
 * @example
 * <SwipeableHistoryItem
 *   item={historyItem}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 *   showEditButton={true}
 * />
 */
export const SwipeableHistoryItem: React.FC<SwipeableHistoryItemProps> = ({
  item,
  onEdit,
  onDelete,
  height = 80,
  actionWidth = 80,
  showEditButton = true,
  style,
}) => {
  const [translateX] = useState(new Animated.Value(0));
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const totalActionWidth = showEditButton ? actionWidth * 2 : actionWidth;

  /**
   * Handle pan gesture
   */
  const onPanResponderMove = (evt: any, gestureState: any) => {
    const { dx } = gestureState.dx;

    // Only allow swipe left
    if (dx < 0) {
      // Limit swipe distance
      const clampedX = Math.max(-totalActionWidth, dx);
      translateX.setValue(clampedX);
    }
  };

  /**
   * Handle pan gesture release
   */
  const onPanResponderRelease = (evt: any, gestureState: any) => {
    const { dx } = gestureState.dx;

    // Determine which action to reveal based on swipe distance
    if (dx < -actionWidth * 0.5 && showEditButton) {
      // Show edit button
      Animated.spring(translateX, {
        toValue: -actionWidth,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else if (dx < -totalActionWidth * 0.7) {
      // Show both buttons (delete and edit)
      Animated.spring(translateX, {
        toValue: -totalActionWidth,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      // Animate back to original position
      Animated.spring(translateX, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }
  };

  /**
   * Handle edit button press
   */
  const handleEdit = () => {
    setIsEditing(true);
    onEdit?.(item);

    // Animate back to original position
    Animated.spring(translateX, {
      toValue: 0,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  /**
   * Handle delete button press
   */
  const handleDelete = () => {
    setIsDeleting(true);

    // Animate item out
    Animated.timing(translateX, {
      toValue: -400,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onDelete?.(item.date);
    });
  };

  /**
   * Reset item position
   */
  const resetPosition = () => {
    Animated.spring(translateX, {
      toValue: 0,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  // Create pan responder
  const panResponder = PanResponder.create({
    onPanResponderMove: onPanResponderMove,
    onPanResponderRelease: onPanResponderRelease,
  });

  /**
   * Get status color based on percentage
   */
  const getStatusColor = (percentage: number): string => {
    if (percentage >= 100) return COLORS.SUCCESS;
    if (percentage >= 75) return COLORS.WATER_EXCELLENT;
    if (percentage >= 50) return COLORS.WATER_GOOD;
    if (percentage >= 25) return COLORS.WATER_MEDIUM;
    return COLORS.WATER_LOW;
  };

  /**
   * Get status text
   */
  const getStatusText = (percentage: number): string => {
    if (percentage >= 100) return 'Target Tercapai';
    if (percentage >= 75) return 'Hampir Target';
    if (percentage >= 50) return 'Sedang Berjalan';
    if (percentage >= 25) return 'Perlu Ditambah';
    return 'Baru Dimulai';
  };

  const statusColor = getStatusColor(item.percentage);
  const statusText = getStatusText(item.percentage);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          height,
          transform: [{ translateX }],
        },
        style,
      ]}
      {...panResponder.panHandlers}
    >
      {/* Action buttons background */}
      <Animated.View
        style={[
          styles.actionButtonsContainer,
          {
            width: totalActionWidth,
            opacity: interpolate(translateX, {
              inputRange: [-totalActionWidth, 0],
              outputRange: [1, 0],
              extrapolate: 'clamp',
            }),
          },
        ]}
      >
        {/* Edit button */}
        {showEditButton && (
          <Animated.View
            style={[
              styles.actionButton,
              styles.editButton,
              {
                opacity: interpolate(translateX, {
                  inputRange: [-actionWidth, -totalActionWidth],
                  outputRange: [1, 0],
                  extrapolate: 'clamp',
                }),
              },
            ]}
          >
            <View style={styles.actionButtonContent}>
              <Text style={[styles.actionButtonText, styles.editButtonText]}>✏️</Text>
              <Text style={[styles.actionButtonSubtext, styles.editButtonSubtext]}>Edit</Text>
            </View>
          </Animated.View>
        )}

        {/* Delete button */}
        <Animated.View
          style={[
            styles.actionButton,
            styles.deleteButton,
            {
              right: 0,
              opacity: interpolate(translateX, {
                inputRange: [-totalActionWidth, -actionWidth],
                outputRange: [1, 0],
                extrapolate: 'clamp',
              }),
            },
          ]}
        >
          <View style={styles.actionButtonContent}>
            <Text style={[styles.actionButtonText, styles.deleteButtonText]}>🗑️</Text>
            <Text style={[styles.actionButtonSubtext, styles.deleteButtonSubtext]}>Hapus</Text>
          </View>
        </Animated.View>
      </Animated.View>

      {/* Main content */}
      <Animated.View
        style={[
          styles.content,
          {
            backgroundColor: interpolate(translateX, {
              inputRange: [-totalActionWidth, 0],
              outputRange: [COLORS.BACKGROUND_CARD, COLORS.BACKGROUND_CARD],
              extrapolate: 'clamp',
            }),
          },
        ]}
      >
        {/* Date and status */}
        <View style={styles.leftContent}>
          <Text style={styles.dateText}>{formatDate(item.date)}</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
          </View>
        </View>

        {/* Intake and target info */}
        <View style={styles.rightContent}>
          <Text style={styles.intakeText}>{item.totalIntake}ml</Text>
          <Text style={styles.targetText}>/ {item.target}ml</Text>
          <Text style={[styles.percentageText, { color: statusColor }]}>
            {Math.round(item.percentage)}%
          </Text>
        </View>
      </Animated.View>

      {/* Touch overlay for action buttons */}
      <Animated.View
        style={[
          styles.touchOverlay,
          {
            opacity: interpolate(translateX, {
              inputRange: [-totalActionWidth, -actionWidth * 0.5, 0],
              outputRange: [1, 1, 0],
              extrapolate: 'clamp',
            }),
          },
        ]}
      >
        {showEditButton && (
          <Animated.View
            style={[
              styles.touchArea,
              { left: 0, width: actionWidth },
              {
                opacity: interpolate(translateX, {
                  inputRange: [-totalActionWidth, -actionWidth * 0.8, -actionWidth * 0.5],
                  outputRange: [1, 1, 0],
                  extrapolate: 'clamp',
                }),
              },
            ]}
            onTouchStart={handleEdit}
          />
        )}
        <Animated.View
          style={[
            styles.touchArea,
            { right: 0, width: actionWidth },
            {
              opacity: interpolate(translateX, {
                inputRange: [-totalActionWidth, -actionWidth * 0.7, -actionWidth * 0.5],
                outputRange: [1, 1, 0],
                extrapolate: 'clamp',
              }),
            },
          ]}
          onTouchStart={handleDelete}
        />
      </Animated.View>
    </Animated.View>
  );
};


const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: BORDER_RADIUS.MD,
    marginBottom: SPACING.SM,
  },

  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.MD,
    backgroundColor: COLORS.BACKGROUND_CARD,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  leftContent: {
    flex: 1,
    marginRight: SPACING.SM,
  },

  dateText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS / 2,
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.XS,
  },

  statusText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_MEDIUM,
  },

  rightContent: {
    alignItems: 'flex-end',
  },

  intakeText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    color: COLORS.TEXT_PRIMARY,
  },

  targetText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.XS / 2,
  },

  percentageText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
  },

  actionButtonsContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
  },

  actionButton: {
    width: 80,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  editButton: {
    backgroundColor: COLORS.PRIMARY,
  },

  deleteButton: {
    backgroundColor: COLORS.ERROR,
  },

  actionButtonContent: {
    alignItems: 'center',
  },

  actionButtonText: {
    fontSize: 16,
  },

  editButtonText: {
    color: COLORS.TEXT_WHITE,
  },

  deleteButtonText: {
    color: COLORS.TEXT_WHITE,
  },

  actionButtonSubtext: {
    fontSize: 10,
    marginTop: 2,
  },

  editButtonSubtext: {
    color: COLORS.TEXT_WHITE + '80',
  },

  deleteButtonSubtext: {
    color: COLORS.TEXT_WHITE + '80',
  },

  touchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
  },

  touchArea: {
    height: '100%',
    backgroundColor: 'transparent',
  },
});

export default SwipeableHistoryItem;