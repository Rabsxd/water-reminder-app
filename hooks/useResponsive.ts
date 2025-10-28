/**
 * Responsive design hook for Water Reminder app
 * Provides responsive utilities and screen size detection
 */

import { useState, useEffect } from 'react';
import { Dimensions, Platform } from 'react-native';
import { BREAKPOINTS } from '../utils/constants';

/**
 * Screen dimensions type
 */
interface ScreenDimensions {
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
}

/**
 * Breakpoint type
 */
type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Responsive utilities type
 */
interface ResponsiveUtils {
  /**
   * Current breakpoint
   */
  breakpoint: Breakpoint;

  /**
   * Whether screen is small
   */
  isSmall: boolean;

  /**
   * Whether screen is medium
   */
  isMedium: boolean;

  /**
   * Whether screen is large
   */
  isLarge: boolean;

  /**
   * Whether screen is extra large
   */
  isExtraLarge: boolean;

  /**
   * Whether device is a tablet
   */
  isTablet: boolean;

  /**
   * Whether device is mobile
   */
  isMobile: boolean;

  /**
   * Screen width
   */
  width: number;

  /**
   * Screen height
   */
  height: number;

  /**
   * Screen orientation
   */
  orientation: 'portrait' | 'landscape';

  /**
   * Get responsive value based on breakpoint
   */
  getValue: <T>(values: Partial<Record<Breakpoint, T>>) => T | undefined;

  /**
   * Get responsive style object
   */
  getStyle: (styles: Partial<Record<Breakpoint, any>>) => any;

  /**
   * Get responsive font size
   */
  getFontSize: (baseSize: number) => number;

  /**
   * Get responsive spacing
   */
  getSpacing: (baseSpacing: number) => number;

  /**
   * Get responsive number of columns
   */
  getColumns: (maxColumns: number) => number;
}

/**
 * Hook for responsive design utilities
 * @returns {ResponsiveUtils} Responsive utilities and screen information
 *
 * @example
 * const { breakpoint, isSmall, getValue, getFontSize } = useResponsive();
 *
 * // Get value based on breakpoint
 * const padding = getValue({
 *   xs: 8,
 *   sm: 12,
 *   md: 16,
 *   lg: 24,
 *   xl: 32,
 * });
 *
 * // Get responsive font size
 * const fontSize = getFontSize(16);
 *
 * // Conditional rendering
 * if (isSmall) {
 *   // Show mobile layout
 * }
 */
export const useResponsive = (): ResponsiveUtils => {
  const [dimensions, setDimensions] = useState<ScreenDimensions>(() => {
    const { width, height } = Dimensions.get('window');
    return {
      width,
      height,
      orientation: width > height ? 'landscape' : 'portrait',
    };
  });

  // Update dimensions on change
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({
        width: window.width,
        height: window.height,
        orientation: window.width > window.height ? 'landscape' : 'portrait',
      });
    });

    return () => subscription?.remove();
  }, []);

  /**
   * Get current breakpoint based on screen width
   */
  const getBreakpoint = (width: number): Breakpoint => {
    if (width < BREAKPOINTS.SM) return 'xs';
    if (width < BREAKPOINTS.MD) return 'sm';
    if (width < BREAKPOINTS.LG) return 'md';
    if (width < BREAKPOINTS.XL) return 'lg';
    return 'xl';
  };

  const breakpoint = getBreakpoint(dimensions.width);
  const isSmall = dimensions.width < BREAKPOINTS.MD;
  const isMedium = dimensions.width >= BREAKPOINTS.MD && dimensions.width < BREAKPOINTS.LG;
  const isLarge = dimensions.width >= BREAKPOINTS.LG && dimensions.width < BREAKPOINTS.XL;
  const isExtraLarge = dimensions.width >= BREAKPOINTS.XL;

  // Platform detection
  const isTablet = Platform.OS === 'ios' && Platform.isPad || dimensions.width >= BREAKPOINTS.MD;
  const isMobile = !isTablet;

  /**
   * Get responsive value based on breakpoint
   * Falls back to smaller breakpoint if exact match not found
   */
  const getValue = <T>(values: Partial<Record<Breakpoint, T>>): T | undefined => {
    // Return exact match
    if (values[breakpoint] !== undefined) {
      return values[breakpoint];
    }

    // Fall back to smaller breakpoints
    const breakpoints: Breakpoint[] = ['xl', 'lg', 'md', 'sm', 'xs'];
    const currentIndex = breakpoints.indexOf(breakpoint);

    for (let i = currentIndex - 1; i >= 0; i--) {
      const bp = breakpoints[i];
      if (values[bp] !== undefined) {
        return values[bp];
      }
    }

    return undefined;
  };

  /**
   * Get responsive style object
   */
  const getStyle = (styles: Partial<Record<Breakpoint, any>>): any => {
    return getValue(styles) || {};
  };

  /**
   * Get responsive font size
   */
  const getFontSize = (baseSize: number): number => {
    const scaleFactors = {
      xs: 0.875,
      sm: 0.875,
      md: 1.0,
      lg: 1.125,
      xl: 1.25,
    };

    const scaleFactor = scaleFactors[breakpoint];
    return Math.round(baseSize * scaleFactor);
  };

  /**
   * Get responsive spacing
   */
  const getSpacing = (baseSpacing: number): number => {
    const scaleFactors = {
      xs: 0.75,
      sm: 0.875,
      md: 1.0,
      lg: 1.25,
      xl: 1.5,
    };

    const scaleFactor = scaleFactors[breakpoint];
    return Math.round(baseSpacing * scaleFactor);
  };

  /**
   * Get responsive number of columns for grid layouts
   */
  const getColumns = (maxColumns: number): number => {
    const columnConfigs = {
      xs: Math.min(1, maxColumns),
      sm: Math.min(2, maxColumns),
      md: Math.min(3, maxColumns),
      lg: Math.min(4, maxColumns),
      xl: maxColumns,
    };

    return columnConfigs[breakpoint];
  };

  return {
    breakpoint,
    isSmall,
    isMedium,
    isLarge,
    isExtraLarge,
    isTablet,
    isMobile,
    getValue,
    getStyle,
    getFontSize,
    getSpacing,
    getColumns,
    width: dimensions.width,
    height: dimensions.height,
    orientation: dimensions.orientation,
  };
};

/**
 * Hook for screen orientation
 * @returns {ScreenDimensions} Screen dimensions and orientation
 */
export const useOrientation = (): ScreenDimensions => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(() => {
    const { width, height } = Dimensions.get('window');
    return width > height ? 'landscape' : 'portrait';
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setOrientation(window.width > window.height ? 'landscape' : 'portrait');
    });

    return () => subscription?.remove();
  }, []);

  const { width, height } = Dimensions.get('window');

  return { width, height, orientation };
};

/**
 * Hook for device type detection
 * @returns {Object} Device type information
 */
export const useDeviceType = () => {
  const { width } = useResponsive();
  const { orientation } = useOrientation();

  const isTablet = width >= BREAKPOINTS.MD;
  const isMobile = !isTablet;
  const isLandscape = orientation === 'landscape';
  const isPortrait = orientation === 'portrait';

  return {
    isTablet,
    isMobile,
    isLandscape,
    isPortrait,
    platform: Platform.OS,
    isIOS: Platform.OS === 'ios',
    isAndroid: Platform.OS === 'android',
  };
};

/**
 * Default export
 */
export default useResponsive;