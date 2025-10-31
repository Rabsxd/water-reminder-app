/**
 * Settings Screen
 * Allows users to configure their water tracking preferences
 */

import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { useWater } from '../../hooks/useWater';
import { COLORS, SPACING, TYPOGRAPHY } from '../../utils/constants';
import { Header } from '../../components/common/Header';
import { TargetSlider } from '../../components/settings/TargetSlider';
import { ReminderSettings } from '../../components/settings/ReminderSettings';
import { WakeHoursPicker } from '../../components/settings/WakeHoursPicker';
import { DataResetDialog } from '../../components/settings/DataResetDialog';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

/**
 * Settings screen component
 * @returns {JSX.Element} Settings screen
 */
export default function SettingsScreen() {
  const { state, updateSettings } = useWater();
  const [showResetDialog, setShowResetDialog] = React.useState(false);

  return (
    <>
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

        {/* Data Reset */}
        <Card variant="default" padding="lg">
          <Button
            variant="danger"
            onPress={() => setShowResetDialog(true)}
            accessibilityLabel="Reset all water tracking data"
          >
            Reset All Data
          </Button>
          <Text style={styles.resetWarning}>
            ⚠️ This will permanently delete all your water tracking data, settings, and history.
          </Text>
        </Card>
      </ScrollView>

      {/* Data Reset Dialog */}
      <DataResetDialog
        visible={showResetDialog}
        onClose={() => setShowResetDialog(false)}
      />
    </>
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
  resetWarning: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginTop: SPACING.SM,
    fontStyle: 'italic',
  },
});