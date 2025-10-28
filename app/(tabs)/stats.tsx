/**
 * Statistics Screen
 * Displays water intake statistics, charts, and historical data
 */

import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { useWaterStats } from '../../hooks/useWater';
import { COLORS, TYPOGRAPHY, SPACING } from '../../utils/constants';
import { Header } from '../../components/common/Header';
import { StreakCard } from '../../components/stats/StreakCard';
import { WeeklyChart } from '../../components/stats/WeeklyChart';
import { HistoryList } from '../../components/stats/HistoryList';

/**
 * Statistics screen component
 * @returns {JSX.Element} Statistics screen
 */
export default function StatsScreen() {
  const { weeklyStats, monthlyStats, currentStreak, history } = useWaterStats();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <Header
        title="Statistics"
        subtitle="Track your hydration progress"
        size="lg"
        align="center"
      />

      {/* Current Streak */}
      <StreakCard
        customStreak={currentStreak}
        showDetails={true}
      />

      {/* Weekly Chart */}
      <WeeklyChart
        height={200}
        showTargetLine={true}
      />

      {/* History List */}
      <HistoryList
        maxItems={20}
        dateFilter="all"
        showDeleteButtons={false}
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