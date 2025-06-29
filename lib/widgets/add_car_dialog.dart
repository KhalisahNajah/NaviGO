import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:navifuel/models/car.dart';
import 'package:navifuel/providers/car_provider.dart';

class AddCarDialog extends StatefulWidget {
  final Car? car; // For editing existing car

  const AddCarDialog({super.key, this.car});

  @override
  State<AddCarDialog> createState() => _AddCarDialogState();
}

class _AddCarDialogState extends State<AddCarDialog> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _makeController = TextEditingController();
  final _modelController = TextEditingController();
  final _yearController = TextEditingController();
  final _efficiencyController = TextEditingController();
  String _selectedFuelType = 'Regular';

  final List<String> _fuelTypes = ['Regular', 'Premium', 'Diesel'];

  @override
  void initState() {
    super.initState();
    if (widget.car != null) {
      _nameController.text = widget.car!.name;
      _makeController.text = widget.car!.make;
      _modelController.text = widget.car!.model;
      _yearController.text = widget.car!.year;
      _efficiencyController.text = widget.car!.fuelEfficiency.toString();
      _selectedFuelType = widget.car!.fuelType;
    }
  }

  void _saveCar() async {
    if (!_formKey.currentState!.validate()) return;

    final car = Car(
      id: widget.car?.id ?? DateTime.now().millisecondsSinceEpoch.toString(),
      name: _nameController.text.trim(),
      make: _makeController.text.trim(),
      model: _modelController.text.trim(),
      year: _yearController.text.trim(),
      fuelEfficiency: double.parse(_efficiencyController.text),
      fuelType: _selectedFuelType,
      isDefault: widget.car?.isDefault ?? false,
    );

    final carProvider = context.read<CarProvider>();
    
    if (widget.car != null) {
      await carProvider.updateCar(car);
    } else {
      await carProvider.addCar(car);
    }

    if (mounted) {
      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            widget.car != null 
                ? 'Car updated successfully!' 
                : 'Car added successfully!',
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      child: Container(
        constraints: const BoxConstraints(maxHeight: 600),
        child: Column(
          mainAxisSize: MainAxisSize.min,
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
                  Text(
                    widget.car != null ? 'Edit Car' : 'Add New Car',
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Cancel'),
                  ),
                ],
              ),
            ),

            // Form
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Form(
                  key: _formKey,
                  child: Column(
                    children: [
                      TextFormField(
                        controller: _nameController,
                        decoration: const InputDecoration(
                          labelText: 'Car Name',
                          hintText: 'e.g., Daily Driver',
                        ),
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) {
                            return 'Please enter a car name';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      TextFormField(
                        controller: _makeController,
                        decoration: const InputDecoration(
                          labelText: 'Make',
                          hintText: 'e.g., Toyota',
                        ),
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) {
                            return 'Please enter the car make';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      TextFormField(
                        controller: _modelController,
                        decoration: const InputDecoration(
                          labelText: 'Model',
                          hintText: 'e.g., Camry',
                        ),
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) {
                            return 'Please enter the car model';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      TextFormField(
                        controller: _yearController,
                        decoration: const InputDecoration(
                          labelText: 'Year',
                          hintText: 'e.g., 2022',
                        ),
                        keyboardType: TextInputType.number,
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) {
                            return 'Please enter the car year';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      TextFormField(
                        controller: _efficiencyController,
                        decoration: const InputDecoration(
                          labelText: 'Fuel Efficiency (km/L)',
                          hintText: 'e.g., 12.5',
                        ),
                        keyboardType: TextInputType.number,
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) {
                            return 'Please enter fuel efficiency';
                          }
                          final efficiency = double.tryParse(value);
                          if (efficiency == null || efficiency <= 0) {
                            return 'Please enter a valid efficiency';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      // Fuel Type Selection
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Fuel Type',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Row(
                            children: _fuelTypes.map((type) {
                              return Expanded(
                                child: Padding(
                                  padding: const EdgeInsets.only(right: 8),
                                  child: FilterChip(
                                    label: Text(type),
                                    selected: _selectedFuelType == type,
                                    onSelected: (selected) {
                                      if (selected) {
                                        setState(() {
                                          _selectedFuelType = type;
                                        });
                                      }
                                    },
                                  ),
                                ),
                              );
                            }).toList(),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),

            // Footer
            Container(
              padding: const EdgeInsets.all(16),
              decoration: const BoxDecoration(
                border: Border(top: BorderSide(color: Colors.grey, width: 0.5)),
              ),
              child: SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: _saveCar,
                  icon: const Icon(Icons.save),
                  label: Text(widget.car != null ? 'Update Car' : 'Add Car'),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    _makeController.dispose();
    _modelController.dispose();
    _yearController.dispose();
    _efficiencyController.dispose();
    super.dispose();
  }
}