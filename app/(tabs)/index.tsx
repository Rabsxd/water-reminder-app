/**
 * Home Screen
 * Main screen for water tracking with progress circle and quick add buttons
 */

import React from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";

import { Card } from "../../components/common/Card";
import { Header } from "../../components/common/Header";
import { ProgressCircle } from "../../components/home/ProgressCircle";
import { QuickAddButtons } from "../../components/home/QuickAddButtons";
import { TodayLogList } from "../../components/home/TodayLogList";
import { useWater } from "../../hooks/useWater";
import {
  BORDER_RADIUS,
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "../../utils/constants";

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
   * Show success message when target is reached
   */
  React.useEffect(() => {
    if (isTargetReached) {
      Alert.alert(
        "🎉 Congratulations!",
        `You've reached your daily target of ${state.settings.dailyTarget}ml!`,
        [{ text: "Awesome!", style: "default" }]
      );
    }
  }, [isTargetReached, state.settings.dailyTarget]);

  // Clear any errors when component mounts - prevent infinite loop
  React.useEffect(() => {
    clearError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Remove clearError dependency to prevent infinite loop

  // Data for the main FlatList
  const listData = React.useMemo(() => {
    const items = [
      { id: "header", type: "header" },
      { id: "progress", type: "progress" },
      { id: "stats", type: "stats" },
      { id: "quickAdd", type: "quickAdd" },
      { id: "logs", type: "logs" },
    ];

    if (state.error) {
      items.push({ id: "error", type: "error" });
    }

    return items;
  }, [state.error]);

  /**
   * Render item for the main FlatList
   * @param {Object} params - Render item params
   * @returns {JSX.Element} Rendered item
   */
  const renderItem = ({ item }: { item: any }) => {
    switch (item.type) {
      case "header":
        return (
          <Header
            title="Water Reminder"
            subtitle="Track your daily hydration"
            size="lg"
            align="center"
          />
        );

      case "progress":
        return (
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
        );

      case "stats":
        return (
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
        );

      case "quickAdd":
        return (
          <Card variant="default" padding="md">
            <QuickAddButtons style={styles.quickAddContainer} />
          </Card>
        );

      case "logs":
        return (
          <Card variant="default" padding="md">
            <TodayLogList maxItems={10} showDeleteButtons={true} />
          </Card>
        );

      case "error":
        return (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {state.error}</Text>
            <Text onPress={clearError} style={styles.errorDismissText}>
              Dismiss
            </Text>
          </View>
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
      progress: 280,
      stats: 120,
      quickAdd: 200,
      logs: 300,
      error: 100,
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
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    textDecorationLine: "underline",
  },
  quickAddContainer: {
    marginTop: SPACING.SM,
  },
});
