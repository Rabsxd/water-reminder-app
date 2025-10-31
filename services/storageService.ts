/**
 * Storage Service
 * Handles all AsyncStorage operations with error handling and data validation
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

import { DATA_RETENTION_DAYS, STORAGE_KEYS } from "../utils/constants";
import { formatDateToYYYYMMDD } from "../utils/dateUtils";
import type {
  HistoryEntry,
  StorageData,
  TodayData,
  UserSettings,
} from "../utils/types";

/**
 * Storage Service Class
 * Provides methods for all data persistence operations
 */
export class StorageService {
  /**
   * Save user settings to AsyncStorage
   * @param {UserSettings} settings - Settings to save
   * @returns {Promise<{ success: boolean; error?: string }>} Operation result
   *
   * @example
   * const result = await StorageService.saveSettings({ dailyTarget: 2500 });
   */
  static async saveSettings(
    settings: UserSettings
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const dataToStore = JSON.stringify(JSON.stringify(settings));
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, dataToStore);
      return { success: true };
    } catch (error) {
      console.error("Failed to save settings:", error);
      return { success: false, error: "Failed to save settings" };
    }
  }

  /**
   * Load user settings from AsyncStorage
   * @returns {Promise<{ success: boolean; data?: UserSettings; error?: string }>} Operation result
   *
   * @example
   * const { data: settings } = await StorageService.loadSettings();
   */
  static async loadSettings(): Promise<{
    success: boolean;
    data?: UserSettings;
    error?: string;
  }> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);

      if (!data) {
        return { success: false, error: "No settings found" };
      }

      const settings = JSON.parse(JSON.parse(data));
      return { success: true, data: settings };
    } catch (error) {
      console.error("Failed to load settings:", error);
      return { success: false, error: "Failed to load settings" };
    }
  }

  /**
   * Save today's data to AsyncStorage
   * @param {TodayData} todayData - Today's data to save
   * @returns {Promise<{ success: boolean; error?: string }>} Operation result
   *
   * @example
   * const result = await StorageService.saveTodayData({
   *   date: '2025-01-15',
   *   intake: 1500,
   *   logs: [...]
   * });
   */
  static async saveTodayData(
    todayData: TodayData
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const dataToStore = JSON.stringify(JSON.stringify(todayData));
      await AsyncStorage.setItem(STORAGE_KEYS.TODAY, dataToStore);
      return { success: true };
    } catch (error) {
      console.error("Failed to save today data:", error);
      return { success: false, error: "Failed to save today data" };
    }
  }

  /**
   * Load today's data from AsyncStorage
   * @returns {Promise<{ success: boolean; data?: TodayData; error?: string }>} Operation result
   *
   * @example
   * const { data: todayData } = await StorageService.loadTodayData();
   */
  static async loadTodayData(): Promise<{
    success: boolean;
    data?: TodayData;
    error?: string;
  }> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.TODAY);

      if (!data) {
        return { success: false, error: "No today data found" };
      }

      const todayData = JSON.parse(JSON.parse(data));
      return { success: true, data: todayData };
    } catch (error) {
      console.error("Failed to load today data:", error);
      return { success: false, error: "Failed to load today data" };
    }
  }

  /**
   * Save history data to AsyncStorage
   * @param {HistoryEntry[]} history - History data to save
   * @returns {Promise<{ success: boolean; error?: string }>} Operation result
   *
   * @example
   * const result = await StorageService.saveHistory(historyData);
   */
  static async saveHistory(
    history: HistoryEntry[]
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Apply 30-day retention policy
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - DATA_RETENTION_DAYS);
      const cutoffDateString = formatDateToYYYYMMDD(cutoffDate);

      const filteredHistory = history.filter(
        (entry) => entry.date >= cutoffDateString
      );
      const dataToStore = JSON.stringify(JSON.stringify(filteredHistory));

      await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, dataToStore);
      return { success: true };
    } catch (error) {
      console.error("Failed to save history:", error);
      return { success: false, error: "Failed to save history" };
    }
  }

  /**
   * Load history data from AsyncStorage
   * @returns {Promise<{ success: boolean; data?: HistoryEntry[]; error?: string }>} Operation result
   *
   * @example
   * const { data: history } = await StorageService.loadHistory();
   */
  static async loadHistory(): Promise<{
    success: boolean;
    data?: HistoryEntry[];
    error?: string;
  }> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY);

      if (!data) {
        return { success: true, data: [] };
      }

      const history = JSON.parse(data);

      if (!Array.isArray(history)) {
        return { success: true, data: [] };
      }

      // Remove duplicate entries (keep the latest one for each date)
      const uniqueHistory = history.reduce((acc: HistoryEntry[], entry) => {
        // Validate entry structure first
        if (!entry || typeof entry !== 'object' || !entry.date) {
          return acc; // Skip invalid entries
        }

        const existingIndex = acc.findIndex(item => item.date === entry.date);
        if (existingIndex === -1) {
          acc.push(entry);
        } else {
          // Keep the entry with higher intake (more recent data)
          if (entry.totalIntake > acc[existingIndex].totalIntake) {
            acc[existingIndex] = entry;
          }
        }
        return acc;
      }, []);

      // Sort by date (newest first)
      uniqueHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      return { success: true, data: uniqueHistory };
    } catch (error) {
      console.error("Failed to load history:", error);
      return { success: false, error: "Failed to load history" };
    }
  }

  /**
   * Add entry to history
   * @param {HistoryEntry} entry - History entry to add
   * @returns {Promise<{ success: boolean; error?: string }>} Operation result
   *
   * @example
   * const result = await StorageService.addHistoryEntry({
   *   date: '2025-01-15',
   *   totalIntake: 2000,
   *   target: 2000,
   *   completed: true
   * });
   */
  static async addHistoryEntry(
    entry: HistoryEntry
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { success, data: history = [] } = await this.loadHistory();

      if (!success) {
        return { success: false, error: "Failed to load existing history" };
      }

      // Remove existing entry for the same date if it exists
      const updatedHistory = history.filter((item) => item.date !== entry.date);
      updatedHistory.push(entry);

      // Sort by date (newest first)
      updatedHistory.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      return await this.saveHistory(updatedHistory);
    } catch (error) {
      console.error("Failed to add history entry:", error);
      return { success: false, error: "Failed to add history entry" };
    }
  }

  /**
   * Save last reminder timestamp
   * @param {string} timestamp - ISO 8601 timestamp
   * @returns {Promise<{ success: boolean; error?: string }>} Operation result
   *
   * @example
   * const result = await StorageService.saveLastReminder(new Date().toISOString());
   */
  static async saveLastReminder(
    timestamp: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_REMINDER, timestamp);
      return { success: true };
    } catch (error) {
      console.error("Failed to save last reminder:", error);
      return { success: false, error: "Failed to save last reminder" };
    }
  }

  /**
   * Load last reminder timestamp
   * @returns {Promise<{ success: boolean; data?: string; error?: string }>} Operation result
   *
   * @example
   * const { data: timestamp } = await StorageService.loadLastReminder();
   */
  static async loadLastReminder(): Promise<{
    success: boolean;
    data?: string;
    error?: string;
  }> {
    try {
      const timestamp = await AsyncStorage.getItem(STORAGE_KEYS.LAST_REMINDER);
      return { success: true, data: timestamp || undefined };
    } catch (error) {
      console.error("Failed to load last reminder:", error);
      return { success: false, error: "Failed to load last reminder" };
    }
  }

  /**
   * Save last check date
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise<{ success: boolean; error?: string }>} Operation result
   *
   * @example
   * const result = await StorageService.saveLastCheckDate('2025-01-15');
   */
  static async saveLastCheckDate(
    date: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_CHECK_DATE, date);
      return { success: true };
    } catch (error) {
      console.error("Failed to save last check date:", error);
      return { success: false, error: "Failed to save last check date" };
    }
  }

  /**
   * Load last check date
   * @returns {Promise<{ success: boolean; data?: string; error?: string }>} Operation result
   *
   * @example
   * const { data: date } = await StorageService.loadLastCheckDate();
   */
  static async loadLastCheckDate(): Promise<{
    success: boolean;
    data?: string;
    error?: string;
  }> {
    try {
      const date = await AsyncStorage.getItem(STORAGE_KEYS.LAST_CHECK_DATE);
      return { success: true, data: date || undefined };
    } catch (error) {
      console.error("Failed to load last check date:", error);
      return { success: false, error: "Failed to load last check date" };
    }
  }

  /**
   * Load all storage data at once
   * @returns {Promise<{ success: boolean; data?: StorageData; error?: string }>} Operation result
   *
   * @example
   * const { data: allData } = await StorageService.loadAllData();
   */
  static async loadAllData(): Promise<{
    success: boolean;
    data?: StorageData;
    error?: string;
  }> {
    try {
      const [
        settingsResult,
        todayResult,
        historyResult,
        lastReminderResult,
        lastCheckDateResult,
      ] = await Promise.allSettled([
        this.loadSettings(),
        this.loadTodayData(),
        this.loadHistory(),
        this.loadLastReminder(),
        this.loadLastCheckDate(),
      ]);

      const data: StorageData = {};

      if (
        settingsResult.status === "fulfilled" &&
        settingsResult.value.success
      ) {
        data.settings = settingsResult.value.data;
      }

      if (todayResult.status === "fulfilled" && todayResult.value.success) {
        data.today = todayResult.value.data;
      }

      if (historyResult.status === "fulfilled" && historyResult.value.success) {
        data.history = historyResult.value.data;
      }

      if (
        lastReminderResult.status === "fulfilled" &&
        lastReminderResult.value.success
      ) {
        data.lastReminder = lastReminderResult.value.data;
      }

      if (
        lastCheckDateResult.status === "fulfilled" &&
        lastCheckDateResult.value.success
      ) {
        data.lastCheckDate = lastCheckDateResult.value.data;
      }

      return { success: true, data };
    } catch (error) {
      console.error("Failed to load all data:", error);
      return { success: false, error: "Failed to load all data" };
    }
  }

  /**
   * Clear all storage data (for reset functionality)
   * @returns {Promise<{ success: boolean; error?: string }>} Operation result
   *
   * @example
   * const result = await StorageService.clearAllData();
   */
  static async clearAllData(): Promise<{ success: boolean; error?: string }> {
    try {
      const keys = [
        STORAGE_KEYS.SETTINGS,
        STORAGE_KEYS.TODAY,
        STORAGE_KEYS.HISTORY,
        STORAGE_KEYS.LAST_REMINDER,
        STORAGE_KEYS.LAST_CHECK_DATE,
      ];

      await AsyncStorage.multiRemove(keys);
      return { success: true };
    } catch (error) {
      console.error("Failed to clear all data:", error);
      return { success: false, error: "Failed to clear all data" };
    }
  }

  /**
   * Get storage usage statistics
   * @returns {Promise<{ success: boolean; data?: { totalKeys: number; estimatedSize: string }; error?: string }>} Storage stats
   *
   * @example
   * const { data: stats } = await StorageService.getStorageStats();
   */
  static async getStorageStats(): Promise<{
    success: boolean;
    data?: { totalKeys: number; estimatedSize: string };
    error?: string;
  }> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter((key) =>
        Object.values(STORAGE_KEYS).includes(key as any)
      );

      let totalSize = 0;
      for (const key of appKeys) {
        const data = await AsyncStorage.getItem(key);
        if (data) {
          totalSize += data.length;
        }
      }

      const formatBytes = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
      };

      return {
        success: true,
        data: {
          totalKeys: appKeys.length,
          estimatedSize: formatBytes(totalSize),
        },
      };
    } catch (error) {
      console.error("Failed to get storage stats:", error);
      return { success: false, error: "Failed to get storage statistics" };
    }
  }

  /**
   * Validate and repair storage data
   * @returns {Promise<{ success: boolean; repaired: number; errors: string[] }>} Repair results
   *
   * @example
   * const { success, repaired, errors } = await StorageService.validateAndRepair();
   */
  static async validateAndRepair(): Promise<{
    success: boolean;
    repaired: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let repaired = 0;

    try {
      // Validate settings
      const settingsResult = await this.loadSettings();
      if (settingsResult.success && settingsResult.data) {
        const settings = settingsResult.data;
        if (
          typeof settings.dailyTarget !== "number" ||
          settings.dailyTarget < 1000 ||
          settings.dailyTarget > 4000
        ) {
          errors.push("Invalid daily target in settings");
          // Repair would go here
        }
      }

      // Validate today data
      const todayResult = await this.loadTodayData();
      if (todayResult.success && todayResult.data) {
        const today = todayResult.data;
        if (
          !today.date ||
          typeof today.intake !== "number" ||
          !Array.isArray(today.logs)
        ) {
          errors.push("Invalid today data structure");
          // Repair would go here
        }
      }

      // Validate history
      const historyResult = await this.loadHistory();
      if (historyResult.success && historyResult.data) {
        const history = historyResult.data;
        for (const entry of history) {
          if (
            !entry.date ||
            typeof entry.totalIntake !== "number" ||
            typeof entry.target !== "number"
          ) {
            errors.push(
              `Invalid history entry for date: ${entry.date || "unknown"}`
            );
            // Remove invalid entry
            const validHistory = history.filter((h) => h !== entry);
            await this.saveHistory(validHistory);
            repaired++;
          }
        }
      }

      return { success: true, repaired, errors };
    } catch (error) {
      console.error("Failed to validate storage:", error);
      return {
        success: false,
        repaired,
        errors: ["Validation failed due to error"],
      };
    }
  }
}
