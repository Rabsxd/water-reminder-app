/**
 * Home Screen
 * Main screen for water tracking with progress circle and quick add buttons
 */

import React from 'react';
import { ScrollView, StyleSheet, Alert, View, Text } from 'react-native';

import { useWater } from '../../hooks/useWater';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../utils/constants';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { ProgressCircle } from '../../components/home/ProgressCircle';
import { QuickAddButtons } from '../../components/home/QuickAddButtons';
import { TodayLogList } from '../../components/home/TodayLogList';

/**
 * Home screen component
 * @returns {JSX.Element} Home screen with water tracking interface
 */
export default function HomeScreen() {
  const {
    state,
    stats,
    progress,
    isTargetReached,
    addQuickAmount,
    todayLogsCount,
    clearError,
  } = useWater();

  /**
   * Handle quick add button press
   * @param {number} amount - Amount to add in milliliters
   */
  const handleQuickAdd = async (amount: number) => {
    await addQuickAmount(amount);
  };

  /**
   * Show success message when target is reached
   */
  React.useEffect(() => {
    if (isTargetReached) {
      Alert.alert(
        '🎉 Congratulations!',
        `You've reached your daily target of ${state.settings.dailyTarget}ml!`,
        [{ text: 'Awesome!', style: 'default' }]
      );
    }
  }, [isTargetReached, state.settings.dailyTarget]);

  // Clear any errors when component mounts
  React.useEffect(() => {
    clearError();
  }, [clearError]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <Header
        title="Water Reminder"
        subtitle="Track your daily hydration"
        size="lg"
        align="center"
      />

      {/* Progress Circle */}
      <Card variant="elevated" padding="lg">
        <ProgressCircle
          progress={progress}
          size={200}
          current={stats.intake}
          target={stats.target}
          showPercentage={true}
          showTarget={true}
        />
      </Card>

      {/* Current Stats */}
      <Card variant="default" padding="md">
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.intake}</Text>
            <Text style={styles.statLabel}>ml today</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.remaining}</Text>
            <Text style={styles.statLabel}>ml remaining</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{todayLogsCount}</Text>
            <Text style={styles.statLabel}>entries</Text>
          </View>
        </View>
      </Card>

      {/* Quick Add Buttons */}
      <Card variant="default" padding="md">
        <QuickAddButtons
          style={styles.quickAddContainer}
        />
      </Card>

      {/* Today's Logs */}
      <Card variant="default" padding="md">
        <TodayLogList
          maxItems={10}
          showDeleteButtons={true}
        />
      </Card>

      {/* Error Display */}
      {state.error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {state.error}</Text>
          <Text onPress={clearError} style={styles.errorDismissText}>Dismiss</Text>
        </View>
      )}
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: TYPOGRAPHY.FONT_SIZE_XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    color: COLORS.PRIMARY,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.XS,
  },
  errorContainer: {
    backgroundColor: COLORS.ERROR,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.LG,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: COLORS.TEXT_WHITE,
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    flex: 1,
  },
  errorDismissText: {
    color: COLORS.TEXT_WHITE,
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    textDecorationLine: 'underline',
  },
  quickAddContainer: {
    marginTop: SPACING.SM,
  },
});