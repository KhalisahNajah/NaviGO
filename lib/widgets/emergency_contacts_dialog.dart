import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class EmergencyContactsDialog extends StatelessWidget {
  const EmergencyContactsDialog({super.key});

  final List<Map<String, String>> emergencyContacts = const [
    {
      'name': 'Emergency Services',
      'number': '911',
      'icon': '🚨',
    },
    {
      'name': 'Highway Patrol',
      'number': '1-800-HIGHWAY',
      'icon': '👮',
    },
    {
      'name': 'Roadside Assistance',
      'number': '1-800-AAA-HELP',
      'icon': '🔧',
    },
    {
      'name': 'Medical Emergency',
      'number': '1-800-MEDICAL',
      'icon': '🏥',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Dialog(
      child: Container(
        constraints: const BoxConstraints(maxHeight: 400),
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
                    'Emergency Contacts',
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

            // Contacts List
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: emergencyContacts.length,
                itemBuilder: (context, index) {
                  final contact = emergencyContacts[index];
                  return _buildContactCard(context, contact);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildContactCard(BuildContext context, Map<String, String> contact) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        leading: Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            color: Colors.red[50],
            borderRadius: BorderRadius.circular(24),
          ),
          child: Center(
            child: Text(
              contact['icon']!,
              style: const TextStyle(fontSize: 24),
            ),
          ),
        ),
        title: Text(
          contact['name']!,
          style: const TextStyle(
            fontWeight: FontWeight.w600,
          ),
        ),
        subtitle: Text(contact['number']!),
        trailing: const Icon(
          Icons.phone,
          color: Color(0xFF2563EB),
        ),
        onTap: () => _makePhoneCall(context, contact),
      ),
    );
  }

  void _makePhoneCall(BuildContext context, Map<String, String> contact) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Emergency Contact'),
        content: Text('Calling ${contact['name']} at ${contact['number']}'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(context);
              Navigator.pop(context); // Close emergency dialog too
              
              // In a real app, you would make the actual phone call
              final Uri phoneUri = Uri(scheme: 'tel', path: contact['number']);
              if (await canLaunchUrl(phoneUri)) {
                await launchUrl(phoneUri);
              } else {
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Could not make phone call'),
                    ),
                  );
                }
              }
            },
            child: const Text('Call'),
          ),
        ],
      ),
    );
  }
}