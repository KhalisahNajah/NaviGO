import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:navifuel/providers/app_state.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _voiceNavigation = true;
  bool _autoReroute = true;
  bool _notifications = true;
  bool _locationSharing = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Profile Info Card
            Card(
              margin: const EdgeInsets.all(16),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 30,
                      backgroundColor: Theme.of(context).primaryColor,
                      child: const Icon(
                        Icons.person,
                        size: 32,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(width: 16),
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'John Doe',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          SizedBox(height: 4),
                          Text(
                            'john.doe@example.com',
                            style: TextStyle(
                              color: Colors.grey,
                            ),
                          ),
                        ],
                      ),
                    ),
                    TextButton(
                      onPressed: () {},
                      child: const Text('Edit'),
                    ),
                  ],
                ),
              ),
            ),

            // Statistics Card
            Card(
              margin: const EdgeInsets.symmetric(horizontal: 16),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Your Impact',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 16),
                    const Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _StatItem(
                          icon: Icons.navigation,
                          value: '42',
                          label: 'Trips Saved',
                          color: Color(0xFF2563EB),
                        ),
                        _StatItem(
                          icon: Icons.local_gas_station,
                          value: '\$156',
                          label: 'Fuel Saved',
                          color: Color(0xFF059669),
                        ),
                        _StatItem(
                          icon: Icons.report,
                          value: '8',
                          label: 'Reports',
                          color: Color(0xFFEA580C),
                        ),
                        _StatItem(
                          icon: Icons.star,
                          value: '4.8',
                          label: 'Rating',
                          color: Color(0xFFF59E0B),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 16),

            // Navigation Settings
            _buildSettingsSection(
              'Navigation',
              [
                _buildSwitchTile(
                  'Voice Navigation',
                  'Turn-by-turn voice guidance',
                  Icons.volume_up,
                  _voiceNavigation,
                  (value) => setState(() => _voiceNavigation = value),
                ),
                _buildSwitchTile(
                  'Auto Re-route',
                  'Automatically find better routes',
                  Icons.alt_route,
                  _autoReroute,
                  (value) => setState(() => _autoReroute = value),
                ),
                _buildListTile(
                  'Fuel Preferences',
                  'Currency: ${context.watch<AppState>().selectedCurrency.name}',
                  Icons.local_gas_station,
                  () {},
                ),
              ],
            ),

            // Privacy & Notifications
            _buildSettingsSection(
              'Privacy & Notifications',
              [
                _buildSwitchTile(
                  'Push Notifications',
                  'Traffic alerts and updates',
                  Icons.notifications,
                  _notifications,
                  (value) => setState(() => _notifications = value),
                ),
                _buildSwitchTile(
                  'Location Sharing',
                  'Help improve traffic data',
                  Icons.location_on,
                  _locationSharing,
                  (value) => setState(() => _locationSharing = value),
                ),
                _buildListTile(
                  'Privacy Settings',
                  'Manage your data and privacy',
                  Icons.privacy_tip,
                  () {},
                ),
              ],
            ),

            // Support
            _buildSettingsSection(
              'Support',
              [
                _buildListTile(
                  'Help & FAQ',
                  'Get answers to common questions',
                  Icons.help,
                  () {},
                ),
                _buildListTile(
                  'Contact Support',
                  'Get help from our team',
                  Icons.support_agent,
                  () {},
                ),
                _buildListTile(
                  'Rate the App',
                  'Help us improve with your feedback',
                  Icons.star_rate,
                  () {},
                ),
              ],
            ),

            // Account
            _buildSettingsSection(
              'Account',
              [
                _buildListTile(
                  'App Settings',
                  'Customize your experience',
                  Icons.settings,
                  () {},
                ),
              ],
            ),

            // Logout Button
            Padding(
              padding: const EdgeInsets.all(16),
              child: SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () {
                    showDialog(
                      context: context,
                      builder: (context) => AlertDialog(
                        title: const Text('Logout'),
                        content: const Text('Are you sure you want to logout?'),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.pop(context),
                            child: const Text('Cancel'),
                          ),
                          TextButton(
                            onPressed: () {
                              Navigator.pop(context);
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('Logged out successfully')),
                              );
                            },
                            child: const Text('Logout'),
                          ),
                        ],
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red[50],
                    foregroundColor: Colors.red,
                  ),
                  icon: const Icon(Icons.logout),
                  label: const Text('Logout'),
                ),
              ),
            ),

            // Footer
            const Padding(
              padding: EdgeInsets.all(24),
              child: Column(
                children: [
                  Text(
                    'NaviFuel v1.0.0',
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    'Made with ❤️ for safer roads',
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSettingsSection(String title, List<Widget> children) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Text(
              title,
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          ...children,
        ],
      ),
    );
  }

  Widget _buildSwitchTile(
    String title,
    String subtitle,
    IconData icon,
    bool value,
    ValueChanged<bool> onChanged,
  ) {
    return ListTile(
      leading: Container(
        width: 36,
        height: 36,
        decoration: BoxDecoration(
          color: Theme.of(context).primaryColor.withOpacity(0.1),
          borderRadius: BorderRadius.circular(18),
        ),
        child: Icon(
          icon,
          size: 20,
          color: Theme.of(context).primaryColor,
        ),
      ),
      title: Text(title),
      subtitle: Text(subtitle),
      trailing: Switch(
        value: value,
        onChanged: onChanged,
      ),
    );
  }

  Widget _buildListTile(
    String title,
    String subtitle,
    IconData icon,
    VoidCallback onTap,
  ) {
    return ListTile(
      leading: Container(
        width: 36,
        height: 36,
        decoration: BoxDecoration(
          color: Theme.of(context).primaryColor.withOpacity(0.1),
          borderRadius: BorderRadius.circular(18),
        ),
        child: Icon(
          icon,
          size: 20,
          color: Theme.of(context).primaryColor,
        ),
      ),
      title: Text(title),
      subtitle: Text(subtitle),
      trailing: const Icon(Icons.chevron_right),
      onTap: onTap,
    );
  }
}

class _StatItem extends StatelessWidget {
  final IconData icon;
  final String value;
  final String label;
  final Color color;

  const _StatItem({
    required this.icon,
    required this.value,
    required this.label,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Icon(icon, size: 20, color: color),
        const SizedBox(height: 8),
        Text(
          value,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w700,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: const TextStyle(
            fontSize: 12,
            color: Colors.grey,
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }
}