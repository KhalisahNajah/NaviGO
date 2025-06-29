import 'package:flutter/material.dart';
import 'package:navifuel/models/currency.dart';

class AppState extends ChangeNotifier {
  Currency _selectedCurrency = Currency.supportedCurrencies.first;
  bool _isLoading = false;
  String? _error;

  Currency get selectedCurrency => _selectedCurrency;
  bool get isLoading => _isLoading;
  String? get error => _error;

  void setSelectedCurrency(Currency currency) {
    _selectedCurrency = currency;
    notifyListeners();
  }

  void setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void setError(String? error) {
    _error = error;
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }

  Map<String, double> getFuelPrices() {
    const basePrices = {
      'Regular': 1.45,
      'Premium': 1.68,
      'Diesel': 1.52,
    };

    double multiplier = 1.0;
    switch (_selectedCurrency.code) {
      case 'MYR':
        multiplier = 1.4;
        break;
      case 'EUR':
        multiplier = 1.1;
        break;
      default:
        multiplier = 1.0;
    }

    return basePrices.map((key, value) => MapEntry(key, value * multiplier));
  }
}