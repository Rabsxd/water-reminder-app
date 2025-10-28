/**
 * Notification Service for Water Reminder app
 * Handles all notification-related functionality using Expo Notifications API
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import type {
  NotificationChannelInput,
  NotificationContentInput,
  NotificationResponse,
  Subscription,
} from "expo-notifications";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { STORAGE_KEYS } from "../utils/constants";
import type { NotificationSettings, WakeHours } from "../utils/types";

/**
 * Configure notification behavior
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Notification channel configuration for Android
 */
export const NOTIFICATION_CHANNEL_ID = "water-reminders";

/**
 * Initialize notification service
 * Creates notification channel and requests permissions
 * @returns {Promise<boolean>} Whether notifications are properly initialized
 */
export const initializeNotifications = async (): Promise<boolean> => {
  try {
    // Request permissions
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.warn("Notification permissions not granted");
      return false;
    }

    // Create notification channel for Android
    if (Platform.OS === "android") {
      await createNotificationChannel();
    }

    // Set up notification response listener
    setupNotificationListeners();

    return true;
  } catch (error) {
    console.error("Failed to initialize notifications:", error);
    return false;
  }
};

/**
 * Request notification permissions
 * @returns {Promise<boolean>} Whether permissions were granted
 */
export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    if (Platform.OS === "android") {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === "granted";
    } else {
      // iOS - handle differently if needed in future
      return true;
    }
  } catch (error) {
    console.error("Error requesting notification permissions:", error);
    return false;
  }
};

/**
 * Create notification channel for Android
 */
const createNotificationChannel = async (): Promise<void> => {
  if (Platform.OS !== "android") return;

  try {
    const channel: NotificationChannelInput = {
      name: "Water Reminders",
      description: "Reminders to drink water throughout the day",
      sound: "default",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      enableLights: true,
      lightColor: "#00CED1",
      enableVibrate: true,
    };

    await Notifications.setNotificationChannelAsync(
      NOTIFICATION_CHANNEL_ID,
      channel
    );
    console.log("Notification channel created successfully");
  } catch (error) {
    console.error("Failed to create notification channel:", error);
  }
};

/**
 * Setup notification response listeners
 */
let notificationResponseSubscription: Subscription | null = null;

const setupNotificationListeners = (): void => {
  // Handle notification press
  if (notificationResponseSubscription) {
    notificationResponseSubscription.remove();
  }

  notificationResponseSubscription =
    Notifications.addNotificationResponseReceivedListener(
      (response: NotificationResponse) => {
        console.log("Notification pressed:", response.notification);
        // In a real app, you might want to navigate to a specific screen
        // or perform some action when notification is pressed
      }
    );
};

/**
 * Check if current time is within wake hours
 * @param {WakeHours} wakeHours - User's wake hours configuration
 * @returns {boolean} Whether current time is within wake hours
 */
export const isWithinWakeHours = (wakeHours: WakeHours): boolean => {
  const now = new Date();
  const currentHour = now.getHours();

  const start = wakeHours.start;
  const end = wakeHours.end;

  // Handle overnight case (e.g., 22:00 to 07:00)
  if (start > end) {
    return currentHour >= start || currentHour < end;
  }

  // Normal case (e.g., 07:00 to 22:00)
  return currentHour >= start && currentHour < end;
};

/**
 * Check if reminders should be paused (target reached or recent drink)
 * @param {number} currentIntake - Current water intake in ml
 * @param {number} dailyTarget - Daily target in ml
 * @param {string} lastReminderTime - ISO string of last reminder time
 * @param {number} reminderInterval - Reminder interval in minutes
 * @returns {boolean} Whether reminders should be paused
 */
export const shouldPauseReminders = async (
  currentIntake: number,
  dailyTarget: number,
  lastReminderTime?: string,
  reminderInterval: number = 60
): Promise<boolean> => {
  // Pause if target reached (90% to be more lenient)
  if (currentIntake >= dailyTarget * 0.9) {
    return true;
  }

  // Check if there was a recent drink that should suppress the next reminder
  if (lastReminderTime) {
    const lastReminder = new Date(lastReminderTime);
    const now = new Date();
    const minutesSinceReminder =
      (now.getTime() - lastReminder.getTime()) / (1000 * 60);

    // If less than reminder interval has passed since last reminder, pause
    if (minutesSinceReminder < reminderInterval * 0.8) {
      return true;
    }
  }

  return false;
};

/**
 * Schedule a water reminder notification
 * @param {NotificationSettings} settings - User's notification settings
 * @param {number} currentIntake - Current water intake in ml
 * @param {number} dailyTarget - Daily target in ml
 * @returns {Promise<string | null>} Notification ID if scheduled successfully
 */
export const scheduleWaterReminder = async (
  settings: NotificationSettings,
  currentIntake: number,
  dailyTarget: number
): Promise<string | null> => {
  try {
    // Check if notifications are enabled
    if (!settings.enabled) {
      console.log("Reminders are disabled");
      return null;
    }

    // Check if within wake hours
    if (!isWithinWakeHours(settings.wakeHours)) {
      console.log("Outside wake hours, skipping reminder");
      return null;
    }

    // Get last reminder time
    const lastReminderTime = await AsyncStorage.getItem(
      STORAGE_KEYS.LAST_REMINDER
    );

    // Check if should pause reminders
    if (
      await shouldPauseReminders(
        currentIntake,
        dailyTarget,
        lastReminderTime || undefined,
        settings.interval
      )
    ) {
      console.log("Reminders paused (target reached or recent reminder)");
      return null;
    }

    // Calculate next trigger time
    const triggerDate = new Date();
    triggerDate.setMinutes(triggerDate.getMinutes() + settings.interval);

    // Create notification content
    const content: NotificationContentInput = {
      title: "💧 Time to Drink Water!",
      body: getRandomReminderMessage(currentIntake, dailyTarget),
      sound: settings.sound ? "default" : undefined,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    };

    // Schedule notification
    const trigger: any = { type: "date", timestamp: triggerDate.getTime() };
    const identifier = await Notifications.scheduleNotificationAsync({
      content,
      trigger,
    });

    // Store last reminder time
    await AsyncStorage.setItem(
      STORAGE_KEYS.LAST_REMINDER,
      new Date().toISOString()
    );

    console.log(
      `Water reminder scheduled with ID: ${identifier} for ${triggerDate.toISOString()}`
    );
    return identifier;
  } catch (error) {
    console.error("Failed to schedule water reminder:", error);
    return null;
  }
};

/**
 * Get a random reminder message
 * @param {number} currentIntake - Current water intake
 * @param {number} dailyTarget - Daily target
 * @returns {string} Random reminder message
 */
const getRandomReminderMessage = (
  currentIntake: number,
  dailyTarget: number
): string => {
  const progress = (currentIntake / dailyTarget) * 100;

  const messages = {
    early: [
      "Great start! Keep up the hydration!",
      "You're on your way to your goal!",
      "Every sip counts towards your target!",
      "Morning hydration is important!",
    ],
    midway: [
      "Halfway there! You're doing great!",
      "Keep going, you're making progress!",
      "Your body will thank you for this!",
      "Stay consistent with your hydration!",
    ],
    close: [
      "Almost there! Just a little more!",
      "You're so close to your daily goal!",
      "Final push to reach your target!",
      "Don't stop now, you've got this!",
    ],
    reached: [
      "Congratulations! You've reached your goal!",
      "Amazing work! Target achieved!",
      "You did it! Daily goal completed!",
      "Perfect hydration today!",
    ],
  };

  let category: keyof typeof messages;
  if (progress >= 100) category = "reached";
  else if (progress >= 75) category = "close";
  else if (progress >= 40) category = "midway";
  else category = "early";

  const categoryMessages = messages[category];
  return categoryMessages[Math.floor(Math.random() * categoryMessages.length)];
};

/**
 * Cancel all scheduled water reminder notifications
 * @returns {Promise<number>} Number of cancelled notifications
 */
export const cancelAllWaterReminders = async (): Promise<number> => {
  try {
    const scheduledNotifications =
      await Notifications.getAllScheduledNotificationsAsync();
    // Since we can't filter by categoryId, we'll cancel all scheduled notifications
    // that match our water reminder content pattern
    const waterReminders = scheduledNotifications.filter(
      (notification: any) =>
        notification.content.title?.includes("Water") ||
        notification.content.body?.includes("drink")
    );

    for (const reminder of waterReminders) {
      await Notifications.cancelScheduledNotificationAsync(reminder.identifier);
    }

    console.log(
      `Cancelled ${waterReminders.length} water reminder notifications`
    );
    return waterReminders.length;
  } catch (error) {
    console.error("Failed to cancel water reminders:", error);
    return 0;
  }
};

/**
 * Show an immediate notification (for testing or immediate feedback)
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {boolean} vibrate - Whether to vibrate
 * @returns {Promise<string | null>} Notification ID if successful
 */
export const showImmediateNotification = async (
  title: string,
  body: string,
  vibrate: boolean = true
): Promise<string | null> => {
  try {
    const content: NotificationContentInput = {
      title,
      body,
      sound: "default",
      priority: Notifications.AndroidNotificationPriority.HIGH,
    };

    const identifier = await Notifications.scheduleNotificationAsync({
      content,
      trigger: null, // Show immediately
    });

    console.log(`Immediate notification shown with ID: ${identifier}`);
    return identifier;
  } catch (error) {
    console.error("Failed to show immediate notification:", error);
    return null;
  }
};

/**
 * Get notification permission status
 * @returns {Promise<string>} Permission status
 */
export const getNotificationPermissionStatus = async (): Promise<string> => {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status;
  } catch (error) {
    console.error("Failed to get notification permission status:", error);
    return "unknown";
  }
};

/**
 * Cleanup notification service (remove listeners)
 */
export const cleanupNotificationService = (): void => {
  if (notificationResponseSubscription) {
    notificationResponseSubscription.remove();
    notificationResponseSubscription = null;
  }
};

/**
 * Schedule recurring notifications based on user settings
 * @param {NotificationSettings} settings - User's notification settings
 * @param {number} currentIntake - Current water intake
 * @param {number} dailyTarget - Daily target
 * @returns {Promise<string[]>} Array of scheduled notification IDs
 */
export const scheduleRecurringReminders = async (
  settings: NotificationSettings,
  currentIntake: number,
  dailyTarget: number
): Promise<string[]> => {
  const scheduledIds: string[] = [];

  try {
    // Cancel existing reminders first
    await cancelAllWaterReminders();

    if (!settings.enabled) {
      return scheduledIds;
    }

    // Schedule next reminder
    const nextReminderId = await scheduleWaterReminder(
      settings,
      currentIntake,
      dailyTarget
    );
    if (nextReminderId) {
      scheduledIds.push(nextReminderId);
    }

    console.log(`Scheduled ${scheduledIds.length} recurring reminders`);
    return scheduledIds;
  } catch (error) {
    console.error("Failed to schedule recurring reminders:", error);
    return scheduledIds;
  }
};
