import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:navifuel/models/car.dart';
import 'package:navifuel/models/currency.dart';
import 'package:navifuel/providers/car_provider.dart';
import 'package:navifuel/widgets/add_car_dialog.dart';

class CarCardWidget extends StatelessWidget {
  final Car car;
  final Map<String, double> fuelPrices;
  final Currency currency;

  const CarCardWidget({
    super.key,
    required this.car,
    required this.fuelPrices,
    required this.currency,
  });

  double _calculateTripCost(double distance) {
    final fuelNeeded = distance / car.fuelEfficiency;
    final fuelPrice = fuelPrices[car.fuelType] ?? 0.0;
    return fuelNeeded * fuelPrice;
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(
                            car.name,
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          if (car.isDefault) ...[
                            const SizedBox(width: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                                vertical: 2,
                              ),
                              decoration: BoxDecoration(
                                color: const Color(0xFF059669),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(
                                    Icons.star,
                                    size: 12,
                                    color: Colors.white,
                                  ),
                                  SizedBox(width: 2),
                                  Text(
                                    'Default',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 10,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${car.year} ${car.make} ${car.model}',
                        style: const TextStyle(
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),
                ),
                Row(
                  children: [
                    IconButton(
                      onPressed: () {
                        showDialog(
                          context: context,
                          builder: (context) => AddCarDialog(car: car),
                        );
                      },
                      icon: const Icon(Icons.edit, color: Color(0xFF2563EB)),
                    ),
                    IconButton(
                      onPressed: () {
                        _showDeleteDialog(context);
                      },
                      icon: const Icon(Icons.delete, color: Color(0xFFDC2626)),
                    ),
                  ],
                ),
              ],
            ),

            const SizedBox(height: 16),

            // Stats
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFF9FAFB),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  Column(
                    children: [
                      const Icon(
                        Icons.local_gas_station,
                        size: 16,
                        color: Color(0xFF059669),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Efficiency',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        '${car.fuelEfficiency} km/L',
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                  Column(
                    children: [
                      const Icon(
                        Icons.attach_money,
                        size: 16,
                        color: Color(0xFFEA580C),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Fuel Type',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        car.fuelType,
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 12),

            // Trip Cost Estimates
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Trip Cost Estimates',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      '50 km trip:',
                      style: TextStyle(color: Colors.grey),
                    ),
                    Text(
                      '${currency.symbol}${_calculateTripCost(50).toStringAsFixed(2)}',
                      style: const TextStyle(
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF059669),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      '100 km trip:',
                      style: TextStyle(color: Colors.grey),
                    ),
                    Text(
                      '${currency.symbol}${_calculateTripCost(100).toStringAsFixed(2)}',
                      style: const TextStyle(
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF059669),
                      ),
                    ),
                  ],
                ),
              ],
            ),

            // Set as Default Button
            if (!car.isDefault) ...[
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: TextButton(
                  onPressed: () {
                    context.read<CarProvider>().setDefaultCar(car.id);
                  },
                  style: TextButton.styleFrom(
                    backgroundColor: const Color(0xFFF3F4F6),
                  ),
                  child: const Text(
                    'Set as Default',
                    style: TextStyle(
                      color: Color(0xFF2563EB),
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  void _showDeleteDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Car'),
        content: const Text('Are you sure you want to delete this car profile?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              context.read<CarProvider>().deleteCar(car.id);
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Car deleted successfully!')),
              );
            },
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }
}