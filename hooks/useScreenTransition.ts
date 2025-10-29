/**
 * Screen Transition hook for Water Reminder app
 * Provides smooth screen transitions using React Native Reanimated
 */

import React, { useCallback } from "react";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  SharedValue,
} from "react-native-reanimated";

/**
 * Transition types
 */
export type TransitionType =
  | "fade"
  | "slide"
  | "slideUp"
  | "slideDown"
  | "slideLeft"
  | "slideRight"
  | "scale"
  | "flip"
  | "none";

/**
 * Transition configuration
 */
export interface TransitionConfig {
  /** Type of transition */
  type: TransitionType;
  /** Duration in milliseconds */
  duration?: number;
  /** Spring damping for spring animations */
  damping?: number;
  /** Spring stiffness */
  stiffness?: number;
  /** Easing function for timing animations */
  easing?: string;
  /** Whether to reverse the animation */
  reverse?: boolean;
}

/**
 * Screen transition hook return type
 */
interface UseScreenTransitionReturn {
  /** Animated style for the screen */
  screenStyle: any;
  /** Start transition animation */
  startTransition: (config?: TransitionConfig) => Promise<void>;
  /** Start exit animation */
  startExitTransition: (config?: TransitionConfig) => Promise<void>;
  /** Transition completion callback */
  onTransitionComplete?: () => void;
  /** Current transition progress (0-1) */
  progress: SharedValue<number>;
}

/**
 * Hook for screen transitions
 * @param {Object} options - Transition options
 * @returns {UseScreenTransitionReturn} Transition utilities and styles
 *
 * @example
 * const { screenStyle, startTransition } = useScreenTransition();
 *
 * // Start fade transition
 * await startTransition({ type: 'fade', duration: 300 });
 *
 * // Start slide transition
 * await startTransition({ type: 'slideRight', duration: 500 });
 */
export const useScreenTransition = (
  options: {
    /** Initial transition to run on mount */
    initialTransition?: TransitionConfig;
    /** Callback when transition completes */
    onTransitionComplete?: () => void;
  } = {}
): UseScreenTransitionReturn => {
  const { initialTransition, onTransitionComplete } = options;

  // Animation values
  const progress = useSharedValue(0);
  const opacity = useSharedValue(initialTransition ? 0 : 1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(initialTransition ? 0.8 : 1);
  const rotation = useSharedValue(0);

  /**
   * Start transition animation
   */
  const startTransition = useCallback(
    async (config?: TransitionConfig): Promise<void> => {
      return new Promise((resolve) => {
        const {
          type = "fade",
          duration = 300,
          damping = 20,
          stiffness = 100,
          easing = "out",
          reverse = false,
        } = config || {};

        // Reset values
        opacity.value = reverse ? 1 : 0;
        translateX.value = reverse ? 0 : getInitialTranslateX(type);
        translateY.value = reverse ? 0 : getInitialTranslateY(type);
        scale.value = reverse ? 1 : getInitialScale(type);
        rotation.value = reverse ? 0 : getInitialRotation(type);

        // Animate to final values
        const animationConfig = {
          duration,
          easing: getEasingFunction(easing),
        };

        switch (type) {
          case "fade":
            opacity.value = withTiming(reverse ? 0 : 1, animationConfig, () => {
              runOnJS(resolve)();
              onTransitionComplete?.();
            });
            break;

          case "slide":
          case "slideLeft":
          case "slideRight":
          case "slideUp":
          case "slideDown":
            opacity.value = withTiming(1, animationConfig);
            translateX.value = withTiming(
              reverse ? getFinalTranslateX(type) : 0,
              animationConfig
            );
            translateY.value = withTiming(
              reverse ? getFinalTranslateY(type) : 0,
              animationConfig,
              () => {
                runOnJS(resolve)();
                onTransitionComplete?.();
              }
            );
            break;

          case "scale":
            opacity.value = withTiming(1, animationConfig);
            scale.value = withSpring(
              reverse ? 0.8 : 1,
              {
                damping,
                stiffness,
              },
              () => {
                runOnJS(resolve)();
                onTransitionComplete?.();
              }
            );
            break;

          case "flip":
            opacity.value = withTiming(1, animationConfig);
            rotation.value = withTiming(
              reverse ? 180 : 0,
              {
                ...animationConfig,
                duration: duration * 0.6,
              },
              () => {
                runOnJS(resolve)();
                onTransitionComplete?.();
              }
            );
            break;

          default:
            runOnJS(resolve)();
            onTransitionComplete?.();
        }

        // Update progress
        progress.value = withTiming(1, animationConfig);
      });
    },
    [onTransitionComplete]
  );

  /**
   * Start exit animation
   */
  const startExitTransition = useCallback(
    async (config?: TransitionConfig): Promise<void> => {
      const finalConfig: TransitionConfig = {
        type: config?.type || 'fade',
        reverse: true,
        duration: config?.duration,
        damping: config?.damping,
        stiffness: config?.stiffness,
        easing: config?.easing,
      };
      return startTransition(finalConfig);
    },
    [startTransition]
  );

  /**
   * Get initial translate X for slide animations
   */
  const getInitialTranslateX = (type: TransitionType): number => {
    switch (type) {
      case "slideLeft":
        return 100;
      case "slideRight":
        return -100;
      case "slide":
        return 50;
      default:
        return 0;
    }
  };

  /**
   * Get initial translate Y for slide animations
   */
  const getInitialTranslateY = (type: TransitionType): number => {
    switch (type) {
      case "slideUp":
        return 100;
      case "slideDown":
        return -100;
      case "slide":
        return 50;
      default:
        return 0;
    }
  };

  /**
   * Get final translate X for slide animations
   */
  const getFinalTranslateX = (type: TransitionType): number => {
    switch (type) {
      case "slideLeft":
        return -100;
      case "slideRight":
        return 100;
      case "slide":
        return -50;
      default:
        return 0;
    }
  };

  /**
   * Get final translate Y for slide animations
   */
  const getFinalTranslateY = (type: TransitionType): number => {
    switch (type) {
      case "slideUp":
        return -100;
      case "slideDown":
        return 100;
      case "slide":
        return -50;
      default:
        return 0;
    }
  };

  /**
   * Get initial scale for scale animation
   */
  const getInitialScale = (type: TransitionType): number => {
    return type === "scale" ? 0.8 : 1;
  };

  /**
   * Get initial rotation for flip animation
   */
  const getInitialRotation = (type: TransitionType): number => {
    return type === "flip" ? 180 : 0;
  };

  /**
   * Get easing function
   */
  const getEasingFunction = (easing: string): any => {
    switch (easing) {
      case "in":
        return Easing.in(Easing.quad);
      case "out":
        return Easing.out(Easing.quad);
      case "inOut":
        return Easing.inOut(Easing.quad);
      case "linear":
        return Easing.linear;
      default:
        return Easing.out(Easing.quad);
    }
  };

  // Animated styles
  const screenStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotateY: `${rotation.value}deg` },
    ],
  }));

  // Run initial transition if provided
  // Note: This would need to be handled in component effect
  // React.useEffect(() => {
  //   if (initialTransition) {
  //     startTransition(initialTransition);
  //   }
  // }, [initialTransition]);

  return {
    screenStyle,
    startTransition,
    startExitTransition,
    onTransitionComplete,
    progress,
  };
};

/**
 * Preset transition configurations
 */
export const TRANSITION_PRESETS = {
  // Gentle transitions
  GENTLE_FADE: { type: "fade" as TransitionType, duration: 400, easing: "out" },
  GENTLE_SLIDE: {
    type: "slideRight" as TransitionType,
    duration: 500,
    easing: "out",
  },
  GENTLE_SCALE: {
    type: "scale" as TransitionType,
    duration: 600,
    damping: 25,
    stiffness: 100,
  },

  // Quick transitions
  QUICK_FADE: { type: "fade" as TransitionType, duration: 200, easing: "out" },
  QUICK_SLIDE: {
    type: "slideUp" as TransitionType,
    duration: 250,
    easing: "out",
  },

  // Smooth transitions
  SMOOTH_SLIDE: {
    type: "slideRight" as TransitionType,
    duration: 400,
    damping: 20,
    stiffness: 100,
  },
  SMOOTH_SCALE: {
    type: "scale" as TransitionType,
    duration: 500,
    damping: 30,
    stiffness: 100,
  },

  // Playful transitions
  PLAYFUL_BOUNCE: {
    type: "scale" as TransitionType,
    duration: 800,
    damping: 15,
    stiffness: 80,
  },
  PLAYFUL_FLIP: {
    type: "flip" as TransitionType,
    duration: 600,
    easing: "inOut",
  },

  // Professional transitions
  PROFESSIONAL_SLIDE: {
    type: "slideLeft" as TransitionType,
    duration: 300,
    easing: "out",
  },
  PROFESSIONAL_FADE: {
    type: "fade" as TransitionType,
    duration: 250,
    easing: "out",
  },
} as const;

/**
 * Hook for transition between screens
 */
export const useScreenNavigation = () => {
  const { startTransition, startExitTransition } = useScreenTransition();

  /**
   * Navigate to next screen with transition
   */
  const navigateToNext = useCallback(
    async (preset?: keyof typeof TRANSITION_PRESETS) => {
      const config = preset
        ? TRANSITION_PRESETS[preset]
        : TRANSITION_PRESETS.SMOOTH_SLIDE;
      await startTransition(config);
    },
    [startTransition]
  );

  /**
   * Navigate back with transition
   */
  const navigateBack = useCallback(
    async (preset?: keyof typeof TRANSITION_PRESETS) => {
      const config = preset
        ? TRANSITION_PRESETS[preset]
        : TRANSITION_PRESETS.QUICK_SLIDE;
      await startExitTransition(config);
    },
    [startExitTransition]
  );

  /**
   * Replace current screen with transition
   */
  const replaceScreen = useCallback(
    async (preset?: keyof typeof TRANSITION_PRESETS) => {
      const config = preset
        ? TRANSITION_PRESETS[preset]
        : TRANSITION_PRESETS.GENTLE_FADE;
      await startTransition(config);
    },
    [startTransition]
  );

  return {
    navigateToNext,
    navigateBack,
    replaceScreen,
    startTransition,
    startExitTransition,
  };
};

/**
 * Hook for tab transitions
 */
export const useTabTransition = (index: number, activeIndex: number) => {
  const translateX = useSharedValue(index === activeIndex ? 0 : 100);
  const opacity = useSharedValue(index === activeIndex ? 1 : 0);
  const scale = useSharedValue(index === activeIndex ? 1 : 0.95);

  // Update values when index changes
  React.useEffect(() => {
    if (index === activeIndex) {
      translateX.value = withSpring(0, { damping: 20, stiffness: 100 });
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSpring(1, { damping: 20, stiffness: 100 });
    } else {
      translateX.value = withSpring(100, { damping: 20, stiffness: 100 });
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withSpring(0.95, { damping: 20, stiffness: 100 });
    }
  }, [index, activeIndex]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  return { style };
};

export default useScreenTransition;
