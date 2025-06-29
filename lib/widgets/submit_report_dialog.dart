import 'package:flutter/material.dart';
import 'package:navifuel/models/traffic_report.dart';

class SubmitReportDialog extends StatefulWidget {
  final Function(TrafficReport) onSubmit;

  const SubmitReportDialog({
    super.key,
    required this.onSubmit,
  });

  @override
  State<SubmitReportDialog> createState() => _SubmitReportDialogState();
}

class _SubmitReportDialogState extends State<SubmitReportDialog> {
  final _formKey = GlobalKey<FormState>();
  final _locationController = TextEditingController();
  final _descriptionController = TextEditingController();
  String? _selectedReportType;

  final List<Map<String, dynamic>> _reportTypes = [
    {
      'id': 'police',
      'name': 'Police',
      'icon': Icons.local_police,
      'color': Color(0xFF3B82F6),
    },
    {
      'id': 'accident',
      'name': 'Accident',
      'icon': Icons.warning,
      'color': Color(0xFFDC2626),
    },
    {
      'id': 'breakdown',
      'name': 'Car Breakdown',
      'icon': Icons.directions_car,
      'color': Color(0xFFEA580C),
    },
    {
      'id': 'roadwork',
      'name': 'Road Work',
      'icon': Icons.construction,
      'color': Color(0xFFF59E0B),
    },
    {
      'id': 'hazard',
      'name': 'Road Hazard',
      'icon': Icons.warning,
      'color': Color(0xFFDC2626),
    },
    {
      'id': 'weather',
      'name': 'Bad Weather',
      'icon': Icons.cloud,
      'color': Color(0xFF6B7280),
    },
    {
      'id': 'closure',
      'name': 'Lane Closure',
      'icon': Icons.construction,
      'color': Color(0xFFF59E0B),
    },
    {
      'id': 'tree',
      'name': 'Fallen Tree',
      'icon': Icons.park,
      'color': Color(0xFF059669),
    },
  ];

  void _submitReport() {
    if (!_formKey.currentState!.validate() || _selectedReportType == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill in all fields')),
      );
      return;
    }

    final reportType = _reportTypes.firstWhere(
      (type) => type['id'] == _selectedReportType,
    );

    final report = TrafficReport(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      type: reportType['name'],
      description: _descriptionController.text.trim(),
      location: _locationController.text.trim(),
      timestamp: DateTime.now(),
    );

    widget.onSubmit(report);
    Navigator.pop(context);
    
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Thank you for helping the community stay informed!'),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      child: Container(
        constraints: const BoxConstraints(maxHeight: 700),
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
                    'Submit Report',
                    style: TextStyle(
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
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'What are you reporting?',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 12),

                      // Report Type Grid
                      GridView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          childAspectRatio: 2.5,
                          crossAxisSpacing: 8,
                          mainAxisSpacing: 8,
                        ),
                        itemCount: _reportTypes.length,
                        itemBuilder: (context, index) {
                          final type = _reportTypes[index];
                          final isSelected = _selectedReportType == type['id'];

                          return GestureDetector(
                            onTap: () {
                              setState(() {
                                _selectedReportType = type['id'];
                              });
                            },
                            child: Container(
                              decoration: BoxDecoration(
                                color: isSelected 
                                    ? Theme.of(context).primaryColor
                                    : const Color(0xFFF9FAFB),
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color: isSelected 
                                      ? Theme.of(context).primaryColor
                                      : Colors.transparent,
                                  width: 2,
                                ),
                              ),
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(
                                    type['icon'],
                                    size: 24,
                                    color: isSelected ? Colors.white : type['color'],
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    type['name'],
                                    style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w500,
                                      color: isSelected ? Colors.white : Colors.black87,
                                    ),
                                    textAlign: TextAlign.center,
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                      const SizedBox(height: 24),

                      // Location Field
                      TextFormField(
                        controller: _locationController,
                        decoration: const InputDecoration(
                          labelText: 'Location',
                          hintText: 'e.g., Highway 401, Exit 394',
                        ),
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) {
                            return 'Please enter the location';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      // Description Field
                      TextFormField(
                        controller: _descriptionController,
                        decoration: const InputDecoration(
                          labelText: 'Description',
                          hintText: 'Provide additional details...',
                        ),
                        maxLines: 4,
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) {
                            return 'Please provide a description';
                          }
                          return null;
                        },
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
                  onPressed: _submitReport,
                  icon: const Icon(Icons.send),
                  label: const Text('Submit Report'),
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
    _locationController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }
}