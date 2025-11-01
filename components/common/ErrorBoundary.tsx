/**
 * Error Boundary Component
 * Catches JavaScript errors in component tree and displays fallback UI
 *
 * @component
 * @example
 * <ErrorBoundary fallback={<ErrorScreen />}>
 *   <App />
 * </ErrorBoundary>
 */

import React, { Component, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../utils/constants';

/**
 * Error Boundary Props
 */
interface ErrorBoundaryProps {
  /** Children components to wrap */
  children: ReactNode;
  /** Fallback component to render on error */
  fallback?: ReactNode;
  /** Custom error handler function */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  /** Whether to show retry button */
  showRetry?: boolean;
}

/**
 * Error Boundary State
 */
interface ErrorBoundaryState {
  /** Whether an error has occurred */
  hasError: boolean;
  /** The error that occurred */
  error?: Error;
  /** Additional error information */
  errorInfo?: React.ErrorInfo;
}

/**
 * Error Boundary Component
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * Update state when error occurs
   * @param {Error} error - The error that was thrown
   * @returns {boolean} Whether to update state
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Log error information
   * @param {Error} error - The error that was thrown
   * @param {React.ErrorInfo} errorInfo - Additional error information
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log to console in development
    console.error('Error Boundary caught an error:', error);
    console.error('Error Info:', errorInfo);

    // Log error details for debugging
    const errorLog = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    };

    // Store error log locally for debugging
    this.storeErrorLog(errorLog);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * Store error log locally for debugging
   * @param {Object} errorLog - Error log data
   */
  private storeErrorLog = (errorLog: any): void => {
    try {
      const existingLogs = this.getErrorLogs();
      const updatedLogs = [...existingLogs, errorLog].slice(-50); // Keep last 50 errors
      localStorage.setItem('@water_error_logs', JSON.stringify(updatedLogs));
    } catch (e) {
      console.warn('Failed to store error log:', e);
    }
  };

  /**
   * Get stored error logs
   * @returns {Array} Array of error logs
   */
  private getErrorLogs = (): any[] => {
    try {
      const logs = localStorage.getItem('@water_error_logs');
      return logs ? JSON.parse(logs) : [];
    } catch (e) {
      return [];
    }
  };

  /**
   * Retry function to reset error state
   */
  handleRetry = (): void => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  /**
   * Render error fallback UI
   * @returns {JSX.Element} Error fallback component
   */
  renderErrorFallback = () => {
    const { fallback, showRetry = true } = this.props;
    const { error } = this.state;

    // If custom fallback is provided, use it
    if (fallback) {
      return <>{fallback}</>;
    }

    // Default error screen
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.emoji}>😵</Text>
          <Text style={styles.title}>Oops! Something went wrong</Text>

          <Text style={styles.message}>
            {error?.message || 'An unexpected error occurred while using the app.'}
          </Text>

          <Text style={styles.subtext}>
            {`Don't worry, your water intake data is safe. Please restart the app or try again.`}
          </Text>

          {showRetry && (
            <TouchableOpacity
              style={styles.retryButton}
              onPress={this.handleRetry}
              accessible={true}
              accessibilityLabel="Retry and continue using the app"
              accessibilityRole="button"
            >
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          )}

          <View style={styles.helpSection}>
            <Text style={styles.helpTitle}>Need Help?</Text>
            <Text style={styles.helpText}>
              • Restart the app{'\n'}
              • Check your storage space{'\n'}
              • Update the app if available
            </Text>
          </View>

          {/* Error details for debugging (only in development) */}
          {__DEV__ && error?.stack && (
            <View style={styles.debugSection}>
              <Text style={styles.debugTitle}>Debug Info:</Text>
              <Text style={styles.debugText} numberOfLines={10}>
                {error.stack}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  render(): ReactNode {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      return this.renderErrorFallback();
    }

    return children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
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

  subtext: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_DISABLED,
    textAlign: 'center',
    marginBottom: SPACING.XL,
    lineHeight: 20,
  },

  retryButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.XL,
    paddingVertical: SPACING.MD,
    borderRadius: BORDER_RADIUS.FULL,
    marginBottom: SPACING.XL,
    minWidth: 120,
    alignItems: 'center',
  },

  retryText: {
    color: COLORS.TEXT_WHITE,
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
  },

  helpSection: {
    alignItems: 'flex-start',
    width: '100%',
    padding: SPACING.MD,
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: BORDER_RADIUS.MD,
    marginBottom: SPACING.MD,
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

  debugSection: {
    width: '100%',
    padding: SPACING.MD,
    backgroundColor: COLORS.ERROR + '10',
    borderRadius: BORDER_RADIUS.MD,
    marginTop: SPACING.MD,
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
});