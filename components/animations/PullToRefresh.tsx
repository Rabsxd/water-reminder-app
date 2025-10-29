/**
 * Simple Pull to Refresh component for Water Reminder app
 * Simplified version to fix TypeScript errors
 */

import React, { useState } from "react";
import {
  FlatList,
  FlatListProps,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { COLORS, SPACING, TYPOGRAPHY } from "../../utils/constants";

/**
 * Simple Pull to Refresh props
 */
interface SimplePullToRefreshProps<T> extends FlatListProps<T> {
  /** Function to call when refresh is triggered */
  onRefresh: () => void;
  /** Whether the list is currently refreshing */
  refreshing: boolean;
  /** Show water animation */
  showWaterAnimation?: boolean;
}

/**
 * Simple Pull to Refresh component
 * Uses standard RefreshControl instead of custom gesture handler
 */
export function SimplePullToRefresh<T>({
  onRefresh,
  refreshing,
  showWaterAnimation = true,
  data,
  ...props
}: SimplePullToRefreshProps<T>) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefresh();
    // Reset after a delay to allow animation to complete
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <FlatList
      data={data}
      {...props}
      refreshControl={
        <RefreshControl
          refreshing={refreshing || isRefreshing}
          onRefresh={handleRefresh}
          tintColor={COLORS.PRIMARY}
          colors={[COLORS.PRIMARY, COLORS.WATER_EXCELLENT]}
          progressBackgroundColor={COLORS.BACKGROUND_CARD}
        />
      }
    />
  );
}

/**
 * Default export - PullToRefresh
 */
export default SimplePullToRefresh;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    height: 80,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  waterDrop: {
    fontSize: 24,
    marginRight: SPACING.XS,
  },
  headerText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_NORMAL,
    color: COLORS.TEXT_PRIMARY,
  },
});
