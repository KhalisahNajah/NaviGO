import 'package:flutter/material.dart';
import 'package:navifuel/models/gas_station.dart';

class GasStationsDialog extends StatelessWidget {
  const GasStationsDialog({super.key});

  @override
  Widget build(BuildContext context) {
    // Mock gas stations data
    final gasStations = [
      GasStation(
        id: '1',
        name: 'Shell Station',
        address: '123 Main St',
        distance: 0.8,
        price: 1.45,
        latitude: 37.7749,
        longitude: -122.4194,
      ),
      GasStation(
        id: '2',
        name: 'BP Station',
        address: '456 Oak Ave',
        distance: 1.2,
        price: 1.42,
        latitude: 37.7849,
        longitude: -122.4094,
      ),
      GasStation(
        id: '3',
        name: 'Chevron',
        address: '789 Pine St',
        distance: 2.1,
        price: 1.48,
        latitude: 37.7649,
        longitude: -122.4294,
      ),
    ];

    return Dialog(
      child: Container(
        constraints: const BoxConstraints(maxHeight: 500),
        child: Column(
          children: [
            // Header
            Container(
              padding: const EdgeInsets.all(16),
              decoration: const BoxDecoration(
                border: Border(bottom: BorderSide(color: Colors.grey, width: 0.5)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Nearby Gas Stations',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Close'),
                  ),
                ],
              ),
            ),

            // Gas Stations List
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: gasStations.length,
                itemBuilder: (context, index) {
                  final station = gasStations[index];
                  return _buildStationCard(context, station);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStationCard(BuildContext context, GasStation station) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        leading: Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            color: Theme.of(context).primaryColor.withOpacity(0.1),
            borderRadius: BorderRadius.circular(24),
          ),
          child: Icon(
            Icons.local_gas_station,
            color: Theme.of(context).primaryColor,
          ),
        ),
        title: Text(
          station.name,
          style: const TextStyle(
            fontWeight: FontWeight.w600,
          ),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('${station.distance.toStringAsFixed(1)} km away'),
            Text(
              station.address,
              style: const TextStyle(
                fontSize: 12,
                color: Colors.grey,
              ),
            ),
          ],
        ),
        trailing: Text(
          '\$${station.price.toStringAsFixed(2)}/L',
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: Color(0xFF059669),
          ),
        ),
        onTap: () {
          Navigator.pop(context);
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Navigating to ${station.name}')),
          );
        },
      ),
    );
  }
}