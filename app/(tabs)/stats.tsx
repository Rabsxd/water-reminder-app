/**
 * Statistics Screen
 * Displays water intake statistics, charts, and historical data
 */

import React from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { useWaterStats } from '../../hooks/useWater';
import { COLORS, TYPOGRAPHY, SPACING } from '../../utils/constants';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { Header } from '../../components/common/Header';
import { StreakCard } from '../../components/stats/StreakCard';
import { WeeklyChart } from '../../components/stats/WeeklyChart';
import { HistoryList } from '../../components/stats/HistoryList';
import { ChartViewToggle } from '../../components/stats/ChartViewToggle';
import { DataFilter, FilterOption } from '../../components/stats/DataFilter';

/**
 * Statistics screen component
 * @returns {JSX.Element} Statistics screen
 */
const StatsScreen = React.memo(function StatsScreen() {
  const { weeklyStats, monthlyStats, currentStreak, history } = useWaterStats();

  // State for chart view mode and data filter
  const [chartView, setChartView] = React.useState<'weekly' | 'monthly'>('weekly');
  const [dataFilter, setDataFilter] = React.useState<FilterOption>('all');

  // Data for the main FlatList
  const listData = React.useMemo(() => [
    { id: 'header', type: 'header' },
    { id: 'streak', type: 'streak' },
    { id: 'chartToggle', type: 'chartToggle' },
    { id: 'chart', type: 'chart' },
    { id: 'dataFilter', type: 'dataFilter' },
    { id: 'history', type: 'history' },
  ], []);

  /**
   * Render item for the main FlatList
   * @param {Object} params - Render item params
   * @returns {JSX.Element} Rendered item
   */
  const renderItem = ({ item }: { item: any }) => {
    switch (item.type) {
      case 'header':
        return (
          <Header
            title="Statistics"
            subtitle="Track your hydration progress"
            size="lg"
            align="center"
          />
        );

      case 'streak':
        return (
          <StreakCard
            customStreak={currentStreak}
            showDetails={true}
          />
        );

      case 'chartToggle':
        return (
          <ChartViewToggle
            currentView={chartView}
            onViewChange={setChartView}
          />
        );

      case 'chart':
        return (
          <WeeklyChart
            height={200}
            showTargetLine={true}
            viewMode={chartView}
            onBarPress={(day) => {
              // Handle bar press - could show a detailed modal
              console.log('Bar pressed:', day);
            }}
          />
        );

      case 'dataFilter':
        return (
          <DataFilter
            currentFilter={dataFilter}
            onFilterChange={setDataFilter}
          />
        );

      case 'history':
        return (
          <HistoryList
            maxItems={20}
            dateFilter="all"
            showDeleteButtons={false}
          />
        );

      default:
        return null;
    }
  };

  /**
   * Get item layout for FlatList optimization
   * @param {Object} data - List data
   * @param {number} index - Item index
   * @returns {Object} Item layout info
   */
  const getItemLayout = (data: any, index: number) => {
    // Approximate heights for different item types
    const heights: { [key: string]: number } = {
      header: 120,
      streak: 150,
      chartToggle: 80,
      chart: 250,
      dataFilter: 100,
      history: 400,
    };

    const item = data[index];
    const height = heights[item?.type] || 150;

    return {
      length: height,
      offset: data.slice(0, index).reduce((acc: number, curr: any) => {
        return acc + (heights[curr?.type] || 150);
      }, 0),
      index,
    };
  };

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('StatsScreen error:', error, errorInfo);
      }}
    >
      <FlatList
        style={styles.container}
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        getItemLayout={getItemLayout}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        initialNumToRender={3}
      />
    </ErrorBoundary>
  );
});

export default StatsScreen;

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