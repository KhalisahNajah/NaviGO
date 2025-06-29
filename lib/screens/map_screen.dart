import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:navifuel/providers/location_provider.dart';
import 'package:navifuel/providers/app_state.dart';
import 'package:navifuel/providers/car_provider.dart';
import 'package:navifuel/widgets/route_search_widget.dart';
import 'package:navifuel/widgets/quick_actions_widget.dart';
import 'package:navifuel/widgets/map_widget.dart';

class MapScreen extends StatefulWidget {
  const MapScreen({super.key});

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<LocationProvider>().getCurrentLocation();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Map Widget
          const Expanded(child: MapWidget()),
          
          // Floating Chat Button
          Positioned(
            top: 60,
            right: 16,
            child: FloatingActionButton(
              heroTag: "chat",
              onPressed: () {
                // Navigate to chat or show chat modal
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Chat feature coming soon!')),
                );
              },
              backgroundColor: Theme.of(context).primaryColor,
              child: const Icon(Icons.chat, color: Colors.white),
            ),
          ),
          
          // Bottom Sheet with Search and Actions
          DraggableScrollableSheet(
            initialChildSize: 0.35,
            minChildSize: 0.25,
            maxChildSize: 0.8,
            builder: (context, scrollController) {
              return Container(
                decoration: const BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black12,
                      blurRadius: 8,
                      offset: Offset(0, -2),
                    ),
                  ],
                ),
                child: SingleChildScrollView(
                  controller: scrollController,
                  child: const Column(
                    children: [
                      // Drag Handle
                      SizedBox(height: 8),
                      Container(
                        width: 40,
                        height: 4,
                        decoration: BoxDecoration(
                          color: Colors.grey,
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                      SizedBox(height: 16),
                      
                      // Route Search
                      RouteSearchWidget(),
                      
                      SizedBox(height: 16),
                      
                      // Quick Actions
                      QuickActionsWidget(),
                      
                      SizedBox(height: 32),
                    ],
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}