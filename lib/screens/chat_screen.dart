import 'package:flutter/material.dart';

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _messageController = TextEditingController();
  final List<Map<String, dynamic>> _messages = [
    {
      'id': '1',
      'user': 'TrafficBot',
      'message': 'Welcome to the traffic chat! Share updates to help fellow drivers.',
      'timestamp': DateTime.now().subtract(const Duration(minutes: 30)),
      'isOwn': false,
    },
    {
      'id': '2',
      'user': 'Sarah M.',
      'message': 'Heavy traffic at Exit 42, accident in left lane. Expect 15-20 min delays.',
      'timestamp': DateTime.now().subtract(const Duration(minutes: 15)),
      'isOwn': false,
      'isAlert': true,
    },
  ];

  final List<String> _quickAlerts = [
    '🚨 Accident',
    '🚗 Heavy Traffic',
    '🚧 Construction',
    '✅ All Clear',
  ];

  void _sendMessage(String message) {
    if (message.trim().isEmpty) return;

    setState(() {
      _messages.add({
        'id': DateTime.now().millisecondsSinceEpoch.toString(),
        'user': 'You',
        'message': message.trim(),
        'timestamp': DateTime.now(),
        'isOwn': true,
      });
    });

    _messageController.clear();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Traffic Chat'),
        actions: [
          Row(
            children: [
              const Icon(Icons.people, size: 16),
              const SizedBox(width: 4),
              Text(
                '67 online',
                style: Theme.of(context).textTheme.bodySmall,
              ),
              const SizedBox(width: 16),
            ],
          ),
        ],
      ),
      body: Column(
        children: [
          // Room Selector
          Container(
            height: 60,
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              children: [
                _buildRoomChip('Highway 101 North', true, 23),
                _buildRoomChip('Downtown Traffic', false, 45),
                _buildRoomChip('Bay Bridge', false, 67),
                _buildRoomChip('Airport Route', false, 34),
              ],
            ),
          ),

          // Messages
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final message = _messages[index];
                return _buildMessageBubble(message);
              },
            ),
          ),

          // Quick Alerts
          Container(
            height: 50,
            padding: const EdgeInsets.symmetric(vertical: 8),
            decoration: const BoxDecoration(
              color: Colors.white,
              border: Border(top: BorderSide(color: Colors.grey, width: 0.5)),
            ),
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _quickAlerts.length,
              itemBuilder: (context, index) {
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ElevatedButton(
                    onPressed: () => _sendMessage(_quickAlerts[index]),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.grey[100],
                      foregroundColor: Colors.black87,
                      elevation: 0,
                    ),
                    child: Text(_quickAlerts[index]),
                  ),
                );
              },
            ),
          ),

          // Message Input
          Container(
            padding: const EdgeInsets.all(16),
            decoration: const BoxDecoration(
              color: Colors.white,
              border: Border(top: BorderSide(color: Colors.grey, width: 0.5)),
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _messageController,
                    decoration: const InputDecoration(
                      hintText: 'Share traffic updates...',
                      border: OutlineInputBorder(),
                      contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    ),
                    maxLines: null,
                    onSubmitted: _sendMessage,
                  ),
                ),
                const SizedBox(width: 8),
                IconButton(
                  onPressed: () => _sendMessage(_messageController.text),
                  icon: const Icon(Icons.send),
                  style: IconButton.styleFrom(
                    backgroundColor: Theme.of(context).primaryColor,
                    foregroundColor: Colors.white,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRoomChip(String name, bool isActive, int userCount) {
    return Padding(
      padding: const EdgeInsets.only(right: 12),
      child: FilterChip(
        label: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              name,
              style: TextStyle(
                color: isActive ? Colors.white : Colors.black87,
                fontWeight: FontWeight.w600,
                fontSize: 12,
              ),
            ),
            Text(
              '$userCount users',
              style: TextStyle(
                color: isActive ? Colors.white70 : Colors.grey,
                fontSize: 10,
              ),
            ),
          ],
        ),
        selected: isActive,
        onSelected: (selected) {},
        backgroundColor: Colors.grey[100],
        selectedColor: Theme.of(context).primaryColor,
      ),
    );
  }

  Widget _buildMessageBubble(Map<String, dynamic> message) {
    final isOwn = message['isOwn'] ?? false;
    final isAlert = message['isAlert'] ?? false;
    
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        mainAxisAlignment: isOwn ? MainAxisAlignment.end : MainAxisAlignment.start,
        children: [
          Container(
            constraints: BoxConstraints(
              maxWidth: MediaQuery.of(context).size.width * 0.8,
            ),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: isAlert
                  ? Colors.red[50]
                  : isOwn
                      ? Theme.of(context).primaryColor
                      : Colors.grey[100],
              borderRadius: BorderRadius.circular(12),
              border: isAlert ? Border.all(color: Colors.red, width: 2) : null,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    if (isAlert) const Text('🚨 '),
                    Text(
                      message['user'],
                      style: TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: 12,
                        color: isOwn ? Colors.white70 : Colors.grey[600],
                      ),
                    ),
                    const Spacer(),
                    Text(
                      _formatTime(message['timestamp']),
                      style: TextStyle(
                        fontSize: 10,
                        color: isOwn ? Colors.white70 : Colors.grey[500],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  message['message'],
                  style: TextStyle(
                    color: isOwn ? Colors.white : Colors.black87,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  String _formatTime(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);
    
    if (difference.inMinutes < 1) return 'Just now';
    if (difference.inMinutes < 60) return '${difference.inMinutes}m ago';
    if (difference.inHours < 24) return '${difference.inHours}h ago';
    return '${difference.inDays}d ago';
  }
}