/**
 * First Launch Screen Component
 * Handles first-time user experience and setup
 *
 * @component
 * @example
 * <FirstLaunchScreen onComplete={() => navigation.replace('Home')} />
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';

import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../utils/constants';
import { useErrorRecovery } from '../../hooks/useErrorRecovery';
import { ErrorLogger } from '../../services/errorLoggingService';

/**
 * First Launch Screen Props
 */
interface FirstLaunchScreenProps {
  /** Callback when setup is complete */
  onComplete: () => void;
  /** Custom daily target (optional) */
  defaultTarget?: number;
}

/**
 * First Launch Screen Component
 */
export const FirstLaunchScreen: React.FC<FirstLaunchScreenProps> = React.memo(({
  onComplete,
  defaultTarget = 2000,
}) => {
  const [selectedTarget, setSelectedTarget] = useState(defaultTarget);
  const [step, setStep] = useState(0);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const { completeFirstLaunch } = useErrorRecovery();

  // Animate in on mount
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  /**
   * Handle target selection
   */
  const handleTargetSelect = (target: number) => {
    setSelectedTarget(target);
  };

  /**
   * Continue to next step
   */
  const handleContinue = async () => {
    try {
      if (step === 0) {
        // Animate out and in
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setStep(1);
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
        });
      } else {
        // Complete setup
        await completeFirstLaunch();
        await ErrorLogger.logInfo('First launch setup completed', {
          context: 'FirstLaunchScreen',
          action: 'CompleteSetup',
          additionalData: { selectedTarget },
        });
        onComplete();
      }
    } catch (error) {
      ErrorLogger.logError(error as Error, {
        context: 'FirstLaunchScreen',
        action: step === 0 ? 'ContinueToStep2' : 'CompleteSetup',
      });
    }
  };

  /**
   * Render step 1: Target selection
   */
  const renderTargetSelection = () => (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
      <View style={styles.emojiContainer}>
        <Text style={styles.emoji}>💧</Text>
      </View>

      <Text style={styles.title}>Welcome to Water Reminder!</Text>
      <Text style={styles.subtitle}>
        Let's set your daily water intake goal. You can change this anytime in settings.
      </Text>

      <View style={styles.targetContainer}>
        <Text style={styles.targetLabel}>Daily Goal (ml)</Text>

        <View style={styles.targetButtons}>
          {[1500, 2000, 2500, 3000].map((target) => (
            <TouchableOpacity
              key={target}
              style={[
                styles.targetButton,
                selectedTarget === target && styles.targetButtonSelected,
              ]}
              onPress={() => handleTargetSelect(target)}
              accessible={true}
              accessibilityLabel={`Set daily goal to ${target}ml`}
              accessibilityRole="button"
              accessibilityState={{ selected: selectedTarget === target }}
            >
              <Text style={[
                styles.targetButtonText,
                selectedTarget === target && styles.targetButtonTextSelected,
              ]}>
                {target}ml
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.targetDescription}>
          Recommended: 2000ml per day for optimal hydration
        </Text>
      </View>
    </Animated.View>
  );

  /**
   * Render step 2: Permissions explanation
   */
  const renderPermissions = () => (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
      <View style={styles.emojiContainer}>
        <Text style={styles.emoji}>🔔</Text>
      </View>

      <Text style={styles.title}>Stay Hydrated with Reminders</Text>
      <Text style={styles.subtitle}>
        We'll send you gentle reminders throughout the day to help you stay on track with your hydration goals.
      </Text>

      <View style={styles.permissionContainer}>
        <View style={styles.permissionItem}>
          <Text style={styles.permissionEmoji}>⏰</Text>
          <Text style={styles.permissionText}>
            Smart reminders during your waking hours
          </Text>
        </View>

        <View style={styles.permissionItem}>
          <Text style={styles.permissionEmoji}>🎯</Text>
          <Text style={styles.permissionText}>
            Pause when you reach your daily goal
          </Text>
        </View>

        <View style={styles.permissionItem}>
          <Text style={styles.permissionEmoji}>📊</Text>
          <Text style={styles.permissionText}>
            Track your progress and streaks
          </Text>
        </View>
      </View>

      <Text style={styles.permissionNote}>
        You can customize reminder settings or disable them anytime in the app settings.
      </Text>
    </Animated.View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        {step === 0 ? renderTargetSelection() : renderPermissions()}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            accessible={true}
            accessibilityLabel={step === 0 ? 'Continue to permissions' : 'Start using app'}
            accessibilityRole="button"
          >
            <Text style={styles.continueButtonText}>
              {step === 0 ? 'Continue' : 'Start Hydrating!'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressIndicator}>
          <View
            style={[
              styles.progressDot,
              step === 0 && styles.progressDotActive,
            ]}
          />
          <View
            style={[
              styles.progressDot,
              step === 1 && styles.progressDotActive,
            ]}
          />
        </View>
      </View>

      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>💡 Pro Tips</Text>
        <Text style={styles.tipsText}>
          • Start your day with a glass of water{'\n'}
          • Keep a water bottle nearby throughout the day{'\n'}
          • Set reminders for regular intervals{'\n'}
          • Track your intake to build healthy habits
        </Text>
      </View>
    </ScrollView>
  );
});

FirstLaunchScreen.displayName = 'FirstLaunchScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },

  contentContainer: {
    flexGrow: 1,
    padding: SPACING.LG,
    justifyContent: 'center',
  },

  card: {
    backgroundColor: COLORS.BACKGROUND_CARD,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.XL,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  stepContainer: {
    alignItems: 'center',
  },

  emojiContainer: {
    marginBottom: SPACING.LG,
  },

  emoji: {
    fontSize: 64,
  },

  title: {
    fontSize: TYPOGRAPHY.FONT_SIZE_XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: SPACING.MD,
  },

  subtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.XL,
  },

  targetContainer: {
    width: '100%',
    alignItems: 'center',
  },

  targetLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.MD,
  },

  targetButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.SM,
    marginBottom: SPACING.MD,
  },

  targetButton: {
    backgroundColor: COLORS.BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: BORDER_RADIUS.FULL,
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.SM,
    minWidth: 80,
    alignItems: 'center',
  },

  targetButtonSelected: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },

  targetButtonText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_MEDIUM,
    color: COLORS.TEXT_SECONDARY,
  },

  targetButtonTextSelected: {
    color: COLORS.TEXT_WHITE,
  },

  targetDescription: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_DISABLED,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  permissionContainer: {
    width: '100%',
    marginVertical: SPACING.LG,
  },

  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.SM,
    gap: SPACING.MD,
  },

  permissionEmoji: {
    fontSize: 24,
  },

  permissionText: {
    flex: 1,
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
  },

  permissionNote: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_DISABLED,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: SPACING.MD,
  },

  buttonContainer: {
    alignItems: 'center',
    marginVertical: SPACING.XL,
  },

  continueButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.XXL,
    paddingVertical: SPACING.MD,
    borderRadius: BORDER_RADIUS.FULL,
    minWidth: 200,
    alignItems: 'center',
  },

  continueButtonText: {
    color: COLORS.TEXT_WHITE,
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
  },

  progressIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.SM,
    marginTop: SPACING.MD,
  },

  progressDot: {
    width: 8,
    height: 8,
    borderRadius: BORDER_RADIUS.FULL,
    backgroundColor: COLORS.BACKGROUND_DISABLED,
  },

  progressDotActive: {
    backgroundColor: COLORS.PRIMARY,
  },

  tipsContainer: {
    marginTop: SPACING.LG,
    padding: SPACING.LG,
    backgroundColor: COLORS.BACKGROUND_CARD,
    borderRadius: BORDER_RADIUS.MD,
  },

  tipsTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },

  tipsText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
  },
});