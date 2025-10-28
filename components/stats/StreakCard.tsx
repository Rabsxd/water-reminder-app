/**
 * Streak Card component for Water Reminder app
 * Displays current streak and achievement status
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useWaterStats } from "../../hooks/useWater";
import {
  BORDER_RADIUS,
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "../../utils/constants";

/**
 * Streak Card component props
 */
export interface StreakCardProps {
  /** Custom style for container */
  style?: any;
  /** Whether to show detailed stats */
  showDetails?: boolean;
  /** Custom streak value (overrides from useWaterStats) */
  customStreak?: number;
}

/**
 * Streak achievement level based on streak count
 * @param {number} streak - Current streak count
 * @returns {Object} Achievement level info
 */
const getStreakLevel = (streak: number) => {
  if (streak === 0) {
    return {
      emoji: "💧",
      title: "Start Your Journey",
      description: "Log your first water intake",
      color: COLORS.TEXT_SECONDARY,
      backgroundColor: COLORS.BACKGROUND_CARD,
    };
  } else if (streak < 3) {
    return {
      emoji: "🌱",
      title: "Building Habit",
      description: `${streak} day${streak > 1 ? "s" : ""} of consistency`,
      color: COLORS.PRIMARY,
      backgroundColor: COLORS.PRIMARY_LIGHT,
    };
  } else if (streak < 7) {
    return {
      emoji: "🔥",
      title: "On Fire!",
      description: `${streak} days streak`,
      color: COLORS.WARNING,
      backgroundColor: "#FEF3C7",
    };
  } else if (streak < 14) {
    return {
      emoji: "⭐",
      title: "Week Warrior",
      description: `${streak} days of excellence`,
      color: COLORS.SUCCESS,
      backgroundColor: COLORS.SECONDARY_LIGHT,
    };
  } else if (streak < 30) {
    return {
      emoji: "🏆",
      title: "Champion",
      description: `${streak} days strong`,
      color: "#8B5CF6",
      backgroundColor: "#EDE9FE",
    };
  } else {
    return {
      emoji: "👑",
      title: "Hydration Master",
      description: `${streak} days legend`,
      color: "#DC2626",
      backgroundColor: "#FEE2E2",
    };
  }
};

/**
 * Streak Card component with achievement levels
 * @param {StreakCardProps} props - Component props
 * @returns {JSX.Element} Streak card component
 *
 * @example
 * <StreakCard
 *   showDetails={true}
 *   customStreak={5}
 * />
 */
export const StreakCard: React.FC<StreakCardProps> = ({
  style,
  showDetails = false,
  customStreak,
}) => {
  const { currentStreak } = useWaterStats();
  const streak = customStreak !== undefined ? customStreak : currentStreak;
  const level = getStreakLevel(streak);

  /**
   * Format streak text with proper pluralization
   * @returns {string} Formatted streak text
   */
  const getStreakText = (): string => {
    if (streak === 0) {
      return "No streak yet";
    }
    return `${streak} day${streak !== 1 ? "s" : ""}`;
  };

  return (
    <View style={[styles.container, style]}>
      {/* Main streak display */}
      <View style={[styles.card, { backgroundColor: level.backgroundColor }]}>
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>{level.emoji}</Text>
        </View>

        <View style={styles.streakInfo}>
          <Text style={[styles.streakNumber, { color: level.color }]}>
            {streak}
          </Text>
          <Text style={[styles.streakLabel, { color: level.color }]}>
            {getStreakText()}
          </Text>
        </View>
      </View>

      {/* Achievement details */}
      <View style={styles.achievementContainer}>
        <Text style={[styles.achievementTitle, { color: level.color }]}>
          {level.title}
        </Text>
        <Text style={styles.achievementDescription}>{level.description}</Text>
      </View>

      {/* Detailed stats */}
      {showDetails && (
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Best Streak</Text>
            <Text style={styles.detailValue}>--</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>This Month</Text>
            <Text style={styles.detailValue}>--</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>All Time</Text>
            <Text style={styles.detailValue}>--</Text>
          </View>
        </View>
      )}

      {/* Motivational message */}
      {streak === 0 && (
        <View style={styles.motivationContainer}>
          <Text style={styles.motivationText}>
            💪 Every great journey starts with a single sip!
          </Text>
        </View>
      )}

      {streak > 0 && streak < 3 && (
        <View style={styles.motivationContainer}>
          <Text style={styles.motivationText}>
            {`🎯 Keep going! You're building a great habit!`}
          </Text>
        </View>
      )}

      {streak >= 3 && streak < 7 && (
        <View style={styles.motivationContainer}>
          <Text style={styles.motivationText}>
            {`🔥 Great job! You're on fire! Don't break the chain!`}
          </Text>
        </View>
      )}

      {streak >= 7 && (
        <View style={styles.motivationContainer}>
          <Text style={styles.motivationText}>
            {`🌟 Amazing! You're a hydration champion!`}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.MD,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.LG,
    borderRadius: BORDER_RADIUS.LG,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  emojiContainer: {
    marginRight: SPACING.MD,
  },

  emoji: {
    fontSize: 32,
    textAlign: "center",
  },

  streakInfo: {
    flex: 1,
    alignItems: "center",
  },

  streakNumber: {
    fontSize: TYPOGRAPHY.FONT_SIZE_4XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    textAlign: "center",
  },

  streakLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_MEDIUM,
    textAlign: "center",
    marginTop: SPACING.XS,
  },

  achievementContainer: {
    alignItems: "center",
    marginTop: SPACING.MD,
    paddingHorizontal: SPACING.SM,
  },

  achievementTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE_LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
    textAlign: "center",
    marginBottom: SPACING.XS,
  },

  achievementDescription: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: "center",
  },

  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: SPACING.LG,
    paddingVertical: SPACING.MD,
    backgroundColor: COLORS.BACKGROUND_CARD,
    borderRadius: BORDER_RADIUS.MD,
  },

  detailItem: {
    alignItems: "center",
  },

  detailLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.XS,
  },

  detailValue: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
    color: COLORS.PRIMARY,
  },

  motivationContainer: {
    marginTop: SPACING.MD,
    padding: SPACING.MD,
    backgroundColor: COLORS.BACKGROUND_CARD,
    borderRadius: BORDER_RADIUS.MD,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.PRIMARY,
  },

  motivationText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: "center",
    fontStyle: "italic",
  },
});
