# Water Reminder App

A React Native application built with Expo to help users maintain healthy hydration habits with automated reminders and progress tracking.

## 📱 About

**Water Reminder** is an Android-only app designed to help health-conscious individuals track their daily water intake and build consistent hydration habits through automated notifications and comprehensive progress tracking.

## ✨ Features

### Core Functionality

- **Quick Add Buttons**: Log water intake with 200ml, 300ml, and 500ml presets
- **Custom Amounts**: Add any amount between 50ml - 1000ml per entry
- **Progress Tracking**: Visual progress circle showing daily intake vs target
- **Daily Logs**: View all water intake entries with timestamps
- **Smart Reminders**: Customizable notification intervals during wake hours
- **Streak Tracking**: Motivational streak system based on 80% completion rule

### Statistics & History

- **Weekly Charts**: Visual representation of weekly water intake
- **30-Day History**: Comprehensive log of historical intake data
- **Streak Counter**: Track consecutive days meeting hydration goals
- **Weekly Average**: Calculate average water intake over time

### Settings & Customization

- **Adjustable Daily Target**: Set goals between 1000ml - 4000ml (default: 2000ml)
- **Reminder Intervals**: Choose from 30, 60, 90, 120 minutes or custom
- **Wake Hours**: Configure active reminder periods (default: 07:00 - 22:00)
- **Sound & Vibration**: Toggle notification preferences
- **Data Management**: Reset data with confirmation

## 🏗️ Technical Stack

- **Framework**: React Native with Expo SDK (Managed Workflow)
- **State Management**: React Context API with useReducer
- **Navigation**: React Navigation
- **Storage**: Expo AsyncStorage
- **Notifications**: Expo Notifications API
- **Animations**: React Native Reanimated & Lottie
- **Build Tool**: EAS Build

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Physical Android device for testing notifications
- Expo Go app (for development)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd water-reminder-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npx expo start
   ```

4. **Run on device**
   - Scan QR code with Expo Go app on Android device
   - Or press `a` to open in Android emulator
   - For full notification testing, use a physical device

## 📋 Development Commands

```bash
# Start development server
npx expo start

# Start with specific platform
npx expo start --android
npx expo start --dev-client

# Build for production
eas build --platform android

# Preview build
eas build --platform android --profile preview

# Submit to app store
eas submit --platform android
```

## 📁 Project Structure

```
WaterReminderApp/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/         # Shared components
│   │   ├── home/           # Home screen components
│   │   ├── stats/          # Statistics screen components
│   │   └── settings/       # Settings screen components
│   ├── context/            # State management
│   ├── hooks/              # Custom React hooks
│   ├── navigation/         # Navigation configuration
│   ├── screens/            # Main app screens
│   ├── services/           # Business logic services
│   ├── utils/              # Utility functions
│   ├── assets/             # Images and animations
│   └── styles/             # Global styles and themes
├── App.js                  # Main app component
├── app.json                # Expo configuration
├── package.json            # Dependencies and scripts
├── eas.json                # EAS Build configuration
└── CLAUDE.md               # Development guidelines
```

## 📱 App Screens

### 1. Home Screen

- Daily progress circle with percentage
- Quick add buttons (200/300/500ml)
- Today's intake log list
- Custom amount input modal
- Success animations when target reached

### 2. Statistics Screen

- Current streak display
- Weekly bar chart
- Monthly view toggle
- Historical data overview
- Empty states with animations

### 3. Settings Screen

- Daily target adjustment slider
- Reminder interval picker
- Wake hours configuration
- Sound/vibration toggles
- Data reset confirmation

## 🔔 Notification System

### Smart Reminders

- Active only during configured wake hours
- Automatically pause when daily target is reached
- Skip if user recently logged water (within interval)
- Support for Android 13+ notification permissions

### Permission Requirements

- `POST_NOTIFICATIONS` (Android 13+)
- `VIBRATE` for haptic feedback
- `SCHEDULE_EXACT_ALARM` for precise timing
- `WAKE_LOCK` for background operations

## 💾 Data Storage

### Local Storage Only

- **No Backend**: All data stored locally using AsyncStorage
- **Offline-First**: Fully functional without internet connection
- **Automatic Cleanup**: 30-day data retention policy
- **Privacy**: Single-user app with no authentication required

### Storage Keys

- Settings: User preferences and configuration
- Today: Current day's intake data and logs
- History: Last 30 days of intake records
- Reminders: Last reminder timestamps

## 🎯 Business Rules

### Daily Water Target

- Default: 2000ml per day
- Adjustable: 1000ml - 4000ml
- Resets automatically at midnight

### Intake Logging

- Quick presets: 200ml, 300ml, 500ml
- Custom range: 50ml - 1000ml per entry
- Daily limit: Maximum 5000ml (safety constraint)
- All entries timestamped automatically

### Streak Calculation

- Completion threshold: 80% of daily target
- Streak breaks on days below threshold
- Flexible system allows occasional missed goals

## 🧪 Testing

### Manual Testing Checklist

- [ ] Add water intake via quick buttons
- [ ] Add custom water amounts
- [ ] Verify progress bar updates
- [ ] Test daily reset at midnight
- [ ] Verify notification scheduling
- [ ] Test notification tap navigation
- [ ] Swipe to delete log entries
- [ ] Change settings and verify persistence
- [ ] Test streak calculations
- [ ] Verify offline functionality

### Performance Targets

- App startup: < 2 seconds
- Smooth scrolling: 60fps in history lists
- Animation performance: 60fps
- APK size: < 30MB

## 📦 Dependencies

### Core Dependencies

```json
{
  "expo": "~50.0.0",
  "react": "18.2.0",
  "react-native": "0.73.6",
  "@react-navigation/native": "^6.1.9",
  "@react-navigation/bottom-tabs": "^6.5.11",
  "react-native-reanimated": "~3.6.2",
  "react-native-gesture-handler": "~2.14.0",
  "@react-native-async-storage/async-storage": "1.21.0",
  "expo-notifications": "~0.27.6",
  "expo-device": "~5.8.3",
  "lottie-react-native": "6.5.1"
}
```

### Development Dependencies

```json
{
  "@babel/core": "^7.20.0",
  "eslint": "^8.56.0",
  "eslint-config-expo": "^7.0.0"
}
```

## 🔧 Configuration

### Development Environment

- Use Expo Go for quick testing and prototyping
- Physical device required for notification testing
- Android Studio for emulator and debugging

### Production Build

- Configured for Android-only deployment
- EAS Build for production APK/AAB generation
- Supports Google Play Store submission
- Optimized bundle size and performance

## 📋 Platform Support

### ✅ Supported

- Android 5.0+ (API 21+)
- Expo Go development
- EAS Build production
- Google Play Store deployment

### ❌ Not Supported

- iOS (Android-only application)
- Custom native modules (Expo managed workflow)
- Backend services
- Multi-user accounts

## 🤝 Contributing

This project follows the development guidelines outlined in [CLAUDE.md](./CLAUDE.md). Key principles:

- Use functional components with hooks
- Follow the established file structure
- Include comprehensive error handling
- Validate all user inputs
- Test edge cases thoroughly
- Maintain consistent code style

## 📄 License

This project is proprietary and not open-source.

## 📞 Support

For development questions and issues:

1. Refer to [CLAUDE.md](./CLAUDE.md) for detailed development guidelines
2. Check [Expo Documentation](https://docs.expo.dev/)
3. Review [React Native Documentation](https://reactnative.dev/)

## 🚀 Deployment

### Production Build Process

1. Configure `eas.json` with build settings
2. Run `eas build --platform android`
3. Test production build on multiple devices
4. Submit to Google Play Store via `eas submit`

### Build Configuration

```json
{
  "build": {
    "development": {
      "developmentClient": true
    },
    "preview": {
      "distribution": "preview"
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

---

**Version**: 1.1.0
**Last Updated**: October 29, 2025
**Framework**: Expo SDK 50
