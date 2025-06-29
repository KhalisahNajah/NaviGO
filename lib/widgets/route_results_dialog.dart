import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:navifuel/models/route_result.dart';
import 'package:navifuel/providers/app_state.dart';

class RouteResultsDialog extends StatelessWidget {
  final String from;
  final String to;

  const RouteResultsDialog({
    super.key,
    required this.from,
    required this.to,
  });

  @override
  Widget build(BuildContext context) {
    // Mock route results
    final routes = [
      RouteResult(
        distance: '45.2 km',
        duration: '38 min',
        fuelCost: 5.85,
        tollCost: 2.50,
        totalCost: 8.35,
        routeType: 'Fastest Route',
      ),
      RouteResult(
        distance: '52.1 km',
        duration: '51 min',
        fuelCost: 6.75,
        tollCost: 0.00,
        totalCost: 6.75,
        routeType: 'Most Economical',
      ),
      RouteResult(
        distance: '48.7 km',
        duration: '46 min',
        fuelCost: 6.30,
        tollCost: 0.00,
        totalCost: 6.30,
        routeType: 'Alternative Route',
      ),
    ];

    return Dialog(
      child: Container(
        constraints: const BoxConstraints(maxHeight: 600),
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
                    'Route Options',
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

            // Routes List
            Expanded(
              child: Consumer<AppState>(
                builder: (context, appState, child) {
                  return ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: routes.length,
                    itemBuilder: (context, index) {
                      final route = routes[index];
                      return _buildRouteCard(context, route, appState, index);
                    },
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRouteCard(BuildContext context, RouteResult route, AppState appState, int index) {
    Color indicatorColor;
    switch (index) {
      case 0:
        indicatorColor = const Color(0xFF059669);
        break;
      case 1:
        indicatorColor = const Color(0xFFEA580C);
        break;
      default:
        indicatorColor = const Color(0xFF6B7280);
    }

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: () {
          Navigator.pop(context);
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Selected ${route.routeType}')),
          );
        },
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Route Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    route.routeType,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  Container(
                    width: 12,
                    height: 12,
                    decoration: BoxDecoration(
                      color: indicatorColor,
                      shape: BoxShape.circle,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              // Route Details
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.route, size: 16, color: Colors.grey),
                      const SizedBox(width: 4),
                      Text(
                        route.distance,
                        style: const TextStyle(color: Colors.grey),
                      ),
                    ],
                  ),
                  Row(
                    children: [
                      const Icon(Icons.access_time, size: 16, color: Colors.grey),
                      const SizedBox(width: 4),
                      Text(
                        route.duration,
                        style: const TextStyle(color: Colors.grey),
                      ),
                    ],
                  ),
                  Row(
                    children: [
                      const Icon(Icons.attach_money, size: 16, color: Colors.grey),
                      const SizedBox(width: 4),
                      Text(
                        '${appState.selectedCurrency.symbol}${route.totalCost.toStringAsFixed(2)}',
                        style: const TextStyle(color: Colors.grey),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 8),

              // Cost Breakdown
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Fuel: ${appState.selectedCurrency.symbol}${route.fuelCost.toStringAsFixed(2)}',
                    style: const TextStyle(
                      fontSize: 12,
                      color: Colors.grey,
                    ),
                  ),
                  Text(
                    'Toll: ${appState.selectedCurrency.symbol}${route.tollCost.toStringAsFixed(2)}',
                    style: const TextStyle(
                      fontSize: 12,
                      color: Colors.grey,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}