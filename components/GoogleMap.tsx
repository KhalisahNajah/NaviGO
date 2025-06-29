import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Loader } from '@googlemaps/js-api-loader';

interface GoogleMapProps {
  style?: any;
  initialLocation?: {
    lat: number;
    lng: number;
  };
  onMapReady?: (map: google.maps.Map) => void;
  showTraffic?: boolean;
  routes?: Array<{
    origin: string;
    destination: string;
    waypoints?: string[];
  }>;
}

export default function GoogleMap({
  style,
  initialLocation = { lat: 37.7749, lng: -122.4194 }, // Default to San Francisco
  onMapReady,
  showTraffic = true,
  routes = []
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      // For native platforms, you would use react-native-maps
      return;
    }

    const initializeMap = async () => {
      const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
      
      if (!apiKey) {
        console.error('Google Maps API key is not configured');
        return;
      }

      try {
        const loader = new Loader({
          apiKey,
          version: 'weekly',
          libraries: ['places', 'geometry']
        });

        const google = await loader.load();
        
        if (mapRef.current) {
          const mapInstance = new google.maps.Map(mapRef.current, {
            center: initialLocation,
            zoom: 13,
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
            zoomControl: true,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'on' }]
              }
            ]
          });

          // Enable traffic layer if requested
          if (showTraffic) {
            const trafficLayer = new google.maps.TrafficLayer();
            trafficLayer.setMap(mapInstance);
          }

          // Initialize directions service and renderer
          const directionsServiceInstance = new google.maps.DirectionsService();
          const directionsRendererInstance = new google.maps.DirectionsRenderer({
            suppressMarkers: false,
            polylineOptions: {
              strokeColor: '#2563EB',
              strokeWeight: 5,
              strokeOpacity: 0.8
            }
          });
          
          directionsRendererInstance.setMap(mapInstance);

          setMap(mapInstance);
          setDirectionsService(directionsServiceInstance);
          setDirectionsRenderer(directionsRendererInstance);
          
          if (onMapReady) {
            onMapReady(mapInstance);
          }
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initializeMap();
  }, [initialLocation, onMapReady, showTraffic]);

  // Handle route calculation
  useEffect(() => {
    if (directionsService && directionsRenderer && routes.length > 0) {
      const route = routes[0]; // Use first route for now
      
      directionsService.route({
        origin: route.origin,
        destination: route.destination,
        waypoints: route.waypoints?.map(waypoint => ({
          location: waypoint,
          stopover: true
        })) || [],
        travelMode: google.maps.TravelMode.DRIVING,
        avoidTolls: false,
        avoidHighways: false,
        provideRouteAlternatives: true
      }, (result, status) => {
        if (status === 'OK' && result) {
          directionsRenderer.setDirections(result);
        } else {
          console.error('Directions request failed:', status);
        }
      });
    }
  }, [directionsService, directionsRenderer, routes]);

  if (Platform.OS !== 'web') {
    // For native platforms, return a placeholder or native map component
    return (
      <View style={[styles.container, style]}>
        <View style={styles.nativePlaceholder}>
          {/* This would be replaced with react-native-maps MapView for native */}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 12
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden'
  },
  nativePlaceholder: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center'
  }
});