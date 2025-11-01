/**
 * Daily Limit Modal Component
 * Shows when user exceeds daily water intake limit
 *
 * @component
 * @example
 * <DailyLimitModal
 *   visible={showLimitModal}
 *   currentIntake={5200}
 *   dailyLimit={5000}
 *   onDismiss={() => setShowLimitModal(false)}
 * />
 */

import React from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  BORDER_RADIUS,
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "../../utils/constants";

/**
 * Daily Limit Modal Props
 */
interface DailyLimitModalProps {
  /** Whether modal is visible */
  visible: boolean;
  /** Current water intake amount */
  currentIntake: number;
  /** Daily limit amount */
  dailyLimit: number;
  /** Callback when modal is dismissed */
  onDismiss: () => void;
  /** Callback when user wants to continue anyway */
  onContinueAnyway?: () => void;
  /** Show health warning */
  showHealthWarning?: boolean;
}

/**
 * Daily Limit Modal Component
 */
export const DailyLimitModal: React.FC<DailyLimitModalProps> = React.memo(
  ({
    visible,
    currentIntake,
    dailyLimit,
    onDismiss,
    onContinueAnyway,
    showHealthWarning = true,
  }) => {
    const exceededAmount = currentIntake - dailyLimit;

    /**
     * Handle continue anyway action
     */
    const handleContinueAnyway = () => {
      if (onContinueAnyway) {
        onContinueAnyway();
      }
      onDismiss();
    };

    /**
     * Handle contact healthcare action
     */
    const handleContactHealthcare = () => {
      // In a real app, you might open a health app or provide more information
      onDismiss();
    };

    if (!visible) return null;

    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={onDismiss}
        accessible={true}
        accessibilityLabel="Daily limit exceeded alert"
        accessibilityRole="alert"
      >
        <View style={styles.overlay}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.modal}>
              <View style={styles.emojiContainer}>
                <Text style={styles.emoji}>⚠️</Text>
              </View>

              <Text style={styles.title}>Daily Limit Reached</Text>

              <View style={styles.statsContainer}>
                <Text style={styles.currentIntake}>
                  {currentIntake.toLocaleString()}ml
                </Text>
                <Text style={styles.limitText}>
                  Daily Limit: {dailyLimit.toLocaleString()}ml
                </Text>
                <Text style={styles.exceededText}>
                  +{exceededAmount.toLocaleString()}ml over limit
                </Text>
              </View>

              <Text style={styles.warningMessage}>
                {`You've exceeded the recommended daily water intake limit. For your health and safety,
              please consider the following:`}
              </Text>

              {showHealthWarning && (
                <View style={styles.healthWarningContainer}>
                  <Text style={styles.healthWarningTitle}>
                    ⚕️ Health Notice
                  </Text>
                  <Text style={styles.healthWarningText}>
                    Drinking excessive amounts of water can be dangerous and may
                    lead to:
                  </Text>
                  <View style={styles.warningList}>
                    <Text style={styles.warningItem}>
                      • Water intoxication (hyponatremia)
                    </Text>
                    <Text style={styles.warningItem}>
                      • Electrolyte imbalance
                    </Text>
                    <Text style={styles.warningItem}>• Kidney strain</Text>
                    <Text style={styles.warningItem}>
                      • Headaches and nausea
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.recommendationContainer}>
                <Text style={styles.recommendationTitle}>
                  💡 Recommendations
                </Text>
                <Text style={styles.recommendationText}>
                  • Stop drinking water for today{"\n"}• Monitor how you feel
                  {"\n"}• Contact a healthcare professional if you experience
                  symptoms{"\n"}• Continue with normal intake tomorrow
                </Text>
              </View>

              <View style={styles.buttonContainer}>
                {onContinueAnyway && (
                  <TouchableOpacity
                    style={[styles.button, styles.secondaryButton]}
                    onPress={handleContinueAnyway}
                    accessible={true}
                    accessibilityLabel="Continue tracking anyway"
                    accessibilityRole="button"
                  >
                    <Text style={styles.secondaryButtonText}>
                      Continue Anyway
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[styles.button, styles.contactButton]}
                  onPress={handleContactHealthcare}
                  accessible={true}
                  accessibilityLabel="Learn more about water safety"
                  accessibilityRole="button"
                >
                  <Text style={styles.contactButtonText}>Learn More</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.primaryButton]}
                  onPress={onDismiss}
                  accessible={true}
                  accessibilityLabel="I understand, close this message"
                  accessibilityRole="button"
                >
                  <Text style={styles.primaryButtonText}>I Understand</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  }
);

DailyLimitModal.displayName = "DailyLimitModal";

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.LG,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },

  modal: {
    backgroundColor: COLORS.BACKGROUND_CARD,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.XL,
    maxWidth: 400,
    width: "100%",
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },

  emojiContainer: {
    alignItems: "center",
    marginBottom: SPACING.LG,
  },

  emoji: {
    fontSize: 64,
  },

  title: {
    fontSize: TYPOGRAPHY.FONT_SIZE_XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    color: COLORS.ERROR,
    textAlign: "center",
    marginBottom: SPACING.LG,
  },

  statsContainer: {
    backgroundColor: COLORS.ERROR + "10",
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.LG,
    alignItems: "center",
    marginBottom: SPACING.LG,
  },

  currentIntake: {
    fontSize: TYPOGRAPHY.FONT_SIZE_2XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    color: COLORS.ERROR,
    marginBottom: SPACING.XS,
  },

  limitText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.XS,
  },

  exceededText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
    color: COLORS.ERROR,
  },

  warningMessage: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: SPACING.LG,
  },

  healthWarningContainer: {
    backgroundColor: COLORS.WARNING + "10",
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.LG,
    marginBottom: SPACING.LG,
  },

  healthWarningTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    color: COLORS.WARNING,
    marginBottom: SPACING.SM,
  },

  healthWarningText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.SM,
    lineHeight: 20,
  },

  warningList: {
    paddingLeft: SPACING.SM,
  },

  warningItem: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 18,
    marginBottom: SPACING.XS,
  },

  recommendationContainer: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.LG,
    marginBottom: SPACING.LG,
  },

  recommendationTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },

  recommendationText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
  },

  buttonContainer: {
    gap: SPACING.SM,
  },

  button: {
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    borderRadius: BORDER_RADIUS.FULL,
    alignItems: "center",
  },

  primaryButton: {
    backgroundColor: COLORS.PRIMARY,
  },

  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },

  contactButton: {
    backgroundColor: COLORS.WARNING,
  },

  primaryButtonText: {
    color: COLORS.TEXT_WHITE,
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
  },

  secondaryButtonText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
  },

  contactButtonText: {
    color: COLORS.TEXT_WHITE,
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
  },
});
