import 'package:flutter/material.dart';
import 'package:navifuel/widgets/gas_stations_dialog.dart';
import 'package:navifuel/widgets/emergency_contacts_dialog.dart';

class QuickActionsWidget extends StatelessWidget {
  const QuickActionsWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildActionButton(
            context,
            icon: Icons.local_gas_station,
            label: 'Gas',
            color: Theme.of(context).primaryColor,
            onTap: () {
              showDialog(
                context: context,
                builder: (context) => const GasStationsDialog(),
              );
            },
          ),
          _buildActionButton(
            context,
            icon: Icons.electric_bolt,
            label: 'EV Charge',
            color: const Color(0xFF059669),
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('EV charging stations coming soon!')),
              );
            },
          ),
          _buildActionButton(
            context,
            icon: Icons.report,
            label: 'Report',
            color: const Color(0xFFF59E0B),
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Traffic reporting coming soon!')),
              );
            },
          ),
          _buildActionButton(
            context,
            icon: Icons.phone,
            label: 'Emergency',
            color: const Color(0xFFDC2626),
            onTap: () {
              showDialog(
                context: context,
                builder: (context) => const EmergencyContactsDialog(),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildActionButton(
    BuildContext context, {
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Icon(icon, size: 20, color: color),
          const SizedBox(height: 4),
          Text(
            label,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}