/**
 * Settings Screen
 * Allows users to configure their water tracking preferences
 */

import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { useWater } from '../../hooks/useWater';
import { COLORS, SPACING } from '../../utils/constants';
import { Header } from '../../components/common/Header';
import { TargetSlider } from '../../components/settings/TargetSlider';
import { ReminderSettings } from '../../components/settings/ReminderSettings';
import { WakeHoursPicker } from '../../components/settings/WakeHoursPicker';

/**
 * Settings screen component
 * @returns {JSX.Element} Settings screen
 */
export default function SettingsScreen() {
  const { state, updateSettings } = useWater();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <Header
        title="Settings"
        subtitle="Customize your water tracking experience"
        size="lg"
        align="center"
      />

      {/* Daily Target */}
      <TargetSlider
        showDetails={true}
      />

      {/* Reminder Settings */}
      <ReminderSettings
        showAdvanced={true}
      />

      {/* Wake Hours */}
      <WakeHoursPicker
        use24Hour={false}
      />
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
    gap: SPACING.MD,
  },
});