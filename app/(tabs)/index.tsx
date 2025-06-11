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

interface RouteOption {
  id: string;
  name: string;
  distance: string;
  duration: string;
  fuelCost: string;
  tollCost: string;
  totalCost: string;
  traffic: 'light' | 'moderate' | 'heavy';
}

export default function MapScreen() {
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');
  const [showRoutes, setShowRoutes] = useState(false);
  const [showGasStations, setShowGasStations] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  const routeOptions: RouteOption[] = [
    {
      id: '1',
      name: 'Fastest Route',
      distance: '45.2 km',
      duration: '38 min',
      fuelCost: '$4.80',
      tollCost: '$2.50',
      totalCost: '$7.30',
      traffic: 'light',
    },
    {
      id: '2',
      name: 'Most Economical',
      distance: '52.1 km',
      duration: '51 min',
      fuelCost: '$3.20',
      tollCost: '$0.00',
      totalCost: '$3.20',
      traffic: 'moderate',
    },
    {
      id: '3',
      name: 'Avoid Tolls',
      distance: '48.7 km',
      duration: '46 min',
      fuelCost: '$4.10',
      tollCost: '$0.00',
      totalCost: '$4.10',
      traffic: 'moderate',
    },
  ];

  const gasStations = [
    { name: 'Shell Station', distance: '0.8 km', price: '$1.45/L' },
    { name: 'BP Station', distance: '1.2 km', price: '$1.42/L' },
    { name: 'Chevron', distance: '2.1 km', price: '$1.48/L' },
  ];

  const emergencyContacts = [
    { name: 'Emergency Services', number: '911', icon: '🚨' },
    { name: 'Highway Patrol', number: '1-800-HIGHWAY', icon: '👮' },
    { name: 'Roadside Assistance', number: '1-800-AAA-HELP', icon: '🔧' },
    { name: 'Medical Emergency', number: '1-800-MEDICAL', icon: '🏥' },
  ];

  useEffect(() => {
    getLocationPermission();
  }, []);

  const getLocationPermission = async () => {
    if (Platform.OS === 'web') {
      // Handle web location differently
      return;
    }

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Location permission is required for navigation.');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  const handleSearch = () => {
    if (searchFrom && searchTo) {
      setShowRoutes(true);
    } else {
      Alert.alert('Missing Information', 'Please enter both starting point and destination.');
    }
  };

  const getTrafficColor = (traffic: string) => {
    switch (traffic) {
      case 'light': return '#059669';
      case 'moderate': return '#EA580C';
      case 'heavy': return '#DC2626';
      default: return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      {/* Map Placeholder */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <MapPin size={48} color="#2563EB" />
          <Text style={styles.mapText}>Interactive Map View</Text>
          <Text style={styles.mapSubtext}>Location services and route display</Text>
        </View>
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
          onPress={() => setShowGasStations(true)}>
          <Gas size={20} color="#2563EB" />
          <Text style={styles.actionText}>Gas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowEmergency(true)}>
          <Phone size={20} color="#DC2626" />
          <Text style={styles.actionText}>Emergency</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
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
            {routeOptions.map((route) => (
              <TouchableOpacity key={route.id} style={styles.routeCard}>
                <View style={styles.routeHeader}>
                  <Text style={styles.routeName}>{route.name}</Text>
                  <View
                    style={[
                      styles.trafficIndicator,
                      { backgroundColor: getTrafficColor(route.traffic) },
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
                    <Text style={styles.routeDetailText}>{route.totalCost}</Text>
                  </View>
                </View>
                <View style={styles.costBreakdown}>
                  <Text style={styles.costText}>Fuel: {route.fuelCost}</Text>
                  <Text style={styles.costText}>Toll: {route.tollCost}</Text>
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
            {gasStations.map((station, index) => (
              <TouchableOpacity key={index} style={styles.stationCard}>
                <View style={styles.stationInfo}>
                  <Gas size={24} color="#2563EB" />
                  <View style={styles.stationDetails}>
                    <Text style={styles.stationName}>{station.name}</Text>
                    <Text style={styles.stationDistance}>{station.distance} away</Text>
                  </View>
                </View>
                <Text style={styles.stationPrice}>{station.price}</Text>
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
              <TouchableOpacity key={index} style={styles.emergencyCard}>
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
    backgroundColor: '#E5E7EB',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  mapText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
  },
  mapSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
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
  },
  stationDetails: {
    marginLeft: 12,
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