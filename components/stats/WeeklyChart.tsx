/**
 * Weekly Chart component for Water Reminder app
 * Displays weekly water intake data as a bar chart
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';

import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../utils/constants';
import { useWaterStats } from '../../hooks/useWater';

/**
 * Chart view modes
 */
export type ChartView = 'weekly' | 'monthly';

/**
 * Weekly Chart component props
 */
export interface WeeklyChartProps extends TouchHandlers {
  /** Custom style for container */
  style?: any;
  /** Chart height in pixels */
  height?: number;
  /** Whether to show target line */
  showTargetLine?: boolean;
  /** Whether to enable animations */
  animated?: boolean;
  /** Chart view mode */
  viewMode?: ChartView;
  /** Custom weekly data (overrides from useWaterStats) */
  customData?: { day: string; intake: number; target: number }[];
}

/**
 * Day data structure for chart
 */
interface DayData {
  day: string;
  intake: number;
  target: number;
  percentage: number;
  isCompleted: boolean;
}

/**
 * Touch interaction handler props
 */
interface TouchHandlers {
  /** Called when a bar is pressed */
  onBarPress?: (day: DayData) => void;
  /** Called when chart is long pressed */
  onLongPress?: () => void;
}

/**
 * Weekly Chart component with bar visualization
 * @param {WeeklyChartProps} props - Component props
 * @returns {JSX.Element} Weekly chart component
 *
 * @example
 * <WeeklyChart
 *   height={200}
 *   showTargetLine={true}
 * />
 */
export const WeeklyChart: React.FC<WeeklyChartProps> = React.memo(({
  style,
  height = 200,
  showTargetLine = true,
  animated = true,
  viewMode = 'weekly',
  customData,
  onBarPress,
  onLongPress,
}) => {
  const { weeklyStats, monthlyStats, history } = useWaterStats();
  const screenWidth = Dimensions.get('window').width;

  // Animation values
  const animatedValues = React.useRef<Animated.Value[]>([]);
  const [selectedBar, setSelectedBar] = React.useState<string | null>(null);

  // Initialize animation values
  React.useEffect(() => {
    if (animated && animatedValues.current.length === 0) {
      animatedValues.current = Array(7).fill(0).map(() => new Animated.Value(0));

      // Start staggered animation
      Animated.stagger(
        100,
        animatedValues.current.map(value =>
          Animated.spring(value, {
            toValue: 1,
            useNativeDriver: false,
            tension: 100,
            friction: 8,
          })
        )
      ).start();
    }
  }, [animated]);

  /**
   * Get chart data based on view mode
   * @returns {DayData[]} Array of daily data
   */
  const getChartData = (): DayData[] => {
    if (customData) {
      return customData.map(item => ({
        ...item,
        percentage: Math.round((item.intake / item.target) * 100),
        isCompleted: item.intake >= item.target * 0.8, // 80% completion rule
      }));
    }

    if (viewMode === 'monthly') {
      return getMonthlyData();
    } else {
      return getWeeklyData();
    }
  };

  /**
   * Get weekly data for chart
   * @returns {DayData[]} Array of daily data
   */
  const getWeeklyData = (): DayData[] => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const data: DayData[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayName = days[date.getDay()];
      const dateString = date.toISOString().split('T')[0];

      // Find data for this day from history
      const dayData = history.find(h => h.date === dateString);
      const intake = dayData?.totalIntake || 0;
      const target = dayData?.target || 2000;

      data.push({
        day: dayName,
        intake,
        target,
        percentage: Math.round((intake / target) * 100),
        isCompleted: intake >= target * 0.8,
      });
    }

    return data;
  };

  /**
   * Get monthly data for chart
   * @returns {DayData[]} Array of daily data for current month
   */
  const getMonthlyData = (): DayData[] => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const data: DayData[] = [];

    // Show data for the last 30 days or all days in current month, whichever is less
    const daysToShow = Math.min(30, daysInMonth);

    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      // Only include dates from current month
      if (date.getMonth() !== currentMonth) continue;

      const dayOfMonth = date.getDate();
      const dateString = date.toISOString().split('T')[0];

      // Find data for this day from history
      const dayData = history.find(h => h.date === dateString);
      const intake = dayData?.totalIntake || 0;
      const target = dayData?.target || 2000;

      data.push({
        day: dayOfMonth.toString(),
        intake,
        target,
        percentage: Math.round((intake / target) * 100),
        isCompleted: intake >= target * 0.8,
      });
    }

    return data;
  };

  const data = getChartData();
  const maxIntake = Math.max(...data.map(d => Math.max(d.intake, d.target)), 2000);
  const barWidth = Math.max(20, (screenWidth - Number(SPACING) * 4) / data.length - Number(SPACING));

  /**
   * Get chart title based on view mode
   * @returns {string} Chart title
   */
  const getChartTitle = (): string => {
    if (viewMode === 'monthly') {
      return 'Monthly Intake';
    } else {
      return 'Weekly Intake';
    }
  };

  /**
   * Get chart subtitle based on view mode and stats
   * @returns {string} Chart subtitle
   */
  const getChartSubtitle = (): string => {
    const stats = viewMode === 'monthly' ? monthlyStats : weeklyStats;
    return `Avg: ${stats.average}ml | ${stats.completionRate}% goal`;
  };

  /**
   * Get bar color based on completion status
   * @param {DayData} day - Day data
   * @returns {string} Bar color
   */
  const getBarColor = (day: DayData): string => {
    if (day.isCompleted) {
      return COLORS.SUCCESS;
    } else if (day.percentage >= 50) {
      return COLORS.WARNING;
    } else {
      return COLORS.ERROR;
    }
  };

  /**
   * Get bar height based on intake value
   * @param {number} intake - Daily intake amount
   * @returns {number} Bar height in pixels
   */
  const getBarHeight = (intake: number): number => {
    return Math.max((intake / maxIntake) * (height - 60), 4); // Minimum 4px height
  };

  /**
   * Get target line position
   * @returns {number} Y position for target line
   */
  const getTargetLinePosition = (): number => {
    const target = 2000; // Default target
    return height - 60 - (target / maxIntake) * (height - 60);
  };

  /**
   * Handle bar press interaction
   * @param {DayData} day - Pressed day data
   */
  const handleBarPress = (day: DayData) => {
    setSelectedBar(day.day);
    if (onBarPress) {
      onBarPress(day);
    }
    // Reset selection after 500ms
    setTimeout(() => setSelectedBar(null), 500);
  };

  /**
   * Get animated bar height
   * @param {number} index - Bar index
   * @param {number} targetHeight - Target height
   * @returns {Animated.Value} Animated height value
   */
  const getAnimatedHeight = (index: number, targetHeight: number) => {
    if (!animated || !animatedValues.current[index]) {
      return targetHeight;
    }
    return animatedValues.current[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0, targetHeight],
    });
  };

  return (
    <View style={[styles.container, style]}>
      {/* Chart title */}
      <View style={styles.header}>
        <Text style={styles.title}>{getChartTitle()}</Text>
        <Text style={styles.subtitle}>{getChartSubtitle()}</Text>
      </View>

      {/* Chart container */}
      <View style={[styles.chartContainer, { height }]}>
        {/* Target line */}
        {showTargetLine && (
          <View style={[styles.targetLine, { top: getTargetLinePosition() }]}>
            <Text style={styles.targetLineLabel}>Target</Text>
          </View>
        )}

        {/* Bars */}
        <View style={styles.barsContainer}>
          {data.map((day, index) => {
            const barHeight = getBarHeight(day.intake);
            const barColor = getBarColor(day);
            const animatedHeight = getAnimatedHeight(index, barHeight);
            const isSelected = selectedBar === day.day;

            return (
              <TouchableOpacity
                key={day.day}
                style={styles.barContainer}
                onPress={() => handleBarPress(day)}
                activeOpacity={0.7}
                accessibilityLabel={`${day.day}: ${day.intake}ml (${day.percentage}%)`}
                accessibilityRole="button"
              >
                {/* Bar */}
                <Animated.View
                  style={[
                    styles.bar,
                    styles.barInteractive,
                    {
                      height: animatedHeight,
                      width: barWidth,
                      backgroundColor: barColor,
                      marginBottom: SPACING.XS,
                      transform: [
                        {
                          scale: isSelected ? 1.05 : 1,
                        },
                      ],
                    },
                  ]}
                />

                {/* Day label */}
                <Text style={[
                  styles.dayLabel,
                  isSelected && styles.dayLabelSelected
                ]}>
                  {day.day}
                </Text>

                {/* Intake value */}
                <Text style={[
                  styles.intakeLabel,
                  isSelected && styles.intakeLabelSelected
                ]}>
                  {day.intake}ml
                </Text>

                {/* Percentage indicator */}
                <Text style={[
                  styles.percentageLabel,
                  { color: barColor },
                  isSelected && styles.percentageLabelSelected
                ]}>
                  {day.percentage}%
                </Text>

                {/* Selection indicator */}
                {isSelected && (
                  <View style={[styles.selectionIndicator, { backgroundColor: barColor }]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.SUCCESS }]} />
          <Text style={styles.legendText}>Goal (80%+)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.WARNING }]} />
          <Text style={styles.legendText}>Good (50-79%)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.ERROR }]} />
          <Text style={styles.legendText}>{`Low (<50%)`}</Text>
        </View>
      </View>

      {/* Empty state */}
      {data.every(d => d.intake === 0) && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateEmoji}>💧</Text>
          <Text style={styles.emptyStateText}>No data this week</Text>
          <Text style={styles.emptyStateSubtext}>
            Start logging your water intake on the Home screen to see your weekly progress here
          </Text>
          <Text style={styles.emptyStateTip}>
            💡 Tip: Try to drink at least 8 glasses of water per day!
          </Text>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BACKGROUND_CARD,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.LG,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  header: {
    marginBottom: SPACING.LG,
    alignItems: 'center',
  },

  title: {
    fontSize: TYPOGRAPHY.FONT_SIZE_LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },

  subtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },

  chartContainer: {
    position: 'relative',
    marginBottom: SPACING.MD,
  },

  targetLine: {
    position: 'absolute',
    left: SPACING.LG,
    right: SPACING.LG,
    height: 1,
    backgroundColor: COLORS.PRIMARY,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    zIndex: 1,
  },

  targetLineLabel: {
    position: 'absolute',
    right: 0,
    top: -10,
    fontSize: TYPOGRAPHY.FONT_SIZE_XS,
    color: COLORS.PRIMARY,
    backgroundColor: COLORS.BACKGROUND_CARD,
    paddingHorizontal: SPACING.XS,
  },

  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    flex: 1,
    paddingHorizontal: SPACING.LG,
    paddingBottom: SPACING.LG,
  },

  barContainer: {
    alignItems: 'center',
    flex: 1,
  },

  bar: {
    borderRadius: BORDER_RADIUS.SM,
    borderTopLeftRadius: BORDER_RADIUS.MD,
    borderTopRightRadius: BORDER_RADIUS.MD,
  },

  dayLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE_XS,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_MEDIUM,
    marginBottom: 2,
  },

  intakeLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE_XS,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },

  percentageLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE_XS,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
    textAlign: 'center',
    marginTop: 2,
  },

  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.SM,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  legendDot: {
    width: 8,
    height: 8,
    borderRadius: BORDER_RADIUS.FULL,
    marginRight: SPACING.XS,
  },

  legendText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_XS,
    color: COLORS.TEXT_SECONDARY,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.XL,
  },

  emptyStateText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.XS,
  },

  emptyStateSubtext: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_DISABLED,
    textAlign: 'center',
    marginBottom: SPACING.SM,
  },

  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: SPACING.MD,
  },

  emptyStateTip: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.INFO,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // Interactive bar styles
  barInteractive: {
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },

  dayLabelSelected: {
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    color: COLORS.PRIMARY,
  },

  intakeLabelSelected: {
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
    color: COLORS.TEXT_PRIMARY,
  },

  percentageLabelSelected: {
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
  },

  selectionIndicator: {
    width: 4,
    height: 4,
    borderRadius: BORDER_RADIUS.FULL,
    marginTop: SPACING.XS,
    alignSelf: 'center',
  },
});