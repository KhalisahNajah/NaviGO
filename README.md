# NaviFuel - Smart Navigation & Fuel Calculator (Flutter)

A comprehensive mobile navigation app built with Flutter, featuring integrated fuel cost calculation, route optimization, and community reporting features.

## Features

### 🗺️ Navigation & Maps
- **Google Maps Integration**: Real-time interactive maps with traffic data
- **Route Planning**: Multiple route options with distance, time, and cost calculations
- **Turn-by-turn Navigation**: Voice-guided navigation with real-time updates
- **Traffic Awareness**: Live traffic conditions and automatic re-routing

### ⛽ Fuel Management
- **Multi-Car Profiles**: Support for multiple vehicle profiles with individual specifications
- **Fuel Efficiency Tracking**: Detailed fuel consumption calculations (km/L)
- **Cost Estimation**: Real-time fuel cost calculations for planned routes
- **Multi-Currency Support**: Support for 12+ currencies (USD, MYR, EUR, GBP, etc.)
- **Dynamic Fuel Prices**: Location-based fuel pricing with real-time updates

### 🛣️ Route Optimization
- **Smart Route Selection**: Optimized routes based on fuel cost, tolls, and travel time
- **Toll Integration**: Automatic toll cost estimation and avoidance options
- **Alternative Routes**: Multiple route options with detailed cost breakdowns
- **Best Time Suggestions**: Traffic-aware travel time recommendations

### 🚨 Community Features
- **Real-time Reporting**: Report road conditions, accidents, police presence, and hazards
- **Community Alerts**: Receive notifications about road conditions from other users
- **Emergency Contacts**: Quick access to emergency services and roadside assistance
- **Gas Station Finder**: Locate nearby gas stations with pricing information

### 📱 User Experience
- **Modern UI/UX**: Clean, intuitive interface with Material Design
- **Responsive Design**: Optimized for all screen sizes and orientations
- **Offline Support**: Basic functionality available without internet connection
- **Customizable Settings**: Personalized preferences and notification controls

## Technology Stack

- **Framework**: Flutter 3.10+
- **Language**: Dart
- **State Management**: Provider pattern
- **Maps**: Google Maps Flutter plugin
- **Location Services**: Geolocator and Location packages
- **Local Storage**: SharedPreferences
- **HTTP Requests**: HTTP package
- **UI Components**: Material Design components

## Getting Started

### Prerequisites
- Flutter SDK (3.10.0 or higher)
- Dart SDK (3.0.0 or higher)
- Android Studio / VS Code
- Google Maps API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd navifuel
```

2. Install dependencies:
```bash
flutter pub get
```

3. Configure Google Maps API:
   - Get your API key from [Google Cloud Console](https://console.cloud.google.com/)
   - Add the API key to `android/app/src/main/AndroidManifest.xml`:
   ```xml
   <meta-data android:name="com.google.android.geo.API_KEY"
              android:value="YOUR_API_KEY_HERE"/>
   ```
   - For iOS, add to `ios/Runner/AppDelegate.swift`:
   ```swift
   GMSServices.provideAPIKey("YOUR_API_KEY_HERE")
   ```

4. Run the app:
```bash
flutter run
```

## Project Structure

```
lib/
├── main.dart                 # App entry point
├── models/                   # Data models
│   ├── car.dart
│   ├── currency.dart
│   ├── route_result.dart
│   ├── gas_station.dart
│   └── traffic_report.dart
├── providers/                # State management
│   ├── app_state.dart
│   ├── car_provider.dart
│   └── location_provider.dart
├── screens/                  # Main screens
│   ├── main_screen.dart
│   ├── map_screen.dart
│   ├── cars_screen.dart
│   ├── chat_screen.dart
│   ├── reports_screen.dart
│   └── profile_screen.dart
├── widgets/                  # Reusable widgets
│   ├── map_widget.dart
│   ├── route_search_widget.dart
│   ├── car_card_widget.dart
│   └── [other widgets]
└── utils/
    └── theme.dart           # App theme configuration
```

## Key Features Implementation

### Multi-Currency Support
The app supports 12+ currencies with automatic conversion and localized pricing:
- US Dollar (USD), Malaysian Ringgit (MYR), Euro (EUR), British Pound (GBP), and more
- Real-time currency selection with persistent storage

### Route Optimization Algorithm
Routes are optimized based on:
1. **Fuel Cost**: Calculated using vehicle efficiency and current fuel prices
2. **Toll Costs**: Estimated toll charges for highway routes
3. **Travel Time**: Real-time traffic-aware duration estimates
4. **Distance**: Total route distance in kilometers

### Community Reporting System
Users can report various road conditions:
- Police presence and speed traps
- Traffic accidents and breakdowns
- Road construction and lane closures
- Weather conditions and hazards
- Fallen trees and debris

### Car Profile Management
- Add multiple vehicles with detailed specifications
- Track fuel efficiency (km/L) for accurate cost calculations
- Set default vehicle for quick route planning
- Support for different fuel types (Regular, Premium, Diesel)

## Permissions

The app requires the following permissions:
- **Location**: For navigation and finding nearby services
- **Phone**: For emergency contact functionality
- **Internet**: For maps, traffic data, and community features

## Building for Production

### Android
```bash
flutter build apk --release
# or for app bundle
flutter build appbundle --release
```

### iOS
```bash
flutter build ios --release
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository or contact the development team.

---

**NaviFuel** - Making every journey smarter, safer, and more economical. 🚗⛽🗺️