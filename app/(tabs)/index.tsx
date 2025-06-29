import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Search, Navigation, Cast as Gas, Clock, DollarSign, Route, MapPin, Phone } from 'lucide-react-native';
import * as Location from 'expo-location';
import GoogleMap from '@/components/GoogleMap';
import { googleMapsService, RouteResult, GasStation } from '@/services/googleMapsService';
import { analyticsService } from '@/services/analyticsService';

export default function MapScreen() {
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');
  const [showRoutes, setShowRoutes] = useState(false);
  const [showGasStations, setShowGasStations] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [routes, setRoutes] = useState<RouteResult[]>([]);
  const [gasStations, setGasStations] = useState<GasStation[]>([]);
  const [mapRoutes, setMapRoutes] = useState<Array<{
    origin: string;
    destination: string;
    waypoints?: string[];
  }>>([]);

  const emergencyContacts = [
    { name: 'Emergency Services', number: '911', icon: '🚨' },
    { name: 'Highway Patrol', number: '1-800-HIGHWAY', icon: '👮' },
    { name: 'Roadside Assistance', number: '1-800-AAA-HELP', icon: '🔧' },
    { name: 'Medical Emergency', number: '1-800-MEDICAL', icon: '🏥' },
  ];

  useEffect(() => {
    getLocationPermission();
    // Track screen view
    analyticsService.trackScreenView('Map');
  }, []);

  const getLocationPermission = async () => {
    if (Platform.OS === 'web') {
      // Handle web location differently
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const mockLocation = {
              coords: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                altitude: null,
                accuracy: position.coords.accuracy,
                altitudeAccuracy: null,
                heading: null,
                speed: null,
              },
              timestamp: Date.now(),
            };
            setLocation(mockLocation);
            setSearchFrom('Current Location');
            
            analyticsService.trackEvent('location_permission_granted', {
              method: 'web_geolocation',
            });
          },
          (error) => {
            console.error('Error getting location:', error);
            // Set default location (San Francisco)
            const defaultLocation = {
              coords: {
                latitude: 37.7749,
                longitude: -122.4194,
                altitude: null,
                accuracy: 100,
                altitudeAccuracy: null,
                heading: null,
                speed: null,
              },
              timestamp: Date.now(),
            };
            setLocation(defaultLocation);
            setSearchFrom('San Francisco, CA');
            
            analyticsService.trackEvent('location_permission_denied', {
              method: 'web_geolocation',
              error: error.message,
            });
          }
        );
      }
      return;
    }

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Location permission is required for navigation.');
      analyticsService.trackEvent('location_permission_denied', {
        method: 'expo_location',
      });
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    setSearchFrom('Current Location');
    
    analyticsService.trackEvent('location_permission_granted', {
      method: 'expo_location',
    });
  };

  const handleSearch = async () => {
    if (searchFrom && searchTo) {
      try {
        analyticsService.trackEvent('route_search_started', {
          origin: searchFrom,
          destination: searchTo,
        });

        // Calculate routes using Google Maps service
        const calculatedRoutes = await googleMapsService.calculateRoute(
          searchFrom,
          searchTo,
          12.5, // Default fuel efficiency - should come from user's selected car
          1.45  // Default fuel price - should come from user's settings
        );
        
        setRoutes(calculatedRoutes);
        setMapRoutes([{
          origin: searchFrom,
          destination: searchTo
        }]);
        setShowRoutes(true);
        
        analyticsService.trackRouteCalculation(searchFrom, searchTo, calculatedRoutes.length);
      } catch (error) {
        console.error('Error calculating routes:', error);
        Alert.alert('Error', 'Failed to calculate routes. Please try again.');
        
        analyticsService.trackEvent('route_search_failed', {
          origin: searchFrom,
          destination: searchTo,
          error: (error as Error).message,
        });
      }
    } else {
      Alert.alert('Missing Information', 'Please enter both starting point and destination.');
    }
  };

  const handleFindGasStations = async () => {
    if (location) {
      try {
        analyticsService.trackEvent('gas_station_search_started', {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        const stations = await googleMapsService.findNearbyGasStations({
          lat: location.coords.latitude,
          lng: location.coords.longitude
        });
        setGasStations(stations);
        setShowGasStations(true);
        
        analyticsService.trackGasStationSearch(
          `${location.coords.latitude},${location.coords.longitude}`,
          stations.length
        );
      } catch (error) {
        console.error('Error finding gas stations:', error);
        Alert.alert('Error', 'Failed to find gas stations. Please try again.');
        
        analyticsService.trackEvent('gas_station_search_failed', {
          error: (error as Error).message,
        });
      }
    } else {
      Alert.alert('Location Required', 'Please enable location services to find nearby gas stations.');
    }
  };

  const handleEmergencyContact = (contact: typeof emergencyContacts[0]) => {
    analyticsService.trackEmergencyContact(contact.name);
    // In a real app, this would initiate a phone call
    Alert.alert('Emergency Contact', `Calling ${contact.name} at ${contact.number}`);
  };

  const getTrafficColor = (traffic: string) => {
    switch (traffic) {
      case 'light': return '#059669';
      case 'moderate': return '#EA580C';
      case 'heavy': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <View style={styles.container}>
      {/* Google Map */}
      <View style={styles.mapContainer}>
        <GoogleMap
          style={styles.map}
          initialLocation={
            location
              ? {
                  lat: location.coords.latitude,
                  lng: location.coords.longitude,
                }
              : { lat: 37.7749, lng: -122.4194 }
          }
          showTraffic={true}
          routes={mapRoutes}
          onMapReady={(map) => {
            console.log('Google Map is ready');
            analyticsService.trackEvent('map_loaded');
          }}
        />
      </View>

      {/* Search Controls */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="From (current location)"
            value={searchFrom}
            onChangeText={setSearchFrom}
          />
        </View>
        <View style={styles.searchInputContainer}>
          <Navigation size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="To (destination)"
            value={searchTo}
            onChangeText={setSearchTo}
          />
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Route size={20} color="#FFFFFF" />
          <Text style={styles.searchButtonText}>Find Routes</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleFindGasStations}>
          <Gas size={20} color="#2563EB" />
          <Text style={styles.actionText}>Gas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            setShowEmergency(true);
            analyticsService.trackEvent('emergency_modal_opened');
          }}>
          <Phone size={20} color="#DC2626" />
          <Text style={styles.actionText}>Emergency</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => {
            analyticsService.trackEvent('best_time_clicked');
            Alert.alert('Best Time', 'Feature coming soon!');
          }}>
          <Clock size={20} color="#059669" />
          <Text style={styles.actionText}>Best Time</Text>
        </TouchableOpacity>
      </View>

      {/* Route Options Modal */}
      <Modal visible={showRoutes} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Route Options</Text>
            <TouchableOpacity onPress={() => setShowRoutes(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            {routes.map((route, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.routeCard}
                onPress={() => {
                  analyticsService.trackEvent('route_selected', {
                    route_index: index,
                    distance: route.distance,
                    duration: route.duration,
                    total_cost: route.totalCost,
                  });
                }}>
                <View style={styles.routeHeader}>
                  <Text style={styles.routeName}>
                    {index === 0 ? 'Fastest Route' : index === 1 ? 'Most Economical' : 'Alternative Route'}
                  </Text>
                  <View
                    style={[
                      styles.trafficIndicator,
                      { backgroundColor: index === 0 ? '#059669' : index === 1 ? '#EA580C' : '#6B7280' },
                    ]}
                  />
                </View>
                <View style={styles.routeDetails}>
                  <View style={styles.routeDetail}>
                    <Route size={16} color="#6B7280" />
                    <Text style={styles.routeDetailText}>{route.distance}</Text>
                  </View>
                  <View style={styles.routeDetail}>
                    <Clock size={16} color="#6B7280" />
                    <Text style={styles.routeDetailText}>{route.duration}</Text>
                  </View>
                  <View style={styles.routeDetail}>
                    <DollarSign size={16} color="#6B7280" />
                    <Text style={styles.routeDetailText}>{formatCurrency(route.totalCost)}</Text>
                  </View>
                </View>
                <View style={styles.costBreakdown}>
                  <Text style={styles.costText}>Fuel: {formatCurrency(route.fuelCost)}</Text>
                  <Text style={styles.costText}>Toll: {formatCurrency(route.tollCost)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* Gas Stations Modal */}
      <Modal visible={showGasStations} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nearby Gas Stations</Text>
            <TouchableOpacity onPress={() => setShowGasStations(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            {gasStations.map((station) => (
              <TouchableOpacity 
                key={station.id} 
                style={styles.stationCard}
                onPress={() => {
                  analyticsService.trackEvent('gas_station_selected', {
                    station_name: station.name,
                    distance: station.distance,
                    price: station.price,
                  });
                }}>
                <View style={styles.stationInfo}>
                  <Gas size={24} color="#2563EB" />
                  <View style={styles.stationDetails}>
                    <Text style={styles.stationName}>{station.name}</Text>
                    <Text style={styles.stationDistance}>{station.distance.toFixed(1)} km away</Text>
                    <Text style={styles.stationAddress}>{station.address}</Text>
                  </View>
                </View>
                <Text style={styles.stationPrice}>${station.price.toFixed(2)}/L</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* Emergency Contacts Modal */}
      <Modal visible={showEmergency} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Emergency Contacts</Text>
            <TouchableOpacity onPress={() => setShowEmergency(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            {emergencyContacts.map((contact, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.emergencyCard}
                onPress={() => handleEmergencyContact(contact)}>
                <Text style={styles.emergencyIcon}>{contact.icon}</Text>
                <View style={styles.emergencyInfo}>
                  <Text style={styles.emergencyName}>{contact.name}</Text>
                  <Text style={styles.emergencyNumber}>{contact.number}</Text>
                </View>
                <Phone size={20} color="#2563EB" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#1F2937',
  },
  searchButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  quickActions: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 16,
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    padding: 12,
  },
  actionText: {
    fontSize: 12,
    color: '#1F2937',
    marginTop: 4,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '500',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  routeCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  routeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  trafficIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  routeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  routeDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeDetailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  costBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  costText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  stationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  stationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stationDetails: {
    marginLeft: 12,
    flex: 1,
  },
  stationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  stationDistance: {
    fontSize: 14,
    color: '#6B7280',
  },
  stationAddress: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  stationPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
  emergencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  emergencyIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  emergencyInfo: {
    flex: 1,
  },
  emergencyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  emergencyNumber: {
    fontSize: 14,
    color: '#6B7280',
  },
});