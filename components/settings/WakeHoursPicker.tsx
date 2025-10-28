/**
 * Wake Hours Picker component for Water Reminder app
 * Allows users to set their active hours for water reminders
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../utils/constants';
import { useWater } from '../../hooks/useWater';
import { WAKE_HOURS_DEFAULT, WAKE_HOURS_LIMITS } from '../../utils/constants';

/**
 * Wake Hours Picker component props
 */
export interface WakeHoursPickerProps {
  /** Custom style for container */
  style?: any;
  /** Whether to show 24-hour format */
  use24Hour?: boolean;
  /** Custom save handler */
  onSave?: (wakeHours: { start: number; end: number }) => void;
}

/**
 * Time slot button component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Time slot button
 */
const TimeSlot: React.FC<{
  hour: number;
  label: string;
  isSelected: boolean;
  isStart: boolean;
  isEnd: boolean;
  onPress: (hour: number) => void;
  disabled?: boolean;
}> = ({ hour, label, isSelected, isStart, isEnd, onPress, disabled = false }) => {
  return (
    <TouchableOpacity
      style={[
        styles.timeSlot,
        isSelected && styles.timeSlotSelected,
        isStart && styles.timeSlotStart,
        isEnd && styles.timeSlotEnd,
        disabled && styles.timeSlotDisabled,
      ]}
      onPress={() => onPress(hour)}
      disabled={disabled}
      accessibilityLabel={`Select ${label}`}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected, disabled }}
    >
      <Text style={[
        styles.timeSlotText,
        isSelected && styles.timeSlotTextSelected,
        disabled && styles.timeSlotTextDisabled,
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

/**
 * Wake Hours Picker component for setting active reminder hours
 * @param {WakeHoursPickerProps} props - Component props
 * @returns {JSX.Element} Wake hours picker component
 *
 * @example
 * <WakeHoursPicker
 *   use24Hour={false}
 *   onSave={handleSave}
 * />
 */
export const WakeHoursPicker: React.FC<WakeHoursPickerProps> = ({
  style,
  use24Hour = false,
  onSave,
}) => {
  const { state, updateReminderSettings } = useWater();
  const [localWakeHours, setLocalWakeHours] = React.useState({
    start: state.settings.wakeHours.start,
    end: state.settings.wakeHours.end,
  });

  // Update local state when context state changes
  React.useEffect(() => {
    setLocalWakeHours({
      start: state.settings.wakeHours.start,
      end: state.settings.wakeHours.end,
    });
  }, [state.settings.wakeHours]);

  /**
   * Format hour for display
   * @param {number} hour - Hour in 24-hour format (0-23)
   * @returns {string} Formatted time string
   */
  const formatHour = (hour: number): string => {
    if (use24Hour) {
      return `${hour.toString().padStart(2, '0')}:00`;
    } else {
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const period = hour < 12 ? 'AM' : 'PM';
      return `${displayHour}:00 ${period}`;
    }
  };

  /**
   * Handle hour selection for start time
   * @param {number} hour - Selected hour
   */
  const handleStartHourSelect = (hour: number) => {
    // Ensure start hour is before end hour
    const newEndHour = localWakeHours.end <= hour ? Math.min(hour + 1, 23) : localWakeHours.end;
    setLocalWakeHours({
      start: hour,
      end: newEndHour,
    });
  };

  /**
   * Handle hour selection for end time
   * @param {number} hour - Selected hour
   */
  const handleEndHourSelect = (hour: number) => {
    // Ensure end hour is after start hour
    const newStartHour = localWakeHours.start >= hour ? Math.max(hour - 1, 0) : localWakeHours.start;
    setLocalWakeHours({
      start: newStartHour,
      end: hour,
    });
  };

  /**
   * Save wake hours settings
   */
  const handleSave = async () => {
    try {
      await updateReminderSettings({
        wakeHours: {
          start: localWakeHours.start,
          end: localWakeHours.end,
        },
      });

      if (onSave) {
        onSave(localWakeHours);
      }
    } catch (error) {
      console.error('Failed to save wake hours:', error);
    }
  };

  /**
   * Check if settings have changed
   * @returns {boolean} Whether settings have changed
   */
  const hasChanges = () => {
    return (
      localWakeHours.start !== state.settings.wakeHours.start ||
      localWakeHours.end !== state.settings.wakeHours.end
    );
  };

  /**
   * Calculate total active hours
   * @returns {number} Total active hours
   */
  const getTotalHours = (): number => {
    if (localWakeHours.end > localWakeHours.start) {
      return localWakeHours.end - localWakeHours.start;
    } else {
      // Crosses midnight (e.g., 22:00 to 06:00)
      return (24 - localWakeHours.start) + localWakeHours.end;
    }
  };

  /**
   * Generate time slots for the day
   * @returns {Array} Array of time slots
   */
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      slots.push({
        hour,
        label: formatHour(hour),
        isStart: hour === localWakeHours.start,
        isEnd: hour === localWakeHours.end,
        isActive: isHourActive(hour),
      });
    }
    return slots;
  };

  /**
   * Check if an hour is within active wake hours
   * @param {number} hour - Hour to check
   * @returns {boolean} Whether hour is active
   */
  const isHourActive = (hour: number): boolean => {
    if (localWakeHours.start < localWakeHours.end) {
      // Normal case: e.g., 7:00 to 22:00
      return hour >= localWakeHours.start && hour < localWakeHours.end;
    } else {
      // Crosses midnight: e.g., 22:00 to 06:00
      return hour >= localWakeHours.start || hour < localWakeHours.end;
    }
  };

  const timeSlots = generateTimeSlots();
  const totalHours = getTotalHours();

  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Wake Hours</Text>
        <Text style={styles.subtitle}>
          Set your active hours for water reminders
        </Text>
      </View>

      {/* Current selection display */}
      <View style={styles.currentSelection}>
        <View style={styles.selectionItem}>
          <Text style={styles.selectionLabel}>Wake Up</Text>
          <Text style={styles.selectionValue}>{formatHour(localWakeHours.start)}</Text>
        </View>
        <View style={styles.selectionDivider} />
        <View style={styles.selectionItem}>
          <Text style={styles.selectionLabel}>Sleep</Text>
          <Text style={styles.selectionValue}>{formatHour(localWakeHours.end)}</Text>
        </View>
        <View style={styles.selectionDivider} />
        <View style={styles.selectionItem}>
          <Text style={styles.selectionLabel}>Total</Text>
          <Text style={styles.selectionValue}>{totalHours} hours</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Start time selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Wake Time</Text>
          <Text style={styles.sectionDescription}>
            When should reminders start?
          </Text>
          <View style={styles.timeGrid}>
            {timeSlots
              .filter(slot => slot.hour >= WAKE_HOURS_LIMITS.START_MIN && slot.hour <= 12)
              .map((slot) => (
                <TimeSlot
                  key={`start-${slot.hour}`}
                  hour={slot.hour}
                  label={slot.label}
                  isSelected={slot.isStart}
                  isStart={true}
                  isEnd={false}
                  onPress={handleStartHourSelect}
                />
              ))}
          </View>
        </View>

        {/* End time selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sleep Time</Text>
          <Text style={styles.sectionDescription}>
            When should reminders stop?
          </Text>
          <View style={styles.timeGrid}>
            {timeSlots
              .filter(slot => slot.hour >= 12 && slot.hour <= WAKE_HOURS_LIMITS.END_MAX)
              .map((slot) => (
                <TimeSlot
                  key={`end-${slot.hour}`}
                  hour={slot.hour}
                  label={slot.label}
                  isSelected={slot.isEnd}
                  isStart={false}
                  isEnd={true}
                  onPress={handleEndHourSelect}
                />
              ))}
          </View>
        </View>

        {/* Visual timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>24-Hour Timeline</Text>
          <View style={styles.timelineContainer}>
            {timeSlots.map((slot) => (
              <View
                key={`timeline-${slot.hour}`}
                style={[
                  styles.timelineSlot,
                  slot.isActive && styles.timelineSlotActive,
                  slot.isStart && styles.timelineSlotStart,
                  slot.isEnd && styles.timelineSlotEnd,
                ]}
              >
                <Text style={[
                  styles.timelineSlotText,
                  slot.isActive && styles.timelineSlotTextActive,
                ]}>
                  {slot.hour}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.timelineLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.BACKGROUND_DISABLED }]} />
              <Text style={styles.legendText}>Sleep</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.PRIMARY_LIGHT }]} />
              <Text style={styles.legendText}>Active</Text>
            </View>
          </View>
        </View>

        {/* Quick presets */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Presets</Text>
          <View style={styles.presetsGrid}>
            {[
              { name: 'Early Bird', start: 5, end: 22 },
              { name: 'Standard', start: 7, end: 22 },
              { name: 'Night Owl', start: 10, end: 2 },
              { name: '24/7', start: 0, end: 24 },
            ].map((preset) => (
              <TouchableOpacity
                key={preset.name}
                style={[
                  styles.presetButton,
                  localWakeHours.start === preset.start && localWakeHours.end === preset.end && styles.presetButtonSelected,
                ]}
                onPress={() => setLocalWakeHours({ start: preset.start, end: preset.end })}
              >
                <Text style={[
                  styles.presetText,
                  localWakeHours.start === preset.start && localWakeHours.end === preset.end && styles.presetTextSelected,
                ]}>
                  {preset.name}
                </Text>
                <Text style={styles.presetSubtext}>
                  {formatHour(preset.start)} - {formatHour(preset.end === 24 ? 0 : preset.end)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Info section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>ℹ️ About Wake Hours</Text>
          <View style={styles.infoList}>
            <Text style={styles.infoItem}>• Reminders only sent during your active hours</Text>
            <Text style={styles.infoItem}>• Daily reset happens at midnight regardless</Text>
            <Text style={styles.infoItem}>• Cross-midnight schedules are supported</Text>
            <Text style={styles.infoItem}>• Minimum 4 hours of sleep recommended</Text>
          </View>
        </View>

        {/* Save button */}
        {hasChanges() && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Wake Hours</Text>
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

  currentSelection: {
    flexDirection: 'row',
    padding: SPACING.LG,
    backgroundColor: COLORS.BACKGROUND_CARD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },

  selectionItem: {
    flex: 1,
    alignItems: 'center',
  },

  selectionLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.XS,
  },

  selectionValue: {
    fontSize: TYPOGRAPHY.FONT_SIZE_LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    color: COLORS.PRIMARY,
  },

  selectionDivider: {
    width: 1,
    backgroundColor: COLORS.BORDER,
    marginHorizontal: SPACING.SM,
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

  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.SM,
  },

  timeSlot: {
    flex: 1,
    minWidth: '22%',
    backgroundColor: COLORS.BACKGROUND_CARD,
    padding: SPACING.SM,
    borderRadius: BORDER_RADIUS.MD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    alignItems: 'center',
    minHeight: 50,
  },

  timeSlotSelected: {
    backgroundColor: COLORS.PRIMARY_LIGHT,
    borderColor: COLORS.PRIMARY,
    borderWidth: 2,
  },

  timeSlotStart: {
    borderTopLeftRadius: BORDER_RADIUS.LG,
    borderBottomLeftRadius: BORDER_RADIUS.LG,
  },

  timeSlotEnd: {
    borderTopRightRadius: BORDER_RADIUS.LG,
    borderBottomRightRadius: BORDER_RADIUS.LG,
  },

  timeSlotDisabled: {
    opacity: 0.5,
  },

  timeSlotText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_XS,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
  },

  timeSlotTextSelected: {
    color: COLORS.PRIMARY,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
  },

  timeSlotTextDisabled: {
    color: COLORS.TEXT_DISABLED,
  },

  timelineContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    marginBottom: SPACING.MD,
  },

  timelineSlot: {
    width: '3.7%',
    height: 30,
    backgroundColor: COLORS.BACKGROUND_DISABLED,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },

  timelineSlotActive: {
    backgroundColor: COLORS.PRIMARY_LIGHT,
  },

  timelineSlotStart: {
    backgroundColor: COLORS.SUCCESS,
  },

  timelineSlotEnd: {
    backgroundColor: COLORS.ERROR,
  },

  timelineSlotText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_XS,
    color: COLORS.TEXT_DISABLED,
  },

  timelineSlotTextActive: {
    color: COLORS.PRIMARY,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
  },

  timelineLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.LG,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.XS,
  },

  legendDot: {
    width: 8,
    height: 8,
    borderRadius: BORDER_RADIUS.FULL,
  },

  legendText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
  },

  presetsGrid: {
    gap: SPACING.SM,
  },

  presetButton: {
    backgroundColor: COLORS.BACKGROUND_CARD,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },

  presetButtonSelected: {
    backgroundColor: COLORS.PRIMARY_LIGHT,
    borderColor: COLORS.PRIMARY,
  },

  presetText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 2,
  },

  presetTextSelected: {
    color: COLORS.PRIMARY,
  },

  presetSubtext: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
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
});