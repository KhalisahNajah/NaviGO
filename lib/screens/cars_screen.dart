import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:navifuel/providers/car_provider.dart';
import 'package:navifuel/providers/app_state.dart';
import 'package:navifuel/models/car.dart';
import 'package:navifuel/models/currency.dart';
import 'package:navifuel/widgets/car_card_widget.dart';
import 'package:navifuel/widgets/add_car_dialog.dart';
import 'package:navifuel/widgets/currency_selector_dialog.dart';

class CarsScreen extends StatelessWidget {
  const CarsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Cars'),
        actions: [
          Consumer<AppState>(
            builder: (context, appState, child) {
              return TextButton.icon(
                onPressed: () {
                  showDialog(
                    context: context,
                    builder: (context) => const CurrencySelectorDialog(),
                  );
                },
                icon: const Icon(Icons.language),
                label: Text(appState.selectedCurrency.code),
              );
            },
          ),
          IconButton(
            onPressed: () {
              showDialog(
                context: context,
                builder: (context) => const AddCarDialog(),
              );
            },
            icon: const Icon(Icons.add),
          ),
        ],
      ),
      body: Consumer2<CarProvider, AppState>(
        builder: (context, carProvider, appState, child) {
          if (carProvider.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          final fuelPrices = appState.getFuelPrices();

          return Column(
            children: [
              // Fuel Price Info Card
              Card(
                margin: const EdgeInsets.all(16),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Current Fuel Prices (${appState.selectedCurrency.name})',
                        style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Regular: ${appState.selectedCurrency.symbol}${fuelPrices['Regular']?.toStringAsFixed(2)}/L',
                            style: const TextStyle(
                              color: Color(0xFF059669),
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          Text(
                            'Premium: ${appState.selectedCurrency.symbol}${fuelPrices['Premium']?.toStringAsFixed(2)}/L',
                            style: const TextStyle(
                              color: Color(0xFF059669),
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          Text(
                            'Diesel: ${appState.selectedCurrency.symbol}${fuelPrices['Diesel']?.toStringAsFixed(2)}/L',
                            style: const TextStyle(
                              color: Color(0xFF059669),
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),

              // Cars List
              Expanded(
                child: carProvider.cars.isEmpty
                    ? const Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              Icons.directions_car,
                              size: 48,
                              color: Colors.grey,
                            ),
                            SizedBox(height: 16),
                            Text(
                              'No Cars Added',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            SizedBox(height: 8),
                            Text(
                              'Add your first car to start calculating fuel costs',
                              textAlign: TextAlign.center,
                              style: TextStyle(color: Colors.grey),
                            ),
                          ],
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        itemCount: carProvider.cars.length,
                        itemBuilder: (context, index) {
                          final car = carProvider.cars[index];
                          return CarCardWidget(
                            car: car,
                            fuelPrices: fuelPrices,
                            currency: appState.selectedCurrency,
                          );
                        },
                      ),
              ),
            ],
          );
        },
      ),
    );
  }
}