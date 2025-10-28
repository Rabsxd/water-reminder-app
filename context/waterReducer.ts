/**
 * Water Context Reducer
 * Handles all state management logic for the Water Reminder app
 */

import { DAILY_TARGET_DEFAULT, WAKE_HOURS_DEFAULT, REMINDER_INTERVAL_DEFAULT } from '../utils/constants';
import type { WaterState, WaterAction, UserSettings, TodayData, HistoryEntry, WaterLogEntry } from '../utils/types';

/**
 * Creates initial state for the water context
 * @returns {WaterState} Initial state object
 */
export const createInitialState = (): WaterState => ({
  // User preferences with defaults
  settings: {
    dailyTarget: DAILY_TARGET_DEFAULT,
    reminderInterval: REMINDER_INTERVAL_DEFAULT,
    reminderEnabled: true,
    soundEnabled: true,
    vibrationEnabled: true,
    wakeHours: {
      start: WAKE_HOURS_DEFAULT.START,
      end: WAKE_HOURS_DEFAULT.END,
    },
  },

  // Current day data
  today: {
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    intake: 0,
    logs: [],
  },

  // Historical data (empty initially)
  history: [],

  // Computed values (will be calculated in context)
  streak: 0,
  weeklyAverage: 0,

  // UI state
  isLoading: false,
  error: null,
});

/**
 * Water reducer function that handles state updates
 * @param {WaterState} state - Current state
 * @param {WaterAction} action - Action to dispatch
 * @returns {WaterState} New state
 *
 * @example
 * const newState = waterReducer(currentState, { type: 'ADD_DRINK', payload: { amount: 250, timestamp: '2025-01-15T10:30:00.000Z' } });
 */
export const waterReducer = (state: WaterState, action: WaterAction): WaterState => {
  switch (action.type) {
    case 'ADD_DRINK': {
      const { amount, timestamp } = action.payload;

      // Create new log entry
      const newLog = {
        id: generateLogId(),
        timestamp,
        amount,
      };

      // Update today's data
      const newIntake = state.today.intake + amount;
      const newLogs = [...state.today.logs, newLog];

      return {
        ...state,
        today: {
          ...state.today,
          intake: newIntake,
          logs: newLogs,
        },
        error: null,
      };
    }

    case 'REMOVE_DRINK': {
      const drinkId = action.payload;

      // Find and remove the log entry
      const logToRemove = state.today.logs.find(log => log.id === drinkId);
      if (!logToRemove) {
        return state; // Log not found, return state unchanged
      }

      // Calculate new total
      const newIntake = state.today.intake - logToRemove.amount;
      const newLogs = state.today.logs.filter(log => log.id !== drinkId);

      return {
        ...state,
        today: {
          ...state.today,
          intake: Math.max(0, newIntake), // Ensure non-negative
          logs: newLogs,
        },
        error: null,
      };
    }

    case 'UPDATE_TODAY_INTAKE': {
      const { payload: newIntake } = action;

      return {
        ...state,
        today: {
          ...state.today,
          intake: Math.max(0, newIntake), // Ensure non-negative
        },
        error: null,
      };
    }

    case 'RESET_DAILY': {
      const today = new Date().toISOString().split('T')[0];

      return {
        ...state,
        today: {
          date: today,
          intake: 0,
          logs: [],
        },
        error: null,
      };
    }

    case 'UPDATE_SETTINGS': {
      const { payload: newSettings } = action;

      return {
        ...state,
        settings: {
          ...state.settings,
          ...newSettings,
        },
        error: null,
      };
    }

    case 'LOAD_DATA': {
      const { payload } = action;
      const { settings, today, history } = payload;

      return {
        ...state,
        settings: {
          ...state.settings,
          ...settings,
        },
        today: today || state.today,
        history: history || [],
        isLoading: false,
        error: null,
      };
    }

    case 'SET_LOADING': {
      const { payload: isLoading } = action;

      return {
        ...state,
        isLoading,
      };
    }

    case 'SET_ERROR': {
      const { payload: error } = action;

      return {
        ...state,
        error,
        isLoading: false,
      };
    }

    case 'CLEAR_ERROR': {
      return {
        ...state,
        error: null,
      };
    }

    default:
      // TypeScript ensures we handle all action types
      const _exhaustiveCheck: never = action;
      return state;
  }
};

/**
 * Generates a unique ID for water log entries
 * @returns {string} Unique ID using timestamp and random number
 * @private
 */
const generateLogId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Validates and sanitizes water log data
 * @param {any} data - Raw data to validate
 * @returns {WaterLogEntry | null} Validated log entry or null if invalid
 * @private
 */
export const validateLogEntry = (data: any): WaterLogEntry | null => {
  if (
    !data ||
    typeof data.id !== 'string' ||
    typeof data.timestamp !== 'string' ||
    typeof data.amount !== 'number' ||
    data.amount <= 0
  ) {
    return null;
  }

  try {
    // Validate timestamp format
    new Date(data.timestamp);
  } catch {
    return null;
  }

  return {
    id: data.id,
    timestamp: data.timestamp,
    amount: data.amount,
  };
};

/**
 * Validates and sanitizes user settings
 * @param {any} data - Raw settings data to validate
 * @returns {UserSettings | null} Validated settings or null if invalid
 * @private
 */
export const validateUserSettings = (data: any): UserSettings | null => {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const {
    dailyTarget = DAILY_TARGET_DEFAULT,
    reminderInterval = REMINDER_INTERVAL_DEFAULT,
    reminderEnabled = true,
    soundEnabled = true,
    vibrationEnabled = true,
    wakeHours = WAKE_HOURS_DEFAULT,
  } = data;

  // Basic validation
  if (
    typeof dailyTarget !== 'number' ||
    typeof reminderInterval !== 'number' ||
    typeof reminderEnabled !== 'boolean' ||
    typeof soundEnabled !== 'boolean' ||
    typeof vibrationEnabled !== 'boolean' ||
    !wakeHours ||
    typeof wakeHours.start !== 'number' ||
    typeof wakeHours.end !== 'number'
  ) {
    return null;
  }

  return {
    dailyTarget: Math.max(DAILY_TARGET_DEFAULT, Math.min(4000, dailyTarget)),
    reminderInterval: Math.max(15, Math.min(240, reminderInterval)),
    reminderEnabled,
    soundEnabled,
    vibrationEnabled,
    wakeHours: {
      start: Math.max(0, Math.min(23, wakeHours.start)),
      end: Math.max(1, Math.min(24, wakeHours.end)),
    },
  };
};

/**
 * Validates and sanitizes today's data
 * @param {any} data - Raw today data to validate
 * @returns {TodayData | null} Validated today data or null if invalid
 * @private
 */
export const validateTodayData = (data: any): TodayData | null => {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const { date, intake = 0, logs = [] } = data;

  if (
    typeof date !== 'string' ||
    typeof intake !== 'number' ||
    !Array.isArray(logs)
  ) {
    return null;
  }

  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return null;
  }

  // Validate logs array
  const validLogs = logs
    .map(validateLogEntry)
    .filter((log): log is WaterLogEntry => log !== null);

  return {
    date,
    intake: Math.max(0, intake),
    logs: validLogs,
  };
};

/**
 * Validates and sanitizes history data
 * @param {any} data - Raw history data to validate
 * @returns {HistoryEntry[] | null} Validated history array or null if invalid
 * @private
 */
export const validateHistoryData = (data: any): HistoryEntry[] | null => {
  if (!Array.isArray(data)) {
    return null;
  }

  const validEntries: HistoryEntry[] = [];

  for (const entry of data) {
    if (
      !entry ||
      typeof entry !== 'object' ||
      typeof entry.date !== 'string' ||
      typeof entry.totalIntake !== 'number' ||
      typeof entry.target !== 'number' ||
      typeof entry.completed !== 'boolean'
    ) {
      continue; // Skip invalid entries
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(entry.date)) {
      continue;
    }

    validEntries.push({
      date: entry.date,
      totalIntake: Math.max(0, entry.totalIntake),
      target: Math.max(0, entry.target),
      completed: entry.completed,
    });
  }

  return validEntries;
};