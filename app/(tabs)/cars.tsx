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
import { Car, Plus, Edit, Trash2, Fuel, DollarSign, Star, Save, Globe } from 'lucide-react-native';

interface Currency {
  code: string;
  symbol: string;
  name: string;
}

interface CarProfile {
  id: string;
  name: string;
  make: string;
  model: string;
  year: string;
  fuelEfficiency: number;
  fuelType: 'Regular' | 'Premium' | 'Diesel';
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
      fuelEfficiency: 12.5,
      fuelType: 'Regular',
      isDefault: true,
    },
    {
      id: '2',
      name: 'Weekend Car',
      make: 'BMW',
      model: 'X3',
      year: '2021',
      fuelEfficiency: 10.2,
      fuelType: 'Premium',
      isDefault: false,
    }
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [editingCar, setEditingCar] = useState<CarProfile | null>(null);
  const [newCar, setNewCar] = useState({
    name: '',
    make: '',
    model: '',
    year: '',
    fuelEfficiency: '',
    fuelType: 'Regular' as 'Regular' | 'Premium' | 'Diesel',
  });

  const currencies: Currency[] = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'THB', symbol: '฿', name: 'Thai Baht' },
    { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  ];

  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);

  const getFuelPrices = () => {
    const basePrices = {
      Regular: 1.45,
      Premium: 1.68,
      Diesel: 1.52,
    };

    const multiplier = selectedCurrency.code === 'MYR' ? 1.4 : 
                     selectedCurrency.code === 'EUR' ? 1.1 : 1;

    return {
      Regular: basePrices.Regular * multiplier,
      Premium: basePrices.Premium * multiplier,
      Diesel: basePrices.Diesel * multiplier,
    };
  };

  const fuelPrices = getFuelPrices();

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

    const carData: CarProfile = {
      id: Date.now().toString(),
      ...newCar,
      fuelEfficiency: parseFloat(newCar.fuelEfficiency),
      isDefault: cars.length === 0,
    };

    setCars(prev => [...prev, carData]);
    resetForm();
    setShowAddModal(false);
    Alert.alert('Success', 'Car added successfully!');
  };

  const handleEditCar = () => {
    if (!editingCar || !newCar.name || !newCar.make || !newCar.model || !newCar.year || !newCar.fuelEfficiency) {
      Alert.alert('Missing Information', 'Please fill in all fields.');
      return;
    }

    setCars(prev => prev.map(car => 
      car.id === editingCar.id 
        ? { ...car, ...newCar, fuelEfficiency: parseFloat(newCar.fuelEfficiency) }
        : car
    ));
    
    setEditingCar(null);
    resetForm();
    setShowAddModal(false);
    Alert.alert('Success', 'Car updated successfully!');
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
            setCars(prev => prev.filter(car => car.id !== carId));
            Alert.alert('Success', 'Car deleted successfully!');
          },
        },
      ]
    );
  };

  const handleSetDefault = (carId: string) => {
    setCars(prev => prev.map(car => ({
      ...car,
      isDefault: car.id === carId
    })));
    Alert.alert('Success', 'Default car updated!');
  };

  const handleCurrencySelect = (currency: Currency) => {
    setSelectedCurrency(currency);
    setShowCurrencyModal(false);
    Alert.alert('Success', 'Currency updated successfully!');
  };

  const openEditModal = (car: CarProfile) => {
    setEditingCar(car);
    setNewCar({
      name: car.name,
      make: car.make,
      model: car.model,
      year: car.year,
      fuelEfficiency: car.fuelEfficiency.toString(),
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
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.currencyButton}
            onPress={() => setShowCurrencyModal(true)}>
            <Globe size={20} color="#2563EB" />
            <Text style={styles.currencyText}>{selectedCurrency.code}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}>
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Fuel Price Info */}
        <View style={styles.fuelPriceCard}>
          <Text style={styles.sectionTitle}>Current Fuel Prices ({selectedCurrency.name})</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Regular: {selectedCurrency.symbol}{fuelPrices.Regular.toFixed(2)}/L</Text>
            <Text style={styles.priceLabel}>Premium: {selectedCurrency.symbol}{fuelPrices.Premium.toFixed(2)}/L</Text>
            <Text style={styles.priceLabel}>Diesel: {selectedCurrency.symbol}{fuelPrices.Diesel.toFixed(2)}/L</Text>
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
                  {selectedCurrency.symbol}{calculateTripCost(50, car.fuelEfficiency, car.fuelType)}
                </Text>
              </View>
              <View style={styles.calculationRow}>
                <Text style={styles.calculationLabel}>100 km trip:</Text>
                <Text style={styles.calculationValue}>
                  {selectedCurrency.symbol}{calculateTripCost(100, car.fuelEfficiency, car.fuelType)}
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

      {/* Currency Selection Modal */}
      <Modal visible={showCurrencyModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Currency</Text>
            <TouchableOpacity onPress={() => setShowCurrencyModal(false)}>
              <Text style={styles.closeButton}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            {currencies.map((currency) => (
              <TouchableOpacity
                key={currency.code}
                style={[
                  styles.currencyOption,
                  selectedCurrency.code === currency.code && styles.currencyOptionSelected
                ]}
                onPress={() => handleCurrencySelect(currency)}>
                <View style={styles.currencyInfo}>
                  <Text style={styles.currencyCode}>{currency.code}</Text>
                  <Text style={styles.currencyName}>{currency.name}</Text>
                </View>
                <Text style={styles.currencySymbol}>{currency.symbol}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

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
                    onPress={() => setNewCar({ ...newCar, fuelType: type as 'Regular' | 'Premium' | 'Diesel' })}>
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  currencyText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
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
  currencyOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  currencyOptionSelected: {
    backgroundColor: '#EEF2FF',
  },
  currencyInfo: {
    flex: 1,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  currencyName: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2563EB',
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