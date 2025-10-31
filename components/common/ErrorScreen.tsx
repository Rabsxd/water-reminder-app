/**
 * Error Screen Component
 * Dedicated error screen component for different error scenarios
 *
 * @component
 * @example
 * <ErrorScreen
 *   type="network"
 *   title="No Internet Connection"
 *   message="Please check your internet connection and try again."
 *   onRetry={handleRetry}
 * />
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../utils/constants';

/**
 * Error screen types
 */
export type ErrorScreenType =
  | 'network'
  | 'permission'
  | 'storage'
  | 'data'
  | 'generic'
  | 'first-launch'
  | 'daily-limit';

/**
 * Error Screen Props
 */
export interface ErrorScreenProps {
  /** Type of error to display */
  type?: ErrorScreenType;
  /** Custom title for the error */
  title?: string;
  /** Custom error message */
  message?: string;
  /** Custom subtitle or additional information */
  subtitle?: string;
  /** Retry button handler */
  onRetry?: () => void;
  /** Additional action button handler */
  onAction?: () => void;
  /** Retry button text */
  retryText?: string;
  /** Action button text */
  actionText?: string;
  /** Custom emoji or icon */
  emoji?: string;
  /** Whether to show debug information */
  showDebug?: boolean;
  /** Debug information */
  debugInfo?: any;
}

/**
 * Error Screen Component
 */
export const ErrorScreen: React.FC<ErrorScreenProps> = React.memo(({
  type = 'generic',
  title,
  message,
  subtitle,
  onRetry,
  onAction,
  retryText = 'Try Again',
  actionText,
  emoji,
  showDebug = false,
  debugInfo,
}) => {
  /**
   * Get error configuration based on type
   */
  const getErrorConfig = () => {
    const configs = {
      network: {
        emoji: '📡',
        title: 'No Internet Connection',
        message: 'Please check your internet connection and try again.',
        subtitle: 'Your water intake data is saved locally and will sync when you\'re back online.',
        retryText: 'Retry',
      },
      permission: {
        emoji: '🔒',
        title: 'Permission Required',
        message: 'This app needs notification permissions to remind you to drink water.',
        subtitle: 'You can enable notifications in your device settings.',
        retryText: 'Open Settings',
        actionText: 'Continue Without Reminders',
      },
      storage: {
        emoji: '💾',
        title: 'Storage Error',
        message: 'We couldn\'t save your data properly.',
        subtitle: 'Your device may be low on storage space. Please free up some space and try again.',
        retryText: 'Retry',
      },
      data: {
        emoji: '🔧',
        title: 'Data Error',
        message: 'We couldn\'t load your water intake data.',
        subtitle: 'Don\'t worry, your data is safe. Please restart the app to continue.',
        retryText: 'Restart App',
      },
      'first-launch': {
        emoji: '👋',
        title: 'Welcome to Water Reminder!',
        message: 'Let\'s set up your daily water intake goal.',
        subtitle: 'We recommend drinking 2000ml of water per day for optimal hydration.',
        retryText: 'Get Started',
      },
      'daily-limit': {
        emoji: '⚠️',
        title: 'Daily Limit Reached',
        message: 'You\'ve reached the maximum daily intake limit of 5000ml.',
        subtitle: 'For your safety, please contact a healthcare professional if you need to track more water intake.',
        retryText: 'I Understand',
      },
      generic: {
        emoji: '😵',
        title: 'Oops! Something went wrong',
        message: 'An unexpected error occurred.',
        subtitle: 'Please try again or restart the app if the problem persists.',
        retryText: 'Try Again',
      },
    };

    return configs[type] || configs.generic;
  };

  const config = getErrorConfig();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.errorContainer}>
        <Text style={styles.emoji}>
          {emoji || config.emoji}
        </Text>

        <Text style={styles.title}>
          {title || config.title}
        </Text>

        <Text style={styles.message}>
          {message || config.message}
        </Text>

        <Text style={styles.subtitle}>
          {subtitle || config.subtitle}
        </Text>

        <View style={styles.buttonContainer}>
          {onRetry && (
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={onRetry}
              accessible={true}
              accessibilityLabel={retryText}
              accessibilityRole="button"
            >
              <Text style={[styles.buttonText, styles.primaryButtonText]}>
                {retryText}
              </Text>
            </TouchableOpacity>
          )}

          {onAction && actionText && (
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={onAction}
              accessible={true}
              accessibilityLabel={actionText}
              accessibilityRole="button"
            >
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                {actionText}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Debug Information */}
        {showDebug && debugInfo && (
          <View style={styles.debugSection}>
            <Text style={styles.debugTitle}>Debug Information:</Text>
            <Text style={styles.debugText}>
              {JSON.stringify(debugInfo, null, 2)}
            </Text>
          </View>
        )}

        {/* Help Section */}
        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>Need More Help?</Text>
          <Text style={styles.helpText}>
            • Restart the app{'\n'}
            • Check your internet connection{'\n'}
            • Ensure you have enough storage space{'\n'}
            • Update the app to the latest version
          </Text>
        </View>
      </View>
    </ScrollView>
  );
});

ErrorScreen.displayName = 'ErrorScreen';

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

  errorContainer: {
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
    marginBottom: SPACING.MD,
    lineHeight: 22,
  },

  subtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_DISABLED,
    textAlign: 'center',
    marginBottom: SPACING.XL,
    lineHeight: 20,
  },

  buttonContainer: {
    width: '100%',
    gap: SPACING.SM,
    marginBottom: SPACING.LG,
  },

  button: {
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.XL,
    borderRadius: BORDER_RADIUS.FULL,
    alignItems: 'center',
    minWidth: 120,
  },

  primaryButton: {
    backgroundColor: COLORS.PRIMARY,
  },

  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
  },

  buttonText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
  },

  primaryButtonText: {
    color: COLORS.TEXT_WHITE,
  },

  secondaryButtonText: {
    color: COLORS.PRIMARY,
  },

  debugSection: {
    width: '100%',
    padding: SPACING.MD,
    backgroundColor: COLORS.ERROR + '10',
    borderRadius: BORDER_RADIUS.MD,
    marginVertical: SPACING.MD,
  },

  debugTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    color: COLORS.ERROR,
    marginBottom: SPACING.XS,
  },

  debugText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_XS,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: 'monospace',
  },

  helpSection: {
    width: '100%',
    alignItems: 'flex-start',
    padding: SPACING.MD,
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: BORDER_RADIUS.MD,
  },

  helpTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },

  helpText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
  },
});