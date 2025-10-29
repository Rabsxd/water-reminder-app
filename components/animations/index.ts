/**
 * Animation Components Index
 * Water Reminder App - Phase 7: Animations & Interactions
 *
 * This file exports all animation components and utilities for easy integration
 * throughout the Water Reminder application.
 */

// Core Animation Components
export {
  default as AnimatedProgressCircle,
  MiniProgressCircle,
} from "./AnimatedProgressCircle";
export {
  default as EmptyStateAnimation,
  SimpleEmptyState,
} from "./EmptyStateAnimation";
export { default as SplashAnimation } from "./SplashAnimation";
export { default as SuccessAnimation } from "./SuccessAnimation";

// Interactive Components
export { default as AnimatedButton, AnimatedFAB } from "./AnimatedButton";
export { default as PullToRefresh, SimplePullToRefresh } from "./PullToRefresh";
export { default as SwipeableHistoryItem } from "./SwipeableHistoryItem";
export { default as SwipeToDeleteItem } from "./SwipeToDeleteItem";

// Animation Hooks
export {
  TRANSITION_PRESETS,
  useScreenNavigation,
  default as useScreenTransition,
  useTabTransition,
  type TransitionConfig,
  type TransitionType,
} from "../../hooks/useScreenTransition";

// Animation Types (re-export for convenience)
export type { AnimatedProgressCircleProps } from "./AnimatedProgressCircle";
// Remove type exports that don't exist - fix TypeScript errors

/**
 * Animation Usage Examples:
 *
 * 1. Splash Screen:
 *    <SplashAnimation onComplete={handleSplashComplete} />
 *
 * 2. Success Feedback:
 *    <SuccessAnimation
 *      type="goal"
 *      message="Target Tercapai!"
 *      onComplete={handleSuccessComplete}
 *    />
 *
 * 3. Empty States:
 *    <EmptyStateAnimation
 *      type="no-logs"
 *      message="Belum ada catatan"
 *      onActionPress={handleAddWater}
 *      actionText="Tambah Air"
 *    />
 *
 * 4. Progress Circle:
 *    <AnimatedProgressCircle
 *      progress={0.75}
 *      size={200}
 *      animated={true}
 *      showRipple={true}
 *      showPercentage={true}
 *      current={1500}
 *      target={2000}
 *    />
 *
 * 5. Screen Transitions:
 *    const { screenStyle, startTransition } = useScreenTransition();
 *    await startTransition(TRANSITION_PRESETS.SMOOTH_SLIDE);
 *
 * 6. Animated Buttons:
 *    <AnimatedButton
 *      title="Tambah 250ml"
 *      onPress={() => addWater(250)}
 *      variant="primary"
 *      haptic="light"
 *      showRipple={true}
 *    />
 *
 * 7. Swipe to Delete:
 *    <SwipeToDeleteItem
 *      onDelete={() => deleteItem(id)}
 *      height={60}
 *    >
 *      <View style={styles.itemContent}>
 *        <Text>Log Entry</Text>
 *      </View>
 *    </SwipeToDeleteItem>
 *
 * 8. Pull to Refresh:
 *    <PullToRefresh
 *      data={historyItems}
 *      renderItem={renderHistoryItem}
 *      onRefresh={handleRefresh}
 *      refreshing={isRefreshing}
 *      showWaterAnimation={true}
 *    />
 *
 * 9. Haptic Feedback:
 *    import { triggerHaptic, HAPTIC_PATTERNS, WaterHaptics } from '../../utils/hapticUtils';
 *
 *    // Simple haptic
 *    triggerHaptic('success');
 *
 *    // Pattern-based haptic
 *    HAPTIC_PATTERNS.WATER_ADD();
 *
 *    // Water-specific haptics
 *    WaterHaptics.onWaterAdd(250);
 */
