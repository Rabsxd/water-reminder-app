/**
 * Custom hook for notification management
 * Provides easy integration with notification service for React components
 */

import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import {
  initializeNotifications,
  requestNotificationPermissions,
  scheduleWaterReminder,
  cancelAllWaterReminders,
  scheduleRecurringReminders,
  showImmediateNotification,
  getNotificationPermissionStatus,
  cleanupNotificationService,
} from '../services/notificationService';
import type { NotificationSettings } from '../utils/types';

/**
 * Hook state interface
 */
interface NotificationState {
  isEnabled: boolean;
  permissionStatus: string;
  isInitialized: boolean;
  lastReminderId: string | null;
  error: string | null;
}

/**
 * Hook return type
 */
interface UseNotificationsReturn extends NotificationState {
  initialize: () => Promise<boolean>;
  requestPermissions: () => Promise<boolean>;
  scheduleReminder: (currentIntake: number, dailyTarget: number) => Promise<string | null>;
  cancelReminders: () => Promise<number>;
  scheduleRecurring: (currentIntake: number, dailyTarget: number) => Promise<string[]>;
  showTestNotification: () => Promise<string | null>;
  refreshPermissionStatus: () => Promise<void>;
  clearError: () => void;
}

/**
 * Custom hook for managing notifications
 * @param {NotificationSettings} notificationSettings - User's notification settings
 * @returns {UseNotificationsReturn} Notification management functions and state
 */
export const useNotifications = (
  notificationSettings: NotificationSettings
): UseNotificationsReturn => {
  const [state, setState] = useState<NotificationState>({
    isEnabled: false,
    permissionStatus: 'unknown',
    isInitialized: false,
    lastReminderId: null,
    error: null,
  });

  /**
   * Initialize notification service
   * @returns {Promise<boolean>} Whether initialization was successful
   */
  const initialize = useCallback(async (): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, error: null }));

      const isInitialized = await initializeNotifications();

      if (isInitialized) {
        const permissionStatus = await getNotificationPermissionStatus();
        setState(prev => ({
          ...prev,
          isInitialized: true,
          isEnabled: permissionStatus === 'granted',
          permissionStatus,
        }));
      } else {
        setState(prev => ({
          ...prev,
          isInitialized: true,
          isEnabled: false,
          permissionStatus: 'denied',
          error: 'Failed to initialize notifications',
        }));
      }

      return isInitialized;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({
        ...prev,
        isInitialized: true,
        isEnabled: false,
        error: errorMessage,
      }));
      return false;
    }
  }, []);

  /**
   * Request notification permissions
   * @returns {Promise<boolean>} Whether permissions were granted
   */
  const requestPermissions = useCallback(async (): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, error: null }));

      const hasPermission = await requestNotificationPermissions();
      const permissionStatus = await getNotificationPermissionStatus();

      setState(prev => ({
        ...prev,
        isEnabled: hasPermission,
        permissionStatus,
      }));

      return hasPermission;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({ ...prev, error: errorMessage }));
      return false;
    }
  }, []);

  /**
   * Schedule a single water reminder
   * @param {number} currentIntake - Current water intake in ml
   * @param {number} dailyTarget - Daily target in ml
   * @returns {Promise<string | null>} Notification ID if scheduled successfully
   */
  const scheduleReminder = useCallback(
    async (currentIntake: number, dailyTarget: number): Promise<string | null> => {
      try {
        setState(prev => ({ ...prev, error: null }));

        if (!state.isEnabled) {
          setState(prev => ({
            ...prev,
            error: 'Notifications are not enabled',
          }));
          return null;
        }

        const reminderId = await scheduleWaterReminder(
          notificationSettings,
          currentIntake,
          dailyTarget
        );

        if (reminderId) {
          setState(prev => ({ ...prev, lastReminderId: reminderId }));
        }

        return reminderId;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setState(prev => ({ ...prev, error: errorMessage }));
        return null;
      }
    },
    [state.isEnabled, notificationSettings]
  );

  /**
   * Cancel all scheduled reminders
   * @returns {Promise<number>} Number of cancelled notifications
   */
  const cancelReminders = useCallback(async (): Promise<number> => {
    try {
      setState(prev => ({ ...prev, error: null }));

      const cancelledCount = await cancelAllWaterReminders();

      if (cancelledCount > 0) {
        setState(prev => ({ ...prev, lastReminderId: null }));
      }

      return cancelledCount;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({ ...prev, error: errorMessage }));
      return 0;
    }
  }, []);

  /**
   * Schedule recurring reminders
   * @param {number} currentIntake - Current water intake in ml
   * @param {number} dailyTarget - Daily target in ml
   * @returns {Promise<string[]>} Array of scheduled notification IDs
   */
  const scheduleRecurring = useCallback(
    async (currentIntake: number, dailyTarget: number): Promise<string[]> => {
      try {
        setState(prev => ({ ...prev, error: null }));

        if (!state.isEnabled) {
          setState(prev => ({
            ...prev,
            error: 'Notifications are not enabled',
          }));
          return [];
        }

        const scheduledIds = await scheduleRecurringReminders(
          notificationSettings,
          currentIntake,
          dailyTarget
        );

        if (scheduledIds.length > 0) {
          setState(prev => ({ ...prev, lastReminderId: scheduledIds[scheduledIds.length - 1] }));
        }

        return scheduledIds;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setState(prev => ({ ...prev, error: errorMessage }));
        return [];
      }
    },
    [state.isEnabled, notificationSettings]
  );

  /**
   * Show a test notification for debugging
   * @returns {Promise<string | null>} Notification ID if successful
   */
  const showTestNotification = useCallback(async (): Promise<string | null> => {
    try {
      setState(prev => ({ ...prev, error: null }));

      const notificationId = await showImmediateNotification(
        '💧 Test Notification',
        'This is a test notification from Water Reminder!',
        notificationSettings.vibration
      );

      return notificationId;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({ ...prev, error: errorMessage }));
      return null;
    }
  }, [notificationSettings.vibration]);

  /**
   * Refresh permission status
   */
  const refreshPermissionStatus = useCallback(async (): Promise<void> => {
    try {
      const permissionStatus = await getNotificationPermissionStatus();
      const isEnabled = permissionStatus === 'granted';

      setState(prev => ({
        ...prev,
        permissionStatus,
        isEnabled,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({ ...prev, error: errorMessage }));
    }
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback((): void => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Initialize on mount
  useEffect(() => {
    if (!state.isInitialized) {
      initialize();
    }
  }, [initialize, state.isInitialized]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupNotificationService();
    };
  }, []);

  return {
    ...state,
    initialize,
    requestPermissions,
    scheduleReminder,
    cancelReminders,
    scheduleRecurring,
    showTestNotification,
    refreshPermissionStatus,
    clearError,
  };
};