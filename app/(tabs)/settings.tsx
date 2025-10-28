/**
 * Settings Screen
 * Allows users to configure their water tracking preferences
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity } from 'react-native';

import { useWaterContext } from '../../context/WaterContext';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../utils/constants';

/**
 * Settings screen component
 * @returns {JSX.Element} Settings screen
 */
export default function SettingsScreen() {
  const { state, updateSettings } = useWaterContext();

  /**
   * Toggle reminder enabled state
   */
  const toggleReminderEnabled = async () => {
    await updateSettings({ reminderEnabled: !state.settings.reminderEnabled });
  };

  /**
   * Toggle sound enabled state
   */
  const toggleSoundEnabled = async () => {
    await updateSettings({ soundEnabled: !state.settings.soundEnabled });
  };

  /**
   * Toggle vibration enabled state
   */
  const toggleVibrationEnabled = async () => {
    await updateSettings({ vibrationEnabled: !state.settings.vibrationEnabled });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Customize your water tracking experience</Text>
      </View>

      {/* Daily Target */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Target</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Target Amount</Text>
            <Text style={styles.settingValue}>{state.settings.dailyTarget}ml</Text>
          </View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Change</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Reminders */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reminders</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Enable Reminders</Text>
            <Text style={styles.settingValue}>Every {state.settings.reminderInterval} minutes</Text>
          </View>
          <Switch
            value={state.settings.reminderEnabled}
            onValueChange={toggleReminderEnabled}
            trackColor={{ false: COLORS.BACKGROUND_DISABLED, true: COLORS.PRIMARY_LIGHT }}
            thumbColor={state.settings.reminderEnabled ? COLORS.PRIMARY : COLORS.BACKGROUND_DISABLED}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Sound</Text>
            <Text style={styles.settingDescription}>Play notification sound</Text>
          </View>
          <Switch
            value={state.settings.soundEnabled}
            onValueChange={toggleSoundEnabled}
            trackColor={{ false: COLORS.BACKGROUND_DISABLED, true: COLORS.PRIMARY_LIGHT }}
            thumbColor={state.settings.soundEnabled ? COLORS.PRIMARY : COLORS.BACKGROUND_DISABLED}
            disabled={!state.settings.reminderEnabled}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Vibration</Text>
            <Text style={styles.settingDescription}>Vibrate on notifications</Text>
          </View>
          <Switch
            value={state.settings.vibrationEnabled}
            onValueChange={toggleVibrationEnabled}
            trackColor={{ false: COLORS.BACKGROUND_DISABLED, true: COLORS.PRIMARY_LIGHT }}
            thumbColor={state.settings.vibrationEnabled ? COLORS.PRIMARY : COLORS.BACKGROUND_DISABLED}
            disabled={!state.settings.reminderEnabled}
          />
        </View>
      </View>

      {/* Wake Hours */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wake Hours</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Active Hours</Text>
            <Text style={styles.settingValue}>
              {state.settings.wakeHours.start}:00 - {state.settings.wakeHours.end}:00
            </Text>
          </View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Change</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Data Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Reset Data</Text>
            <Text style={styles.settingDescription}>Clear all tracking data</Text>
          </View>
          <TouchableOpacity style={[styles.button, styles.dangerButton]}>
            <Text style={[styles.buttonText, styles.dangerButtonText]}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Version</Text>
          <Text style={styles.infoValue}>1.1.0</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Target Reached</Text>
          <Text style={styles.infoValue}>{state.today.intake}ml / {state.settings.dailyTarget}ml</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  contentContainer: {
    padding: SPACING.LG,
  },
  header: {
    marginBottom: SPACING.XL,
  },
  title: {
    fontSize: TYPOGRAPHY.FONT_SIZE_3XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    color: COLORS.TEXT_SECONDARY,
  },
  section: {
    marginBottom: SPACING.XL,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE_LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.MD,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS / 2,
  },
  settingValue: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
  },
  settingDescription: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.MD,
  },
  buttonText: {
    color: COLORS.TEXT_WHITE,
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_MEDIUM,
  },
  dangerButton: {
    backgroundColor: COLORS.ERROR,
  },
  dangerButtonText: {
    color: COLORS.TEXT_WHITE,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.SM,
  },
  infoLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    color: COLORS.TEXT_PRIMARY,
  },
  infoValue: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    color: COLORS.TEXT_SECONDARY,
  },
});