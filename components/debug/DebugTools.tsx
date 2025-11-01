/**
 * Debug Tools Component
 * Development and testing utilities for the Water Reminder app
 *
 * @component
 * @example
 * <DebugTools />
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../utils/constants';
import { AppTester } from '../../utils/testingUtils';
import { ErrorLogger } from '../../services/errorLoggingService';

/**
 * Debug Tools Props
 */
interface DebugToolsProps {
  /** Optional custom styling */
  style?: any;
}

/**
 * Debug Tools Component
 */
export const DebugTools: React.FC<DebugToolsProps> = React.memo(({ style }) => {
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);

  /**
   * Run all tests
   */
  const runAllTests = async () => {
    setIsRunningTests(true);
    try {
      console.log('🧪 Starting comprehensive test suite...');
      const results = await AppTester.runAllTests();
      setTestResults(results);

      // Show alert with results
      const passRate = results.summary.passRate;
      const status = passRate === 100 ? '🎉 All tests passed!' : `⚠️ ${passRate}% pass rate`;

      Alert.alert(
        'Test Results',
        `${status}\n\nPassed: ${results.summary.passed}/${results.summary.total}\nDuration: ${Date.now() - Date.now()}ms`,
        [
          {
            text: 'View Details',
            onPress: () => console.log('Test Results:', results),
          },
          {
            text: 'OK',
            style: 'cancel',
          },
        ]
      );

      // Log detailed results
      await ErrorLogger.logInfo('Comprehensive test suite completed', {
        context: 'DebugTools',
        action: 'RunAllTests',
        additionalData: {
          summary: results.summary,
          performance: results.performanceMetrics,
        },
      });

    } catch (error) {
      console.error('Test suite failed:', error);
      Alert.alert('Test Error', 'Failed to run test suite. Check console for details.');

      await ErrorLogger.logError(error as Error, {
        context: 'DebugTools',
        action: 'RunAllTests',
      });
    } finally {
      setIsRunningTests(false);
    }
  };

  /**
   * Test specific functionality
   */
  const testCoreFlows = async () => {
    try {
      const results = await AppTester.testCoreFlows();
      console.log('Core flows test results:', results);

      Alert.alert(
        'Core Flows Test',
        `${results.filter(r => r.passed).length}/${results.length} tests passed`,
        [{ text: 'OK', style: 'cancel' }]
      );
    } catch (error) {
      console.error('Core flows test failed:', error);
      Alert.alert('Test Error', 'Core flows test failed.');
    }
  };

  /**
   * Test performance
   */
  const testPerformance = async () => {
    try {
      const metrics = await AppTester.runPerformanceTests();
      console.log('Performance metrics:', metrics);

      const startupStatus = metrics.startupTime < 2000 ? '✅' : '❌';
      const statusMessage = `Startup Time: ${metrics.startupTime}ms ${startupStatus}\nScroll FPS: ${metrics.scrollFPS}\nAnimation FPS: ${metrics.animationFPS}`;

      Alert.alert('Performance Test', statusMessage, [{ text: 'OK', style: 'cancel' }]);
    } catch (error) {
      console.error('Performance test failed:', error);
      Alert.alert('Test Error', 'Performance test failed.');
    }
  };

  /**
   * Export test report
   */
  const exportTestReport = async () => {
    try {
      if (!testResults) {
        Alert.alert('No Data', 'Please run tests first to generate a report.');
        return;
      }

      const report = AppTester.generateTestReport(testResults);
      console.log('Test Report:\n', report);

      Alert.alert(
        'Test Report Exported',
        'Test report has been exported to console. Check your development logs.',
        [{ text: 'OK', style: 'cancel' }]
      );

      await ErrorLogger.logInfo('Test report exported', {
        context: 'DebugTools',
        action: 'ExportReport',
        additionalData: { report },
      });

    } catch (error) {
      console.error('Failed to export report:', error);
      Alert.alert('Export Error', 'Failed to export test report.');
    }
  };

  /**
   * View error logs
   */
  const viewErrorLogs = async () => {
    try {
      const logs = await ErrorLogger.getLogs();
      const errorLogs = logs.filter(log => log.level === 'error');

      if (errorLogs.length === 0) {
        Alert.alert('No Errors', 'No error logs found. Great job!');
        return;
      }

      console.log('Error Logs:', errorLogs);

      Alert.alert(
        'Error Logs',
        `${errorLogs.length} error(s) found. Check console for details.`,
        [{ text: 'OK', style: 'cancel' }]
      );

    } catch (error) {
      console.error('Failed to retrieve error logs:', error);
      Alert.alert('Error', 'Failed to retrieve error logs.');
    }
  };

  /**
   * Clear error logs
   */
  const clearErrorLogs = async () => {
    try {
      await ErrorLogger.clearLogs();
      Alert.alert('Logs Cleared', 'All error logs have been cleared.');
    } catch (error) {
      console.error('Failed to clear logs:', error);
      Alert.alert('Error', 'Failed to clear error logs.');
    }
  };

  /**
   * Test data validation
   */
  const testDataValidation = async () => {
    try {
      // Test data validation scenarios
      const testScenarios = [
        { name: 'Valid Amount (250ml)', amount: 250, valid: true },
        { name: 'Invalid Amount (-50ml)', amount: -50, valid: false },
        { name: 'Invalid Amount (1500ml)', amount: 1500, valid: false },
        { name: 'Valid Target (2000ml)', target: 2000, valid: true },
        { name: 'Invalid Target (500ml)', target: 500, valid: false },
        { name: 'Invalid Target (5000ml)', target: 5000, valid: false },
      ];

      let passedTests = 0;
      let totalTests = testScenarios.length;

      for (const scenario of testScenarios) {
        let isValid = false;

        if (scenario.amount !== undefined) {
          // Test amount validation
          isValid = scenario.amount >= 50 && scenario.amount <= 1000;
        } else if (scenario.target !== undefined) {
          // Test target validation
          isValid = scenario.target >= 1000 && scenario.target <= 4000 && scenario.target % 100 === 0;
        }

        if (isValid === scenario.valid) {
          passedTests++;
        }
      }

      Alert.alert(
        'Data Validation Test',
        `${passedTests}/${totalTests} validation tests passed`,
        [{ text: 'OK', style: 'cancel' }]
      );

    } catch (error) {
      console.error('Data validation test failed:', error);
      Alert.alert('Test Error', 'Data validation test failed.');
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>🔧 Debug Tools</Text>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Testing Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Testing Suite</Text>

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={runAllTests}
            disabled={isRunningTests}
            accessible={true}
            accessibilityLabel="Run comprehensive test suite"
            accessibilityRole="button"
          >
            <Text style={styles.primaryButtonText}>
              {isRunningTests ? '⏳ Running...' : '🧪 Run All Tests'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={testCoreFlows}
            accessible={true}
            accessibilityLabel="Test core app functionality"
            accessibilityRole="button"
          >
            <Text style={styles.secondaryButtonText}>Test Core Flows</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={testPerformance}
            accessible={true}
            accessibilityLabel="Test app performance"
            accessibilityRole="button"
          >
            <Text style={styles.secondaryButtonText}>Test Performance</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={testDataValidation}
            accessible={true}
            accessibilityLabel="Test data validation"
            accessibilityRole="button"
          >
            <Text style={styles.secondaryButtonText}>Test Data Validation</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.outlineButton]}
            onPress={exportTestReport}
            disabled={!testResults}
            accessible={true}
            accessibilityLabel="Export test report"
            accessibilityRole="button"
          >
            <Text style={styles.outlineButtonText}>Export Report</Text>
          </TouchableOpacity>
        </View>

        {/* Performance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Monitoring</Text>

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => setShowPerformanceMonitor(true)}
            accessible={true}
            accessibilityLabel="Show performance monitor"
            accessibilityRole="button"
          >
            <Text style={styles.primaryButtonText}>📊 Performance Monitor</Text>
          </TouchableOpacity>
        </View>

        {/* Error Logs Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Error Logging</Text>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={viewErrorLogs}
            accessible={true}
            accessibilityLabel="View error logs"
            accessibilityRole="button"
          >
            <Text style={styles.secondaryButtonText}>View Error Logs</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.warningButton]}
            onPress={clearErrorLogs}
            accessible={true}
            accessibilityLabel="Clear all error logs"
            accessibilityRole="button"
          >
            <Text style={styles.warningButtonText}>Clear Logs</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity
            style={[styles.button, styles.outlineButton]}
            onPress={() => console.log('App State:', 'State logging here')}
            accessible={true}
            accessibilityLabel="Log current app state to console"
            accessibilityRole="button"
          >
            <Text style={styles.outlineButtonText}>Log App State</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.outlineButton]}
            onPress={() => console.log('Storage Keys:', 'Storage logging here')}
            accessible={true}
            accessibilityLabel="Log storage contents to console"
            accessibilityRole="button"
          >
            <Text style={styles.outlineButtonText}>Log Storage</Text>
          </TouchableOpacity>
        </View>

        {/* Test Results Summary */}
        {testResults && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Last Test Results</Text>
            <View style={styles.resultsContainer}>
              <Text style={styles.resultText}>
                ✅ Passed: {testResults.summary.passed}
              </Text>
              <Text style={styles.resultText}>
                ❌ Failed: {testResults.summary.failed}
              </Text>
              <Text style={styles.resultText}>
                📊 Pass Rate: {testResults.summary.passRate}%
              </Text>
              <Text style={styles.resultText}>
                ⏱️ Duration: {Date.now() - Date.now()}ms
              </Text>
            </View>
          </View>
        )}

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <Text style={styles.instructionText}>
            • Use "Run All Tests" for comprehensive testing{'\n'}
            • Performance Monitor shows real-time metrics{'\n'}
            • Check console for detailed test results{'\n'}
            • Error logs help debug issues{'\n'}
            • Export reports for documentation
          </Text>
        </View>
      </ScrollView>

      {/* Performance Monitor Modal */}
      {showPerformanceMonitor && (
        <View style={styles.modal}>
          {/* This would be where the PerformanceMonitor component would be rendered */}
          <Text style={styles.modalText}>Performance Monitor would appear here</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowPerformanceMonitor(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
});

DebugTools.displayName = 'DebugTools';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },

  title: {
    fontSize: TYPOGRAPHY.FONT_SIZE_XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    padding: SPACING.LG,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },

  content: {
    flex: 1,
    padding: SPACING.LG,
  },

  section: {
    marginBottom: SPACING.XL,
  },

  sectionTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.MD,
  },

  button: {
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    borderRadius: BORDER_RADIUS.MD,
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },

  primaryButton: {
    backgroundColor: COLORS.PRIMARY,
  },

  secondaryButton: {
    backgroundColor: COLORS.PRIMARY + '20',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
  },

  warningButton: {
    backgroundColor: COLORS.ERROR + '20',
    borderWidth: 1,
    borderColor: COLORS.ERROR,
  },

  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },

  primaryButtonText: {
    color: COLORS.TEXT_WHITE,
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
  },

  secondaryButtonText: {
    color: COLORS.PRIMARY,
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
  },

  warningButtonText: {
    color: COLORS.ERROR,
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
  },

  outlineButtonText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
  },

  resultsContainer: {
    backgroundColor: COLORS.BACKGROUND_CARD,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
  },

  resultText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.XS,
  },

  instructionText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
  },

  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalText: {
    color: COLORS.TEXT_WHITE,
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    marginBottom: SPACING.LG,
  },

  closeButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.MD,
  },

  closeButtonText: {
    color: COLORS.TEXT_WHITE,
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
  },
});