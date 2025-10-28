/**
 * Custom hook for storage operations
 * Provides convenient functions for data persistence with loading states and error handling
 */

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { StorageService } from '../services/storageService';
import { DataCleanupService } from '../services/dataCleanupService';
import { STORAGE_KEYS } from '../utils/constants';
import type { UserSettings, TodayData, HistoryEntry } from '../utils/types';

/**
 * Storage operation result interface
 * @interface StorageOperationResult
 */
interface StorageOperationResult<T = any> {
  data?: T;
  loading: boolean;
  error?: string;
  success: boolean;
}

/**
 * Hook return type
 * @interface UseStorageReturn
 */
interface UseStorageReturn {
  // Settings operations
  loadSettings: () => Promise<StorageOperationResult<UserSettings>>;
  saveSettings: (settings: UserSettings) => Promise<StorageOperationResult<void>>;

  // Today data operations
  loadTodayData: () => Promise<StorageOperationResult<TodayData>>;
  saveTodayData: (todayData: TodayData) => Promise<StorageOperationResult<void>>;

  // History operations
  loadHistory: () => Promise<StorageOperationResult<HistoryEntry[]>>;
  saveHistory: (history: HistoryEntry[]) => Promise<StorageOperationResult<void>>;
  addToHistory: (entry: HistoryEntry) => Promise<StorageOperationResult<void>>;

  // Utility operations
  clearAllData: () => Promise<StorageOperationResult<void>>;
  getStorageStats: () => Promise<StorageOperationResult<{ totalKeys: number; estimatedSize: string }>>;

  // Cleanup operations
  performCleanup: () => Promise<StorageOperationResult<{ tasksCompleted: string[]; errors: string[] }>>;
  getCleanupStats: () => Promise<StorageOperationResult<any>>;

  // Global loading state
  isStorageLoading: boolean;
  lastError: string | null;
  clearError: () => void;
}

/**
 * Custom hook for storage operations
 * @returns {UseStorageReturn} Storage operations and state
 *
 * @example
 * const {
 *   loadSettings,
 *   saveSettings,
 *   isStorageLoading,
 *   lastError,
 *   clearError
 * } = useStorage();
 *
 * // Load settings
 * const { data: settings } = await loadSettings();
 *
 * // Save settings
 * const result = await saveSettings({ dailyTarget: 2500 });
 */
export const useStorage = (): UseStorageReturn => {
  const [isStorageLoading, setIsStorageLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  /**
   * Clear the last error
   */
  const clearError = useCallback((): void => {
    setLastError(null);
  }, []);

  /**
   * Set loading state and handle errors
   * @param {boolean} loading - Loading state
   * @param {string} [error] - Error message
   */
  const setLoadingAndError = useCallback((loading: boolean, error?: string): void => {
    setIsStorageLoading(loading);
    if (error) {
      setLastError(error);
    }
  }, []);

  /**
   * Load user settings with loading state
   * @returns {Promise<StorageOperationResult<UserSettings>>} Operation result
   */
  const loadSettings = useCallback(async (): Promise<StorageOperationResult<UserSettings>> => {
    setLoadingAndError(true);
    clearError();

    try {
      const result = await StorageService.loadSettings();

      if (result.success && result.data) {
        return {
          data: result.data,
          loading: false,
          success: true,
        };
      } else {
        const error = result.error || 'Failed to load settings';
        setLastError(error);
        return {
          loading: false,
          success: false,
          error,
        };
      }
    } catch (error) {
      const errorMessage = 'Unexpected error loading settings';
      setLastError(errorMessage);
      return {
        loading: false,
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoadingAndError(false);
    }
  }, [setLoadingAndError, clearError]);

  /**
   * Save user settings with loading state
   * @param {UserSettings} settings - Settings to save
   * @returns {Promise<StorageOperationResult<void>>} Operation result
   */
  const saveSettings = useCallback(async (settings: UserSettings): Promise<StorageOperationResult<void>> => {
    setLoadingAndError(true);
    clearError();

    try {
      const result = await StorageService.saveSettings(settings);

      if (result.success) {
        return {
          loading: false,
          success: true,
        };
      } else {
        const error = result.error || 'Failed to save settings';
        setLastError(error);
        return {
          loading: false,
          success: false,
          error,
        };
      }
    } catch (error) {
      const errorMessage = 'Unexpected error saving settings';
      setLastError(errorMessage);
      return {
        loading: false,
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoadingAndError(false);
    }
  }, [setLoadingAndError, clearError]);

  /**
   * Load today's data with loading state
   * @returns {Promise<StorageOperationResult<TodayData>>} Operation result
   */
  const loadTodayData = useCallback(async (): Promise<StorageOperationResult<TodayData>> => {
    setLoadingAndError(true);
    clearError();

    try {
      const result = await StorageService.loadTodayData();

      if (result.success && result.data) {
        return {
          data: result.data,
          loading: false,
          success: true,
        };
      } else {
        const error = result.error || 'Failed to load today data';
        setLastError(error);
        return {
          loading: false,
          success: false,
          error,
        };
      }
    } catch (error) {
      const errorMessage = 'Unexpected error loading today data';
      setLastError(errorMessage);
      return {
        loading: false,
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoadingAndError(false);
    }
  }, [setLoadingAndError, clearError]);

  /**
   * Save today's data with loading state
   * @param {TodayData} todayData - Today's data to save
   * @returns {Promise<StorageOperationResult<void>>} Operation result
   */
  const saveTodayData = useCallback(async (todayData: TodayData): Promise<StorageOperationResult<void>> => {
    setLoadingAndError(true);
    clearError();

    try {
      const result = await StorageService.saveTodayData(todayData);

      if (result.success) {
        return {
          loading: false,
          success: true,
        };
      } else {
        const error = result.error || 'Failed to save today data';
        setLastError(error);
        return {
          loading: false,
          success: false,
          error,
        };
      }
    } catch (error) {
      const errorMessage = 'Unexpected error saving today data';
      setLastError(errorMessage);
      return {
        loading: false,
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoadingAndError(false);
    }
  }, [setLoadingAndError, clearError]);

  /**
   * Load history data with loading state
   * @returns {Promise<StorageOperationResult<HistoryEntry[]>>} Operation result
   */
  const loadHistory = useCallback(async (): Promise<StorageOperationResult<HistoryEntry[]>> => {
    setLoadingAndError(true);
    clearError();

    try {
      const result = await StorageService.loadHistory();

      if (result.success) {
        return {
          data: result.data || [],
          loading: false,
          success: true,
        };
      } else {
        const error = result.error || 'Failed to load history';
        setLastError(error);
        return {
          loading: false,
          success: false,
          error,
        };
      }
    } catch (error) {
      const errorMessage = 'Unexpected error loading history';
      setLastError(errorMessage);
      return {
        loading: false,
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoadingAndError(false);
    }
  }, [setLoadingAndError, clearError]);

  /**
   * Save history data with loading state
   * @param {HistoryEntry[]} history - History data to save
   * @returns {Promise<StorageOperationResult<void>>} Operation result
   */
  const saveHistory = useCallback(async (history: HistoryEntry[]): Promise<StorageOperationResult<void>> => {
    setLoadingAndError(true);
    clearError();

    try {
      const result = await StorageService.saveHistory(history);

      if (result.success) {
        return {
          loading: false,
          success: true,
        };
      } else {
        const error = result.error || 'Failed to save history';
        setLastError(error);
        return {
          loading: false,
          success: false,
          error,
        };
      }
    } catch (error) {
      const errorMessage = 'Unexpected error saving history';
      setLastError(errorMessage);
      return {
        loading: false,
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoadingAndError(false);
    }
  }, [setLoadingAndError, clearError]);

  /**
   * Add entry to history with loading state
   * @param {HistoryEntry} entry - History entry to add
   * @returns {Promise<StorageOperationResult<void>>} Operation result
   */
  const addToHistory = useCallback(async (entry: HistoryEntry): Promise<StorageOperationResult<void>> => {
    setLoadingAndError(true);
    clearError();

    try {
      const result = await StorageService.addHistoryEntry(entry);

      if (result.success) {
        return {
          loading: false,
          success: true,
        };
      } else {
        const error = result.error || 'Failed to add to history';
        setLastError(error);
        return {
          loading: false,
          success: false,
          error,
        };
      }
    } catch (error) {
      const errorMessage = 'Unexpected error adding to history';
      setLastError(errorMessage);
      return {
        loading: false,
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoadingAndError(false);
    }
  }, [setLoadingAndError, clearError]);

  /**
   * Clear all storage data with loading state
   * @returns {Promise<StorageOperationResult<void>>} Operation result
   */
  const clearAllData = useCallback(async (): Promise<StorageOperationResult<void>> => {
    setLoadingAndError(true);
    clearError();

    try {
      const result = await StorageService.clearAllData();

      if (result.success) {
        return {
          loading: false,
          success: true,
        };
      } else {
        const error = result.error || 'Failed to clear data';
        setLastError(error);
        return {
          loading: false,
          success: false,
          error,
        };
      }
    } catch (error) {
      const errorMessage = 'Unexpected error clearing data';
      setLastError(errorMessage);
      return {
        loading: false,
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoadingAndError(false);
    }
  }, [setLoadingAndError, clearError]);

  /**
   * Get storage statistics with loading state
   * @returns {Promise<StorageOperationResult<{ totalKeys: number; estimatedSize: string }>>} Operation result
   */
  const getStorageStats = useCallback(async (): Promise<StorageOperationResult<{ totalKeys: number; estimatedSize: string }>> => {
    setLoadingAndError(true);
    clearError();

    try {
      const result = await StorageService.getStorageStats();

      if (result.success && result.data) {
        return {
          data: result.data,
          loading: false,
          success: true,
        };
      } else {
        const error = result.error || 'Failed to get storage stats';
        setLastError(error);
        return {
          loading: false,
          success: false,
          error,
        };
      }
    } catch (error) {
      const errorMessage = 'Unexpected error getting storage stats';
      setLastError(errorMessage);
      return {
        loading: false,
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoadingAndError(false);
    }
  }, [setLoadingAndError, clearError]);

  /**
   * Perform cleanup operations with loading state
   * @returns {Promise<StorageOperationResult<{ tasksCompleted: string[]; errors: string[] }>>} Operation result
   */
  const performCleanup = useCallback(async (): Promise<StorageOperationResult<{ tasksCompleted: string[]; errors: string[] }>> => {
    setLoadingAndError(true);
    clearError();

    try {
      const result = await DataCleanupService.performDailyCleanup();

      if (result.success) {
        return {
          data: {
            tasksCompleted: result.tasksCompleted,
            errors: result.errors,
          },
          loading: false,
          success: true,
        };
      } else {
        const error = 'Cleanup operations failed';
        setLastError(error);
        return {
          data: {
            tasksCompleted: result.tasksCompleted,
            errors: result.errors,
          },
          loading: false,
          success: false,
          error,
        };
      }
    } catch (error) {
      const errorMessage = 'Unexpected error during cleanup';
      setLastError(errorMessage);
      return {
        loading: false,
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoadingAndError(false);
    }
  }, [setLoadingAndError, clearError]);

  /**
   * Get cleanup statistics with loading state
   * @returns {Promise<StorageOperationResult<any>>} Operation result
   */
  const getCleanupStats = useCallback(async (): Promise<StorageOperationResult<any>> => {
    setLoadingAndError(true);
    clearError();

    try {
      const result = await DataCleanupService.getCleanupStats();

      if (result.success && result.stats) {
        return {
          data: result.stats,
          loading: false,
          success: true,
        };
      } else {
        const error = result.error || 'Failed to get cleanup stats';
        setLastError(error);
        return {
          loading: false,
          success: false,
          error,
        };
      }
    } catch (error) {
      const errorMessage = 'Unexpected error getting cleanup stats';
      setLastError(errorMessage);
      return {
        loading: false,
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoadingAndError(false);
    }
  }, [setLoadingAndError, clearError]);

  return {
    // Settings operations
    loadSettings,
    saveSettings,

    // Today data operations
    loadTodayData,
    saveTodayData,

    // History operations
    loadHistory,
    saveHistory,
    addToHistory,

    // Utility operations
    clearAllData,
    getStorageStats,

    // Cleanup operations
    performCleanup,
    getCleanupStats,

    // Global state
    isStorageLoading,
    lastError,
    clearError,
  };
};

/**
 * Hook for automatic cleanup on mount
 * @returns {void}
 *
 * @example
 * useAutoCleanup(); // Automatically performs cleanup on component mount
 */
export const useAutoCleanup = (): void => {
  const { performCleanup } = useStorage();

  useEffect(() => {
    // Perform cleanup on mount
    performCleanup().catch(console.error);
  }, [performCleanup]);
};

/**
 * Hook for storage initialization
 * @returns {boolean} Whether storage is initialized
 *
 * @example
 * const isInitialized = useStorageInitialization();
 * if (!isInitialized) {
 *   return <LoadingSpinner />;
 * }
 */
export const useStorageInitialization = (): boolean => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { loadSettings, loadTodayData, loadHistory } = useStorage();

  useEffect(() => {
    const initializeStorage = async () => {
      try {
        // Load initial data
        await Promise.all([
          loadSettings(),
          loadTodayData(),
          loadHistory(),
        ]);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize storage:', error);
        setIsInitialized(true); // Still mark as initialized to prevent infinite loading
      }
    };

    initializeStorage();
  }, [loadSettings, loadTodayData, loadHistory]);

  return isInitialized;
};