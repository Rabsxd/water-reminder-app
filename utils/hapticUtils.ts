/**
 * Haptic Feedback utilities for Water Reminder app
 * Provides consistent haptic feedback throughout the app
 */

import React from 'react';
import { Platform } from 'react-native';

// Haptic feedback types
export type HapticType =
  | 'light'      // Light impact for taps
  | 'medium'     // Medium impact for actions
  | 'heavy'      // Heavy impact for important actions
  | 'success'    // Success feedback for achievements
  | 'warning'    // Warning feedback for alerts
  | 'error'      // Error feedback for errors
  | 'selection'  // Selection change feedback
  | 'impact'     // Custom impact with intensity
  | 'none';      // No haptic feedback

/**
 * Haptic feedback configuration
 */
interface HapticConfig {
  type: HapticType;
  intensity?: number; // 0-1 for custom impact
  sharp?: boolean;    // Whether haptic should be sharp or soft
}

/**
 * Check if haptic feedback is available
 */
const isHapticAvailable = (): boolean => {
  return Platform.OS === 'ios' || Platform.OS === 'android';
};

/**
 * Default haptic feedback implementation
 * This provides a fallback for devices without haptic capabilities
 */
const defaultHapticFeedback = {
  light: () => console.log('Haptic: Light'),
  medium: () => console.log('Haptic: Medium'),
  heavy: () => console.log('Haptic: Heavy'),
  success: () => console.log('Haptic: Success'),
  warning: () => console.log('Haptic: Warning'),
  error: () => console.log('Haptic: Error'),
  selection: () => console.log('Haptic: Selection'),
  impact: (intensity: number) => console.log(`Haptic: Impact ${intensity}`),
};

/**
 * Enhanced haptic feedback with expo-haptics
 * This would be used if expo-haptics is available
 */
const enhancedHapticFeedback = {
  light: () => {
    try {
      // This would use expo-haptics
      // import * as Haptics from 'expo-haptics';
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      console.log('Haptic: Light (Enhanced)');
    } catch (error) {
      defaultHapticFeedback.light();
    }
  },

  medium: () => {
    try {
      // import * as Haptics from 'expo-haptics';
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      console.log('Haptic: Medium (Enhanced)');
    } catch (error) {
      defaultHapticFeedback.medium();
    }
  },

  heavy: () => {
    try {
      // import * as Haptics from 'expo-haptics';
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      console.log('Haptic: Heavy (Enhanced)');
    } catch (error) {
      defaultHapticFeedback.heavy();
    }
  },

  success: () => {
    try {
      // import * as Haptics from 'expo-haptics';
      // Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      console.log('Haptic: Success (Enhanced)');
    } catch (error) {
      defaultHapticFeedback.success();
    }
  },

  warning: () => {
    try {
      // import * as Haptics from 'expo-haptics';
      // Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      console.log('Haptic: Warning (Enhanced)');
    } catch (error) {
      defaultHapticFeedback.warning();
    }
  },

  error: () => {
    try {
      // import * as Haptics from 'expo-haptics';
      // Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      console.log('Haptic: Error (Enhanced)');
    } catch (error) {
      defaultHapticFeedback.error();
    }
  },

  selection: () => {
    try {
      // import * as Haptics from 'expo-haptics';
      // Haptics.selectionAsync();
      console.log('Haptic: Selection (Enhanced)');
    } catch (error) {
      defaultHapticFeedback.selection();
    }
  },

  impact: (intensity: number) => {
    try {
      // import * as Haptics from 'expo-haptics';
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      console.log(`Haptic: Impact ${intensity} (Enhanced)`);
    } catch (error) {
      defaultHapticFeedback.impact(intensity);
    }
  },
};

// Choose haptic implementation based on availability
const hapticFeedback = isHapticAvailable() ? enhancedHapticFeedback : defaultHapticFeedback;

/**
 * Main haptic feedback function
 * @param {HapticConfig} config - Haptic configuration
 */
export const triggerHaptic = (config: HapticConfig | HapticType): void => {
  // Check if haptics are disabled in settings (would come from context)
  const hapticsEnabled = true; // This would be from user settings

  if (!hapticsEnabled || !isHapticAvailable()) {
    return;
  }

  const hapticConfig = typeof config === 'string' ? { type: config } : config;
  const { type, intensity = 0.5, sharp = true } = hapticConfig;

  switch (type) {
    case 'light':
      hapticFeedback.light();
      break;
    case 'medium':
      hapticFeedback.medium();
      break;
    case 'heavy':
      hapticFeedback.heavy();
      break;
    case 'success':
      hapticFeedback.success();
      break;
    case 'warning':
      hapticFeedback.warning();
      break;
    case 'error':
      hapticFeedback.error();
      break;
    case 'selection':
      hapticFeedback.selection();
      break;
    case 'impact':
      hapticFeedback.impact(intensity);
      break;
    case 'none':
    default:
      // No haptic feedback
      break;
  }
};

/**
 * Predefined haptic feedback patterns for common interactions
 */
export const HAPTIC_PATTERNS = {
  // Button interactions
  BUTTON_TAP: () => triggerHaptic('light'),
  BUTTON_PRESS: () => triggerHaptic('medium'),
  BUTTON_SUCCESS: () => triggerHaptic('success'),

  // List interactions
  LIST_ITEM_SELECT: () => triggerHaptic('selection'),
  LIST_ITEM_DELETE: () => triggerHaptic('heavy'),
  LIST_ITEM_SWIPE: () => triggerHaptic('light'),

  // Form interactions
  FORM_FIELD_FOCUS: () => triggerHaptic('light'),
  FORM_FIELD_CHANGE: () => triggerHaptic('selection'),
  FORM_SUBMIT: () => triggerHaptic('medium'),
  FORM_ERROR: () => triggerHaptic('error'),

  // Water tracking specific
  WATER_ADD: () => triggerHaptic('success'),
  WATER_TARGET_REACHED: () => triggerHaptic('success'),
  WATER_REMINDER: () => triggerHaptic('medium'),

  // Navigation
  NAV_BACK: () => triggerHaptic('light'),
  NAV_TAB_CHANGE: () => triggerHaptic('selection'),
  NAV_DRAWER_OPEN: () => triggerHaptic('light'),

  // Settings
  SETTINGS_TOGGLE: () => triggerHaptic('selection'),
  SETTINGS_SAVE: () => triggerHaptic('success'),
  SETTINGS_RESET: () => triggerHaptic('warning'),

  // Achievement related
  ACHIEVEMENT_UNLOCK: () => triggerHaptic('success'),
  STREAK_INCREASE: () => triggerHaptic('success'),
  MILESTONE_REACHED: () => triggerHaptic('heavy'),

  // Error and warning states
  ERROR_OCCURRED: () => triggerHaptic('error'),
  WARNING_SHOWN: () => triggerHaptic('warning'),
  CONFIRMATION_REQUIRED: () => triggerHaptic('medium'),

  // Pull to refresh
  PULL_TO_REFRESH_THRESHOLD: () => triggerHaptic('medium'),
  REFRESH_COMPLETE: () => triggerHaptic('success'),
} as const;

/**
 * Hook for haptic feedback with debouncing
 */
export const useHaptic = () => {
  const lastHapticTime = React.useRef(0);
  const hapticQueue = React.useRef<Array<HapticConfig>>([]);
  const isProcessing = React.useRef(false);

  /**
   * Trigger haptic with debouncing to prevent spam
   */
  const triggerHapticDebounced = (config: HapticConfig | HapticType, debounceMs: number = 50) => {
    const now = Date.now();

    if (now - lastHapticTime.current < debounceMs) {
      // Queue the haptic if called too quickly
      hapticQueue.current.push(typeof config === 'string' ? { type: config } : config);
      processQueue();
      return;
    }

    lastHapticTime.current = now;
    triggerHaptic(config);
  };

  /**
   * Process queued haptic feedback
   */
  const processQueue = () => {
    if (isProcessing.current || hapticQueue.current.length === 0) {
      return;
    }

    isProcessing.current = true;

    setTimeout(() => {
      if (hapticQueue.current.length > 0) {
        const nextHaptic = hapticQueue.current.shift();
        if (nextHaptic) {
          triggerHaptic(nextHaptic);
          lastHapticTime.current = Date.now();
        }
      }
      isProcessing.current = false;

      if (hapticQueue.current.length > 0) {
        processQueue();
      }
    }, 100);
  };

  /**
   * Trigger haptic pattern with automatic selection
   */
  const triggerPattern = (pattern: keyof typeof HAPTIC_PATTERNS) => {
    HAPTIC_PATTERNS[pattern]();
  };

  return {
    triggerHaptic: triggerHapticDebounced,
    triggerPattern,
    available: isHapticAvailable(),
  };
};

/**
 * Water tracking specific haptic feedback functions
 */
export const WaterHaptics = {
  // Adding water
  onWaterAdd: (amount: number) => {
    const intensity = Math.min(amount / 500, 1); // Scale based on amount
    triggerHaptic({ type: 'success' });

    // Additional feedback for larger amounts
    if (amount >= 500) {
      setTimeout(() => triggerHaptic({ type: 'impact', intensity }), 100);
    }
  },

  // Target reached
  onTargetReached: () => {
    triggerHaptic('success');
    setTimeout(() => triggerHaptic('heavy'), 200);
    setTimeout(() => triggerHaptic('success'), 400);
  },

  // Streak achievement
  onStreakIncrease: (streak: number) => {
    triggerHaptic('success');

    // Extra haptic for milestones
    if (streak % 7 === 0) { // Weekly milestone
      setTimeout(() => triggerHaptic('heavy'), 150);
    }
    if (streak % 30 === 0) { // Monthly milestone
      setTimeout(() => triggerHaptic('heavy'), 150);
      setTimeout(() => triggerHaptic('success'), 300);
    }
  },

  // Reminder
  onReminder: () => {
    triggerHaptic('medium');
  },

  // Settings changes
  onSettingChange: () => {
    triggerHaptic('selection');
  },

  // Error handling
  onError: () => {
    triggerHaptic('error');
  },
};

export default triggerHaptic;