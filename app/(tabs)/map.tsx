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
  Image,
} from 'react-native';
import { Search, Navigation, Fuel, Clock, DollarSign, Route, MapPin, Phone, Zap, MessageCircle, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import * as Location from 'expo-location';

interface RouteResult {
  distance: string;
  duration: string;
  fuelCost: number;
  tollCost: number;
  totalCost: number;
}

interface GasStation {
  id: string;
  name: string;
  address: string;
  distance: number;
  price: number;
}

interface EVChargingStation {
  id: string;
  name: string;
  address: string;
  distance: number;
  connectorType: string;
  powerLevel: number;
  pricePerKwh: number;
  available: number;
  total: number;
}

export default function MapScreen() {
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');
  const [showRoutes, setShowRoutes] = useState(false);
  const [showGasStations, setShowGasStations] = useState(false);
  const [showEVStations, setShowEVStations] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showTrafficReport, setShowTrafficReport] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [routes, setRoutes] = useState<RouteResult[]>([]);
  const [gasStations, setGasStations] = useState<GasStation[]>([]);
  const [evStations, setEVStations] = useState<EVChargingStation[]>([]);

  // Traffic report state
  const [trafficReportType, setTrafficReportType] = useState('');
  const [trafficDescription, setTrafficDescription] = useState('');
  const [trafficLocation, setTrafficLocation] = useState('');

  // Chat state
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    user: string;
    message: string;
    timestamp: Date;
    location?: string;
  }>>([]);
  const [newMessage, setNewMessage] = useState('');

  const emergencyContacts = [
    { name: 'Emergency Services', number: '911', icon: '🚨' },
    { name: 'Highway Patrol', number: '1-800-HIGHWAY', icon: '👮' },
    { name: 'Roadside Assistance', number: '1-800-AAA-HELP', icon: '🔧' },
    { name: 'Medical Emergency', number: '1-800-MEDICAL', icon: '🏥' },
  ];

  const trafficReportTypes = [
    { id: 'heavy_traffic', name: 'Heavy Traffic', icon: '🚗', color: '#DC2626' },
    { id: 'accident', name: 'Accident', icon: '💥', color: '#DC2626' },
    { id: 'road_closure', name: 'Road Closure', icon: '🚧', color: '#F59E0B' },
    { id: 'construction', name: 'Construction', icon: '🏗️', color: '#F59E0B' },
    { id: 'weather', name: 'Weather Issue', icon: '🌧️', color: '#6B7280' },
    { id: 'breakdown', name: 'Vehicle Breakdown', icon: '🔧', color: '#EA580C' },
  ];

  useEffect(() => {
    getLocationPermission();
    loadChatMessages();
  }, []);

  const getLocationPermission = async () => {
    if (Platform.OS === 'web') {
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
          },
          (error) => {
            console.error('Error getting location:', error);
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
          }
        );
      }
      return;
    }

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Location permission is required for navigation.');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    setSearchFrom('Current Location');
  };

  const handleSearch = async () => {
    if (searchFrom && searchTo) {
      try {
        const mockRoutes: RouteResult[] = [
          {
            distance: '45.2 km',
            duration: '38 min',
            fuelCost: 5.85,
            tollCost: 2.50,
            totalCost: 8.35,
          },
          {
            distance: '52.1 km',
            duration: '51 min',
            fuelCost: 6.75,
            tollCost: 0.00,
            totalCost: 6.75,
          },
          {
            distance: '48.7 km',
            duration: '46 min',
            fuelCost: 6.30,
            tollCost: 0.00,
            totalCost: 6.30,
          }
        ];
        
        setRoutes(mockRoutes);
        setShowRoutes(true);
      } catch (error) {
        console.error('Error calculating routes:', error);
        Alert.alert('Error', 'Failed to calculate routes. Please try again.');
      }
    } else {
      Alert.alert('Missing Information', 'Please enter both starting point and destination.');
    }
  };

  const handleFindGasStations = async () => {
    if (location) {
      try {
        const mockStations: GasStation[] = [
          {
            id: '1',
            name: 'Shell Station',
            address: '123 Main St',
            distance: 0.8,
            price: 1.45,
          },
          {
            id: '2',
            name: 'BP Station',
            address: '456 Oak Ave',
            distance: 1.2,
            price: 1.42,
          },
          {
            id: '3',
            name: 'Chevron',
            address: '789 Pine St',
            distance: 2.1,
            price: 1.48,
          }
        ];
        setGasStations(mockStations);
        setShowGasStations(true);
      } catch (error) {
        console.error('Error finding gas stations:', error);
        Alert.alert('Error', 'Failed to find gas stations. Please try again.');
      }
    } else {
      Alert.alert('Location Required', 'Please enable location services to find nearby gas stations.');
    }
  };

  const handleFindEVStations = async () => {
    if (location) {
      try {
        const mockStations: EVChargingStation[] = [
          {
            id: '1',
            name: 'Tesla Supercharger',
            address: '100 Electric Ave',
            distance: 1.5,
            connectorType: 'Tesla Supercharger',
            powerLevel: 250,
            pricePerKwh: 0.28,
            available: 3,
            total: 8,
          },
          {
            id: '2',
            name: 'ChargePoint Station',
            address: '200 Green St',
            distance: 2.3,
            connectorType: 'CCS',
            powerLevel: 150,
            pricePerKwh: 0.32,
            available: 1,
            total: 4,
          }
        ];
        setEVStations(mockStations);
        setShowEVStations(true);
      } catch (error) {
        console.error('Error finding EV stations:', error);
        Alert.alert('Error', 'Failed to find EV charging stations. Please try again.');
      }
    } else {
      Alert.alert('Location Required', 'Please enable location services to find nearby EV charging stations.');
    }
  };

  const handleSubmitTrafficReport = async () => {
    if (!trafficReportType || !trafficDescription || !trafficLocation) {
      Alert.alert('Missing Information', 'Please fill in all fields.');
      return;
    }

    try {
      setTrafficReportType('');
      setTrafficDescription('');
      setTrafficLocation('');
      setShowTrafficReport(false);

      Alert.alert('Report Submitted', 'Thank you for helping other drivers stay informed!');
    } catch (error) {
      console.error('Error submitting traffic report:', error);
      Alert.alert('Error', 'Failed to submit traffic report');
    }
  };

  const handleSetDefault = (carId: string) => {
    setCars(prev => prev.map(car => ({
      ...car,
      isDefault: car.id === carId
    })));
    Alert.alert('Success', 'Default car updated!');
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      user: 'You',
      message: newMessage.trim(),
      timestamp: new Date(),
      location: location ? `${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}` : undefined,
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate receiving a response
    setTimeout(() => {
      const responses = [
        'Thanks for the update! Traffic is moving slowly here too.',
        'I see the same issue. Alternative route via Highway 101?',
        'Construction crew just cleared up. Should be better now.',
        'Weather is causing delays. Drive safe!',
        'Police directing traffic at the intersection.',
      ];
      
      const response = {
        id: (Date.now() + 1).toString(),
        user: 'Driver nearby',
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };

      setChatMessages(prev => [...prev, response]);
    }, 2000);
  };

  const loadChatMessages = () => {
    const mockMessages = [
      {
        id: '1',
        user: 'Traffic Alert',
        message: 'Heavy traffic reported on I-95 North. Consider alternate routes.',
        timestamp: new Date(Date.now() - 300000),
      },
      {
        id: '2',
        user: 'Local Driver',
        message: 'Construction on Main St causing delays. Use Oak Ave instead.',
        timestamp: new Date(Date.now() - 180000),
      },
    ];
    setChatMessages(mockMessages);
  };

  const handleEmergencyContact = (contact: typeof emergencyContacts[0]) => {
    Alert.alert('Emergency Contact', `Calling ${contact.name} at ${contact.number}`);
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      {/* Map Area */}
      <View style={styles.mapContainer}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
          style={styles.map}
          resizeMode="cover"
        />
        
        {/* Floating Chat Button */}
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => setShowChat(true)}>
          <MessageCircle size={24} color="#FFFFFF" />
          {chatMessages.length > 2 && (
            <View style={styles.chatBadge}>
              <Text style={styles.chatBadgeText}>{chatMessages.length - 2}</Text>
            </View>
          )}
        </TouchableOpacity>
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
          <Fuel size={20} color="#2563EB" />
          <Text style={styles.actionText}>Gas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleFindEVStations}>
          <Zap size={20} color="#059669" />
          <Text style={styles.actionText}>EV Charge</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowTrafficReport(true)}>
          <AlertTriangle size={20} color="#F59E0B" />
          <Text style={styles.actionText}>Report</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowEmergency(true)}>
          <Phone size={20} color="#DC2626" />
          <Text style={styles.actionText}>Emergency</Text>
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
              <TouchableOpacity key={index} style={styles.routeCard}>
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
              <TouchableOpacity key={station.id} style={styles.stationCard}>
                <View style={styles.stationInfo}>
                  <Fuel size={24} color="#2563EB" />
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

      {/* EV Charging Stations Modal */}
      <Modal visible={showEVStations} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>EV Charging Stations</Text>
            <TouchableOpacity onPress={() => setShowEVStations(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            {evStations.map((station) => (
              <TouchableOpacity key={station.id} style={styles.stationCard}>
                <View style={styles.stationInfo}>
                  <Zap size={24} color="#059669" />
                  <View style={styles.stationDetails}>
                    <Text style={styles.stationName}>{station.name}</Text>
                    <Text style={styles.stationDistance}>{station.distance.toFixed(1)} km away</Text>
                    <Text style={styles.stationAddress}>{station.address}</Text>
                    <View style={styles.evDetails}>
                      <Text style={styles.evDetailText}>{station.connectorType} • {station.powerLevel}kW</Text>
                      <Text style={styles.evDetailText}>
                        {station.available}/{station.total} available
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.evPricing}>
                  <Text style={styles.stationPrice}>${station.pricePerKwh.toFixed(2)}/kWh</Text>
                  <Text style={styles.evStatus}>
                    {station.available > 0 ? 'Available' : 'Full'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* Traffic Report Modal */}
      <Modal visible={showTrafficReport} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Report Traffic Issue</Text>
            <TouchableOpacity onPress={() => setShowTrafficReport(false)}>
              <Text style={styles.closeButton}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.fieldLabel}>What's the issue?</Text>
            <View style={styles.reportTypeGrid}>
              {trafficReportTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.reportTypeCard,
                    trafficReportType === type.id && styles.reportTypeCardSelected,
                  ]}
                  onPress={() => setTrafficReportType(type.id)}>
                  <Text style={styles.reportTypeIcon}>{type.icon}</Text>
                  <Text
                    style={[
                      styles.reportTypeText,
                      trafficReportType === type.id && styles.reportTypeTextSelected,
                    ]}>
                    {type.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Location</Text>
              <TextInput
                style={styles.textInput}
                value={trafficLocation}
                onChangeText={setTrafficLocation}
                placeholder="e.g., I-95 North, Exit 42"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Description</Text>
              <TextInput
                style={[styles.textInput, styles.textInputMultiline]}
                value={trafficDescription}
                onChangeText={setTrafficDescription}
                placeholder="Provide additional details..."
                multiline
                numberOfLines={4}
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!trafficReportType || !trafficDescription || !trafficLocation) && 
                styles.submitButtonDisabled,
              ]}
              onPress={handleSubmitTrafficReport}
              disabled={!trafficReportType || !trafficDescription || !trafficLocation}>
              <AlertTriangle size={20} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>Submit Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Chat Modal */}
      <Modal visible={showChat} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Traffic Chat</Text>
            <TouchableOpacity onPress={() => setShowChat(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.chatContent}>
            {chatMessages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.chatMessage,
                  message.user === 'You' && styles.chatMessageOwn,
                ]}>
                <View style={styles.chatMessageHeader}>
                  <Text style={styles.chatMessageUser}>{message.user}</Text>
                  <Text style={styles.chatMessageTime}>{formatTime(message.timestamp)}</Text>
                </View>
                <Text style={styles.chatMessageText}>{message.message}</Text>
                {message.location && (
                  <Text style={styles.chatMessageLocation}>📍 {message.location}</Text>
                )}
              </View>
            ))}
          </ScrollView>

          <View style={styles.chatInputContainer}>
            <TextInput
              style={styles.chatInput}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Share traffic updates..."
              multiline
              maxLength={200}
            />
            <TouchableOpacity
              style={[
                styles.chatSendButton,
                !newMessage.trim() && styles.chatSendButtonDisabled,
              ]}
              onPress={handleSendMessage}
              disabled={!newMessage.trim()}>
              <Text style={styles.chatSendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
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
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  chatButton: {
    position: 'absolute',
    top: 60,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  chatBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#DC2626',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
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
  evDetails: {
    marginTop: 4,
  },
  evDetailText: {
    fontSize: 12,
    color: '#6B7280',
  },
  evPricing: {
    alignItems: 'flex-end',
  },
  evStatus: {
    fontSize: 12,
    color: '#059669',
    marginTop: 2,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  reportTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  reportTypeCard: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
    marginRight: '2%',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  reportTypeCardSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  reportTypeIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  reportTypeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1F2937',
    textAlign: 'center',
  },
  reportTypeTextSelected: {
    color: '#FFFFFF',
  },
  formField: {
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  textInputMultiline: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  submitButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  chatContent: {
    flex: 1,
    padding: 16,
  },
  chatMessage: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    maxWidth: '80%',
  },
  chatMessageOwn: {
    backgroundColor: '#2563EB',
    alignSelf: 'flex-end',
  },
  chatMessageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chatMessageUser: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  chatMessageTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  chatMessageText: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
  },
  chatMessageLocation: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontStyle: 'italic',
  },
  chatInputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'flex-end',
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 16,
  },
  chatSendButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  chatSendButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  chatSendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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