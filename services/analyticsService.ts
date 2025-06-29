import { analytics } from '@/config/firebase';
import { logEvent, setUserId, setUserProperties } from 'firebase/analytics';
import { Platform } from 'react-native';

class AnalyticsService {
  private isEnabled: boolean = false;

  constructor() {
    this.isEnabled = Platform.OS === 'web' && analytics !== null;
  }

  // Track user events
  trackEvent(eventName: string, parameters?: Record<string, any>) {
    if (!this.isEnabled || !analytics) return;
    
    try {
      logEvent(analytics, eventName, parameters);
      console.log(`Analytics event tracked: ${eventName}`, parameters);
    } catch (error) {
      console.warn('Failed to track analytics event:', error);
    }
  }

  // Set user ID for analytics
  setUser(userId: string) {
    if (!this.isEnabled || !analytics) return;
    
    try {
      setUserId(analytics, userId);
      console.log('Analytics user ID set:', userId);
    } catch (error) {
      console.warn('Failed to set analytics user ID:', error);
    }
  }

  // Set user properties
  setUserProperties(properties: Record<string, any>) {
    if (!this.isEnabled || !analytics) return;
    
    try {
      setUserProperties(analytics, properties);
      console.log('Analytics user properties set:', properties);
    } catch (error) {
      console.warn('Failed to set analytics user properties:', error);
    }
  }

  // Navigation tracking
  trackScreenView(screenName: string, screenClass?: string) {
    this.trackEvent('screen_view', {
      screen_name: screenName,
      screen_class: screenClass || screenName,
    });
  }

  // Route calculation tracking
  trackRouteCalculation(origin: string, destination: string, routeCount: number) {
    this.trackEvent('route_calculated', {
      origin,
      destination,
      route_count: routeCount,
    });
  }

  // Car profile tracking
  trackCarAdded(carMake: string, carModel: string, fuelType: string) {
    this.trackEvent('car_added', {
      car_make: carMake,
      car_model: carModel,
      fuel_type: fuelType,
    });
  }

  // Report submission tracking
  trackReportSubmitted(reportType: string, location: string) {
    this.trackEvent('report_submitted', {
      report_type: reportType,
      location,
    });
  }

  // Currency change tracking
  trackCurrencyChanged(fromCurrency: string, toCurrency: string) {
    this.trackEvent('currency_changed', {
      from_currency: fromCurrency,
      to_currency: toCurrency,
    });
  }

  // Gas station search tracking
  trackGasStationSearch(location: string, stationCount: number) {
    this.trackEvent('gas_station_search', {
      location,
      station_count: stationCount,
    });
  }

  // Trip completion tracking
  trackTripCompleted(distance: number, fuelCost: number, duration: number) {
    this.trackEvent('trip_completed', {
      distance_km: distance,
      fuel_cost: fuelCost,
      duration_minutes: duration,
    });
  }

  // Emergency contact usage
  trackEmergencyContact(contactType: string) {
    this.trackEvent('emergency_contact_used', {
      contact_type: contactType,
    });
  }

  // User engagement tracking
  trackUserEngagement(action: string, value?: number) {
    this.trackEvent('user_engagement', {
      action,
      value,
    });
  }
}

export const analyticsService = new AnalyticsService();