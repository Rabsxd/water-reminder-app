/**
 * Validation utilities for the Water Reminder app
 * Contains all validation functions and logic
 */

import { AMOUNT_LIMITS, DAILY_TARGET_LIMITS, REMINDER_INTERVAL_LIMITS, WAKE_HOURS_LIMITS } from './constants';
import type { ValidationResult } from './types';

/**
 * Validates water amount input
 * @param {number} amount - Amount in milliliters to validate
 * @param {number} currentDailyIntake - Current daily intake in milliliters
 * @returns {ValidationResult} Validation result with error message if invalid
 *
 * @example
 * validateAmount(250, 1000) // { isValid: true }
 * validateAmount(30, 1000) // { isValid: false, error: 'Jumlah air tidak valid...' }
 */
export const validateAmount = (amount: number, currentDailyIntake: number): ValidationResult => {
  // Check if amount is a number
  if (typeof amount !== 'number' || isNaN(amount)) {
    return {
      isValid: false,
      error: 'Jumlah air harus berupa angka.',
    };
  }

  // Check if amount is positive
  if (amount <= 0) {
    return {
      isValid: false,
      error: 'Jumlah air harus lebih dari 0.',
    };
  }

  // Check minimum amount
  if (amount < AMOUNT_LIMITS.MIN) {
    return {
      isValid: false,
      error: `Jumlah air minimal ${AMOUNT_LIMITS.MIN}ml.`,
    };
  }

  // Check maximum amount per entry
  if (amount > AMOUNT_LIMITS.MAX) {
    return {
      isValid: false,
      error: `Jumlah air maksimal ${AMOUNT_LIMITS.MAX}ml per entri.`,
    };
  }

  // Check daily limit
  const totalAfterAdd = currentDailyIntake + amount;
  if (totalAfterAdd > AMOUNT_LIMITS.DAILY_MAX) {
    return {
      isValid: false,
      error: `Total harian akan melebihi batas maksimal ${AMOUNT_LIMITS.DAILY_MAX}ml.`,
    };
  }

  return { isValid: true };
};

/**
 * Validates daily water target
 * @param {number} target - Target amount in milliliters
 * @returns {ValidationResult} Validation result with error message if invalid
 *
 * @example
 * validateTarget(2000) // { isValid: true }
 * validateTarget(500) // { isValid: false, error: 'Target harian minimal...' }
 */
export const validateTarget = (target: number): ValidationResult => {
  // Check if target is a number
  if (typeof target !== 'number' || isNaN(target)) {
    return {
      isValid: false,
      error: 'Target harian harus berupa angka.',
    };
  }

  // Check minimum target
  if (target < DAILY_TARGET_LIMITS.MIN) {
    return {
      isValid: false,
      error: `Target harian minimal ${DAILY_TARGET_LIMITS.MIN}ml.`,
    };
  }

  // Check maximum target
  if (target > DAILY_TARGET_LIMITS.MAX) {
    return {
      isValid: false,
      error: `Target harian maksimal ${DAILY_TARGET_LIMITS.MAX}ml.`,
    };
  }

  // Check if target is multiple of step
  if (target % DAILY_TARGET_LIMITS.STEP !== 0) {
    return {
      isValid: false,
      error: `Target harian harus kelipatan ${DAILY_TARGET_LIMITS.STEP}ml.`,
    };
  }

  return { isValid: true };
};

/**
 * Validates reminder interval
 * @param {number} interval - Interval in minutes
 * @returns {ValidationResult} Validation result with error message if invalid
 *
 * @example
 * validateReminderInterval(60) // { isValid: true }
 * validateReminderInterval(10) // { isValid: false, error: 'Interval pengingat minimal...' }
 */
export const validateReminderInterval = (interval: number): ValidationResult => {
  // Check if interval is a number
  if (typeof interval !== 'number' || isNaN(interval)) {
    return {
      isValid: false,
      error: 'Interval pengingat harus berupa angka.',
    };
  }

  // Check minimum interval
  if (interval < REMINDER_INTERVAL_LIMITS.MIN) {
    return {
      isValid: false,
      error: `Interval pengingat minimal ${REMINDER_INTERVAL_LIMITS.MIN} menit.`,
    };
  }

  // Check maximum interval
  if (interval > REMINDER_INTERVAL_LIMITS.MAX) {
    return {
      isValid: false,
      error: `Interval pengingat maksimal ${REMINDER_INTERVAL_LIMITS.MAX} menit.`,
    };
  }

  return { isValid: true };
};

/**
 * Validates wake hours configuration
 * @param {number} start - Start hour (0-23)
 * @param {number} end - End hour (1-24)
 * @returns {ValidationResult} Validation result with error message if invalid
 *
 * @example
 * validateWakeHours(7, 22) // { isValid: true }
 * validateWakeHours(23, 5) // { isValid: false, error: 'Jam mulai maksimal...' }
 */
export const validateWakeHours = (start: number, end: number): ValidationResult => {
  // Check if start is valid
  if (typeof start !== 'number' || isNaN(start)) {
    return {
      isValid: false,
      error: 'Jam mulai harus berupa angka.',
    };
  }

  // Check if end is valid
  if (typeof end !== 'number' || isNaN(end)) {
    return {
      isValid: false,
      error: 'Jam selesai harus berupa angka.',
    };
  }

  // Check start hour limits
  if (start < WAKE_HOURS_LIMITS.START_MIN || start > WAKE_HOURS_LIMITS.START_MAX) {
    return {
      isValid: false,
      error: `Jam mulai harus antara ${WAKE_HOURS_LIMITS.START_MIN} - ${WAKE_HOURS_LIMITS.START_MAX}.`,
    };
  }

  // Check end hour limits
  if (end < WAKE_HOURS_LIMITS.END_MIN || end > WAKE_HOURS_LIMITS.END_MAX) {
    return {
      isValid: false,
      error: `Jam selesai harus antara ${WAKE_HOURS_LIMITS.END_MIN} - ${WAKE_HOURS_LIMITS.END_MAX}.`,
    };
  }

  // Check if end is after start (allowing for next day)
  if (start === end) {
    return {
      isValid: false,
      error: 'Jam selesai harus berbeda dengan jam mulai.',
    };
  }

  return { isValid: true };
};

/**
 * Validates date string format
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {ValidationResult} Validation result with error message if invalid
 *
 * @example
 * validateDateString('2025-01-15') // { isValid: true }
 * validateDateString('01/15/2025') // { isValid: false, error: 'Format tanggal harus...' }
 */
export const validateDateString = (dateString: string): ValidationResult => {
  // Check if input is a string
  if (typeof dateString !== 'string') {
    return {
      isValid: false,
      error: 'Format tanggal harus berupa string.',
    };
  }

  // Check format with regex (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return {
      isValid: false,
      error: 'Format tanggal harus YYYY-MM-DD.',
    };
  }

  // Parse and validate date
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return {
      isValid: false,
      error: 'Tanggal tidak valid.',
    };
  }

  // Check if parsed date matches input (to catch invalid dates like 2025-02-30)
  const [year, month, day] = dateString.split('-').map(Number);
  if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
    return {
      isValid: false,
      error: 'Tanggal tidak valid.',
    };
  }

  return { isValid: true };
};

/**
 * Validates time string format
 * @param {string} timeString - Time string in HH:MM format
 * @returns {ValidationResult} Validation result with error message if invalid
 *
 * @example
 * validateTimeString('14:30') // { isValid: true }
 * validateTimeString('2:30 PM') // { isValid: false, error: 'Format waktu harus...' }
 */
export const validateTimeString = (timeString: string): ValidationResult => {
  // Check if input is a string
  if (typeof timeString !== 'string') {
    return {
      isValid: false,
      error: 'Format waktu harus berupa string.',
    };
  }

  // Check format with regex (HH:MM)
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(timeString)) {
    return {
      isValid: false,
      error: 'Format waktu harus HH:MM (24 jam).',
    };
  }

  return { isValid: true };
};

/**
 * Validates ISO 8601 timestamp
 * @param {string} timestamp - ISO 8601 timestamp string
 * @returns {ValidationResult} Validation result with error message if invalid
 *
 * @example
 * validateTimestamp('2025-01-15T10:30:00.000Z') // { isValid: true }
 * validateTimestamp('2025/01/15 10:30') // { isValid: false, error: 'Format timestamp harus...' }
 */
export const validateTimestamp = (timestamp: string): ValidationResult => {
  // Check if input is a string
  if (typeof timestamp !== 'string') {
    return {
      isValid: false,
      error: 'Format timestamp harus berupa string.',
    };
  }

  // Try to parse as date
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) {
    return {
      isValid: false,
      error: 'Format timestamp harus ISO 8601.',
    };
  }

  return { isValid: true };
};

/**
 * Validates array of water log entries
 * @param {any[]} logs - Array of log entries to validate
 * @returns {ValidationResult} Validation result with error message if invalid
 *
 * @example
 * validateLogs([{ id: '1', timestamp: '2025-01-15T10:30:00.000Z', amount: 250 }]) // { isValid: true }
 * validateLogs([{ id: '1', amount: 'invalid' }]) // { isValid: false, error: 'Format log tidak valid.' }
 */
export const validateLogs = (logs: any[]): ValidationResult => {
  // Check if input is an array
  if (!Array.isArray(logs)) {
    return {
      isValid: false,
      error: 'Format log harus berupa array.',
    };
  }

  // Validate each log entry
  for (const log of logs) {
    // Check required fields
    if (!log.id || !log.timestamp || !log.amount) {
      return {
        isValid: false,
        error: 'Setiap log harus memiliki id, timestamp, dan amount.',
      };
    }

    // Validate timestamp
    const timestampValidation = validateTimestamp(log.timestamp);
    if (!timestampValidation.isValid) {
      return timestampValidation;
    }

    // Validate amount
    if (typeof log.amount !== 'number' || log.amount <= 0) {
      return {
        isValid: false,
        error: 'Jumlah air dalam log harus berupa angka positif.',
      };
    }
  }

  return { isValid: true };
};