/**
 * Reminder Settings component for Water Reminder app
 * Allows users to configure reminder intervals and notification preferences
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, REMINDER_INTERVALS, REMINDER_INTERVAL_LIMITS } from '../../utils/constants';
import { useWater } from '../../hooks/useWater';

/**
 * Reminder Settings component props
 */
export interface ReminderSettingsProps {
  /** Custom style for container */
  style?: any;
  /** Whether to show advanced options */
  showAdvanced?: boolean;
  /** Custom save handler */
  onSave?: (settings: {
    enabled: boolean;
    interval: number;
    sound: boolean;
    vibration: boolean;
  }) => void;
}

/**
 * Interval option button component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Interval option button
 */
const IntervalOption: React.FC<{
  value: number;
  label: string;
  selected: boolean;
  onPress: (value: number) => void;
  disabled?: boolean;
}> = ({ value, label, selected, onPress, disabled = false }) => {
  return (
    <TouchableOpacity
      style={[
        styles.intervalOption,
        selected && styles.intervalOptionSelected,
        disabled && styles.intervalOptionDisabled,
      ]}
      onPress={() => onPress(value)}
      disabled={disabled}
      accessibilityLabel={`Set reminder interval to ${label}`}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
    >
      <Text style={[
        styles.intervalText,
        selected && styles.intervalTextSelected,
        disabled && styles.intervalTextDisabled,
      ]}>
        {label}
      </Text>
      <Text style={[
        styles.intervalSubtext,
        selected && styles.intervalSubtextSelected,
        disabled && styles.intervalSubtextDisabled,
      ]}>
        {value < 60 ? `${value} min` : `${value / 60} hour${value > 60 ? 's' : ''}`}
      </Text>
    </TouchableOpacity>
  );
};

/**
 * Toggle option component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Toggle option component
 */
const ToggleOption: React.FC<{
  label: string;
  description?: string;
  value: boolean;
  onToggle: (value: boolean) => void;
  disabled?: boolean;
  icon?: string;
}> = ({ label, description, value, onToggle, disabled = false, icon }) => {
  return (
    <View style={[styles.toggleOption, disabled && styles.toggleOptionDisabled]}>
      <View style={styles.toggleInfo}>
        <View style={styles.toggleHeader}>
          {icon && <Text style={styles.toggleIcon}>{icon}</Text>}
          <Text style={[styles.toggleLabel, disabled && styles.toggleLabelDisabled]}>
            {label}
          </Text>
        </View>
        {description && (
          <Text style={[styles.toggleDescription, disabled && styles.toggleDescriptionDisabled]}>
            {description}
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.toggleButton,
          value ? styles.toggleButtonOn : styles.toggleButtonOff,
          disabled && styles.toggleButtonDisabled,
        ]}
        onPress={() => onToggle(!value)}
        disabled={disabled}
        accessibilityLabel={`${label}: ${value ? 'enabled' : 'disabled'}`}
        accessibilityRole="switch"
        accessibilityState={{ checked: value, disabled }}
      >
        <View style={[
          styles.toggleThumb,
          value ? styles.toggleThumbOn : styles.toggleThumbOff,
        ]} />
      </TouchableOpacity>
    </View>
  );
};

/**
 * Reminder Settings component with interval and notification preferences
 * @param {ReminderSettingsProps} props - Component props
 * @returns {JSX.Element} Reminder settings component
 *
 * @example
 * <ReminderSettings
 *   showAdvanced={true}
 *   onSave={handleSave}
 * />
 */
export const ReminderSettings: React.FC<ReminderSettingsProps> = ({
  style,
  showAdvanced = false,
  onSave,
}) => {
  const {
    state,
    updateReminderSettings,
    notificationsEnabled,
    notificationPermissionStatus,
    showTestNotification,
    requestNotificationPermissions,
    notificationError
  } = useWater();
  const [localSettings, setLocalSettings] = React.useState({
    enabled: state.settings.reminderEnabled,
    interval: state.settings.reminderInterval,
    sound: state.settings.soundEnabled,
    vibration: state.settings.vibrationEnabled,
  });

  const [customInterval, setCustomInterval] = React.useState(
    state.settings.reminderInterval
  );

  // Update local state when context state changes
  React.useEffect(() => {
    setLocalSettings({
      enabled: state.settings.reminderEnabled,
      interval: state.settings.reminderInterval,
      sound: state.settings.soundEnabled,
      vibration: state.settings.vibrationEnabled,
    });
    setCustomInterval(state.settings.reminderInterval);
  }, [state.settings]);

  /**
   * Handle interval selection
   * @param {number} interval - Selected interval in minutes
   */
  const handleIntervalSelect = (interval: number) => {
    setLocalSettings(prev => ({ ...prev, interval }));
    setCustomInterval(interval);
  };

  /**
   * Handle custom interval change
   * @param {number} interval - Custom interval value
   */
  const handleCustomIntervalChange = (interval: number) => {
    const clampedInterval = Math.max(
      REMINDER_INTERVAL_LIMITS.MIN,
      Math.min(REMINDER_INTERVAL_LIMITS.MAX, interval)
    );
    setCustomInterval(clampedInterval);
    setLocalSettings(prev => ({ ...prev, interval: clampedInterval }));
  };

  /**
   * Handle toggle changes
   * @param {string} key - Setting key
   * @param {boolean} value - New value
   */
  const handleToggleChange = (key: keyof typeof localSettings, value: boolean) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  /**
   * Save settings
   */
  const handleSave = async () => {
    try {
      await updateReminderSettings({
        enabled: localSettings.enabled,
        interval: localSettings.interval,
        sound: localSettings.sound,
        vibration: localSettings.vibration,
      });

      if (onSave) {
        onSave(localSettings);
      }
    } catch (error) {
      console.error('Failed to save reminder settings:', error);
    }
  };

  /**
   * Check if settings have changed
   * @returns {boolean} Whether settings have changed
   */
  const hasChanges = () => {
    return (
      localSettings.enabled !== state.settings.reminderEnabled ||
      localSettings.interval !== state.settings.reminderInterval ||
      localSettings.sound !== state.settings.soundEnabled ||
      localSettings.vibration !== state.settings.vibrationEnabled
    );
  };

  const isCustomInterval = !REMINDER_INTERVALS.includes(localSettings.interval as any);

  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Reminder Settings</Text>
        <Text style={styles.subtitle}>
          Configure when and how you receive water reminders
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Enable/Disable reminders */}
        <View style={styles.section}>
          <ToggleOption
            label="Enable Reminders"
            description="Receive periodic notifications to drink water"
            value={localSettings.enabled}
            onToggle={(value) => handleToggleChange('enabled', value)}
            icon="🔔"
          />
        </View>

        {/* Interval selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reminder Interval</Text>
          <Text style={styles.sectionDescription}>
            How often to remind you to drink water
          </Text>

          <View style={styles.intervalGrid}>
            {REMINDER_INTERVALS.map((interval) => (
              <IntervalOption
                key={interval}
                value={interval}
                label={interval < 60 ? `${interval} min` : `${interval / 60}h`}
                selected={localSettings.interval === interval}
                onPress={handleIntervalSelect}
                disabled={!localSettings.enabled}
              />
            ))}

            {showAdvanced && (
              <IntervalOption
                value={customInterval}
                label="Custom"
                selected={isCustomInterval}
                onPress={() => handleCustomIntervalChange(customInterval)}
                disabled={!localSettings.enabled}
              />
            )}
          </View>

          {/* Custom interval input */}
          {showAdvanced && isCustomInterval && (
            <View style={styles.customIntervalContainer}>
              <Text style={styles.customIntervalLabel}>
                Custom Interval (minutes)
              </Text>
              <View style={styles.customIntervalInput}>
                <Text style={styles.customIntervalValue}>{customInterval}</Text>
                <TouchableOpacity
                  style={styles.intervalAdjustButton}
                  onPress={() => handleCustomIntervalChange(customInterval - 15)}
                >
                  <Text style={styles.intervalAdjustText}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.intervalAdjustButton}
                  onPress={() => handleCustomIntervalChange(customInterval + 15)}
                >
                  <Text style={styles.intervalAdjustText}>+</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.customIntervalRange}>
                Range: {REMINDER_INTERVAL_LIMITS.MIN} - {REMINDER_INTERVAL_LIMITS.MAX} minutes
              </Text>
            </View>
          )}
        </View>

        {/* Sound and vibration settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Options</Text>

          <ToggleOption
            label="Sound"
            description="Play notification sound when reminded"
            value={localSettings.sound}
            onToggle={(value) => handleToggleChange('sound', value)}
            disabled={!localSettings.enabled}
            icon="🔊"
          />

          <ToggleOption
            label="Vibration"
            description="Vibrate device when reminded"
            value={localSettings.vibration}
            onToggle={(value) => handleToggleChange('vibration', value)}
            disabled={!localSettings.enabled}
            icon="📳"
          />
        </View>

        {/* Notification Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Status</Text>

          <View style={styles.statusContainer}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Permissions:</Text>
              <Text style={[
                styles.statusValue,
                notificationPermissionStatus === 'granted' ? styles.statusGranted : styles.statusDenied
              ]}>
                {notificationPermissionStatus === 'granted' ? '✅ Granted' :
                 notificationPermissionStatus === 'denied' ? '❌ Denied' :
                 '⏳ Not Set'}
              </Text>
            </View>

            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Service:</Text>
              <Text style={[
                styles.statusValue,
                notificationsEnabled ? styles.statusGranted : styles.statusDenied
              ]}>
                {notificationsEnabled ? '✅ Active' : '❌ Disabled'}
              </Text>
            </View>
          </View>

          {/* Permission request button */}
          {notificationPermissionStatus !== 'granted' && (
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={requestNotificationPermissions}
            >
              <Text style={styles.permissionButtonText}>Enable Notifications</Text>
            </TouchableOpacity>
          )}

          {/* Test notification button */}
          {notificationPermissionStatus === 'granted' && localSettings.enabled && (
            <TouchableOpacity
              style={styles.testButton}
              onPress={showTestNotification}
            >
              <Text style={styles.testButtonText}>🔔 Test Notification</Text>
            </TouchableOpacity>
          )}

          {/* Error display */}
          {notificationError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>⚠️ {notificationError}</Text>
            </View>
          )}
        </View>

        {/* Info section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>ℹ️ How Reminders Work</Text>
          <View style={styles.infoList}>
            <Text style={styles.infoItem}>• Active only during wake hours (Settings → Wake Hours)</Text>
            <Text style={styles.infoItem}>• Paused when daily target is reached</Text>
            <Text style={styles.infoItem}>• Smart scheduling avoids recent reminders</Text>
            <Text style={styles.infoItem}>• Requires notification permissions</Text>
          </View>
        </View>

        {/* Save button */}
        {hasChanges() && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },

  header: {
    padding: SPACING.LG,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },

  title: {
    fontSize: TYPOGRAPHY.FONT_SIZE_XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },

  subtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT_NORMAL * TYPOGRAPHY.FONT_SIZE_SM,
  },

  section: {
    padding: SPACING.LG,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },

  sectionTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE_LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },

  sectionDescription: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.MD,
  },

  intervalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.SM,
  },

  intervalOption: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.BACKGROUND_CARD,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    borderWidth: 2,
    borderColor: COLORS.BORDER,
    alignItems: 'center',
    minHeight: 80,
  },

  intervalOptionSelected: {
    backgroundColor: COLORS.PRIMARY_LIGHT,
    borderColor: COLORS.PRIMARY,
  },

  intervalOptionDisabled: {
    opacity: 0.5,
  },

  intervalText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },

  intervalTextSelected: {
    color: COLORS.PRIMARY,
  },

  intervalTextDisabled: {
    color: COLORS.TEXT_DISABLED,
  },

  intervalSubtext: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
  },

  intervalSubtextSelected: {
    color: COLORS.PRIMARY,
  },

  intervalSubtextDisabled: {
    color: COLORS.TEXT_DISABLED,
  },

  customIntervalContainer: {
    marginTop: SPACING.MD,
    padding: SPACING.MD,
    backgroundColor: COLORS.BACKGROUND_CARD,
    borderRadius: BORDER_RADIUS.MD,
  },

  customIntervalLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.SM,
  },

  customIntervalInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.SM,
  },

  customIntervalValue: {
    fontSize: TYPOGRAPHY.FONT_SIZE_XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    color: COLORS.PRIMARY,
  },

  intervalAdjustButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.FULL,
    backgroundColor: COLORS.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },

  intervalAdjustText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    color: COLORS.TEXT_WHITE,
  },

  customIntervalRange: {
    fontSize: TYPOGRAPHY.FONT_SIZE_XS,
    color: COLORS.TEXT_DISABLED,
    textAlign: 'center',
  },

  toggleOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.MD,
  },

  toggleOptionDisabled: {
    opacity: 0.5,
  },

  toggleInfo: {
    flex: 1,
    marginRight: SPACING.MD,
  },

  toggleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },

  toggleIcon: {
    fontSize: 18,
    marginRight: SPACING.SM,
  },

  toggleLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_MEDIUM,
    color: COLORS.TEXT_PRIMARY,
  },

  toggleLabelDisabled: {
    color: COLORS.TEXT_DISABLED,
  },

  toggleDescription: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT_NORMAL * TYPOGRAPHY.FONT_SIZE_SM,
  },

  toggleDescriptionDisabled: {
    color: COLORS.TEXT_DISABLED,
  },

  toggleButton: {
    width: 51,
    height: 31,
    borderRadius: BORDER_RADIUS.FULL,
    padding: 2,
  },

  toggleButtonOn: {
    backgroundColor: COLORS.PRIMARY,
  },

  toggleButtonOff: {
    backgroundColor: COLORS.BACKGROUND_DISABLED,
  },

  toggleButtonDisabled: {
    opacity: 0.5,
  },

  toggleThumb: {
    width: 27,
    height: 27,
    borderRadius: BORDER_RADIUS.FULL,
    backgroundColor: COLORS.TEXT_WHITE,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },

  toggleThumbOn: {
    alignSelf: 'flex-end',
  },

  toggleThumbOff: {
    alignSelf: 'flex-start',
  },

  infoSection: {
    margin: SPACING.LG,
    padding: SPACING.MD,
    backgroundColor: COLORS.INFO + '10',
    borderRadius: BORDER_RADIUS.MD,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.INFO,
  },

  infoTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
    color: COLORS.INFO,
    marginBottom: SPACING.SM,
  },

  infoList: {
    gap: SPACING.XS,
  },

  infoItem: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT_NORMAL * TYPOGRAPHY.FONT_SIZE_SM,
  },

  saveButton: {
    margin: SPACING.LG,
    padding: SPACING.MD,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: BORDER_RADIUS.LG,
    alignItems: 'center',
  },

  saveButtonText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
    color: COLORS.TEXT_WHITE,
  },

  // Notification status styles
  statusContainer: {
    gap: SPACING.SM,
    marginBottom: SPACING.MD,
  },

  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.SM,
  },

  statusLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_MEDIUM,
  },

  statusValue: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
  },

  statusGranted: {
    color: COLORS.SUCCESS,
  },

  statusDenied: {
    color: COLORS.ERROR,
  },

  permissionButton: {
    backgroundColor: COLORS.PRIMARY,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.LG,
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },

  permissionButtonText: {
    color: COLORS.TEXT_WHITE,
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
  },

  testButton: {
    backgroundColor: COLORS.SUCCESS,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.LG,
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },

  testButtonText: {
    color: COLORS.TEXT_WHITE,
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
  },

  errorContainer: {
    backgroundColor: COLORS.ERROR + '20',
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.ERROR,
  },

  errorText: {
    color: COLORS.ERROR,
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
  },
});