// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'house': 'home',
  // MaterialIcons uses different naming than SF Symbols. Use a best-effort mapping
  // 'insert-chart' exists in MaterialIcons and is a reliable chart icon.
  'chart.bar.fill': 'insert-chart',
  'chart.bar': 'insert-chart',
  'gearshape.fill': 'settings',
  'gearshape': 'settings',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  // Provide a safe fallback if a mapping is missing or incorrect so the tab
  // bar still shows an icon instead of nothing.
  const mappedName = MAPPING[name] ?? 'help-outline';
  if (!MAPPING[name]) {
    // eslint-disable-next-line no-console
    console.warn(`IconSymbol: missing mapping for '${String(name)}', using fallback '${mappedName}'`);
  }

  return <MaterialIcons color={color} size={size} name={mappedName} style={style} />;
}
