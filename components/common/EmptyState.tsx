/**
 * Empty State Component
 * Displays helpful empty state messages for different scenarios
 *
 * @component
 * @example
 * <EmptyState
 *   type="no-history"
 *   title="No History Yet"
 *   message="Start tracking your water intake to see your history here."
 *   action={{ text: "Add Water", onPress: handleAddWater }}
 * />
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../utils/constants';

/**
 * Empty state types
 */
export type EmptyStateType =
  | 'no-history'
  | 'no-today-logs'
  | 'first-day'
  | 'no-data'
  | 'network-error'
  | 'loading'
  | 'goal-reached'
  | 'custom';

/**
 * Empty state action
 */
interface EmptyStateAction {
  /** Button text */
  text: string;
  /** Button press handler */
  onPress: () => void;
  /** Button style variant */
  variant?: 'primary' | 'secondary';
}

/**
 * Empty State Props
 */
export interface EmptyStateProps {
  /** Type of empty state */
  type?: EmptyStateType;
  /** Custom title */
  title?: string;
  /** Custom message */
  message?: string;
  /** Custom emoji */
  emoji?: string;
  /** Action button */
  action?: EmptyStateAction;
  /** Additional action button */
  secondaryAction?: EmptyStateAction;
  /** Whether to show helpful tips */
  showTips?: boolean;
  /** Custom tips content */
  customTips?: string[];
}

/**
 * Empty State Component
 */
export const EmptyState: React.FC<EmptyStateProps> = React.memo(({
  type = 'custom',
  title,
  message,
  emoji,
  action,
  secondaryAction,
  showTips = true,
  customTips,
}) => {
  /**
   * Get empty state configuration based on type
   */
  const getEmptyStateConfig = () => {
    const configs = {
      'no-history': {
        emoji: '📊',
        title: 'No History Yet',
        message: 'Start tracking your water intake to see your drinking history and patterns here.',
        tips: [
          'Log your first glass of water to begin tracking',
          'Try to drink water at regular intervals',
          'Set reminders to help you stay on track',
        ],
      },
      'no-today-logs': {
        emoji: '💧',
        title: 'No Water Logged Today',
        message: 'Start your day right by logging your first glass of water.',
        tips: [
          'Drink a glass of water when you wake up',
          'Keep a water bottle nearby throughout the day',
          'Set hourly reminders on your phone',
        ],
      },
      'first-day': {
        emoji: '🌟',
        title: 'Your First Day!',
        message: 'Welcome to your hydration journey. Every glass counts towards a healthier you!',
        tips: [
          'Start with a reasonable daily goal',
          'Don\'t worry about being perfect',
          'Focus on building consistent habits',
        ],
      },
      'no-data': {
        emoji: '🔍',
        title: 'No Data Available',
        message: 'We couldn\'t load any data. Please check your connection and try again.',
        tips: [
          'Ensure you have an internet connection',
          'Try refreshing the app',
          'Restart the app if the problem persists',
        ],
      },
      'network-error': {
        emoji: '📡',
        title: 'No Internet Connection',
        message: 'Please check your internet connection to continue using the app.',
        tips: [
          'Check your WiFi or mobile data connection',
          'Try moving to a location with better reception',
          'Your data is saved locally and will sync when you\'re back online',
        ],
      },
      'loading': {
        emoji: '⏳',
        title: 'Loading...',
        message: 'Please wait while we load your data.',
        tips: [],
      },
      'goal-reached': {
        emoji: '🎉',
        title: 'Goal Reached!',
        message: 'Congratulations! You\'ve reached your daily water intake goal.',
        tips: [
          'Great job staying hydrated today!',
          'Keep up the good work tomorrow',
          'Consider adjusting your goal if needed',
        ],
      },
      custom: {
        emoji: '📝',
        title: 'No Content',
        message: 'There\'s nothing to show here right now.',
        tips: [],
      },
    };

    return configs[type] || configs.custom;
  };

  const config = getEmptyStateConfig();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emoji}>
          {emoji || config.emoji}
        </Text>

        <Text style={styles.title}>
          {title || config.title}
        </Text>

        <Text style={styles.message}>
          {message || config.message}
        </Text>

        {(action || secondaryAction) && (
          <View style={styles.actionContainer}>
            {action && (
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  action.variant === 'secondary'
                    ? styles.secondaryButton
                    : styles.primaryButton,
                ]}
                onPress={action.onPress}
                accessible={true}
                accessibilityLabel={action.text}
                accessibilityRole="button"
              >
                <Text style={[
                  styles.actionButtonText,
                  action.variant === 'secondary'
                    ? styles.secondaryButtonText
                    : styles.primaryButtonText,
                ]}>
                  {action.text}
                </Text>
              </TouchableOpacity>
            )}

            {secondaryAction && (
              <TouchableOpacity
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={secondaryAction.onPress}
                accessible={true}
                accessibilityLabel={secondaryAction.text}
                accessibilityRole="button"
              >
                <Text style={styles.secondaryButtonText}>
                  {secondaryAction.text}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {showTips && (customTips || config.tips).length > 0 && (
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>💡 Helpful Tips</Text>
            {(customTips || config.tips).map((tip, index) => (
              <Text key={index} style={styles.tipText}>
                • {tip}
              </Text>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
});

EmptyState.displayName = 'EmptyState';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },

  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.XL,
  },

  emptyStateContainer: {
    backgroundColor: COLORS.BACKGROUND_CARD,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.XL,
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  emoji: {
    fontSize: 64,
    marginBottom: SPACING.LG,
  },

  title: {
    fontSize: TYPOGRAPHY.FONT_SIZE_XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: SPACING.MD,
  },

  message: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.XL,
  },

  actionContainer: {
    width: '100%',
    gap: SPACING.SM,
    marginBottom: SPACING.LG,
  },

  actionButton: {
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.XL,
    borderRadius: BORDER_RADIUS.FULL,
    alignItems: 'center',
  },

  primaryButton: {
    backgroundColor: COLORS.PRIMARY,
  },

  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
  },

  actionButtonText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
  },

  primaryButtonText: {
    color: COLORS.TEXT_WHITE,
  },

  secondaryButtonText: {
    color: COLORS.PRIMARY,
  },

  tipsContainer: {
    width: '100%',
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.LG,
  },

  tipsTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },

  tipText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
    marginBottom: SPACING.XS,
  },
});