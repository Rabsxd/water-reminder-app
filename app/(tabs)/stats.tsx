/**
 * Statistics Screen
 * Displays water intake statistics, charts, and historical data
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

import { useWaterStats } from '../../hooks/useWater';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../utils/constants';

/**
 * Statistics screen component
 * @returns {JSX.Element} Statistics screen
 */
export default function StatsScreen() {
  const { weeklyStats, monthlyStats, currentStreak, history } = useWaterStats();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Statistics</Text>
        <Text style={styles.subtitle}>Track your hydration progress</Text>
      </View>

      {/* Current Streak */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Current Streak</Text>
        <Text style={styles.streakNumber}>{currentStreak}</Text>
        <Text style={styles.streakLabel}>days</Text>
      </View>

      {/* Weekly Stats */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>This Week</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{weeklyStats.average}</Text>
            <Text style={styles.statLabel}>ml avg</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{weeklyStats.completionRate}%</Text>
            <Text style={styles.statLabel}>completion</Text>
          </View>
        </View>
      </View>

      {/* Monthly Stats */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>This Month</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{monthlyStats.average}</Text>
            <Text style={styles.statLabel}>ml avg</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{monthlyStats.completionRate}%</Text>
            <Text style={styles.statLabel}>completion</Text>
          </View>
        </View>
      </View>

      {/* History Placeholder */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent History</Text>
        <Text style={styles.placeholderText}>
          {history.length > 0 ? `${history.length} days recorded` : 'No history available yet'}
        </Text>
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
  card: {
    backgroundColor: COLORS.BACKGROUND_CARD,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.LG,
    marginBottom: SPACING.MD,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE_LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.MD,
  },
  streakNumber: {
    fontSize: TYPOGRAPHY.FONT_SIZE_4XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    color: COLORS.PRIMARY,
    textAlign: 'center',
  },
  streakLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginTop: SPACING.XS,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: TYPOGRAPHY.FONT_SIZE_2XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    color: COLORS.PRIMARY,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.XS,
  },
  placeholderText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});