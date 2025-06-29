# NaviFuel - Smart Navigation & Fuel Calculator

A comprehensive mobile navigation app with integrated fuel cost calculation, route optimization, and community reporting features.

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
- **Modern UI/UX**: Clean, intuitive interface with smooth animations
- **Responsive Design**: Optimized for all screen sizes and orientations
- **Offline Support**: Basic functionality available without internet connection
- **Customizable Settings**: Personalized preferences and notification controls

## Technology Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router with tab-based architecture
- **Maps**: Google Maps API with Places API integration
- **Location Services**: Expo Location for GPS functionality
- **State Management**: React Hooks and Context API
- **Styling**: StyleSheet with modern design principles
- **Icons**: Lucide React Native for consistent iconography

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- Google Maps API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd navifuel
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# Create .env file
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

### Google Maps API Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Directions API
   - Geocoding API
4. Create credentials (API Key)
5. Add the API key to your `.env` file

## Project Structure

```
app/
├── (tabs)/
│   ├── map.jsx              # Map and navigation screen
│   ├── cars.jsx             # Vehicle management
│   ├── chat.jsx             # Community chat
│   ├── reports.jsx          # Community reporting
│   └── profile.jsx          # User settings
├── _layout.jsx              # Root layout
└── +not-found.jsx           # 404 page

hooks/
└── useFrameworkReady.js     # Framework initialization hook
```

## Key Features Implementation

### Multi-Currency Support
The app supports 12+ currencies with automatic conversion and localized pricing:
- US Dollar (USD)
- Malaysian Ringgit (MYR)
- Euro (EUR)
- British Pound (GBP)
- And more...

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