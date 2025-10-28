/**
 * Home Screen
 * Main screen for water tracking with progress circle and quick add buttons
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';

import { useWater } from '../../hooks/useWater';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../utils/constants';

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
      <View style={styles.header}>
        <Text style={styles.title}>Water Reminder</Text>
        <Text style={styles.subtitle}>Track your daily hydration</Text>
      </View>

      {/* Progress Circle Placeholder */}
      <View style={styles.progressContainer}>
        <View style={styles.progressCircle}>
          <Text style={styles.progressPercentage}>{Math.round(progress * 100)}%</Text>
          <Text style={styles.progressLabel}>of {state.settings.dailyTarget}ml</Text>
        </View>
        {isTargetReached && (
          <View style={styles.achievementBadge}>
            <Text style={styles.achievementText}>🎯 Goal Reached!</Text>
          </View>
        )}
      </View>

      {/* Current Stats */}
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

      {/* Quick Add Buttons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Add</Text>
        <View style={styles.quickAddContainer}>
          {stats.quickAddOptions?.map((option: any) => (
            <TouchableOpacity
              key={option.amount}
              style={[
                styles.quickAddButton,
                option.disabled && styles.quickAddButtonDisabled,
                isTargetReached && styles.quickAddButtonSuccess,
              ]}
              onPress={() => handleQuickAdd(option.amount)}
              disabled={option.disabled}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.quickAddText,
                option.disabled && styles.quickAddTextDisabled,
                isTargetReached && styles.quickAddTextSuccess,
              ]}>
                +{option.amount}ml
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Custom Amount Button */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.customAddButton} activeOpacity={0.8}>
          <Text style={styles.customAddText}>+ Add Custom Amount</Text>
        </TouchableOpacity>
      </View>

      {/* Today's Logs */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{`Today's Log`}</Text>
          {todayLogsCount > 0 && (
            <Text style={styles.logCount}>{todayLogsCount} entries</Text>
          )}
        </View>

        {todayLogsCount === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No water intake recorded yet</Text>
            <Text style={styles.emptyStateSubtext}>Start tracking by adding water above</Text>
          </View>
        ) : (
          <View style={styles.logContainer}>
            {state.today.logs.slice(-5).reverse().map((log, index) => (
              <View key={log.id} style={styles.logItem}>
                <View style={styles.logInfo}>
                  <Text style={styles.logAmount}>{log.amount}ml</Text>
                  <Text style={styles.logTime}>
                    {new Date(log.timestamp).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </Text>
                </View>
                <TouchableOpacity style={styles.logDeleteButton}>
                  <Text style={styles.logDeleteText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
            {state.today.logs.length > 5 && (
              <Text style={styles.logMoreText}>... and {state.today.logs.length - 5} more</Text>
            )}
          </View>
        )}
      </View>

      {/* Error Display */}
      {state.error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {state.error}</Text>
          <TouchableOpacity onPress={clearError} style={styles.errorDismissButton}>
            <Text style={styles.errorDismissText}>Dismiss</Text>
          </TouchableOpacity>
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
  },
  header: {
    alignItems: 'center',
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
  progressContainer: {
    alignItems: 'center',
    marginBottom: SPACING.XL,
    position: 'relative',
  },
  progressCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.BACKGROUND_CARD,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 8,
    borderColor: COLORS.PRIMARY_LIGHT,
  },
  progressPercentage: {
    fontSize: TYPOGRAPHY.FONT_SIZE_3XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    color: COLORS.PRIMARY,
  },
  progressLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.XS,
  },
  achievementBadge: {
    position: 'absolute',
    top: -10,
    backgroundColor: COLORS.SUCCESS,
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XS,
    borderRadius: BORDER_RADIUS.FULL,
  },
  achievementText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    color: COLORS.TEXT_WHITE,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.XL,
    backgroundColor: COLORS.BACKGROUND_CARD,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.LG,
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
  section: {
    marginBottom: SPACING.LG,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.MD,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE_LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  logCount: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
  },
  quickAddContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickAddButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    borderRadius: BORDER_RADIUS.LG,
    minWidth: 80,
    alignItems: 'center',
  },
  quickAddButtonDisabled: {
    backgroundColor: COLORS.BACKGROUND_DISABLED,
  },
  quickAddButtonSuccess: {
    backgroundColor: COLORS.SUCCESS,
  },
  quickAddText: {
    color: COLORS.TEXT_WHITE,
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_MEDIUM,
  },
  quickAddTextDisabled: {
    color: COLORS.TEXT_DISABLED,
  },
  quickAddTextSuccess: {
    color: COLORS.TEXT_WHITE,
  },
  customAddButton: {
    backgroundColor: COLORS.SECONDARY,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.LG,
    alignItems: 'center',
  },
  customAddText: {
    color: COLORS.TEXT_WHITE,
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_MEDIUM,
  },
  emptyState: {
    alignItems: 'center',
    padding: SPACING.XL,
    backgroundColor: COLORS.BACKGROUND_CARD,
    borderRadius: BORDER_RADIUS.LG,
  },
  emptyStateText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.XS,
  },
  emptyStateSubtext: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_DISABLED,
  },
  logContainer: {
    backgroundColor: COLORS.BACKGROUND_CARD,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.MD,
  },
  logItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.SM,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  logInfo: {
    flex: 1,
  },
  logAmount: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_MEDIUM,
    color: COLORS.TEXT_PRIMARY,
  },
  logTime: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
  },
  logDeleteButton: {
    padding: SPACING.SM,
  },
  logDeleteText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_LG,
    color: COLORS.ERROR,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
  },
  logMoreText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: SPACING.SM,
  },
  errorContainer: {
    backgroundColor: COLORS.ERROR,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.LG,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.MD,
  },
  errorText: {
    color: COLORS.TEXT_WHITE,
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    flex: 1,
  },
  errorDismissButton: {
    padding: SPACING.SM,
  },
  errorDismissText: {
    color: COLORS.TEXT_WHITE,
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
  },
});