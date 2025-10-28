/**
 * Type definitions for the Water Reminder app
 * Contains all TypeScript interfaces and types used throughout the application
 */

/**
 * Water intake log entry interface
 * @interface WaterLogEntry
 */
export interface WaterLogEntry {
  id: string;
  timestamp: string; // ISO8601 format
  amount: number; // milliliters
}

/**
 * Today's water data interface
 * @interface TodayData
 */
export interface TodayData {
  date: string; // YYYY-MM-DD format
  intake: number; // total intake in milliliters
  logs: WaterLogEntry[];
}

/**
 * Historical data entry interface
 * @interface HistoryEntry
 */
export interface HistoryEntry {
  date: string; // YYYY-MM-DD format
  totalIntake: number; // total intake in milliliters
  target: number; // daily target in milliliters
  completed: boolean; // whether 80% target was reached
}

/**
 * User settings interface
 * @interface UserSettings
 */
export interface UserSettings {
  dailyTarget: number; // milliliters (1000-4000)
  reminderInterval: number; // minutes (15-240)
  reminderEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  wakeHours: {
    start: number; // hour (0-23)
    end: number; // hour (1-24)
  };
}

/**
 * Water context state interface
 * @interface WaterState
 */
export interface WaterState {
  // User preferences
  settings: UserSettings;

  // Current day data
  today: TodayData;

  // Historical data (last 30 days)
  history: HistoryEntry[];

  // Computed values (not stored)
  streak: number;
  weeklyAverage: number;

  // UI state
  isLoading: boolean;
  error: string | null;
}

/**
 * Water context action types
 * @typedef WaterAction
 */
export type WaterAction =
  | { type: "ADD_DRINK"; payload: { amount: number; timestamp: string } }
  | { type: "REMOVE_DRINK"; payload: string } // drink id
  | { type: "UPDATE_TODAY_INTAKE"; payload: number }
  | { type: "RESET_DAILY" }
  | { type: "UPDATE_SETTINGS"; payload: Partial<UserSettings> }
  | {
      type: "LOAD_DATA";
      payload: {
        settings: UserSettings;
        today: TodayData;
        history: HistoryEntry[];
      };
    }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "CLEAR_ERROR" };

/**
 * Notification configuration interface
 * @interface NotificationConfig
 */
export interface NotificationConfig {
  enabled: boolean;
  interval: number; // minutes
  sound: boolean;
  vibration: boolean;
  wakeHours: {
    start: number;
    end: number;
  };
}

/**
 * Validation result interface
 * @interface ValidationResult
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Theme colors interface
 * @interface ThemeColors
 */
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

/**
 * Chart data point interface
 * @interface ChartDataPoint
 */
export interface ChartDataPoint {
  day: string; // e.g., "Mon", "Tue"
  value: number; // intake in milliliters
  target: number; // daily target in milliliters
  completed: boolean;
}

/**
 * Weekly statistics interface
 * @interface WeeklyStats
 */
export interface WeeklyStats {
  average: number;
  total: number;
  daysCompleted: number;
  daysTotal: number;
  data: ChartDataPoint[];
}

/**
 * Storage data interface
 * @interface StorageData
 */
export interface StorageData {
  settings?: UserSettings;
  today?: TodayData;
  history?: HistoryEntry[];
  lastReminder?: string;
  lastCheckDate?: string;
}

/**
 * Component props interface for common props
 * @interface BaseComponentProps
 */
export interface BaseComponentProps {
  testID?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

/**
 * Button variant type
 * @typedef ButtonVariant
 */
export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

/**
 * Button size type
 * @typedef ButtonSize
 */
export type ButtonSize = "sm" | "md" | "lg";

/**
 * Modal props interface
 * @interface ModalProps
 */
export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

/**
 * List item props interface
 * @interface ListItemProps
 */
export interface ListItemProps extends BaseComponentProps {
  item: any;
  index: number;
  onDelete?: (id: string) => void;
  onEdit?: (item: any) => void;
}

/**
 * Progress circle props interface
 * @interface ProgressCircleProps
 */
export interface ProgressCircleProps extends BaseComponentProps {
  progress: number; // 0-1
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  animated?: boolean;
}

/**
 * Quick add button props interface
 * @interface QuickAddButtonProps
 */
export interface QuickAddButtonProps extends BaseComponentProps {
  amount: number;
  onPress: (amount: number) => void;
  disabled?: boolean;
  loading?: boolean;
}

/**
 * Settings slider props interface
 * @interface SettingsSliderProps
 */
export interface SettingsSliderProps extends BaseComponentProps {
  value: number;
  onValueChange: (value: number) => void;
  minimum: number;
  maximum: number;
  step?: number;
  unit?: string;
  title: string;
  subtitle?: string;
}

/**
 * Time picker props interface
 * @interface TimePickerProps
 */
export interface TimePickerProps extends BaseComponentProps {
  value: number; // hour in 24-hour format
  onValueChange: (value: number) => void;
  minimum?: number;
  maximum?: number;
  title: string;
  subtitle?: string;
}
