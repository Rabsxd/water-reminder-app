/**
 * Date utilities for the Water Reminder app
 * Contains all date manipulation and formatting functions
 */

import type { HistoryEntry, WaterLogEntry } from "./types";

/**
 * Formats a date object to YYYY-MM-DD string
 * @param {Date} date - Date object to format
 * @returns {string} Formatted date string in YYYY-MM-DD format
 *
 * @example
 * formatDateToYYYYMMDD(new Date('2025-01-15')) // '2025-01-15'
 */
export const formatDateToYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Formats a date to display string (e.g., "15 Jan 2025")
 * @param {Date} date - Date object to format
 * @returns {string} Formatted date string for display
 *
 * @example
 * formatDateForDisplay(new Date('2025-01-15')) // '15 Jan 2025'
 */
export const formatDateForDisplay = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
};

/**
 * Format date string to readable format (Indonesian)
 * @param dateString - ISO date string
 * @returns Formatted date string
 *
 * @example
 * formatDate('2025-01-15') // '15 Januari 2025'
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Hari Ini";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Kemarin";
  } else {
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    });
  }
};

/**
 * Formats a date to day name (e.g., "Monday")
 * @param {Date} date - Date object to format
 * @returns {string} Day name
 *
 * @example
 * formatDateToDayName(new Date('2025-01-15')) // 'Wednesday'
 */
export const formatDateToDayName = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
  };
  return date.toLocaleDateString("en-US", options);
};

/**
 * Formats a date to short day name (e.g., "Mon")
 * @param {Date} date - Date object to format
 * @returns {string} Short day name
 *
 * @example
 * formatDateToShortDayName(new Date('2025-01-15')) // 'Wed'
 */
export const formatDateToShortDayName = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
  };
  return date.toLocaleDateString("en-US", options);
};

/**
 * Formats time to 12-hour format with AM/PM (e.g., "2:30 PM")
 * @param {Date} date - Date object to format
 * @returns {string} Formatted time string
 *
 * @example
 * formatTimeTo12Hour(new Date('2025-01-15T14:30:00')) // '2:30 PM'
 */
export const formatTimeTo12Hour = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleTimeString("en-US", options);
};

/**
 * Formats time to 24-hour format (e.g., "14:30")
 * @param {Date} date - Date object to format
 * @returns {string} Formatted time string
 *
 * @example
 * formatTimeTo24Hour(new Date('2025-01-15T14:30:00')) // '14:30'
 */
export const formatTimeTo24Hour = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  return date.toLocaleTimeString("en-US", options);
};

/**
 * Creates an ISO 8601 timestamp for current time
 * @returns {string} Current timestamp in ISO 8601 format
 *
 * @example
 * createTimestamp() // '2025-01-15T14:30:00.000Z'
 */
export const createTimestamp = (): string => {
  return new Date().toISOString();
};

/**
 * Gets the start of the day (midnight) for a given date
 * @param {Date} date - Date object
 * @returns {Date} Date object set to midnight of the given day
 *
 * @example
 * getStartOfDay(new Date('2025-01-15T14:30:00')) // 2025-01-15T00:00:00.000Z
 */
export const getStartOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

/**
 * Gets the end of the day (23:59:59.999) for a given date
 * @param {Date} date - Date object
 * @returns {Date} Date object set to end of the given day
 *
 * @example
 * getEndOfDay(new Date('2025-01-15T14:30:00')) // 2025-01-15T23:59:59.999Z
 */
export const getEndOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

/**
 * Checks if a date is today
 * @param {Date} date - Date to check
 * @returns {boolean} True if the date is today
 *
 * @example
 * isToday(new Date()) // true
 * isToday(new Date('2025-01-01')) // false (unless today is 2025-01-01)
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return formatDateToYYYYMMDD(date) === formatDateToYYYYMMDD(today);
};

/**
 * Checks if it's a new day compared to the last check date
 * @param {string} lastCheckDate - Last check date in YYYY-MM-DD format
 * @returns {boolean} True if it's a new day
 *
 * @example
 * isNewDay('2025-01-14') // true if today is 2025-01-15
 */
export const isNewDay = (lastCheckDate: string): boolean => {
  const today = formatDateToYYYYMMDD(new Date());
  return today !== lastCheckDate;
};

/**
 * Gets an array of the last N days including today
 * @param {number} days - Number of days to get
 * @returns {Date[]} Array of Date objects
 *
 * @example
 * getLastNDays(7) // Returns last 7 days including today
 */
export const getLastNDays = (days: number): Date[] => {
  const result: Date[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    result.push(date);
  }

  return result;
};

/**
 * Gets an array of dates for the current week (Monday to Sunday)
 * @returns {Date[]} Array of Date objects for current week
 *
 * @example
 * getCurrentWeekDates() // Returns dates for Monday to Sunday of current week
 */
export const getCurrentWeekDates = (): Date[] => {
  const today = new Date();
  const currentDay = today.getDay();
  const mondayOffset = currentDay === 0 ? 6 : currentDay - 1; // Adjust for Sunday (0)

  const monday = new Date(today);
  monday.setDate(today.getDate() - mondayOffset);

  const weekDates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    weekDates.push(date);
  }

  return weekDates;
};

/**
 * Checks if a given time is within wake hours
 * @param {Date} datetime - Date and time to check
 * @param {number} wakeStart - Wake start hour (0-23)
 * @param {number} wakeEnd - Wake end hour (1-24)
 * @returns {boolean} True if the time is within wake hours
 *
 * @example
 * isWithinWakeHours(new Date('2025-01-15T10:00:00'), 7, 22) // true
 * isWithinWakeHours(new Date('2025-01-15T23:00:00'), 7, 22) // false
 */
export const isWithinWakeHours = (
  datetime: Date,
  wakeStart: number,
  wakeEnd: number
): boolean => {
  const currentHour = datetime.getHours();

  // Handle case where wakeEnd is after midnight (e.g., 22:00 to 02:00)
  if (wakeEnd < wakeStart) {
    return currentHour >= wakeStart || currentHour < wakeEnd;
  }

  // Normal case (e.g., 07:00 to 22:00)
  return currentHour >= wakeStart && currentHour < wakeEnd;
};

/**
 * Calculates age of a timestamp in human-readable format
 * @param {string} timestamp - ISO 8601 timestamp
 * @returns {string} Human-readable age (e.g., "2 minutes ago", "1 hour ago")
 *
 * @example
 * getTimestampAge('2025-01-15T14:25:00.000Z') // '5 minutes ago' (if current time is 14:30)
 */
export const getTimestampAge = (timestamp: string): string => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) {
    return "Just now";
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  } else if (diffDays === 1) {
    return "Yesterday";
  } else {
    return formatDateForDisplay(past);
  }
};

/**
 * Filters logs to include only entries from today
 * @param {WaterLogEntry[]} logs - Array of water log entries
 * @returns {WaterLogEntry[]} Filtered logs for today only
 *
 * @example
 * getTodayLogs([log1, log2]) // Returns only logs from today
 */
export const getTodayLogs = (logs: WaterLogEntry[]): WaterLogEntry[] => {
  const today = formatDateToYYYYMMDD(new Date());

  return logs.filter((log) => {
    const logDate = new Date(log.timestamp);
    const logDateString = formatDateToYYYYMMDD(logDate);
    return logDateString === today;
  });
};

/**
 * Groups logs by date
 * @param {WaterLogEntry[]} logs - Array of water log entries
 * @returns {Record<string, WaterLogEntry[]>} Logs grouped by date
 *
 * @example
 * groupLogsByDate([log1, log2]) // { '2025-01-15': [log1], '2025-01-16': [log2] }
 */
export const groupLogsByDate = (
  logs: WaterLogEntry[]
): Record<string, WaterLogEntry[]> => {
  return logs.reduce((groups, log) => {
    const date = new Date(log.timestamp);
    const dateString = formatDateToYYYYMMDD(date);

    if (!groups[dateString]) {
      groups[dateString] = [];
    }

    groups[dateString].push(log);
    return groups;
  }, {} as Record<string, WaterLogEntry[]>);
};

/**
 * Calculates the percentage of daily goal achieved
 * @param {number} intake - Current intake in milliliters
 * @param {number} target - Daily target in milliliters
 * @returns {number} Percentage achieved (0-1)
 *
 * @example
 * calculateGoalPercentage(1500, 2000) // 0.75
 */
export const calculateGoalPercentage = (
  intake: number,
  target: number
): number => {
  if (target === 0) return 0;
  return Math.min(intake / target, 1);
};

/**
 * Checks if a daily goal was completed (80% threshold)
 * @param {number} intake - Current intake in milliliters
 * @param {number} target - Daily target in milliliters
 * @param {number} threshold - Completion threshold (default: 0.8)
 * @returns {boolean} True if goal is considered completed
 *
 * @example
 * isGoalCompleted(1600, 2000) // true (80% of 2000 is 1600)
 */
export const isGoalCompleted = (
  intake: number,
  target: number,
  threshold: number = 0.8
): boolean => {
  return calculateGoalPercentage(intake, target) >= threshold;
};

/**
 * Calculates streak from history data
 * @param {HistoryEntry[]} history - Array of historical data
 * @param {number} currentTarget - Current daily target
 * @returns {number} Current streak in days
 *
 * @example
 * calculateStreak(history, 2000) // Returns current streak
 */
export const calculateStreak = (
  history: HistoryEntry[],
  currentTarget: number
): number => {
  let streak = 0;

  // Check today first
  const today = formatDateToYYYYMMDD(new Date());
  const todayEntry = history.find((entry) => entry.date === today);

  // If today is not completed, check if today has data at all
  if (!todayEntry || !isGoalCompleted(todayEntry.totalIntake, currentTarget)) {
    // If today is not completed but has data, don't count it in streak
    // If today has no data yet, we can still have a streak from previous days
  } else {
    streak++;
  }

  // Check previous days
  const sortedHistory = history
    .filter((entry) => entry.date !== today) // Exclude today
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Most recent first

  for (const entry of sortedHistory) {
    if (isGoalCompleted(entry.totalIntake, entry.target)) {
      streak++;
    } else {
      break; // Streak breaks on first incomplete day
    }
  }

  return streak;
};

/**
 * Calculates weekly average from history data
 * @param {HistoryEntry[]} history - Array of historical data
 * @param {number} days - Number of days to include in average (default: 7)
 * @returns {number} Weekly average in milliliters
 *
 * @example
 * calculateWeeklyAverage(history, 7) // Returns average of last 7 days
 */
export const calculateWeeklyAverage = (
  history: HistoryEntry[],
  days: number = 7
): number => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const recentHistory = history.filter(
    (entry) => new Date(entry.date) >= cutoffDate
  );

  if (recentHistory.length === 0) return 0;

  const totalIntake = recentHistory.reduce(
    (sum, entry) => sum + entry.totalIntake,
    0
  );
  return Math.round(totalIntake / recentHistory.length);
};

/**
 * Gets the user's timezone offset in minutes
 * @returns {number} Timezone offset in minutes from UTC
 *
 * @example
 * getTimezoneOffset() // Returns -420 for Indonesia (WIB)
 */
export const getTimezoneOffset = (): number => {
  return new Date().getTimezoneOffset();
};

/**
 * Converts UTC date to local date (user's timezone)
 * @param {Date} utcDate - Date in UTC
 * @returns {Date} Date converted to local timezone
 *
 * @example
 * utcToLocalDate(new Date('2025-01-15T14:30:00.000Z')) // Local date/time
 */
export const utcToLocalDate = (utcDate: Date): Date => {
  const offset = utcDate.getTimezoneOffset();
  const localDate = new Date(utcDate.getTime() - offset * 60 * 1000);
  return localDate;
};

/**
 * Converts local date to UTC date
 * @param {Date} localDate - Date in local timezone
 * @returns {Date} Date converted to UTC
 *
 * @example
 * localToUtcDate(new Date()) // Current time in UTC
 */
export const localToUtcDate = (localDate: Date): Date => {
  const offset = localDate.getTimezoneOffset();
  const utcDate = new Date(localDate.getTime() + offset * 60 * 1000);
  return utcDate;
};

/**
 * Gets timezone name for display purposes
 * @returns {string} Timezone name (e.g., "WIB", "UTC+7")
 *
 * @example
 * getTimezoneName() // "WIB" for Indonesia Western Time
 */
export const getTimezoneName = (): string => {
  const offset = -new Date().getTimezoneOffset() / 60;

  // Common timezone mappings
  const timezoneMap: { [key: number]: string } = {
    0: "UTC",
    1: "CET",
    5: "PKT",
    5.5: "IST",
    7: "WIB", // Indonesia Western Time
    8: "WITA", // Indonesia Central Time
    8.5: "CST", // China Standard Time
    9: "WIT", // Indonesia Eastern Time / Japan Standard Time
  };

  return timezoneMap[offset] || `UTC${offset >= 0 ? "+" : ""}${offset}`;
};

/**
 * Adjusts date for timezone when comparing dates across different timezones
 * @param {Date} date - Date to adjust
 * @returns {string} Date string adjusted for local timezone
 *
 * @example
 * getLocalDateString(new Date()) // '2025-01-15' in local timezone
 */
export const getLocalDateString = (date: Date): string => {
  const localDate = utcToLocalDate(date);
  return formatDateToYYYYMMDD(localDate);
};

/**
 * Checks if two dates are the same day in local timezone
 * @param {Date} date1 - First date to compare
 * @param {Date} date2 - Second date to compare
 * @returns {boolean} True if dates are the same day in local timezone
 *
 * @example
 * isSameDay(new Date('2025-01-15'), new Date('2025-01-15T23:59:59')) // true
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  const local1 = utcToLocalDate(date1);
  const local2 = utcToLocalDate(date2);
  return formatDateToYYYYMMDD(local1) === formatDateToYYYYMMDD(local2);
};

/**
 * Gets start of day in local timezone (important for daily reset logic)
 * @param {Date} date - Date to get start of day for
 * @returns {Date} Start of day (00:00:00) in local timezone
 *
 * @example
 * getLocalStartOfDay(new Date('2025-01-15T14:30:00Z')) // 2025-01-15T00:00:00 local
 */
export const getLocalStartOfDay = (date: Date): Date => {
  const localDate = utcToLocalDate(date);
  localDate.setHours(0, 0, 0, 0);
  return localDate;
};
