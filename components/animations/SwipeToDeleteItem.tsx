/**
 * Swipe to Delete component for Water Reminder app
 * Provides swipe gestures for list items with delete actions
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  PanResponderInstance,
  Animated,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../../utils/constants';


/**
 * Swipe to delete item props
 */
interface SwipeToDeleteItemProps {
  /** Item content */
  children: React.ReactNode;
  /** Delete action handler */
  onDelete: () => void;
  /** Item height */
  height?: number;
  /** Delete button width */
  deleteWidth?: number;
  /** Background color when swiped */
  swipeBackgroundColor?: string;
  /** Delete button color */
  deleteButtonColor?: string;
  /** Custom style */
  style?: any;
}

/**
 * Swipe to Delete component
 * @param {SwipeToDeleteItemProps} props - Component props
 * @returns {JSX.Element} Swipeable list item
 *
 * @example
 * <SwipeToDeleteItem
 *   onDelete={() => deleteItem(id)}
 *   height={60}
 * >
 *   <View style={styles.itemContent}>
 *     <Text>Water Entry</Text>
 *   </View>
 * </SwipeToDeleteItem>
 */
export const SwipeToDeleteItem: React.FC<SwipeToDeleteItemProps> = ({
  children,
  onDelete,
  height = 60,
  deleteWidth = 80,
  swipeBackgroundColor = COLORS.ERROR,
  deleteButtonColor = COLORS.ERROR,
  style,
}) => {
  const [translateX] = useState(new Animated.Value(0));
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Handle pan gesture
   */
  const onPanResponderMove = (evt: any, gestureState: any) => {
    const { dx } = gestureState.dx;

    // Only allow swipe left
    if (dx < 0) {
      // Limit swipe distance
      const clampedX = Math.max(-deleteWidth, dx);
      translateX.setValue(clampedX);
    }
  };

  /**
   * Handle pan gesture release
   */
  const onPanResponderRelease = (evt: any, gestureState: any) => {
    const { dx } = gestureState.dx;

    // If swiped past threshold, show delete button
    if (dx < -deleteWidth * 0.5) {
      Animated.spring(translateX, {
        toValue: -deleteWidth,
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
   * Handle delete button press
   */
  const handleDelete = () => {
    setIsDeleting(true);

    // Animate item out
    Animated.timing(translateX, {
      toValue: -300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onDelete();
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
    >
      {/* Delete button background */}
      <Animated.View
        style={[
          styles.deleteBackground,
          {
            width: deleteWidth,
            backgroundColor: swipeBackgroundColor,
            opacity: translateX.interpolate({
              inputRange: [-deleteWidth, 0],
              outputRange: [1, 0],
              extrapolate: 'clamp',
            }),
          },
        ]}
      >
        {/* Delete button */}
        <View style={styles.deleteButton}>
          <View style={styles.deleteButtonContent}>
            <Text style={styles.deleteButtonText}>🗑️</Text>
            <Text style={styles.deleteButtonSubtext}>Delete</Text>
          </View>
        </View>
      </Animated.View>

      {/* Main content */}
      <Animated.View
        style={[
          styles.content,
          {
            backgroundColor: translateX.interpolate({
              inputRange: [-deleteWidth, 0],
              outputRange: [swipeBackgroundColor, COLORS.BACKGROUND_CARD],
              extrapolate: 'clamp',
            }),
          },
        ]}
      >
        {children}
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
    justifyContent: 'center',
    paddingHorizontal: SPACING.MD,
  },

  deleteBackground: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  deleteButton: {
    width: 60,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.SM,
  },

  deleteButtonContent: {
    alignItems: 'center',
  },

  deleteButtonText: {
    fontSize: 16,
  },

  deleteButtonSubtext: {
    fontSize: 10,
    color: COLORS.TEXT_WHITE + '80',
  },
});

/**
 * Swipe gesture detector hook
 */
export const useSwipeGesture = (onSwipeLeft?: () => void, onSwipeRight?: () => void) => {
  const [translateX] = useState(new Animated.Value(0));
  const [isActive, setIsActive] = useState(false);

  const onPanResponderMove = (evt: any, gestureState: any) => {
    const { dx } = gestureState.dx;
    translateX.setValue(dx);
    setIsActive(true);
  };

  const onPanResponderRelease = (evt: any, gestureState: any) => {
    const { dx } = gestureState.dx;
    const threshold = 50;

    // Check if swipe threshold is met
    if (dx > threshold && onSwipeRight) {
      onSwipeRight?.();
    } else if (dx < -threshold && onSwipeLeft) {
      onSwipeLeft?.();
    }

    // Reset position
    Animated.spring(translateX, {
      toValue: 0,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start(() => {
      setIsActive(false);
    });
  };

  const panResponder = PanResponder.create({
    onPanResponderMove: onPanResponderMove,
    onPanResponderRelease: onPanResponderRelease,
  });

  return {
    translateX,
    isActive,
    panResponder,
    reset: () => {
      Animated.spring(translateX, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    },
  };
};

export default SwipeToDeleteItem;