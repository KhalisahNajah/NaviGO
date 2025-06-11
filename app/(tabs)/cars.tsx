import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { Car, Plus, CreditCard as Edit, Trash2, Fuel, DollarSign, Star, Save } from 'lucide-react-native';

interface CarProfile {
  id: string;
  name: string;
  make: string;
  model: string;
  year: string;
  fuelEfficiency: string; // km/l
  fuelType: string;
  isDefault: boolean;
}

export default function CarsScreen() {
  const [cars, setCars] = useState<CarProfile[]>([
    {
      id: '1',
      name: 'Daily Driver',
      make: 'Toyota',
      model: 'Camry',
      year: '2022',
      fuelEfficiency: '12.5',
      fuelType: 'Regular',
      isDefault: true,
    },
    {
      id: '2',
      name: 'Weekend Car',
      make: 'BMW',
      model: 'X5',
      year: '2023',
      fuelEfficiency: '9.2',
      fuelType: 'Premium',
      isDefault: false,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCar, setEditingCar] = useState<CarProfile | null>(null);
  const [newCar, setNewCar] = useState({
    name: '',
    make: '',
    model: '',
    year: '',
    fuelEfficiency: '',
    fuelType: 'Regular',
  });

  const [fuelPrices] = useState({
    Regular: 1.45,
    Premium: 1.68,
    Diesel: 1.52,
  });

  const resetForm = () => {
    setNewCar({
      name: '',
      make: '',
      model: '',
      year: '',
      fuelEfficiency: '',
      fuelType: 'Regular',
    });
  };

  const handleAddCar = () => {
    if (!newCar.name || !newCar.make || !newCar.model || !newCar.year || !newCar.fuelEfficiency) {
      Alert.alert('Missing Information', 'Please fill in all fields.');
      return;
    }

    const car: CarProfile = {
      id: Date.now().toString(),
      ...newCar,
      isDefault: cars.length === 0,
    };

    setCars([...cars, car]);
    resetForm();
    setShowAddModal(false);
  };

  const handleEditCar = () => {
    if (!editingCar || !newCar.name || !newCar.make || !newCar.model || !newCar.year || !newCar.fuelEfficiency) {
      Alert.alert('Missing Information', 'Please fill in all fields.');
      return;
    }

    setCars(cars.map(car => 
      car.id === editingCar.id 
        ? { ...car, ...newCar }
        : car
    ));
    
    setEditingCar(null);
    resetForm();
    setShowAddModal(false);
  };

  const handleDeleteCar = (carId: string) => {
    Alert.alert(
      'Delete Car',
      'Are you sure you want to delete this car profile?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const carToDelete = cars.find(car => car.id === carId);
            const updatedCars = cars.filter(car => car.id !== carId);
            
            // If deleting the default car, make the first remaining car default
            if (carToDelete?.isDefault && updatedCars.length > 0) {
              updatedCars[0].isDefault = true;
            }
            
            setCars(updatedCars);
          },
        },
      ]
    );
  };

  const handleSetDefault = (carId: string) => {
    setCars(cars.map(car => ({
      ...car,
      isDefault: car.id === carId,
    })));
  };

  const openEditModal = (car: CarProfile) => {
    setEditingCar(car);
    setNewCar({
      name: car.name,
      make: car.make,
      model: car.model,
      year: car.year,
      fuelEfficiency: car.fuelEfficiency,
      fuelType: car.fuelType,
    });
    setShowAddModal(true);
  };

  const calculateTripCost = (distance: number, efficiency: number, fuelType: string) => {
    const fuelNeeded = distance / efficiency;
    const cost = fuelNeeded * fuelPrices[fuelType as keyof typeof fuelPrices];
    return cost.toFixed(2);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Cars</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}>
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Fuel Price Info */}
        <View style={styles.fuelPriceCard}>
          <Text style={styles.sectionTitle}>Current Fuel Prices</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Regular: ${fuelPrices.Regular}/L</Text>
            <Text style={styles.priceLabel}>Premium: ${fuelPrices.Premium}/L</Text>
            <Text style={styles.priceLabel}>Diesel: ${fuelPrices.Diesel}/L</Text>
          </View>
        </View>

        {/* Car List */}
        {cars.map((car) => (
          <View key={car.id} style={styles.carCard}>
            <View style={styles.carHeader}>
              <View style={styles.carInfo}>
                <View style={styles.carTitleRow}>
                  <Text style={styles.carName}>{car.name}</Text>
                  {car.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Star size={12} color="#FFFFFF" />
                      <Text style={styles.defaultText}>Default</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.carDetails}>
                  {car.year} {car.make} {car.model}
                </Text>
              </View>
              <View style={styles.carActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => openEditModal(car)}>
                  <Edit size={16} color="#2563EB" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDeleteCar(car.id)}>
                  <Trash2 size={16} color="#DC2626" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.carStats}>
              <View style={styles.statItem}>
                <Fuel size={16} color="#059669" />
                <Text style={styles.statLabel}>Efficiency</Text>
                <Text style={styles.statValue}>{car.fuelEfficiency} km/L</Text>
              </View>
              <View style={styles.statItem}>
                <DollarSign size={16} color="#EA580C" />
                <Text style={styles.statLabel}>Fuel Type</Text>
                <Text style={styles.statValue}>{car.fuelType}</Text>
              </View>
            </View>

            {/* Sample trip calculations */}
            <View style={styles.tripCalculations}>
              <Text style={styles.calculationTitle}>Trip Cost Estimates</Text>
              <View style={styles.calculationRow}>
                <Text style={styles.calculationLabel}>50 km trip:</Text>
                <Text style={styles.calculationValue}>
                  ${calculateTripCost(50, parseFloat(car.fuelEfficiency), car.fuelType)}
                </Text>
              </View>
              <View style={styles.calculationRow}>
                <Text style={styles.calculationLabel}>100 km trip:</Text>
                <Text style={styles.calculationValue}>
                  ${calculateTripCost(100, parseFloat(car.fuelEfficiency), car.fuelType)}
                </Text>
              </View>
            </View>

            {!car.isDefault && (
              <TouchableOpacity
                style={styles.setDefaultButton}
                onPress={() => handleSetDefault(car.id)}>
                <Text style={styles.setDefaultText}>Set as Default</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        {cars.length === 0 && (
          <View style={styles.emptyState}>
            <Car size={48} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No Cars Added</Text>
            <Text style={styles.emptyText}>
              Add your first car to start calculating fuel costs
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Add/Edit Car Modal */}
      <Modal visible={showAddModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingCar ? 'Edit Car' : 'Add New Car'}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setShowAddModal(false);
                setEditingCar(null);
                resetForm();
              }}>
              <Text style={styles.closeButton}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Car Name</Text>
              <TextInput
                style={styles.textInput}
                value={newCar.name}
                onChangeText={(text) => setNewCar({ ...newCar, name: text })}
                placeholder="e.g., Daily Driver"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Make</Text>
              <TextInput
                style={styles.textInput}
                value={newCar.make}
                onChangeText={(text) => setNewCar({ ...newCar, make: text })}
                placeholder="e.g., Toyota"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Model</Text>
              <TextInput
                style={styles.textInput}
                value={newCar.model}
                onChangeText={(text) => setNewCar({ ...newCar, model: text })}
                placeholder="e.g., Camry"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Year</Text>
              <TextInput
                style={styles.textInput}
                value={newCar.year}
                onChangeText={(text) => setNewCar({ ...newCar, year: text })}
                placeholder="e.g., 2022"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Fuel Efficiency (km/L)</Text>
              <TextInput
                style={styles.textInput}
                value={newCar.fuelEfficiency}
                onChangeText={(text) => setNewCar({ ...newCar, fuelEfficiency: text })}
                placeholder="e.g., 12.5"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Fuel Type</Text>
              <View style={styles.fuelTypeButtons}>
                {['Regular', 'Premium', 'Diesel'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.fuelTypeButton,
                      newCar.fuelType === type && styles.fuelTypeButtonActive,
                    ]}
                    onPress={() => setNewCar({ ...newCar, fuelType: type })}>
                    <Text
                      style={[
                        styles.fuelTypeText,
                        newCar.fuelType === type && styles.fuelTypeTextActive,
                      ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={editingCar ? handleEditCar : handleAddCar}>
              <Save size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>
                {editingCar ? 'Update Car' : 'Add Car'}
              </Text>
            </TouchableOpacity>
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  addButton: {
    backgroundColor: '#2563EB',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  fuelPriceCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceLabel: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  carCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  carHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  carInfo: {
    flex: 1,
  },
  carTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  carName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 8,
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  defaultText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 2,
  },
  carDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
  carActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  carStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 2,
  },
  tripCalculations: {
    marginBottom: 12,
  },
  calculationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  calculationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  calculationLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  calculationValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  setDefaultButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  setDefaultText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
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
    paddingTop: 60,
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
  formField: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
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
  fuelTypeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fuelTypeButton: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  fuelTypeButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  fuelTypeText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  fuelTypeTextActive: {
    color: '#FFFFFF',
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  saveButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});