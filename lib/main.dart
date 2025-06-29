import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:navifuel/providers/app_state.dart';
import 'package:navifuel/providers/car_provider.dart';
import 'package:navifuel/providers/location_provider.dart';
import 'package:navifuel/screens/main_screen.dart';
import 'package:navifuel/utils/theme.dart';

void main() {
  runApp(const NaviFuelApp());
}

class NaviFuelApp extends StatelessWidget {
  const NaviFuelApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AppState()),
        ChangeNotifierProvider(create: (_) => CarProvider()),
        ChangeNotifierProvider(create: (_) => LocationProvider()),
      ],
      child: MaterialApp(
        title: 'NaviFuel',
        theme: AppTheme.lightTheme,
        home: const MainScreen(),
        debugShowCheckedModeBanner: false,
      ),
    );
  }
}