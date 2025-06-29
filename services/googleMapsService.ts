import { Platform } from 'react-native';

export interface RouteResult {
  distance: string;
  duration: string;
  fuelCost: number;
  tollCost: number;
  totalCost: number;
  polyline: string;
  steps: Array<{
    instruction: string;
    distance: string;
    duration: string;
  }>;
}

export interface GasStation {
  id: string;
  name: string;
  address: string;
  distance: number;
  price: number;
  location: {
    lat: number;
    lng: number;
  };
}

class GoogleMapsService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  }

  async calculateRoute(
    origin: string,
    destination: string,
    fuelEfficiency: number, // km/L
    fuelPrice: number, // price per liter
    avoidTolls: boolean = false
  ): Promise<RouteResult[]> {
    if (Platform.OS !== 'web') {
      // For native platforms, you would use different API calls
      return this.getMockRoutes(origin, destination, fuelEfficiency, fuelPrice);
    }

    try {
      const directionsService = new google.maps.DirectionsService();
      
      const request: google.maps.DirectionsRequest = {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
        avoidTolls,
        provideRouteAlternatives: true,
        unitSystem: google.maps.UnitSystem.METRIC
      };

      return new Promise((resolve, reject) => {
        directionsService.route(request, (result, status) => {
          if (status === 'OK' && result) {
            const routes = result.routes.map((route, index) => {
              const leg = route.legs[0];
              const distanceKm = leg.distance?.value ? leg.distance.value / 1000 : 0;
              const fuelNeeded = distanceKm / fuelEfficiency;
              const fuelCost = fuelNeeded * fuelPrice;
              
              // Estimate toll costs (this would need a separate toll API in production)
              const tollCost = avoidTolls ? 0 : this.estimateTollCost(distanceKm);

              return {
                distance: leg.distance?.text || '0 km',
                duration: leg.duration?.text || '0 min',
                fuelCost: parseFloat(fuelCost.toFixed(2)),
                tollCost: parseFloat(tollCost.toFixed(2)),
                totalCost: parseFloat((fuelCost + tollCost).toFixed(2)),
                polyline: route.overview_polyline?.points || '',
                steps: leg.steps?.map(step => ({
                  instruction: step.instructions?.replace(/<[^>]*>/g, '') || '',
                  distance: step.distance?.text || '',
                  duration: step.duration?.text || ''
                })) || []
              };
            });
            
            resolve(routes);
          } else {
            reject(new Error(`Directions request failed: ${status}`));
          }
        });
      });
    } catch (error) {
      console.error('Error calculating route:', error);
      return this.getMockRoutes(origin, destination, fuelEfficiency, fuelPrice);
    }
  }

  async findNearbyGasStations(
    location: { lat: number; lng: number },
    radius: number = 5000 // meters
  ): Promise<GasStation[]> {
    if (Platform.OS !== 'web') {
      return this.getMockGasStations();
    }

    try {
      const service = new google.maps.places.PlacesService(
        document.createElement('div')
      );

      const request: google.maps.places.PlaceSearchRequest = {
        location: new google.maps.LatLng(location.lat, location.lng),
        radius,
        type: 'gas_station'
      };

      return new Promise((resolve, reject) => {
        service.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            const gasStations: GasStation[] = results.map((place, index) => ({
              id: place.place_id || `station_${index}`,
              name: place.name || 'Gas Station',
              address: place.vicinity || 'Unknown Address',
              distance: this.calculateDistance(
                location,
                {
                  lat: place.geometry?.location?.lat() || 0,
                  lng: place.geometry?.location?.lng() || 0
                }
              ),
              price: 1.45 + Math.random() * 0.3, // Mock price variation
              location: {
                lat: place.geometry?.location?.lat() || 0,
                lng: place.geometry?.location?.lng() || 0
              }
            }));
            
            resolve(gasStations.slice(0, 10)); // Limit to 10 results
          } else {
            reject(new Error(`Places search failed: ${status}`));
          }
        });
      });
    } catch (error) {
      console.error('Error finding gas stations:', error);
      return this.getMockGasStations();
    }
  }

  async geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    if (Platform.OS !== 'web') {
      return null;
    }

    try {
      const geocoder = new google.maps.Geocoder();
      
      return new Promise((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const location = results[0].geometry.location;
            resolve({
              lat: location.lat(),
              lng: location.lng()
            });
          } else {
            reject(new Error(`Geocoding failed: ${status}`));
          }
        });
      });
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  }

  private calculateDistance(
    point1: { lat: number; lng: number },
    point2: { lat: number; lng: number }
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(point2.lat - point1.lat);
    const dLng = this.toRad(point2.lng - point1.lng);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(point1.lat)) * Math.cos(this.toRad(point2.lat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private estimateTollCost(distanceKm: number): number {
    // Simple toll estimation - in production, use a toll API
    if (distanceKm < 10) return 0;
    if (distanceKm < 50) return 2.50;
    if (distanceKm < 100) return 5.00;
    return 8.50;
  }

  private getMockRoutes(
    origin: string,
    destination: string,
    fuelEfficiency: number,
    fuelPrice: number
  ): RouteResult[] {
    // Mock data for when Google Maps API is not available
    const mockDistances = [45.2, 52.1, 48.7];
    const mockDurations = ['38 min', '51 min', '46 min'];
    const mockTolls = [2.50, 0.00, 0.00];

    return mockDistances.map((distance, index) => {
      const fuelNeeded = distance / fuelEfficiency;
      const fuelCost = fuelNeeded * fuelPrice;
      const tollCost = mockTolls[index];

      return {
        distance: `${distance} km`,
        duration: mockDurations[index],
        fuelCost: parseFloat(fuelCost.toFixed(2)),
        tollCost,
        totalCost: parseFloat((fuelCost + tollCost).toFixed(2)),
        polyline: '',
        steps: []
      };
    });
  }

  private getMockGasStations(): GasStation[] {
    return [
      {
        id: '1',
        name: 'Shell Station',
        address: '123 Main St',
        distance: 0.8,
        price: 1.45,
        location: { lat: 37.7749, lng: -122.4194 }
      },
      {
        id: '2',
        name: 'BP Station',
        address: '456 Oak Ave',
        distance: 1.2,
        price: 1.42,
        location: { lat: 37.7849, lng: -122.4094 }
      },
      {
        id: '3',
        name: 'Chevron',
        address: '789 Pine St',
        distance: 2.1,
        price: 1.48,
        location: { lat: 37.7649, lng: -122.4294 }
      }
    ];
  }
}

export const googleMapsService = new GoogleMapsService();