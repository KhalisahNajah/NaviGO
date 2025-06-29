import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:navifuel/providers/location_provider.dart';
import 'package:navifuel/widgets/route_results_dialog.dart';

class RouteSearchWidget extends StatefulWidget {
  const RouteSearchWidget({super.key});

  @override
  State<RouteSearchWidget> createState() => _RouteSearchWidgetState();
}

class _RouteSearchWidgetState extends State<RouteSearchWidget> {
  final TextEditingController _fromController = TextEditingController();
  final TextEditingController _toController = TextEditingController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final locationProvider = context.read<LocationProvider>();
      if (locationProvider.currentPosition != null) {
        _fromController.text = 'Current Location';
      }
    });
  }

  void _searchRoutes() {
    if (_fromController.text.isEmpty || _toController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter both starting point and destination'),
        ),
      );
      return;
    }

    showDialog(
      context: context,
      builder: (context) => RouteResultsDialog(
        from: _fromController.text,
        to: _toController.text,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        children: [
          // From Input
          TextField(
            controller: _fromController,
            decoration: const InputDecoration(
              prefixIcon: Icon(Icons.search),
              hintText: 'From (current location)',
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 8),
          
          // To Input
          TextField(
            controller: _toController,
            decoration: const InputDecoration(
              prefixIcon: Icon(Icons.navigation),
              hintText: 'To (destination)',
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 16),
          
          // Search Button
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: _searchRoutes,
              icon: const Icon(Icons.route),
              label: const Text('Find Routes'),
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _fromController.dispose();
    _toController.dispose();
    super.dispose();
  }
}