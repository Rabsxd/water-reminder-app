/**
 * Data Reset Dialog component for Water Reminder app
 * Provides confirmation dialog for resetting all user data
 */

import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../utils/constants';
import { useWater } from '../../hooks/useWater';

/**
 * Data Reset Dialog component props
 */
export interface DataResetDialogProps {
  /** Whether the dialog is visible */
  visible: boolean;
  /** Called when dialog is closed without resetting */
  onClose: () => void;
  /** Custom style for container */
  style?: any;
}

/**
 * Data Reset Dialog component for confirming data reset
 * @param {DataResetDialogProps} props - Component props
 * @returns {JSX.Element} Data reset dialog component
 *
 * @example
 * <DataResetDialog
 *   visible={showResetDialog}
 *   onClose={() => setShowResetDialog(false)}
 * />
 */
export const DataResetDialog: React.FC<DataResetDialogProps> = ({
  visible,
  onClose,
  style,
}) => {
  const { resetDaily, updateSettings, updateDailyTarget, updateReminderSettings } = useWater();

  /**
   * Handle data reset with confirmation
   */
  const handleResetData = async () => {
    try {
      // Reset all data to default values
      await resetDaily();
      await updateDailyTarget(2000); // Reset to default target
      await updateReminderSettings({
        enabled: true,
        interval: 60,
        sound: true,
        vibration: true,
        wakeHours: { start: 7, end: 22 },
      });

      Alert.alert(
        'Success',
        'All data has been reset to default values.',
        [{ text: 'OK', onPress: onClose }]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to reset data. Please try again.',
        [{ text: 'OK', onPress: onClose }]
      );
    }
  };

  /**
   * Show additional confirmation before reset
   */
  const showFinalConfirmation = () => {
    Alert.alert(
      '⚠️ Final Warning',
      'This action cannot be undone. Are you absolutely sure you want to reset all data?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Everything',
          style: 'destructive',
          onPress: handleResetData,
        },
      ]
    );
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={[styles.container, style]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>⚠️ Reset All Data</Text>
            <Text style={styles.subtitle}>
              This will permanently delete all your water tracking data
            </Text>
          </View>

          {/* Warning content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.warningSection}>
              <Text style={styles.warningTitle}>What will be deleted:</Text>
              <View style={styles.warningList}>
                <Text style={styles.warningItem}>• All water intake logs</Text>
                <Text style={styles.warningItem}>• Historical data and statistics</Text>
                <Text style={styles.warningItem}>• Custom settings preferences</Text>
                <Text style={styles.warningItem}>• Streak data and achievements</Text>
              </View>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>What will happen:</Text>
              <View style={styles.infoList}>
                <Text style={styles.infoItem}>• Daily target will reset to 2000ml</Text>
                <Text style={styles.infoItem}>• Reminder settings will reset to defaults</Text>
                <Text style={styles.infoItem}>• Wake hours will reset to 07:00-22:00</Text>
                <Text style={styles.infoItem}>• Sound and vibration will be enabled</Text>
              </View>
            </View>

            <View style={styles.finalWarning}>
              <Text style={styles.finalWarningText}>
                🔴 This action cannot be undone. Your data will be permanently lost.
              </Text>
            </View>
          </ScrollView>

          {/* Action buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={showFinalConfirmation}
              activeOpacity={0.8}
            >
              <Text style={styles.resetButtonText}>Reset Everything</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.LG,
  },

  container: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: BORDER_RADIUS.XL,
    maxWidth: 400,
    width: '100%',
    maxHeight: '80%',
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },

  header: {
    padding: SPACING.LG,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
    alignItems: 'center',
  },

  title: {
    fontSize: TYPOGRAPHY.FONT_SIZE_XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    color: COLORS.ERROR,
    marginBottom: SPACING.SM,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.LINE_HEIGHT_NORMAL * TYPOGRAPHY.FONT_SIZE_BASE,
  },

  content: {
    flex: 1,
    padding: SPACING.LG,
  },

  warningSection: {
    marginBottom: SPACING.LG,
  },

  warningTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
    color: COLORS.ERROR,
    marginBottom: SPACING.SM,
  },

  warningList: {
    gap: SPACING.XS,
  },

  warningItem: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT_NORMAL * TYPOGRAPHY.FONT_SIZE_SM,
  },

  infoSection: {
    marginBottom: SPACING.LG,
  },

  infoTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },

  infoList: {
    gap: SPACING.XS,
  },

  infoItem: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT_NORMAL * TYPOGRAPHY.FONT_SIZE_SM,
  },

  finalWarning: {
    backgroundColor: COLORS.ERROR + '10',
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.ERROR,
  },

  finalWarningText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.ERROR,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
    textAlign: 'center',
  },

  actions: {
    flexDirection: 'row',
    padding: SPACING.LG,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
    gap: SPACING.SM,
  },

  button: {
    flex: 1,
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    borderRadius: BORDER_RADIUS.MD,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },

  cancelButton: {
    backgroundColor: COLORS.BACKGROUND_DISABLED,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },

  cancelButtonText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
    color: COLORS.TEXT_SECONDARY,
  },

  resetButton: {
    backgroundColor: COLORS.ERROR,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  resetButtonText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    color: COLORS.TEXT_WHITE,
  },
});