/**
 * Custom hook for water-related functionality
 * Provides convenient functions and computed values for water tracking
 */

import { useCallback, useMemo } from "react";
import {
  useWaterActions,
  useWaterContext,
  useWaterState,
} from "../context/WaterContext";
import { AMOUNT_LIMITS, QUICK_ADD_AMOUNTS } from "../utils/constants";
import {
  calculateGoalPercentage,
  getTodayLogs,
  isGoalCompleted,
  calculateStreak,
} from "../utils/dateUtils";
import type { WaterLogEntry } from "../utils/types";

/**
 * Hook for water management functionality
 * @returns {Object} Water management functions and state
 *
 * @example
 * const {
 *   state,
 *   progress,
 *   isTargetReached,
 *   addQuickAmount,
 *   addCustomAmount,
 *   removeTodayLog,
 *   todayLogs,
 *   stats
 * } = useWater();
 */
export const useWater = () => {
  const context = useWaterContext();
  const state = useWaterState();
  const actions = useWaterActions();

  /**
   * Add water with quick amount
   * @param {number} amount - Amount to add (should be one of QUICK_ADD_AMOUNTS)
   * @returns {Promise<void>}
   *
   * @example
   * await addQuickAmount(250); // Add 250ml
   */
  const addQuickAmount = useCallback(
    async (amount: number): Promise<void> => {
      // Type assertion since we validated it's a quick add amount
      if (!QUICK_ADD_AMOUNTS.includes(amount as any)) {
        console.warn(`Amount ${amount}ml is not a quick add amount`);
        return;
      }

      await actions.addDrink(amount);
    },
    [actions]
  );

  /**
   * Add custom water amount
   * @param {number} amount - Custom amount to add (50-1000ml)
   * @returns {Promise<{ success: boolean; error?: string }>} Operation result
   *
   * @example
   * const result = await addCustomAmount(350);
   * if (!result.success) {
   *   console.error(result.error);
   * }
   */
  const addCustomAmount = useCallback(
    async (amount: number): Promise<{ success: boolean; error?: string }> => {
      // Validate amount
      if (typeof amount !== "number" || isNaN(amount)) {
        return { success: false, error: "Amount must be a number" };
      }

      if (amount < AMOUNT_LIMITS.MIN) {
        return {
          success: false,
          error: `Minimum amount is ${AMOUNT_LIMITS.MIN}ml`,
        };
      }

      if (amount > AMOUNT_LIMITS.MAX) {
        return {
          success: false,
          error: `Maximum amount per entry is ${AMOUNT_LIMITS.MAX}ml`,
        };
      }

      // Check daily limit
      const newTotal = state.today.intake + amount;
      if (newTotal > AMOUNT_LIMITS.DAILY_MAX) {
        return {
          success: false,
          error: `Daily limit of ${AMOUNT_LIMITS.DAILY_MAX}ml would be exceeded`,
        };
      }

      try {
        await actions.addDrink(amount);
        return { success: true };
      } catch {
        return { success: false, error: "Failed to add water amount" };
      }
    },
    [actions, state.today.intake]
  );

  /**
   * Remove a water log entry from today
   * @param {string} logId - ID of the log entry to remove
   * @returns {Promise<{ success: boolean; error?: string }>} Operation result
   *
   * @example
   * const result = await removeTodayLog('log-123');
   */
  const removeTodayLog = useCallback(
    async (logId: string): Promise<{ success: boolean; error?: string }> => {
      if (!logId || typeof logId !== "string") {
        return { success: false, error: "Valid log ID is required" };
      }

      // Check if log exists in today's logs
      const logExists = state.today.logs.some((log) => log.id === logId);
      if (!logExists) {
        return { success: false, error: "Log entry not found" };
      }

      try {
        await actions.removeDrink(logId);
        return { success: true };
      } catch {
        return { success: false, error: "Failed to remove log entry" };
      }
    },
    [actions, state.today.logs]
  );

  /**
   * Update daily target
   * @param {number} target - New daily target in milliliters
   * @returns {Promise<{ success: boolean; error?: string }>} Operation result
   *
   * @example
   * const result = await updateDailyTarget(2500);
   */
  const updateDailyTarget = useCallback(
    async (target: number): Promise<{ success: boolean; error?: string }> => {
      if (typeof target !== "number" || isNaN(target)) {
        return { success: false, error: "Target must be a number" };
      }

      if (target < 1000 || target > 4000) {
        return {
          success: false,
          error: "Target must be between 1000ml and 4000ml",
        };
      }

      if (target % 100 !== 0) {
        return { success: false, error: "Target must be a multiple of 100ml" };
      }

      try {
        await actions.updateSettings({ dailyTarget: target });
        return { success: true };
      } catch {
        return { success: false, error: "Failed to update daily target" };
      }
    },
    [actions]
  );

  /**
   * Update reminder settings
   * @param {Object} reminderSettings - New reminder settings
   * @returns {Promise<{ success: boolean; error?: string }>} Operation result
   *
   * @example
   * const result = await updateReminderSettings({
   *   enabled: true,
   *   interval: 90,
   *   sound: true,
   *   vibration: false
   * });
   */
  const updateReminderSettings = useCallback(
    async (reminderSettings: {
      enabled?: boolean;
      interval?: number;
      sound?: boolean;
      vibration?: boolean;
      wakeHours?: { start: number; end: number };
    }): Promise<{ success: boolean; error?: string }> => {
      const settingsToUpdate: any = {};

      // Validate and add settings
      if (reminderSettings.enabled !== undefined) {
        if (typeof reminderSettings.enabled !== "boolean") {
          return { success: false, error: "Enabled must be true or false" };
        }
        settingsToUpdate.reminderEnabled = reminderSettings.enabled;
      }

      if (reminderSettings.interval !== undefined) {
        if (
          typeof reminderSettings.interval !== "number" ||
          reminderSettings.interval < 15 ||
          reminderSettings.interval > 240
        ) {
          return {
            success: false,
            error: "Interval must be between 15 and 240 minutes",
          };
        }
        settingsToUpdate.reminderInterval = reminderSettings.interval;
      }

      if (reminderSettings.sound !== undefined) {
        if (typeof reminderSettings.sound !== "boolean") {
          return { success: false, error: "Sound must be true or false" };
        }
        settingsToUpdate.soundEnabled = reminderSettings.sound;
      }

      if (reminderSettings.vibration !== undefined) {
        if (typeof reminderSettings.vibration !== "boolean") {
          return { success: false, error: "Vibration must be true or false" };
        }
        settingsToUpdate.vibrationEnabled = reminderSettings.vibration;
      }

      if (reminderSettings.wakeHours !== undefined) {
        const { start, end } = reminderSettings.wakeHours;
        if (
          typeof start !== "number" ||
          typeof end !== "number" ||
          start < 0 ||
          start > 23 ||
          end < 1 ||
          end > 24
        ) {
          return { success: false, error: "Invalid wake hours" };
        }
        settingsToUpdate.wakeHours = { start, end };
      }

      try {
        await actions.updateSettings(settingsToUpdate);
        return { success: true };
      } catch {
        return { success: false, error: "Failed to update reminder settings" };
      }
    },
    [actions]
  );

  // Computed values
  const todayLogs = useMemo((): WaterLogEntry[] => {
    return getTodayLogs(state.today.logs);
  }, [state.today.logs]);

  const quickAddOptions = useMemo(() => {
    return QUICK_ADD_AMOUNTS.map((amount) => ({
      amount,
      label: `${amount}ml`,
      disabled: state.today.intake + amount > AMOUNT_LIMITS.DAILY_MAX,
    }));
  }, [state.today.intake]);

  const stats = useMemo(() => {
    const progressPercentage = calculateGoalPercentage(
      state.today.intake,
      state.settings.dailyTarget
    );
    const goalCompleted = isGoalCompleted(
      state.today.intake,
      state.settings.dailyTarget
    );

    return {
      progress: progressPercentage,
      percentage: Math.round(progressPercentage * 100),
      isGoalCompleted,
      remaining: Math.max(0, state.settings.dailyTarget - state.today.intake),
      intake: state.today.intake,
      target: state.settings.dailyTarget,
      logsCount: todayLogs.length,
      quickAddOptions,
    };
  }, [
    state.today.intake,
    state.settings.dailyTarget,
    todayLogs.length,
    quickAddOptions,
  ]);

  return {
    // State
    state,

    // Computed values from context
    progress: context.progress,
    isTargetReached: context.isTargetReached,
    todayLogsCount: context.todayLogsCount,
    remainingAmount: context.remainingAmount,

    // Notification state
    notificationsEnabled: context.notificationsEnabled,
    notificationPermissionStatus: context.notificationPermissionStatus,
    notificationError: context.notificationError,

    // Computed values from this hook
    todayLogs,
    stats,
    quickAddOptions,

    // Actions
    addQuickAmount,
    addCustomAmount,
    removeTodayLog,
    updateDailyTarget,
    updateReminderSettings: context.updateReminderSettings,
    updateSettings: actions.updateSettings,
    resetDaily: actions.resetDaily,
    clearError: actions.clearError,

    // Notification actions
    initializeNotifications: context.initializeNotifications,
    scheduleReminder: context.scheduleReminder,
    cancelReminders: context.cancelReminders,
    showTestNotification: context.showTestNotification,
    requestNotificationPermissions: context.requestNotificationPermissions,
  };
};

/**
 * Hook for water statistics and analytics
 * @returns {Object} Water statistics
 *
 * @example
 * const { weeklyStats, monthlyStats, currentStreak } = useWaterStats();
 */
export const useWaterStats = () => {
  const state = useWaterState();

  const weeklyStats = useMemo(() => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // Start of week

    const weekHistory = state.history.filter(
      (entry) => new Date(entry.date) >= weekStart
    );

    if (weekHistory.length === 0) {
      return {
        average: 0,
        total: 0,
        daysCompleted: 0,
        daysTotal: 0,
        completionRate: 0,
      };
    }

    const total = weekHistory.reduce(
      (sum, entry) => sum + entry.totalIntake,
      0
    );
    const daysCompleted = weekHistory.filter((entry) => entry.completed).length;

    return {
      average: Math.round(total / weekHistory.length),
      total,
      daysCompleted,
      daysTotal: weekHistory.length,
      completionRate: Math.round((daysCompleted / weekHistory.length) * 100),
    };
  }, [state.history]);

  const monthlyStats = useMemo(() => {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const monthHistory = state.history.filter(
      (entry) => new Date(entry.date) >= monthStart
    );

    if (monthHistory.length === 0) {
      return {
        average: 0,
        total: 0,
        daysCompleted: 0,
        daysTotal: 0,
        completionRate: 0,
      };
    }

    const total = monthHistory.reduce(
      (sum, entry) => sum + entry.totalIntake,
      0
    );
    const daysCompleted = monthHistory.filter(
      (entry) => entry.completed
    ).length;

    return {
      average: Math.round(total / monthHistory.length),
      total,
      daysCompleted,
      daysTotal: monthHistory.length,
      completionRate: Math.round((daysCompleted / monthHistory.length) * 100),
    };
  }, [state.history]);

  const currentStreak = useMemo(() => {
    // Calculate streak using the 80% completion rule
    return calculateStreak(state.history, state.settings.dailyTarget);
  }, [state.history, state.settings.dailyTarget]);

  return {
    weeklyStats,
    monthlyStats,
    currentStreak,
    history: state.history,
  };
};
