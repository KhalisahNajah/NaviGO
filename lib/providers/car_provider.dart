import 'package:flutter/material.dart';
import 'package:navifuel/models/car.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

class CarProvider extends ChangeNotifier {
  List<Car> _cars = [];
  bool _isLoading = false;

  List<Car> get cars => _cars;
  bool get isLoading => _isLoading;

  Car? get defaultCar => _cars.where((car) => car.isDefault).firstOrNull;

  CarProvider() {
    loadCars();
  }

  Future<void> loadCars() async {
    _isLoading = true;
    notifyListeners();

    try {
      final prefs = await SharedPreferences.getInstance();
      final carsJson = prefs.getString('cars');
      
      if (carsJson != null) {
        final List<dynamic> carsList = json.decode(carsJson);
        _cars = carsList.map((carJson) => Car.fromJson(carJson)).toList();
      } else {
        // Add default cars if none exist
        _cars = [
          Car(
            id: '1',
            name: 'Daily Driver',
            make: 'Toyota',
            model: 'Camry',
            year: '2022',
            fuelEfficiency: 12.5,
            fuelType: 'Regular',
            isDefault: true,
          ),
          Car(
            id: '2',
            name: 'Weekend Car',
            make: 'BMW',
            model: 'X3',
            year: '2021',
            fuelEfficiency: 10.2,
            fuelType: 'Premium',
          ),
        ];
        await saveCars();
      }
    } catch (e) {
      print('Error loading cars: $e');
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> saveCars() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final carsJson = json.encode(_cars.map((car) => car.toJson()).toList());
      await prefs.setString('cars', carsJson);
    } catch (e) {
      print('Error saving cars: $e');
    }
  }

  Future<void> addCar(Car car) async {
    // If this is the first car, make it default
    final isFirstCar = _cars.isEmpty;
    final newCar = isFirstCar ? car.copyWith(isDefault: true) : car;
    
    _cars.add(newCar);
    await saveCars();
    notifyListeners();
  }

  Future<void> updateCar(Car updatedCar) async {
    final index = _cars.indexWhere((car) => car.id == updatedCar.id);
    if (index != -1) {
      _cars[index] = updatedCar;
      await saveCars();
      notifyListeners();
    }
  }

  Future<void> deleteCar(String carId) async {
    _cars.removeWhere((car) => car.id == carId);
    await saveCars();
    notifyListeners();
  }

  Future<void> setDefaultCar(String carId) async {
    _cars = _cars.map((car) => car.copyWith(isDefault: car.id == carId)).toList();
    await saveCars();
    notifyListeners();
  }

  double calculateTripCost(double distance, String fuelType, Map<String, double> fuelPrices) {
    final car = defaultCar;
    if (car == null) return 0.0;
    
    final fuelNeeded = distance / car.fuelEfficiency;
    final fuelPrice = fuelPrices[fuelType] ?? 0.0;
    return fuelNeeded * fuelPrice;
  }
}