/**
 * Performance Monitor Component
 * Real-time performance monitoring and debugging tool
 *
 * @component
 * @example
 * <PerformanceMonitor visible={showPerfMonitor} />
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';

import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../utils/constants';
import { AppTester } from '../../utils/testingUtils';

/**
 * Performance data interface
 */
interface PerformanceData {
  fps: number;
  memoryUsage: number;
  renderTime: number;
  timestamp: number;
}

/**
 * Performance Monitor Props
 */
interface PerformanceMonitorProps {
  /** Whether monitor is visible */
  visible: boolean;
  /** Callback to hide monitor */
  onHide: () => void;
}

/**
 * Performance Monitor Component
 */
export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = React.memo(({
  visible,
  onHide,
}) => {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [currentFPS, setCurrentFPS] = useState(60);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const frameCount = useRef(0);
  const lastTime = useRef(Date.now());

  /**
   * Calculate FPS
   */
  const calculateFPS = useCallback(() => {
    frameCount.current++;
    const currentTime = Date.now();
    const elapsed = currentTime - lastTime.current;

    if (elapsed >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / elapsed);
      setCurrentFPS(fps);
      frameCount.current = 0;
      lastTime.current = currentTime;

      // Add to performance history
      const newData: PerformanceData = {
        fps,
        memoryUsage,
        renderTime: 16.67, // ~60fps
        timestamp: currentTime,
      };

      setPerformanceData(prev => [...prev.slice(-50), newData]);
    }

    if (isRunning) {
      requestAnimationFrame(calculateFPS);
    }
  }, [isRunning, memoryUsage]);

  /**
   * Start/Stop monitoring
   */
  const toggleMonitoring = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);

  /**
   * Clear performance data
   */
  const clearData = useCallback(() => {
    setPerformanceData([]);
    setCurrentFPS(60);
    setMemoryUsage(0);
  }, []);

  /**
   * Run comprehensive tests
   */
  const runTests = useCallback(async () => {
    try {
      console.log('🧪 Running comprehensive tests...');
      const results = await AppTester.runAllTests();
      console.log('✅ Tests completed:', results.summary);
    } catch (error) {
      console.error('❌ Tests failed:', error);
    }
  }, []);

  /**
   * Get memory usage (simulated)
   */
  const getMemoryUsage = useCallback(() => {
    // In a real app, this would use actual memory APIs
    // For now, simulate memory usage
    const simulated = Math.round(Math.random() * 50 + 100); // 100-150MB
    setMemoryUsage(simulated);
  }, []);

  // Start monitoring when visible
  useEffect(() => {
    if (visible && isRunning) {
      requestAnimationFrame(calculateFPS);
    }
  }, [visible, isRunning, calculateFPS]);

  // Update memory usage periodically
  useEffect(() => {
    if (visible) {
      const interval = setInterval(getMemoryUsage, 2000);
      return () => clearInterval(interval);
    }
  }, [visible, getMemoryUsage]);

  if (!visible) return null;

  const averageFPS = performanceData.length > 0
    ? Math.round(performanceData.reduce((sum, data) => sum + data.fps, 0) / performanceData.length)
    : 60;

  const minFPS = performanceData.length > 0
    ? Math.min(...performanceData.map(data => data.fps))
    : 60;

  const maxFPS = performanceData.length > 0
    ? Math.max(...performanceData.map(data => data.fps))
    : 60;

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Performance Monitor</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onHide}
            accessible={true}
            accessibilityLabel="Close performance monitor"
            accessibilityRole="button"
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Current Metrics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Current Performance</Text>

            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>FPS:</Text>
              <Text style={[
                styles.metricValue,
                { color: currentFPS >= 60 ? COLORS.SUCCESS : currentFPS >= 30 ? COLORS.WARNING : COLORS.ERROR }
              ]}>
                {currentFPS}
              </Text>
            </View>

            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Memory:</Text>
              <Text style={styles.metricValue}>{memoryUsage}MB</Text>
            </View>

            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Platform:</Text>
              <Text style={styles.metricValue}>{Platform.OS}</Text>
            </View>
          </View>

          {/* Performance Statistics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performance Statistics</Text>

            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Average FPS:</Text>
              <Text style={[
                styles.metricValue,
                { color: averageFPS >= 60 ? COLORS.SUCCESS : averageFPS >= 30 ? COLORS.WARNING : COLORS.ERROR }
              ]}>
                {averageFPS}
              </Text>
            </View>

            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Min FPS:</Text>
              <Text style={[
                styles.metricValue,
                { color: minFPS >= 60 ? COLORS.SUCCESS : minFPS >= 30 ? COLORS.WARNING : COLORS.ERROR }
              ]}>
                {minFPS}
              </Text>
            </View>

            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Max FPS:</Text>
              <Text style={styles.metricValue}>{maxFPS}</Text>
            </View>

            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Data Points:</Text>
              <Text style={styles.metricValue}>{performanceData.length}</Text>
            </View>
          </View>

          {/* Quality Indicators */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quality Indicators</Text>

            <View style={styles.indicatorRow}>
              <Text style={styles.indicatorLabel}>60fps Scrolling:</Text>
              <Text style={[
                styles.indicatorValue,
                { color: averageFPS >= 60 ? COLORS.SUCCESS : COLORS.ERROR }
              ]}>
                {averageFPS >= 60 ? '✅ PASS' : '❌ FAIL'}
              </Text>
            </View>

            <View style={styles.indicatorRow}>
              <Text style={styles.indicatorLabel}>60fps Animations:</Text>
              <Text style={[
                styles.indicatorValue,
                { color: averageFPS >= 60 ? COLORS.SUCCESS : COLORS.ERROR }
              ]}>
                {averageFPS >= 60 ? '✅ PASS' : '❌ FAIL'}
              </Text>
            </View>

            <View style={styles.indicatorRow}>
              <Text style={styles.indicatorLabel}>Memory {'<'} 150MB:</Text>
              <Text style={[
                styles.indicatorValue,
                { color: memoryUsage < 150 ? COLORS.SUCCESS : COLORS.WARNING }
              ]}>
                {memoryUsage < 150 ? '✅ GOOD' : memoryUsage < 200 ? '⚠️ HIGH' : '❌ CRITICAL'}
              </Text>
            </View>
          </View>

          {/* Control Buttons */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Controls</Text>

            <TouchableOpacity
              style={[
                styles.controlButton,
                { backgroundColor: isRunning ? COLORS.ERROR : COLORS.PRIMARY }
              ]}
              onPress={toggleMonitoring}
              accessible={true}
              accessibilityLabel={isRunning ? 'Stop monitoring' : 'Start monitoring'}
              accessibilityRole="button"
            >
              <Text style={styles.controlButtonText}>
                {isRunning ? 'Stop Monitoring' : 'Start Monitoring'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, styles.secondaryButton]}
              onPress={clearData}
              accessible={true}
              accessibilityLabel="Clear performance data"
              accessibilityRole="button"
            >
              <Text style={styles.secondaryButtonText}>Clear Data</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, styles.testButton]}
              onPress={runTests}
              accessible={true}
              accessibilityLabel="Run comprehensive tests"
              accessibilityRole="button"
            >
              <Text style={styles.controlButtonText}>Run Tests</Text>
            </TouchableOpacity>
          </View>

          {/* Performance Guidelines */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performance Guidelines</Text>
            <Text style={styles.guidelineText}>
              <Text style={styles.guidelineTitle}>Target Metrics:</Text>
              {'•'} FPS: 60+ (smooth animations){'\n'}
              {'•'} Memory: {'<'}150MB (efficient usage){'\n'}
              {'•'} Startup: {'<'}2000ms (fast load){'\n'}
              {'•'} APK Size: {'<'}30MB (small footprint)
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
});

PerformanceMonitor.displayName = 'PerformanceMonitor';

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },

  container: {
    backgroundColor: COLORS.BACKGROUND_CARD,
    borderRadius: BORDER_RADIUS.LG,
    width: '90%',
    maxHeight: '80%',
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.LG,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },

  title: {
    fontSize: TYPOGRAPHY.FONT_SIZE_LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
    color: COLORS.TEXT_PRIMARY,
  },

  closeButton: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.FULL,
    backgroundColor: COLORS.ERROR + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeButtonText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_LG,
    color: COLORS.ERROR,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
  },

  content: {
    flex: 1,
    padding: SPACING.LG,
  },

  section: {
    marginBottom: SPACING.LG,
  },

  sectionTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },

  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.XS,
  },

  metricLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
  },

  metricValue: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_MEDIUM,
    color: COLORS.TEXT_PRIMARY,
  },

  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.XS,
  },

  indicatorLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
  },

  indicatorValue: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_BOLD,
  },

  controlButton: {
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    borderRadius: BORDER_RADIUS.MD,
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },

  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
  },

  testButton: {
    backgroundColor: COLORS.SUCCESS,
  },

  controlButtonText: {
    color: COLORS.TEXT_WHITE,
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
  },

  secondaryButtonText: {
    color: COLORS.PRIMARY,
    fontSize: TYPOGRAPHY.FONT_SIZE_BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
  },

  guidelineText: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
  },

  guidelineTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE_SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT_SEMI_BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
});