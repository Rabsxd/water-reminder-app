/**
 * Accessibility hook for Water Reminder app
 * Provides accessibility utilities and screen reader support
 */

import { useState, useEffect } from 'react';
import { Platform, AccessibilityInfo } from 'react-native';
import { ACCESSIBILITY } from '../utils/constants';

/**
 * Accessibility state interface
 */
interface AccessibilityState {
  isScreenReaderEnabled: boolean;
  isReduceMotionEnabled: boolean;
  isHighContrastEnabled: boolean;
  isLargeTextEnabled: boolean;
  preferDarkMode: boolean;
}

/**
 * Accessibility utilities interface
 */
interface AccessibilityUtils {
  /**
   * Current accessibility state
   */
  state: AccessibilityState;

  /**
   * Check if accessibility features are enabled
   */
  isAccessibilityEnabled: boolean;

  /**
   * Get accessibility label for water amount
   */
  getWaterAmountLabel: (amount: number) => string;

  /**
   * Get accessibility label for progress percentage
   */
  getProgressLabel: (current: number, target: number) => string;

  /**
   * Get accessibility label for time
   */
  getTimeLabel: (time: string) => string;

  /**
   * Get accessibility hint for buttons
   */
  getButtonHint: (action: string, result?: string) => string;

  /**
   * Get minimum touch target size
   */
  getTouchTargetSize: (customSize?: number) => number;

  /**
   * Check if element should have accessibility focus
   */
  shouldHaveAccessibilityFocus: (elementType: string) => boolean;

  /**
   * Get accessibility properties for elements
   */
  getAccessibilityProps: (options: {
    label?: string;
    hint?: string;
    role?: string;
    state?: Partial<AccessibilityState>;
  }) => {
    accessible: boolean;
    accessibilityLabel?: string;
    accessibilityHint?: string;
    accessibilityRole?: string;
    accessibilityState?: {
      disabled?: boolean;
      selected?: boolean;
      busy?: boolean;
      checked?: boolean;
      expanded?: boolean;
    };
  };
}

/**
 * Hook for accessibility utilities
 * @returns {AccessibilityUtils} Accessibility utilities and state
 *
 * @example
 * const { state, getWaterAmountLabel, getAccessibilityProps } = useAccessibility();
 *
 * // Get accessibility label
 * const label = getWaterAmountLabel(250);
 *
 * // Get accessibility props for a button
 * const props = getAccessibilityProps({
 *   label: 'Tambah 250 ml air',
 *   hint: 'Menambah 250 mililiter air ke target harian Anda',
 *   role: 'button',
 * });
 */
export const useAccessibility = (): AccessibilityUtils => {
  const [state, setState] = useState<AccessibilityState>({
    isScreenReaderEnabled: false,
    isReduceMotionEnabled: false,
    isHighContrastEnabled: false,
    isLargeTextEnabled: false,
    preferDarkMode: false,
  });

  // Check accessibility settings on mount
  useEffect(() => {
    const checkAccessibilitySettings = async () => {
      try {
        const [
          isScreenReaderEnabled,
          isReduceMotionEnabled,
          isHighContrastEnabled,
        ] = await Promise.all([
          AccessibilityInfo.isScreenReaderEnabled(),
          AccessibilityInfo.isReduceMotionEnabled(),
          Platform.select({
            ios: () => Promise.resolve(false), // iOS doesn't expose this
            android: () => AccessibilityInfo.isScreenReaderEnabled(), // Use as proxy
            default: () => Promise.resolve(false),
          })(),
        ]);

        setState(prev => ({
          ...prev,
          isScreenReaderEnabled,
          isReduceMotionEnabled,
          isHighContrastEnabled,
        }));
      } catch (error) {
        console.warn('Failed to check accessibility settings:', error);
      }
    };

    checkAccessibilitySettings();

    // Listen for accessibility changes
    const screenReaderSubscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      (isEnabled) => {
        setState(prev => ({ ...prev, isScreenReaderEnabled: isEnabled }));
      }
    );

    const reduceMotionSubscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (isEnabled) => {
        setState(prev => ({ ...prev, isReduceMotionEnabled: isEnabled }));
      }
    );

    return () => {
      screenReaderSubscription?.remove();
      reduceMotionSubscription?.remove();
    };
  }, []);

  // Check if any accessibility features are enabled
  const isAccessibilityEnabled = Object.values(state).some(Boolean);

  /**
   * Get accessibility label for water amount
   */
  const getWaterAmountLabel = (amount: number): string => {
    return ACCESSIBILITY.LABELS.WATER_AMOUNT(amount);
  };

  /**
   * Get accessibility label for progress percentage
   */
  const getProgressLabel = (current: number, target: number): string => {
    const percentage = Math.round((current / target) * 100);
    return ACCESSIBILITY.LABELS.PROGRESS_PERCENTAGE(percentage);
  };

  /**
   * Get accessibility label for time
   */
  const getTimeLabel = (time: string): string => {
    try {
      const date = new Date(time);
      const hours = date.getHours();
      const minutes = date.getMinutes();

      if (state.isScreenReaderEnabled) {
        return `Pukul ${hours.toString().padStart(2, '0')} ${minutes.toString().padStart(2, '0')}`;
      }

      return `${hours}:${minutes.toString().padStart(2, '0')}`;
    } catch {
      return time;
    }
  };

  /**
   * Get accessibility hint for buttons
   */
  const getButtonHint = (action: string, result?: string): string => {
    if (state.isScreenReaderEnabled && result) {
      return `${action}. ${result}`;
    }
    return action;
  };

  /**
   * Get minimum touch target size
   */
  const getTouchTargetSize = (customSize?: number): number => {
    return customSize || ACCESSIBILITY.MIN_TOUCH_TARGET;
  };

  /**
   * Check if element should have accessibility focus
   */
  const shouldHaveAccessibilityFocus = (elementType: string): boolean => {
    // Elements that should always be accessible
    const focusableElements = [
      'button',
      'input',
      'switch',
      'slider',
      'tab',
      'link',
      'menu',
    ];

    return focusableElements.includes(elementType.toLowerCase()) || state.isScreenReaderEnabled;
  };

  /**
   * Get accessibility properties for elements
   */
  const getAccessibilityProps = (options: {
    label?: string;
    hint?: string;
    role?: string;
    state?: Partial<AccessibilityState>;
  }) => {
    const {
      label,
      hint,
      role,
      state: elementState,
    } = options;

    const props: any = {
      accessible: true,
    };

    if (label) {
      props.accessibilityLabel = label;
    }

    if (hint && state.isScreenReaderEnabled) {
      props.accessibilityHint = hint;
    }

    if (role) {
      props.accessibilityRole = role;
    }

    // Set accessibility state if provided
    if (elementState) {
      props.accessibilityState = {
        disabled: elementState.isScreenReaderEnabled ? false : undefined,
        selected: elementState.isHighContrastEnabled ? true : undefined,
        busy: elementState.isReduceMotionEnabled ? true : undefined,
      };
    }

    return props;
  };

  return {
    state,
    isAccessibilityEnabled,
    getWaterAmountLabel,
    getProgressLabel,
    getTimeLabel,
    getButtonHint,
    getTouchTargetSize,
    shouldHaveAccessibilityFocus,
    getAccessibilityProps,
  };
};

/**
 * Hook for accessibility announcements
 * @returns {Object} Announcement utilities
 */
export const useAccessibilityAnnouncement = () => {
  const { state } = useAccessibility();

  /**
   * Make announcement to screen reader
   */
  const announce = (message: string): void => {
    if (state.isScreenReaderEnabled) {
      // For iOS
      if (Platform.OS === 'ios') {
        AccessibilityInfo.announceForAccessibility(message);
      }
      // For Android, we would need to use a native module
      // For now, just log the message
      console.log('Accessibility announcement:', message);
    }
  };

  /**
   * Announce water intake change
   */
  const announceWaterIntake = (amount: number, total: number, target: number): void => {
    const percentage = Math.round((total / target) * 100);
    const message = `${amount} mililiter air ditambahkan. Total ${total} mililiter, ${percentage} persen dari target.`;
    announce(message);
  };

  /**
   * Announce achievement
   */
  const announceAchievement = (achievement: string): void => {
    announce(`Selamat! ${achievement}`);
  };

  /**
   * Announce error
   */
  const announceError = (error: string): void => {
    announce(`Error: ${error}`);
  };

  return {
    announce,
    announceWaterIntake,
    announceAchievement,
    announceError,
  };
};

/**
 * Hook for accessibility testing utilities
 * @returns {Object} Testing utilities
 */
export const useAccessibilityTesting = () => {
  const { state, getAccessibilityProps } = useAccessibility();

  /**
   * Generate test ID for accessibility testing
   */
  const getTestId = (componentName: string, identifier?: string): string => {
    const base = componentName.replace(/([A-Z])/g, '-$1').toLowerCase();
    return identifier ? `${base}-${identifier}` : base;
  };

  /**
   * Get accessibility props with test ID
   */
  const getTestableProps = (options: {
    name: string;
    id?: string;
    label?: string;
    hint?: string;
    role?: string;
  }) => {
    const { name, id, label, hint, role } = options;

    return {
      testID: getTestId(name, id),
      ...getAccessibilityProps({
        label,
        hint,
        role,
      }),
    };
  };

  /**
   * Check if component should be tested for accessibility
   */
  const shouldTestAccessibility = (componentType: string): boolean => {
    const testableComponents = [
      'button',
      'input',
      'image',
      'link',
      'heading',
      'list',
      'tab',
      'switch',
      'slider',
    ];

    return state.isScreenReaderEnabled || testableComponents.includes(componentType.toLowerCase());
  };

  return {
    getTestId,
    getTestableProps,
    shouldTestAccessibility,
  };
};

/**
 * Default export
 */
export default useAccessibility;