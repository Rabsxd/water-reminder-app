/**
 * Error Recovery Hook
 * Provides error handling and recovery functionality
 *
 * @hook
 * @example
 * const { handleError, recover, hasError } = useErrorRecovery();
 */

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import type { UserSettings, TodayData, HistoryEntry } from '../utils/types';
import { STORAGE_KEYS } from '../utils/constants';

/**
 * Error recovery state
 */
interface ErrorRecoveryState {
  hasError: boolean;
  errorType: 'storage' | 'data' | 'network' | 'permission' | 'generic' | null;
  errorMessage: string | null;
  isRecovering: boolean;
}

/**
 * Error recovery options
 */
interface ErrorRecoveryOptions {
  showAlert?: boolean;
  autoRecover?: boolean;
  customMessage?: string;
}

/**
 * Error Recovery Hook
 */
export const useErrorRecovery = () => {
  const [state, setState] = useState<ErrorRecoveryState>({
    hasError: false,
    errorType: null,
    errorMessage: null,
    isRecovering: false,
  });

  /**
   * Handle error with recovery options
   * @param {Error} error - The error to handle
   * @param {ErrorRecoveryOptions} options - Recovery options
   */
  const handleError = useCallback((
    error: Error | string,
    options: ErrorRecoveryOptions = {}
  ) => {
    const {
      showAlert = true,
      autoRecover = false,
      customMessage,
    } = options;

    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorType = determineErrorType(error);

    setState({
      hasError: true,
      errorType,
      errorMessage: customMessage || errorMessage,
      isRecovering: false,
    });

    // Log error for debugging
    console.error('Error handled by useErrorRecovery:', error);

    // Show alert if requested
    if (showAlert && !autoRecover) {
      Alert.alert(
        'Error',
        customMessage || errorMessage,
        [
          {
            text: 'Try Again',
            onPress: () => attemptRecovery(),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    }

    // Auto-recover if requested
    if (autoRecover) {
      attemptRecovery();
    }
  }, []);

  /**
   * Determine error type based on error content
   * @param {Error|string} error - Error to analyze
   * @returns {string} Error type
   */
  const determineErrorType = (error: Error | string): ErrorRecoveryState['errorType'] => {
    const message = typeof error === 'string' ? error : error.message;

    if (message.includes('AsyncStorage') || message.includes('storage')) {
      return 'storage';
    }
    if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
      return 'network';
    }
    if (message.includes('permission') || message.includes('denied')) {
      return 'permission';
    }
    if (message.includes('data') || message.includes('parse')) {
      return 'data';
    }

    return 'generic';
  };

  /**
   * Attempt to recover from error
   */
  const attemptRecovery = useCallback(async () => {
    setState(prev => ({ ...prev, isRecovering: true }));

    try {
      switch (state.errorType) {
        case 'storage':
          await recoverFromStorageError();
          break;
        case 'data':
          await recoverFromDataError();
          break;
        case 'network':
          // Network errors recover automatically when connection is restored
          break;
        case 'permission':
          // Permission errors require user action
          break;
        default:
          // For generic errors, try clearing corrupted data
          await clearCorruptedData();
          break;
      }

      setState({
        hasError: false,
        errorType: null,
        errorMessage: null,
        isRecovering: false,
      });

    } catch (recoveryError) {
      console.error('Recovery failed:', recoveryError);
      setState(prev => ({
        ...prev,
        isRecovering: false,
        errorMessage: `Recovery failed: ${recoveryError}`,
      }));
    }
  }, [state.errorType]);

  /**
   * Recover from storage errors
   */
  const recoverFromStorageError = async (): Promise<void> => {
    try {
      // Test AsyncStorage access
      await AsyncStorage.setItem('@water_test', 'test');
      await AsyncStorage.removeItem('@water_test');
    } catch (error) {
      throw new Error('Storage is not available. Please free up space on your device.');
    }
  };

  /**
   * Recover from data errors
   */
  const recoverFromDataError = async (): Promise<void> => {
    try {
      // Validate and repair data integrity
      const settingsData = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      const todayData = await AsyncStorage.getItem(STORAGE_KEYS.TODAY);
      const historyData = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY);

      // Validate settings
      if (settingsData) {
        try {
          JSON.parse(settingsData);
        } catch {
          await AsyncStorage.removeItem(STORAGE_KEYS.SETTINGS);
        }
      }

      // Validate today data
      if (todayData) {
        try {
          JSON.parse(todayData);
        } catch {
          await AsyncStorage.removeItem(STORAGE_KEYS.TODAY);
        }
      }

      // Validate history data
      if (historyData) {
        try {
          JSON.parse(historyData);
        } catch {
          await AsyncStorage.removeItem(STORAGE_KEYS.HISTORY);
        }
      }

    } catch (error) {
      throw new Error('Failed to repair data integrity.');
    }
  };

  /**
   * Clear potentially corrupted data
   */
  const clearCorruptedData = async (): Promise<void> => {
    try {
      // Clear error logs that might be corrupted
      await AsyncStorage.removeItem('@water_error_logs');

      // Clear last check date if corrupted
      await AsyncStorage.removeItem(STORAGE_KEYS.LAST_CHECK_DATE);

    } catch (error) {
      throw new Error('Failed to clear corrupted data.');
    }
  };

  /**
   * Reset error state
   */
  const resetError = useCallback(() => {
    setState({
      hasError: false,
      errorType: null,
      errorMessage: null,
      isRecovering: false,
    });
  }, []);

  /**
   * Check if it's first app launch
   */
  const checkFirstLaunch = useCallback(async (): Promise<boolean> => {
    try {
      const hasLaunched = await AsyncStorage.getItem('@water_has_launched');
      return !hasLaunched;
    } catch (error) {
      console.error('Failed to check first launch:', error);
      return true; // Assume first launch if we can't check
    }
  }, []);

  /**
   * Mark first launch as completed
   */
  const completeFirstLaunch = useCallback(async (): Promise<void> => {
    try {
      await AsyncStorage.setItem('@water_has_launched', 'true');
    } catch (error) {
      console.error('Failed to complete first launch:', error);
    }
  }, []);

  return {
    // State
    hasError: state.hasError,
    errorType: state.errorType,
    errorMessage: state.errorMessage,
    isRecovering: state.isRecovering,

    // Actions
    handleError,
    attemptRecovery,
    resetError,

    // First launch helpers
    checkFirstLaunch,
    completeFirstLaunch,
  };
};