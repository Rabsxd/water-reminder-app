/**
 * Water Context Provider
 * Provides global state management for the Water Reminder app
 */

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { waterReducer, createInitialState } from './waterReducer';
import { STORAGE_KEYS } from '../utils/constants';
import { calculateStreak, calculateWeeklyAverage, isToday, formatDateToYYYYMMDD, isNewDay } from '../utils/dateUtils';
import type { WaterState, WaterAction, UserSettings, TodayData, HistoryEntry } from '../utils/types';

/**
 * Water context interface
 * @interface WaterContextType
 */
export interface WaterContextType {
  // State
  state: WaterState;

  // Actions
  addDrink: (amount: number) => Promise<void>;
  removeDrink: (drinkId: string) => Promise<void>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  resetDaily: () => Promise<void>;
  clearError: () => void;

  // Computed values
  progress: number; // 0-1
  isTargetReached: boolean;
  todayLogsCount: number;
  remainingAmount: number;
}

/**
 * Create water context
 */
const WaterContext = createContext<WaterContextType | undefined>(undefined);

/**
 * Water context provider component props
 * @interface WaterProviderProps
 */
interface WaterProviderProps {
  children: ReactNode;
}

/**
 * Water context provider component
 * @param {WaterProviderProps} props - Component props
 * @returns {JSX.Element} Provider component
 *
 * @example
 * <WaterProvider>
 *   <App />
 * </WaterProvider>
 */
export const WaterProvider: React.FC<WaterProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(waterReducer, createInitialState());

  /**
   * Load data from AsyncStorage on mount
   */
  useEffect(() => {
    loadData();
  }, []);

  /**
   * Save data to AsyncStorage whenever state changes
   */
  useEffect(() => {
    if (!state.isLoading) {
      saveData();
    }
  }, [state.settings, state.today, state.history]);

  /**
   * Check for daily reset
   */
  useEffect(() => {
    checkDailyReset();
  }, [state.today.date]);

  /**
   * Load all data from AsyncStorage
   * @returns {Promise<void>}
   */
  const loadData = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const [
        settingsData,
        todayData,
        historyData,
      ] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.SETTINGS),
        AsyncStorage.getItem(STORAGE_KEYS.TODAY),
        AsyncStorage.getItem(STORAGE_KEYS.HISTORY),
      ]);

      let settings: UserSettings | undefined;
      let today: TodayData | undefined;
      let history: HistoryEntry[] = [];

      // Parse and validate settings
      if (settingsData) {
        try {
          const parsed = JSON.parse(settingsData);
          settings = JSON.parse(parsed);
        } catch (error) {
          console.warn('Failed to parse settings:', error);
        }
      }

      // Parse and validate today data
      if (todayData) {
        try {
          const parsed = JSON.parse(todayData);
          today = JSON.parse(parsed);
        } catch (error) {
          console.warn('Failed to parse today data:', error);
        }
      }

      // Parse and validate history data
      if (historyData) {
        try {
          const parsed = JSON.parse(historyData);
          history = JSON.parse(parsed);
        } catch (error) {
          console.warn('Failed to parse history data:', error);
        }
      }

      dispatch({
        type: 'LOAD_DATA',
        payload: {
          settings: settings || createInitialState().settings,
          today: today || createInitialState().today,
          history: history || [],
        },
      });

    } catch (error) {
      console.error('Failed to load data:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: 'Failed to load saved data. Starting with default settings.',
      });
    }
  };

  /**
   * Save data to AsyncStorage
   * @returns {Promise<void>}
   */
  const saveData = async (): Promise<void> => {
    try {
      // Save settings
      await AsyncStorage.setItem(
        STORAGE_KEYS.SETTINGS,
        JSON.stringify(JSON.stringify(state.settings))
      );

      // Save today data
      await AsyncStorage.setItem(
        STORAGE_KEYS.TODAY,
        JSON.stringify(JSON.stringify(state.today))
      );

      // Save history (only keep last 30 days)
      const filteredHistory = state.history.slice(-30);
      await AsyncStorage.setItem(
        STORAGE_KEYS.HISTORY,
        JSON.stringify(JSON.stringify(filteredHistory))
      );

      // Save last check date
      await AsyncStorage.setItem(
        STORAGE_KEYS.LAST_CHECK_DATE,
        formatDateToYYYYMMDD(new Date())
      );

    } catch (error) {
      console.error('Failed to save data:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: 'Failed to save data. Changes may not persist.',
      });
    }
  };

  /**
   * Check if daily reset is needed
   * @returns {Promise<void>}
   */
  const checkDailyReset = async (): Promise<void> => {
    try {
      const lastCheckDate = await AsyncStorage.getItem(STORAGE_KEYS.LAST_CHECK_DATE);
      const today = formatDateToYYYYMMDD(new Date());

      if (lastCheckDate && isNewDay(lastCheckDate)) {
        await handleDailyReset();
      }
    } catch (error) {
      console.error('Failed to check daily reset:', error);
    }
  };

  /**
   * Handle daily reset logic
   * @returns {Promise<void>}
   */
  const handleDailyReset = async (): Promise<void> => {
    // Move today's data to history if it has any intake
    if (state.today.intake > 0) {
      const historyEntry: HistoryEntry = {
        date: state.today.date,
        totalIntake: state.today.intake,
        target: state.settings.dailyTarget,
        completed: state.today.intake >= state.settings.dailyTarget * 0.8, // 80% threshold
      };

      dispatch({ type: 'LOAD_DATA', payload: {
        settings: state.settings,
        today: state.today,
        history: [...state.history, historyEntry]
      }});
    }

    // Reset today's data
    dispatch({ type: 'RESET_DAILY' });
  };

  /**
   * Add water intake
   * @param {number} amount - Amount in milliliters to add
   * @returns {Promise<void>}
   *
   * @example
   * await addDrink(250); // Adds 250ml
   */
  const addDrink = async (amount: number): Promise<void> => {
    try {
      if (amount <= 0) {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Amount must be greater than 0',
        });
        return;
      }

      const timestamp = new Date().toISOString();

      dispatch({
        type: 'ADD_DRINK',
        payload: { amount, timestamp },
      });

    } catch (error) {
      console.error('Failed to add drink:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: 'Failed to add water intake. Please try again.',
      });
    }
  };

  /**
   * Remove water log entry
   * @param {string} drinkId - ID of the drink to remove
   * @returns {Promise<void>}
   *
   * @example
   * await removeDrink('drink-123');
   */
  const removeDrink = async (drinkId: string): Promise<void> => {
    try {
      dispatch({
        type: 'REMOVE_DRINK',
        payload: drinkId,
      });
    } catch (error) {
      console.error('Failed to remove drink:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: 'Failed to remove water intake. Please try again.',
      });
    }
  };

  /**
   * Update user settings
   * @param {Partial<UserSettings>} newSettings - Settings to update
   * @returns {Promise<void>}
   *
   * @example
   * await updateSettings({ dailyTarget: 2500 });
   */
  const updateSettings = async (newSettings: Partial<UserSettings>): Promise<void> => {
    try {
      dispatch({
        type: 'UPDATE_SETTINGS',
        payload: newSettings,
      });
    } catch (error) {
      console.error('Failed to update settings:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: 'Failed to update settings. Please try again.',
      });
    }
  };

  /**
   * Reset daily data (for testing or manual reset)
   * @returns {Promise<void>}
   */
  const resetDaily = async (): Promise<void> => {
    try {
      await handleDailyReset();
    } catch (error) {
      console.error('Failed to reset daily data:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: 'Failed to reset daily data. Please try again.',
      });
    }
  };

  /**
   * Clear current error
   */
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Computed values
  const progress = state.settings.dailyTarget > 0
    ? Math.min(state.today.intake / state.settings.dailyTarget, 1)
    : 0;

  const isTargetReached = progress >= 1;
  const todayLogsCount = state.today.logs.length;
  const remainingAmount = Math.max(0, state.settings.dailyTarget - state.today.intake);

  // Update computed values (streak and weekly average)
  useEffect(() => {
    const streak = calculateStreak(state.history, state.settings.dailyTarget);
    const weeklyAverage = calculateWeeklyAverage(state.history, 7);

    // Note: In a real implementation, you might want to store these in state
    // For now, they're computed here and could be accessed through the context
  }, [state.history, state.settings.dailyTarget]);

  const contextValue: WaterContextType = {
    state,
    addDrink,
    removeDrink,
    updateSettings,
    resetDaily,
    clearError,
    progress,
    isTargetReached,
    todayLogsCount,
    remainingAmount,
  };

  return (
    <WaterContext.Provider value={contextValue}>
      {children}
    </WaterContext.Provider>
  );
};

/**
 * Hook to use water context
 * @returns {WaterContextType} Water context value
 * @throws {Error} If used outside of WaterProvider
 *
 * @example
 * const { state, addDrink, progress } = useWaterContext();
 */
export const useWaterContext = (): WaterContextType => {
  const context = useContext(WaterContext);
  if (context === undefined) {
    throw new Error('useWaterContext must be used within a WaterProvider');
  }
  return context;
};

/**
 * Hook to get water state only
 * @returns {WaterState} Current water state
 *
 * @example
 * const { settings, today } = useWaterState();
 */
export const useWaterState = (): WaterState => {
  const { state } = useWaterContext();
  return state;
};

/**
 * Hook to get water actions only
 * @returns {Object} Water actions
 *
 * @example
 * const { addDrink, updateSettings } = useWaterActions();
 */
export const useWaterActions = () => {
  const { addDrink, removeDrink, updateSettings, resetDaily, clearError } = useWaterContext();
  return { addDrink, removeDrink, updateSettings, resetDaily, clearError };
};