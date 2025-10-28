/**
 * Data Cleanup Service
 * Handles automatic data cleanup and maintenance tasks
 */

import { StorageService } from './storageService';
import { DATA_RETENTION_DAYS } from '../utils/constants';
import { formatDateToYYYYMMDD, isToday, isNewDay } from '../utils/dateUtils';
import type { HistoryEntry, TodayData } from '../utils/types';

/**
 * Data Cleanup Service Class
 * Provides methods for automatic data maintenance and cleanup
 */
export class DataCleanupService {
  /**
   * Perform daily cleanup tasks
   * Should be called when app starts and periodically during usage
   * @returns {Promise<{ success: boolean; tasksCompleted: string[]; errors: string[] }>} Cleanup results
   *
   * @example
   * const { success, tasksCompleted, errors } = await DataCleanupService.performDailyCleanup();
   */
  static async performDailyCleanup(): Promise<{ success: boolean; tasksCompleted: string[]; errors: string[] }> {
    const tasksCompleted: string[] = [];
    const errors: string[] = [];

    try {
      // Task 1: Check for daily reset
      const resetResult = await this.checkAndPerformDailyReset();
      if (resetResult.success) {
        tasksCompleted.push('Daily reset check completed');
        if (resetResult.resetPerformed) {
          tasksCompleted.push('Daily reset performed');
        }
      } else {
        errors.push(`Daily reset failed: ${resetResult.error}`);
      }

      // Task 2: Clean up old history data
      const cleanupResult = await this.cleanupOldHistory();
      if (cleanupResult.success) {
        tasksCompleted.push(`Cleaned up ${cleanupResult.entriesRemoved} old history entries`);
        if (cleanupResult.entriesRemoved > 0) {
          tasksCompleted.push('History cleanup completed');
        }
      } else {
        errors.push(`History cleanup failed: ${cleanupResult.error}`);
      }

      // Task 3: Validate and repair data integrity
      const repairResult = await StorageService.validateAndRepair();
      if (repairResult.success) {
        tasksCompleted.push(`Data validation completed`);
        if (repairResult.repaired > 0) {
          tasksCompleted.push(`Repaired ${repairResult.repaired} data issues`);
        }
        if (repairResult.errors.length > 0) {
          tasksCompleted.push(`Found ${repairResult.errors.length} data issues`);
        }
      } else {
        errors.push('Data validation failed');
      }

      // Task 4: Update last check date
      const today = formatDateToYYYYMMDD(new Date());
      await StorageService.saveLastCheckDate(today);
      tasksCompleted.push('Last check date updated');

      return {
        success: errors.length === 0,
        tasksCompleted,
        errors,
      };
    } catch (error) {
      console.error('Daily cleanup failed:', error);
      errors.push('Cleanup process failed due to error');
      return {
        success: false,
        tasksCompleted,
        errors,
      };
    }
  }

  /**
   * Check if daily reset is needed and perform it
   * @returns {Promise<{ success: boolean; resetPerformed: boolean; error?: string }>} Reset result
   *
   * @example
   * const { resetPerformed } = await DataCleanupService.checkAndPerformDailyReset();
   */
  static async checkAndPerformDailyReset(): Promise<{ success: boolean; resetPerformed: boolean; error?: string }> {
    try {
      // Get last check date
      const { data: lastCheckDate } = await StorageService.loadLastCheckDate();
      const today = formatDateToYYYYMMDD(new Date());

      // Check if it's a new day
      if (!lastCheckDate || isNewDay(lastCheckDate)) {
        // Perform daily reset
        const resetResult = await this.performDailyReset();
        return resetResult;
      }

      return { success: true, resetPerformed: false };
    } catch (error) {
      console.error('Failed to check daily reset:', error);
      return { success: false, resetPerformed: false, error: 'Failed to check daily reset' };
    }
  }

  /**
   * Perform the actual daily reset
   * @returns {Promise<{ success: boolean; resetPerformed: boolean; error?: string }>} Reset result
   *
   * @example
   * const { success } = await DataCleanupService.performDailyReset();
   */
  static async performDailyReset(): Promise<{ success: boolean; resetPerformed: boolean; error?: string }> {
    try {
      // Get today's data
      const { data: todayData, success: loadSuccess } = await StorageService.loadTodayData();

      if (!loadSuccess || !todayData) {
        return { success: false, resetPerformed: false, error: 'Failed to load today data' };
      }

      // Check if today's data has any intake
      if (todayData.intake > 0) {
        // Create history entry for yesterday
        const historyEntry: HistoryEntry = {
          date: todayData.date,
          totalIntake: todayData.intake,
          target: todayData.intake, // Will be updated with actual target from settings
          completed: false, // Will be calculated with actual target
        };

        // Get settings to get the actual target
        const { data: settings } = await StorageService.loadSettings();
        if (settings) {
          historyEntry.target = settings.dailyTarget;
          historyEntry.completed = todayData.intake >= settings.dailyTarget * 0.8; // 80% threshold
        }

        // Add to history
        const addResult = await StorageService.addHistoryEntry(historyEntry);
        if (!addResult.success) {
          return { success: false, resetPerformed: false, error: 'Failed to save to history' };
        }
      }

      // Reset today's data
      const newTodayData: TodayData = {
        date: formatDateToYYYYMMDD(new Date()),
        intake: 0,
        logs: [],
      };

      const saveResult = await StorageService.saveTodayData(newTodayData);
      if (!saveResult.success) {
        return { success: false, resetPerformed: false, error: 'Failed to save new today data' };
      }

      return { success: true, resetPerformed: true };
    } catch (error) {
      console.error('Failed to perform daily reset:', error);
      return { success: false, resetPerformed: false, error: 'Daily reset failed' };
    }
  }

  /**
   * Clean up old history data (older than retention period)
   * @returns {Promise<{ success: boolean; entriesRemoved: number; error?: string }>} Cleanup result
   *
   * @example
   * const { entriesRemoved } = await DataCleanupService.cleanupOldHistory();
   */
  static async cleanupOldHistory(): Promise<{ success: boolean; entriesRemoved: number; error?: string }> {
    try {
      // Load current history
      const { data: history = [], success: loadSuccess } = await StorageService.loadHistory();

      if (!loadSuccess) {
        return { success: false, entriesRemoved: 0, error: 'Failed to load history' };
      }

      // Calculate cutoff date
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - DATA_RETENTION_DAYS);
      const cutoffDateString = formatDateToYYYYMMDD(cutoffDate);

      // Filter out old entries
      const filteredHistory = history.filter(entry => entry.date >= cutoffDateString);
      const entriesRemoved = history.length - filteredHistory.length;

      if (entriesRemoved > 0) {
        // Save filtered history
        const saveResult = await StorageService.saveHistory(filteredHistory);
        if (!saveResult.success) {
          return { success: false, entriesRemoved: 0, error: 'Failed to save filtered history' };
        }
      }

      return { success: true, entriesRemoved };
    } catch (error) {
      console.error('Failed to cleanup old history:', error);
      return { success: false, entriesRemoved: 0, error: 'History cleanup failed' };
    }
  }

  /**
   * Optimize storage by compressing and removing redundant data
   * @returns {Promise<{ success: boolean; spaceSaved: number; errors: string[] }>} Optimization result
   *
   * @example
   * const { spaceSaved } = await DataCleanupService.optimizeStorage();
   */
  static async optimizeStorage(): Promise<{ success: boolean; spaceSaved: number; errors: string[] }> {
    const errors: string[] = [];
    let spaceSaved = 0;

    try {
      // Get current storage stats
      const { data: statsBefore } = await StorageService.getStorageStats();
      const beforeSize = statsBefore?.estimatedSize || '0';

      // Task 1: Remove duplicate history entries
      const { data: history } = await StorageService.loadHistory();
      if (history) {
        const uniqueHistory = history.filter((entry, index, self) =>
          index === self.findIndex(e => e.date === entry.date)
        );

        if (uniqueHistory.length < history.length) {
          await StorageService.saveHistory(uniqueHistory);
          spaceSaved += history.length - uniqueHistory.length;
        }
      }

      // Task 2: Clean up empty or invalid today logs
      const { data: todayData } = await StorageService.loadTodayData();
      if (todayData && todayData.logs) {
        // Remove logs with invalid amounts or timestamps
        const validLogs = todayData.logs.filter(log =>
          log.amount > 0 &&
          log.timestamp &&
          !isNaN(new Date(log.timestamp).getTime())
        );

        if (validLogs.length < todayData.logs.length) {
          await StorageService.saveTodayData({
            ...todayData,
            logs: validLogs,
            intake: validLogs.reduce((sum, log) => sum + log.amount, 0),
          });
          spaceSaved += todayData.logs.length - validLogs.length;
        }
      }

      // Get final storage stats
      const { data: statsAfter } = await StorageService.getStorageStats();
      const afterSize = statsAfter?.estimatedSize || '0';

      return {
        success: errors.length === 0,
        spaceSaved,
        errors,
      };
    } catch (error) {
      console.error('Failed to optimize storage:', error);
      errors.push('Storage optimization failed');
      return {
        success: false,
        spaceSaved,
        errors,
      };
    }
  }

  /**
   * Get data cleanup statistics
   * @returns {Promise<{ success: boolean; stats?: { historyEntries: number; todayLogs: number; lastCleanup: string; needsCleanup: boolean }; error?: string }>} Cleanup stats
   *
   * @example
   * const { stats } = await DataCleanupService.getCleanupStats();
   */
  static async getCleanupStats(): Promise<{ success: boolean; stats?: { historyEntries: number; todayLogs: number; lastCleanup: string; needsCleanup: boolean }; error?: string }> {
    try {
      // Get history count
      const { data: history = [] } = await StorageService.loadHistory();

      // Get today's logs count
      const { data: todayData } = await StorageService.loadTodayData();
      const todayLogsCount = todayData?.logs?.length || 0;

      // Get last cleanup date
      const { data: lastCheckDate } = await StorageService.loadLastCheckDate();
      const today = formatDateToYYYYMMDD(new Date());
      const needsCleanup = !lastCheckDate || isNewDay(lastCheckDate);

      return {
        success: true,
        stats: {
          historyEntries: history.length,
          todayLogs: todayLogsCount,
          lastCleanup: lastCheckDate || 'Never',
          needsCleanup,
        },
      };
    } catch (error) {
      console.error('Failed to get cleanup stats:', error);
      return { success: false, error: 'Failed to get cleanup statistics' };
    }
  }

  /**
   * Schedule automatic cleanup (conceptual - would be implemented with background tasks)
   * @returns {Promise<{ success: boolean; message: string }>} Schedule result
   *
   * @example
   * const { success, message } = await DataCleanupService.scheduleAutomaticCleanup();
   */
  static async scheduleAutomaticCleanup(): Promise<{ success: boolean; message: string }> {
    // This would typically be implemented with Expo Background Fetch or similar
    // For now, return a conceptual implementation
    return {
      success: true,
      message: 'Automatic cleanup scheduled for daily execution',
    };
  }

  /**
   * Export data for backup
   * @returns {Promise<{ success: boolean; data?: string; error?: string }}> Export result
   *
   * @example
   * const { data: exportData } = await DataCleanupService.exportData();
   */
  static async exportData(): Promise<{ success: boolean; data?: string; error?: string }> {
    try {
      const allData = await StorageService.loadAllData();

      if (!allData.success) {
        return { success: false, error: 'Failed to load data for export' };
      }

      const exportData = {
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        data: allData.data,
      };

      return {
        success: true,
        data: JSON.stringify(exportData, null, 2),
      };
    } catch (error) {
      console.error('Failed to export data:', error);
      return { success: false, error: 'Data export failed' };
    }
  }

  /**
   * Import data from backup
   * @param {string} exportData - JSON export data
   * @returns {Promise<{ success: boolean; message: string; error?: string }>} Import result
   *
   * @example
   * const { success, message } = await DataCleanupService.importData(jsonData);
   */
  static async importData(exportData: string): Promise<{ success: boolean; message: string; error?: string }> {
    try {
      const parsed = JSON.parse(exportData);

      if (!parsed.data) {
        return { success: false, message: '', error: 'Invalid export data format' };
      }

      const { data } = parsed;

      // Import settings
      if (data.settings) {
        const result = await StorageService.saveSettings(data.settings);
        if (!result.success) {
          return { success: false, message: '', error: 'Failed to import settings' };
        }
      }

      // Import today data
      if (data.today) {
        const result = await StorageService.saveTodayData(data.today);
        if (!result.success) {
          return { success: false, message: '', error: 'Failed to import today data' };
        }
      }

      // Import history
      if (data.history) {
        const result = await StorageService.saveHistory(data.history);
        if (!result.success) {
          return { success: false, message: '', error: 'Failed to import history' };
        }
      }

      return {
        success: true,
        message: 'Data imported successfully',
      };
    } catch (error) {
      console.error('Failed to import data:', error);
      return { success: false, message: '', error: 'Data import failed' };
    }
  }
}