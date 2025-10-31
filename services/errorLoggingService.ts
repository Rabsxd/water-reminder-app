/**
 * Error Logging Service
 * Centralized error logging and debugging service
 *
 * @service
 * @example
 * ErrorLogger.logError(new Error('Something went wrong'), {
 *   context: 'HomeScreen',
 *   action: 'AddWater',
 *   userId: 'user123'
 * });
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Log entry interface
 */
interface LogEntry {
  id: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info' | 'debug';
  message: string;
  stack?: string;
  context?: string;
  action?: string;
  additionalData?: Record<string, any>;
  deviceInfo?: {
    platform: string;
    version: string;
    brand?: string;
    model?: string;
  };
  appVersion?: string;
}

/**
 * Error context interface
 */
interface ErrorContext {
  context?: string;
  action?: string;
  additionalData?: Record<string, any>;
  userId?: string;
}

/**
 * Error Logging Service
 */
export class ErrorLoggingService {
  private static instance: ErrorLoggingService;
  private readonly STORAGE_KEY = '@water_error_logs';
  private readonly MAX_LOGS = 100; // Keep last 100 logs

  private constructor() {}

  /**
   * Get singleton instance
   * @returns {ErrorLoggingService} Service instance
   */
  static getInstance(): ErrorLoggingService {
    if (!ErrorLoggingService.instance) {
      ErrorLoggingService.instance = new ErrorLoggingService();
    }
    return ErrorLoggingService.instance;
  }

  /**
   * Log an error with context
   * @param {Error|string} error - Error to log
   * @param {ErrorContext} context - Additional context information
   */
  async logError(error: Error | string, context: ErrorContext = {}): Promise<void> {
    const logEntry: LogEntry = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      level: 'error',
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' ? error.stack : undefined,
      context: context.context,
      action: context.action,
      additionalData: context.additionalData,
      deviceInfo: await this.getDeviceInfo(),
      appVersion: await this.getAppVersion(),
    };

    await this.saveLog(logEntry);

    // Also log to console in development
    if (__DEV__) {
      console.error('🔴 Error:', logEntry);
    }
  }

  /**
   * Log a warning
   * @param {string} message - Warning message
   * @param {ErrorContext} context - Additional context
   */
  async logWarning(message: string, context: ErrorContext = {}): Promise<void> {
    const logEntry: LogEntry = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      level: 'warning',
      message,
      context: context.context,
      action: context.action,
      additionalData: context.additionalData,
      deviceInfo: await this.getDeviceInfo(),
      appVersion: await this.getAppVersion(),
    };

    await this.saveLog(logEntry);

    if (__DEV__) {
      console.warn('🟡 Warning:', logEntry);
    }
  }

  /**
   * Log an info message
   * @param {string} message - Info message
   * @param {ErrorContext} context - Additional context
   */
  async logInfo(message: string, context: ErrorContext = {}): Promise<void> {
    const logEntry: LogEntry = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      context: context.context,
      action: context.action,
      additionalData: context.additionalData,
      deviceInfo: await this.getDeviceInfo(),
      appVersion: await this.getAppVersion(),
    };

    await this.saveLog(logEntry);

    if (__DEV__) {
      console.info('🔵 Info:', logEntry);
    }
  }

  /**
   * Log debug information
   * @param {string} message - Debug message
   * @param {ErrorContext} context - Additional context
   */
  async logDebug(message: string, context: ErrorContext = {}): Promise<void> {
    const logEntry: LogEntry = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      level: 'debug',
      message,
      context: context.context,
      action: context.action,
      additionalData: context.additionalData,
      deviceInfo: await this.getDeviceInfo(),
      appVersion: await this.getAppVersion(),
    };

    await this.saveLog(logEntry);

    if (__DEV__) {
      console.debug('🟢 Debug:', logEntry);
    }
  }

  /**
   * Get all stored logs
   * @returns {Promise<LogEntry[]>} Array of log entries
   */
  async getLogs(): Promise<LogEntry[]> {
    try {
      const logs = await AsyncStorage.getItem(this.STORAGE_KEY);
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      console.error('Failed to retrieve logs:', error);
      return [];
    }
  }

  /**
   * Get logs by level
   * @param {string} level - Log level to filter by
   * @returns {Promise<LogEntry[]>} Filtered log entries
   */
  async getLogsByLevel(level: LogEntry['level']): Promise<LogEntry[]> {
    const logs = await this.getLogs();
    return logs.filter(log => log.level === level);
  }

  /**
   * Get logs by context
   * @param {string} context - Context to filter by
   * @returns {Promise<LogEntry[]>} Filtered log entries
   */
  async getLogsByContext(context: string): Promise<LogEntry[]> {
    const logs = await this.getLogs();
    return logs.filter(log => log.context === context);
  }

  /**
   * Clear all logs
   */
  async clearLogs(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear logs:', error);
    }
  }

  /**
   * Clear old logs (older than 7 days)
   */
  async clearOldLogs(): Promise<void> {
    try {
      const logs = await this.getLogs();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentLogs = logs.filter(log =>
        new Date(log.timestamp) > sevenDaysAgo
      );

      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(recentLogs));
    } catch (error) {
      console.error('Failed to clear old logs:', error);
    }
  }

  /**
   * Export logs as JSON string
   * @returns {Promise<string>} JSON string of logs
   */
  async exportLogs(): Promise<string> {
    try {
      const logs = await this.getLogs();
      return JSON.stringify(logs, null, 2);
    } catch (error) {
      console.error('Failed to export logs:', error);
      return '[]';
    }
  }

  /**
   * Save log entry to storage
   * @param {LogEntry} logEntry - Log entry to save
   */
  private async saveLog(logEntry: LogEntry): Promise<void> {
    try {
      const logs = await this.getLogs();
      const updatedLogs = [...logs, logEntry]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, this.MAX_LOGS);

      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedLogs));
    } catch (error) {
      console.error('Failed to save log:', error);
    }
  }

  /**
   * Generate unique ID for log entry
   * @returns {string} Unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get device information
   * @returns {Promise<Object>} Device info object
   */
  private async getDeviceInfo(): Promise<LogEntry['deviceInfo']> {
    try {
      // In a real app, you'd use react-native-device-info
      return {
        platform: 'android',
        version: 'unknown', // Would get from device-info
        brand: 'unknown',
        model: 'unknown',
      };
    } catch (error) {
      return {
        platform: 'android',
        version: 'unknown',
      };
    }
  }

  /**
   * Get app version
   * @returns {Promise<string>} App version
   */
  private async getAppVersion(): Promise<string> {
    try {
      // In a real app, you'd get this from app.json or constants
      return '1.0.0';
    } catch (error) {
      return 'unknown';
    }
  }
}

// Export singleton instance
export const ErrorLogger = ErrorLoggingService.getInstance();